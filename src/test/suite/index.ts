import { glob } from "glob";
import * as Mocha from "mocha";
import * as path from "path";

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
