"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsmodbus_1 = require("jsmodbus");
var net_1 = require("net");
var socket = new net_1.Socket();
var options = {
    host: "172.30.27.38",
    port: 502,
};
var client = new jsmodbus_1.Modbus.client.TCP(socket);
var readStart = 30073;
var readCount = 2;
socket.on("connect", function () {
    client
        .readHoldingRegisters(readStart, readCount)
        .then(function (_a) {
        var metrics = _a.metrics, request = _a.request, response = _a.response;
        console.log("Transfer Time: " + metrics.transferTime);
        console.log("Response Body Payload: " + response.body.valuesAsArray);
        console.log("Response Body Payload As Buffer: " + response.body.valuesAsBuffer);
    })
        .catch(handleErrors)
        .finally(function () { return socket.end(); });
});
socket.on("error", console.error);
socket.connect(options);
function handleErrors(err) {
    if (jsmodbus_1.Modbus.errors.isUserRequestError(err)) {
        switch (err.err) {
            case "OutOfSync":
            case "Protocol":
            case "Timeout":
            case "ManuallyCleared":
            case "ModbusException":
            case "Offline":
            case "crcMismatch":
                console.log("Error Message: " + err.message, "Error" + "Modbus Error Type: " + err.err);
                break;
        }
    }
    else if (jsmodbus_1.Modbus.errors.isInternalException(err)) {
        console.log("Error Message: " + err.message, "Error" + "Error Name: " + err.name, err.stack);
    }
    else {
        console.log("Unknown Error", err);
    }
}
