import type DetailComment from '../../comments/entities/DetailComment';
import type { DetailCommentPayload } from '../../comments/entities/DetailComment';

type ThreadDate = string | Date;

export interface DetailThreadPayload {
  id: string;
  title: string;
  body: string;
  date: ThreadDate;
  username: string;
  comments: Array<DetailComment | DetailCommentPayload>;
}

class DetailThread {
  public readonly id: string;

  public readonly title: string;

  public readonly body: string;

  public readonly date: ThreadDate;

  public readonly username: string;

  public readonly comments: Array<DetailComment | DetailCommentPayload>;

  constructor(payload: unknown) {
    const {
      id, title, body, date, username, comments,
    } = this._verifyPayload(payload);

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  private _verifyPayload(payload: unknown): DetailThreadPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const {
      id, title, body, date, username, comments,
    } = payload as Partial<DetailThreadPayload>;

    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || (typeof date !== 'string' && typeof date !== 'object') || typeof username !== 'string' || !Array.isArray(comments)) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return {
      id,
      title,
      body,
      date,
      username,
      comments,
    };
  }
}

export default DetailThread;
