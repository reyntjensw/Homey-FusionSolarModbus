'use strict'

const modbus = require('jsmodbus')
const net = require('net')
const socket = new net.Socket()
const options = {
  'host': '172.30.27.38',
    'port': '502',
  'baudRate': '9600'

}
const client = new modbus.client.TCP(socket,1)

socket.on('connect', function () {
  client.readHoldingRegisters(30073, 2)
    .then(function (resp) {
      console.log(resp.response._body.valuesAsArray)
      socket.end()
    }).catch(function () {
        console.log("error: ")
      console.error(require('util').inspect(arguments, {
        depth: null
      }))
      socket.end()
    })
})

socket.on('error', console.error)
socket.connect(options)
