import type DetailReply from '../../replies/entities/DetailReply';
import type { DetailReplyPayload } from '../../replies/entities/DetailReply';

type CommentDate = string | Date;

export interface DetailCommentPayload {
  id: string;
  username: string;
  date: CommentDate;
  content: string;
  replies?: Array<DetailReply | DetailReplyPayload>;
  is_delete?: boolean;
}

class DetailComment {
  public readonly id: string;

  public readonly username: string;

  public readonly date: CommentDate;

  public readonly content: string;

  public readonly replies: Array<DetailReply | DetailReplyPayload>;

  constructor(payload: unknown) {
    const {
      id, username, date, content, replies, is_delete,
    } = this._verifyPayload(payload);

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
    this.replies = replies ?? [];
  }

  private _verifyPayload(payload: unknown): DetailCommentPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const {
      id, username, date, content, replies, is_delete,
    } = payload as Partial<DetailCommentPayload>;

    if (!id || !username || !date || !content) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || (typeof date !== 'string' && typeof date !== 'object') || typeof content !== 'string' || (replies && !Array.isArray(replies))) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return {
      id,
      username,
      date,
      content,
      replies,
      is_delete,
    };
  }
}

export default DetailComment;
