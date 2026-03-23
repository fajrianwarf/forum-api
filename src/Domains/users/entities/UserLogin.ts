export interface UserLoginPayload {
  username: string;
  password: string;
}

class UserLogin {
  public readonly username: string;

  public readonly password: string;

  constructor(payload: unknown) {
    const { username, password } = this._verifyPayload(payload);

    this.username = username;
    this.password = password;
  }

  private _verifyPayload(payload: unknown): UserLoginPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { username, password } = payload as Partial<UserLoginPayload>;

    if (!username || !password) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return { username, password };
  }
}

export default UserLogin;
