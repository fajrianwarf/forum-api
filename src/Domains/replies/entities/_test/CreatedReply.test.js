const CreatedReply = require('../CreatedReply');

describe('CreatedReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah reply',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type requirements', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah reply',
      owner: 123,
    };

    // Action & Assert
    expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedReply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah reply',
      owner: 'user-123',
    };

    // Action
    const addedReply = new CreatedReply(payload);

    // Assert
    expect(addedReply).toBeInstanceOf(CreatedReply);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
