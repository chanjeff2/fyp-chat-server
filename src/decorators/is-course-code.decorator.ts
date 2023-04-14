import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const IsCourseCode =
  (validationOptions?: ValidationOptions) =>
  (object: Object, propertyName: string) =>
    registerDecorator({
      name: 'IsCourseCode',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'not a valid course code format',
        ...validationOptions,
      },
      validator: {
        validate: (value: any, args: ValidationArguments) => {
          if (typeof value !== 'string') {
            return false;
          }
          const courseCode = value.toUpperCase();
          const courseCodeRegex = /^[A-Z]{4}\d{4}[A-Z]?$/;
          const valid = courseCodeRegex.test(courseCode);
          return valid;
        },
      },
    });
