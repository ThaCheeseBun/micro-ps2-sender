// variables
let readDelay = 1;
let rawData = pins.createBuffer(21);
let controllerMode = 0;

// Bit operation helpers
function SET(x: number, y: number) {
    x |= (1 << y);
    return x;
}
function CLR(x: number, y: number) {
    x &= (~(1 << y))
    return x;
}
function CHK(x: number, y: number) {
    return x & (1 << y);
}
function TOG(x: number, y: number) {
    x ^= (1 << y);
    return x;
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
        transmitCmdString(enterConfigMode);
        // enable analog mode
        transmitCmdString(set_mode_analog_lock);
        // exit config mode
        transmitCmdString(exitConfigMode);

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
    let RXdata = 0;

    for (let i = 0; i < 8; i++) {
        // if bit is 1 set 1
        if (CHK(byte, i))
            pins.digitalWritePin(CMD_PIN, 1);
        else
            pins.digitalWritePin(CMD_PIN, 0);

        // enable clock
        pins.digitalWritePin(CLK_PIN, 0);
        // wait a bit
        control.waitMicros(CLK_DELAY);

        // if data high, save it
        if (pins.digitalReadPin(DATA_PIN))
            RXdata = SET(RXdata, i);

        // done, disable clock
        pins.digitalWritePin(CLK_PIN, 1);
        control.waitMicros(CLK_DELAY);
    }

    // done with the byte, reset command pin
    pins.digitalWritePin(CMD_PIN, 1);
    control.waitMicros(BYTE_DELAY);
    return RXdata;
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
    /*let last_read = 0;
    let timeSince = 1000 - last_read;
    if (timeSince > 1500)
        reInitializeController();
    if (timeSince < readDelay)
        control.waitMicros(readDelay - timeSince);*/

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
    //last_read = millis()
}

// reinit controller for other mode
function reInitializeController(mode: number) {
    controllerMode = mode;
    if (controllerMode != ANALOGMODE && controllerMode != ALLPRESSUREMODE)
        return -1;

    for (let initAttempts = 1; initAttempts < MAX_INIT_ATTEMPT; initAttempts++)
    {
        transmitCmdString(enterConfigMode);
        transmitCmdString(set_mode_analog_lock);
        if (controllerMode == ALLPRESSUREMODE)
            transmitCmdString(config_AllPressure);
        transmitCmdString(exitConfigMode);
        readPS2();
        if (rawData.getNumber(NumberFormat.UInt8LE, 1) == controllerMode)
            return 1;
        basic.pause(readDelay);
    }
    return -2;
}
