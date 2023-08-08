from pyModbusTCP.client import ModbusClient
c = ModbusClient(host="172.30.27.38", port=502, auto_open=True, auto_close=True)
regs = c.read_holding_registers(30073, 2)
print(regs)
if regs:
    print(regs)
else:
    print("read error")
