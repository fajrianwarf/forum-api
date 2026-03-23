import CreateComment from '../../Domains/comments/entities/CreateComment';
import type { CreateCommentPayload } from '../../Domains/comments/entities/CreateComment';
import type CommentRepository from '../../Domains/comments/CommentRepository';
import type ThreadRepository from '../../Domains/threads/ThreadRepository';

interface AddCommentDependencies {
  commentRepository: CommentRepository;
  threadRepository: ThreadRepository;
}

class AddCommentUseCase {
  private readonly _commentRepository: CommentRepository;

  private readonly _threadRepository: ThreadRepository;

  constructor({ commentRepository, threadRepository }: AddCommentDependencies) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload: CreateCommentPayload) {
    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
    const createComment = new CreateComment(useCasePayload);
    return this._commentRepository.addComment(createComment);
  }
}

export default AddCommentUseCase;
