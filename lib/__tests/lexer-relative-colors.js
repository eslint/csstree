import assert from 'assert';
import { lexer } from '../index.js';

describe('lexer relative colors', () => {
    describe('rgb() with relative colors', () => {
        it('should match rgb(25 25 25 / 50%)', () => {
            const result = lexer.matchProperty('color', 'rgb(25 25 25 / 50%)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgb(from hsl(0 100% 50%) r g b)', () => {
            const result = lexer.matchProperty('color', 'rgb(from hsl(0 100% 50%) r g b)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgb(from hsl(0 100% 50%) 132 132 224)', () => {
            const result = lexer.matchProperty('color', 'rgb(from hsl(0 100% 50%) 132 132 224)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgb(from #123456 calc(r + 40) calc(g + 40) b)', () => {
            const result = lexer.matchProperty('color', 'rgb(from #123456 calc(r + 40) calc(g + 40) b)');

            assert(result.matched, 'Should match relative color with calc functions');
        });

        it('should match rgb(from hwb(120deg 10% 20%) r g calc(b + 200))', () => {
            const result = lexer.matchProperty('color', 'rgb(from hwb(120deg 10% 20%) r g calc(b + 200))');

            assert(result.matched, 'Should match relative color with hwb and calc');
        });

        it('should match rgb(25 25 25 / 50%)', () => {
            const result = lexer.matchProperty('color', 'rgb(25 25 25 / 50%)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgb(from hsl(0 100% 50%) r 80 80)', () => {
            const result = lexer.matchProperty('color', 'rgb(from hsl(0 100% 50%) r 80 80)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgb(from hsl(0 100% 50% / 0.8) r g b / alpha)', () => {
            const result = lexer.matchProperty('color', 'rgb(from hsl(0 100% 50% / 0.8) r g b / alpha)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgb(from hsl(0 100% 50% / 0.8) r g b / 0.5)', () => {
            const result = lexer.matchProperty('color', 'rgb(from hsl(0 100% 50% / 0.8) r g b / 0.5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgb(from hsl(0 100% 50%) calc(r/2) calc(g + 25) calc(b + 175) / calc(alpha - 0.1))', () => {
            const result = lexer.matchProperty('color', 'rgb(from hsl(0 100% 50%) calc(r/2) calc(g + 25) calc(b + 175) / calc(alpha - 0.1))');

            assert(result.matched, 'Should match relative color syntax');
        });
    });

    describe('rgba() with relative colors', () => {
        it('should match rgba(25 25 25)', () => {
            const result = lexer.matchProperty('color', 'rgba(25 25 25)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgba(25 25 25 / 50%)', () => {
            const result = lexer.matchProperty('color', 'rgba(25 25 25 / 50%)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgba(from hsl(0 100% 50%) r g b)', () => {
            const result = lexer.matchProperty('color', 'rgba(from hsl(0 100% 50%) r g b)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgba(from hsl(0 100% 50%) 132 132 224)', () => {
            const result = lexer.matchProperty('color', 'rgba(from hsl(0 100% 50%) 132 132 224)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgba(from #123456 calc(r + 40) calc(g + 40) b)', () => {
            const result = lexer.matchProperty('color', 'rgba(from #123456 calc(r + 40) calc(g + 40) b)');

            assert(result.matched, 'Should match relative color with calc functions');
        });

        it('should match rgba(from hwb(120deg 10% 20%) r g calc(b + 200))', () => {
            const result = lexer.matchProperty('color', 'rgba(from hwb(120deg 10% 20%) r g calc(b + 200))');

            assert(result.matched, 'Should match relative color with hwb and calc');
        });

        it('should match rgba(25 25 25 / 50%)', () => {
            const result = lexer.matchProperty('color', 'rgba(25 25 25 / 50%)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgba(from hsl(0 100% 50%) r 80 80)', () => {
            const result = lexer.matchProperty('color', 'rgba(from hsl(0 100% 50%) r 80 80)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgba(from hsl(0 100% 50% / 0.8) r g b / alpha)', () => {
            const result = lexer.matchProperty('color', 'rgba(from hsl(0 100% 50% / 0.8) r g b / alpha)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgba(from hsl(0 100% 50% / 0.8) r g b / 0.5)', () => {
            const result = lexer.matchProperty('color', 'rgba(from hsl(0 100% 50% / 0.8) r g b / 0.5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match rgba(from hsl(0 100% 50%) calc(r/2) calc(g + 25) calc(b + 175) / calc(alpha - 0.1))', () => {
            const result = lexer.matchProperty('color', 'rgba(from hsl(0 100% 50%) calc(r/2) calc(g + 25) calc(b + 175) / calc(alpha - 0.1))');

            assert(result.matched, 'Should match relative color syntax');
        });
    });
});
