export interface RegisterUserPayload {
  username: string;
  password: string;
  fullname: string;
}

class RegisterUser {
  public readonly username: string;

  public password: string;

  public readonly fullname: string;

  constructor(payload: unknown) {
    const { username, password, fullname } = this._verifyPayload(payload);

    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }

  private _verifyPayload(payload: unknown): RegisterUserPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { username, password, fullname } = payload as Partial<RegisterUserPayload>;

    if (!username || !password || !fullname) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (username.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }

    return { username, password, fullname };
  }
}

export default RegisterUser;
