import LocalStorageService from "shared/services/storage.service"
import {ChatService} from "./services/chat.service"

const localStorageService = new LocalStorageService()
const chatService = new ChatService(localStorageService)
