export interface RegisteredUserPayload {
  id: string;
  username: string;
  fullname: string;
}

class RegisteredUser {
  public readonly id: string;

  public readonly username: string;

  public readonly fullname: string;

  constructor(payload: unknown) {
    const { id, username, fullname } = this._verifyPayload(payload);

    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }

  private _verifyPayload(payload: unknown): RegisteredUserPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { id, username, fullname } = payload as Partial<RegisteredUserPayload>;

    if (!id || !username || !fullname) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return { id, username, fullname };
  }
}

export default RegisteredUser;
