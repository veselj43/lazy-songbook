import { songService } from '../../services/songService'

export default defineEventHandler(() => {
  return songService.getAll()
})
