import type {
  CreateSongInput,
  Song,
  SongListResponse,
  SongSort,
  UpdateSongInput,
} from '~~/shared/schema/song'

interface FetchSongsBody {
  page?: number
  pageSize?: number
  sort?: SongSort
  search?: string
}

const fetchSongs = (body: FetchSongsBody = {}) =>
  $fetch<SongListResponse>('/api/songs/filter', { method: 'POST', body })

export const songsDataKey = 'songs'

export const useFetchSongs = (body?: MaybeRefOrGetter<FetchSongsBody>) => {
  const bodyRef = computed<FetchSongsBody>(() => toValue(body) ?? {})
  return useAsyncData(songsDataKey, () => fetchSongs(bodyRef.value), {
    watch: [bodyRef],
  })
}

const fetchSong = ({ id }: { id: string }) => $fetch<Song>(`/api/songs/${id}`)

export const songDataKey = ({ id }: { id: string }) => `songs-${id}`

export const useFetchSong = ({ id }: { id: string }) =>
  useAsyncData(songDataKey({ id }), () => fetchSong({ id }))

const createSong = ({ data }: { data: CreateSongInput }) =>
  $fetch<Song>('/api/songs', { method: 'POST', body: data })

export const createSongHandler = async ({ data }: { data: CreateSongInput }) => {
  const result = await createSong({ data })
  clearNuxtData(songsDataKey)
  return result
}

const updateSong = ({ id, data }: { id: string; data: UpdateSongInput }) =>
  $fetch<Song>(`/api/songs/${id}`, { method: 'PUT', body: data })

export const updateSongHandler = async ({ id, data }: { id: string; data: UpdateSongInput }) => {
  const result = await updateSong({ id, data })
  clearNuxtData(songDataKey({ id }))
  return result
}

const deleteSong = ({ id }: { id: string }) =>
  $fetch<Song>(`/api/songs/${id}`, { method: 'DELETE' })

export const deleteSongHandler = async ({
  confirmHandler,
  song,
}: {
  confirmHandler: () => Promise<boolean>
  song: Song
}) => {
  const result = await confirmHandler()
  if (!result) return false

  await deleteSong({ id: song.id })
  clearNuxtData(songsDataKey)
  return true
}
