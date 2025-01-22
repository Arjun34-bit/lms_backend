const socketIo = require("socket.io");
const Redis = require("ioredis");

const redis = new Redis();

exports.socketWebhookController = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  // Handle user connections
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle the instructor connection
    socket.on("joinInstructor", async ({ classId }) => {
      await redis.set(`instructor:${classId}`, socket.id);
      socket.join(classId);

      io.to(socket.id).emit("joinInstructorResponse", {
        message: `You have joined the class ${classId}`,
      });
    });

    // When a student tries to join the meeting
    socket.on("joinMeetingRequest", async (data) => {
      const { userId, name, role, classId } = data;

      // If student, notify teacher for approval
      if (role === "student") {
        await redis.hset(
          `pendingStudents:${classId}`,
          userId,
          JSON.stringify({ name, socketId: socket.id })
        );

        // Notify the instructor of this class
        const instructorSocketId = await redis.get(`instructor:${classId}`);
        if (instructorSocketId) {
          io.to(instructorSocketId).emit("studentJoinRequest", {
            name,
            classId,
            userId,
          });
        }
      }
    });

    // for handeling students join request approval
    socket.on("approveStudent", async ({ studentId, classId }) => {
      // Get student details from Redis
      const studentData = await redis.hget(
        `pendingStudents:${classId}`,
        studentId
      );
      if (studentData) {
        const { name, socketId } = JSON.parse(studentData);

        // Notify the student that they are approved
        io.to(socketId).emit("studentApproved", {
          message: `You are approved to join class ${classId}`,
        });

        // Remove the student from pending list in Redis
        await redis.hdel(`pendingStudents:${classId}`, studentId);

        // Broadcast to the class that the student has joined
        io.to(classId).emit("userJoined", { name, classId });
      }
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);

      // Check if the disconnected user is an instructor
      const keys = await redis.keys("instructor:*");
      for (const key of keys) {
        const instructorSocketId = await redis.get(key);
        if (instructorSocketId === socket.id) {
          // Remove the instructor entry
          await redis.del(key);
          break;
        }
      }

      // Check if the disconnected user is a pending student
      const classKeys = await redis.keys("pendingStudents:*");
      for (const classKey of classKeys) {
        const students = await redis.hgetall(classKey);
        for (const [studentId, studentData] of Object.entries(students)) {
          const { socketId } = JSON.parse(studentData);
          if (socketId === socket.id) {
            // Remove the student entry
            await redis.hdel(classKey, studentId);
            break;
          }
        }
      }
    });
  });
};
