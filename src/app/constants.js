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

export const ICHING_COMPACT = {
    "1": {
        "hex": 1,
        "pinyin": "Qián",
        "binary": "111111",
        "english": "Initiating",
        "trad_chinese": "乾"
    },
    "2": {
        "hex": 2,
        "pinyin": "Kūn",
        "binary": "000000",
        "english": "Responding",
        "trad_chinese": "坤"
    },
    "3": {
        "hex": 3,
        "pinyin": "Zhūn",
        "binary": "100010",
        "english": "Beginning",
        "trad_chinese": "屯"
    },
    "4": {
        "hex": 4,
        "pinyin": "Méng",
        "binary": "010001",
        "english": "Childhood",
        "trad_chinese": "蒙"
    },
    "5": {
        "hex": 5,
        "pinyin": "Xū",
        "binary": "111010",
        "english": "Needing",
        "trad_chinese": "需"
    },
    "6": {
        "hex": 6,
        "pinyin": "Sòng",
        "binary": "010111",
        "english": "Contention",
        "trad_chinese": "訟"
    },
    "7": {
        "hex": 7,
        "pinyin": "Shī",
        "binary": "010000",
        "english": "Multitude",
        "trad_chinese": "師"
    },
    "8": {
        "hex": 8,
        "pinyin": "Bǐ",
        "binary": "000010",
        "english": "Union",
        "trad_chinese": "比"
    },
    "9": {
        "hex": 9,
        "pinyin": "Xiǎochù",
        "binary": "111011",
        "english": "Little Accumulation",
        "trad_chinese": "小畜"
    },
    "10": {
        "hex": 10,
        "pinyin": "Lǚ",
        "binary": "110111",
        "english": "Fulfillment",
        "trad_chinese": "履"
    },
    "11": {
        "hex": 11,
        "pinyin": "Tài",
        "binary": "111000",
        "english": "Advance",
        "trad_chinese": "泰"
    },
    "12": {
        "hex": 12,
        "pinyin": "Pǐ",
        "binary": "000111",
        "english": "Hindrance",
        "trad_chinese": "否"
    },
    "13": {
        "hex": 13,
        "pinyin": "Tóngrén",
        "binary": "101111",
        "english": "Seeking Harmony",
        "trad_chinese": "同人"
    },
    "14": {
        "hex": 14,
        "pinyin": "Dàyǒu",
        "binary": "111101",
        "english": "Great Harvest",
        "trad_chinese": "大有"
    },
    "15": {
        "hex": 15,
        "pinyin": "Qiān",
        "binary": "001000",
        "english": "Humbleness",
        "trad_chinese": "謙"
    },
    "16": {
        "hex": 16,
        "pinyin": "Yù",
        "binary": "000100",
        "english": "Delight",
        "trad_chinese": "豫"
    },
    "17": {
        "hex": 17,
        "pinyin": "Suí",
        "binary": "100110",
        "english": "Following",
        "trad_chinese": "隨"
    },
    "18": {
        "hex": 18,
        "pinyin": "Gǔ",
        "binary": "011001",
        "english": "Remedying",
        "trad_chinese": "蠱"
    },
    "19": {
        "hex": 19,
        "pinyin": "Lín",
        "binary": "110000",
        "english": "Approaching",
        "trad_chinese": "臨"
    },
    "20": {
        "hex": 20,
        "pinyin": "Guān",
        "binary": "000011",
        "english": "Watching",
        "trad_chinese": "觀"
    },
    "21": {
        "hex": 21,
        "pinyin": "Shìkè",
        "binary": "100101",
        "english": "Eradicating",
        "trad_chinese": "噬嗑"
    },
    "22": {
        "hex": 22,
        "pinyin": "Bì",
        "binary": "101001",
        "english": "Adorning",
        "trad_chinese": "賁"
    },
    "23": {
        "hex": 23,
        "pinyin": "Bō",
        "binary": "000001",
        "english": "Falling Away",
        "trad_chinese": "剝"
    },
    "24": {
        "hex": 24,
        "pinyin": "Fù",
        "binary": "100000",
        "english": "Turning Back",
        "trad_chinese": "復"
    },
    "25": {
        "hex": 25,
        "pinyin": "Wúwàng",
        "binary": "100111",
        "english": "Without Falsehood",
        "trad_chinese": "無妄"
    },
    "26": {
        "hex": 26,
        "pinyin": "Dàchù",
        "binary": "111001",
        "english": "Great Accumulation",
        "trad_chinese": "大畜"
    },
    "27": {
        "hex": 27,
        "pinyin": "Yí",
        "binary": "100001",
        "english": "Nourishing",
        "trad_chinese": "頤"
    },
    "28": {
        "hex": 28,
        "pinyin": "Dàguò",
        "binary": "011110",
        "english": "Great Exceeding",
        "trad_chinese": "大過"
    },
    "29": {
        "hex": 29,
        "pinyin": "Kǎn",
        "binary": "010010",
        "english": "Darkness",
        "trad_chinese": "坎"
    },
    "30": {
        "hex": 30,
        "pinyin": "Lí",
        "binary": "101101",
        "english": "Brightness",
        "trad_chinese": "離"
    },
    "31": {
        "hex": 31,
        "pinyin": "Xián",
        "binary": "001110",
        "english": "Mutual Influence",
        "trad_chinese": "咸"
    },
    "32": {
        "hex": 32,
        "pinyin": "Héng",
        "binary": "011100",
        "english": "Long Lasting",
        "trad_chinese": "恆"
    },
    "33": {
        "hex": 33,
        "pinyin": "Dùn",
        "binary": "001111",
        "english": "Retreat",
        "trad_chinese": "遯"
    },
    "34": {
        "hex": 34,
        "pinyin": "Dàzhuàng",
        "binary": "111100",
        "english": "Great Strength",
        "trad_chinese": "大壯"
    },
    "35": {
        "hex": 35,
        "pinyin": "Jìn",
        "binary": "000101",
        "english": "Proceeding Forward",
        "trad_chinese": "晉"
    },
    "36": {
        "hex": 36,
        "pinyin": "Míngyí",
        "binary": "101000",
        "english": "Brilliance Injured",
        "trad_chinese": "明夷"
    },
    "37": {
        "hex": 37,
        "pinyin": "Jiārén",
        "binary": "101011",
        "english": "Household",
        "trad_chinese": "家人"
    },
    "38": {
        "hex": 38,
        "pinyin": "Kuí",
        "binary": "110101",
        "english": "Diversity",
        "trad_chinese": "睽"
    },
    "39": {
        "hex": 39,
        "pinyin": "Jiǎn",
        "binary": "001010",
        "english": "Hardship",
        "trad_chinese": "蹇"
    },
    "40": {
        "hex": 40,
        "pinyin": "Xiè",
        "binary": "010100",
        "english": "Relief",
        "trad_chinese": "解"
    },
    "41": {
        "hex": 41,
        "pinyin": "Sǔn",
        "binary": "110001",
        "english": "Decreasing",
        "trad_chinese": "損"
    },
    "42": {
        "hex": 42,
        "pinyin": "Yì",
        "binary": "100011",
        "english": "Increasing",
        "trad_chinese": "益"
    },
    "43": {
        "hex": 43,
        "pinyin": "Guài",
        "binary": "111110",
        "english": "Eliminating",
        "trad_chinese": "夬"
    },
    "44": {
        "hex": 44,
        "pinyin": "Gòu",
        "binary": "011111",
        "english": "Encountering",
        "trad_chinese": "姤"
    },
    "45": {
        "hex": 45,
        "pinyin": "Cuì",
        "binary": "000110",
        "english": "Bringing Together",
        "trad_chinese": "萃"
    },
    "46": {
        "hex": 46,
        "pinyin": "Shēng",
        "binary": "011000",
        "english": "Growing Upward",
        "trad_chinese": "升"
    },
    "47": {
        "hex": 47,
        "pinyin": "Kùn",
        "binary": "010110",
        "english": "Exhausting",
        "trad_chinese": "困"
    },
    "48": {
        "hex": 48,
        "pinyin": "Jǐng",
        "binary": "011010",
        "english": "Replenishing",
        "trad_chinese": "井"
    },
    "49": {
        "hex": 49,
        "pinyin": "Gé",
        "binary": "101110",
        "english": "Abolishing The Old",
        "trad_chinese": "革"
    },
    "50": {
        "hex": 50,
        "pinyin": "Dǐng",
        "binary": "011101",
        "english": "Establishing The New",
        "trad_chinese": "鼎"
    },
    "51": {
        "hex": 51,
        "pinyin": "Zhèn",
        "binary": "100100",
        "english": "Taking Action",
        "trad_chinese": "震"
    },
    "52": {
        "hex": 52,
        "pinyin": "Gèn",
        "binary": "001001",
        "english": "Keeping Still",
        "trad_chinese": "艮"
    },
    "53": {
        "hex": 53,
        "pinyin": "Jiàn",
        "binary": "001011",
        "english": "Developing Gradually",
        "trad_chinese": "漸"
    },
    "54": {
        "hex": 54,
        "pinyin": "Guīmèi",
        "binary": "110100",
        "english": "Marrying Maiden",
        "trad_chinese": "歸妹"
    },
    "55": {
        "hex": 55,
        "pinyin": "Fēng",
        "binary": "101100",
        "english": "Abundance",
        "trad_chinese": "豐"
    },
    "56": {
        "hex": 56,
        "pinyin": "Lǚ",
        "binary": "001101",
        "english": "Travelling",
        "trad_chinese": "旅"
    },
    "57": {
        "hex": 57,
        "pinyin": "Xùn",
        "binary": "011011",
        "english": "Proceeding Humbly",
        "trad_chinese": "巽"
    },
    "58": {
        "hex": 58,
        "pinyin": "Duì",
        "binary": "110110",
        "english": "Joyful",
        "trad_chinese": "兌"
    },
    "59": {
        "hex": 59,
        "pinyin": "Huàn",
        "binary": "010011",
        "english": "Dispersing",
        "trad_chinese": "渙"
    },
    "60": {
        "hex": 60,
        "pinyin": "Jié",
        "binary": "110010",
        "english": "Restricting",
        "trad_chinese": "節"
    },
    "61": {
        "hex": 61,
        "pinyin": "Zhōngfú",
        "binary": "110011",
        "english": "Innermost Sincerity",
        "trad_chinese": "中孚"
    },
    "62": {
        "hex": 62,
        "pinyin": "Xiǎoguò",
        "binary": "001100",
        "english": "Little Exceeding",
        "trad_chinese": "小過"
    },
    "63": {
        "hex": 63,
        "pinyin": "Jìjì",
        "binary": "101010",
        "english": "Already Fulfilled",
        "trad_chinese": "既濟"
    },
    "64": {
        "hex": 64,
        "pinyin": "Wèijì",
        "binary": "010101",
        "english": "Not Yet Fulfilled",
        "trad_chinese": "未濟"
    }
};