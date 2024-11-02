import { Socket, io } from 'socket.io-client'

const HOST = process.env.NEXT_PUBLIC_SOCKET_HOST

export class SocketApi {
  static socket: null | Socket

  static disconnect() {
    this.socket?.disconnect()
    this.socket = null
  }

  static createConnection(token: string, uId: string) {
    this.socket = io(`${HOST}?token=${token}`, { auth: { token } })

    this.socket.on('connect', () => {
      console.log(`socket connected on: ${HOST}`)
    })

    this.socket.on('disconnect', () => {
      console.log(`socket disconnect from: ${HOST}`)
    })

    this.socket.on('connect_error', (error) => {
      console.log(error.name, 'error')
    })
  }
}
