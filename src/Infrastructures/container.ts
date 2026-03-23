import { createContainer } from 'instances-container';

// external agency
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import Jwt from '@hapi/jwt';
import pool from './database/postgres/pool';
// service (repository, helper, manager, etc)
import UserRepository from '../Domains/users/UserRepository';
import PasswordHash from '../Applications/security/PasswordHash';
import UserRepositoryPostgres from './repository/UserRepositoryPostgres';
import BcryptPasswordHash from './security/BcryptPasswordHash';
// use case
import AddUserUseCase from '../Applications/use_case/AddUserUseCase';
import AuthenticationTokenManager from '../Applications/security/AuthenticationTokenManager';
import JwtTokenManager from './security/JwtTokenManager';
import LoginUserUseCase from '../Applications/use_case/LoginUserUseCase';
import AuthenticationRepository from '../Domains/authentications/AuthenticationRepository';
import AuthenticationRepositoryPostgres from './repository/AuthenticationRepositoryPostgres';
import LogoutUserUseCase from '../Applications/use_case/LogoutUserUseCase';
import RefreshAuthenticationUseCase from '../Applications/use_case/RefreshAuthenticationUseCase';
import AddThreadUseCase from '../Applications/use_case/AddThreadUseCase';
import ThreadRepository from '../Domains/threads/ThreadRepository';
import ThreadRepositoryPostgres from './repository/ThreadRepositoryPostgres';
import CommentRepositoryPostgres from './repository/CommentRepositoryPostgres';
import ReplyRepositoryPostgres from './repository/ReplyRepositoryPostgres';
import DetailThreadUseCase from '../Applications/use_case/DetailThreadUseCase';
import AddCommentUseCase from '../Applications/use_case/AddCommentUseCase';
import DeleteCommentUseCase from '../Applications/use_case/DeleteCommentUseCase';
import AddReplyUseCase from '../Applications/use_case/AddReplyUseCase';
import DeleteReplyUseCase from '../Applications/use_case/DeleteReplyUseCase';
import CommentRepository from '../Domains/comments/CommentRepository';
import ReplyRepository from '../Domains/replies/ReplyRepository';
// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: DetailThreadUseCase.name,
    Class: DetailThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
      ],
    },
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name,
        },
      ],
    },
  },
]);

export default container;
