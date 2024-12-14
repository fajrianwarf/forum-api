class CreateReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { owner, commentId, content } = payload;

    this.owner = owner;
    this.commentId = commentId;
    this.content = content;
  }

  _verifyPayload({ owner, commentId, content }) {
    if (!owner || !commentId || !content) {
      throw new Error('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof commentId !== 'string' || typeof content !== 'string') {
      throw new Error('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateReply;
