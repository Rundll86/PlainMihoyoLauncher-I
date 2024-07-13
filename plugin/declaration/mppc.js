#!/usr/bin/env node
const { program } = require("commander");
const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs");
function throwError(message) {
    console.error(`Fatal Error: ${message}.`);
    process.exit(1);
};
if (!fs.existsSync("package.json")) {
    throwError("Cannot find package.json");
};
const package = JSON.parse(fs.readFileSync("package.json").toString());
program.command("setup").action(() => {
    package.name = package.name || "some-plugin";
    package.displayName = package.displayName || "Some Plugin";
    package.description = package.description || "Some plugin for PlainMihoyoLauncher.";
    package.author = package.author || "Unknown";
    package.version = package.version || "1.0.0";
    package.supporttedGame = package.supporttedGame || "all";
    package.main = package.main || "index.js";
    fs.writeFileSync("package.json", JSON.stringify(package, null, 4));
    console.log("Done.");
});
program.command("build").action(() => {
    const needField = ["name", "main", "version", "description", "author", "displayName", "supporttedGame"];
    const supporttedGame = ["GenshinImpact", "StarRail", "ZZZ"];
    needField.forEach(e => {
        if (!package[e]) {
            throwError(`Need field: ${e}`);
        };
    });
    if (package.supporttedGame != "all") {
        package.supporttedGame.forEach(e => {
            if (!supporttedGame.includes(e)) {
                throwError(`Invalid game type: ${e}`);
            };
        });
    };
    let outputFilename = package.name + ".mpp";
    if (fs.existsSync(outputFilename)) {
        fs.rmSync(outputFilename);
    };
    const resultFile = new AdmZip();
    resultFile.addLocalFolder(".");
    resultFile.deleteFile("package.json");
    if (fs.existsSync("package-lock.json")) {
        resultFile.deleteFile("package-lock.json");
    };
    let extname = path.extname(package.main).toUpperCase();
    let mppType = null;
    if (extname == ".JS") {
        mppType = "JS";
    } else if (extname == ".TS") {
        mppType = "TS";
    };
    if (mppType) {
        resultFile.addFile("mpp-config.json", Buffer.from(JSON.stringify({
            id: package.name,
            entry: package.main,
            type: mppType,
            author: package.author,
            displayName: package.displayName,
            description: package.description,
            supporttedGame: package.supporttedGame,
            version: package.version
        })));
    } else {
        throwError("Entry file must be .js or .ts");
    };
    resultFile.writeZip(outputFilename);
    console.log(`Output in: ${outputFilename}`);
});
program.parse(process.argv);