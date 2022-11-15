#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo = "https://github.com/MetaweaveTeam/create-permawidget-vue.git";

if (process.argv.length < 3) {
  log(
    "Error - Please provide a project name \x1b[0m\n\tExample: npx create-permawidget-vue my-project",
    "error"
  );
  process.exit();
}

try {
  fs.mkdirSync(projectPath);
} catch (err) {
  if (err.code === "EEXIST") {
    log(
      `Error - The project ${projectName} already exists, please choose another name`,
      "error"
    );
  } else {
    console.log(err.message);
  }
}

async function main() {
  try {
    log("Cloning the repository...", "info");
    execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);

    process.chdir(projectPath);

    log("Removing useless files...", "info");
    execSync("npx rimraf ./.git");
    execSync("npx rimraf ./package.json");
    execSync("npx rimraf ./package-lock.json");
    execSync("npx rimraf ./.gitignore");
    execSync("npx rimraf ./tasks");
    execSync("npx rimraf ./LICENSE");
    execSync("npx rimraf ./README.md");

    log("Copying Template to root", "info");
    execSync(
      "mv ./template/* . || " +
        "move ./template/* . || " +
        "xcopy ./template/* . /s /e /y || " +
        "cp -r ./template/* . "
    );

    log(
      `The installation is done, this is ready to use !\x1b[0m\n\nYou can now run the following commands:\n\tcd oi\n\tnpm install\n\tnpm run serve\n\n\x1b[35m\x1b[1mHappy coding !`,
      "success"
    );
  } catch (error) {
    log(error.message, "error");
  }
}

function log(message, type = "info") {
  type = type.toLowerCase();
  if (
    type != "info" &&
    type != "error" &&
    type != "success" &&
    type != "warn"
  ) {
    type = "info";
  }

  const color = {
    info: "\x1b[36m",
    error: "\x1b[31m",
    success: "\x1b[32m",
    warn: "\x1b[33m",
  };

  console.log(
    `${color[type]}\x1b[1m[Permawidget VueJS]\x1b[0m${color[type]} ${message}`
  );
}

main();
