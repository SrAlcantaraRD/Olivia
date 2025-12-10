import { create } from 'zustand';

import type { TBaseEntity } from '@/domain/core/entity/base-entity.entity';
import type { TUUID } from '@/domain/core/schemas/uuid.schema';

type StoreProps = {
  [storeName: string]: {
    [uuid: TUUID]: TBaseEntity;
  };
};

interface StoreActions {
  saveItem: <T extends TBaseEntity>(storeName: string, item: T) => void;
  getItem: <T extends TBaseEntity>(storeName: string, uuid: TUUID) => T | null;
  removeItem: (storeName: string, uuid: TUUID) => void;
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
    getItem: <T extends TBaseEntity>(
      storeName: string,
      uuid: TUUID
    ): T | null => {
      const state = get().items;

      console.log({ state });

      if (!state[storeName]) {
        return null;
      }

      console.log({ store: state[storeName] });

      if (!state[storeName][uuid]) {
        return null;
      }

      console.log({ item: state[storeName][uuid] });

      return state[storeName][uuid] as T;
    },
    removeItem: (storeName: string, uuid: TUUID) => {
      set((state) => {
        if (!state.items[storeName]) return state;

        const { [uuid]: _, ...rest } = state.items[storeName];

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
    items: (store.items[storeName] || {}) as Record<TUUID, T>,
    actions: {
      saveItem: (item: T) => store.actions.saveItem(storeName, item),
      getItem: (uuid: TUUID) => store.actions.getItem<T>(storeName, uuid),
      removeItem: (uuid: TUUID) => store.actions.removeItem(storeName, uuid),
      clearStore: () => store.actions.clearStore(storeName),
    },
  };
};
