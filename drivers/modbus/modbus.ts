import ModbusRTU from "modbus-serial";

export class LunaModbus {
  client: ModbusRTU;
  isConnected: boolean = false;
  ip: string = "";
  port: number = 502;
  reconnectCounter: number = 0;
  registers = {
    rated_power: [30073, 2, "U32", "Rated power"],
  };
  timer: NodeJS.Timeout | null = null;
  POLLING_INTERVAL: number = 4000;

  constructor(ip: string, port: number = 502) {
    this.ip = ip;
    this.port = port;
    this.client = new ModbusRTU();
    this.timer = setTimeout(() => {
      this.pollInverter();
    }, this.POLLING_INTERVAL);
    this.connect();
  }

  connect(tcpConnection = true) {
    if (tcpConnection) {
      this.client
        .connectTCP(this.ip, { port: this.port })
        .then(() => this.onConnected())
        .catch((err) => this.onFailedToConnect(err));
    } else {
      this.client
        .connectTelnet(this.ip, { port: this.port })
        .then(() => this.onConnected())
        .catch((err) => this.onFailedToConnect(err));
    }
  }

  onConnected() {
    this.isConnected = true;
    console.log(`Connected to ${this.ip}`);
    this.pollInverter();
  }

  onFailedToConnect(err: string) {
    this.isConnected = false;
    console.log(`Unable to connect to ${this.ip}:${this.port} --> ${err}`);
  }

  reconnect(ip: string, port: number) {
    this.reconnectCounter = 0;
    this.client.close(() => {
      console.log("Reconnecting...");
    });
    this.connect();
  }

  checkConnection() {
    if (this.reconnectCounter > 5) {
      this.reconnect(this.ip, this.port);
    } else {
      this.reconnectCounter += 1;
    }
  }

  async readRegisters(start: number, count: number) {
    return new Promise<{
      holdingRegisters: number[];
    }>(async (resolve, reject) => {
      const result = {
        holdingRegisters: [],
      } as {
        holdingRegisters: number[];
      };
      let holdingRegisters;

      const timeout = setTimeout(() => {
        reject("Modbus timeout");
      }, 2000);
      try {
        this.client.setID(1);

        holdingRegisters = await this.client.readHoldingRegisters(start, count);
        this.client.close;
      } catch (err: any) {
        clearTimeout(timeout);
        reject(err?.message || "Modbus timeout");
      }

      if (holdingRegisters) {
        result.holdingRegisters = holdingRegisters.data;
      }
      clearTimeout(timeout);
      resolve(result);
    });
  }

  async pollInverter() {
    // this.checkConnection();
    // if (this.isConnected) {
    try {
      // registers = {
      //     rated_power: [30073, 2, "U32", "Rated power"],
      //     input_power: [32064, 2, "I32", "Input power"],
      //   };
      const results = await this.readRegisters(30073, 2);
      this.reconnectCounter = 0;
      console.log(results);
    } catch (err) {
      console.log(err);
    }
    // }

    this.timer = setTimeout(() => {
      this.pollInverter();
    }, 5000);
  }
}
//   async initializeSession() {
//     console.log("Init connection to: " + this.ip + ":" + modbusPort);
//     // set requests parameters
//     client.setTimeout(10000);
//     // try to connect
//     client.connectTCP(this.ip, { port: modbusPort });
//     client.setID(1);
//     await new Promise((resolve) => setTimeout(resolve, 5000));
//     console.log(client);
//     if (client.isOpen) {
//       return true;
//       // setInterval(function () {
//       //     // console.log(client.readHoldingRegisters(30073, 2));
//       //     this.parseInfo(client, registers);
//       //     console.log(client.isOpen);
//       //     // client.readHoldingRegisters(30073, 2, function (err, data) {
//       //     //     console.log(data);
//       //     // });
//       // }, 1000);
//       // console.log("Connected to: " + this.ip + ":" + modbusPort);
//       // client.readHoldingRegisters(30073, 2).then(console.log);
//       // client.readHoldingRegisters(30073, 2, function (err, data) {
//       //     console.log(data);
//       // });
//       // this.parseData(client, registers);
//     } else {
//       console.log("Failed to connect to: " + this.ip + ":" + modbusPort);
//       return false;
//     }
//   }

//   async parseInfo(client: any, data: object) {
//     return true;
//     // for (const [key, value] of Object.entries(data)) {
//     //     try {
//     //         console.log(value[0], value[1]);
//     //         const res = client.readHoldingRegisters(value[0], value[1]);
//     //         console.log(res);
//     //         return res

//     //         switch (value2) {
//     //             case 'UINT16':
//     //                 resultValue = response.buffer.readInt16BE().toString();
//     //                 break;
//     //             case 'U32':
//     //                 resultValue = response.buffer.readUInt32BE().toString();
//     //                 break;
//     //             case 'SEFLOAT':
//     //                 resultValue = response.buffer.swap16().swap32().readFloatBE().toString();
//     //                 break;
//     //             case 'STRING':
//     //                 resultValue = response.buffer.toString();
//     //                 break;
//     //             case 'UINT64':
//     //                 resultValue = response.buffer.readBigUInt64LE().toString();
//     //                 break;
//     //             case 'INT16':
//     //                 resultValue = response.buffer.readInt16BE().toString();
//     //                 break;
//     //             case 'SCALE':
//     //                 resultValue = response.buffer.readInt16BE().toString();
//     //                 if (resultValue) {
//     //                     result[key + '-' + key2.replace('_scale', '')].scale = resultValue
//     //                 }
//     //                 break;
//     //             default:
//     //                 console.log(key2 + ": type not found " + value2[2]);
//     //                 break;
//     //         }
//     //     } catch {

//     //     }
//   }
//   // client.readHoldingRegisters(37004, 1, function (err, data) {
//   //     try {
//   //         console.log(data);
//   //         console.log(data.buffer.readInt16BE().toString());
//   //         // console.log(data.buffer.toString('latin1'));
//   //     } catch (error) {
//   //         console.log(error);
//   //     }

//   // const bla = this.conversion(data.data);
// }

module.exports = { LunaModbus };

// const modbus = new LunaModbus("172.30.27.38");
// // modbus.connect();
// let bla = await modbus.pollInverter();
// console.log(bla);

// 172.30.27.38
