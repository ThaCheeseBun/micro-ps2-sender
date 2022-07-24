/* Delays */
const CLK_DELAY = 4;
const BYTE_DELAY = 3;
const CMD_DELAY = 1;
const MAX_READ_DELAY = 10;

/* Maximum number of init tries */
const MAX_INIT_ATTEMPT = 50;

/* Controller Modes - From: http://www.lynxmotion.com/images/files/ps2cmd01.txt */
const DIGITAL_MODE = 0x41;
const ANALOG_MODE = 0x73;
const ALL_PRESSURE_MODE = 0x79;
const DS2_NATIVE_MODE = 0xF3;

/* Controller Commands */
const ENTER_CONFIG_MODE = [0x01, 0x43, 0x00, 0x01, 0x00];
const SET_MODE_ANALOG_LOCK = [0x01, 0x44, 0x00, 0x01, 0x03, 0x00, 0x00, 0x00, 0x00];
const EXIT_CONFIG_MODE = [0x01, 0x43, 0x00, 0x00, 0x5A, 0x5A, 0x5A, 0x5A, 0x5A];
const TYPE_READ = [0x01, 0x45, 0x00, 0x5A, 0x5A, 0x5A, 0x5A, 0x5A, 0x5A];
const CONFIG_ALL_PRESSURE = [0x01, 0x4F, 0x00, 0xFF, 0xFF, 0x03, 0x00, 0x00, 0x00];

// setup serial
serial.setBaudRate(115200);
serial.setTxBufferSize(21);

// settings
//const READDELAYMS = 10;
const CMD_PIN = DigitalPin.P15;
const DATA_PIN = DigitalPin.P14;
const CLK_PIN = DigitalPin.P13;
const ATT_PIN = DigitalPin.P16;
const MODE = ANALOG_MODE;

// variables
let readDelay = 1;
let rawData = pins.createBuffer(21);
let controllerMode = 0;

// init controller
if (!initializeController()) {
    basic.showIcon(IconNames.Sad);
} else {
    if (!reInitializeController(ALL_PRESSURE_MODE)) {
        basic.showIcon(IconNames.Sad);
    } else {
        // read inputs in a loop
        while (true) {
            readPS2();
            serial.writeBuffer(rawData);
            //basic.pause(READDELAYMS);
        }
    }
}

// init controller
function initializeController() {

    // get set mode
    controllerMode = MODE;

    // set data pin to pull up mode
    pins.setPull(DATA_PIN, PinPullMode.PullUp);

    // init command and clock pins
    pins.digitalWritePin(CMD_PIN, 1);
    pins.digitalWritePin(CLK_PIN, 1);

    // try to read controller
    readPS2();
    readPS2();

    // try and read until read delay is right
    while (true) {
        // enter config mode
        transmitCmdString(ENTER_CONFIG_MODE);
        // enable analog mode
        transmitCmdString(SET_MODE_ANALOG_LOCK);
        // exit config mode
        transmitCmdString(EXIT_CONFIG_MODE);

        // attempt to read again
        readPS2();

        // if successful, break
        if (rawData.getNumber(NumberFormat.UInt8LE, 1) == MODE)
            break;
        // if we tried 10 times and failed, just quit
        if (readDelay == MAX_READ_DELAY) {
            return 0;
        }
        // increment delay
        readDelay++;
    }
    return 1;
}

// transmit a byte
function transmitByte(byte: number) {
    let rx = 0;

    for (let i = 0; i < 8; i++) {
        // if bit is 1 set 1
        if (byte & (1 << i))
            pins.digitalWritePin(CMD_PIN, 1);
        else
            pins.digitalWritePin(CMD_PIN, 0);

        // enable clock
        pins.digitalWritePin(CLK_PIN, 0);
        // wait a bit
        control.waitMicros(CLK_DELAY);

        // if data high, save it
        if (pins.digitalReadPin(DATA_PIN))
            rx |= (1 << i);

        // done, disable clock
        pins.digitalWritePin(CLK_PIN, 1);
        control.waitMicros(CLK_DELAY);
    }

    // done with the byte, reset command pin
    pins.digitalWritePin(CMD_PIN, 1);
    control.waitMicros(BYTE_DELAY);
    return rx;
}

// transmit array of bytes
function transmitCmdString(str: number[]) {
    // ready, draw attention
    pins.digitalWritePin(ATT_PIN, 0);

    // send data, one byte at a time
    for (let y = 0; y < str.length; y++)
        transmitByte(str[y]);

    // done, release attention
    pins.digitalWritePin(ATT_PIN, 1);
    // wait a bit
    basic.pause(readDelay);
}

// read from the controller, save to rawData
function readPS2() {
    // ensure pins are set correctly before
    pins.digitalWritePin(CMD_PIN, 1);
    pins.digitalWritePin(CLK_PIN, 1);
    pins.digitalWritePin(ATT_PIN, 0);
    // wait a bit
    control.waitMicros(BYTE_DELAY);

    // buffers to send
    const TxRx1 = [0x01, 0x42, 0, 0, 0, 0, 0, 0, 0];
    const TxRx2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // send first 9 bytes
    for (let i = 0; i < 9; i++)
        rawData.setNumber(NumberFormat.UInt8LE, i, transmitByte(TxRx1[i]));

    // get rest if in full data mode
    if (rawData.getNumber(NumberFormat.UInt8LE, 1) == 0x79)
        for (let i = 0; i < 12; i++)
            rawData.setNumber(NumberFormat.UInt8LE, i + 9, transmitByte(TxRx2[i]));

    // done, release attention
    pins.digitalWritePin(ATT_PIN, 1);
}

// reinit controller for other mode
function reInitializeController(mode: number) {
    controllerMode = mode;
    if (controllerMode != ANALOG_MODE && controllerMode != ALL_PRESSURE_MODE)
        return -1;

    for (let initAttempts = 1; initAttempts < MAX_INIT_ATTEMPT; initAttempts++) {
        transmitCmdString(ENTER_CONFIG_MODE);
        transmitCmdString(SET_MODE_ANALOG_LOCK);
        if (controllerMode == ALL_PRESSURE_MODE)
            transmitCmdString(CONFIG_ALL_PRESSURE);
        transmitCmdString(EXIT_CONFIG_MODE);
        readPS2();
        if (rawData.getNumber(NumberFormat.UInt8LE, 1) == controllerMode)
            return 1;
        basic.pause(readDelay);
    }
    return -2;
}
