import SigninFormService from "./services/sign-in-form.service";
import LocalStorageService from "../../shared/services/storage.service";
import UsersApiService from "../users/service/users-api.service";
import ToastifyService from "../../shared/services/toaster.service";
import PublicPageGuardService from "../guards/services/public-page-guard.service";
import {userContextService} from "../../shared/services/user-context.instance";

const emailInput: HTMLInputElement | null = document.querySelector('#emailInput')
const passwordInput: HTMLInputElement | null = document.querySelector('#passwordInput')
const signInForm: HTMLFormElement | null = document.querySelector('#signInForm')
const emailValidationFeedbackEl: HTMLDivElement | null = document.querySelector('#emailValidationFeedback')
const passwordValidationFeedbackEl: HTMLDivElement | null = document.querySelector('#passwordValidationFeedback')

// SERVICES
const toasterApiService = new ToastifyService(3000)
const localStorageService = new LocalStorageService()
const usersApiService = new UsersApiService(toasterApiService, localStorageService)

// PUBLIC PAGE GUARD
const publicPageGuardService = new PublicPageGuardService(userContextService,localStorageService)
publicPageGuardService.init()

// SIGN IN FORM SERVICE
if (emailInput && passwordInput && signInForm && emailValidationFeedbackEl && passwordValidationFeedbackEl) {
    const signinFormService = new SigninFormService(signInForm, emailInput, passwordInput, emailValidationFeedbackEl, passwordValidationFeedbackEl, localStorageService, usersApiService)

    void signinFormService.initEmailInputValue()
    void signinFormService.addSubmitEvent()
    void signinFormService.addEmailKeyUpEvent()
    void signinFormService.addPasswordKeyUpEvent()
}

