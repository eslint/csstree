import {
    isHexDigit,
    isWhiteSpace,
    isValidEscape,
    consumeEscaped,
    decodeEscaped
} from '../tokenizer/index.js';

const SPACE = 0x0020;            // U+0020 SPACE
const REVERSE_SOLIDUS = 0x005c;  // U+005C REVERSE SOLIDUS (\)
const QUOTATION_MARK = 0x0022;   // "
const APOSTROPHE = 0x0027;       // '
const LEFTPARENTHESIS = 0x0028;  // U+0028 LEFT PARENTHESIS (()
const RIGHTPARENTHESIS = 0x0029; // U+0029 RIGHT PARENTHESIS ())

export function decode(str) {
    const len = str.length;
    let start = 4; // length of "url("
    let end = str.charCodeAt(len - 1) === RIGHTPARENTHESIS ? len - 2 : len - 1;
    let decoded = '';

    while (start < end && isWhiteSpace(str.charCodeAt(start))) {
        start++;
    }

    while (start < end && isWhiteSpace(str.charCodeAt(end))) {
        end--;
    }

    let runStart = start;

    for (let i = start; i <= end; i++) {
        let code = str.charCodeAt(i);

        if (code === REVERSE_SOLIDUS) {
            decoded += str.slice(runStart, i);

            // special case at the ending
            if (i === end) {
                // if the next input code point is EOF, do nothing
                // otherwise include last left parenthesis as escaped
                if (i !== len - 1) {
                    decoded = str.substr(i + 1);
                }
                return decoded;
            }

            code = str.charCodeAt(++i);

            // consume escaped
            if (isValidEscape(REVERSE_SOLIDUS, code)) {
                const escapeStart = i - 1;
                const escapeEnd = consumeEscaped(str, escapeStart);

                i = escapeEnd - 1;
                decoded += decodeEscaped(str.substring(escapeStart + 1, escapeEnd));
                runStart = escapeEnd;
            } else {
                // \r\n
                if (code === 0x000d && str.charCodeAt(i + 1) === 0x000a) {
                    i++;
                }

                runStart = i + 1;
            }
        }
    }

    return decoded + str.slice(runStart, end + 1);
}

export function encode(str) {
    let encoded = '';
    let runStart = 0;
    let wsBeforeHexIsNeeded = false;

    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);

        // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER (U+FFFD).
        if (code === 0x0000) {
            encoded += str.slice(runStart, i) + '\uFFFD';
            runStart = i + 1;
            continue;
        }

        // If the character is in the range [\1-\1f] (U+0001 to U+001F) or is U+007F,
        // the character escaped as code point.
        // Note: Do not compare with 0x0001 since 0x0000 is precessed before
        if (code <= 0x001f || code === 0x007F) {
            encoded += str.slice(runStart, i) + '\\' + code.toString(16);
            runStart = i + 1;
            wsBeforeHexIsNeeded = true;
            continue;
        }

        if (code === SPACE ||
            code === REVERSE_SOLIDUS ||
            code === QUOTATION_MARK ||
            code === APOSTROPHE ||
            code === LEFTPARENTHESIS ||
            code === RIGHTPARENTHESIS) {
            encoded += str.slice(runStart, i) + '\\' + str.charAt(i);
            runStart = i + 1;
            wsBeforeHexIsNeeded = false;
        } else {
            if (wsBeforeHexIsNeeded && isHexDigit(code)) {
                encoded += str.slice(runStart, i) + ' ';
                runStart = i;
            }

            wsBeforeHexIsNeeded = false;
        }
    }

    return 'url(' + encoded + str.slice(runStart) + ')';
}
