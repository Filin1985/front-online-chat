import {UsersApiServiceInterface, UsersProfileResponse} from "../../modules/users/service/users-api.types";
import {StorageServiceInterface} from "./storage.service";

export interface UserContextServiceInterface {
    getUser(): UsersProfileResponse | null;
    setUser(userData: UsersProfileResponse | null): void;
    fetchUser(): Promise<UsersProfileResponse | null>;
    subscribe(callback: (userData: UsersProfileResponse | null) => void): () => void;
    isAuthenticated(): boolean;
}

// subscribers = [this.renderDropdown, this.updateFormData]
// setUser -> когда обновляется профиль вызываются все функции из subscribers ([this.renderDropdown, this.updateFormData])

export default class UserContextService implements UserContextServiceInterface {
    private userData: UsersProfileResponse | null = null; // видео на канале
    // функции из разных компонентов которые будут трегериться (запускаться) когда обновляется профиль
    private subscribers: Set<(userData: UsersProfileResponse | null) => void> = new Set();
    private readonly STORAGE_KEY = 'userProfile'

    constructor(private storageService: StorageServiceInterface, private usersApiService: UsersApiServiceInterface) {
        this.init()
    }

    init() {
        this.loadFromStorage()
    }

    getUser(): UsersProfileResponse | null {
        return this.userData;
    }

    // Когда обновляем профиль (userData)
    // появляется новое видео
    setUser(newUserData: UsersProfileResponse | null) {
        this.userData = newUserData;
        this.saveToStorage()
        this.notifySubscribers()
    }

    async fetchUser(): Promise<UsersProfileResponse | null> {
        const userProfile = await this.usersApiService.profile()
        if (userProfile) {
            this.setUser(userProfile)
        }
        else {
            this.setUser(null)
        }
        return this.userData
    }

    subscribe(callback: (userData: (UsersProfileResponse | null)) => void): () => void {
        this.subscribers.add(callback)

        callback(this.userData)

        return () => {
            this.subscribers.delete(callback)
        }
    }

    isAuthenticated(): boolean {
        return this.userData !== null
    }

    private notifySubscribers() {
        this.subscribers.forEach(callback => {
            try {
                callback(this.userData)
            } catch (error) {
                console.error('Error in user context subscribers:', error)
            }
        })
    }

    private loadFromStorage(): void {
        try {
            const storedUserData = this.storageService.getFromStorage(this.STORAGE_KEY)
            if (storedUserData) {
                this.userData = JSON.parse(storedUserData)
            }
        } catch (error) {
            console.error('Error in user context storage:', error)
            this.userData = null
        }
    }

    private saveToStorage(): void {
        if (this.userData) {
            this.storageService.addToStorage(this.STORAGE_KEY, JSON.stringify(this.userData))
        } else {
            this.storageService.removeFromStorage(this.STORAGE_KEY)
        }
    }
}