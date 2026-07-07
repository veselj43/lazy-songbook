import type {
  CreateSongInput,
  Song,
  SongListRequestBody,
  UpdateSongInput,
} from '~~/shared/schema/song'

import { songsApi } from '~/api/songs.api'

export const songsDataKey = 'songs'
export const songDataKey = ({ id }: { id: string }) => `songs-${id}`

export const useFetchSongs = (body?: MaybeRefOrGetter<SongListRequestBody>) => {
  const bodyRef = computed<SongListRequestBody>(() => toValue(body) ?? {})
  return useAsyncData(songsDataKey, () => songsApi.filter(bodyRef.value), {
    watch: [bodyRef],
  })
}

export const useFetchSong = ({ id }: { id: string }) =>
  useAsyncData(songDataKey({ id }), () => songsApi.getById({ id }))

export const createSongHandler = async ({ data }: { data: CreateSongInput }) => {
  const result = await songsApi.create({ data })
  clearNuxtData(songsDataKey)
  return result
}

export const updateSongHandler = async ({ id, data }: { id: string; data: UpdateSongInput }) => {
  const result = await songsApi.update({ id, data })
  clearNuxtData(songDataKey({ id }))
  return result
}

export const deleteSongHandler = async ({
  confirmHandler,
  song,
}: {
  confirmHandler: () => Promise<boolean>
  song: Song
}) => {
  const result = await confirmHandler()
  if (!result) return false

  await songsApi.delete({ id: song.id })
  clearNuxtData(songsDataKey)
  return true
}
