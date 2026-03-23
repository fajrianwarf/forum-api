import pool from '../src/Infrastructures/database/postgres/pool';

interface AddCommentParams {
  id?: string;
  content?: string;
  date?: string;
  thread?: string;
  threadId?: string;
  owner?: string;
  isDelete?: boolean;
}

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'sebuah comment',
    date = new Date().toISOString(),
    thread,
    threadId = 'thread-123',
    owner = 'user-123',
    isDelete = false,
  }: AddCommentParams) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, date, thread ?? threadId, owner, isDelete],
    };

    await pool.query(query);
  },

  async findCommentsById(id: string) {
    const query = {
      text: 'SELECT * FROM comments WHERE id=$1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

export default CommentsTableTestHelper;
