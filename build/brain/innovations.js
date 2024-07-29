var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Innovations_InnovationArray;
class Innovations {
    static GetInnovationID(inNode, outNode) {
        const identifier = (inNode << 16) + outNode;
        const N = __classPrivateFieldGet(this, _a, "f", _Innovations_InnovationArray).length;
        for (let i = 0; i < N; i++) {
            const val = __classPrivateFieldGet(_a, _a, "f", _Innovations_InnovationArray)[i];
            if (identifier === val)
                return i;
        }
        __classPrivateFieldGet(_a, _a, "f", _Innovations_InnovationArray)[N] = identifier;
        return N;
    }
    static Serialize() {
        return {
            'innovations': __classPrivateFieldGet(this, _a, "f", _Innovations_InnovationArray).slice()
        };
    }
}
_a = Innovations;
_Innovations_InnovationArray = { value: [] };
//# sourceMappingURL=innovations.js.map