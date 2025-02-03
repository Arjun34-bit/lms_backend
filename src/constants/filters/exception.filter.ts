import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  ForbiddenException,
  UnauthorizedException,
  BadGatewayException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { Response as ApiResponse } from '@utils/utils.service';
import { ApiResponseT } from '@utils/types';

export class BadRequestError extends Error {
  message: string;
  error: any[];
  data: object;
  http_status_code: number = HttpStatus.BAD_REQUEST;

  constructor(message: string = 'Invalid Request', error: any[] = []) {
    super();
    this.message = message;
    this.error = error;
  }
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let message: string = exception['response']['message'] || 'Invalid Request';
    let error = [message];

    if (message && typeof message === 'object') {
      message = exception['response']['message'][0];
      error = exception['response']['message'];
    }

    const response_structure: ApiResponseT = new ApiResponse({
      data: null,
      message,
      error,
    }).freeze();

    return response.status(status).json(response_structure);
  }
}

@Catch(InternalServerErrorException)
export class InternalServerExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception['response']['message'] || 'Internal Server Error';
    const response_structure: ApiResponseT = new ApiResponse({
      data: null,
      message,
      error: [message],
    }).freeze();

    return response.status(status).json(response_structure);
  }
}

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number = exception.getStatus() || HttpStatus.FORBIDDEN;
    const errors = exception['response']['message'];
    const data = null;
    const message = 'You do not have permission to access';
    const response_structure: ApiResponseT = new ApiResponse({
      data,
      message,
      error: [errors],
    }).freeze();

    return response.status(status).json(response_structure);
  }
}

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number = exception.getStatus() || HttpStatus.UNAUTHORIZED;
    const errors = exception['response']['message'];
    const data = null;
    const message =
      exception['response']['message'] || 'You are not authorized to access';
    const response_structure: ApiResponseT = new ApiResponse({
      data,
      message,
      error: [errors],
    }).freeze();
    return response.status(status).json(response_structure);
  }
}

@Catch(BadGatewayException)
export class BadGatewayExceptionFilter implements ExceptionFilter {
  catch(exception: BadGatewayException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number = exception.getStatus() || HttpStatus.BAD_GATEWAY;
    const errors = exception['response']['message'];
    const data = null;
    const message = 'Service is down or unreachable';
    const response_structure: ApiResponseT = new ApiResponse({
      data,
      message,
      error: [errors],
    }).freeze();

    return response.status(status).json(response_structure);
  }
}
