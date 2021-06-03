import { createSocket, Socket } from "dgram";

export interface SAMP_INFO {
    havePassword: number,
    hostname: string,
    gamemode: string,
    players: number,
    maxplayers: number,
    mapname: string,
    lang: string
}

class Message {
    private message_: any;
    private offset_: number = 0;
  
    constructor(message: any) {
      this.message_ = message.slice(11);
    }
  
    readUInt8 = () => {
      const ret = this.message_.readUInt8(this.offset_);
      this.offset_ += 1;
      return ret;
    }
  
    readUInt16LE = () => {
      const ret = this.message_.readUInt16LE(this.offset_);
      this.offset_ += 2;
      return ret;
    }
  
    readString = () => {
      const offset = this.offset_;
      const len = this.message_.readUInt16LE(offset);
      const ret = this.message_.slice(offset + 4, offset + 4 + len);
      this.offset_ += 4 + len;
      return ret.toString();
    }
  }

export async function serverInfo(hostname: any, port?: number): Promise<SAMP_INFO> {
  if (port === undefined) {
  	port = 7777;
  }

  return new Promise((resolve: Function, reject: Function) => {
      const socket: Socket = createSocket("udp4");
      const packet = Buffer.alloc(11);

      packet.write('SAMP');

      for(var i = 0; i < 4; ++i) {
          packet[i + 4] = hostname.split('.')[i];
      }

      packet[8] = port & 0xFF;
      packet[9] = port >> 8 & 0xFF;
      packet[10] = 105;

      socket.on("error", function(error) {
          reject(error);
      });

      socket.on('message', function(message) {
          socket.close();

          if (message.length < 11) {
              reject("invalid socket");
              return;
          }

          const m = new Message(message);
          resolve({
            havePassword: m.readUInt8(),
            players: m.readUInt16LE(),
            maxplayers: m.readUInt16LE(),
            hostname: m.readString(),
            gamemode: m.readString(),
            lang: m.readString(),
          });
      });

      try {
          socket.send(packet, 0, packet.length, port, hostname);
      }
      catch (error){
          reject(error);
      }
  });
}
