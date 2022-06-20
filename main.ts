// setup serial
serial.setBaudRate(115200);
serial.setTxBufferSize(21);

// settings
const READDELAYMS = 10;
const CMD_PIN = DigitalPin.P15;
const DATA_PIN = DigitalPin.P14;
const CLK_PIN = DigitalPin.P13;
const ATT_PIN = DigitalPin.P16;
const MODE = ANALOGMODE;

// vars
let lastData = pins.createBuffer(21);

// init controller
if (!initializeController()) {
    basic.showIcon(IconNames.Sad);
} else {
    if (!reInitializeController(ALLPRESSUREMODE)) {
        basic.showIcon(IconNames.Sad);
    } else {
        // read inputs in a loop
        while (true) {
            readPS2();
            if (lastData !== rawData) {
                serial.writeBuffer(rawData);
                lastData.write(0, rawData);
            }
            

            
            basic.pause(READDELAYMS);
        }
    }
}
