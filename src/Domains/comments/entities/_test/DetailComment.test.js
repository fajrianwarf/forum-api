const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'faj',
      date: '2024-11-29T11:22:33.153Z',
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const testCases = [
      {
        id: 123,
        username: 123,
        date: '2024-11-29T11:22:33.153Z',
        content: 123,
        replies: 'yay',
      },
      {
        id: 'comment-123',
        username: 'user',
        date: 123,
        content: 'content',
      },
    ];

    // Action & Assert
    testCases.forEach((test) => {
      expect(() => new DetailComment(test)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  it('should create DetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'faj',
      date: '2024-11-29T11:22:33.153Z',
      content: 'sebuah comment',
      replies: [
        {
          id: 'reply-123',
          username: 'faj',
          date: '2024-11-29T13:12:33.153Z',
          content: 'sebuah balasan',
        },
      ],
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toStrictEqual(payload.id);
    expect(detailComment.username).toStrictEqual(payload.username);
    expect(detailComment.date).toStrictEqual(payload.date);
    expect(detailComment.content).toStrictEqual(payload.content);
    expect(detailComment.replies).toStrictEqual(payload.replies);
  });

  it('should create deleted DetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'faj',
      date: '2024-11-29T11:22:33.153Z',
      content: 'sebuah comment',
      is_delete: true,
      replies: [
        {
          id: 'reply-123',
          username: 'faj',
          date: '2024-11-29T13:12:33.153Z',
          content: 'sebuah balasan',
        },
      ],
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toStrictEqual(payload.id);
    expect(detailComment.username).toStrictEqual(payload.username);
    expect(detailComment.date).toStrictEqual(payload.date);
    expect(detailComment.content).toStrictEqual('**komentar telah dihapus**');
    expect(detailComment.replies).toStrictEqual(payload.replies);
  });
});
