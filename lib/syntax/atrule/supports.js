export default {
    parse: {
        prelude() {
            return this.createSingleNodeList(
                this.Condition('supports')
            );
        },
        block(nested = false, { allowNestedRules = false } = {}) {
            return this.Block(nested, { allowNestedRules });
        }
    }
};
