import { create } from 'zustand';

import type { TBaseEntityDTO } from '@/domain/core/entity/base-entity.entity';

type StoreProps<T> = {
  [key: string]: {
    items: T[];
    listLoaded: boolean;
  };
};

interface StoreActions<T> {
  saveItems: (items: T[]) => void;
  getItems: () => T[];
}

type Store<T> = {
  state: StoreProps<T>;
  actions: StoreActions<T>;
};

const initialState: StoreProps<never> = {};

const ownStore = <T>(storeName: string) =>
  create<Store<T>>((set, get) => ({
    state: {
      ...initialState,
    },
    actions: {
      saveItems: (rows: T[]) =>
        set((state) => ({
          state: {
            ...state.state,
            [storeName]: { items: rows, listLoaded: true },
          },
        })),
      getItems: () => (get().state[storeName]?.items || []) as T[],
    },
  }));

export const useListStore = <T extends TBaseEntityDTO>(storeName: string) => {
  const store = ownStore();

  return {
    items: (store.items[storeName] || {}) as Record<TUUID, T>,
    actions: {
      saveItem: (item: T) => store.actions.saveItem(storeName, item),
      getItem: (uuid: TUUID) => store.actions.getItem<T>(storeName, uuid),
      removeItem: (uuid: TUUID) => store.actions.removeItem(storeName, uuid),
      clearStore: () => store.actions.clearStore(storeName),
    },
  };
};
