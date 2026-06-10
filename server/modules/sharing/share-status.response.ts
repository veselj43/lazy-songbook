import type { ShareLibraryStatusResponse } from '~~/shared/schema/sharing'

export function toShareLibraryStatusResponse(share: ShareLibraryStatusResponse) {
  return {
    id: share.id,
    createdAt: share.createdAt,
    currentSongId: share.currentSongId,
    currentSongAuthor: share.currentSongAuthor,
    currentSongName: share.currentSongName,
    ownerUserId: share.ownerUserId,
    token: share.token,
    updatedAt: share.updatedAt,
  } satisfies ShareLibraryStatusResponse
}
