import type {
  MembershipStatus,
  SharedLibrariesFilter,
  SharedLibraryListResponse,
  ShareLibraryResponse,
  ShareLibraryStatusResponse,
  ShareSongListRequestBodySchema,
  ShareSongResponse,
} from '~~/shared/schema/sharing'

export const librarySharedApi = {
  filter: (body: SharedLibrariesFilter) =>
    $fetch<SharedLibraryListResponse>('/api/shared/filter', { method: 'POST', body }),

  updateMembership: ({ id, status }: { id: string; status: MembershipStatus }) =>
    $fetch(`/api/shared/${id}`, { method: 'PATCH', body: { status } }),

  deleteMembership: ({ id }: { id: string }) => $fetch(`/api/shared/${id}`, { method: 'DELETE' }),

  getStatusByToken: ({ token }: { token: string }) =>
    $fetch<ShareLibraryStatusResponse>(`/api/shared/status/${token}`, {
      method: 'GET',
    }),

  songs: {
    filter: ({ token, body }: { token: string; body: ShareSongListRequestBodySchema }) =>
      $fetch<ShareLibraryResponse>(`/api/shared/${token}/songs/filter`, {
        method: 'POST',
        body,
      }),

    getByIdAndToken: ({ id, token }: { token: string; id: string }) =>
      $fetch<ShareSongResponse>(`/api/shared/${token}/songs/${id}`),
  },
}
