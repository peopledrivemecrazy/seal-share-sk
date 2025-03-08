/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3446931122")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.auth.id = @request.body.sender",
    "listRule": "  @request.auth.id != \"\" && @request.auth.id = recepient",
    "viewRule": "  @request.auth.id != \"\" && @request.auth.id = recepient"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3446931122")

  // update collection data
  unmarshal({
    "createRule": "  @request.auth.id = @request.body.sender",
    "listRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
