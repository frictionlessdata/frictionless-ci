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
    // TODO: handle errors
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
    // Notify user
    const [user, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const workflow = process.env.WORKFLOW;
    const link = `https://repository.frictionlessdata.io/report/?user=${user}&repo=${repo}&workflow=${workflow}`;
    if (report.valid) {
        core.setFailed(`Data validation has failed: ${link}`);
    }
    else {
        core.info(`Data validation has passed: ${link}`);
    }
}
main()
    .then(() => { })
    .catch((error) => core.setFailed(error.message));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUFtQjtBQUNuQixnREFBdUI7QUFDdkIsc0RBQTBCO0FBQzFCLG9EQUEyQjtBQUMzQixpREFBb0M7QUFDcEMsb0RBQXFDO0FBQ3JDLDREQUE2QztBQUc3QyxLQUFLLFVBQVUsSUFBSTtJQUNqQixzQkFBc0I7SUFDdEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0lBRWxDLGVBQWU7SUFDZixJQUFJLE9BQWMsQ0FBQTtJQUNsQixJQUFJO1FBQ0YsTUFBTSxJQUFJLEdBQUcsMkJBQTJCLENBQUE7UUFDeEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDdEQsTUFBTSxNQUFNLEdBQUcsaUJBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFVLENBQUE7UUFDdkMscUNBQXFDO1FBQ3JDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDcEMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNyQixJQUFJLENBQUMsT0FBTztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUE7S0FDNUM7SUFBQyxNQUFNO1FBQ04sTUFBTSxLQUFLLEdBQUcsTUFBTSxnQkFBTSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFBO1FBQ3ZELE9BQU8sR0FBRztZQUNSLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7U0FDL0MsQ0FBQTtLQUNGO0lBRUQsZUFBZTtJQUNmLElBQUksT0FBTyxFQUFFO1FBQ1gsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzdDLE1BQU0sWUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQ2xEO0lBRUQsY0FBYztJQUNkLE1BQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxTQUFTLENBQUMsb0JBQUksQ0FBQyxDQUFBO0lBQ3JDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFBO0lBQzlFLE1BQU0sTUFBTSxHQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDeEMsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFFbEQsZ0JBQWdCO0lBQ2hCLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUN4QyxNQUFNLE9BQU8sR0FBMkI7UUFDdEMsZUFBZSxFQUFFLEtBQUs7UUFDdEIsYUFBYSxFQUFFLEVBQUU7S0FDbEIsQ0FBQTtJQUNELE1BQU0sY0FBYyxHQUFHLE1BQU0sY0FBYyxDQUFDLGNBQWMsQ0FDeEQsUUFBUSxFQUNSLENBQUMsYUFBYSxDQUFDLEVBQ2YsR0FBRyxFQUNILE9BQU8sQ0FDUixDQUFBO0lBQ0QsSUFBSSxjQUFjLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FDWiwyQ0FBMkMsY0FBYyxDQUFDLFlBQVksZ0JBQWdCLGNBQWMsQ0FBQyxXQUFXLENBQUMsTUFBTSwrQkFBK0IsQ0FDdkosQ0FBQTtLQUNGO0lBRUQsY0FBYztJQUNkLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBa0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDOUQsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUE7SUFDckMsTUFBTSxJQUFJLEdBQUcsdURBQXVELElBQUksU0FBUyxJQUFJLGFBQWEsUUFBUSxFQUFFLENBQUE7SUFDNUcsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsK0JBQStCLElBQUksRUFBRSxDQUFDLENBQUE7S0FDdEQ7U0FBTTtRQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsK0JBQStCLElBQUksRUFBRSxDQUFDLENBQUE7S0FDakQ7QUFDSCxDQUFDO0FBRUQsSUFBSSxFQUFFO0tBQ0gsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztLQUNkLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB1dGlsIGZyb20gJ3V0aWwnXG5pbXBvcnQgeWFtbCBmcm9tICdqcy15YW1sJ1xuaW1wb3J0IGdsb2JieSBmcm9tICdnbG9iYnknXG5pbXBvcnQgeyBleGVjIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCAqIGFzIGNvcmUgZnJvbSAnQGFjdGlvbnMvY29yZSdcbmltcG9ydCAqIGFzIGFydGlmYWN0IGZyb20gJ0BhY3Rpb25zL2FydGlmYWN0J1xuaW1wb3J0IHsgSURpY3QgfSBmcm9tICcuL2NvbW1vbidcblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcbiAgLy8gVE9ETzogaGFuZGxlIGVycm9yc1xuICBwcm9jZXNzLmNoZGlyKCcvZ2l0aHViL3dvcmtzcGFjZScpXG5cbiAgLy8gTG9hZCBpbnF1aXJ5XG4gIGxldCBpbnF1aXJ5OiBJRGljdFxuICB0cnkge1xuICAgIGNvbnN0IHBhdGggPSAnLmdpdGh1Yi9mcmljdGlvbmxlc3MueWFtbCdcbiAgICBjb25zdCBmaWxlID0gYXdhaXQgZnMucHJvbWlzZXMucmVhZEZpbGUocGF0aCwgJ3V0Zi04JylcbiAgICBjb25zdCBjb25maWcgPSB5YW1sLmxvYWQoZmlsZSkgYXMgSURpY3RcbiAgICAvLyBUT0RPOiB2YWxpZGF0ZSBjb25maWcgYmVpbmcgYSBkaWN0XG4gICAgY29uc3Qga2V5ID0gY29yZS5nZXRJbnB1dCgnaW5xdWlyeScpXG4gICAgaW5xdWlyeSA9IGNvbmZpZ1trZXldXG4gICAgaWYgKCFpbnF1aXJ5KSB0aHJvdyBuZXcgRXJyb3IoJ25vIGlucXVpcnknKVxuICB9IGNhdGNoIHtcbiAgICBjb25zdCBwYXRocyA9IGF3YWl0IGdsb2JieShbJyoqLyoue2Nzdix0c3YseGxzLHhsc3h9J10pXG4gICAgaW5xdWlyeSA9IHtcbiAgICAgIHRhc2tzOiBwYXRocy5tYXAoKHBhdGgpID0+ICh7IHNvdXJjZTogcGF0aCB9KSksXG4gICAgfVxuICB9XG5cbiAgLy8gU2F2ZSBpbnF1aXJ5XG4gIGlmIChpbnF1aXJ5KSB7XG4gICAgY29uc3QgZmlsZSA9IEpTT04uc3RyaW5naWZ5KGlucXVpcnksIG51bGwsIDIpXG4gICAgYXdhaXQgZnMucHJvbWlzZXMud3JpdGVGaWxlKCdpbnF1aXJ5Lmpzb24nLCBmaWxlKVxuICB9XG5cbiAgLy8gUnVuIGlucWl1cnlcbiAgY29uc3QgcHJvbUV4ZWMgPSB1dGlsLnByb21pc2lmeShleGVjKVxuICBjb25zdCB7IHN0ZG91dCB9ID0gYXdhaXQgcHJvbUV4ZWMoJ2ZyaWN0aW9ubGVzcyB2YWxpZGF0ZSBpbnF1aXJ5Lmpzb24gLS1qc29uJylcbiAgY29uc3QgcmVwb3J0OiBJRGljdCA9IEpTT04ucGFyc2Uoc3Rkb3V0KVxuICBhd2FpdCBmcy5wcm9taXNlcy53cml0ZUZpbGUoJ3JlcG9ydC5qc29uJywgc3Rkb3V0KVxuXG4gIC8vIFVwbG9hZCByZXBvcnRcbiAgY29uc3QgYXJ0aWZhY3RDbGllbnQgPSBhcnRpZmFjdC5jcmVhdGUoKVxuICBjb25zdCBvcHRpb25zOiBhcnRpZmFjdC5VcGxvYWRPcHRpb25zID0ge1xuICAgIGNvbnRpbnVlT25FcnJvcjogZmFsc2UsXG4gICAgcmV0ZW50aW9uRGF5czogOTAsXG4gIH1cbiAgY29uc3QgdXBsb2FkUmVzcG9uc2UgPSBhd2FpdCBhcnRpZmFjdENsaWVudC51cGxvYWRBcnRpZmFjdChcbiAgICAncmVwb3J0JyxcbiAgICBbJ3JlcG9ydC5qc29uJ10sXG4gICAgJy4nLFxuICAgIG9wdGlvbnNcbiAgKVxuICBpZiAodXBsb2FkUmVzcG9uc2UuZmFpbGVkSXRlbXMubGVuZ3RoID4gMCkge1xuICAgIGNvcmUuc2V0RmFpbGVkKFxuICAgICAgYEFuIGVycm9yIHdhcyBlbmNvdW50ZXJlZCB3aGVuIHVwbG9hZGluZyAke3VwbG9hZFJlc3BvbnNlLmFydGlmYWN0TmFtZX0uIFRoZXJlIHdlcmUgJHt1cGxvYWRSZXNwb25zZS5mYWlsZWRJdGVtcy5sZW5ndGh9IGl0ZW1zIHRoYXQgZmFpbGVkIHRvIHVwbG9hZC5gXG4gICAgKVxuICB9XG5cbiAgLy8gTm90aWZ5IHVzZXJcbiAgY29uc3QgW3VzZXIsIHJlcG9dID0gcHJvY2Vzcy5lbnYuR0lUSFVCX1JFUE9TSVRPUlkhLnNwbGl0KCcvJylcbiAgY29uc3Qgd29ya2Zsb3cgPSBwcm9jZXNzLmVudi5XT1JLRkxPV1xuICBjb25zdCBsaW5rID0gYGh0dHBzOi8vcmVwb3NpdG9yeS5mcmljdGlvbmxlc3NkYXRhLmlvL3JlcG9ydC8/dXNlcj0ke3VzZXJ9JnJlcG89JHtyZXBvfSZ3b3JrZmxvdz0ke3dvcmtmbG93fWBcbiAgaWYgKHJlcG9ydC52YWxpZCkge1xuICAgIGNvcmUuc2V0RmFpbGVkKGBEYXRhIHZhbGlkYXRpb24gaGFzIGZhaWxlZDogJHtsaW5rfWApXG4gIH0gZWxzZSB7XG4gICAgY29yZS5pbmZvKGBEYXRhIHZhbGlkYXRpb24gaGFzIHBhc3NlZDogJHtsaW5rfWApXG4gIH1cbn1cblxubWFpbigpXG4gIC50aGVuKCgpID0+IHt9KVxuICAuY2F0Y2goKGVycm9yKSA9PiBjb3JlLnNldEZhaWxlZChlcnJvci5tZXNzYWdlKSlcbiJdfQ==