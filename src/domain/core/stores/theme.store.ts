import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TThemeMode = 'dark' | 'light';

interface StoreProps {
  mode: TThemeMode;
  isCollapsed: boolean;
}

interface StoreActions {
  setMode: (mode: TThemeMode) => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

type Store = StoreProps & { actions: StoreActions };

const initialState: StoreProps = {
  mode: 'light',
  isCollapsed: false,
};

export const useThemeStore = create<Store>()(
  persist(
    (set) => ({
      ...initialState,
      actions: {
        setMode: (mode) => set({ mode }),
        setIsCollapsed(isCollapsed) {
          set({ isCollapsed });
        },
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      merge(persistedState, currentState) {
        const mergedState = {
          ...(persistedState as StoreProps),
          actions: {
            ...currentState.actions,
          },
        };

        return mergedState;
      },
    }
  )
);
