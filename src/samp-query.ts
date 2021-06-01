import { createSocket, Socket } from "dgram";

export type SAMP_INFO = {
    havePassword: number,
    hostname: string,
    gamemode: string,
    players: number,
    maxplayers: number,
    mapname: string,
    lang: string
}


class Query {
    public static async serverInfo(hostname: any, port?: number): Promise<SAMP_INFO> {
        if (port === undefined) {
            port = 7777;
        }

        const socket: Socket = createSocket("udp4");
        const packet = Buffer.alloc(11);
        let object = <SAMP_INFO>{};

        packet.write('SAMP');

        for(var i = 0; i < 4; ++i) {
            packet[i + 4] = hostname.split('.')[i];
        }

        packet[8] = port & 0xFF;
        packet[9] = port >> 8 & 0xFF;
        packet[10] = 105;

        try {
            socket.send(packet, 0, packet.length, port, hostname);
        }
        catch (error){
            console.log(error);
        }

        socket.on('message', function(message) {
            socket.close();
            
            let offset: number = 0;

            if (message.length < 11) {
                console.log("[error] invalid socket");
                return;
            }

            message = message.slice(11);

            object.havePassword = message.readUInt8(offset);
            object.players = message.readUInt16LE(offset += 1);
            object.maxplayers = message.readUInt16LE(offset += 2);

            let num: number = message.readUInt16LE(offset += 2);
            object.hostname = message.slice(offset += 4, offset += num).toString();

            num = message.readUInt16LE(offset);
            object.gamemode = message.slice(offset += 4, offset += num).toString();

            num = message.readUInt16LE(offset);
            object.lang = message.slice(offset += 4, offset += num).toString();	
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        return object;
    }
}

export { Query };
