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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const globby_1 = __importDefault(require("globby"));
const child_process_1 = require("child_process");
const core = __importStar(require("@actions/core"));
const artifact = __importStar(require("@actions/artifact"));
async function main() {
    process.chdir('/github/workspace');
    // Load inquiry
    let inquiry;
    try {
        const path = '.github/frictionless.yaml';
        const file = await fs_1.default.promises.readFile(path, 'utf-8');
        // TODO: validate inquiry
        inquiry = js_yaml_1.default.load(file);
        if (!inquiry)
            throw new Error('no inquiry');
    }
    catch {
        const paths = await globby_1.default(['**/*.{csv,tsv,xls,xlsx}']);
        inquiry = {
            tasks: paths.map((path) => ({ source: path })),
        };
    }
    // Save inquiry
    if (inquiry) {
        const file = JSON.stringify(inquiry, null, 2);
        await fs_1.default.promises.writeFile('inquiry.json', file);
    }
    // Run inqiury
    const promExec = util_1.default.promisify(child_process_1.exec);
    const { stdout } = await promExec('frictionless validate inquiry.json --json');
    await fs_1.default.promises.writeFile('report.json', stdout);
    // Upload report
    const artifactClient = artifact.create();
    const options = {
        continueOnError: false,
        retentionDays: 365,
    };
    const uploadResponse = await artifactClient.uploadArtifact('report', ['report.json'], '.', options);
    if (uploadResponse.failedItems.length > 0) {
        core.setFailed(`An error was encountered when uploading ${uploadResponse.artifactName}. There were ${uploadResponse.failedItems.length} items that failed to upload.`);
    }
    else {
        core.info(`Artifact ${uploadResponse.artifactName} has been successfully uploaded!`);
    }
}
main()
    .then(() => { })
    .catch((error) => core.setFailed(error.message));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUFtQjtBQUNuQixnREFBdUI7QUFDdkIsc0RBQTBCO0FBQzFCLG9EQUEyQjtBQUMzQixpREFBb0M7QUFDcEMsb0RBQXFDO0FBQ3JDLDREQUE2QztBQUc3QyxLQUFLLFVBQVUsSUFBSTtJQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUE7SUFFbEMsZUFBZTtJQUNmLElBQUksT0FBYyxDQUFBO0lBQ2xCLElBQUk7UUFDRixNQUFNLElBQUksR0FBRywyQkFBMkIsQ0FBQTtRQUN4QyxNQUFNLElBQUksR0FBRyxNQUFNLFlBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUN0RCx5QkFBeUI7UUFDekIsT0FBTyxHQUFHLGlCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBVSxDQUFBO1FBQ2xDLElBQUksQ0FBQyxPQUFPO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQTtLQUM1QztJQUFDLE1BQU07UUFDTixNQUFNLEtBQUssR0FBRyxNQUFNLGdCQUFNLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUE7UUFDdkQsT0FBTyxHQUFHO1lBQ1IsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUMvQyxDQUFBO0tBQ0Y7SUFFRCxlQUFlO0lBQ2YsSUFBSSxPQUFPLEVBQUU7UUFDWCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDN0MsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDbEQ7SUFFRCxjQUFjO0lBQ2QsTUFBTSxRQUFRLEdBQUcsY0FBSSxDQUFDLFNBQVMsQ0FBQyxvQkFBSSxDQUFDLENBQUE7SUFDckMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sUUFBUSxDQUFDLDJDQUEyQyxDQUFDLENBQUE7SUFDOUUsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFFbEQsZ0JBQWdCO0lBQ2hCLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUN4QyxNQUFNLE9BQU8sR0FBMkI7UUFDdEMsZUFBZSxFQUFFLEtBQUs7UUFDdEIsYUFBYSxFQUFFLEdBQUc7S0FDbkIsQ0FBQTtJQUNELE1BQU0sY0FBYyxHQUFHLE1BQU0sY0FBYyxDQUFDLGNBQWMsQ0FDeEQsUUFBUSxFQUNSLENBQUMsYUFBYSxDQUFDLEVBQ2YsR0FBRyxFQUNILE9BQU8sQ0FDUixDQUFBO0lBQ0QsSUFBSSxjQUFjLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FDWiwyQ0FBMkMsY0FBYyxDQUFDLFlBQVksZ0JBQWdCLGNBQWMsQ0FBQyxXQUFXLENBQUMsTUFBTSwrQkFBK0IsQ0FDdkosQ0FBQTtLQUNGO1NBQU07UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksY0FBYyxDQUFDLFlBQVksa0NBQWtDLENBQUMsQ0FBQTtLQUNyRjtBQUNILENBQUM7QUFFRCxJQUFJLEVBQUU7S0FDSCxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0tBQ2QsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCdcbmltcG9ydCB5YW1sIGZyb20gJ2pzLXlhbWwnXG5pbXBvcnQgZ2xvYmJ5IGZyb20gJ2dsb2JieSdcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0ICogYXMgY29yZSBmcm9tICdAYWN0aW9ucy9jb3JlJ1xuaW1wb3J0ICogYXMgYXJ0aWZhY3QgZnJvbSAnQGFjdGlvbnMvYXJ0aWZhY3QnXG5pbXBvcnQgeyBJRGljdCB9IGZyb20gJy4vY29tbW9uJ1xuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICBwcm9jZXNzLmNoZGlyKCcvZ2l0aHViL3dvcmtzcGFjZScpXG5cbiAgLy8gTG9hZCBpbnF1aXJ5XG4gIGxldCBpbnF1aXJ5OiBJRGljdFxuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSAnLmdpdGh1Yi9mcmljdGlvbmxlc3MueWFtbCdcbiAgICBjb25zdCBmaWxlID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUocGF0aCwgJ3V0Zi04JylcbiAgICAvLyBUT0RPOiB2YWxpZGF0ZSBpbnF1aXJ5XG4gICAgaW5xdWlyeSA9IHlhbWwubG9hZChmaWxlKSBhcyBJRGljdFxuICAgIGlmICghaW5xdWlyeSkgdGhyb3cgbmV3IEVycm9yKCdubyBpbnF1aXJ5JylcbiAgfSBjYXRjaCB7XG4gICAgY29uc3QgcGF0aHMgPSBhd2FpdCBnbG9iYnkoWycqKi8qLntjc3YsdHN2LHhscyx4bHN4fSddKVxuICAgIGlucXVpcnkgPSB7XG4gICAgICB0YXNrczogcGF0aHMubWFwKChwYXRoKSA9PiAoeyBzb3VyY2U6IHBhdGggfSkpLFxuICAgIH1cbiAgfVxuXG4gIC8vIFNhdmUgaW5xdWlyeVxuICBpZiAoaW5xdWlyeSkge1xuICAgIGNvbnN0IGZpbGUgPSBKU09OLnN0cmluZ2lmeShpbnF1aXJ5LCBudWxsLCAyKVxuICAgIGF3YWl0IGZzLnByb21pc2VzLndyaXRlRmlsZSgnaW5xdWlyeS5qc29uJywgZmlsZSlcbiAgfVxuXG4gIC8vIFJ1biBpbnFpdXJ5XG4gIGNvbnN0IHByb21FeGVjID0gdXRpbC5wcm9taXNpZnkoZXhlYylcbiAgY29uc3QgeyBzdGRvdXQgfSA9IGF3YWl0IHByb21FeGVjKCdmcmljdGlvbmxlc3MgdmFsaWRhdGUgaW5xdWlyeS5qc29uIC0tanNvbicpXG4gIGF3YWl0IGZzLnByb21pc2VzLndyaXRlRmlsZSgncmVwb3J0Lmpzb24nLCBzdGRvdXQpXG5cbiAgLy8gVXBsb2FkIHJlcG9ydFxuICBjb25zdCBhcnRpZmFjdENsaWVudCA9IGFydGlmYWN0LmNyZWF0ZSgpXG4gIGNvbnN0IG9wdGlvbnM6IGFydGlmYWN0LlVwbG9hZE9wdGlvbnMgPSB7XG4gICAgY29udGludWVPbkVycm9yOiBmYWxzZSxcbiAgICByZXRlbnRpb25EYXlzOiAzNjUsXG4gIH1cbiAgY29uc3QgdXBsb2FkUmVzcG9uc2UgPSBhd2FpdCBhcnRpZmFjdENsaWVudC51cGxvYWRBcnRpZmFjdChcbiAgICAncmVwb3J0JyxcbiAgICBbJ3JlcG9ydC5qc29uJ10sXG4gICAgJy4nLFxuICAgIG9wdGlvbnNcbiAgKVxuICBpZiAodXBsb2FkUmVzcG9uc2UuZmFpbGVkSXRlbXMubGVuZ3RoID4gMCkge1xuICAgIGNvcmUuc2V0RmFpbGVkKFxuICAgICAgYEFuIGVycm9yIHdhcyBlbmNvdW50ZXJlZCB3aGVuIHVwbG9hZGluZyAke3VwbG9hZFJlc3BvbnNlLmFydGlmYWN0TmFtZX0uIFRoZXJlIHdlcmUgJHt1cGxvYWRSZXNwb25zZS5mYWlsZWRJdGVtcy5sZW5ndGh9IGl0ZW1zIHRoYXQgZmFpbGVkIHRvIHVwbG9hZC5gXG4gICAgKVxuICB9IGVsc2Uge1xuICAgIGNvcmUuaW5mbyhgQXJ0aWZhY3QgJHt1cGxvYWRSZXNwb25zZS5hcnRpZmFjdE5hbWV9IGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSB1cGxvYWRlZCFgKVxuICB9XG59XG5cbm1haW4oKVxuICAudGhlbigoKSA9PiB7fSlcbiAgLmNhdGNoKChlcnJvcikgPT4gY29yZS5zZXRGYWlsZWQoZXJyb3IubWVzc2FnZSkpXG4iXX0=