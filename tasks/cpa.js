#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const projectName = process.argv[2];
const rootPath = process.cwd();
const projectPath = path.join(rootPath, projectName);
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

    log("Copying template to root", "info");
    execSync(
      "mv ./template/* . || " +
        "move ./template/* . || " +
        "xcopy ./template/* . /s /e /y || " +
        "cp -r ./template/* . "
    );

    log("Editing essentials files", "info");
    const pkgPath = path.join(projectPath, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath));

    pkg.name = projectName;
    pkg.description = `Permawidget VueJS project ${projectName}`;
    pkg.version = "0.0.0";
    pkg.author = "Your Name";
    pkg.repository = {
      type: "git",
      url: "git+yourrepo.git",
    };
    pkg.bugs = "yourrepo/issues";
    pkg.homepage = "yourrepo#readme";

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    log("Package.json successfully updated", "success");

    const mainTsPath = path.join(projectPath, "src/main.ts");
    const mainTs = fs.readFileSync(mainTsPath, "utf8");

    fs.writeFileSync(
      mainTsPath,
      mainTs.replace("create-permawidget-vue", projectName)
    );
    log("main.ts successfully updated", "success");

    const indexHtmlPath = path.join(projectPath, "index.html");
    const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");

    fs.writeFileSync(
      indexHtmlPath,
      indexHtml.replace("create-permawidget-vue", projectName)
    );

    log("index.html successfully updated", "success");

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
