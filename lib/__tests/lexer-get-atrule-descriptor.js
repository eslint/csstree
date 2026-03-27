import assert from 'assert';
import { lexer, fork } from '@eslint/css-tree';

describe('Lexer#getAtruleDescriptor()', () => {
    it('should return a descriptor', () => {
        const descriptor = lexer.getAtruleDescriptor('font-face', 'font-family');

        assert.deepStrictEqual({
            type: descriptor.type,
            name: descriptor.name,
            parent: descriptor.parent
        }, {
            type: 'AtruleDescriptor',
            name: 'font-family',
            parent: 'font-face'
        });
    });

    it('should resolve vendor-prefixed names with basename fallback and prefer exact matches', () => {
        const customSyntax = fork(prev => ({
            ...prev,
            atrules: {
                'font-face': {
                    descriptors: {
                        'font-display': 'auto | block | swap | fallback | optional',
                        '-foo-font-display': 'auto | xxx'
                    }
                }
            }
        }));

        assert.strictEqual(
            customSyntax.lexer.getAtruleDescriptor('font-face', '-vendor-font-display').name,
            'font-display'
        );
        assert.strictEqual(
            customSyntax.lexer.getAtruleDescriptor('font-face', '-foo-font-display').name,
            '-foo-font-display'
        );
    });

    it('should return null for unknown descriptors', () => {
        assert.strictEqual(lexer.getAtruleDescriptor('font-face', 'color'), null);
        assert.strictEqual(lexer.getAtruleDescriptor('keyframes', 'font-family'), null);
        assert.strictEqual(lexer.getAtruleDescriptor('foo', 'font-family'), null);
    });
});
