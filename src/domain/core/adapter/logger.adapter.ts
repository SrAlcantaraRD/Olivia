import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import {
  consoleTransport,
  fileAsyncTransport,
  logger,
} from 'react-native-logs';

import { ENVIRONMENT_VARIABLES } from '@/domain/core/constant/environment-variables.constants';

const isFileSystemSupported =
  Platform.OS !== 'web' && Boolean(FileSystem.documentDirectory);

const transport =
  __DEV__ || !isFileSystemSupported ? consoleTransport : fileAsyncTransport;

const colors = {
  info: 'blueBright',
  warn: 'yellowBright',
  error: 'redBright',
} as const;

const transportOptions = {
  FS: FileSystem,
  fileName: 'logs.txt',
  colors,
};

const BASE_LOGGER = logger.createLogger({
  transport,
  severity: ENVIRONMENT_VARIABLES.LOG_LEVEL,
  levels: {
    custom: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    devNotice: 5,
  },
  transportOptions,
  async: true,
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
  fixedExtLvlLength: false,
  enabled: true,
});

export type TLoggerPort = typeof BASE_LOGGER;

export { BASE_LOGGER };
