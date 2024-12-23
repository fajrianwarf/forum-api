const CreateReply = require('../CreateReply');

describe('CreateReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type requirements', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      content: 123,
      commentId: 'comment-123',
    };

    // Action & Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateReply entities correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      content: 'sebuah balasan',
      commentId: 'comment-123',
    };

    // Action
    const newReply = new CreateReply(payload);

    // Assert
    expect(newReply).toBeInstanceOf(CreateReply);
    expect(newReply.owner).toEqual(payload.owner);
    expect(newReply.commentId).toEqual(payload.commentId);
    expect(newReply.content).toEqual(payload.content);
  });
});
