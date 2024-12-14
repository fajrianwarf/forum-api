const CreateThread = require('../CreateThread');

describe('a CreateThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
    };

    // Action & Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 123,
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    // Action
    const createThread = new CreateThread(payload);

    // Assert
    expect(createThread.title).toEqual(payload.title);
    expect(createThread.body).toEqual(payload.body);
    expect(createThread.owner).toEqual(payload.owner);
  });
});