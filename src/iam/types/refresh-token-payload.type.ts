import { UserInfoPayload } from './user-info-payload.type';

export interface RefreshTokenPayload extends UserInfoPayload {
  refreshTokenId: string;
}
