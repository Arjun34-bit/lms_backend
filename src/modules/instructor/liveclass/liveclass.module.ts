import { Module } from "@nestjs/common";
import { LiveClassController } from "./controllers/liveclass.controller";
import { LiveClassService } from "./service/liveclass.service";


@Module({
    imports: [],
    controllers: [LiveClassController],
    providers: [LiveClassService]
})
export class LiveClassModule {}