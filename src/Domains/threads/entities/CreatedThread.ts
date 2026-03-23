export interface CreatedThreadPayload {
  id: string;
  title: string;
  owner: string;
}

class CreatedThread {
  public readonly id: string;

  public readonly title: string;

  public readonly owner: string;

  constructor(payload: unknown) {
    const { id, title, owner } = this._verifyPayload(payload);

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  private _verifyPayload(payload: unknown): CreatedThreadPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { id, title, owner } = payload as Partial<CreatedThreadPayload>;

    if (!id || !title || !owner) {
      throw new Error('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return { id, title, owner };
  }
}

export default CreatedThread;
