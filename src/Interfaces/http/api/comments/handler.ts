import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { AuthCredentials, DependencyContainer } from '../../types';
import { validateCreateCommentPayload } from '../../validator/payloadValidator';
import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase';

class CommentsHandler {
  private readonly _container: DependencyContainer;

  constructor(container: DependencyContainer) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
  }

  async postCommentHandler(request: Request, h: ResponseToolkit) {
    const payload = validateCreateCommentPayload(request.payload);

    const { id: owner } = request.auth.credentials as AuthCredentials;
    const { threadId } = request.params as { threadId: string };
    const addCommentUseCase = this._container.getInstance<AddCommentUseCase>(
      AddCommentUseCase.name,
    );
    const addedComment = await addCommentUseCase.execute({
      ...payload,
      owner,
      threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(request: Request) {
    const { id: owner } = request.auth.credentials as AuthCredentials;
    const deleteCommentUseCase = this._container.getInstance<DeleteCommentUseCase>(
      DeleteCommentUseCase.name,
    );
    await deleteCommentUseCase.execute({
      ...(request.params as { threadId: string; commentId: string }),
      owner,
    });

    return { status: 'success' };
  }
}

export default CommentsHandler;
