import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'
import { corsList } from './cors'

class Ws {
  public io: Server
  private booted = false

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(AdonisServer.instance!, {
      cors: {
        origin: corsList,
        credentials: true
      }
    });
  }
}

export default new Ws()
