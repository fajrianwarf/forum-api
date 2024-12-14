const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread is not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread is available', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '');

      // Action & Asserts
      await expect(threadRepositoryPostgres.verifyAvailableThread(threadId)).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
    });

    it('should persist thread and return created thread correctly', async () => {
      // Arrange
      const newThread = new CreateThread({ title: 'sebuah thread', body: 'sebuah body thread', owner: 'user-123' });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new CreateThread({ title: 'sebuah thread', body: 'sebuah body thread', owner: 'user-123' });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const title = 'sebuah thread';
      const body = 'sebuah body thread';
      const date = new Date().toISOString();
      const username = 'faj';

      await UsersTableTestHelper.addUser({ id: userId, username });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title,
        body,
        date,
        owner: userId,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '');

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(thread.id).toStrictEqual(threadId);
      expect(thread.title).toStrictEqual(title);
      expect(thread.body).toStrictEqual(body);
      expect(thread.date).toBeTruthy();
      expect(thread.username).toStrictEqual(username);
    })
  });
});