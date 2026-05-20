import { songService } from '../../modules/songs/song.service'

export default defineEventHandler(() => {
  return songService.getAll()
})
