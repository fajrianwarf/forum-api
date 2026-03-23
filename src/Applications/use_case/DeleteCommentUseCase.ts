import type CommentRepository from '../../Domains/comments/CommentRepository';
import type ThreadRepository from '../../Domains/threads/ThreadRepository';

interface DeleteCommentPayload {
  owner: string;
  threadId: string;
  commentId: string;
}

interface DeleteCommentDependencies {
  commentRepository: CommentRepository;
  threadRepository: ThreadRepository;
}

class DeleteCommentUseCase {
  private readonly _commentRepository: CommentRepository;

  private readonly _threadRepository: ThreadRepository;

  constructor({ commentRepository, threadRepository }: DeleteCommentDependencies) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload: DeleteCommentPayload): Promise<void> {
    const { owner, threadId, commentId } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment({ commentId, threadId });
    await this._commentRepository.verifyCommentOwner({ id: commentId, owner });

    return this._commentRepository.deleteCommentById(commentId);
  }
}

export default DeleteCommentUseCase;
