import api from '../../services/api'
import { useQuery } from '@tanstack/react-query'

async function getRepo(params: any) {
  const { data } = await api.get('/users/emanuelbsl/repos')
  return data
}

export function useFetchRepos() {
  return useQuery(['repos'], getRepo)
}
