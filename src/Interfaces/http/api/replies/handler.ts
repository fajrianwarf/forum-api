import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { AuthCredentials, DependencyContainer } from '../../types';
import { validateCreateReplyPayload } from '../../validator/payloadValidator';
import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase';

class RepliesHandler {
  private readonly _container: DependencyContainer;

  constructor(container: DependencyContainer) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }

  async postReplyHandler(request: Request, h: ResponseToolkit) {
    const payload = validateCreateReplyPayload(request.payload);

    const { id: owner } = request.auth.credentials as AuthCredentials;
    const { commentId, threadId } = request.params as { commentId: string; threadId: string };
    const { content } = payload;
    const addReplyUseCase = this._container.getInstance<AddReplyUseCase>(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({
      owner,
      threadId,
      commentId,
      content,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request: Request) {
    const { id: owner } = request.auth.credentials as AuthCredentials;
    const deleteReplyUseCase = this._container.getInstance<DeleteReplyUseCase>(
      DeleteReplyUseCase.name,
    );
    await deleteReplyUseCase.execute({
      owner,
      ...(request.params as { threadId: string; commentId: string; replyId: string }),
    });

    return { status: 'success' };
  }
}

export default RepliesHandler;
