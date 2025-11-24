import { File, Paths } from 'expo-file-system';
import {
  consoleTransport,
  fileAsyncTransport,
  logger,
} from 'react-native-logs';

// Create a file system adapter for react-native-logs
const fileSystemAdapter = {
  writeFile: async (path: string, data: string) => {
    const file = new File(Paths.document, path);
    await file.write(data);
  },
  readFile: async (path: string) => {
    const file = new File(Paths.document, path);
    return await file.text();
  },
  mkdir: async (path: string) => {
    // expo-file-system auto-creates directories
  },
  unlink: async (path: string) => {
    const file = new File(Paths.document, path);
    await file.delete();
  },
};

const BASE_LOGGER = logger.createLogger({
  transport: __DEV__ ? consoleTransport : fileAsyncTransport,
  severity: __DEV__ ? 'debug' : 'error',
  levels: {
    custom: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    devNotice: 5,
  },
  transportOptions: {
    FS: fileSystemAdapter,
    fileName: 'logs.txt',
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
  async: true,
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
  fixedExtLvlLength: false,
  enabled: true,
});

export type TLoggerPort = typeof BASE_LOGGER;

export { BASE_LOGGER };
