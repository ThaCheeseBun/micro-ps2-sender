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
    //serial.writeLine("nah it brokie");
    basic.showIcon(IconNames.Sad);
} else {
    //serial.writeLine("init success :)");
    basic.showIcon(IconNames.Happy);

    // read inputs in a loop
    while (true) {
        readPS2();

        const arr = [
            ~rawData[3] & btnChangedState[0],
            ~rawData[4] & btnChangedState[1],
            rawData[3] & btnChangedState[0],
            rawData[4] & btnChangedState[1],
        ];
        if (lastData != JSON.stringify(arr)) {
            serial.writeString(arr.join(',') + '.');
            lastData = JSON.stringify(arr);
        }

        basic.pause(READDELAYMS);
    }
}
