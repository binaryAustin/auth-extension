import { CurrentUserInfo } from '../../types/current-user-info.type';

export interface RefreshTokenPayload extends CurrentUserInfo {
  refreshTokenId: string;
}
