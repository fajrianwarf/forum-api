import NotFoundError from '../../Commons/exceptions/NotFoundError';
import ThreadRepository from '../../Domains/threads/ThreadRepository';
import CreatedThread from '../../Domains/threads/entities/CreatedThread';
import type CreateThread from '../../Domains/threads/entities/CreateThread';
import type { ThreadDetailRow } from '../../Domains/threads/ThreadRepository';
import type { Pool } from 'pg';

interface ThreadIdRow {
  id: string;
}

type IdGenerator = () => string;

class ThreadRepositoryPostgres extends ThreadRepository {
  private readonly _pool: Pool;

  private readonly _idGenerator: IdGenerator;

  constructor(pool: Pool, idGenerator: IdGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableThread(id: string): Promise<void> {
    const query = {
      text: 'SELECT id FROM threads WHERE id=$1',
      values: [id],
    };

    const result = await this._pool.query<ThreadIdRow>(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async addThread(newThread: CreateThread): Promise<CreatedThread> {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query<{ id: string; title: string; owner: string }>(query);
    return new CreatedThread(result.rows[0]);
  }

  async getThreadById(id: string): Promise<ThreadDetailRow> {
    const query = {
      text: 'SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads LEFT JOIN users ON users.id=threads.owner WHERE threads.id=$1',
      values: [id],
    };

    const result = await this._pool.query<ThreadDetailRow>(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result.rows[0];
  }
}

export default ThreadRepositoryPostgres;
