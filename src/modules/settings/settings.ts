import AuthPageGuardService from "../guards/services/auth-page-guard.service";
import LocalStorageService from "../../shared/services/storage.service";
import {userContextService} from "../../shared/services/user-context.instance";

const localStorageService = new LocalStorageService()

const authPageGuardService = new AuthPageGuardService(userContextService, localStorageService);
authPageGuardService.init()