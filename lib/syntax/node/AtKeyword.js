import { AtKeyword as AtKeywordToken } from '../../tokenizer/index.js';

export const name = 'AtKeyword';
export const structure = {
    name: String
};

export function parse() {
    const start = this.tokenStart;

    this.eat(AtKeywordToken);

    return {
        type: 'AtKeyword',
        loc: this.getLocation(start, this.tokenStart),
        name: this.substrToCursor(start + 1)
    };
}

export function generate(node) {
    this.token(AtKeywordToken, '@' + node.name);
}
