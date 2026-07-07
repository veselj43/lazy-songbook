import type {
  CreateSongInput,
  Song,
  SongListRequestBody,
  SongListResponse,
  UpdateSongInput,
} from '~~/shared/schema/song'

export const songsApi = {
  filter: (body: SongListRequestBody = {}) =>
    $fetch<SongListResponse>('/api/songs/filter', { method: 'POST', body }),

  getById: ({ id }: { id: string }) => $fetch<Song>(`/api/songs/${id}`),

  create: ({ data }: { data: CreateSongInput }) =>
    $fetch<Song>('/api/songs', { method: 'POST', body: data }),

  update: ({ id, data }: { id: string; data: UpdateSongInput }) =>
    $fetch<Song>(`/api/songs/${id}`, { method: 'PUT', body: data }),

  delete: ({ id }: { id: string }) => $fetch<Song>(`/api/songs/${id}`, { method: 'DELETE' }),
}
