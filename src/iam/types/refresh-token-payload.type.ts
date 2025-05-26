import { AccessTokenPayload } from './access-token-payload.type';

export interface RefreshTokenPayload extends AccessTokenPayload {
  refreshTokenId: string;
}
