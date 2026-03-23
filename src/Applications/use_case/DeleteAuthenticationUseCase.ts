import type AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository';

interface DeleteAuthenticationPayload {
  refreshToken: string;
}

interface DeleteAuthenticationDependencies {
  authenticationRepository: AuthenticationRepository;
}

class DeleteAuthenticationUseCase {
  private readonly _authenticationRepository: AuthenticationRepository;

  constructor({
    authenticationRepository,
  }: DeleteAuthenticationDependencies) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload: unknown): Promise<void> {
    const { refreshToken } = this._validatePayload(useCasePayload);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  private _validatePayload(payload: unknown): DeleteAuthenticationPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    const { refreshToken } = payload as { refreshToken?: unknown };
    if (!refreshToken) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return { refreshToken };
  }
}

export default DeleteAuthenticationUseCase;
