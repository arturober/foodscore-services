import { EntityProperty, Platform, Type } from '@mikro-orm/core';

export class StringArrayType extends Type<
  string[] | undefined,
  string | undefined
> {
  convertToDatabaseValue(
    value: string[] | undefined,
    platform: Platform,
  ): string {
    if (value instanceof Array) {
      return value.join(',');
    }

    return value as string;
  }

  convertToJSValue(value: string | undefined, platform: Platform): string[] {
    if (value) {
      return value.split(',');
    }

    return [];
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `varchar(${prop.length})`;
  }
}
