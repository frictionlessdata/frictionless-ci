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
        const config = js_yaml_1.default.load(file);
        // TODO: validate config being a dict
        const key = core.getInput('inquiry');
        inquiry = config[key];
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
    const report = JSON.parse(stdout);
    if (!report.valid)
        core.setFailed('Data validation has failed');
    await fs_1.default.promises.writeFile('report.json', stdout);
    // Upload report
    const artifactClient = artifact.create();
    const options = {
        continueOnError: false,
        retentionDays: 90,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUFtQjtBQUNuQixnREFBdUI7QUFDdkIsc0RBQTBCO0FBQzFCLG9EQUEyQjtBQUMzQixpREFBb0M7QUFDcEMsb0RBQXFDO0FBQ3JDLDREQUE2QztBQUc3QyxLQUFLLFVBQVUsSUFBSTtJQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUE7SUFFbEMsZUFBZTtJQUNmLElBQUksT0FBYyxDQUFBO0lBQ2xCLElBQUk7UUFDRixNQUFNLElBQUksR0FBRywyQkFBMkIsQ0FBQTtRQUN4QyxNQUFNLElBQUksR0FBRyxNQUFNLFlBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUN0RCxNQUFNLE1BQU0sR0FBRyxpQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQVUsQ0FBQTtRQUN2QyxxQ0FBcUM7UUFDckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNwQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3JCLElBQUksQ0FBQyxPQUFPO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQTtLQUM1QztJQUFDLE1BQU07UUFDTixNQUFNLEtBQUssR0FBRyxNQUFNLGdCQUFNLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUE7UUFDdkQsT0FBTyxHQUFHO1lBQ1IsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUMvQyxDQUFBO0tBQ0Y7SUFFRCxlQUFlO0lBQ2YsSUFBSSxPQUFPLEVBQUU7UUFDWCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDN0MsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDbEQ7SUFFRCxjQUFjO0lBQ2QsTUFBTSxRQUFRLEdBQUcsY0FBSSxDQUFDLFNBQVMsQ0FBQyxvQkFBSSxDQUFDLENBQUE7SUFDckMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sUUFBUSxDQUFDLDJDQUEyQyxDQUFDLENBQUE7SUFDOUUsTUFBTSxNQUFNLEdBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUs7UUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUE7SUFDL0QsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFFbEQsZ0JBQWdCO0lBQ2hCLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUN4QyxNQUFNLE9BQU8sR0FBMkI7UUFDdEMsZUFBZSxFQUFFLEtBQUs7UUFDdEIsYUFBYSxFQUFFLEVBQUU7S0FDbEIsQ0FBQTtJQUNELE1BQU0sY0FBYyxHQUFHLE1BQU0sY0FBYyxDQUFDLGNBQWMsQ0FDeEQsUUFBUSxFQUNSLENBQUMsYUFBYSxDQUFDLEVBQ2YsR0FBRyxFQUNILE9BQU8sQ0FDUixDQUFBO0lBQ0QsSUFBSSxjQUFjLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FDWiwyQ0FBMkMsY0FBYyxDQUFDLFlBQVksZ0JBQWdCLGNBQWMsQ0FBQyxXQUFXLENBQUMsTUFBTSwrQkFBK0IsQ0FDdkosQ0FBQTtLQUNGO1NBQU07UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksY0FBYyxDQUFDLFlBQVksa0NBQWtDLENBQUMsQ0FBQTtLQUNyRjtBQUNILENBQUM7QUFFRCxJQUFJLEVBQUU7S0FDSCxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0tBQ2QsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCdcbmltcG9ydCB5YW1sIGZyb20gJ2pzLXlhbWwnXG5pbXBvcnQgZ2xvYmJ5IGZyb20gJ2dsb2JieSdcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0ICogYXMgY29yZSBmcm9tICdAYWN0aW9ucy9jb3JlJ1xuaW1wb3J0ICogYXMgYXJ0aWZhY3QgZnJvbSAnQGFjdGlvbnMvYXJ0aWZhY3QnXG5pbXBvcnQgeyBJRGljdCB9IGZyb20gJy4vY29tbW9uJ1xuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICBwcm9jZXNzLmNoZGlyKCcvZ2l0aHViL3dvcmtzcGFjZScpXG5cbiAgLy8gTG9hZCBpbnF1aXJ5XG4gIGxldCBpbnF1aXJ5OiBJRGljdFxuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSAnLmdpdGh1Yi9mcmljdGlvbmxlc3MueWFtbCdcbiAgICBjb25zdCBmaWxlID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUocGF0aCwgJ3V0Zi04JylcbiAgICBjb25zdCBjb25maWcgPSB5YW1sLmxvYWQoZmlsZSkgYXMgSURpY3RcbiAgICAvLyBUT0RPOiB2YWxpZGF0ZSBjb25maWcgYmVpbmcgYSBkaWN0XG4gICAgY29uc3Qga2V5ID0gY29yZS5nZXRJbnB1dCgnaW5xdWlyeScpXG4gICAgaW5xdWlyeSA9IGNvbmZpZ1trZXldXG4gICAgaWYgKCFpbnF1aXJ5KSB0aHJvdyBuZXcgRXJyb3IoJ25vIGlucXVpcnknKVxuICB9IGNhdGNoIHtcbiAgICBjb25zdCBwYXRocyA9IGF3YWl0IGdsb2JieShbJyoqLyoue2Nzdix0c3YseGxzLHhsc3h9J10pXG4gICAgaW5xdWlyeSA9IHtcbiAgICAgIHRhc2tzOiBwYXRocy5tYXAoKHBhdGgpID0+ICh7IHNvdXJjZTogcGF0aCB9KSksXG4gICAgfVxuICB9XG5cbiAgLy8gU2F2ZSBpbnF1aXJ5XG4gIGlmIChpbnF1aXJ5KSB7XG4gICAgY29uc3QgZmlsZSA9IEpTT04uc3RyaW5naWZ5KGlucXVpcnksIG51bGwsIDIpXG4gICAgYXdhaXQgZnMucHJvbWlzZXMud3JpdGVGaWxlKCdpbnF1aXJ5Lmpzb24nLCBmaWxlKVxuICB9XG5cbiAgLy8gUnVuIGlucWl1cnlcbiAgY29uc3QgcHJvbUV4ZWMgPSB1dGlsLnByb21pc2lmeShleGVjKVxuICBjb25zdCB7IHN0ZG91dCB9ID0gYXdhaXQgcHJvbUV4ZWMoJ2ZyaWN0aW9ubGVzcyB2YWxpZGF0ZSBpbnF1aXJ5Lmpzb24gLS1qc29uJylcbiAgY29uc3QgcmVwb3J0OiBJRGljdCA9IEpTT04ucGFyc2Uoc3Rkb3V0KVxuICBpZiAoIXJlcG9ydC52YWxpZCkgY29yZS5zZXRGYWlsZWQoJ0RhdGEgdmFsaWRhdGlvbiBoYXMgZmFpbGVkJylcbiAgYXdhaXQgZnMucHJvbWlzZXMud3JpdGVGaWxlKCdyZXBvcnQuanNvbicsIHN0ZG91dClcblxuICAvLyBVcGxvYWQgcmVwb3J0XG4gIGNvbnN0IGFydGlmYWN0Q2xpZW50ID0gYXJ0aWZhY3QuY3JlYXRlKClcbiAgY29uc3Qgb3B0aW9uczogYXJ0aWZhY3QuVXBsb2FkT3B0aW9ucyA9IHtcbiAgICBjb250aW51ZU9uRXJyb3I6IGZhbHNlLFxuICAgIHJldGVudGlvbkRheXM6IDkwLFxuICB9XG4gIGNvbnN0IHVwbG9hZFJlc3BvbnNlID0gYXdhaXQgYXJ0aWZhY3RDbGllbnQudXBsb2FkQXJ0aWZhY3QoXG4gICAgJ3JlcG9ydCcsXG4gICAgWydyZXBvcnQuanNvbiddLFxuICAgICcuJyxcbiAgICBvcHRpb25zXG4gIClcbiAgaWYgKHVwbG9hZFJlc3BvbnNlLmZhaWxlZEl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICBjb3JlLnNldEZhaWxlZChcbiAgICAgIGBBbiBlcnJvciB3YXMgZW5jb3VudGVyZWQgd2hlbiB1cGxvYWRpbmcgJHt1cGxvYWRSZXNwb25zZS5hcnRpZmFjdE5hbWV9LiBUaGVyZSB3ZXJlICR7dXBsb2FkUmVzcG9uc2UuZmFpbGVkSXRlbXMubGVuZ3RofSBpdGVtcyB0aGF0IGZhaWxlZCB0byB1cGxvYWQuYFxuICAgIClcbiAgfSBlbHNlIHtcbiAgICBjb3JlLmluZm8oYEFydGlmYWN0ICR7dXBsb2FkUmVzcG9uc2UuYXJ0aWZhY3ROYW1lfSBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgdXBsb2FkZWQhYClcbiAgfVxufVxuXG5tYWluKClcbiAgLnRoZW4oKCkgPT4ge30pXG4gIC5jYXRjaCgoZXJyb3IpID0+IGNvcmUuc2V0RmFpbGVkKGVycm9yLm1lc3NhZ2UpKVxuIl19