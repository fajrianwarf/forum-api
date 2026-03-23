import AddReplyUseCase from '../AddReplyUseCase';
import CreatedReply from '../../../Domains/replies/entities/CreatedReply';
import CreateReply from '../../../Domains/replies/entities/CreateReply';
import ReplyRepository from '../../../Domains/replies/ReplyRepository';
import CommentRepository from '../../../Domains/comments/CommentRepository';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
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
