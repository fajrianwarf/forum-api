import AuthorizationError from '../../Commons/exceptions/AuthorizationError';
import NotFoundError from '../../Commons/exceptions/NotFoundError';
import CommentRepository from '../../Domains/comments/CommentRepository';
import CreatedComment from '../../Domains/comments/entities/CreatedComment';
import type { CommentRow } from '../../Domains/comments/CommentRepository';
import type CreateComment from '../../Domains/comments/entities/CreateComment';
import type { Pool } from 'pg';

interface CommentAvailabilityRow {
  id: string;
  is_delete: boolean;
  thread: string;
}

interface CommentOwnerRow {
  owner: string;
}

type IdGenerator = () => string;

class CommentRepositoryPostgres extends CommentRepository {
  private readonly _pool: Pool;

  private readonly _idGenerator: IdGenerator;

  constructor(pool: Pool, idGenerator: IdGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableComment({ commentId, threadId }: {
    commentId: string;
    threadId: string;
  }): Promise<void> {
    const query = {
      text: 'SELECT id, is_delete, thread FROM comments WHERE id=$1',
      values: [commentId],
    };

    const result = await this._pool.query<CommentAvailabilityRow>(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    if (result.rows[0].thread !== threadId) {
      throw new NotFoundError('komentar dalam thread tidak ditemukan');
    }
  }

  async verifyCommentOwner({ id, owner }: { id: string; owner: string }): Promise<void> {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query<CommentOwnerRow>(query);
    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError('tidak mempunyai akses');
    }
  }

  async addComment(newComment: CreateComment): Promise<CreatedComment> {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, threadId, owner],
    };

    const result = await this._pool.query<{ id: string; content: string; owner: string }>(query);
    return new CreatedComment(result.rows[0]);
  }

  async getCommentsByThreadId(id: string): Promise<CommentRow[]> {
    const query = {
      text: 'SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete FROM comments LEFT JOIN users ON users.id = comments.owner WHERE comments.thread = $1 ORDER BY comments.date ASC',
      values: [id],
    };

    const result = await this._pool.query<CommentRow>(query);
    return result.rows;
  }

  async deleteCommentById(id: string): Promise<void> {
    const query = {
      text: 'UPDATE comments SET is_delete=true WHERE id=$1',
      values: [id],
    };

    await this._pool.query(query);
  }
}

export default CommentRepositoryPostgres;
