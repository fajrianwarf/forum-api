const DetailReply = require('../DetailReply');

describe('DetailReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'kepin',
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type requirements', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'kepin',
      content: 'a reply',
      date: 321,
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailReply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'kepin',
      content: 'a reply',
      date: '2024-12-12T08:00:00.000Z',
    };

    // Action
    const replyDetail = new DetailReply(payload);

    // Assert
    expect(replyDetail).toBeInstanceOf(DetailReply);
    expect(replyDetail.id).toEqual(payload.id);
    expect(replyDetail.username).toEqual(payload.username);
    expect(replyDetail.content).toEqual(payload.content);
    expect(replyDetail.date).toEqual(payload.date);
  });

  it('should create deleted DetailReply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'kepin',
      content: 'a reply',
      date: '2024-12-12T08:00:00.000Z',
      is_delete: true,
    };

    // Action
    const replyDetail = new DetailReply(payload);

    // Assert
    expect(replyDetail).toBeInstanceOf(DetailReply);
    expect(replyDetail.id).toEqual(payload.id);
    expect(replyDetail.username).toEqual(payload.username);
    expect(replyDetail.content).toEqual('**balasan telah dihapus**');
    expect(replyDetail.date).toEqual(payload.date);
  });
});
