import { createToaster } from "@chakra-ui/react";

export const toaster = createToaster({
    placement: "bottom-end",
    pauseOnPageIdle: true,
  })

export const toastSettings = {
    duration: 5000
};