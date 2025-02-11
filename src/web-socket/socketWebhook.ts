import { Server, Socket } from "socket.io";
import { Redis } from "ioredis";

const redis = new Redis();

export const socketWebhookController = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  // Handle user connections
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    // Handle the instructor connection
    socket.on("joinInstructor", async ({ classId, role }) => {
      if (role === "instructor") {
        await redis.set(`instructor:${classId}`, socket.id);
        socket.join(classId);
        console.log(`Instructor joined class: ${classId}`);
        io.to(socket.id).emit("joinInstructorResponse", {
          message: `You have joined the class ${classId}`,
          classId,
        });
      }
    });

    // When a student tries to join the meeting
    socket.on("joinStudent", async (data: any) => {
      try {
        const { userId, name, role, classId } = data;
        if (role === "student") {
          await redis.hset(
            `student:${classId}`,
            userId,
            JSON.stringify({ name, socketId: socket.id })
          );
          socket.join(classId);
          console.log(`Student ${name} (ID: ${userId}) joined class ${classId}`);

          // Notify the class that a student has joined
          io.to(classId).emit("joinStudentResponse", {
            message: `${name} has joined the class.`,
            classId,
            studentSocketId: socket.id,
          });
        }
      } catch (error) {
        console.error("Error in joinStudent:", error);
      }
    });

    // Exchange video streams
    socket.on("signal", (data: any) => {
      const { userId, signal } = data;
      io.to(userId).emit("signal", { userId: socket.id, signal });
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);

      try {
        // Check if the disconnected user is an instructor
        const instructorKeys = await redis.keys("instructor:*");
        await Promise.all(
          instructorKeys.map(async (key) => {
            const instructorSocketId = await redis.get(key);
            if (instructorSocketId === socket.id) {
              await redis.del(key);
              console.log(`Instructor removed: ${key}`);
            }
          })
        );

        // Check if the disconnected user is a student
        const studentKeys = await redis.keys("student:*");
        await Promise.all(
          studentKeys.map(async (classKey) => {
            const students = await redis.hgetall(classKey);
            for (const [studentId, studentData] of Object.entries(students)) {
              try {
                const parsedData = JSON.parse(studentData);
                if (parsedData.socketId === socket.id) {
                  await redis.hdel(classKey, studentId);
                  console.log(`Student removed: ${studentId} from class ${classKey}`);
                  break;
                }
              } catch (error) {
                console.error(`Error parsing student data: ${studentData}`, error);
              }
            }
          })
        );
      } catch (error) {
        console.error("Error in disconnect handler:", error);
      }
    });
  });
};
