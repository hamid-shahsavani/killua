import {
  TConfig,
  TDefaultServer,
  TReducers,
  TSelectors
} from '../../types/config.type';
import { getSliceFromStorage } from './get-slice-from-storage.util';
import { errorTemplate } from '../other/error-template.utli';
import { errorMessages } from '../../constants/error-messages.constant';
import { defaultSliceValue } from '../other/default-slice-value.util';
import { isAvailableCsr } from '../other/is-available-csr.util';
import { isConfigSsr } from '../other/is-config-ssr.util';

export function getSliceValue<
  GSlice,
  GDefaultServer extends TDefaultServer<GSlice>,
  GSelectors extends TSelectors<GSlice>,
  GReducers extends TReducers<GSlice>
>(params: {
  config: TConfig<GSlice, GDefaultServer, GSelectors, GReducers>;
}): GSlice {
  {
    if (
      isConfigSsr({
        config: params.config
      })
    ) {
      return defaultSliceValue({ config: params.config }).server!;
    } else {
      // `is-config-ssr` is `false` and application is server-side ===> throw error
      if (!isAvailableCsr()) {
        errorTemplate({
          msg: errorMessages.defaultServer.required,
          key: params.config.key
        });
      } else {
        // `is-config-ssr` is `false` and application is client-side ===> return slice value from storage
        return getSliceFromStorage({
          config: params.config
        });
      }
    }
  }
}
