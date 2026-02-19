import {StorageServiceInterface} from "../../../shared/services/storage.service";
import {UsersApiServiceInterface} from "../../users/service/users-api.types";

export default class SignUpFormService {
    private emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
    private passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    constructor(
        private signUpForm: HTMLFormElement,
        private fullnameInput: HTMLInputElement,
        private emailInput: HTMLInputElement,
        private passwordInput: HTMLInputElement,
        private confirmPasswordInput: HTMLInputElement,
        private fullnameValidationFeedbackEl: HTMLDivElement,
        private emailValidationFeedbackEl: HTMLDivElement,
        private passwordValidationFeedbackEl: HTMLDivElement,
        private confirmPasswordValidationFeedbackEl: HTMLDivElement,
        private usersApiService: UsersApiServiceInterface,
    ) {}

    async addSubmitEvent() {
        this.signUpForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            void this.register();
        })
    }

    addFullnameKeyUpEvent() {
        this.fullnameInput?.addEventListener('keyup', async () => {
            this.hideValidationError(this.fullnameInput, this.fullnameValidationFeedbackEl);
        })
    }

    addEmailKeyUpEvent() {
        this.emailInput?.addEventListener('keyup', async () => {
            this.hideValidationError(this.emailInput, this.emailValidationFeedbackEl);
        })
    }

    addPasswordKeyUpEvent() {
        this.passwordInput?.addEventListener('keyup', async () => {
            this.hideValidationError(this.passwordInput, this.passwordValidationFeedbackEl);
        })
    }

    addConfirmPassowrdKeyUpEvent() {
        this.confirmPasswordInput?.addEventListener('keyup', async () => {
            this.hideValidationError(this.confirmPasswordInput, this.confirmPasswordValidationFeedbackEl);
        })
    }

    async register() {
        try {
            let hasErrors = false
            const fullname = this.fullnameInput.value.trim();
            const email = this.emailInput.value.trim();
            const password = this.passwordInput.value.trim();
            const confirmPassword = this.confirmPasswordInput.value.trim();

            if (!fullname) {
                this.showValidationError(this.fullnameInput, this.fullnameValidationFeedbackEl, "Please enter full name");
                hasErrors = true;
            }

            if (!email || !email.match(this.emailRegex)) {
                this.showValidationError(this.emailInput, this.emailValidationFeedbackEl, "Please enter valid email");
                hasErrors = true;
            }

            if (!password) {
                this.showValidationError(this.passwordInput, this.passwordValidationFeedbackEl, "Please enter password");
                hasErrors = true;
            }
            else if (!(password.length >= 8 && password.length <= 24)) {
                this.showValidationError(this.passwordInput, this.passwordValidationFeedbackEl, "Password should be at least 8 and maximum 24 characters");
                hasErrors = true;
            }
            else if (!password.match(this.passwordRegex)) {
                this.showValidationError(this.passwordInput, this.passwordValidationFeedbackEl, "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character");
                hasErrors = true;
            }

            if (!confirmPassword) {
                this.showValidationError(this.confirmPasswordInput, this.confirmPasswordValidationFeedbackEl, "Please confirm password");
                hasErrors = true;
            }
            else if (confirmPassword !== password) {
                this.showValidationError(this.confirmPasswordInput, this.confirmPasswordValidationFeedbackEl, "Password and confirm password does not match");
                hasErrors = true;
            }

            if (hasErrors) {
                return
            }

            const data = await this.usersApiService.register(fullname, email, password, confirmPassword);
            if (data?.email) {
                location.href = "/sign-in?email=" + data.email;
            }
        }
        catch (error: Error | unknown) {
            console.error(error)
        }
    }

    private showValidationError(input: HTMLInputElement, feedbackEl: HTMLDivElement, message: string) {
        input.classList.add("is-invalid");
        feedbackEl.innerHTML = message;
    }

    private hideValidationError(input: HTMLInputElement, feedbackEl: HTMLDivElement) {
        input.classList.remove("is-invalid");
        feedbackEl.innerHTML = "";
    }
}