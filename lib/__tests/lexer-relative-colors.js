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

    describe('hsl() with relative colors', () => {
        it('should match hsl(50 80% 40%)', () => {
            const result = lexer.matchProperty('color', 'hsl(50 80% 40%)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hsl(150deg 30% 60%)', () => {
            const result = lexer.matchProperty('color', 'hsl(150deg 30% 60%)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hsl(0.3turn 60% 45% / 0.7)', () => {
            const result = lexer.matchProperty('color', 'hsl(0.3turn 60% 45% / 0.7)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hsl(0 80% 50% / 25%)', () => {
            const result = lexer.matchProperty('color', 'hsl(0 80% 50% / 25%)');

            assert(result.matched, 'Should match relative color with calc functions');
        });

        it('should match hsl(none 75% 25%)', () => {
            const result = lexer.matchProperty('color', 'hsl(none 75% 25%)');

            assert(result.matched, 'Should match relative color with hwb and calc');
        });

        it('should match hsl(from green h s l / 0.5)', () => {
            const result = lexer.matchProperty('color', 'hsl(from green h s l / 0.5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hsl(from #123456 h s calc(l + 20))', () => {
            const result = lexer.matchProperty('color', 'hsl(from #123456 h s calc(l + 20))');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hsl(from rgb(200 0 0) calc(h + 30) s calc(l + 30))', () => {
            const result = lexer.matchProperty('color', 'hsl(from rgb(200 0 0) calc(h + 30) s calc(l + 30))');

            assert(result.matched, 'Should match relative color syntax');
        });
    });

    describe('hsla() with relative colors', () => {
        it('should match hsla(50 80% 40%)', () => {
            const result = lexer.matchProperty('color', 'hsla(50 80% 40%)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hsla(150deg 30% 60%)', () => {
            const result = lexer.matchProperty('color', 'hsla(150deg 30% 60%)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hsla(0.3turn 60% 45% / 0.7)', () => {
            const result = lexer.matchProperty('color', 'hsla(0.3turn 60% 45% / 0.7)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hsla(0 80% 50% / 25%)', () => {
            const result = lexer.matchProperty('color', 'hsla(0 80% 50% / 25%)');

            assert(result.matched, 'Should match relative color with calc functions');
        });

        it('should match hsla(none 75% 25%)', () => {
            const result = lexer.matchProperty('color', 'hsla(none 75% 25%)');

            assert(result.matched, 'Should match relative color with hwb and calc');
        });

        it('should match hsla(from green h s l / 0.5)', () => {
            const result = lexer.matchProperty('color', 'hsla(from green h s l / 0.5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hsla(from #123456 h s calc(l + 20))', () => {
            const result = lexer.matchProperty('color', 'hsla(from #123456 h s calc(l + 20))');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hsla(from rgb(200 0 0) calc(h + 30) s calc(l + 30))', () => {
            const result = lexer.matchProperty('color', 'hsla(from rgb(200 0 0) calc(h + 30) s calc(l + 30))');

            assert(result.matched, 'Should match relative color syntax');
        });
    });

    describe('hwb() with relative colors', () => {
        it('should match hwb(12 50% 0%)', () => {
            const result = lexer.matchProperty('color', 'hwb(12 50% 0%)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hwb(50deg 30% 40%)', () => {
            const result = lexer.matchProperty('color', 'hwb(50deg 30% 40%)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hwb(0.5turn 10% 0% / 0.5)', () => {
            const result = lexer.matchProperty('color', 'hwb(0.5turn 10% 0% / 0.5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hwb(0 100% 0% / 50%)', () => {
            const result = lexer.matchProperty('color', 'hwb(0 100% 0% / 50%)');

            assert(result.matched, 'Should match relative color with calc functions');
        });

        it('should match hwb(from green h w b / 0.5)', () => {
            const result = lexer.matchProperty('color', 'hwb(from green h w b / 0.5)');

            assert(result.matched, 'Should match relative color with hwb and calc');
        });

        it('should match hwb(from #123456 h calc(w + 30) b)', () => {
            const result = lexer.matchProperty('color', 'hwb(from #123456 h calc(w + 30) b)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match hwb(from lch(40% 70 240deg) h w calc(b - 30))', () => {
            const result = lexer.matchProperty('color', 'hwb(from lch(40% 70 240deg) h w calc(b - 30))');

            assert(result.matched, 'Should match relative color syntax');
        });
    });

    describe('lab() with relative colors', () => {
        it('should match lab(29.2345% 39.3825 20.0664)', () => {
            const result = lexer.matchProperty('color', 'lab(29.2345% 39.3825 20.0664)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match lab(52.2345% 40.1645 59.9971 / .5)', () => {
            const result = lexer.matchProperty('color', 'lab(52.2345% 40.1645 59.9971 / .5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match lab(from green l a b / 0.5)', () => {
            const result = lexer.matchProperty('color', 'lab(from green l a b / 0.5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match lab(from #123456 calc(l + 10) a b)', () => {
            const result = lexer.matchProperty('color', 'lab(from #123456 calc(l + 10) a b)');

            assert(result.matched, 'Should match relative color with calc functions');
        });

        it('should match lab(from hsl(180 100% 50%) calc(l - 10) a b)', () => {
            const result = lexer.matchProperty('color', 'lab(from hsl(180 100% 50%) calc(l - 10) a b)');

            assert(result.matched, 'Should match relative color with hwb and calc');
        });
    });

    describe('oklab() with relative colors', () => {
        it('should match oklab(29.2345% 39.3825 20.0664)', () => {
            const result = lexer.matchProperty('color', 'oklab(29.2345% 39.3825 20.0664)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match oklab(52.2345% 40.1645 59.9971 / .5)', () => {
            const result = lexer.matchProperty('color', 'oklab(52.2345% 40.1645 59.9971 / .5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match oklab(from green l a b / 0.5)', () => {
            const result = lexer.matchProperty('color', 'oklab(from green l a b / 0.5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match oklab(from #123456 calc(l + 10) a b)', () => {
            const result = lexer.matchProperty('color', 'oklab(from #123456 calc(l + 10) a b)');

            assert(result.matched, 'Should match relative color with calc functions');
        });

        it('should match oklab(from hsl(180 100% 50%) calc(l - 10) a b)', () => {
            const result = lexer.matchProperty('color', 'oklab(from hsl(180 100% 50%) calc(l - 10) a b)');

            assert(result.matched, 'Should match relative color with hwb and calc');
        });
    });

    describe('lch() with relative colors', () => {
        it('should match lch(29.2345% 44.2 27);', () => {
            const result = lexer.matchProperty('color', 'lch(29.2345% 44.2 27)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match lch(52.2345% 72.2 56.2 / .5)', () => {
            const result = lexer.matchProperty('color', 'lch(52.2345% 72.2 56.2 / .5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match lch(from green l c h / 0.5)', () => {
            const result = lexer.matchProperty('color', 'lch(from green l c h / 0.5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match lch(from #123456 calc(l + 10) c h)', () => {
            const result = lexer.matchProperty('color', 'lch(from #123456 calc(l + 10) c h)');

            assert(result.matched, 'Should match relative color with calc functions');
        });

        it('should match lch(from hsl(180 100% 50%) calc(l - 10) c h)', () => {
            const result = lexer.matchProperty('color', 'lch(from hsl(180 100% 50%) calc(l - 10) c h)');

            assert(result.matched, 'Should match relative color with hwb and calc');
        });
    });

    describe('oklch() with relative colors', () => {
        it('should match oklch(29.2345% 44.2 27);', () => {
            const result = lexer.matchProperty('color', 'oklch(29.2345% 44.2 27)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match oklch(52.2345% 72.2 56.2 / .5)', () => {
            const result = lexer.matchProperty('color', 'oklch(52.2345% 72.2 56.2 / .5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match oklch(from green l c h / 0.5)', () => {
            const result = lexer.matchProperty('color', 'oklch(from green l c h / 0.5)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match oklch(from #123456 calc(l + 10) c h)', () => {
            const result = lexer.matchProperty('color', 'oklch(from #123456 calc(l + 10) c h)');

            assert(result.matched, 'Should match relative color with calc functions');
        });

        it('should match oklch(from hsl(180 100% 50%) calc(l - 10) c h)', () => {
            const result = lexer.matchProperty('color', 'oklch(from hsl(180 100% 50%) calc(l - 10) c h)');

            assert(result.matched, 'Should match relative color with hwb and calc');
        });
    });

    describe('alpha() with relative colors', () => {
        it('should match alpha(from #123456)', () => {
            const result = lexer.matchProperty('color', 'alpha(from #123456)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match alpha(from #123456 / .25)', () => {
            const result = lexer.matchProperty('color', 'alpha(from #123456 / .25)');

            assert(result.matched, 'Should match relative color syntax');
        });

        it('should match alpha(from hsl(0 100% 50%) / calc(0.1 * 5))', () => {
            const result = lexer.matchProperty('color', 'alpha(from hsl(0 100% 50%) / calc(0.1 * 5))');

            assert(result.matched, 'Should match relative color with calc functions');
        });

        it('should match alpha(from rgb(25 25 25) / none)', () => {
            const result = lexer.matchProperty('color', 'alpha(from rgb(25 25 25) / none)');

            assert(result.matched, 'Should match relative color with none keyword');
        });
    });
});
