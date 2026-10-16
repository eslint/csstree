export default {
    parse: {
        prelude() {
            return this.createSingleNodeList(
                this.Scope()
            );
        },
        block(nested = false, { allowNestedRules = false } = {}) {
            return this.Block(nested, { allowNestedRules });
        }
    }
};
