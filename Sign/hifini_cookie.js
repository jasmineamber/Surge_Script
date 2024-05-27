const key = "hifini_cookies"
$persistentStore.write(key, $response.headers["Set-Cookie"])
$notification.post("title", $persistentStore.read(key))
$done({})