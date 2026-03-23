import type CreateThread from './entities/CreateThread';
import type CreatedThread from './entities/CreatedThread';

export interface ThreadDetailRow {
  id: string;
  title: string;
  body: string;
  date: string | Date;
  username: string;
}

class ThreadRepository {
  async verifyAvailableThread(id: string): Promise<void> {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addThread(newThread: CreateThread): Promise<CreatedThread> {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getThreadById(id: string): Promise<ThreadDetailRow> {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default ThreadRepository;
