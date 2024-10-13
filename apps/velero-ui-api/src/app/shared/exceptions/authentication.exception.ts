import {HttpException, HttpExceptionOptions, HttpStatus} from '@nestjs/common';

export class AuthenticationException extends HttpException {
  constructor(public readonly objectOrError: string | object | any, options?: HttpExceptionOptions) {
    super(objectOrError ? objectOrError : AuthenticationException.name, HttpStatus.UNAUTHORIZED, options);
  }
}
