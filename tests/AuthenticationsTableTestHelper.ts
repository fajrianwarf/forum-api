import pool from '../src/Infrastructures/database/postgres/pool';
const AuthenticationsTableTestHelper = {
  async addToken(token: string) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  },

  async findToken(token: string) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM authentications WHERE 1=1');
  },
};

export default AuthenticationsTableTestHelper;
