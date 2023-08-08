// create an empty modbus client
const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

// open connection to a tcp line
client.connectTCP("172.30.27.38", { port: 502 });
client.setID(1);

// read the values of 10 registers starting at address 0
// on device number 1. and log the values to the console.
setInterval(function () {
  client.readHoldingRegisters(30073, 2, function (err, data) {
    console.log(data);
    console.log(err);
  });
}, 30000);
// // create an empty modbus client
// const ModbusRTU = require("modbus-serial");
// const client = new ModbusRTU();

// // open connection to a tcp line
// client.connectTCP("172.30.27.38", { port: 502 });
// client.setID(1);

// // read the values of 10 registers starting at address 0
// // on device number 1. and log the values to the console.
// setInterval(function () {
//   client.readHoldingRegisters(30000, 15, function (err: any, data: any) {
//     console.log(data);
//     console.log(err);
//   });
// }, 30000);
// // // create an empty modbus client
// // var ModbusRTU = require("modbus-serial");
// // var client = new ModbusRTU();

// // // open connection to a tcp line
// // client.connectTCP("172.30.27.38", { port: 502, baudRate: 9600 });
// // client.setID(1);
// // client.setTimeout(5000);

// // // read the values of 10 registers starting at address 0
// // // on device number 1. and log the values to the console.

// // //

// // // DEFAULT_TCP_PORT = 502
// // // DEFAULT_BAUDRATE = 9600

// // // DEFAULT_SLAVE = 0
// // // DEFAULT_TIMEOUT = 10  # especially the SDongle can react quite slowly
// // // DEFAULT_WAIT = 1
// // // DEFAULT_COOLDOWN_TIME = 0.05
// // // WAIT_FOR_CONNECTION_TIMEOUT = 5
// // setInterval(function () {
// //   let data: any = {
// //     rated_power: [30073, 2, "U32", "Rated power"],
// //     input_power: [32064, 2, "U32", "Input power"],
// //   };
// //   for (const [key, value] of Object.entries(data)) {
// //     console.log(value);
// //     setTimeout(() => {
// //       console.log("wait1");
// //     }, 35000);
// //     client.readHoldingRegisters(
// //       value[0],
// //       value[1],
// //       function (err: any, data: any) {
// //         console.log(data);
// //         console.log(err);
// //       }
// //     );

// //     console.log("wait2");
// //     // try {
// //     //   console.log(value[0], value[1]);
// //     //   client.readHoldingRegisters(
// //     //     value[0],
// //     //     value[1],
// //     //     function (err: any, data: any) {
// //     //       console.log(data);
// //     //     }
// //     //   );
// //     //   setTimeout(() => {
// //     //     console.log("wait1");
// //     //   }, 1000);
// //     // } catch (err) {
// //     //   console.log(err);
// //     // }
// //     // setTimeout(() => {
// //     //   console.log("wait2");
// //     // }, 400);
// //   }
// // }, 35000);

// // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
