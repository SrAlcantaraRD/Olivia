import { create } from 'zustand';

import type { TBaseEntity } from '@/domain/core/entity/base-entity.entity';
import type { TID } from '@/domain/core/schemas/id.schema';

type StoreProps = {
  [storeName: string]: {
    [id: TID]: TBaseEntity;
  };
};

interface StoreActions {
  saveItem: <T extends TBaseEntity>(storeName: string, item: T) => void;
  getItem: <T extends TBaseEntity>(storeName: string, id: TID) => T | null;
  removeItem: (storeName: string, id: TID) => void;
  clearStore: (storeName: string) => void;
}

type Store = {
  items: StoreProps;
  actions: StoreActions;
};

const initialState: StoreProps = {};

// Single global store instance
const ownStore = create<Store>((set, get) => ({
  items: initialState,
  actions: {
    saveItem: <T extends TBaseEntity>(storeName: string, item: T) => {
      set((state) => ({
        items: {
          ...state.items,
          [storeName]: {
            ...state.items[storeName],
            [item.id]: item,
          },
        },
      }));
    },
    getItem: <T extends TBaseEntity>(storeName: string, id: TID): T | null => {
      const state = get().items;

      console.log({ state });

      if (!state[storeName]) {
        return null;
      }

      console.log({ store: state[storeName] });

      if (!state[storeName][id]) {
        return null;
      }

      console.log({ item: state[storeName][id] });
      return state[storeName][id] as T;
    },
    removeItem: (storeName: string, id: TID) => {
      set((state) => {
        if (!state.items[storeName]) return state;

        const { [id]: _, ...rest } = state.items[storeName];
        return {
          items: {
            ...state.items,
            [storeName]: rest,
          },
        };
      });
    },
    clearStore: (storeName: string) => {
      set((state) => {
        const { [storeName]: _, ...rest } = state.items;

        return {
          items: rest,
        };
      });
    },
  },
}));

export const useByIDStore = <T extends TBaseEntity>(storeName: string) => {
  const store = ownStore();

  return {
    items: (store.items[storeName] || {}) as Record<TID, T>,
    actions: {
      saveItem: (item: T) => store.actions.saveItem(storeName, item),
      getItem: (id: TID) => store.actions.getItem<T>(storeName, id),
      removeItem: (id: TID) => store.actions.removeItem(storeName, id),
      clearStore: () => store.actions.clearStore(storeName),
    },
  };
};
