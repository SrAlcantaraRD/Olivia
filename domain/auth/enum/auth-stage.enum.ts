import { z } from 'zod';

export enum AUTH_STAGE {
  ADMIN_REQUIRES_PASSWORD_CHANGE = '1',
  USER_REQUIRES_PASSWORD_CHANGE = '2',
  PASSWORD_SETTED = '3',
}

export const AuthStageSchema = z.nativeEnum(AUTH_STAGE);

export const authStageFromString = (stage: string): AUTH_STAGE => {
  switch (stage) {
    case AUTH_STAGE.ADMIN_REQUIRES_PASSWORD_CHANGE:
      return AUTH_STAGE.ADMIN_REQUIRES_PASSWORD_CHANGE;
    case AUTH_STAGE.USER_REQUIRES_PASSWORD_CHANGE:
      return AUTH_STAGE.USER_REQUIRES_PASSWORD_CHANGE;
    case AUTH_STAGE.PASSWORD_SETTED:
      return AUTH_STAGE.PASSWORD_SETTED;
    default:
      throw new Error(`Invalid auth stage: "${stage}"`);
  }
};
