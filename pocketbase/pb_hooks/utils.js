module.exports = {
    logMessageAccess: (e, access_note) => {
        const user_id = e.auth.id
        const dataset_id = e.record?.id
        
        const dataset_ids = e.records?.map(r => r.id)

        let collection = $app.findCollectionByNameOrId("access_log")
        let accessLogRecord = new Record(collection)

        accessLogRecord.set("collection", "messages")
        accessLogRecord.set("dataset_ids", dataset_ids ?? dataset_id)
        accessLogRecord.set("user", user_id)
        accessLogRecord.set("access_note", access_note)

        $app.save(accessLogRecord);
    }
}