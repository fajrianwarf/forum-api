import type { Server, ServerInjectResponse } from '@hapi/hapi';

interface RegistrationPayload {
  username: string;
  password: string;
  fullname: string;
}

class ServerTestHelper {
  private readonly _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  async getAccessTokenAndUserId(payload: RegistrationPayload = {
    username: 'kepin',
    password: 'secret',
    fullname: 'kepin agus',
  }): Promise<{ userId: string; accessToken: string }> {
    // add user
    const registerResponse: ServerInjectResponse = await this._server.inject({
      method: 'POST',
      url: '/users',
      payload,
    });

    // get access token
    const loginResponse: ServerInjectResponse = await this._server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: payload.username,
        password: payload.password,
      },
    });

    return {
      userId: JSON.parse(registerResponse.payload).data.addedUser.id,
      accessToken: JSON.parse(loginResponse.payload).data.accessToken,
    };
  }
}

export default ServerTestHelper;
