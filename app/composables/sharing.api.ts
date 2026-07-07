import type {
  MembershipStatus,
  ShareSongListRequestBodySchema,
  SharedLibrariesFilter,
} from '~~/shared/schema/sharing'

import { librarySharedApi } from '~/api/libraryShared.api'
import { libraryShareOwnApi } from '~/api/libraryShareOwn.api'

export const shareOwnDataKey = 'share-own'
export const sharedLibrariesDataKey = 'shared-libraries'
export const sharedDataKey = ({ token }: { token: string }) => `shared-${token}`
export const sharedStatusKey = ({ token }: { token: string }) => `shared-${token}-status`
export const sharedSongDataKey = ({ id, token }: { id: string; token: string }) =>
  `share-${token}-songs-${id}`

export const useFetchOwnerShare = () =>
  useAsyncData(shareOwnDataKey, () => libraryShareOwnApi.get())

export const createOwnerShareHandler = async () => {
  const result = await libraryShareOwnApi.create()
  clearNuxtData(shareOwnDataKey)
  return result
}

export const revokeOwnerShareHandler = async () => {
  await libraryShareOwnApi.revoke()
  clearNuxtData(shareOwnDataKey)
}

export const setCurrentSongHandler = async ({ songId }: { songId: string | null }) => {
  const result = await libraryShareOwnApi.setCurrentSong({ songId })
  clearNuxtData(shareOwnDataKey)
  return result
}

export const useFetchSharedLibraries = (body?: MaybeRefOrGetter<SharedLibrariesFilter>) => {
  const bodyRef = computed<SharedLibrariesFilter>(
    () => toValue(body) ?? { includeDismissed: false },
  )
  return useAsyncData(sharedLibrariesDataKey, () => librarySharedApi.filter(bodyRef.value), {
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
  await librarySharedApi.updateMembership({ id, status })
  clearNuxtData(sharedLibrariesDataKey)
}

export const deleteMembershipHandler = async ({ id }: { id: string }) => {
  await librarySharedApi.deleteMembership({ id })
  clearNuxtData(sharedLibrariesDataKey)
}

export const useFetchSharedLibraryStatus = ({ token }: { token: string }) =>
  useAsyncData(sharedStatusKey({ token }), () => librarySharedApi.getStatusByToken({ token }))

export const useFetchSharedLibrary = ({
  token,
  body,
}: {
  token: string
  body?: MaybeRefOrGetter<ShareSongListRequestBodySchema>
}) => {
  const bodyRef = computed<ShareSongListRequestBodySchema>(() => toValue(body) ?? {})
  return useAsyncData(
    sharedDataKey({ token }),
    () => librarySharedApi.songs.filter({ token, body: bodyRef.value }),
    {
      watch: [bodyRef],
    },
  )
}

export const useFetchSharedSong = ({ id, token }: { id: string; token: string }) =>
  useAsyncData(sharedSongDataKey({ id, token }), () =>
    librarySharedApi.songs.getByIdAndToken({ id, token }),
  )
