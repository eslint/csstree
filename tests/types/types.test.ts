import * as csstree from '@eslint/css-tree';
import defaultSyntax from '@eslint/css-tree/definition-syntax-data';

// Basic parsing and generating
const ast = csstree.parse('.example { color: red }');
const css = csstree.generate(ast);

// Parsing with options
const astWithOpts = csstree.parse('.example { color: red }', {
    context: 'stylesheet',
    positions: true,
    onComment(value, loc) {
        console.log(value, loc.start.line, loc.start.column);
    },
    onParseError(error, fallbackNode) {
        console.log(error.message, fallbackNode.type);
    },
    onToken(type, start, end, index) {
        switch (type) {
            case csstree.tokenTypes.BadString:
                console.warn('Bad string', this.getRangeLocation(start, end));
                break;

            case csstree.tokenTypes.BadUrl:
                console.warn('Bad url', this.getRangeLocation(start, end));
                break;

            default:
                if (this.isBlockOpenerTokenType(type)) {
                    if (this.getBlockTokenPairIndex(index) === -1) {
                        console.warn('No closing pair', this.getRangeLocation(start, end));
                    }
                } else if (this.isBlockCloserTokenType(type)) {
                    if (this.getBlockTokenPairIndex(index) === -1) {
                        console.warn('No opening pair', this.getRangeLocation(start, end));
                    }
                }
        }
    }
});

const error1 = csstree.parse.SyntaxError('Unexpected token', 'x', 0, 1, 1);
const error2 = csstree.parse.SyntaxError('Unexpected token', 'x', 0, 1, 1, 4);
const error3 = csstree.parse.SyntaxError('Unexpected token', 'x', 0, 1, 1, 4, 5);

// Walking the AST
csstree.walk(ast, {
    visit: 'Declaration',
    enter: (node, item, list) => {
        if (node.type === 'Declaration') {
            console.log(node.property);
        }
    }
});

// Finding nodes
const declaration = csstree.find(ast, (node) => {
    return node.type === 'Declaration' && node.property === 'color';
});

declaration satisfies csstree.AnyCssNode | null;

const declarations = csstree.findAll(ast, (node) => {
    return node.type === 'Declaration';
});

declarations satisfies csstree.AnyCssNode[];

// List manipulation
const list = new csstree.List<csstree.CssNode>();
list.appendData({ type: 'WhiteSpace', value: ' ' });
list.prependData({ type: 'Identifier', name: 'test' });

// Node creation and manipulation
const selector: csstree.Selector = {
    type: 'Selector',
    children: new csstree.List<csstree.CssNode>()
};

const rule: csstree.Rule = {
    type: 'Rule',
    prelude: {
        type: 'SelectorList',
        children: new csstree.List<csstree.CssNode>()
    },
    block: {
        type: 'Block',
        children: new csstree.List<csstree.CssNode>()
    }
};

// Lexer usage
const lexer = new csstree.Lexer({
    generic: true,
    types: {},
    properties: {},
    atrules: {},
    units: {},
    scope: {},
    features: {},
    node: {},
    atrule: {},
    pseudo: {},
    parseContext: {
        default: 'stylesheet'
    },
    tokenize: csstree.tokenize,
});

// Property matching
const propertyMatch = lexer.matchProperty('color', 'red');
console.log(propertyMatch.matched?.type);
console.log(propertyMatch.isType(ast, 'color'));

// Value fragment finding
const fragments = lexer.findValueFragments('border', {
    type: 'Value',
    children: new csstree.List<csstree.CssNode>()
}, 'Type', 'length');

// TokenStream usage
const tokenStream = new csstree.TokenStream('div { color: red }', csstree.tokenize);
while (!tokenStream.eof) {
    tokenStream.next();
    console.log(tokenStream.tokenType);
}

// Stricter type completeness checks
type CheckNodeTypesComplete = Exclude<csstree.CssNodeNames, csstree.CssNode['type']> extends never ? true : false;
type CheckNodeTypesSound = Exclude<csstree.CssNode['type'], csstree.CssNodeNames> extends never ? true : false;
type CheckPlainTypesComplete = Exclude<csstree.CssNodeNames, csstree.CssNodePlain['type']> extends never ? true : false;
type CheckPlainTypesSound = Exclude<csstree.CssNodePlain['type'], csstree.CssNodeNames> extends never ? true : false;

// These will error if types don't match
const _typeChecks: {
    nodeComplete: CheckNodeTypesComplete extends true ? true : never;
    nodeSound: CheckNodeTypesSound extends true ? true : never;
    plainComplete: CheckPlainTypesComplete extends true ? true : never;
    plainSound: CheckPlainTypesSound extends true ? true : never;
} = {
    nodeComplete: true,
    nodeSound: true,
    plainComplete: true,
    plainSound: true
};

// Definition syntax
const syntax = csstree.definitionSyntax.parse('<color> | <length>');
csstree.definitionSyntax.generate(syntax);
csstree.definitionSyntax.walk(syntax, {
    enter: (node) => {
        console.log(node.type);
    }
});

// String encoding/decoding
const encodedStr = csstree.string.encode('test"string');
const decodedStr = csstree.string.decode(encodedStr);

// URL encoding/decoding
const encodedUrl = csstree.url.encode('http://example.com/?q=test');
const decodedUrl = csstree.url.decode(encodedUrl);

// Identifier handling
const encodedIdent = csstree.ident.encode('test-ident');
const decodedIdent = csstree.ident.decode(encodedIdent);

// Property parsing
const parsedProp = csstree.property('--custom-property');
console.log(parsedProp.basename, parsedProp.custom);

// Keyword parsing
const parsedKeyword = csstree.keyword('-webkit-flex');
console.log(parsedKeyword.basename, parsedKeyword.vendor);

// Forking the AST
const forkedAst = csstree.fork({
    parseContext: {
        default: 'stylesheet'
    }
}).parse('.example { color: blue }');

const forkedCss = csstree.generate(forkedAst);
console.log(forkedCss);

// Forking with custom syntax
const customSyntax = csstree.fork({
    parseContext: {
        default: 'stylesheet'
    },
    atrule: {
        CustomAtRule: {
            parse: {
                prelude: null,
                block() {
                    return {
                        type: 'Block',
                        children: new csstree.List<csstree.CssNode>()
                    };
                }
            }
        },
        CustomAtRule2: {
            parse: {
                prelude() {
                    return new csstree.List<csstree.CssNode>();
                },
                block: null
            }
        },
        CustomAtRule3: {
            parse: {
                block() {
                    return {
                        type: 'Block',
                        children: new csstree.List<csstree.CssNode>()
                    };
                }
            }
        },
        CustomAtRule4: {
            parse: {
                prelude: null
            }
        }
    },
    atrules: {
        CustomAtRule: {
            prelude: 'CustomAtRule',
            descriptors: {
                custom: 'CustomNode'
            }

        },
        CustomAtRule2: {
            prelude: 'CustomAtRule2'
        },
        ...defaultSyntax.atrules
    },
    properties: {
        custom: 'CustomNode',
        ...defaultSyntax.properties
    },
    types: defaultSyntax.types,
    node: {
        CustomNode: {
            name: 'CustomNode',
            structure: {
                value: 'String'
            },
            parse: () => {
                return {
                    type: 'CustomNode',
                    value: 'hello'
                };
            },
            generate: (node) => {
                return `custom: ${node.type}`;
            }
        },
        CustomNode2: {
            name: 'CustomNode2',
            structure: {},
            parse: () => {
                return {
                    type: 'CustomNode2'
                };
            },
            generate: (node) => {
                return `custom2: ${node.type}`;
            },
            walkContext: 'stylesheet'
        },
        CustomNode3: {
            name: 'CustomNode3',
            structure: {
                children: [[]]
            },
            parse() {

                const dec = this.Declaration();

                return {
                    type: 'CustomNode3',
                    value: dec.property
                };
            },
            generate(node: csstree.CssNode) {
                this.node(node);
                this.children(node);
                this.token(1, 'foo');
                this.tokenize('foo');
                return `custom3: ${node.type}`;
            }
        },
        CustomNode4: {
            parse() {

                const id = this.Identifier();

                return {
                    type: 'CustomNode3',
                    value: id.name
                };
            },
        },
    },
    scope: {
        Value: {
            custom() {
                return this.createList();
            }
        }
    }
});

// Parsing with custom node types

interface CustomNode extends csstree.CssNodeCommon {
    type: 'CustomNode';
    value: string;
}

type CustomNodes = csstree.CssNode | CustomNode;

function customParseFunction(this: csstree.ParserContext<CustomNodes>, value: string) {

    const node = this.CustomNode();
    const id = this.Identifier();

    return {
        type: 'CustomNode2',
        value: node.value
    };
}

const partialNodeConfig: Partial<csstree.NodeSyntaxConfig> = {
    parse(this: csstree.ParserContext<CustomNodes>, value: string) {
        const node = this.CustomNode();
        return {
            type: 'CustomNode3',
            value: node.value
        };
    },
}

const customAst = customSyntax.parse('.example { custom: value }');
customSyntax.walk(customAst,
    (node) => {
        if (node.type === 'AttributeSelector') {
            console.log(node.name, node.value);
        }
    }
);

const readSequence: csstree.ReadSequenceFunction = function (recognizer) {
    const sequence = this.createList();
    this.isDelim(5);
    return sequence;
};

const x = (node: csstree.CssNode, nodePlain: csstree.CssNodePlain) => {
    node.type = nodePlain.type;
    nodePlain.type = node.type;
};

// parse with custom arguments
const parse1: csstree.NodeSyntaxConfig["parse"] = function(a, b) {

    return {
        type: 'Function',
        loc: this.getLocation(0, this.tokenStart),
        name: 'Function',
    };
};

// parse with no arguments
const parse2: csstree.NodeSyntaxConfig["parse"] = function() {

    return {
        type: 'Function',
        loc: this.getLocation(0, this.tokenStart),
        name: 'Function',
    };
};
