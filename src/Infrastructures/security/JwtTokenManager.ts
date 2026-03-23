import AuthenticationTokenManager from '../../Applications/security/AuthenticationTokenManager';
import type { TokenPayload } from '../../Applications/security/AuthenticationTokenManager';
import InvariantError from '../../Commons/exceptions/InvariantError';
import config from '../config';

interface JwtArtifacts {
  decoded: {
    payload: TokenPayload;
  };
}

interface JwtToken {
  generate(payload: unknown, key: string): Promise<string> | string;
  decode(token: string): JwtArtifacts;
  verify(artifacts: JwtArtifacts, key: string): void;
}

class JwtTokenManager extends AuthenticationTokenManager {
  private readonly _jwt: JwtToken;

  constructor(jwt: JwtToken) {
    super();
    this._jwt = jwt;
  }

  async createAccessToken(payload: TokenPayload): Promise<string> {
    return this._jwt.generate(payload, config.auth.accessTokenKey);
  }

  async createRefreshToken(payload: TokenPayload): Promise<string> {
    return this._jwt.generate(payload, config.auth.refreshTokenKey);
  }

  async verifyRefreshToken(token: string): Promise<void> {
    try {
      const artifacts = this._jwt.decode(token);
      this._jwt.verify(artifacts, config.auth.refreshTokenKey);
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token: string): Promise<TokenPayload> {
    const artifacts = this._jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

export default JwtTokenManager;
