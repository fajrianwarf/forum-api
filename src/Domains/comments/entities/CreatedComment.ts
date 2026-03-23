export interface CreatedCommentPayload {
  id: string;
  content: string;
  owner: string;
}

class CreatedComment {
  public readonly id: string;

  public readonly content: string;

  public readonly owner: string;

  constructor(payload: unknown) {
    const { id, content, owner } = this._verifyPayload(payload);

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  private _verifyPayload(payload: unknown): CreatedCommentPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { id, content, owner } = payload as Partial<CreatedCommentPayload>;

    if (!id || !content || !owner) {
      throw new Error('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return { id, content, owner };
  }
}

export default CreatedComment;
