import { TTheme } from '@/types/theme.type';
import { slice } from 'killua';

export const themeSlice = slice({
  key: 'theme',
  defaultClient: 'system' as TTheme
});
