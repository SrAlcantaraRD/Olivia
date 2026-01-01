import { create } from 'zustand';

export type StoreEntryID = string;

export type StoreEntry<T> = {
  item: T;
  isLoading: boolean;
  wasLoaded: boolean;
};

type StoreState<T> = {
  [storeName: string]: {
    [id: StoreEntryID]: StoreEntry<T>;
  };
};

interface StoreActions<T> {
  saveItem: (storeName: string, id: StoreEntryID, item: T) => void;
  getItem: (storeName: string, id: StoreEntryID) => T | null;
  removeItem: (storeName: string, id: StoreEntryID) => void;
  startLoading: (storeName: string, id: StoreEntryID) => void;
  stopLoading: (storeName: string, id: StoreEntryID) => void;
  isLoading: (storeName: string, id: StoreEntryID) => boolean;
  wasLoaded: (storeName: string, id: StoreEntryID) => boolean;
  clearStore: (storeName: string) => void;
}

type Store<T> = {
  state: StoreState<T>;
  actions: StoreActions<T>;
};

const ownStore = create<Store<unknown>>((set, get) => ({
  state: {},
  actions: {
    saveItem: (storeName, id, item) => {
      set((state) => ({
        state: {
          ...state.state,
          [storeName]: {
            ...(state.state[storeName] || {}),
            [id]: {
              item,
              isLoading: false,
              wasLoaded: true,
            },
          },
        },
      }));
    },
    getItem: (storeName, id) => {
      const entry = get().state[storeName]?.[id];

      if (!entry) {
        return null;
      }

      return entry.item;
    },
    removeItem: (storeName, id) => {
      set((state) => {
        const store = state.state[storeName];

        if (!store || !store[id]) {
          return state;
        }

        const { [id]: _, ...rest } = store;

        return {
          state: {
            ...state.state,
            [storeName]: rest,
          },
        };
      });
    },
    startLoading: (storeName, id) => {
      set((state) => {
        const entry = state.state[storeName]?.[id];

        return {
          state: {
            ...state.state,
            [storeName]: {
              ...(state.state[storeName] || {}),
              [id]: {
                item: entry?.item ?? {},
                isLoading: true,
                wasLoaded: entry?.wasLoaded ?? false,
              },
            },
          },
        };
      });
    },
    stopLoading: (storeName, id) => {
      set((state) => {
        const entry = state.state[storeName]?.[id];

        if (!entry) {
          return state;
        }

        return {
          state: {
            ...state.state,
            [storeName]: {
              ...(state.state[storeName] || {}),
              [id]: {
                item: entry.item,
                isLoading: false,
                wasLoaded: entry.wasLoaded ?? false,
              },
            },
          },
        };
      });
    },
    isLoading: (storeName, id) => {
      return get().state[storeName]?.[id]?.isLoading ?? false;
    },
    wasLoaded: (storeName, id) => {
      return get().state[storeName]?.[id]?.wasLoaded ?? false;
    },
    clearStore: (storeName) => {
      set((state) => {
        const { [storeName]: _, ...rest } = state.state;

        return {
          state: rest,
        };
      });
    },
  },
}));

export const useByIDStore = <T>(storeName: string) => {
  const store = ownStore();

  return {
    items: (store.state[storeName] || {}) as Record<
      StoreEntryID,
      StoreEntry<T>
    >,
    actions: {
      saveItem: (id: StoreEntryID, item: T) =>
        store.actions.saveItem(storeName, id, item),
      getItem: (id: StoreEntryID) => store.actions.getItem(storeName, id) as T,
      wasLoaded: (id: StoreEntryID) => store.actions.wasLoaded(storeName, id),
      removeItem: (id: StoreEntryID) => store.actions.removeItem(storeName, id),
      startLoading: (id: StoreEntryID) =>
        store.actions.startLoading(storeName, id),
      stopLoading: (id: StoreEntryID) =>
        store.actions.stopLoading(storeName, id),
      isLoading: (id: StoreEntryID) => store.actions.isLoading(storeName, id),
      clearStore: () => store.actions.clearStore(storeName),
    },
  };
};
