// setup serial
serial.setBaudRate(9600);

// settings
const READDELAYMS = 10;
const CMD_PIN = DigitalPin.P15;
const DATA_PIN = DigitalPin.P14;
const CLK_PIN = DigitalPin.P13;
const ATT_PIN = DigitalPin.P16;
const MODE = ANALOGMODE;

let lastData = [-1, -1, -1, -1];

// init controller
if (!initializeController()) {
    serial.writeLine("nah it brokie");
} else {
    serial.writeLine("init success :)");

    // read inputs in a loop
    while (true) {
        readPS2();

        const arr = [
            ~rawData[3] & btnChangedState[0],
            ~rawData[4] & btnChangedState[1],
            rawData[3] & btnChangedState[0],
            rawData[4] & btnChangedState[1],
        ];
        if (JSON.stringify(lastData) != JSON.stringify(arr)) {
            serial.writeNumber(~rawData[3] & btnChangedState[0]);
            serial.writeString(".");
            serial.writeNumber(~rawData[4] & btnChangedState[1]);
            serial.writeString(".");
            serial.writeNumber(rawData[3] & btnChangedState[0]);
            serial.writeString(".");
            serial.writeNumber(rawData[4] & btnChangedState[1]);
            serial.writeString(",");
            lastData = arr;
        }

        let btnDowns = [
            ~rawData[3] & btnChangedState[0],
            ~rawData[4] & btnChangedState[1],
        ];
        let btnUps = [
            rawData[3] & btnChangedState[0],
            rawData[4] & btnChangedState[1],
        ];

        /*if (CHK(btnDowns[0], BTN_SELECT))
            serial.writeLine("BTN_SELECT has been pushed DOWN");
        else if (CHK(btnUps[0], BTN_SELECT))
            serial.writeLine("BTN_SELECT has been RELEASED");

        if (CHK(btnDowns[0], BTN_START))
            serial.writeLine("BTN_START has been pushed DOWN");
        else if (CHK(btnUps[0], BTN_START))
            serial.writeLine("BTN_START has been RELEASED");

        if (CHK(btnDowns[0], BTN_LEFT_JOY))
            serial.writeLine("BTN_LEFT_JOY has been pushed DOWN");
        else if (CHK(btnUps[0], BTN_LEFT_JOY))
            serial.writeLine("BTN_LEFT_JOY has been RELEASED");

        if (CHK(btnDowns[0], BTN_RIGHT_JOY))
            serial.writeLine("BTN_RIGHT_JOY has been pushed DOWN");
        else if (CHK(btnUps[0], BTN_RIGHT_JOY))
            serial.writeLine("BTN_RIGHT_JOY has been RELEASED");

        if (CHK(btnDowns[0], BTN_UP))
            serial.writeLine("BTN_UP has been pushed DOWN");
        else if (CHK(btnUps[0], BTN_UP))
            serial.writeLine("BTN_UP has been RELEASED");

        if (CHK(btnDowns[0], BTN_RIGHT))
            serial.writeLine("BTN_RIGHT has been pushed DOWN");
        else if (CHK(btnUps[0], BTN_RIGHT))
            serial.writeLine("BTN_RIGHT has been RELEASED");

        if (CHK(btnDowns[0], BTN_DOWN))
            serial.writeLine("BTN_DOWN has been pushed DOWN");
        else if (CHK(btnUps[0], BTN_DOWN))
            serial.writeLine("BTN_DOWN has been RELEASED");

        if (CHK(btnDowns[0], BTN_LEFT))
            serial.writeLine("BTN_LEFT has been pushed DOWN");
        else if (CHK(btnUps[0], BTN_LEFT))
            serial.writeLine("BTN_LEFT has been RELEASED");

        if (CHK(btnDowns[1], BTN_L2))
            serial.writeLine("BTN_L2 has been pushed DOWN");
        else if (CHK(btnUps[1], BTN_L2))
            serial.writeLine("BTN_L2 has been RELEASED");

        if (CHK(btnDowns[1], BTN_R2))
            serial.writeLine("BTN_R2 has been pushed DOWN");
        else if (CHK(btnUps[1], BTN_R2))
            serial.writeLine("BTN_R2 has been RELEASED");

        if (CHK(btnDowns[1], BTN_L1))
            serial.writeLine("BTN_L1 has been pushed DOWN");
        else if (CHK(btnUps[1], BTN_L1))
            serial.writeLine("BTN_L1 has been RELEASED");

        if (CHK(btnDowns[1], BTN_R1))
            serial.writeLine("BTN_R1 has been pushed DOWN");
        else if (CHK(btnUps[1], BTN_R1))
            serial.writeLine("BTN_R1 has been RELEASED");

        if (CHK(btnDowns[1], BTN_TRIANGLE))
            serial.writeLine("BTN_TRIANGLE has been pushed DOWN");
        else if (CHK(btnUps[1], BTN_TRIANGLE))
            serial.writeLine("BTN_TRIANGLE has been RELEASED");

        if (CHK(btnDowns[1], BTN_CIRCLE))
            serial.writeLine("BTN_CIRCLE has been pushed DOWN");
        else if (CHK(btnUps[1], BTN_CIRCLE))
            serial.writeLine("BTN_CIRCLE has been RELEASED");

        if (CHK(btnDowns[1], BTN_CROSS))
            serial.writeLine("BTN_CROSS has been pushed DOWN");
        else if (CHK(btnUps[1], BTN_CROSS))
            serial.writeLine("BTN_CROSS has been RELEASED");

        if (CHK(btnDowns[1], BTN_SQUARE))
            serial.writeLine("BTN_SQUARE has been pushed DOWN");
        else if (CHK(btnUps[1], BTN_SQUARE))
            serial.writeLine("BTN_SQUARE has been RELEASED");*/

        basic.pause(READDELAYMS);
    }
}
