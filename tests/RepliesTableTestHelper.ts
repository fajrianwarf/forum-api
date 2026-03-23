import pool from '../src/Infrastructures/database/postgres/pool';

interface AddReplyParams {
  id?: string;
  content?: string;
  date?: string;
  comment?: string;
  commentId?: string;
  owner?: string;
  isDelete?: boolean;
}

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'sebuah balasan',
    date = new Date().toISOString(),
    comment = 'comment-123',
    commentId,
    owner = 'user-123',
    isDelete = false,
  }: AddReplyParams) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, date, commentId ?? comment, owner, isDelete],
    };

    await pool.query(query);
  },

  async findRepliesById(id: string) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

export default RepliesTableTestHelper;
