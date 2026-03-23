import DetailComment from '../../Domains/comments/entities/DetailComment';
import type { CommentRow } from '../../Domains/comments/CommentRepository';
import DetailReply from '../../Domains/replies/entities/DetailReply';
import type { ReplyRow } from '../../Domains/replies/ReplyRepository';
import DetailThread from '../../Domains/threads/entities/DetailThread';
import type CommentRepository from '../../Domains/comments/CommentRepository';
import type ReplyRepository from '../../Domains/replies/ReplyRepository';
import type ThreadRepository from '../../Domains/threads/ThreadRepository';
import type { ThreadDetailRow } from '../../Domains/threads/ThreadRepository';

interface DetailThreadDependencies {
  threadRepository: ThreadRepository;
  commentRepository: CommentRepository;
  replyRepository: ReplyRepository;
}

interface ThreadDetailWithComments extends ThreadDetailRow {
  comments: DetailComment[];
}

class DetailThreadUseCase {
  private readonly _threadRepository: ThreadRepository;

  private readonly _commentRepository: CommentRepository;

  private readonly _replyRepository: ReplyRepository;

  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }: DetailThreadDependencies) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId: string): Promise<DetailThread> {
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    const threadComments = await this._commentRepository.getCommentsByThreadId(threadId);
    const threadCommentsReplies = await this._replyRepository.getRepliesByThreadId(threadId);

    const threadDetailWithComments: ThreadDetailWithComments = {
      ...threadDetail,
      comments: threadComments.map((comment: CommentRow) => new DetailComment({
        ...comment,
        replies: comment.is_delete
          ? []
          : threadCommentsReplies
            .filter((reply: ReplyRow) => reply.comment === comment.id)
            .map((reply: ReplyRow) => new DetailReply(reply)),
      })),
    };

    return new DetailThread(threadDetailWithComments);
  }
}

export default DetailThreadUseCase;
