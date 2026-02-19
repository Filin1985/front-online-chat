import {UsersApiServiceInterface, UsersProfileResponse} from "../../users/service/users-api.types";
import {ToasterServiceInterface} from "../../../shared/services/toaster.service";
import {UserContextServiceInterface} from "../../../shared/services/user-context.service";

export default class ProfileFormService {
    private fullname: string = '' // User 2
    private email: string = '' // user2@gmail.com

    constructor(
        private fullnameInput: HTMLInputElement,
        private emailInput: HTMLInputElement,
        private editButton: HTMLButtonElement,
        private cancelButton: HTMLButtonElement,
        private submitButton: HTMLButtonElement,
        private fullnameInputValidationFeedback: HTMLDivElement,
        private usersApiService: UsersApiServiceInterface,
        private toasterService: ToasterServiceInterface,
        private userContextService: UserContextServiceInterface,
    ) {}

    async init() {
        try {
            this.userContextService.subscribe((userProfile) => {
                // Когда меняются данные пользовтеля (setUser) this.updateFormData ПОВТОРНО запускается
                this.updateFormData(userProfile)
            })

            this.updateFormData(this.userContextService.getUser())

            this.addEventToEditButton()
            this.addEventToCancelButton()
            this.addEventToSubmitButton()
            this.addEventToFullnameKeyDownEvent()
        }
        catch (error: Error | unknown) {
            console.error(error)
        }

    }

    private updateFormData(userProfile: UsersProfileResponse | null) {
        if (userProfile) {
            this.fullname = userProfile.name || ''
            this.email = userProfile.email || ''
            this.fullnameInput.defaultValue = this.fullname
            this.emailInput.defaultValue = this.email


            if (this.fullnameInput.readOnly) {
                this.fullnameInput.value = this.fullname
                this.emailInput.value = this.email
            }
        }
    }

    private async fetchUpdateProfile() {
        const trimmedFullname = this.fullnameInput.value.trim()

        if(!trimmedFullname) {
            this.fullnameInput.classList.add('is-invalid')
            this.fullnameInputValidationFeedback.innerText = "Please enter full name"
            return false
        }

        const response = await this.usersApiService.updateProfile(trimmedFullname)

        if (response?.message) {
            this.toasterService.showSuccess(response.message)
            return true
        }
    }

    private startEditing() {
        this.fullnameInput.readOnly = false;
        this.cancelButton.classList.remove('hidden')
        this.submitButton.classList.remove('hidden')
        this.editButton.classList.add('hidden')
    }

    private stopEditing() {
        this.fullnameInput.readOnly = true;
        this.fullnameInput.value = this.fullnameInput.defaultValue;
        this.cancelButton.classList.add('hidden')
        this.submitButton.classList.add('hidden')
        this.editButton.classList.remove('hidden')
    }

    private addEventToEditButton() {
        this.editButton.addEventListener('click', () => {
            this.startEditing()
        })
    }

    private addEventToCancelButton() {
        this.cancelButton.addEventListener('click', async () => {
            this.stopEditing()
        })
    }

    private addEventToSubmitButton() {
        this.submitButton.addEventListener('click', async () => {
            const editedSuccessfully =  await this.fetchUpdateProfile()

            if (!editedSuccessfully) {
                return
            }

            await this.userContextService.fetchUser()
            this.stopEditing()
        })
    }

    private addEventToFullnameKeyDownEvent() {
        this.fullnameInput.addEventListener('keydown', async () => {
            this.fullnameInput.classList.remove('is-invalid')
            this.fullnameInputValidationFeedback.innerText = ""
        })
    }
}