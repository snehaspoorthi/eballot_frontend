import { apiClient } from './apiClient';

export const voteService = {
  castVote: (data: any) => apiClient('/voter/cast-vote', { method: 'POST', body: JSON.stringify(data) }),
  verifyReceipt: (id: string) => apiClient(`/voter/verify-receipt/${id}`),
};
