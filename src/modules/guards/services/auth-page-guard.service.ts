import {StorageServiceInterface} from "../../../shared/services/storage.service";
import {UserContextServiceInterface} from "../../../shared/services/user-context.service";

export interface AuthPageGuardServiceInterface {
    init(): void;
}

export default class AuthPageGuardService implements AuthPageGuardServiceInterface {
    constructor(
        private userContextService: UserContextServiceInterface,
        private storageService: StorageServiceInterface,
    ) {}


    async init() {
        await this.userContextService.fetchUser()

        if (!this.userContextService.isAuthenticated()) {
            this.storageService.removeFromStorage('accessToken')
            this.storageService.addToStorage('from', location.pathname)
            location.href = '/sign-in'
        }
    }
}