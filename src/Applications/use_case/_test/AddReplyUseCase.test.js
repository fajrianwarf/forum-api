const AddReplyUseCase = require('../AddReplyUseCase');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
    };

    const mockAddedReply = new CreatedReply({
      id: 'reply-123',
      owner: 'user-123',
      content: useCasePayload.content,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(mockAddedReply));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(createdReply).toStrictEqual(new CreatedReply({
      id: 'reply-123',
      owner: 'user-123',
      content: 'sebuah balasan',
    }));

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith({
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId,
    });
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new CreateReply({ 
        content: useCasePayload.content,
        owner: 'user-123',
        commentId: useCasePayload.commentId,
      }),
    );
  });
});
