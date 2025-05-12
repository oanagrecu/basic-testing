import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

jest.mock('lodash', () => ({
  throttle: <T extends (...args: unknown[]) => unknown>(fn: T): T => fn,
}));

describe('throttledGetDataFromApi', () => {
  const mockGet = jest.fn();
  const mockCreate = axios.create as jest.Mock;

  beforeEach(() => {
    mockGet.mockClear();
    mockCreate.mockClear();

    mockCreate.mockReturnValue({
      get: mockGet,
    });
  });

  test('should create instance with provided base url', async () => {
    mockGet.mockResolvedValue({ data: { title: 'test' } });

    await throttledGetDataFromApi('/posts/1');

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    mockGet.mockResolvedValue({ data: { title: 'test' } });

    await throttledGetDataFromApi('/posts/2');

    expect(mockGet).toHaveBeenCalledWith('/posts/2');
  });

  test('should return response data', async () => {
    const mockResponseData = { id: 1, title: 'mock title' };
    mockGet.mockResolvedValue({ data: mockResponseData });

    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toEqual(mockResponseData);
  });
});
