import InvariantError from '../../Commons/exceptions/InvariantError';
import RegisteredUser from '../../Domains/users/entities/RegisteredUser';
import type RegisterUser from '../../Domains/users/entities/RegisterUser';
import UserRepository from '../../Domains/users/UserRepository';
import type { Pool } from 'pg';

interface UsernameRow {
  username: string;
}

interface PasswordRow {
  password: string;
}

interface IdRow {
  id: string;
}

type IdGenerator = () => string;

class UserRepositoryPostgres extends UserRepository {
  private readonly _pool: Pool;

  private readonly _idGenerator: IdGenerator;

  constructor(pool: Pool, idGenerator: IdGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username: string): Promise<void> {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query<UsernameRow>(query);

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser(registerUser: RegisterUser): Promise<RegisteredUser> {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const result = await this._pool.query<{
      id: string;
      username: string;
      fullname: string;
    }>(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async getPasswordByUsername(username: string): Promise<string> {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query<PasswordRow>(query);

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return result.rows[0].password;
  }

  async getIdByUsername(username: string): Promise<string> {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query<IdRow>(query);

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }
}

export default UserRepositoryPostgres;
