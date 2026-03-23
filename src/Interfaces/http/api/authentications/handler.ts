import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { DependencyContainer } from '../../types';
import {
  validateDeleteAuthenticationPayload,
  validateLoginPayload,
  validateRefreshTokenPayload,
} from '../../validator/payloadValidator';
import LoginUserUseCase from '../../../../Applications/use_case/LoginUserUseCase';
import RefreshAuthenticationUseCase from '../../../../Applications/use_case/RefreshAuthenticationUseCase';
import LogoutUserUseCase from '../../../../Applications/use_case/LogoutUserUseCase';

class AuthenticationsHandler {
  private readonly _container: DependencyContainer;

  constructor(container: DependencyContainer) {
    this._container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request: Request, h: ResponseToolkit) {
    const payload = validateLoginPayload(request.payload);
    const loginUserUseCase = this._container.getInstance<LoginUserUseCase>(LoginUserUseCase.name);
    const { accessToken, refreshToken } = await loginUserUseCase.execute(payload);
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request: Request) {
    const payload = validateRefreshTokenPayload(request.payload);
    const refreshAuthenticationUseCase = this._container
      .getInstance<RefreshAuthenticationUseCase>(RefreshAuthenticationUseCase.name);
    const accessToken = await refreshAuthenticationUseCase.execute(payload);

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request: Request) {
    const payload = validateDeleteAuthenticationPayload(request.payload);
    const logoutUserUseCase = this._container.getInstance<LogoutUserUseCase>(
      LogoutUserUseCase.name,
    );
    await logoutUserUseCase.execute(payload);
    return {
      status: 'success',
    };
  }
}

export default AuthenticationsHandler;
