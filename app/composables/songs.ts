import type { CreateSongInput, Song, SongListResponse, UpdateSongInput } from '~~/shared/types/song'

export const fetchSongs = () => $fetch<SongListResponse>('/api/songs')

export const songsDataKey = 'songs'

export const useFetchSongs = () => useAsyncData(songsDataKey, () => fetchSongs())

export const fetchSong = ({ id }: { id: string }) => $fetch<Song>(`/api/songs/${id}`)

const songDataKey = ({ id }: { id: string }) => `songs-${id}`

export const useFetchSong = ({ id }: { id: string }) =>
  useAsyncData(songDataKey({ id }), () => fetchSong({ id }))

export const createSong = ({ data }: { data: CreateSongInput }) =>
  $fetch<Song>('/api/songs', { method: 'POST', body: data })

export const createSongHandler = async ({ data }: { data: CreateSongInput }) => {
  const result = await createSong({ data })
  clearNuxtData(songsDataKey)
  return result
}

export const updateSong = ({ id, data }: { id: string; data: UpdateSongInput }) =>
  $fetch<Song>(`/api/songs/${id}`, { method: 'PUT', body: data })

export const updateSongHandler = async ({ id, data }: { id: string; data: UpdateSongInput }) => {
  const result = await updateSong({ id, data })
  clearNuxtData(songDataKey({ id }))
  return result
}

export const deleteSong = ({ id }: { id: string }) =>
  $fetch<Song>(`/api/songs/${id}`, { method: 'DELETE' })

export const deleteSongHandler = async ({
  confirm,
  song,
}: {
  confirm: ModalConfirmHandler
  song: Song
}) => {
  const result = await confirm({
    title: 'Delete song?',
    description: `${song.name} by ${song.author}`,
  })
  if (!result) return false

  await deleteSong({ id: song.id })
  clearNuxtData(songsDataKey)
  return true
}
