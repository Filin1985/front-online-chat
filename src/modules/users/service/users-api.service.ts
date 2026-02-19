import {
    UsersApiServiceInterface,
    UsersLoginResponse, UsersLogoutResponse,
    UsersProfileResponse,
    UsersRegisterResponse, UsersUpdateProfileResponse
} from "./users-api.types";
import axios, {AxiosError} from "axios";
import {ToasterServiceInterface} from "../../../shared/services/toaster.service";
import {StorageServiceInterface} from "../../../shared/services/storage.service";

export default class UsersApiService implements UsersApiServiceInterface {
    constructor(private toasterService: ToasterServiceInterface, private storageService: StorageServiceInterface) {}

    async login(email: string, password: string): Promise<UsersLoginResponse | undefined> {
        try {
            const response = await axios.post<UsersLoginResponse>('http://localhost:3000/users/login', { email: email, password: password })
            return response.data
        }
        catch (error) {
            if (error instanceof AxiosError) {
                this.toasterService.showError(error?.response?.data?.message || 'Server Error')
            }
            else {
                console.error(error)
                this.toasterService.showError('Error')
            }
        }
    }

    async register(name: string, email: string, password: string, confirmPassword: string): Promise<UsersRegisterResponse | undefined> {
        try {
            const response = await axios.post<UsersRegisterResponse>('http://localhost:3000/users/register', { name, email, password, confirmPassword })
            return response.data
        }
        catch (error) {
            if (error instanceof AxiosError) {
                this.toasterService.showError(error?.response?.data?.message || 'Server Error')
            }
            else {
                console.error(error)
                this.toasterService.showError('Error')
            }
        }
    }

    async profile(): Promise<UsersProfileResponse | undefined> {
        try {
            const accessToken = this.storageService.getFromStorage('accessToken')
            if (accessToken) {
                const response = await axios.get<UsersProfileResponse>('http://localhost:3000/users/profile', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                return response.data
            }
        }
        catch (error) {
            if (error instanceof AxiosError) {
                this.toasterService.showError(error?.response?.data?.message || 'Server Error')
            }
            else {
                console.error(error)
                this.toasterService.showError('Error')
            }
        }
    }

    async updateProfile(name: string): Promise<UsersUpdateProfileResponse | undefined> {
        try {
            const accessToken = this.storageService.getFromStorage('accessToken')
            if (accessToken) {
                const response = await axios.patch<UsersUpdateProfileResponse>(
                    'http://localhost:3000/users/profile',
                        {
                            name
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            },
                        }
                    )
                return response.data
            }
        }
        catch (error) {
            if (error instanceof AxiosError) {
                this.toasterService.showError(error?.response?.data?.message || 'Server Error')
            }
            else {
                console.error(error)
                this.toasterService.showError('Error')
            }
        }
    }

    async logout(): Promise<UsersLogoutResponse | undefined> {
        try {
            const accessToken = this.storageService.getFromStorage('accessToken')
            if (accessToken) {
                const response = await axios.post<UsersLogoutResponse>(
                    'http://localhost:3000/users/logout',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        },
                    }
                )
                return response.data
            }
        }
        catch (error) {
            if (error instanceof AxiosError) {
            }
            else {
                console.error(error)
            }
        }
    }
}