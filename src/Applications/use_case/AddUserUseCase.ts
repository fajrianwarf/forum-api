import RegisterUser from '../../Domains/users/entities/RegisterUser';
import type { RegisterUserPayload } from '../../Domains/users/entities/RegisterUser';
import type UserRepository from '../../Domains/users/UserRepository';
import type PasswordHash from '../security/PasswordHash';

interface AddUserDependencies {
  userRepository: UserRepository;
  passwordHash: PasswordHash;
}

class AddUserUseCase {
  private readonly _userRepository: UserRepository;

  private readonly _passwordHash: PasswordHash;

  constructor({ userRepository, passwordHash }: AddUserDependencies) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload: RegisterUserPayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this._passwordHash.hash(registerUser.password);
    return this._userRepository.addUser(registerUser);
  }
}

export default AddUserUseCase;
