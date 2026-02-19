import {StorageServiceInterface} from "../../../shared/services/storage.service";
import {UserContextServiceInterface} from "../../../shared/services/user-context.service";

export interface PublicPageGuardServiceInterface {
    init(): void;
}

export default class PublicPageGuardService implements PublicPageGuardServiceInterface {
    constructor(
        private userContextService: UserContextServiceInterface,
        private storageService: StorageServiceInterface,
    ) {}

    async init() {
        await this.userContextService.fetchUser()

        if (this.userContextService.isAuthenticated()) {
            location.href = '/profile'
        }
        else {
            // ToDo: Позже подумать убирать или нет
            this.storageService.removeFromStorage('accessToken')
        }
    }
}