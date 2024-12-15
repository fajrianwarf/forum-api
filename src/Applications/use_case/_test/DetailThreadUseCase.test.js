const DetailThreadUseCase = require('../DetailThreadUseCase');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');

describe('DetailThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    // Arrange
    const mockThreadDetail = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2024-12-12T00:00:00.000Z',
      username: 'user-123',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'kepin',
        date: '2024-12-12T00:00:00.000Z',
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-2',
        username: 'user-123',
        date: '2024-12-13T00:00:00.000Z',
        content: 'sebuah deleted comment',
        is_delete: true,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-1',
        username: 'kepin',
        date: '2024-12-13T00:00:00.000Z',
        content: 'sebuah balasan',
        comment: 'comment-1',
        is_delete: false,
      },
      {
        id: 'reply-2',
        username: 'user-123',
        date: '2024-12-14T00:00:00.000Z',
        content: 'a deleted reply',
        comment: 'comment-1',
        is_delete: true,
      },
      {
        id: 'reply-3',
        username: 'user-123',
        date: '2024-12-14T00:00:00.000Z',
        content: 'sebuah balasan',
        comment: 'comment-2',
        is_delete: false,
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn(() => Promise.resolve(mockReplies));

    /** creating use case instance */
    const getThreadDetailUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute('thread-123');

    // Assert
    expect(threadDetail).toStrictEqual(new DetailThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2024-12-12T00:00:00.000Z',
      username: 'user-123',
      comments: [
        new DetailComment({
          id: 'comment-1',
          username: 'kepin',
          date: '2024-12-12T00:00:00.000Z',
          content: 'sebuah comment',
          replies: [
            new DetailReply({
              id: 'reply-1',
              username: 'kepin',
              content: 'sebuah balasan',
              date: '2024-12-13T00:00:00.000Z',
            }),
            new DetailReply({
              id: 'reply-2',
              username: 'user-123',
              date: '2024-12-14T00:00:00.000Z',
              content: '**balasan telah dihapus**',
            }),
          ],
        }),
        new DetailComment({
          id: 'comment-2',
          username: 'user-123',
          date: '2024-12-13T00:00:00.000Z',
          content: '**komentar telah dihapus**',
          replies: [],
        }),
      ],
    }));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockThreadDetail.id);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(mockThreadDetail.id);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledTimes(1);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(mockThreadDetail.id);
  });
});
