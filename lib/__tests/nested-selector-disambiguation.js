import assert from 'assert';
import { parse, generate } from '@eslint/css-tree';

describe('Nested Selector Disambiguation', () => {
    describe('Element selectors with pseudo-classes should parse as nested rules', () => {
        const testCases = [
            {
                name: 'p:first-of-type nested selector',
                css: 'main { p:first-of-type { margin-top: 0; } }',
                expectedNestedType: 'Rule'
            },
            {
                name: 'p:hover nested selector',
                css: 'main { p:hover { color: red; } }',
                expectedNestedType: 'Rule'
            },
            {
                name: 'p:focus nested selector',
                css: 'main { p:focus { outline: none; } }',
                expectedNestedType: 'Rule'
            },
            {
                name: 'p:nth-child nested selector',
                css: 'main { p:nth-child(2n) { background: gray; } }',
                expectedNestedType: 'Rule'
            },
            {
                name: 'div:last-child nested selector',
                css: 'main { div:last-child { margin-bottom: 0; } }',
                expectedNestedType: 'Rule'
            },
            {
                name: 'span:not(.hidden) nested selector',
                css: 'main { span:not(.hidden) { display: block; } }',
                expectedNestedType: 'Rule'
            },
            {
                name: 'button:is() with multiple attribute values',
                css: '.button-background { button:is([aria-expanded="true"], [aria-pressed="true"]) > & {} }',
                expectedNestedType: 'Rule'
            },
            {
                name: 'button:is() with multiple attribute selectors',
                css: '.button-background { button:is([aria-expanded], [aria-pressed]) > & {} }',
                expectedNestedType: 'Rule'
            },
            {
                name: 'Long nested functional pseudo-class selector',
                css: `main { button:not(:is(${'[data-state="active"], '.repeat(50)}[disabled])) > & {} }`,
                expectedNestedType: 'Rule'
            }
        ];

        testCases.forEach(({ name, css, expectedNestedType }) => {
            it(name, () => {
                const ast = parse(css, {
                    onParseError(error) {
                        throw error;
                    }
                });

                // Navigate to the nested content
                const mainRule = ast.children.head.data;
                assert.strictEqual(mainRule.type, 'Rule', 'Should parse main rule');

                const nestedContent = mainRule.block.children.head.data;
                assert.strictEqual(nestedContent.type, expectedNestedType,
                    `Expected nested content to be ${expectedNestedType}, got ${nestedContent.type}`);

                if (expectedNestedType === 'Rule') {
                    // Verify it has a proper selector structure
                    assert(nestedContent.prelude, 'Nested rule should have prelude');
                    assert(nestedContent.block, 'Nested rule should have block');
                    assert(nestedContent.prelude.children, 'Prelude should have children');

                    const selector = nestedContent.prelude.children.head.data;
                    assert(selector.children, 'Selector should have children');

                    // Should have at least a TypeSelector and PseudoClassSelector
                    const selectorChildren = [];
                    let current = selector.children.head;
                    while (current) {
                        selectorChildren.push(current.data);
                        current = current.next;
                    }

                    assert(selectorChildren.some(child => child.type === 'TypeSelector'),
                        'Should have TypeSelector');
                    assert(selectorChildren.some(child => child.type === 'PseudoClassSelector'),
                        'Should have PseudoClassSelector');
                }
            });
        });
    });

    describe('Regular properties should still parse as declarations', () => {
        const testCases = [
            {
                name: 'Regular property',
                css: 'main { padding: 10px; }',
                expectedNestedType: 'Declaration',
                expectedProperty: 'padding'
            },
            {
                name: 'Property with colon in value',
                css: 'main { content: "Hello: World"; }',
                expectedNestedType: 'Declaration',
                expectedProperty: 'content'
            },
            {
                name: 'Custom property',
                css: 'main { --my-color: red; }',
                expectedNestedType: 'Declaration',
                expectedProperty: '--my-color'
            },
            {
                name: 'Property with function value',
                css: 'main { background: url(image.jpg); }',
                expectedNestedType: 'Declaration',
                expectedProperty: 'background'
            },
            {
                name: 'Property with multiple values',
                css: 'main { margin: 10px 20px 30px 40px; }',
                expectedNestedType: 'Declaration',
                expectedProperty: 'margin'
            },
            {
                name: 'Long property value without semicolon',
                css: `main { font-family: ${'Arial, '.repeat(50)}sans-serif }`,
                expectedNestedType: 'Declaration',
                expectedProperty: 'font-family'
            },
            {
                name: 'Long property value at end of input',
                css: `main { font-family: ${'Arial, '.repeat(50)}sans-serif`,
                expectedNestedType: 'Declaration',
                expectedProperty: 'font-family'
            }
        ];

        testCases.forEach(({ name, css, expectedNestedType, expectedProperty }) => {
            it(name, () => {
                const ast = parse(css);

                // Navigate to the nested content
                const mainRule = ast.children.head.data;
                assert.strictEqual(mainRule.type, 'Rule', 'Should parse main rule');

                const nestedContent = mainRule.block.children.head.data;
                assert.strictEqual(nestedContent.type, expectedNestedType,
                    `Expected nested content to be ${expectedNestedType}, got ${nestedContent.type}`);

                if (expectedNestedType === 'Declaration') {
                    assert.strictEqual(nestedContent.property, expectedProperty,
                        `Expected property to be ${expectedProperty}, got ${nestedContent.property}`);
                    assert(nestedContent.value, 'Declaration should have value');
                }
            });
        });
    });

    describe('Values containing curly brackets', () => {
        const testCases = [
            {
                name: 'Long custom property value with a block',
                css: 'main { --x: a b c d e f g h i j {foo:bar}; color:red; }',
                expected: [
                    ['--x', ' a b c d e f g h i j {foo:bar}'],
                    ['color', 'red']
                ]
            },
            {
                name: 'Custom property with pseudo-class-like value and a block',
                css: 'main { --x:hover {foo:bar}; color:red; }',
                expected: [
                    ['--x', 'hover {foo:bar}'],
                    ['color', 'red']
                ]
            },
            {
                name: 'Long var() fallback containing a block',
                css: 'main { color: var(--x, a b c d e f g h i j {foo:bar}); background:blue; }',
                expected: [
                    ['color', 'var(--x, a b c d e f g h i j {foo:bar})'],
                    ['background', 'blue']
                ]
            }
        ];

        testCases.forEach(({ name, css, expected }) => {
            it(name, () => {
                const ast = parse(css, { parseCustomProperty: false, parseValue: false });
                const mainRule = ast.children.head.data;
                const children = mainRule.block.children.toArray();

                assert.deepStrictEqual(
                    children.map(child => [child.type, child.property, child.value && child.value.value]),
                    expected.map(([property, value]) => ['Declaration', property, value])
                );
            });
        });
    });

    describe('Edge cases and complex scenarios', () => {
        const selectors = [
            'p:not(.a, .b, .c, .d, .e, .f, .g, .h)',
            'p:not(:is(.a, .b, .c, .d, .e, .f, .g, .h))',
            'p:hover .a .b .c .d .e .f .g .h .i .j',
            'p/* before */:hover /* after */ .a .b .c .d .e .f',
            'p::before'
        ];

        for (const selector of selectors) {
            it(`should use structural lookahead for ${selector}`, () => {
                const ast = parse(`main { ${selector} { color: red; } }`, {
                    onParseError(error) {
                        throw error;
                    }
                });
                const nested = ast.children.first.block.children.first;

                assert.strictEqual(nested.type, 'Rule');
                assert.strictEqual(nested.prelude.type, 'SelectorList');
                assert.strictEqual(nested.block.children.first.type, 'Declaration');
            });
        }

        const declarations = [
            '--theme: { color: red; nested: { color: blue; } }',
            '--theme: fn({ color: red; })',
            'color: fn({ color: red; })',
            'color: fn(a;b)',
            'color: red'
        ];

        for (const declaration of declarations) {
            it(`should keep balanced values in declarations: ${declaration}`, () => {
                const ast = parse(`main { ${declaration}; p:hover { color: blue; } }`);
                const children = ast.children.first.block.children.toArray();

                assert.deepStrictEqual(children.map(node => node.type), ['Declaration', 'Rule']);
            });
        }

        it('should stop lookahead at the end of input', () => {
            const ast = parse('main { color: red');

            assert.strictEqual(ast.children.first.block.children.first.type, 'Declaration');
        });

        it('should handle multiple nested selectors in one block', () => {
            const css = 'main { p:hover { color: red; } div { margin: 10px; } .button { padding: 5px; } }';
            const ast = parse(css);

            const mainRule = ast.children.head.data;
            const blockChildren = [];
            let current = mainRule.block.children.head;
            while (current) {
                blockChildren.push(current.data);
                current = current.next;
            }

            assert.strictEqual(blockChildren.length, 3, 'Should have 3 nested rules');
            blockChildren.forEach((child, index) => {
                assert.strictEqual(child.type, 'Rule', `Child ${index} should be a Rule`);
            });
        });

        it('should handle mixed declarations and nested rules', () => {
            const css = 'main { color: blue; p:hover { color: red; } margin: 10px; }';
            const ast = parse(css);

            const mainRule = ast.children.head.data;
            const blockChildren = [];
            let current = mainRule.block.children.head;
            while (current) {
                blockChildren.push(current.data);
                current = current.next;
            }

            assert.strictEqual(blockChildren.length, 3, 'Should have 3 children');
            assert.strictEqual(blockChildren[0].type, 'Declaration', 'First should be Declaration');
            assert.strictEqual(blockChildren[1].type, 'Rule', 'Second should be Rule');
            assert.strictEqual(blockChildren[2].type, 'Declaration', 'Third should be Declaration');
        });

        it('should handle deeply nested selectors', () => {
            const css = 'main { p:hover { span:focus { color: red; } } }';
            const ast = parse(css);

            const mainRule = ast.children.head.data;
            const firstNested = mainRule.block.children.head.data;
            assert.strictEqual(firstNested.type, 'Rule', 'First nested should be Rule');

            const secondNested = firstNested.block.children.head.data;
            assert.strictEqual(secondNested.type, 'Rule', 'Second nested should be Rule');
        });

        it('should not confuse property-like selectors', () => {
            // This tests edge cases where selectors might look like properties
            const css = 'main { p:before { content: ""; } }';
            const ast = parse(css);

            const mainRule = ast.children.head.data;
            const nestedContent = mainRule.block.children.head.data;
            assert.strictEqual(nestedContent.type, 'Rule', 'Should parse as nested rule, not declaration');
        });

        it('should handle comma-separated selector list', () => {
            const css = `main {
                            p:first-of-type, span {
                                margin-top: 0;
                            }
                        }`;
            const ast = parse(css);

            const mainRule = ast.children.head.data;
            assert.strictEqual(mainRule.type, 'Rule', 'Should parse main rule');

            const nestedContent = mainRule.block.children.head.data;
            assert.strictEqual(nestedContent.type, 'Rule', 'Should parse as nested rule, not declaration');

            // Verify the selector list structure
            // The prelude IS the SelectorList
            const selectorList = nestedContent.prelude;
            assert.strictEqual(selectorList.type, 'SelectorList', 'Should have SelectorList');

            // Collect all selectors in the list
            const selectors = [];
            let current = selectorList.children.head;
            while (current) {
                selectors.push(current.data);
                current = current.next;
            }

            assert.strictEqual(selectors.length, 2, 'Should have 2 selectors in the list');

            // Verify first selector: p:first-of-type
            const firstSelectorChildren = [];
            current = selectors[0].children.head;
            while (current) {
                firstSelectorChildren.push(current.data);
                current = current.next;
            }
            assert.strictEqual(firstSelectorChildren[0].type, 'TypeSelector');
            assert.strictEqual(firstSelectorChildren[0].name, 'p');
            assert.strictEqual(firstSelectorChildren[1].type, 'PseudoClassSelector');
            assert.strictEqual(firstSelectorChildren[1].name, 'first-of-type');

            // Verify second selector: span
            const secondSelectorChildren = [];
            current = selectors[1].children.head;
            while (current) {
                secondSelectorChildren.push(current.data);
                current = current.next;
            }
            assert.strictEqual(secondSelectorChildren[0].type, 'TypeSelector');
            assert.strictEqual(secondSelectorChildren[0].name, 'span');

            // Verify the nested declaration
            const declaration = nestedContent.block.children.head.data;
            assert.strictEqual(declaration.type, 'Declaration');
            assert.strictEqual(declaration.property, 'margin-top');
        });
    });

    describe('Regression tests for the original issue', () => {
        it('should parse the original failing case correctly', () => {
            const css = `main {
   p:first-of-type {
      margin-top: 0;
   }
}`;

            const ast = parse(css);
            const mainRule = ast.children.head.data;
            const nestedContent = mainRule.block.children.head.data;

            // Should be parsed as a Rule, not a Declaration
            assert.strictEqual(nestedContent.type, 'Rule',
                'Original failing case should now parse as Rule');

            // Verify the selector structure
            const selector = nestedContent.prelude.children.head.data;
            const selectorChildren = [];
            let current = selector.children.head;
            while (current) {
                selectorChildren.push(current.data);
                current = current.next;
            }

            assert.strictEqual(selectorChildren[0].type, 'TypeSelector');
            assert.strictEqual(selectorChildren[0].name, 'p');
            assert.strictEqual(selectorChildren[1].type, 'PseudoClassSelector');
            assert.strictEqual(selectorChildren[1].name, 'first-of-type');

            // Verify the nested declaration
            const declaration = nestedContent.block.children.head.data;
            assert.strictEqual(declaration.type, 'Declaration');
            assert.strictEqual(declaration.property, 'margin-top');
        });

        it('should still work when selector is at top level', () => {
            const css = `p:first-of-type {
   margin-top: 0;
}`;

            const ast = parse(css);
            const rule = ast.children.head.data;

            assert.strictEqual(rule.type, 'Rule', 'Top-level selector should still work');

            const selector = rule.prelude.children.head.data;
            const selectorChildren = [];
            let current = selector.children.head;
            while (current) {
                selectorChildren.push(current.data);
                current = current.next;
            }

            assert.strictEqual(selectorChildren[0].type, 'TypeSelector');
            assert.strictEqual(selectorChildren[0].name, 'p');
            assert.strictEqual(selectorChildren[1].type, 'PseudoClassSelector');
            assert.strictEqual(selectorChildren[1].name, 'first-of-type');
        });
    });

    describe('Nested pseudo-elements and selector lists (#158, #168)', () => {
        /**
         * Parses CSS, failing on any parse error, and summarizes the children
         * of the first rule's block as generated selectors or property names.
         * @param {string} css The CSS to parse.
         * @returns {Array<{rule: string, declarations: string[]}|{declaration: string}>} The block summary.
         */
        function summarizeBlock(css) {
            const ast = parse(css, {
                onParseError(error) {
                    throw error;
                }
            });

            return ast.children.first.block.children.toArray().map(node => (
                node.type === 'Rule'
                    ? {
                        rule: generate(node.prelude),
                        declarations: node.block.children.toArray().map(child => child.property)
                    }
                    : { declaration: node.property }
            ));
        }

        const testCases = [
            {
                name: 'element with pseudo-element (#158)',
                css: 'select { option::checkmark { content: "\\2611"; } }',
                expected: [
                    { rule: 'option::checkmark', declarations: ['content'] }
                ]
            },
            {
                name: 'element with pseudo-class and pseudo-element (#158)',
                css: 'select { option:not(:checked)::checkmark { content: "\\2610"; visibility: visible; } }',
                expected: [
                    { rule: 'option:not(:checked)::checkmark', declarations: ['content', 'visibility'] }
                ]
            },
            {
                name: 'multiple element rules with pseudo-elements (#168)',
                css: 'nav { a::after { content: ""; } i::before { content: ""; } }',
                expected: [
                    { rule: 'a::after', declarations: ['content'] },
                    { rule: 'i::before', declarations: ['content'] }
                ]
            },
            {
                name: 'pseudo-element rule between declarations',
                css: 'select { appearance: base-select; option::checkmark { content: ""; } color: red; }',
                expected: [
                    { declaration: 'appearance' },
                    { rule: 'option::checkmark', declarations: ['content'] },
                    { declaration: 'color' }
                ]
            },
            {
                name: 'selector list of element, pseudo-class and child combinator (#168)',
                css: `table,
.table {
    tr:last-child > th,
    tr:last-child > td {
        border-block-end: 0;
    }
}`,
                expected: [
                    { rule: 'tr:last-child>th,tr:last-child>td', declarations: ['border-block-end'] }
                ]
            },
            {
                name: 'long selector list of functional pseudo-classes (#168)',
                css: `html:not(.js) {
    table:not(.wrap) > thead,
    table:not(.wrap) > tbody,
    table:not(.wrap) > tfoot,
    .table:not(.wrap) > thead,
    .table:not(.wrap) > tbody,
    .table:not(.wrap) > tfoot {
        display: table;
        width: 100%;
        min-width: max-content;
    }
}`,
                expected: [
                    {
                        rule: 'table:not(.wrap)>thead,table:not(.wrap)>tbody,table:not(.wrap)>tfoot,.table:not(.wrap)>thead,.table:not(.wrap)>tbody,.table:not(.wrap)>tfoot',
                        declarations: ['display', 'width', 'min-width']
                    }
                ]
            },
            {
                name: 'selector list starting with an element and functional pseudo-class (#168)',
                css: `html.js {
    table:not(.wrap),
    .table:not(.wrap) {
        display: table;
        width: max-content;
        min-width: 100%;
        max-width: none;
        overflow: visible;
    }
}`,
                expected: [
                    {
                        rule: 'table:not(.wrap),.table:not(.wrap)',
                        declarations: ['display', 'width', 'min-width', 'max-width', 'overflow']
                    }
                ]
            }
        ];

        for (const { name, css, expected } of testCases) {
            it(`should parse ${name} as a nested rule`, () => {
                assert.deepStrictEqual(summarizeBlock(css), expected);
            });
        }
    });
});
