import type {
  LibraryShare,
  MembershipStatus,
  ShareLibraryResponse,
  ShareSongResponse,
  SharedLibrariesFilter,
  SharedLibraryListResponse,
} from '~~/shared/schema/sharing'
import type { SongSort } from '~~/shared/schema/song'

export const ownerShareDataKey = 'owner-share'
export const sharedLibrariesDataKey = 'shared-libraries'
export const shareDataKey = (token: string) => `share-${token}`
export const shareSongDataKey = (token: string, id: string) => `share-${token}-songs-${id}`

const fetchOwnerShare = () => $fetch<LibraryShare | null>('/api/library/share')

export const useFetchOwnerShare = () => useAsyncData(ownerShareDataKey, () => fetchOwnerShare())

export const createOwnerShareHandler = async () => {
  const result = await $fetch<LibraryShare>('/api/library/share', { method: 'POST' })
  clearNuxtData(ownerShareDataKey)
  return result
}

export const revokeOwnerShareHandler = async () => {
  await $fetch('/api/library/share', { method: 'DELETE' })
  clearNuxtData(ownerShareDataKey)
}

export const setCurrentSongHandler = async ({ songId }: { songId: string | null }) => {
  const result = await $fetch<LibraryShare | null>('/api/library/share/current-song', {
    method: 'PATCH',
    body: { songId },
  })
  clearNuxtData(ownerShareDataKey)
  return result
}

const fetchSharedLibraries = (body: SharedLibrariesFilter) =>
  $fetch<SharedLibraryListResponse>('/api/shared/filter', { method: 'POST', body })

export const useFetchSharedLibraries = (body?: MaybeRefOrGetter<SharedLibrariesFilter>) => {
  const bodyRef = computed<SharedLibrariesFilter>(
    () => toValue(body) ?? { includeDismissed: false },
  )
  return useAsyncData(sharedLibrariesDataKey, () => fetchSharedLibraries(bodyRef.value), {
    watch: [bodyRef],
  })
}

export const updateMembershipHandler = async ({
  id,
  status,
}: {
  id: string
  status: MembershipStatus
}) => {
  await $fetch(`/api/shared/${id}`, { method: 'PATCH', body: { status } })
  clearNuxtData(sharedLibrariesDataKey)
}

export const deleteMembershipHandler = async ({ id }: { id: string }) => {
  await $fetch(`/api/shared/${id}`, { method: 'DELETE' })
  clearNuxtData(sharedLibrariesDataKey)
}

interface ShareLibraryFetchBody {
  page?: number
  pageSize?: number
  sort?: SongSort
  search?: string
}

const fetchShareLibrary = ({ token, body }: { token: string; body: ShareLibraryFetchBody }) =>
  $fetch<ShareLibraryResponse>(`/api/shared/${token}/songs/filter`, {
    method: 'POST',
    body,
  })

export const useFetchShareLibrary = ({
  token,
  body,
}: {
  token: string
  body?: MaybeRefOrGetter<ShareLibraryFetchBody>
}) => {
  const bodyRef = computed<ShareLibraryFetchBody>(() => toValue(body) ?? {})
  return useAsyncData(
    shareDataKey(token),
    () => fetchShareLibrary({ token, body: bodyRef.value }),
    {
      watch: [bodyRef],
    },
  )
}

const fetchShareSong = ({ token, id }: { token: string; id: string }) =>
  $fetch<ShareSongResponse>(`/api/shared/${token}/songs/${id}`)

export const useFetchShareSong = ({ token, id }: { token: string; id: string }) =>
  useAsyncData(shareSongDataKey(token, id), () => fetchShareSong({ token, id }))
