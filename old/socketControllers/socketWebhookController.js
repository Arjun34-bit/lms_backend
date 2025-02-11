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
    socket.on("joinInstructor", async ({ classId, role }) => {
      console.log("instructor join", classId, role)
      if (role === "instructor") {
        await redis.set(`instructor:${classId}`, socket.id);
        socket.join(classId);
        console.log(classId, "classId");
        io.to(socket.id).emit("joinInstructorResponse", {
          message: `You have joined the class ${classId}`,
          classId,
        });
      }
    });

    // When a student tries to join the meeting
    socket.on("joinStudent", async (data) => {
      const { userId, name, role, classId } = data;
      // If student, notify teacher for approval
      if (role === "student") {
        await redis.hset(
          `student:${classId}`,
          userId,
          JSON.stringify({ name, socketId: socket.id })
        );
        socket.join(classId);
        console.log(`studentId: ${userId} has joined`);
        // Notify student's join to class room
        io.to(classId).emit("joinStudentResponse", {
          message: `${name} have joined the class.`,
          classId,
          studentSocketId: socket?.id,
        });
      }
    });

    // exchange video steams
    socket.on("signal", (data) => {
      const { userId, signal } = data;
      // Broadcast the signal to the specific user
      socket.to(userId).emit("signal", { userId: socket.id, signal });
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

      // Check if the disconnected user is a student
      const classKeys = await redis.keys("students:*");
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
