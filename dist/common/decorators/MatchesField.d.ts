import { ValidationOptions } from 'class-validator';
export declare function MatchesField(property: string, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
