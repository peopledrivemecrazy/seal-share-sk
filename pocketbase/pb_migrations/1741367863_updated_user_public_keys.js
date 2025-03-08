/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2024239405")

  // remove field
  collection.fields.removeById("text203080113")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2024239405")

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text203080113",
    "max": 0,
    "min": 0,
    "name": "revocation_certificate",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
