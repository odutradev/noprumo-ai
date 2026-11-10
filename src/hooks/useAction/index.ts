import { useToast } from "enchase"

import { createLocalLogger } from "@utils/functions/logger"

import type { UseActionOptions } from "@utils/types/action"

const logger = createLocalLogger("useAction")

const useAction = <T>({ action, toastMessages, callback }: UseActionOptions<T>) => {
  const { promise } = useToast()

  return () =>
    promise(action(), { loading: toastMessages.pending, success: toastMessages.success, error: toastMessages.error })
      .then((result) => callback?.(result))
      .catch((error: unknown) => logger.error(error))
}

export default useAction
