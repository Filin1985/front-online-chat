import SignUpFormService from "./services/sign-up-form.service";
import UsersApiService from "../users/service/users-api.service";
import ToastifyService from "../../shared/services/toaster.service";
import PublicPageGuardService from "../guards/services/public-page-guard.service";
import LocalStorageService from "../../shared/services/storage.service";
import {userContextService} from "../../shared/services/user-context.instance";

const signUpForm: HTMLFormElement | null = document.querySelector('#signUpForm')

const fullnameInput: HTMLInputElement | null = document.querySelector('#fullnameInput')
const emailInput: HTMLInputElement | null = document.querySelector('#emailInput')
const passwordInput: HTMLInputElement | null = document.querySelector('#passwordInput')
const confirmPasswordInput: HTMLInputElement | null = document.querySelector('#confirmPasswordInput')

const fullnameValidationFeedbackEl: HTMLDivElement | null = document.querySelector('#fullnameValidationFeedback')
const emailValidationFeedbackEl: HTMLDivElement | null = document.querySelector('#emailValidationFeedback')
const passwordValidationFeedbackEl: HTMLDivElement | null = document.querySelector('#passwordValidationFeedback')
const confirmPasswordValidationFeedbackEl: HTMLDivElement | null = document.querySelector('#confirmPasswordValidationFeedback')

// SERVICES
const toasterApiService = new ToastifyService(3000)
const localStorageService = new LocalStorageService()
const usersApiService = new UsersApiService(toasterApiService, localStorageService)

// PUBLIC PAGE GUARD
const publicPageGuardService = new PublicPageGuardService(userContextService,localStorageService)
publicPageGuardService.init()


// SIGN UP FORM SERVICE
if (emailInput && fullnameInput && confirmPasswordInput && passwordInput && signUpForm && fullnameValidationFeedbackEl && confirmPasswordValidationFeedbackEl && emailValidationFeedbackEl && passwordValidationFeedbackEl) {
    const signUpFormService = new SignUpFormService(signUpForm, fullnameInput, emailInput, passwordInput, confirmPasswordInput, fullnameValidationFeedbackEl, emailValidationFeedbackEl, passwordValidationFeedbackEl, confirmPasswordValidationFeedbackEl, usersApiService)
    void signUpFormService.addSubmitEvent()

    // Регистрируем key up события
    void signUpFormService.addFullnameKeyUpEvent()
    void signUpFormService.addEmailKeyUpEvent()
    void signUpFormService.addPasswordKeyUpEvent()
    void signUpFormService.addConfirmPassowrdKeyUpEvent()
}
else {
    console.log('Some element is missing')
    console.log(signUpForm, fullnameInput, emailInput, passwordInput, confirmPasswordInput, fullnameValidationFeedbackEl, emailValidationFeedbackEl, passwordValidationFeedbackEl, confirmPasswordValidationFeedbackEl)
}

