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
const github = __importStar(require("@actions/github"));
async function run() {
    try {
        const myInput = core.getInput('myInput');
        core.debug(`Hello ${myInput} from inside a container`);
        // Get github context data
        const context = github.context;
        console.log(`We can even get context data, like the repo: ${context.repo.repo}`);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUFxQztBQUNyQyx3REFBeUM7QUFFekMsS0FBSyxVQUFVLEdBQUc7SUFDaEIsSUFBSTtRQUNGLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLE9BQU8sMEJBQTBCLENBQUMsQ0FBQTtRQUV0RCwwQkFBMEI7UUFDMUIsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQTtRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLGdEQUFnRCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7S0FDakY7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQzlCO0FBQ0gsQ0FBQztBQUVELEdBQUcsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29yZSBmcm9tICdAYWN0aW9ucy9jb3JlJ1xuaW1wb3J0ICogYXMgZ2l0aHViIGZyb20gJ0BhY3Rpb25zL2dpdGh1YidcblxuYXN5bmMgZnVuY3Rpb24gcnVuKCkge1xuICB0cnkge1xuICAgIGNvbnN0IG15SW5wdXQgPSBjb3JlLmdldElucHV0KCdteUlucHV0JylcbiAgICBjb3JlLmRlYnVnKGBIZWxsbyAke215SW5wdXR9IGZyb20gaW5zaWRlIGEgY29udGFpbmVyYClcblxuICAgIC8vIEdldCBnaXRodWIgY29udGV4dCBkYXRhXG4gICAgY29uc3QgY29udGV4dCA9IGdpdGh1Yi5jb250ZXh0XG4gICAgY29uc29sZS5sb2coYFdlIGNhbiBldmVuIGdldCBjb250ZXh0IGRhdGEsIGxpa2UgdGhlIHJlcG86ICR7Y29udGV4dC5yZXBvLnJlcG99YClcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb3JlLnNldEZhaWxlZChlcnJvci5tZXNzYWdlKVxuICB9XG59XG5cbnJ1bigpXG4iXX0=