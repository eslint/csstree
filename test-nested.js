import { parse } from './lib/index.js';

// Test case 1: nested rule with is() function
const testCase1 = `main {
    button:is([aria-expanded="true"], [aria-pressed="true"]) > & {
        color: red;
    }
}`;

const ast = parse(testCase1);
console.log(JSON.stringify(ast, null, 2));
