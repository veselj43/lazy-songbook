import type { Song, CreateSongInput, UpdateSongInput, SongListResponse } from '~~/shared/types/song'

export function useSongs() {
  const fetchSongs = () =>
    $fetch<SongListResponse>('/api/songs')

  const fetchSong = (id: number | string) =>
    $fetch<Song>(`/api/songs/${id}`)

  const createSong = (input: CreateSongInput) =>
    $fetch<Song>('/api/songs', { method: 'POST', body: input })

  const updateSong = (id: number | string, input: UpdateSongInput) =>
    $fetch<Song>(`/api/songs/${id}`, { method: 'PUT', body: input })

  const deleteSong = (id: number | string) =>
    $fetch<Song>(`/api/songs/${id}`, { method: 'DELETE' })

  return { fetchSongs, fetchSong, createSong, updateSong, deleteSong }
}
