import * as scope from '../scope/index.js';
import atrule from '../atrule/index.js';
import pseudo from '../pseudo/index.js';
import * as node from '../node/index-parse.js';
import {
    AtKeyword,
    Ident,
    String as StringToken,
    tokenize
} from '../../tokenizer/index.js';

function identifier() {
    return this.Identifier();
}

function fontFormat() {
    switch (this.tokenType) {
        case Ident:
            return this.Identifier();

        case StringToken:
            return this.String();

        default:
            this.error('Identifier or string is expected');
    }
}

function atRule() {
    const start = this.tokenStart;
    const value = this.consume(AtKeyword);

    return {
        type: 'Raw',
        loc: this.getLocation(start, this.tokenStart),
        value
    };
}

export default {
    parseContext: {
        default: 'StyleSheet',
        stylesheet: 'StyleSheet',
        atrule: 'Atrule',
        atrulePrelude(options) {
            return this.AtrulePrelude(options.atrule ? String(options.atrule) : null);
        },
        mediaQueryList: 'MediaQueryList',
        mediaQuery: 'MediaQuery',
        condition(options) {
            return this.Condition(options.kind);
        },
        rule: 'Rule',
        selectorList: 'SelectorList',
        selector: 'Selector',
        block() {
            return this.Block(true);
        },
        declarationList: 'DeclarationList',
        declaration: 'Declaration',
        value: 'Value'
    },
    features: {
        supports: {
            selector() {
                return this.Selector();
            },
            'font-tech': identifier,
            'font-format': fontFormat,
            'at-rule': atRule,
            'named-feature': identifier,
            env: identifier
        },
        container: {
            style() {
                return this.Declaration();
            }
        }
    },
    scope,
    atrule,
    pseudo,
    node,
    tokenize
};
