import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { UsersService } from "users/users.service";
import { Component, Injectable } from "@nestjs/common";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(private readonly usersService: UsersService) {}

    validate(email: string, args: ValidationArguments) {
        return this.usersService.emailExists(email).then(user => !user);
    }

}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
         registerDecorator({
             target: object.constructor,
             propertyName: propertyName,
             options: validationOptions,
             constraints: [],
             validator: IsUserAlreadyExistConstraint
         });
    };
 }