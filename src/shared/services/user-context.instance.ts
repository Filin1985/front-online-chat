import UserContextService from "./user-context.service";
import LocalStorageService from "./storage.service";
import UsersApiService from "../../modules/users/service/users-api.service";
import ToastifyService from "./toaster.service";

const toasterService = new ToastifyService(3000)
const localStorageService = new LocalStorageService();
const usersApiService = new UsersApiService(toasterService, localStorageService);

export const userContextService = new UserContextService(localStorageService, usersApiService);

const accessToken = localStorageService.getFromStorage('accessToken')
if (accessToken) {
    userContextService.fetchUser()
}