import { errorsMsg } from './constants/errors-msg.constant';
import { TSlice } from './types/slice.type';
import { errorTemplate } from './utils/error-template.utli';
import {
  isBoolean,
  isEmptyObject,
  isEmptyString,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from './utils/type-guards.util';

export default function createSlice<T>(params: TSlice<T>): TSlice<T> {
  // validate `default`
  if (isUndefined(params.default)) {
    errorTemplate(errorsMsg.default.required);
  }

  // validate `key`
  if (isUndefined(params.key)) {
    errorTemplate(errorsMsg.key.required);
  } else if (!isString(params.key)) {
    errorTemplate(errorsMsg.key.invalidType);
  } else if (isEmptyString(params.key)) {
    errorTemplate(errorsMsg.key.empty);
  } else if ((params.key as string).startsWith('slice')) {
    errorTemplate(errorsMsg.key.startWithSlice);
  }

  // validate `encrypt`
  if (isUndefined(params.encrypt)) {
    errorTemplate(errorsMsg.encrypt.required);
  } else if (!isBoolean(params.encrypt)) {
    errorTemplate(errorsMsg.encrypt.invalidType);
  }

  // validate `expire`
  if (isUndefined(params.expire)) {
    errorTemplate(errorsMsg.expire.required);
  } else if (!isNull(params.expire) && !isNumber(params.expire)) {
    errorTemplate(errorsMsg.expire.invalidType);
  }

  // validate `reducers`
  if (!isUndefined(params.reducers)) {
    if (!isObject(params.reducers)) {
      errorTemplate(errorsMsg.reducers.invalidType);
    } else if (isEmptyObject(params.reducers)) {
      errorTemplate(errorsMsg.reducers.empty);
    } else if (
      Object.keys(params.reducers).some(
        (key): boolean => !isFunction(params.reducers![key]),
      )
    ) {
      errorTemplate(errorsMsg.reducers.keysValueIsNotFunction);
    }
  }

  // validate `selectors`
  if (!isUndefined(params.selectors)) {
    if (!isObject(params.selectors)) {
      errorTemplate(errorsMsg.selectors.invalidType);
    } else if (isEmptyObject(params.selectors)) {
      errorTemplate(errorsMsg.selectors.empty);
    } else if (
      Object.keys(params.selectors).some(
        (key): boolean => !isFunction(params.selectors![key]),
      )
    ) {
      errorTemplate(errorsMsg.selectors.keysValueIsNotFunction);
    }
  }

  // validate `events`
  if (!isUndefined(params.events)) {
    if (!isObject(params.events)) {
      errorTemplate(errorsMsg.events.invalidType);
    } else if (isEmptyObject(params.events)) {
      errorTemplate(errorsMsg.events.empty);
    } else if (
      Object.keys(params.events).some(
        (key): boolean =>
          !['onExpire', 'onInitialize', 'onChange'].includes(key),
      )
    ) {
      errorTemplate(errorsMsg.events.keysIsNotOnInitializeOrOnChangeOrOnExpire);
    } else if (
      Object.keys(params.events).some(
        (key): boolean =>
          !isFunction(params.events![key as typeof params.events]),
      )
    ) {
      errorTemplate(errorsMsg.events.keysValueIsNotFunction);
    }
  }

  // validate `schema`
  if (!isUndefined(params.schema) && !isObject(params.schema)) {
    errorTemplate(errorsMsg.schema.invalidType);
  }

  // validate other keys
  const notDefinedSliceKey = Object.keys(params).filter(
    (key: string): boolean =>
      ![
        'key',
        'default',
        'encrypt',
        'expire',
        'schema',
        'reducers',
        'selectors',
        'events',
      ].includes(key),
  );
  if (notDefinedSliceKey.length > 0) {
    errorTemplate(errorsMsg.other.notDefined(notDefinedSliceKey));
  }

  return params;
}
