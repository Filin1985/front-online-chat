import {StorageServiceInterface} from "shared/services/storage.service"
import {io, Socket} from "socket.io-client"

export class ChatService {
  socket: Socket | null = null

  constructor(private storageService: StorageServiceInterface) {
    this.connect()
  }

  private connect() {
    const accessToken = this.storageService.getFromStorage("accessToken")

    this.socket = io("http://localhost:3000", {
      auth: {
        token: accessToken,
      },
    })

    this.socket.on("connect", () => {})
  }
}
