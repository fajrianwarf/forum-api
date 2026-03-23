import CommentRepository from '../CommentRepository';
import CreateComment from '../entities/CreateComment';

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentRepository = new CommentRepository();
    const createComment = new CreateComment({
      threadId: 'thread-123',
      content: 'sebuah komentar',
      owner: 'user-123',
    });

    // Action and Assert
    await expect(commentRepository.verifyAvailableComment({ commentId: 'comment-123', threadId: 'thread-123' })).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.verifyCommentOwner({ id: 'comment-123', owner: 'user-123' })).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.addComment(createComment)).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.getCommentsByThreadId('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.deleteCommentById('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
