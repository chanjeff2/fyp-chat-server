import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter extends BaseExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    switch (exception.code) {
      case 11000:
        // duplicate exception
        super.catch(new BadRequestException(exception.errmsg), host);
    }
  }
}
