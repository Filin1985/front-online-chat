export interface UsersApiServiceInterface {
    login(email: string, password: string): Promise<UsersLoginResponse | undefined>;
    register(name: string, email: string, password: string, confirmPassword: string): Promise<UsersRegisterResponse | undefined>;
    profile(): Promise<UsersProfileResponse | undefined>;
    updateProfile(name: string): Promise<UsersUpdateProfileResponse | undefined>;
    logout(): Promise<UsersLogoutResponse | undefined>;
}

export interface UsersLoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface UsersRegisterResponse {
    id: number
    name: string
    email: string
}

export interface UsersProfileResponse {
    id: number
    name: string
    email: string
}

export interface UsersUpdateProfileResponse {
    message: string
}

export interface UsersLogoutResponse {
    message: string
}