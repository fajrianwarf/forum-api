import CreateReply from '../../Domains/replies/entities/CreateReply';
import type CommentRepository from '../../Domains/comments/CommentRepository';
import type ReplyRepository from '../../Domains/replies/ReplyRepository';
import type { CreateReplyPayload } from '../../Domains/replies/entities/CreateReply';
import type ThreadRepository from '../../Domains/threads/ThreadRepository';

interface AddReplyUseCasePayload extends CreateReplyPayload {
  threadId: string;
}

interface AddReplyDependencies {
  replyRepository: ReplyRepository;
  commentRepository: CommentRepository;
  threadRepository: ThreadRepository;
}

class AddReplyUseCase {
  private readonly _replyRepository: ReplyRepository;

  private readonly _commentRepository: CommentRepository;

  private readonly _threadRepository: ThreadRepository;

  constructor({ replyRepository, commentRepository, threadRepository }: AddReplyDependencies) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload: AddReplyUseCasePayload) {
    const { threadId, commentId } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment({ commentId, threadId });

    const createReply = new CreateReply(useCasePayload);
    return this._replyRepository.addReply(createReply);
  }
}

export default AddReplyUseCase;
