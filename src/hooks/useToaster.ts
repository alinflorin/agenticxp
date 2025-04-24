import { toaster, toastSettings } from "@/configs/toaster";

export interface ToastAction {
    label: string;
    onClick?: () => void;
}

export default function useToaster() {
    const showToast = (
        title: string,
        message: string,
        type: "success" | "error" | "loading" | "info" | "loading" = "info",
        action: ToastAction | undefined = undefined,
        duration: number | undefined = undefined
    ) => {
        return toaster.create({
            title: title,
            description: message,
            type: type,
            closable: true,
            duration: duration || toastSettings.duration,
            action: action
                ? {
                      label: action.label,
                      onClick: action.onClick ? action.onClick : () => {},
                  }
                : undefined,
        });
    };

    return showToast;
}
