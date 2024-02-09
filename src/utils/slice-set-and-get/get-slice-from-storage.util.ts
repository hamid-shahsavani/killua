import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import { decryptStorageData } from '../cryptography/decrypt-storage-data.util';
import { defaultSliceValue } from '../other/default-slice-value.util';
import { generateSliceStorageKey } from '../other/generate-slice-storage-key.util';
import { getSaltKeyFromStorage } from '../cryptography/get-salt-key-from-storage.util';
import { schemaValidation } from '../slice-schema-validation/schema-validation.util';
import { ensureExistAllRequiredKeysInStorage } from '../other/ensure-exist-all-required-keys-in-storage.util';
import { isAvailableCsr } from '../other/is-available-csr.util';
import { isConfigSsr } from '../other/is-config-ssr.util';

export function getSliceFromStorage<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): GSlice {
  // storage key
  const storageKey = generateSliceStorageKey({
    key: params.config.key
  });

  // check schema validation
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
  if (isAvailableCsr()) {
    ensureExistAllRequiredKeysInStorage({
      config: params.config
    });
  }

  // get value from storage
  const getFromStorage = (): GSlice => {
    const storageValue: string | null = localStorage.getItem(storageKey);
    let returnValue: GSlice = defaultSliceValue({
      config: params.config
    }).client;
    // set storage value to `returnValue` (if data encrypted ? decrypt : JSON.parse)
    if (storageValue) {
      try {
        // set storage value to `returnValue`
        if (params.config.encrypt) {
          returnValue = decryptStorageData({
            data: storageValue,
            saltKey: getSaltKeyFromStorage()
          });
        } else {
          returnValue = JSON.parse(storageValue);
        }
        // validate `returnValue` with schema
        schemaValidation({
          data: returnValue,
          config: params.config
        });
      } catch (error: any) {
        // schema validation fail || JSON.parse fail || decrypt fail ===> set `defaultSliceValue.client` to `returnValue` | remove slice key from storage
        localStorage.removeItem(
          generateSliceStorageKey({
            key: params.config.key
          })
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
