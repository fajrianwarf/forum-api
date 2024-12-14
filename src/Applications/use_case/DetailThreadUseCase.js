const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class DetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    const threadComments = await this._commentRepository.getCommentsByThreadId(threadId);
    const threadCommentsReplies = await this._replyRepository.getRepliesByThreadId(threadId);

    threadDetail.comments = threadComments.map((comment) => new DetailComment({
      ...comment,
      replies: comment.is_delete
        ? []
        : threadCommentsReplies.filter((reply) => reply.comment === comment.id)
          .map((reply) => new DetailReply(reply))
    }));

    return new DetailThread(threadDetail);
  }
}

module.exports = DetailThreadUseCase;
