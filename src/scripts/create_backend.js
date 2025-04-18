const db = require("./../models");

const filepath = process.argv.find((ar, ind) => ar.startsWith("--filepath"));
const description = process.argv.find((ar, ind) => ar.startsWith("--description"));
const db_changed = process.argv.find((ar, ind) =>
  ar.startsWith("--db_changed")
);
console.log({ filepath });

(async () => {
  if (!filepath) return;
  const _filepath = filepath.replace("--filepath=", "");
  const _db_changed = db_changed ? db_changed.replace("--db_changed=", ""): null;
  const _description = description ? description.replace("--description=", ""): "";
  
  console.log("Creating backend...");
  const prevBackend = await db.backend.findOne({
    order: [["id", "DESC"]],
    raw: true,
  });

  console.log({ prevBackend });
  const version = prevBackend["version"].split(".");
  const newVersion =
    version.filter((v, ind) => ind < 2).join(".") +
    "." +
    (parseInt(version[2]) + 1);
  console.log({ newVersion });

  console.log({
    version: newVersion,
    filepath: _filepath,
    db_changed: _db_changed ? 1 : 0,
    description: _description
  })

  await db.backend.create({
    version: newVersion,
    filepath: _filepath,
    db_changed: _db_changed ? 1 : 0,
    description: _description
  })
})();
