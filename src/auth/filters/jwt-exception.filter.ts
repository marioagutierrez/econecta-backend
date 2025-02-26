import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Catch(JsonWebTokenError, TokenExpiredError, UnauthorizedException)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: JsonWebTokenError | TokenExpiredError | UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof TokenExpiredError) {
      return response.status(401).json({
        statusCode: 401,
        message: 'Sesión vencida',
        error: 'Unauthorized'
      });
    }

    return response.status(401).json({
      statusCode: 401,
      message: 'Token inválido',
      error: 'Unauthorized'
    });
  }
} 