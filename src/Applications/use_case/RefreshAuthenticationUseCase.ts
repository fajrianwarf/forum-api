import type AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository';
import type AuthenticationTokenManager from '../security/AuthenticationTokenManager';
import type { TokenPayload } from '../security/AuthenticationTokenManager';

interface RefreshAuthenticationPayload {
  refreshToken: string;
}

interface RefreshAuthenticationDependencies {
  authenticationRepository: AuthenticationRepository;
  authenticationTokenManager: AuthenticationTokenManager;
}

class RefreshAuthenticationUseCase {
  private readonly _authenticationRepository: AuthenticationRepository;

  private readonly _authenticationTokenManager: AuthenticationTokenManager;

  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }: RefreshAuthenticationDependencies) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload: unknown): Promise<string> {
    const { refreshToken } = this._verifyPayload(useCasePayload);

    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);

    const { username, id }: TokenPayload = await this._authenticationTokenManager
      .decodePayload(refreshToken);

    return this._authenticationTokenManager.createAccessToken({ username, id });
  }

  private _verifyPayload(payload: unknown): RefreshAuthenticationPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    const { refreshToken } = payload as { refreshToken?: unknown };

    if (!refreshToken) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return { refreshToken };
  }
}

export default RefreshAuthenticationUseCase;
