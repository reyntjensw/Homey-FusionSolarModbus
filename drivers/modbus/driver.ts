import Homey from "homey";
const { v4: uuid } = require("uuid");

class FusionSolarDriver extends Homey.Driver {
  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log("FusionSolarDriver has been initialized");
  }

  /**
   * onPairListDevices is called when a user is adding a device and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPair(session: any) {
    await session.showView("modbus");
    session.setHandler(
      "ip_submitted",
      async (data: { ip: string; port: number }) => {
        const devices = [
          {
            name: "Luna",
            data: {
              id: uuid(),
            },
            settings: {
              ip: data.ip,
              port: data.port,
            },
          },
        ];
        return devices;
      }
    );
  }
}

module.exports = FusionSolarDriver;
