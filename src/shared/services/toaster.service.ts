import Toastify from 'toastify-js'

export interface ToasterServiceInterface {
    showInfo: (message: string) => void
    showError: (message: string) => void
    showSuccess: (message: string) => void
}

export default class ToastifyService implements ToasterServiceInterface {
    private config

    constructor(duration: number) {
         this.config = {
            duration,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
        }
    }

    showInfo(message: string) {
        Toastify({
            ...this.config,
            text: message,
            style: {
                background: "cyan",
            },
        }).showToast();
    }
    showError(message: string) {
        Toastify({
            ...this.config,
            text: message,
            style: {
                background: "red",
            },
        }).showToast();
    }
    showSuccess(message: string) {
        Toastify({
            ...this.config,
            text: message,
            style: {
                background: "green",
            },
        }).showToast();
    }
}
