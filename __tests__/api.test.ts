import { createApi } from '../lib/api';

global.fetch = jest.fn();

// example test for api.ts
describe('API client', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockReset();
  });

  it('call fetch with correct headers', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'success' })
    });

    const api = createApi('test-token');
    const data = await api.get<{ message: string }>('/test');

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.objectContaining({
      headers: expect.objectContaining({
        'Authorization': 'test-token',
        'Content-Type': 'application/json',
      }),
    }));

    expect(data.message).toBe('success');
  });

  it('throw if response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Something went wrong.',
    });

    const api = createApi('token');

    await expect(api.get('/fail')).rejects.toThrow('API Error 500: Something went wrong.');
  });
});