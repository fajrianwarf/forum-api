export interface CreateThreadPayload {
  title: string;
  body: string;
  owner: string;
}

class CreateThread {
  public readonly title: string;

  public readonly body: string;

  public readonly owner: string;

  constructor(payload: unknown) {
    const { title, body, owner } = this._verifyPayload(payload);

    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  private _verifyPayload(payload: unknown): CreateThreadPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { title, body, owner } = payload as Partial<CreateThreadPayload>;

    if (!title || !body || !owner) {
      throw new Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return { title, body, owner };
  }
}

export default CreateThread;
