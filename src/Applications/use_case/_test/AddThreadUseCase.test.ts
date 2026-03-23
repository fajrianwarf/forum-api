import CreatedThread from '../../../Domains/threads/entities/CreatedThread';
import CreateThread from '../../../Domains/threads/entities/CreateThread';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import AddThreadUseCase from '../AddThreadUseCase';
describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockCreatedThread));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    // Action
    const createdThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(createdThread).toStrictEqual(new CreatedThread({
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new CreateThread(useCasePayload));
  });
});
