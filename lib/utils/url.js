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

    for (let i = start; i <= end; i++) {
        let code = str.charCodeAt(i);

        if (code === REVERSE_SOLIDUS) {
            // special case at the ending
            if (i === end) {
                // if the next input code point is EOF, do nothing
                // otherwise include last left parenthesis as escaped
                if (i !== len - 1) {
                    decoded = str.substr(i + 1);
                }
                break;
            }

            code = str.charCodeAt(++i);

            // consume escaped
            if (isValidEscape(REVERSE_SOLIDUS, code)) {
                const escapeStart = i - 1;
                const escapeEnd = consumeEscaped(str, escapeStart);

                i = escapeEnd - 1;
                decoded += decodeEscaped(str.substring(escapeStart + 1, escapeEnd));
            } else {
                // \r\n
                if (code === 0x000d && str.charCodeAt(i + 1) === 0x000a) {
                    i++;
                }
            }
        } else {
            // Data URLs can contain megabytes. Append the whole unescaped run:
            // one concatenation per character otherwise retains a rope node per
            // byte in the AST, far larger than the resource itself.
            const nextEscape = str.indexOf('\\', i);
            const runEnd = nextEscape === -1 ? end + 1 : Math.min(nextEscape, end + 1);
            decoded += str.slice(i, runEnd);
            i = runEnd - 1;
        }
    }

    return decoded;
}

export function encode(str) {
    let wsBeforeHexIsNeeded = false;

    // Keep ordinary runs together instead of allocating a concatenation node
    // per character. Embedded font/image URLs can be several megabytes long,
    // including after a prefix that needs escaping, so a whole-string fast
    // path alone would still leave large allocations for those URLs.
    const encoded = str.replace(/[^\x00-\x20\x7f"'()\\]+|[\s\S]/g, part => {
        const code = part.charCodeAt(0);

        if (code === 0x0000) {
            return '\uFFFD';
        }

        if (code <= 0x001f || code === 0x007F) {
            wsBeforeHexIsNeeded = true;
            return '\\' + code.toString(16);
        }

        if (code === SPACE ||
            code === REVERSE_SOLIDUS ||
            code === QUOTATION_MARK ||
            code === APOSTROPHE ||
            code === LEFTPARENTHESIS ||
            code === RIGHTPARENTHESIS) {
            wsBeforeHexIsNeeded = false;
            return '\\' + part;
        }

        const prefix = wsBeforeHexIsNeeded && isHexDigit(code) ? ' ' : '';
        wsBeforeHexIsNeeded = false;
        return prefix + part;
    });

    return 'url(' + encoded + ')';
}
