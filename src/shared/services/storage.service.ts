export interface StorageServiceInterface {
    addToStorage: (key: string, value: string) => void;
    removeFromStorage: (key: string) => void;
    getFromStorage: (key: string) => string | null;
    clearStorage: () => void;
}

export default class LocalStorageService implements StorageServiceInterface {
    addToStorage(key: string, value: string): void {
        if (!this.isKeyExists(key)) {
            return
        }
        localStorage.setItem(key, value)
    }
    removeFromStorage(key: string): void {
        if (!this.isKeyExists(key)) {
            return
        }
        localStorage.removeItem(key)
    }
    getFromStorage(key: string): string | null {
        if (!this.isKeyExists(key)) {
            return null
        }
        return localStorage.getItem(key)
    }
    clearStorage() {
        localStorage.clear()
    }

    private isKeyExists(key: string): boolean {
        if (!key) {
            console.error('Storage key is missing')
            return false
        }
        return true
    }
}