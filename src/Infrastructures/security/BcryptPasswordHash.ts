import EncryptionHelper from '../../Applications/security/PasswordHash';
import AuthenticationError from '../../Commons/exceptions/AuthenticationError';

interface BcryptAdapter {
  hash(value: string, saltRounds: number): Promise<string>;
  compare(value: string, encryptedValue: string): Promise<boolean>;
}

class BcryptPasswordHash extends EncryptionHelper {
  private readonly _bcrypt: BcryptAdapter;

  private readonly _saltRound: number;

  constructor(bcrypt: BcryptAdapter, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password: string): Promise<string> {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<void> {
    const result = await this._bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
  }
}

export default BcryptPasswordHash;
