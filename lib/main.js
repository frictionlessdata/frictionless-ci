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
    const workflow = process.env.GITHUB_WORKFLOW;
    const link = `https://repository.frictionlessdata.io/report/?user=${user}&repo=${repo}&workflow=${workflow}`;
    if (!report.valid) {
        core.setFailed(`Data validation has failed: ${link}`);
    }
    else {
        core.info(`Data validation has passed: ${link}`);
    }
}
main()
    .then(() => { })
    .catch((error) => core.setFailed(error.message));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUFtQjtBQUNuQixnREFBdUI7QUFDdkIsc0RBQTBCO0FBQzFCLG9EQUEyQjtBQUMzQixpREFBb0M7QUFDcEMsb0RBQXFDO0FBQ3JDLDREQUE2QztBQUc3QyxLQUFLLFVBQVUsSUFBSTtJQUNqQixzQkFBc0I7SUFDdEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0lBRWxDLGVBQWU7SUFDZixJQUFJLE9BQWMsQ0FBQTtJQUNsQixJQUFJO1FBQ0YsTUFBTSxJQUFJLEdBQUcsMkJBQTJCLENBQUE7UUFDeEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDdEQsTUFBTSxNQUFNLEdBQUcsaUJBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFVLENBQUE7UUFDdkMscUNBQXFDO1FBQ3JDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDcEMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNyQixJQUFJLENBQUMsT0FBTztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUE7S0FDNUM7SUFBQyxNQUFNO1FBQ04sTUFBTSxLQUFLLEdBQUcsTUFBTSxnQkFBTSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFBO1FBQ3ZELE9BQU8sR0FBRztZQUNSLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7U0FDL0MsQ0FBQTtLQUNGO0lBRUQsZUFBZTtJQUNmLElBQUksT0FBTyxFQUFFO1FBQ1gsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzdDLE1BQU0sWUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQ2xEO0lBRUQsY0FBYztJQUNkLE1BQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxTQUFTLENBQUMsb0JBQUksQ0FBQyxDQUFBO0lBQ3JDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLFFBQVEsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFBO0lBQzlFLE1BQU0sTUFBTSxHQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDeEMsTUFBTSxZQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFFbEQsZ0JBQWdCO0lBQ2hCLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUN4QyxNQUFNLE9BQU8sR0FBMkI7UUFDdEMsZUFBZSxFQUFFLEtBQUs7UUFDdEIsYUFBYSxFQUFFLEVBQUU7S0FDbEIsQ0FBQTtJQUNELE1BQU0sY0FBYyxHQUFHLE1BQU0sY0FBYyxDQUFDLGNBQWMsQ0FDeEQsUUFBUSxFQUNSLENBQUMsYUFBYSxDQUFDLEVBQ2YsR0FBRyxFQUNILE9BQU8sQ0FDUixDQUFBO0lBQ0QsSUFBSSxjQUFjLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FDWiwyQ0FBMkMsY0FBYyxDQUFDLFlBQVksZ0JBQWdCLGNBQWMsQ0FBQyxXQUFXLENBQUMsTUFBTSwrQkFBK0IsQ0FDdkosQ0FBQTtLQUNGO0lBRUQsY0FBYztJQUNkLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBa0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDOUQsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUE7SUFDNUMsTUFBTSxJQUFJLEdBQUcsdURBQXVELElBQUksU0FBUyxJQUFJLGFBQWEsUUFBUSxFQUFFLENBQUE7SUFDNUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsSUFBSSxFQUFFLENBQUMsQ0FBQTtLQUN0RDtTQUFNO1FBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQywrQkFBK0IsSUFBSSxFQUFFLENBQUMsQ0FBQTtLQUNqRDtBQUNILENBQUM7QUFFRCxJQUFJLEVBQUU7S0FDSCxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0tBQ2QsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCdcbmltcG9ydCB5YW1sIGZyb20gJ2pzLXlhbWwnXG5pbXBvcnQgZ2xvYmJ5IGZyb20gJ2dsb2JieSdcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0ICogYXMgY29yZSBmcm9tICdAYWN0aW9ucy9jb3JlJ1xuaW1wb3J0ICogYXMgYXJ0aWZhY3QgZnJvbSAnQGFjdGlvbnMvYXJ0aWZhY3QnXG5pbXBvcnQgeyBJRGljdCB9IGZyb20gJy4vY29tbW9uJ1xuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICAvLyBUT0RPOiBoYW5kbGUgZXJyb3JzXG4gIHByb2Nlc3MuY2hkaXIoJy9naXRodWIvd29ya3NwYWNlJylcblxuICAvLyBMb2FkIGlucXVpcnlcbiAgbGV0IGlucXVpcnk6IElEaWN0XG4gIHRyeSB7XG4gICAgY29uc3QgcGF0aCA9ICcuZ2l0aHViL2ZyaWN0aW9ubGVzcy55YW1sJ1xuICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBmcy5wcm9taXNlcy5yZWFkRmlsZShwYXRoLCAndXRmLTgnKVxuICAgIGNvbnN0IGNvbmZpZyA9IHlhbWwubG9hZChmaWxlKSBhcyBJRGljdFxuICAgIC8vIFRPRE86IHZhbGlkYXRlIGNvbmZpZyBiZWluZyBhIGRpY3RcbiAgICBjb25zdCBrZXkgPSBjb3JlLmdldElucHV0KCdpbnF1aXJ5JylcbiAgICBpbnF1aXJ5ID0gY29uZmlnW2tleV1cbiAgICBpZiAoIWlucXVpcnkpIHRocm93IG5ldyBFcnJvcignbm8gaW5xdWlyeScpXG4gIH0gY2F0Y2gge1xuICAgIGNvbnN0IHBhdGhzID0gYXdhaXQgZ2xvYmJ5KFsnKiovKi57Y3N2LHRzdix4bHMseGxzeH0nXSlcbiAgICBpbnF1aXJ5ID0ge1xuICAgICAgdGFza3M6IHBhdGhzLm1hcCgocGF0aCkgPT4gKHsgc291cmNlOiBwYXRoIH0pKSxcbiAgICB9XG4gIH1cblxuICAvLyBTYXZlIGlucXVpcnlcbiAgaWYgKGlucXVpcnkpIHtcbiAgICBjb25zdCBmaWxlID0gSlNPTi5zdHJpbmdpZnkoaW5xdWlyeSwgbnVsbCwgMilcbiAgICBhd2FpdCBmcy5wcm9taXNlcy53cml0ZUZpbGUoJ2lucXVpcnkuanNvbicsIGZpbGUpXG4gIH1cblxuICAvLyBSdW4gaW5xaXVyeVxuICBjb25zdCBwcm9tRXhlYyA9IHV0aWwucHJvbWlzaWZ5KGV4ZWMpXG4gIGNvbnN0IHsgc3Rkb3V0IH0gPSBhd2FpdCBwcm9tRXhlYygnZnJpY3Rpb25sZXNzIHZhbGlkYXRlIGlucXVpcnkuanNvbiAtLWpzb24nKVxuICBjb25zdCByZXBvcnQ6IElEaWN0ID0gSlNPTi5wYXJzZShzdGRvdXQpXG4gIGF3YWl0IGZzLnByb21pc2VzLndyaXRlRmlsZSgncmVwb3J0Lmpzb24nLCBzdGRvdXQpXG5cbiAgLy8gVXBsb2FkIHJlcG9ydFxuICBjb25zdCBhcnRpZmFjdENsaWVudCA9IGFydGlmYWN0LmNyZWF0ZSgpXG4gIGNvbnN0IG9wdGlvbnM6IGFydGlmYWN0LlVwbG9hZE9wdGlvbnMgPSB7XG4gICAgY29udGludWVPbkVycm9yOiBmYWxzZSxcbiAgICByZXRlbnRpb25EYXlzOiA5MCxcbiAgfVxuICBjb25zdCB1cGxvYWRSZXNwb25zZSA9IGF3YWl0IGFydGlmYWN0Q2xpZW50LnVwbG9hZEFydGlmYWN0KFxuICAgICdyZXBvcnQnLFxuICAgIFsncmVwb3J0Lmpzb24nXSxcbiAgICAnLicsXG4gICAgb3B0aW9uc1xuICApXG4gIGlmICh1cGxvYWRSZXNwb25zZS5mYWlsZWRJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgY29yZS5zZXRGYWlsZWQoXG4gICAgICBgQW4gZXJyb3Igd2FzIGVuY291bnRlcmVkIHdoZW4gdXBsb2FkaW5nICR7dXBsb2FkUmVzcG9uc2UuYXJ0aWZhY3ROYW1lfS4gVGhlcmUgd2VyZSAke3VwbG9hZFJlc3BvbnNlLmZhaWxlZEl0ZW1zLmxlbmd0aH0gaXRlbXMgdGhhdCBmYWlsZWQgdG8gdXBsb2FkLmBcbiAgICApXG4gIH1cblxuICAvLyBOb3RpZnkgdXNlclxuICBjb25zdCBbdXNlciwgcmVwb10gPSBwcm9jZXNzLmVudi5HSVRIVUJfUkVQT1NJVE9SWSEuc3BsaXQoJy8nKVxuICBjb25zdCB3b3JrZmxvdyA9IHByb2Nlc3MuZW52LkdJVEhVQl9XT1JLRkxPV1xuICBjb25zdCBsaW5rID0gYGh0dHBzOi8vcmVwb3NpdG9yeS5mcmljdGlvbmxlc3NkYXRhLmlvL3JlcG9ydC8/dXNlcj0ke3VzZXJ9JnJlcG89JHtyZXBvfSZ3b3JrZmxvdz0ke3dvcmtmbG93fWBcbiAgaWYgKCFyZXBvcnQudmFsaWQpIHtcbiAgICBjb3JlLnNldEZhaWxlZChgRGF0YSB2YWxpZGF0aW9uIGhhcyBmYWlsZWQ6ICR7bGlua31gKVxuICB9IGVsc2Uge1xuICAgIGNvcmUuaW5mbyhgRGF0YSB2YWxpZGF0aW9uIGhhcyBwYXNzZWQ6ICR7bGlua31gKVxuICB9XG59XG5cbm1haW4oKVxuICAudGhlbigoKSA9PiB7fSlcbiAgLmNhdGNoKChlcnJvcikgPT4gY29yZS5zZXRGYWlsZWQoZXJyb3IubWVzc2FnZSkpXG4iXX0=