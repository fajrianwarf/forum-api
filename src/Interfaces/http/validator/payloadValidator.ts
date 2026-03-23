import InvariantError from '../../../Commons/exceptions/InvariantError';
type PayloadRecord = Record<string, unknown>;

export interface RegisterUserPayload {
  username: string;
  password: string;
  fullname: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface CreateThreadPayload {
  title: string;
  body: string;
}

export interface CreateCommentPayload {
  content: string;
}

export interface CreateReplyPayload {
  content: string;
}

const isPayloadRecord = (payload: unknown): payload is PayloadRecord => (
  typeof payload === 'object' && payload !== null && !Array.isArray(payload)
);

const throwInvariantError = (message: string): never => {
  throw new InvariantError(message);
};

const ensurePayloadRecord = (payload: unknown, missingMessage: string): PayloadRecord => {
  if (!isPayloadRecord(payload)) {
    throwInvariantError(missingMessage);
  }

  return payload as PayloadRecord;
};

export const validateRegisterUserPayload = (
  payload: unknown,
): RegisterUserPayload => {
  const record = ensurePayloadRecord(payload, 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
  const { username, password, fullname } = record;

  if (!username || !password || !fullname) {
    throwInvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
  }

  if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
    throwInvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai');
  }

  const normalizedUsername = username as string;
  const normalizedPassword = password as string;
  const normalizedFullname = fullname as string;

  if (normalizedUsername.length > 50) {
    throwInvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit');
  }

  if (!normalizedUsername.match(/^[\w]+$/)) {
    throwInvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang');
  }

  return {
    username: normalizedUsername,
    password: normalizedPassword,
    fullname: normalizedFullname,
  };
};

export const validateLoginPayload = (payload: unknown): LoginPayload => {
  const record = ensurePayloadRecord(payload, 'harus mengirimkan username dan password');
  const { username, password } = record;

  if (!username || !password) {
    throwInvariantError('harus mengirimkan username dan password');
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    throwInvariantError('username dan password harus string');
  }

  return {
    username: username as string,
    password: password as string,
  };
};

export const validateRefreshTokenPayload = (
  payload: unknown,
): RefreshTokenPayload => {
  const record = ensurePayloadRecord(payload, 'harus mengirimkan token refresh');
  const { refreshToken } = record;

  if (!refreshToken) {
    throwInvariantError('harus mengirimkan token refresh');
  }

  if (typeof refreshToken !== 'string') {
    throwInvariantError('refresh token harus string');
  }

  return { refreshToken: refreshToken as string };
};

export const validateDeleteAuthenticationPayload = (
  payload: unknown,
): RefreshTokenPayload => {
  const record = ensurePayloadRecord(payload, 'harus mengirimkan token refresh');
  const { refreshToken } = record;

  if (!refreshToken) {
    throwInvariantError('harus mengirimkan token refresh');
  }

  if (typeof refreshToken !== 'string') {
    throwInvariantError('refresh token harus string');
  }

  return { refreshToken: refreshToken as string };
};

export const validateCreateThreadPayload = (
  payload: unknown,
): CreateThreadPayload => {
  const record = ensurePayloadRecord(payload, 'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
  const { title, body } = record;

  if (!title || !body) {
    throwInvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
  }

  if (typeof title !== 'string' || typeof body !== 'string') {
    throwInvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai');
  }

  return {
    title: title as string,
    body: body as string,
  };
};

export const validateCreateCommentPayload = (
  payload: unknown,
): CreateCommentPayload => {
  const record = ensurePayloadRecord(payload, 'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
  const { content } = record;

  if (!content) {
    throwInvariantError('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
  }

  if (typeof content !== 'string') {
    throwInvariantError('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
  }

  return { content: content as string };
};

export const validateCreateReplyPayload = (
  payload: unknown,
): CreateReplyPayload => {
  const record = ensurePayloadRecord(payload, 'tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada');
  const { content } = record;

  if (!content) {
    throwInvariantError('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada');
  }

  if (typeof content !== 'string') {
    throwInvariantError('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
  }

  return { content: content as string };
};
