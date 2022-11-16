#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const prompt = require("prompt-sync")();

function main(name, overwrite = false) {
  const projectName = getProjectName(name);
  const rootPath = process.cwd();
  const projectPath = path.join(rootPath, projectName);
  const git_repo =
    "https://github.com/MetaweaveTeam/create-permawidget-vue.git";

  try {
    fs.mkdirSync(projectPath, { recursive: overwrite });
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
      `The installation is done, this is ready to use !\x1b[0m\n\nYou can now run the following commands:\n\tcd ${projectName}\n\tnpm install\n\tnpm run serve\n\n\x1b[35m\x1b[1mHappy coding !`,
      "success"
    );
  } catch (error) {
    if (error.code === "EEXIST") {
      log(`${projectPath} already exists`, "warn");
      const overwrite = input(
        "Folder already exists, do you want to overwrite it ? [y/n] ",
        "warn"
      ).toLowerCase();

      if (overwrite === "y" || overwrite == "yes") {
        const overwriteConfirm = input(
          `We are going to overwrite the folder ${projectPath}, are you sure? [y/n] `,
          "warn"
        ).toLowerCase();

        if (overwriteConfirm === "y" || overwriteConfirm == "yes") {
          execSync(`npx rimraf ${projectPath}/*`);
          main(projectName, true);
          process.exit(0);
        }
      }

      log("User declined overwrite");
      log("Aborting installation", "error");
    }
    log(error.message, "error");
  }
}

function getProjectName(name) {
  const currentFolder = process.cwd().split("/").pop();
  name =
    name ||
    process.argv[2] ||
    input(`Project name (Default: ${currentFolder}): `) ||
    ".";

  if (name === "." || name === "./") {
    return name;
  }

  name = name
    .replace(/ñ/g, "n")
    .replace(/é/g, "e")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "-")
    .replace(/@/g, "a")
    .replace(/[^a-z0-9\-_~]+/gi, "")
    .replace(/[^a-z0-9-]/gi, "")
    .toLowerCase();

  log(`Project name: ${name}`, "info");
  return name;
}

function log(message, type = "info") {
  type = type.toLowerCase();
  if (type != "error" && type != "success" && type != "warn") {
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

  if (type == "error") {
    process.exit(1);
  }
}

function input(question, type = "question") {
  type = type.toLowerCase();

  if (type != "password" && type != "success" && type != "warn") {
    type = "question";
  }

  const color = {
    question: "\x1b[35m",
    success: "\x1b[32m",
    warn: "\x1b[33m",
  };
  const reset = "\x1b[0m";
  const bold = "\x1b[1m";
  return prompt(
    `${color[type]}${bold}[Permawidget VueJS] ${reset}${color[type]}${question}${reset}`
  );
}

main();
