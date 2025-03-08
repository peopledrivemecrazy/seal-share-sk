/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2024239405")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.body.user = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2024239405")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.body.userid = @request.auth.id"
  }, collection)

  return app.save(collection)
})
