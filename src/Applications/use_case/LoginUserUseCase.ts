import UserLogin from '../../Domains/users/entities/UserLogin';
import NewAuthentication from '../../Domains/authentications/entities/NewAuth';
import type AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository';
import type { UserLoginPayload } from '../../Domains/users/entities/UserLogin';
import type UserRepository from '../../Domains/users/UserRepository';
import type AuthenticationTokenManager from '../security/AuthenticationTokenManager';
import type PasswordHash from '../security/PasswordHash';

interface LoginUserDependencies {
  userRepository: UserRepository;
  authenticationRepository: AuthenticationRepository;
  authenticationTokenManager: AuthenticationTokenManager;
  passwordHash: PasswordHash;
}

class LoginUserUseCase {
  private readonly _userRepository: UserRepository;

  private readonly _authenticationRepository: AuthenticationRepository;

  private readonly _authenticationTokenManager: AuthenticationTokenManager;

  private readonly _passwordHash: PasswordHash;

  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }: LoginUserDependencies) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload: UserLoginPayload) {
    const { username, password } = new UserLogin(useCasePayload);

    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);

    await this._passwordHash.comparePassword(password, encryptedPassword);

    const id = await this._userRepository.getIdByUsername(username);

    const accessToken = await this._authenticationTokenManager
      .createAccessToken({ username, id });
    const refreshToken = await this._authenticationTokenManager
      .createRefreshToken({ username, id });

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    await this._authenticationRepository.addToken(newAuthentication.refreshToken);

    return newAuthentication;
  }
}

export default LoginUserUseCase;
