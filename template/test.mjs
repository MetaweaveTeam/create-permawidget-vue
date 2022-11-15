import path from "path";
import fs from "fs";
import mime from "mime-types";
import Arweave from "arweave";

//joining path of directory
const currentPath = process.cwd();
const directoryPath = path.join(currentPath, "public");
const walletFile = process.argv[2];
const jwk = JSON.parse(fs.readFileSync(walletFile).toString());
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});
const files = readFilesSync(directoryPath);
files.forEach(async (file) => {
  const isDeployed = isFileDeployed(file);

  if (!isDeployed) {
    const res = await arweaveDeployFile(file.filepath, [
      { name: "Content-Type", value: file.fileMime },
    ]);
    const storage = path.join(currentPath, "arweave-storage.json");
    var storageData = {};
    if (fs.existsSync(storage)) {
      storageData = JSON.parse(fs.readFileSync(storage).toString());
    }
    storageData[file.relativePath] = {
      name: file.name,
      find: file.relativePath.replace("public", ""),
      ext: file.ext,
      mime: file.fileMime,
      path: file.filepath,
      stat: file.stat,
      arweave: res,
    };
    fs.writeFileSync(storage, JSON.stringify(storageData));
  } else {
    console.log("File already deployed");
    console.log(isDeployed);
  }
});

function isFileDeployed(file) {
  if (file) {
    const relativePath = file.relativePath;
    const stat = file.stat;
    const storage = path.join(currentPath, "arweave-storage.json");
    if (fs.existsSync(storage)) {
      const storageData = JSON.parse(fs.readFileSync(storage).toString());
      if (storageData[relativePath]) {
        const storageFile = storageData[relativePath];
        if (
          storageFile.stat.mtimeMs >= stat.mtimeMs &&
          storageFile.stat.size === stat.size
        ) {
          return storageFile;
        }
      }
    }
  }
  return false;
}

function readFilesSync(dir) {
  var files = [];

  fs.readdirSync(dir).forEach((filename) => {
    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const relativePath = path.relative(currentPath, filepath);
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

async function arweaveDeployFile(filepath, tags) {
  const data = fs.readFileSync(filepath);

  var transaction;
  return arweave
    .createTransaction({ data }, jwk)
    .then((tx) => {
      if (0 > tags.length) {
        tags.forEach((tag) => tx.addTag(tag.name, tag.value));
      }
      transaction = tx;
      return arweave.transactions.sign(tx, jwk);
    })
    .then(() => {
      return arweave.transactions.post(transaction);
    })
    .then((res) => {
      log(
        `${filepath} deployed! \n\x1b[0mTransactionId: ${
          transaction.id
        }\n${JSON.stringify(res)}`
      );
      return transaction;
    })
    .catch((e) => {
      throw e;
    });
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
