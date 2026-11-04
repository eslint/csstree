import { parse } from './lib/index.js';

const testCase = `button:is([aria-expanded="true"], [aria-pressed="true"]) > & {
    color: red;
}`;

try {
    const ast = parse(testCase);
    console.log('Parse successful');
    console.log(JSON.stringify(ast, null, 2));
} catch (e) {
    console.log('Parse error:', e.message);
    console.log(e);
}
