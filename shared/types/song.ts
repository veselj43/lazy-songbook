export interface Song {
  id: string
  userId: string
  author: string
  name: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface CreateSongInput {
  author: string
  name: string
  content: string
}

export interface UpdateSongInput {
  author?: string
  name?: string
  content?: string
}

export interface SongListResponse {
  items: Song[]
}
