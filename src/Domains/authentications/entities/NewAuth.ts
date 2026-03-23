export interface NewAuthPayload {
  accessToken: string;
  refreshToken: string;
}

class NewAuth {
  public readonly accessToken: string;

  public readonly refreshToken: string;

  constructor(payload: unknown) {
    const { accessToken, refreshToken } = this._verifyPayload(payload);

    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private _verifyPayload(payload: unknown): NewAuthPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { accessToken, refreshToken } = payload as Partial<NewAuthPayload>;

    if (!accessToken || !refreshToken) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return { accessToken, refreshToken };
  }
}

export default NewAuth;
