import { create } from 'zustand';

import type { TBaseEntityDTO } from '@/domain/core/entity/base-entity.entity';

type StoreProps = {
  [entity: string]: {
    items: TBaseEntityDTO[];
    listLoaded: boolean;
    isLoading: boolean;
  };
};

interface StoreActions {
  saveItems: <T extends TBaseEntityDTO>(entity: string, items: T[]) => void;
  getItems: <T extends TBaseEntityDTO>(entity: string) => T[];
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
    isLoading: (entity: string) => {
      return get().state[entity]?.isLoading || false;
    },
    stopLoading: (entity: string) => {
      set((state) => ({
        state: {
          ...state.state,
          [entity]: {
            ...(state.state[entity] || {
              items: [],
              listLoaded: false,
            }),
            isLoading: false,
          },
        },
      }));
    },
    startLoading: (entity: string) => {
      set((state) => ({
        state: {
          ...state.state,
          [entity]: {
            ...(state.state[entity] || {
              items: [],
              listLoaded: false,
            }),
            isLoading: true,
          },
        },
      }));
    },
    saveItems: <T extends TBaseEntityDTO>(entity: string, items: T[]) =>
      set((state) => ({
        state: {
          ...state.state,
          [entity]: { items, listLoaded: true, isLoading: false },
        },
      })),
    getItems: <T extends TBaseEntityDTO>(entity: string) =>
      (get().state[entity]?.items || []) as T[],
    clearStore: (entity: string) =>
      set((state) => {
        const { [entity]: _, ...rest } = state.state;

        return { state: rest };
      }),
  },
}));

export const useListStore = <T extends TBaseEntityDTO>(entity: string) => {
  const store = ownStore();

  return {
    items: (store.state[entity]?.items || []) as T[],
    actions: {
      saveItems: (items: T[]) => store.actions.saveItems<T>(entity, items),
      getItems: () => store.actions.getItems<T>(entity),
      clearStore: () => store.actions.clearStore(entity),
      isLoading: () => store.actions.isLoading(entity),
      startLoading: () => store.actions.startLoading(entity),
      stopLoading: () => store.actions.stopLoading(entity),
    },
  };
};
