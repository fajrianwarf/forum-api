export interface CreateReplyPayload {
  owner: string;
  commentId: string;
  content: string;
}

class CreateReply {
  public readonly owner: string;

  public readonly commentId: string;

  public readonly content: string;

  constructor(payload: unknown) {
    const { owner, commentId, content } = this._verifyPayload(payload);

    this.owner = owner;
    this.commentId = commentId;
    this.content = content;
  }

  private _verifyPayload(payload: unknown): CreateReplyPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { owner, commentId, content } = payload as Partial<CreateReplyPayload>;

    if (!owner || !commentId || !content) {
      throw new Error('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof commentId !== 'string' || typeof content !== 'string') {
      throw new Error('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return { owner, commentId, content };
  }
}

export default CreateReply;
