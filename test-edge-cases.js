import { parse } from './lib/index.js';

function testParse(name, css) {
    try {
        const ast = parse(css);
        const mainRule = ast.children[0];
        console.log(`${name}: mainRule exists =`, !!mainRule);
        if (mainRule && mainRule.block) {
            const blockChild = mainRule.block.children[0];
            console.log(`  -> ${blockChild.type}`);
            if (blockChild.type === 'Declaration') {
                console.log(`     property: ${blockChild.property}`);
            }
        } else {
            console.log(`  -> mainRule.block missing`);
        }
    } catch (e) {
        console.log(`${name}: ERROR - ${e.message}`);
    }
}

// Test various pseudo-function selectors inside nested rules
const tests = [
    ['Simple hover', 'main { p:hover { color: red; } }'],
    ['is() with class', 'main { p:is(.active) { color: red; } }'],
];

tests.forEach(([name, css]) => testParse(name, css));
