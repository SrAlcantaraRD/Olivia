export const enEN = {
  welcome: 'Welcome',
  'add-register': 'Add Register',
};

type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: TObj[TKey] extends object
    ? `${TKey}${'.'}${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & (string | number)];

export type Ti18nKeys = RecursiveKeyOf<typeof enEN>;
