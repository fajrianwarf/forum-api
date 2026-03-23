export interface TokenPayload {
  username: string;
  id: string;
}

class AuthenticationTokenManager {
  async createRefreshToken(payload: TokenPayload): Promise<string> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async createAccessToken(payload: TokenPayload): Promise<string> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async verifyRefreshToken(token: string): Promise<void> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async decodePayload(token: string): Promise<TokenPayload> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }
}

export default AuthenticationTokenManager;
