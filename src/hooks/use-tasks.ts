import { useCallback, useEffect, useState } from 'react';

import { useAdapters } from '@/ddbb/adapter';
import type { TTaskEntity } from '@/ddbb/adapter/sqlite.task.adapter';
import { BASE_LOGGER } from '@/domain/core';

export function useTasks() {
  const [tasks, setTasks] = useState<TTaskEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { taskAdapter } = useAdapters();

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allTasks = await taskAdapter.getAll();
      setTasks(allTasks);
    } catch (err) {
      setError(err as Error);
      BASE_LOGGER.error('Error loading tasks', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (title: string, description: string) => {
    try {
      const newTask = await taskAdapter.create(title, description);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      BASE_LOGGER.error('Error creating task', err);
      throw err;
    }
  }, []);

  const populateFakeData = useCallback(async () => {
    try {
      await taskAdapter.populateWithFakeData();
      await loadTasks();
    } catch (err) {
      BASE_LOGGER.error('Error populating fake data', err);
      throw err;
    }
  }, [loadTasks]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    populateFakeData,
  };
}
