/**
 * Executes action and returns void.
 */
export const uiEventHandler = <T extends Function>(actionFn: T) => {
  actionFn()
}
