const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableReply function', () => {
    it('should throw NotFoundError when reply not available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-123'))
        .rejects.toThrowError(new NotFoundError('balasan tidak ditemukan'));
    });

    it('should throw NotFoundError when reply is deleted', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        comment: commentId,
        owner: userId,
        isDelete: true,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply({ replyId: 'reply-123', commentId }))
        .rejects.toThrowError(new NotFoundError('balasan telah dihapus'));
    });

    it('should throw NotFoundError when reply is not found in comment', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        comment: commentId,
        owner: userId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply({ replyId: 'reply-123', commentId: 'comment-999' }))
        .rejects.toThrowError(new NotFoundError('balasan dalam komentar tidak ditemukan'));
    });

    it('should not throw NotFoundError when reply available', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        comment: commentId,
        owner: userId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply({ replyId, commentId }))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when reply owner not authorized', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        comment: commentId,
        owner: userId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner({ id: replyId, owner: 'user-999' }))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when reply owner authorized', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        comment: commentId,
        owner: userId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '');

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner({ id: replyId, owner: userId }))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('addReply function', () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
    });

    it('should persist new reply', async () => {
      // Arrange
      const newReply = new CreateReply({
        owner: 'user-123',
        commentId: 'comment-123',
        content: 'sebuah balasan',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const replys = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replys).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const newReply = new CreateReply({
        owner: 'user-123',
        commentId: 'comment-123',
        content: 'sebuah balasan',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(createdReply).toStrictEqual(new CreatedReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      }));
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return comment replies correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const otherUserId = 'user-456';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'kepin' });
      await UsersTableTestHelper.addUser({ id: otherUserId, username: 'agus' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'sebuah comment',
        date: '2024-12-13T00:00:00.000Z',
        threadId,
        owner: userId,
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-new',
        content: 'sebuah balasan baru',
        date: '2024-12-14T00:00:00.000Z',
        comment: commentId,
        owner: userId,
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-old',
        content: 'sebuah balasan lama',
        date: '2024-12-12T00:00:00.000Z',
        comment: commentId,
        owner: otherUserId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '');

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId(commentId);

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies[0].id).toBe('reply-old'); // older reply first
      expect(replies[1].id).toBe('reply-new');
      expect(replies[0].username).toBe('agus');
      expect(replies[1].username).toBe('kepin');
      expect(replies[0].content).toBe('sebuah balasan lama');
      expect(replies[1].content).toBe('sebuah balasan baru');
      expect(new Date(replies[0].date).toISOString()).toBe('2024-12-12T00:00:00.000Z');
      expect(new Date(replies[1].date).toISOString()).toBe('2024-12-14T00:00:00.000Z');
      expect(replies[0].is_delete).toBeFalsy();
      expect(replies[1].is_delete).toBeFalsy();
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return comment replies correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const otherUserId = 'user-456';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'kepin' });
      await UsersTableTestHelper.addUser({ id: otherUserId, username: 'agus' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'sebuah comment',
        date: '2024-12-13T00:00:00.000Z',
        threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-2',
        content: 'sebuah comment',
        date: '2024-12-13T00:00:00.000Z',
        threadId,
        owner: userId,
        isDelete: true,
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-new',
        content: 'sebuah balasan baru',
        date: '2024-12-14T00:00:00.000Z',
        comment: commentId,
        owner: userId,
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-old',
        content: 'sebuah balasan lama',
        date: '2024-12-12T00:00:00.000Z',
        comment: commentId,
        owner: otherUserId,
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-old-2',
        content: 'sebuah balasan lama',
        date: '2024-12-13T00:00:00.000Z',
        comment: 'comment-2',
        owner: otherUserId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '');

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId(threadId);

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies[0].id).toBe('reply-old'); // older reply first
      expect(replies[1].id).toBe('reply-new');
      expect(replies[0].username).toBe('agus');
      expect(replies[1].username).toBe('kepin');
      expect(replies[0].owner).toBe('user-456');
      expect(replies[1].owner).toBe('user-123');
      expect(replies[0].content).toBe('sebuah balasan lama');
      expect(replies[1].content).toBe('sebuah balasan baru');
      expect(new Date(replies[0].date).toISOString()).toBe('2024-12-12T00:00:00.000Z');
      expect(new Date(replies[1].date).toISOString()).toBe('2024-12-14T00:00:00.000Z');
      expect(replies[2]).toBeUndefined(); // reply in deleted comment
      expect(replies[0].is_delete).toBeFalsy();
      expect(replies[1].is_delete).toBeFalsy();
    });
  });

  describe('deleteReplyById function', () => {
    it('should soft delete reply and update is_delete field', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const replyId = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, () => '');

      await RepliesTableTestHelper.addReply({
        id: replyId,
        comment: 'comment-123',
        owner: 'user-123',
      });

      // Action
      await replyRepositoryPostgres.deleteReplyById(replyId);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById(replyId);
      expect(replies).toHaveLength(1);
      expect(replies[0].is_delete).toBeTruthy();
    });
  });
});
