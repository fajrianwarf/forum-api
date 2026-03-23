import DetailThread from '../DetailThread';
describe('a DetailThread entities', () => {
  const emptyComments: never[] = [];

  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const testCases = [
      {
        id: 123,
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2024-11-28T14:19:09.135Z',
        username: 'kepin',
        comments: emptyComments,
      },
      {
        id: 'thread-123',
        title: 123,
        body: 'sebuah body thread',
        date: '2024-11-28T14:19:09.135Z',
        username: 'kepin',
        comments: emptyComments,
      },
      {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 123,
        date: '2024-11-28T14:19:09.135Z',
        username: 'kepin',
        comments: emptyComments,
      },
      {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: 123,
        username: 'kepin',
        comments: emptyComments,
      },
      {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2024-11-28T14:19:09.135Z',
        username: 123,
        comments: emptyComments,
      },
      {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2024-11-28T14:19:09.135Z',
        username: 123,
        comments: emptyComments,
      },
      {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2024-11-28T14:19:09.135Z',
        username: 'kepin',
        comments: 'sebuah comment',
      },
    ];

    // Action & Assert
    testCases.forEach((test) => {
      expect(() => new DetailThread(test)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  it('should create DetailThread object correctly', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2024-11-28T14:19:09.135Z',
      username: 'faj',
      comments: emptyComments,
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments).toEqual(payload.comments);
  });
});
