import {User} from './user';

export interface AuthResponseInterface {
  accessToken: string;
  refreshToken?: string;
  user: User;
}
