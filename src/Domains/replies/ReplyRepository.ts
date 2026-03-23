import type CreateReply from './entities/CreateReply';
import type CreatedReply from './entities/CreatedReply';

export interface ReplyRow {
  id: string;
  username: string;
  content: string;
  date: string | Date;
  is_delete: boolean;
  comment: string;
  owner: string;
}

class ReplyRepository {
  async verifyAvailableReply({ replyId, commentId }: {
    replyId: string;
    commentId: string;
  }): Promise<void> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner({ id, owner }: { id: string; owner: string }): Promise<void> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addReply(newReply: CreateReply): Promise<CreatedReply> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByCommentId(id: string): Promise<ReplyRow[]> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByThreadId(id: string): Promise<ReplyRow[]> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplyById(id: string): Promise<void> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default ReplyRepository;
