class ClientError extends Error {
  public readonly statusCode: number;

  public readonly isServer: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);

    if (this.constructor.name === 'ClientError') {
      throw new Error('cannot instantiate abstract class');
    }

    this.statusCode = statusCode;
    this.isServer = false;
    this.name = 'ClientError';
  }
}

export default ClientError;
