import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import type { Exercise, Zone } from '../types';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

async function fetchZones(): Promise<Zone[]> {
  const { data } = await api.get<Zone[]>('/zones');
  return data;
}

async function fetchExercise(id: string): Promise<Exercise> {
  const { data } = await api.get<Exercise>(`/exercises/${id}`);
  return data;
}

export function useZones() {
  return useQuery({
    queryKey: ['zones'],
    queryFn: fetchZones,
    staleTime: Infinity,
  });
}

export function useExercise(id: string | undefined) {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: () => fetchExercise(id as string),
    enabled: !!id,
    staleTime: Infinity,
  });
}
