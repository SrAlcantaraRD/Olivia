import { create } from 'zustand';

type StoreProps = {
  [entity: string]: {
    items: unknown[];
    listLoaded: boolean;
    isLoading: boolean;
  };
};

interface StoreActions {
  saveItems: <T>(entity: string, items: T[]) => void;
  getItems: <T>(entity: string) => T[];
  startLoading: (entity: string) => void;
  stopLoading: (entity: string) => void;
  isLoading: (entity: string) => boolean;
  clearStore: (entity: string) => void;
}

type Store = {
  state: StoreProps;
  actions: StoreActions;
};

const initialState: StoreProps = {};

const ownStore = create<Store>((set, get) => ({
  state: initialState,
  actions: {
    isLoading: (storeName: string) => {
      return get().state[storeName]?.isLoading || false;
    },
    stopLoading: (storeName: string) => {
      set((state) => ({
        state: {
          ...state.state,
          [storeName]: {
            ...(state.state[storeName] || {
              items: [],
              listLoaded: false,
            }),
            isLoading: false,
          },
        },
      }));
    },
    startLoading: (storeName: string) => {
      set((state) => ({
        state: {
          ...state.state,
          [storeName]: {
            ...(state.state[storeName] || {
              items: [],
              listLoaded: false,
            }),
            isLoading: true,
          },
        },
      }));
    },
    saveItems: <T>(storeName: string, items: T[]) =>
      set((state) => ({
        state: {
          ...state.state,
          [storeName]: { items, listLoaded: true, isLoading: false },
        },
      })),
    getItems: <T>(storeName: string) =>
      (get().state[storeName]?.items || []) as T[],
    clearStore: (storeName: string) =>
      set((state) => {
        const { [storeName]: _, ...rest } = state.state;

        return { state: rest };
      }),
  },
}));

export const useListStore = <T>(storeName: string) => {
  const store = ownStore();

  return {
    items: (store.state[storeName]?.items || []) as T[],
    isLoading: store.state[storeName]?.isLoading ?? false,
    actions: {
      saveItems: (items: T[]) => store.actions.saveItems<T>(storeName, items),
      getItems: () => store.actions.getItems<T>(storeName),
      clearStore: () => store.actions.clearStore(storeName),
      isLoading: () => store.actions.isLoading(storeName),
      startLoading: () => store.actions.startLoading(storeName),
      stopLoading: () => store.actions.stopLoading(storeName),
    },
  };
};
