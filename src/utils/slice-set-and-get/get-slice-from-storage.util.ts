import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import { defaultSliceValue } from '../other/default-slice-value.util';
import { schemaValidation } from '../slice-schema-validation/schema-validation.util';
import { ensureExistAllRequiredKeysInStorage } from '../other/ensure-exist-all-required-keys-in-storage.util';
import { isConfigSsr } from '../other/is-config-ssr.util';
import { setSliceConfigChecksumToStorage } from '../detect-slice-config-change/set-slice-config-checksum-to-storage.util';
import { generateSliceConfigChecksum } from '../detect-slice-config-change/generate-slice-config-checksum.util';
import { getSliceConfigChecksumFromStorage } from '../detect-slice-config-change/get-slice-config-checksum-from-storage.util';
import { getSliceExpireTimestampFromStorage } from '../slice-expire-timer/get-slice-expire-timestamp-from-storage.util';
import { generateSliceStorageKey } from '../other/generate-slices-storage-key.util';

export function getSliceFromStorage<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): GSlice {
  // check schema validation (schema validation fail ===> throw error)
  if (isConfigSsr({ config: params.config })) {
    schemaValidation({
      data: defaultSliceValue({
        config: params.config
      }).server!,
      config: params.config
    });
  }
  schemaValidation({
    data: defaultSliceValue({
      config: params.config
    }).client,
    config: params.config
  });

  // check all required keys is in storage
  ensureExistAllRequiredKeysInStorage({
    config: params.config
  });

  // detect is-changed slice config by developer
  const sliceConfigChecksumFromStorage = getSliceConfigChecksumFromStorage({
    config: params.config
  });
  const currentSliceConfigChecksum = generateSliceConfigChecksum({
    config: params.config
  });
  if (sliceConfigChecksumFromStorage !== currentSliceConfigChecksum) {
    setSliceConfigChecksumToStorage({
      config: params.config
    });
    localStorage.removeItem(
      generateSliceStorageKey({ key: params.config.key })
    );
  }

  // get value from storage
  const getFromStorage = (): GSlice => {
    const storageValue: string | null = localStorage.getItem(
      generateSliceStorageKey({ key: params.config.key })
    );
    let returnValue: GSlice = defaultSliceValue({
      config: params.config
    }).client;
    // set storage value to `returnValue` (if data encrypted ? decrypt : JSON.parse)
    if (storageValue) {
      try {
        // set storage value to `returnValue`
        if (params.config.obfuscate) {
          returnValue = JSON.parse(atob(storageValue));
        } else {
          returnValue = JSON.parse(storageValue);
        }
        // validate `returnValue` with schema
        schemaValidation({
          data: returnValue,
          config: params.config
        });
        // check is-expire slice
        if (
          params.config.expire &&
          defaultSliceValue({ config: params.config }).client !== returnValue
        ) {
          const sliceExpireTimestamp = getSliceExpireTimestampFromStorage({
            config: params.config
          });
          if (Number(sliceExpireTimestamp) < Date.now()) {
            throw new Error('slice is expired'); // for catch block
          }
        }
      } catch (error: any) {
        // schema validation fail || JSON.parse fail || decrypt fail ===> set `defaultSliceValue.client` to `returnValue` | remove slice key from storage
        localStorage.removeItem(
          generateSliceStorageKey({ key: params.config.key })
        );
        return defaultSliceValue({
          config: params.config
        }).client;
      }
    }
    return returnValue;
  };

  // return value
  return getFromStorage();
}
