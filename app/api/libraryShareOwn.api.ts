import type { LibraryShare } from '~~/shared/schema/sharing'

export const libraryShareOwnApi = {
  get: () => $fetch<LibraryShare | null>('/api/library/share'),

  create: () => $fetch<LibraryShare>('/api/library/share', { method: 'POST' }),

  revoke: () => $fetch('/api/library/share', { method: 'DELETE' }),

  setCurrentSong: ({ songId }: { songId: string | null }) =>
    $fetch<LibraryShare | null>('/api/library/share/current-song', {
      method: 'PATCH',
      body: { songId },
    }),
}
