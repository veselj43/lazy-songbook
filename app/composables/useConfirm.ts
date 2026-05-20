import AppModalConfirm from '../components/AppModalConfirm.vue'

export type ModalConfirmProps = InstanceType<typeof AppModalConfirm>['$props']
export type ModalConfirmHandler = (props: ModalConfirmProps) => Promise<boolean>

export const useConfirm = () => {
  const overlay = useOverlay()
  const confirmModal = overlay.create(AppModalConfirm)

  const confirm: ModalConfirmHandler = async (props) => {
    const modal = confirmModal.open(props)
    const result = await modal.result
    return result
  }

  return {
    confirm,
  }
}
