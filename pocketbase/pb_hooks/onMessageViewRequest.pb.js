// fires only for "users" and "articles" collections
onRecordCreate((e) => {
    console.log("create message")
    console.log(Object.keys(e.record).join("|"))
    console.log(JSON.stringify(e.record.get("files")))

    const trimmedMessage = e.record.get("encrypted_message").trim()
    const encryptedFiles = e.record.get("files")

    if(trimmedMessage && trimmedMessage.startsWith("-----BEGIN PGP MESSAGE-----"), trimmedMessage.endsWith("-----END PGP MESSAGE-----")){
        console.log("is encrypted message")
    }
    //throw "test errror"
    e.next()
}, "messages")
onRecordViewRequest((e) => {
    if (e.auth.isSuperuser())
        return e.next()

    const { logMessageAccess } = require(`${__hooks}/utils.js`)
    logMessageAccess(e, "message_view");

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

    const { logMessageAccess } = require(`${__hooks}/utils.js`)
    logMessageAccess(e, "messages_list");

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