import Arweave from "arweave";
import assert from "assert";
import fs from "fs";

const walletFile = process.argv[2];

console.log("Wallet file:", walletFile);

const pkg = JSON.parse(fs.readFileSync("./package.json"));

assert(walletFile, "Wallet required!");

try {
  const jwk = JSON.parse(fs.readFileSync(walletFile).toString());

  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
    logging: false,
  });

  const data = fs.readFileSync("./dist/widget.js");

  const tags = [
    { name: "Content-Type", value: "application/javascript" },
    { name: "App-Name", value: "Permapage-Widget" },
    { name: "App-Version", value: "0.0.1" },
    { name: "Widget-Id", value: "latest-arprofile" },
    { name: "Widget-Name", value: pkg.name },
    { name: "Widget-Version", value: pkg.version },
    { name: "Widget-Desc", value: pkg.description },
    {
      name: "Widget-Docs",
      value: "https://github.com/MetaweaveTeam/laa-widget",
    },
  ];

  const tx = await arweave.createTransaction({ data }, jwk);
  tags.forEach((tag) => tx.addTag(tag.name, tag.value));
  await arweave.transactions.sign(tx, jwk);
  const result = await arweave.transactions.post(tx);

  console.log("Deployed!");

  console.log("result: ", result);
  console.log("TransactionId: ", tx.id);
} catch (e) {
  console.log("ERROR: ", e);
}
