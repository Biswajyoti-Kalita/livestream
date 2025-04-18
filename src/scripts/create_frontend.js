const db = require("./../models");

const filepath = process.argv.find((ar, ind) => ar.startsWith("--filepath"));
const description = process.argv.find((ar, ind) => ar.startsWith("--description"));


(async () => {
  if (!filepath) return;
  const _filepath = filepath.replace("--filepath=", "");
  const _description = description ? description.replace("--description=", ""): "";
  
  console.log("Creating frontend...");
  const prevfrontend = await db.frontend.findOne({
    order: [["id", "DESC"]],
    raw: true,
  });

  console.log({ prevfrontend });
  const version = prevfrontend["version"].split(".");
  const newVersion =
    version.filter((v, ind) => ind < 2).join(".") +
    "." +
    (parseInt(version[2]) + 1);
  console.log({ newVersion });

  console.log({
    version: newVersion,
    filepath: _filepath,
    description: _description

  })

  await db.frontend.create({
    version: newVersion,
    filepath: _filepath,
    description: _description
  })
})();
