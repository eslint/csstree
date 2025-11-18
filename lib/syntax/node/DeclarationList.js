import {
    WhiteSpace,
    Comment,
    Semicolon,
    AtKeyword,
    Delim,
    Hash,
    LeftSquareBracket,
    Colon,
    Ident,
    RightCurlyBracket
} from '../../tokenizer/index.js';

const AMPERSAND = 0x0026;       // U+0026 AMPERSAND (&)
const DOT = 0x002E;             // U+002E FULL STOP (.)
const STAR = 0x002A;            // U+002A ASTERISK (*);
const PLUSSIGN = 0x002B;        // U+002B PLUS SIGN (+)
const GREATERTHANSIGN = 0x003E; // U+003E GREATER-THAN SIGN (>)
const TILDE = 0x007E;           // U+007E TILDE (~)

const selectorStarts = new Set([
    AMPERSAND,
    DOT,
    STAR,
    PLUSSIGN,
    GREATERTHANSIGN,
    TILDE
]);

function consumeRaw() {
    return this.Raw(this.consumeUntilSemicolonIncluded, true);
}

function isElementSelectorStart() {
    if (this.tokenType !== Ident) {
        return false;
    }

    const nextTokenType = this.lookupTypeNonSC(1);

    // Simple case: if next token is not colon, semicolon, or closing brace, it's likely a selector
    if (nextTokenType !== Colon && nextTokenType !== Semicolon && nextTokenType !== RightCurlyBracket) {
        return true;
    }

    // Special handling for colon case - could be pseudo-class/pseudo-element
    if (nextTokenType === Colon) {
        // Look ahead further to see what follows the colon
        const afterColonType = this.lookupTypeNonSC(2);

        // If after colon there's an identifier (pseudo-class/pseudo-element name),
        // check what comes after that
        if (afterColonType === Ident) {
            const afterPseudoType = this.lookupTypeNonSC(3);
            // If it's followed by { or other selector tokens, it's a selector
            // If it's followed by ; or } or EOF, it's not a selector (property)
            return afterPseudoType !== Semicolon && afterPseudoType !== RightCurlyBracket && afterPseudoType !== 0; // 0 is EOF
        }
    }

    return false;
}

function isSelectorStart() {
    return this.tokenType === Delim && selectorStarts.has(this.source.charCodeAt(this.tokenStart)) ||
        this.tokenType === Hash || this.tokenType === LeftSquareBracket ||
        this.tokenType === Colon || isElementSelectorStart.call(this);
}

export const name = 'DeclarationList';
export const structure = {
    children: [[
        'Declaration',
        'Atrule',
        'Rule'
    ]]
};

export function parse() {
    const children = this.createList();

    scan:
    while (!this.eof) {
        switch (this.tokenType) {
            case WhiteSpace:
            case Comment:
            case Semicolon:
                this.next();
                break;

            case AtKeyword:
                children.push(this.parseWithFallback(this.Atrule.bind(this, true), consumeRaw));
                break;

            default:
                if (isSelectorStart.call(this))  {
                    children.push(this.parseWithFallback(this.Rule, consumeRaw));
                } else {
                    children.push(this.parseWithFallback(this.Declaration, consumeRaw));
                }
        }
    }

    return {
        type: 'DeclarationList',
        loc: this.getLocationFromList(children),
        children
    };
}

export function generate(node) {
    this.children(node, prev => {
        if (prev.type === 'Declaration') {
            this.token(Semicolon, ';');
        }
    });
}

