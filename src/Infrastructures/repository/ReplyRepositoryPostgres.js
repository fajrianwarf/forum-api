const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CreatedReply = require('../../Domains/replies/entities/CreatedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableReply({ replyId, commentId }) {
    const query = {
      text: 'SELECT id, is_delete, comment FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

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

  async verifyReplyOwner({ id, owner }) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    const reply = result.rows[0];

    if (reply.owner !== owner) {
      throw new AuthorizationError('tidak punya akses');
    }
  }

  async addReply(newReply) {
    const { owner, commentId, content } = newReply;
    const id = 'reply-' + this._idGenerator();
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, commentId, owner],
    };

    const result = await this._pool.query(query);
    return new CreatedReply(result.rows[0]);
  }

  async getRepliesByCommentId(id) {
    const query = {
      text: 'SELECT replies.id, users.username, replies.date, replies.content, replies.is_delete FROM replies LEFT JOIN users ON users.id = replies.owner WHERE replies.comment = $1 ORDER BY replies.date ASC',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getRepliesByThreadId(id) {
    const query = {
      text: `SELECT replies.*, users.username 
      FROM replies
      LEFT JOIN users ON users.id = replies.owner
      LEFT JOIN comments ON comments.id = replies.comment
      WHERE comments.thread = $1 AND comments.is_delete = false
      ORDER BY replies.date ASC`,
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
