import type CreateComment from './entities/CreateComment';
import type CreatedComment from './entities/CreatedComment';

export interface CommentRow {
  id: string;
  username: string;
  date: string | Date;
  content: string;
  is_delete: boolean;
}

class CommentRepository {
  async verifyAvailableComment({ commentId, threadId }: {
    commentId: string;
    threadId: string;
  }): Promise<void> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner({ id, owner }: { id: string; owner: string }): Promise<void> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addComment(newComment: CreateComment): Promise<CreatedComment> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentsByThreadId(id: string): Promise<CommentRow[]> { throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'); }

  async deleteCommentById(id: string): Promise<void> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default CommentRepository;
