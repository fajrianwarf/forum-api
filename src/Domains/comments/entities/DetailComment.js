class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, replies, is_delete } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
    this.replies = replies;
  }

  _verifyPayload({ id, username, date, content, replies }) {
    if (!id || !username || !date || !content) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || (typeof date !== 'string' && typeof date !== 'object' ) || typeof content !== 'string' || (replies && !Array.isArray(replies))) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;