import { errorsMsg } from './constants/errors-msg.constant';
import { TConfig } from './types/config.type';
import errorTemplate from './utils/error-template.utli';
import {
  isBoolean,
  isEmptyObject,
  isEmptyString,
  isFunction,
  isObject,
  isString,
  isUndefined,
} from './utils/type-guards.util';

export default function createSlice<TSlice>(
  params: TConfig<TSlice>,
): TConfig<TSlice> {
  // validate `ssr`
  if (!isUndefined(params.ssr) && !isBoolean(params.ssr)) {
    errorTemplate({
      msg: errorsMsg.ssr.invalidType,
      key: params.key,
    });
  }

  // validate `default`
  if (!params.ssr && isUndefined(params.default)) {
    errorTemplate({
      msg: errorsMsg.default.required,
      key: params.key,
    });
  }

  // validate `defaultClient`
  if (params.ssr && isUndefined(params.defaultClient)) {
    errorTemplate({
      msg: errorsMsg.defaultClient.required,
      key: params.key,
    });
  }

  // validate `defaultServer`
  if (params.ssr && isUndefined(params.defaultServer)) {
    errorTemplate({
      msg: errorsMsg.defaultServer.required,
      key: params.key,
    });
  }

  // validate `key`
  if (isUndefined(params.key)) {
    errorTemplate({
      msg: errorsMsg.key.required,
      key: params.key,
    });
  } else if (!isString(params.key)) {
    errorTemplate({
      msg: errorsMsg.key.invalidType,
      key: params.key,
    });
  } else if (isEmptyString(params.key)) {
    errorTemplate({
      msg: errorsMsg.key.empty,
      key: params.key,
    });
  } else if ((params.key as string).startsWith('slice-')) {
    errorTemplate({
      msg: errorsMsg.key.startWithSlice,
      key: params.key,
    });
  } else if ((params.key as string).startsWith('slices-')) {
    errorTemplate({
      msg: errorsMsg.key.startWithSlices,
      key: params.key,
    });
  }

  // validate `encrypt`
  if (!isUndefined(params.encrypt) && !isBoolean(params.encrypt)) {
    errorTemplate({
      msg: errorsMsg.encrypt.invalidType,
      key: params.key,
    });
  }

  // validate `expire`
  if (!isUndefined(params.expire) && !/^\d+h-\d+m-\d+s$/.test(params.expire)) {
    errorTemplate({
      msg: errorsMsg.expire.invalidFormat,
      key: params.key,
    });
  }

  // validate `reducers`
  if (!isUndefined(params.reducers)) {
    if (!isObject(params.reducers)) {
      errorTemplate({
        msg: errorsMsg.reducers.invalidType,
        key: params.key,
      });
    } else if (isEmptyObject(params.reducers)) {
      errorTemplate({
        msg: errorsMsg.reducers.empty,
        key: params.key,
      });
    } else if (
      Object.keys(params.reducers).some(
        (key): boolean => !isFunction(params.reducers![key]),
      )
    ) {
      errorTemplate({
        msg: errorsMsg.reducers.keysValueIsNotFunction,
        key: params.key,
      });
    }
  }

  // validate `selectors`
  if (!isUndefined(params.selectors)) {
    if (!isObject(params.selectors)) {
      errorTemplate({
        msg: errorsMsg.selectors.invalidType,
        key: params.key,
      });
    } else if (isEmptyObject(params.selectors)) {
      errorTemplate({
        msg: errorsMsg.selectors.empty,
        key: params.key,
      });
    } else if (
      Object.keys(params.selectors).some(
        (key): boolean => !isFunction(params.selectors![key]),
      )
    ) {
      errorTemplate({
        msg: errorsMsg.selectors.keysValueIsNotFunction,
        key: params.key,
      });
    }
  }

  // validate `events`
  if (!isUndefined(params.events)) {
    if (!isObject(params.events)) {
      errorTemplate({
        msg: errorsMsg.events.invalidType,
        key: params.key,
      });
    } else if (isEmptyObject(params.events)) {
      errorTemplate({
        msg: errorsMsg.events.empty,
        key: params.key,
      });
    } else if (
      Object.keys(params.events).some(
        (key): boolean => !['onExpire', 'onChange'].includes(key),
      )
    ) {
      errorTemplate({
        msg: errorsMsg.events.keysIsNotValid,
        key: params.key,
      });
    } else if (
      Object.keys(params.events).some(
        (key): boolean =>
          !isFunction(params.events![key as typeof params.events]),
      )
    ) {
      errorTemplate({
        msg: errorsMsg.events.keysValueIsNotFunction,
        key: params.key,
      });
    }
  }

  // validate `schema`
  if (!isUndefined(params.schema) && !isFunction(params.schema?.parse)) {
    errorTemplate({
      msg: errorsMsg.schema.invalidType,
      key: params.key,
    });
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
    errorTemplate({
      msg: errorsMsg.other.notDefined(notDefinedSliceKey),
      key: params.key,
    });
  }

  return params;
}
