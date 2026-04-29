import * as path from "node:path";
import { glob } from "glob";
import Mocha from "mocha";

export function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: "tdd",
		color: true,
	});

	const testsRoot = path.resolve(__dirname, "..");

	return (async () => {
		try {
			const files = await glob("**/**.test.js", { cwd: testsRoot });
			for (const f of files) {
				mocha.addFile(path.resolve(testsRoot, f));
			}
			await mocha.loadFilesAsync();
			await new Promise<void>((resolve, reject) => {
				mocha.run((failures) => {
					if (failures > 0) {
						reject(new Error(`${failures} tests failed.`));
					} else {
						resolve();
					}
				});
			});
		} catch (err) {
			console.error(err);
			throw err;
		}
	})();
}
