const key = "hifini_cookies";
if ($request.method == "POST") {
    $persistentStore.write(key, $response.headers["Set-Cookie"]);
    $notification.post("title", $persistentStore.read(key));
}
$done({});