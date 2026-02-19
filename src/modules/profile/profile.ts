import AuthPageGuardService from "../guards/services/auth-page-guard.service";
import ToastifyService from "../../shared/services/toaster.service";
import UsersApiService from "../users/service/users-api.service";
import LocalStorageService from "../../shared/services/storage.service";
import ProfileFormService from "./services/profile-form.service";
import {userContextService} from "../../shared/services/user-context.instance";

// SERVICES
const toasterService = new ToastifyService(3000)
const localStorageService = new LocalStorageService()
const usersApiService = new UsersApiService(toasterService, localStorageService)

// AUTH PAGE GUARD
const authPageGuardService = new AuthPageGuardService(userContextService, localStorageService);
authPageGuardService.init()

// PROFILE FORM SERVICE
const fullnameInput: HTMLInputElement | null = document.querySelector('#fullnameInput')
const emailInput: HTMLInputElement | null = document.querySelector('#emailInput')
const editButton: HTMLButtonElement | null = document.querySelector('#editButton')
const cancelButton: HTMLButtonElement | null = document.querySelector('#cancelButton')
const submitButton: HTMLButtonElement | null = document.querySelector('#submitButton')
const fullnameInputValidationFeedback: HTMLDivElement | null = document.querySelector('#fullnameInputValidationFeedback')

if (fullnameInput && emailInput && usersApiService && editButton && cancelButton && submitButton && fullnameInputValidationFeedback) {
    const profileFormService = new ProfileFormService(fullnameInput, emailInput, editButton, cancelButton, submitButton, fullnameInputValidationFeedback, usersApiService, toasterService, userContextService)
    profileFormService.init()
}