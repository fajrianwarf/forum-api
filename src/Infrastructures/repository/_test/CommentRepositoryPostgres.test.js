const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");


describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment({
          commentId: 'comment-123',
          threadId: 'thread-123',
        })
      ).rejects.toThrowError(new NotFoundError('komentar tidak ditemukan'));
    });

    it('should throw NotFoundError when comment not found in the thread', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment({ commentId: 'comment-123', threadId: 'other-thread' }))
        .rejects.toThrowError(new NotFoundError('komentar dalam thread tidak ditemukan'));
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment({ commentId, threadId }))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when comment owner not authorized', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner({ id: commentId, owner: 'user-999'}))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment owner authorized', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner({ id: commentId, owner: userId}))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('addComment function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
    });

    it('should persist new comment', async () => {
      // Arrange
      const newComment = new CreateComment({ 
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'sebuah comment' 
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new CreateComment({ 
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'sebuah comment' 
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      }));
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return thread comments correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const otherUserId = 'user-456';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'kepin' });
      await UsersTableTestHelper.addUser({ id: otherUserId, username: 'agus' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      await CommentsTableTestHelper.addComment({
        id: 'comment-new',
        content: 'sebuah comment baru',
        date: '2024-12-14',
        thread: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-old',
        content: 'sebuah comment lama',
        date: '2024-12-12',
        thread: threadId,
        owner: otherUserId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '');

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toBe('comment-old'); // older comment first
      expect(comments[1].id).toBe('comment-new');
      expect(comments[0].username).toBe('agus');
      expect(comments[1].username).toBe('kepin');
      expect(comments[0].content).toBe('sebuah comment lama');
      expect(comments[1].content).toBe('sebuah comment baru');
      expect(comments[0].date).toBeTruthy();
      expect(comments[1].date).toBeTruthy();
    });
  });

  describe('deleteCommentById function', () => {
    it('should soft delete comment and update is_delete field', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => '');

      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread: 'thread-123',
        owner: 'user-123',
      });

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toBeTruthy();
    });
  });
});