import { errorsMsg } from './constants/errors-msg.constant';
import { TSliceConfig } from './types/slice-config.type';
import errorTemplate from './utils/error-template.utli';
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

export default function createSlice<T>(
  params: TSliceConfig<T>,
): TSliceConfig<T> {
  // validate `ssr`
  if (isUndefined(params.ssr)) {
    errorTemplate(errorsMsg.ssr.required);
  } else if (!isBoolean(params.ssr)) {
    errorTemplate(errorsMsg.ssr.invalidType);
  }

  // validate `default`
  if (!params.ssr && isUndefined(params.default)) {
    errorTemplate(errorsMsg.default.required);
  }

  // validate `defaultClient`
  if (params.ssr && isUndefined(params.defaultClient)) {
    errorTemplate(errorsMsg.defaultClient.required);
  }

  // validate `defaultServer`
  if (params.ssr && isUndefined(params.defaultServer)) {
    errorTemplate(errorsMsg.defaultServer.required);
  }

  // validate `key`
  if (isUndefined(params.key)) {
    errorTemplate(errorsMsg.key.required);
  } else if (!isString(params.key)) {
    errorTemplate(errorsMsg.key.invalidType);
  } else if (isEmptyString(params.key)) {
    errorTemplate(errorsMsg.key.empty);
  } else if ((params.key as string).startsWith('slice-')) {
    errorTemplate(errorsMsg.key.startWithSlice);
  } else if ((params.key as string).startsWith('slices-')) {
    errorTemplate(errorsMsg.key.startWithSlices);
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
      !params.ssr &&
      Object.keys(params.events).some(
        (key): boolean =>
          !['onExpire', 'onChange', 'onInitialize'].includes(key),
      )
    ) {
      errorTemplate(errorsMsg.events.keysIsNotValidInSsrFalse);
    } else if (
      params.ssr &&
      Object.keys(params.events).some(
        (key): boolean =>
          ![
            'onExpire',
            'onChange',
            'onInitializeClient',
            'onInitializeServer',
          ].includes(key),
      )
    ) {
      errorTemplate(errorsMsg.events.keysIsNotValidInSsrTrue);
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
  const validKeys = new Set([
    ...(params.ssr ? ['defaultClient', 'defaultServer'] : ['default']),
    'key',
    'ssr',
    'encrypt',
    'expire',
    'schema',
    'reducers',
    'selectors',
    'events',
  ]);

  const notDefinedSliceKey = Object.keys(params).filter(
    (key) => !validKeys.has(key),
  );
  if (notDefinedSliceKey.length > 0) {
    errorTemplate(errorsMsg.other.notDefined(notDefinedSliceKey));
  }

  return params;
}
