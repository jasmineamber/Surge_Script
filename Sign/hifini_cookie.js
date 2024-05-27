const key = "hifini_cookies";
if ($request.method == "POST") {
    let set_cookie = $response.headers[`set-cookie`]
    let bbs_token = set_cookie.split(/[=; ]/)[1]
    let cookies = `${$request.headers["cookie"]}; bbs_token=${bbs_token}`
    $persistentStore.write(cookies, key);
}
$done({});