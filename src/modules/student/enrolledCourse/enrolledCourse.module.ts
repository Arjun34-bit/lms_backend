import { Module } from "@nestjs/common";
import { EnrolledCourseController } from "./controllers/enrolledCourse.controller";
import { EnrolledCourseService } from "./services/enrolledCourse.service";



@Module({
    imports: [],
    controllers: [EnrolledCourseController],
    providers: [EnrolledCourseService]
})
export class EnrolledCourseModule {}