"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
async function run() {
    try {
        const myInput = core.getInput('myInput');
        console.log(`Hello "${myInput}" from inside a container`);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUFxQztBQUVyQyxLQUFLLFVBQVUsR0FBRztJQUNoQixJQUFJO1FBQ0YsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsT0FBTywyQkFBMkIsQ0FBQyxDQUFBO0tBQzFEO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUM5QjtBQUNILENBQUM7QUFFRCxHQUFHLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvcmUgZnJvbSAnQGFjdGlvbnMvY29yZSdcblxuYXN5bmMgZnVuY3Rpb24gcnVuKCkge1xuICB0cnkge1xuICAgIGNvbnN0IG15SW5wdXQgPSBjb3JlLmdldElucHV0KCdteUlucHV0JylcbiAgICBjb25zb2xlLmxvZyhgSGVsbG8gXCIke215SW5wdXR9XCIgZnJvbSBpbnNpZGUgYSBjb250YWluZXJgKVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvcmUuc2V0RmFpbGVkKGVycm9yLm1lc3NhZ2UpXG4gIH1cbn1cblxucnVuKClcbiJdfQ==