// setup serial
serial.setBaudRate(115200);

// settings
const READDELAYMS = 10;
const CMD_PIN = DigitalPin.P15;
const DATA_PIN = DigitalPin.P14;
const CLK_PIN = DigitalPin.P13;
const ATT_PIN = DigitalPin.P16;
const MODE = ANALOGMODE;

// vars
let lastData;

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
            if (lastData !== rawData.join(',')) {
                serial.writeString(rawData.join(',') + '.');
                lastData = rawData.join(',');
            }
            basic.pause(READDELAYMS);
        }
    }
}
