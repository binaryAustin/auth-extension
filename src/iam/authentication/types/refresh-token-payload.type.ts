import { CurrentUser } from '../../types/current-user.type';

export interface RefreshTokenPayload extends CurrentUser {
  refreshTokenId: string;
}
