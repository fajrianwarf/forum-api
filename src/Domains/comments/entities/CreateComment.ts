export interface CreateCommentPayload {
  threadId: string;
  content: string;
  owner: string;
}

class CreateComment {
  public readonly threadId: string;

  public readonly content: string;

  public readonly owner: string;

  constructor(payload: unknown) {
    const { threadId, content, owner } = this._verifyPayload(payload);
    this.threadId = threadId;
    this.content = content;
    this.owner = owner;
  }

  private _verifyPayload(payload: unknown): CreateCommentPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { threadId, content, owner } = payload as Partial<CreateCommentPayload>;

    if (!threadId || !content || !owner) {
      throw new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return { threadId, content, owner };
  }
}

export default CreateComment;
