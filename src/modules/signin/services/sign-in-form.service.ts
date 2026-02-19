import {StorageServiceInterface} from "../../../shared/services/storage.service";
import {UsersApiServiceInterface} from "../../users/service/users-api.types";

export default class SigninFormService {
    constructor(
        private signInForm: HTMLFormElement,
        private emailInput: HTMLInputElement,
        private passwordInput: HTMLInputElement,
        private emailValidationFeedbackEl: HTMLDivElement,
        private passwordValidationFeedbackEl: HTMLDivElement,
        private storageService: StorageServiceInterface,
        private usersApiService: UsersApiServiceInterface,
    ) {}

    initEmailInputValue() {
        const params = new URLSearchParams(location.search)
        const paramEmail = params?.get('email')
        if (paramEmail) {
            this.emailInput.value = paramEmail
        }
    }

    async addSubmitEvent() {
        this.signInForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            void this.login();
        })
    }

    addEmailKeyUpEvent() {
        this.emailInput?.addEventListener('keyup', async () => {
           this.hideEmailValidationError();
        })
    }

    addPasswordKeyUpEvent() {
        this.passwordInput?.addEventListener('keyup', async () => {
            this.hidePasswordValidationError();
        })
    }

    async login() {
        try {
            let hasErrors = false
            const email = this.emailInput.value.trim();
            const password = this.passwordInput.value.trim();

            if (!email) {
                this.showEmailValidationError()
                hasErrors = true;
            }

            if (!password) {
                this.showPasswordValidationError()
                hasErrors = true;
            }

            if (hasErrors) {
                return
            }

            const data = await this.usersApiService.login(email, password);

            if (data?.accessToken) {
                this.storageService.addToStorage('accessToken', data.accessToken)

                const from = this.storageService.getFromStorage('from')
                this.storageService.removeFromStorage('from')
                location.href = from || '/'
            }
        }
        catch (error: Error | unknown) {
            console.error(error)
        }
    }

    private showEmailValidationError() {
        this.emailInput.classList.add("is-invalid");
        this.emailValidationFeedbackEl.innerHTML = "Please enter a valid email";
    }

    private showPasswordValidationError() {
        this.passwordInput.classList.add("is-invalid");
        this.passwordValidationFeedbackEl.innerHTML = "Please enter password";
    }

    private hideEmailValidationError() {
        this.emailInput.classList.remove("is-invalid");
        this.emailValidationFeedbackEl.innerHTML = "";
    }

    private hidePasswordValidationError() {
        this.passwordInput.classList.remove("is-invalid");
        this.passwordValidationFeedbackEl.innerHTML = "";
    }
}