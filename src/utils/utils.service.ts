import { Injectable } from '@nestjs/common';
import { ApiResponse as ApiResponseInterface } from './interfaces';
import { ApiPaginationResponseT, ApiResponseT } from './types';

export class Response implements ApiResponseInterface {
  redirect(arg0: string) {
    throw new Error('Method not implemented.');
  }
  /**
   * Standard Response Builder Implementation
   * @param partial
   *
   * @@Warning : must use .freeze() on instances of this class before use.
   */

  constructor(partial: Partial<Response>) {
    Object.assign(this, partial);
    Object.keys(this).forEach((prop) => {
      const v = `${prop}_validator`;
      if (v in this) {
        this[v]();
      }
    });
  }

  readonly data: object | null;
  readonly message: string;
  readonly error: object | null;

  freeze() {
    return Object.freeze(this);
  }
}

@Injectable()
export class ApiUtilsService {
  constructor() {}

  make_response(
    data: object | null,
    message: string = 'Successful',
    error: object | null = [],
  ): ApiResponseT {
    /**
     * Response Builder utility
     */
    return new Response({
      data,
      message,
      error,
    }).freeze();
  }

  make_pagination_response(
    data: object | null,
    totalCount: number,
    limit?: number,
    message: string = 'Successful',
    error: object | null = [],
  ): ApiPaginationResponseT {
    /**
     * Response Builder utility
     */
    return Object.freeze({
      data,
      pagination: {
        totalCount: totalCount,
        totalPages: limit ? Math.ceil(totalCount / limit): 0,
        limit,
      },
      message,
      error,
    });
  }
}
