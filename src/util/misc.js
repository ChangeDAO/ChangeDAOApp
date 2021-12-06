import { isObject } from "lodash";

export const deepFreeze = object => {
  const keys = Object.getOwnPropertyNames(object);

  for (const key of keys) {
    const value = object[key];

    if (value && isObject(value)) {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
};
