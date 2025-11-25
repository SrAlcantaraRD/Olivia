import {
  type ITaskPort,
  SQLiteTaskAdapter,
} from '@/ddbb/adapter/sqlite.task.adapter';
import { BASE_LOGGER } from '@/domain/core';

interface IAdapters {
  taskAdapter: ITaskPort;
}

export const useAdapters = (): Readonly<IAdapters> => {
  const taskAdapter = new SQLiteTaskAdapter(BASE_LOGGER);

  return Object.freeze({
    taskAdapter,
  });
};
