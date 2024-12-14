const CreatedThread = require('../CreatedThread');

describe('a CreatedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'sebuah thread',
    };

    // Action & Assert
    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'sebuah thread',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedThread object correctly', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'sebuah thread',
      owner: 'user-123',
    };

    // Action
    const createdThread = new CreatedThread(payload);

    // Assert
    expect(createdThread.id).toStrictEqual(payload.id);
    expect(createdThread.title).toStrictEqual(payload.title);
    expect(createdThread.owner).toStrictEqual(payload.owner);
  });
})