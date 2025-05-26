import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(globalThis, 'setTimeout');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const cb = jest.fn();
    doStuffByTimeout(cb, 500);
    expect(setTimeout).toHaveBeenCalledWith(cb, 500);
  });

  test('should call callback only after timeout', () => {
    const cb = jest.fn();
    doStuffByTimeout(cb, 1000);
    expect(cb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(cb).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(globalThis, 'setInterval');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const cb = jest.fn();
    doStuffByInterval(cb, 300);
    expect(setInterval).toHaveBeenCalledWith(cb, 300);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cb = jest.fn();
    doStuffByInterval(cb, 200);
    jest.advanceTimersByTime(600);
    expect(cb).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockJoin = join as jest.Mock;
  const mockExistsSync = existsSync as jest.Mock;
  const mockReadFile = readFile as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    mockJoin.mockReturnValue('fake/path');
    mockExistsSync.mockReturnValue(false);

    await readFileAsynchronously('file.txt');
    expect(mockJoin).toHaveBeenCalledWith(__dirname, 'file.txt');
  });

  test('should return null if file does not exist', async () => {
    mockJoin.mockReturnValue('nonexistent/path');
    mockExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously('notfound.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    mockJoin.mockReturnValue('valid/path');
    mockExistsSync.mockReturnValue(true);
    mockReadFile.mockResolvedValue(Buffer.from('Hello world'));

    const result = await readFileAsynchronously('valid.txt');
    expect(result).toBe('Hello world');
  });
});
