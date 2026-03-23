import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { DependencyContainer } from '../../types';
import { validateRegisterUserPayload } from '../../validator/payloadValidator';
import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase';

class UsersHandler {
  private readonly _container: DependencyContainer;

  constructor(container: DependencyContainer) {
    this._container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request: Request, h: ResponseToolkit) {
    const payload = validateRegisterUserPayload(request.payload);
    const addUserUseCase = this._container.getInstance<AddUserUseCase>(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }
}

export default UsersHandler;
