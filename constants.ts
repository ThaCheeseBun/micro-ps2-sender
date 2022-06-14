/* Delays */
const CLK_DELAY = 4;
const BYTE_DELAY = 3;
const CMD_DELAY = 1;
const MAX_READ_DELAY = 10;

/* Maximum number of init tries */
const MAX_INIT_ATTEMPT = 50;

/* Controller Modes - From: http://www.lynxmotion.com/images/files/ps2cmd01.txt */
const DIGITALMODE = 0x41;
const ANALOGMODE = 0x73;
const ALLPRESSUREMODE = 0x79;
const DS2NATIVEMODE = 0xF3;

/* Button Masks */
// From data bit 0 (PS2data[3])
const BTN_SELECT = 0;
const BTN_LEFT_JOY = 1;
const BTN_RIGHT_JOY = 2;
const BTN_START = 3;
const BTN_UP = 4;
const BTN_RIGHT = 5;
const BTN_DOWN = 6;
const BTN_LEFT = 7;
// From data bit 1 (PSdata[4])
const BTN_L2 = 0;
const BTN_R2 = 1;
const BTN_L1 = 2;
const BTN_R1 = 3;
const BTN_TRIANGLE = 4;
const BTN_CIRCLE = 5;
const BTN_CROSS = 6;
const BTN_SQUARE = 7;

// Byte Numbers of PSdata[] For Button Pressures
const PRES_RIGHT = 10;
const PRES_LEFT = 11;
const PRES_UP = 12;
const PRES_DOWN = 13;
const PRES_TRIANGLE = 14;
const PRES_CIRCLE = 15;
const PRES_CROSS = 16;
const PRES_SQUARE = 17;
const PRES_L1 = 18;
const PRES_R1 = 19;
const PRES_L2 = 20;
const PRES_R2 = 21;

/* Controller Commands */
const enterConfigMode = [0x01, 0x43, 0x00, 0x01, 0x00];
const set_mode_analog_lock = [0x01, 0x44, 0x00, 0x01, 0x03, 0x00, 0x00, 0x00, 0x00];
const exitConfigMode = [0x01, 0x43, 0x00, 0x00, 0x5A, 0x5A, 0x5A, 0x5A, 0x5A];
const type_read = [0x01, 0x45, 0x00, 0x5A, 0x5A, 0x5A, 0x5A, 0x5A, 0x5A];
const config_AllPressure = [0x01, 0x4F, 0x00, 0xFF, 0xFF, 0x03, 0x00, 0x00, 0x00];
