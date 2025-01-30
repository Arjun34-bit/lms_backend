import {
  Controller,
  Get,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { envConstant } from './constants';

@Controller()
export class AppController {
  @Get()
  index(@Res() res: Response) {
    return res.send(
      `
        <body style="background-color: #1b1b32; color: #fff;">
            <h1 style="font-family: sans-serif;"> Running on Port: ${envConstant.PORT} </h1>
        </body>
        `,
    );
  }
}
