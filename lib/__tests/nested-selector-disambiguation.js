import assert from 'assert';
import { parse } from '@eslint/css-tree';

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
            }
        ];

        testCases.forEach(({ name, css, expectedNestedType }) => {
            it(name, () => {
                const ast = parse(css);

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

    describe('Edge cases and complex scenarios', () => {
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
});
