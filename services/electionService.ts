import { apiClient } from './apiClient';

export const electionService = {
  getElections: () => apiClient('/voter/elections'),
  getElectionById: (id: string) => apiClient(`/voter/election/${id}`),
  createElection: (data: any) => apiClient('/admin/create-election', { method: 'POST', body: JSON.stringify(data) }),
  openElection: (id: string) => apiClient('/admin/open-election', { method: 'POST', body: JSON.stringify({ electionId: id }) }),
  closeElection: (id: string) => apiClient('/admin/close-election', { method: 'POST', body: JSON.stringify({ electionId: id }) }),
  getResults: (id: string) => apiClient(`/admin/results/${id}`),
};
