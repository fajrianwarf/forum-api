type ReplyDate = string | Date;

export interface DetailReplyPayload {
  id: string;
  username: string;
  content: string;
  date: ReplyDate;
  is_delete?: boolean;
}

class DetailReply {
  public readonly id: string;

  public readonly username: string;

  public readonly content: string;

  public readonly date: ReplyDate;

  public readonly is_delete: boolean;

  constructor(payload: unknown) {
    const {
      id, username, content, date, is_delete,
    } = this._verifyPayload(payload);

    this.id = id;
    this.username = username;
    this.content = is_delete ? '**balasan telah dihapus**' : content;
    this.date = date;
    this.is_delete = false;
  }

  private _verifyPayload(payload: unknown): DetailReplyPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const {
      id, username, content, date, is_delete,
    } = payload as Partial<DetailReplyPayload>;

    if (!id || !username || !content || !date) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || (typeof date !== 'string' && typeof date !== 'object')) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return {
      id,
      username,
      content,
      date,
      is_delete,
    };
  }
}

export default DetailReply;
