export default {
    parse: {
        prelude() {
            return this.createSingleNodeList(
                this.Scope()
            );
        },
        block() {
            return this.Block(true, { allowNestedRules: true });
        }
    }
};
