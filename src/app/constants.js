export const AppStates = Object.freeze({
    READY: Symbol("ready"),
    RESETTING: Symbol("resetting"),
    CASTING_RNG: Symbol("casting_rng"),
    CAST_FINISH: Symbol("cast_finish"),
    CAST_FINISH_BEACON: Symbol("cast_finish_beacon"),
    FROM_BEACON_URL: Symbol("from_beacon_url"),
});

export const YinYang = Object.freeze({
    OLD_YIN: Symbol("old yin (6)"),
    YOUNG_YIN: Symbol("young yin (8)"),
    OLD_YANG: Symbol("old yang (9)"),
    YOUNG_YANG: Symbol("young yang (7)"),
});

export const YinYangInvert = Object.freeze({
    [YinYang.OLD_YIN]: YinYang.OLD_YANG,
    [YinYang.OLD_YANG]: YinYang.OLD_YIN,
    [YinYang.YOUNG_YIN]: YinYang.YOUNG_YANG,
    [YinYang.YOUNG_YANG]: YinYang.YOUNG_YIN,
});

export const KING_WEN_SEQ = Object.freeze([
    "111111", "000000", "100010", "010001",
    "111010", "010111", "010000", "000010",
    "111011", "110111", "111000", "000111",
    "101111", "111101", "001000", "000100",
    "100110", "011001", "110000", "000011",
    "100101", "101001", "000001", "100000",
    "100111", "111001", "100001", "011110",
    "010010", "101101", "001110", "011100",
    "001111", "111100", "000101", "101000",
    "101011", "110101", "001010", "010100",
    "110001", "100011", "111110", "011111",
    "000110", "011000", "010110", "011010",
    "101110", "011101", "100100", "001001",
    "001011", "110100", "101100", "001101",
    "011011", "110110", "010011", "110010",
    "110011", "001100", "101010", "010101"
]);

export const YARROW_STALK_TABLE = Object.freeze({
    0b0000: YinYang.OLD_YIN,
    0b0001: YinYang.OLD_YANG,
    0b0010: YinYang.OLD_YANG,
    0b0011: YinYang.OLD_YANG,
    0b0100: YinYang.YOUNG_YANG,
    0b0101: YinYang.YOUNG_YANG,
    0b0110: YinYang.YOUNG_YANG,
    0b0111: YinYang.YOUNG_YANG,
    0b1000: YinYang.YOUNG_YANG,
    0b1001: YinYang.YOUNG_YIN,
    0b1010: YinYang.YOUNG_YIN,
    0b1011: YinYang.YOUNG_YIN,
    0b1100: YinYang.YOUNG_YIN,
    0b1101: YinYang.YOUNG_YIN,
    0b1110: YinYang.YOUNG_YIN,
    0b1111: YinYang.YOUNG_YIN,
});

export const LINE_DRAW_TIME = 600;
export const HEXAGRAM_LINES = 6;