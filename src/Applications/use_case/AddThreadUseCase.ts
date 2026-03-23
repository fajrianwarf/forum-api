import CreateThread from '../../Domains/threads/entities/CreateThread';
import type { CreateThreadPayload } from '../../Domains/threads/entities/CreateThread';
import type ThreadRepository from '../../Domains/threads/ThreadRepository';

interface AddThreadDependencies {
  threadRepository: ThreadRepository;
}

class AddThreadUseCase {
  private readonly _threadRepository: ThreadRepository;

  constructor({ threadRepository }: AddThreadDependencies) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload: CreateThreadPayload) {
    const newThread = new CreateThread(useCasePayload);
    return this._threadRepository.addThread(newThread);
  }
}

export default AddThreadUseCase;
