// fires only for "users" and "articles" collections
onRecordCreateRequest((e) => {

    e.next()
})
onRecordViewRequest((e) => {
    if (e.auth.isSuperuser())
        return e.next()

    const user_id = e.auth.id
    const dataset_id = e.record.id

    let collection = $app.findCollectionByNameOrId("access_log")
    let accessLogRecord = new Record(collection)

    accessLogRecord.set("collection", "messages")
    accessLogRecord.set("dataset_ids", dataset_id)
    accessLogRecord.set("user", user_id)

    $app.save(accessLogRecord);

    e.next()
}, "messages")

onRecordsListRequest((e) => {
    // e.app
    // e.collection
    // e.records
    // e.result
    // and all RequestEvent fields...

    if (e.auth.isSuperuser())
        return e.next()

    const user_id = e.auth.id
    const dataset_ids = e.records.map(r => r.id)

    let collection = $app.findCollectionByNameOrId("access_log")
    let accessLogRecord = new Record(collection)

    accessLogRecord.set("collection", "messages")
    accessLogRecord.set("dataset_ids", dataset_ids)
    accessLogRecord.set("user", user_id)

    $app.save(accessLogRecord);

    e.next()
}, "messages")

onRecordEnrich((e) => {
    if (e.requestInfo.method !== "GET")
        return e.next()

    // dynamically show/hide a record field depending on whether the current
    // authenticated user has a certain "role" (or any other field constraint)
    console.log("enrich message", e.requestInfo.method)
    let sender = $app.findRecordById("users", e.record.get("sender"))

    e.record.withCustomData(true)
    e.record.set("sender_name", sender.get("name"))

    // fail safe if recepient is not set
    if (e.record.get("recepient")) {
        let recepient = $app.findRecordById("users", e.record.get("recepient"))
        e.record.set("recepient_name", recepient.get("name"))
    }
    e.next()
}, "messages")