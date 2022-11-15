import Arweave from "arweave";
import path from "path";
import assert from "assert";
import fs from "fs";
import mime from "mime-types";

const walletFile = process.argv[2];
assert(walletFile, "Wallet required!");

const rootPath = process.cwd();

const dist = path.join(rootPath, "dist");
if (!fs.existsSync(dist)) {
  log(
    "Error: Build not found!\n\t\x1b[0mPlease run `npm run build` first.",
    "error"
  );
  process.exit();
}
const widgetPath = path.join(dist, "widget.js");
const pkg = JSON.parse(fs.readFileSync("./package.json"));
const jwk = JSON.parse(fs.readFileSync(walletFile).toString());
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});

main();

function main() {
  log("Starting Deploy...");
  deployPublic()
    .then(() => {
      log("Deploying Widget...");
      return deployWidget();
    })
    .then((arweave) => {
      log(
        `Widget Deployed!!\n you can check here: https://arweave.net/${arweave.id}`,
        "success"
      );
    });
}

async function deployPublic() {
  const files = readFilesSync("public");
  log("Deploying Public Files...");

  files.forEach((file) => {
    log(`Deploying ${file.relativePath}..`);
    deployFileSync(file).then((file) => {
      editWidget(file);
    });
  });
}

function editWidget(file) {
  if (file) {
    const widget = fs.readFileSync(widgetPath).toString();
    const widgetNew = widget.replace(file.find, file.url);
    fs.writeFileSync(widgetPath, widgetNew);
    return widgetPath;
  }

  throw new Error(
    `Error Edit Widget: File not found!\n${JSON.stringify(file)}`
  );
}

async function deployWidget() {
  const tags = [
    { name: "Content-Type", value: "application/javascript" },
    { name: "App-Name", value: "Permapage-Widget" },
    { name: "App-Version", value: "0.0.1" },
    { name: "Widget-Id", value: pkg.name },
    { name: "Widget-Name", value: pkg.name },
    { name: "Widget-Version", value: pkg.version },
    { name: "Widget-Desc", value: pkg.description },
    {
      name: "Widget-Docs",
      value: "https://github.com/MetaweaveTeam/laa-widget",
    },
  ];

  const tx = await arweaveDeployFile(widgetPath, tags);

  if (tx) {
    return tx;
  }

  throw new Error("Error Deploy Widget!");
}

async function deployFileSync(file) {
  if (file) {
    const filepath = file.filepath;
    const fileMime = file.fileMime;
    const isDeployed = isFileDeployed(file);

    var result = false;
    if (!isDeployed) {
      await arweaveDeployFile(file, {
        name: "Content-Type",
        value: fileMime,
      });
    } else {
      log(`File ${filepath} get from storage!`, "success");
    }

    result = getStorageItem(file.relativePath);

    if (!result) {
      log(`File ${filepath} not deployed!`, "error");
    }

    return result;
  }

  throw new Error(
    `Error Deploy File: File not found!\n${JSON.stringify(file)}`
  );
}

function isFileDeployed(file) {
  if (file) {
    const relativePath = file.relativePath;
    const stat = file.stat;
    const storage = path.join(rootPath, "arweave-storage.json");
    if (fs.existsSync(storage)) {
      const storageData = JSON.parse(fs.readFileSync(storage));
      if (storageData[relativePath]) {
        const storageFile = storageData[relativePath];
        if (
          storageFile.stat.mtimeMs >= stat.mtimeMs &&
          storageFile.stat.size === stat.size
        ) {
          return getStorageItem(relativePath);
        }
      }
    } else {
      return false;
    }
  }

  throw new Error(
    `Error Check File Deployed: File not found!\n${JSON.stringify(file)}`
  );
}

function getStorageItem(relativePath) {
  if (relativePath) {
    const storage = path.join(rootPath, "arweave-storage.json");
    if (fs.existsSync(storage)) {
      return JSON.parse(fs.readFileSync(storage))[relativePath];
    }
    return false;
  }

  throw new Error(
    `Error Get Storage Item: File not found!\n${JSON.stringify(relativePath)}`
  );
}

function addStorageItem(file, arweave) {
  if (file) {
    const storage = path.join(rootPath, "arweave-storage.json");
    var storageData = {};
    if (fs.existsSync(storage)) {
      storageData = JSON.parse(fs.readFileSync(storage).toString());
    }

    const find = file.relativePath.toString().replace("public", "");
    storageData[file.relativePath] = {
      name: file.name,
      find: find,
      ext: file.ext,
      mime: file.fileMime,
      path: file.filepath,
      stat: file.stat,
      url: `https://arweave.net/${arweave.id}`,
      arweave: arweave,
    };
    fs.writeFileSync(storage, JSON.stringify(storageData));
    return storageData;
  }

  throw new Error(
    `Error Add Storage Item: File not found!\n${JSON.stringify(file)}`
  );
}

function readFilesSync(dir) {
  var files = [];

  fs.readdirSync(dir).forEach((filename) => {
    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const relativePath = path.relative(rootPath, filepath);
    const fileMime = mime.lookup(filepath);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();

    if (isFile) {
      files.push({ filepath, relativePath, fileMime, name, ext, stat });
    } else {
      files = files.concat(readFilesSync(filepath));
    }
  });

  files.sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  return files;
}

function arweaveDeployFile(file, tags) {
  if (file) {
    const filepath = "object" === typeof file ? file.filepath : file;
    const data = fs.readFileSync(filepath);

    var transaction;
    return arweave
      .createTransaction({ data }, jwk)
      .then((tx) => {
        if (0 < tags.length) {
          tags.forEach((tag) => tx.addTag(tag.name, tag.value));
        }
        transaction = tx;
        return arweave.transactions.sign(tx, jwk);
      })
      .then(() => {
        return arweave.transactions.post(transaction);
      })
      .then(() => {
        log(
          `${filepath} deployed!
          \x1b[0mTransactionId: ${transaction.id}
          https://arweave.net/${transaction.id}`
        );
        if (file && "object" === typeof file) {
          addStorageItem(file, transaction);
        }
        return transaction;
      })
      .catch((e) => {
        throw e;
      });
  }

  throw new Error(
    `Error Arweave Deploy: File not found!\n${JSON.stringify(file)}`
  );
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
    `${color[type]}\x1b[1m[Permawidget VueJS]\x1b[0m${color[type]} ${message}\x1b[0m`
  );
}
