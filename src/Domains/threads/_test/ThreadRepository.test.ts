import ThreadRepository from '../ThreadRepository';
import CreateThread from '../entities/CreateThread';

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();
    const createThread = new CreateThread({
      title: 'sebuah thread',
      body: 'sebuah body',
      owner: 'user-123',
    });

    // Action & Assert
    await expect(threadRepository.addThread(createThread)).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.getThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.verifyAvailableThread('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
