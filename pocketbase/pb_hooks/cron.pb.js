/// <reference path="../pb_data/types.d.ts" />

cronAdd("delete old messages", "@daily", () => {
    $app.db()
    .newQuery("DELETE FROM messages WHERE created < datetime('now', '-30 day')")
    .execute()
})