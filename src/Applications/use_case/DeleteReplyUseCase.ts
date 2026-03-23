import type CommentRepository from '../../Domains/comments/CommentRepository';
import type ReplyRepository from '../../Domains/replies/ReplyRepository';
import type ThreadRepository from '../../Domains/threads/ThreadRepository';

interface DeleteReplyPayload {
  owner: string;
  threadId: string;
  commentId: string;
  replyId: string;
}

interface DeleteReplyDependencies {
  replyRepository: ReplyRepository;
  commentRepository: CommentRepository;
  threadRepository: ThreadRepository;
}

class DeleteReplyUseCase {
  private readonly _replyRepository: ReplyRepository;

  private readonly _commentRepository: CommentRepository;

  private readonly _threadRepository: ThreadRepository;

  constructor({
    replyRepository,
    commentRepository,
    threadRepository,
  }: DeleteReplyDependencies) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload: DeleteReplyPayload): Promise<void> {
    const {
      owner, threadId, commentId, replyId,
    } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment({ commentId, threadId });
    await this._replyRepository.verifyAvailableReply({ replyId, commentId });
    await this._replyRepository.verifyReplyOwner({ id: replyId, owner });

    return this._replyRepository.deleteReplyById(replyId);
  }
}

export default DeleteReplyUseCase;
