import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { AuthCredentials, DependencyContainer } from '../../types';
import { validateCreateThreadPayload } from '../../validator/payloadValidator';
import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase';
import DetailThreadUseCase from '../../../../Applications/use_case/DetailThreadUseCase';

class ThreadsHandler {
  private readonly _container: DependencyContainer;

  constructor(container: DependencyContainer) {
    this._container = container;

    this.postThreadhandler = this.postThreadhandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadhandler(request: Request, h: ResponseToolkit) {
    const payload = validateCreateThreadPayload(request.payload);

    const { id: userId } = request.auth.credentials as AuthCredentials;
    const { title, body } = payload;
    const addThreadUseCase = this._container.getInstance<AddThreadUseCase>(AddThreadUseCase.name);
    const createdThread = await addThreadUseCase.execute({ title, body, owner: userId });

    const response = h.response({
      status: 'success',
      data: {
        addedThread: createdThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request: Request) {
    const { threadId } = request.params as { threadId: string };
    const detailThreadUseCase = this._container.getInstance<DetailThreadUseCase>(
      DetailThreadUseCase.name,
    );
    const thread = await detailThreadUseCase.execute(threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

export default ThreadsHandler;
