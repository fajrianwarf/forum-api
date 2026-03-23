import ReplyRepository from '../../Domains/replies/ReplyRepository';
import NotFoundError from '../../Commons/exceptions/NotFoundError';
import AuthorizationError from '../../Commons/exceptions/AuthorizationError';
import CreatedReply from '../../Domains/replies/entities/CreatedReply';
import type CreateReply from '../../Domains/replies/entities/CreateReply';
import type { ReplyRow } from '../../Domains/replies/ReplyRepository';
import type { Pool } from 'pg';

interface ReplyAvailabilityRow {
  id: string;
  is_delete: boolean;
  comment: string;
}

interface ReplyOwnerRow {
  owner: string;
}

type IdGenerator = () => string;

class ReplyRepositoryPostgres extends ReplyRepository {
  private readonly _pool: Pool;

  private readonly _idGenerator: IdGenerator;

  constructor(pool: Pool, idGenerator: IdGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableReply({ replyId, commentId }: {
    replyId: string;
    commentId: string;
  }): Promise<void> {
    const query = {
      text: 'SELECT id, is_delete, comment FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query<ReplyAvailabilityRow>(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    if (result.rows[0].is_delete) {
      throw new NotFoundError('balasan telah dihapus');
    }

    if (result.rows[0].comment !== commentId) {
      throw new NotFoundError('balasan dalam komentar tidak ditemukan');
    }
  }

  async verifyReplyOwner({ id, owner }: { id: string; owner: string }): Promise<void> {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query<ReplyOwnerRow>(query);
    const reply = result.rows[0];

    if (reply.owner !== owner) {
      throw new AuthorizationError('tidak punya akses');
    }
  }

  async addReply(newReply: CreateReply): Promise<CreatedReply> {
    const { owner, commentId, content } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, commentId, owner],
    };

    const result = await this._pool.query<{ id: string; content: string; owner: string }>(query);
    return new CreatedReply(result.rows[0]);
  }

  async getRepliesByCommentId(id: string): Promise<ReplyRow[]> {
    const query = {
      text: 'SELECT replies.id, users.username, replies.date, replies.content, replies.is_delete FROM replies LEFT JOIN users ON users.id = replies.owner WHERE replies.comment = $1 ORDER BY replies.date ASC',
      values: [id],
    };

    const result = await this._pool.query<ReplyRow>(query);
    return result.rows;
  }

  async getRepliesByThreadId(id: string): Promise<ReplyRow[]> {
    const query = {
      text: `SELECT replies.*, users.username 
      FROM replies
      LEFT JOIN users ON users.id = replies.owner
      LEFT JOIN comments ON comments.id = replies.comment
      WHERE comments.thread = $1 AND comments.is_delete = false
      ORDER BY replies.date ASC`,
      values: [id],
    };

    const result = await this._pool.query<ReplyRow>(query);
    return result.rows;
  }

  async deleteReplyById(id: string): Promise<void> {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }
}

export default ReplyRepositoryPostgres;
