import { themeSlice } from './slices/theme';
import { useKillua } from 'killua';
import { TTheme } from './types/theme.type';
import { useEffect } from 'react';

function App() {
  const localStorageTheme = useKillua(themeSlice);

  // set theme on mount
  useEffect(() => {
    document.documentElement.dataset['theme'] =
      localStorageTheme.get() === 'system' ? 'dark' : localStorageTheme.get();
  }, [localStorageTheme.get]);

  // change theme
  const changeThemeHandler = (theme: TTheme) => {
    themeSlice.set(theme);
    document.documentElement.dataset['theme'] =
      theme === 'system' ? 'dark' : theme;
  };

  return (
    <section className="h-screen w-screen overflow-hidden flex justify-center items-center">
      <div className="w-fit border-gradient">
        <div className="bg-black space-x-2 py-2 px-3 rounded-lg font-medium text-sm text-white">
          {['dark', 'system', 'light'].map(item => {
            return (
              <button
                key={item}
                className={`px-3 py-[5px] rounded-md ${
                  localStorageTheme.get() === item
                    ? 'bg-white text-black'
                    : 'bg-black text-white'
                }`}
                onClick={() => changeThemeHandler(item as TTheme)}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default App;
