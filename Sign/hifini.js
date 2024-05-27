const jobName = "hifini.com 签到"
const cookie = $persistentStore.read("hifini_cookies")
const recentSignDate = $persistentStore.read("hifiniDailyBonusRecentSignDate")
const today = new Date()
const month = today.getMonth() + 1
const signDate = `${today.getFullYear()}${month}${today.getDate()}`

// 获取 sign
function hifiniGetSign() {
    return new Promise(resolve => {
        console.log("获取签到的 sign")
        // 获取签到的 sign
        const request = {
            url: "https://www.hifini.com/",
            headers: {
                "Cookie": cookie,
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            }
        }
        $httpClient.get(request, (error, response, data) => {
            console.log("发送请求")
            if (response.status == 200) {
                var regex = /var sign = \"(\w+)";/
                var match = regex.exec(data);
                if (match !== null) {
                    var sign = match[1]
                    console.log(`已取得 sign=${sign}`)
                    resolve(sign)
                } else {
                    console.log(`未通过正则表达式${regex}找到匹配的 sign`)
                    $done()
                }
            } else {
                console.log(`获取 sign 失败，返回码${response.status}`)
                $done()
            }
        })
    })
}

// 签到
function hifiniSign(sign) {
    if (signDate !== recentSignDate) {
        console.log("本机今天尚未签到，开始签到请求")
        const request = {
            url: "https://www.hifini.com/sg_sign.htm",
            headers: {
                "Accept-Language": "zh-Hans,zh-CN;q=0.9,zh;q=0.8",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Cookie": cookie,
                "x-requested-with": "XMLHttpRequest",
                "Referer": "https://www.hifini.com/",
                "Sec-Ch-Ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": "\"macOS\"",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            },
            body: `sign=${sign}`
        }
        $httpClient.post(request, (error, response, data) => {
            console.log("发送签到请求")
            if (response.status == 200) {
                if (data == null) {
                    console.log("请求成功，返回空")
                    const title = jobName
                    const subTitle = "请求成功，返回空，检查下"
                    $notification.post(title, subTitle, "")
                } else {
                    if (JSON.parse(data).code == 0) {
                        const title = jobName
                        const subTitle = "签到成功"
                        const detail = JSON.parse(data).message
                        console.log(detail)
                        $persistentStore.write(signDate, "hifiniDailyBonusRecentSignDate")
                        $notification.post(title, subTitle, detail)
                    } else if (JSON.parse(data).code == -1) {
                        const title = jobName
                        const subTitle = "签到跳过"
                        const detail = JSON.parse(data).message
                        console.log(detail)
                        $persistentStore.write(signDate, "hifiniDailyBonusRecentSignDate")
                        $notification.post(title, subTitle, detail)
                    } else {
                        const title = jobName
                        const subTitle = "签到失败"
                        console.log(detail)
                        const detail = `error: ${error}, response: ${response}, data: ${data}`
                        $notification.post(title, subTitle, detail)
                    }
                }
            } else {
                console.log(`请求失败，返回码${response.status}`)
                const title = jobName
                const subTitle = `请求失败，返回码${response.status}`
                $notification.post(title, subTitle, "")
            }
            $done()
        })
    } else {
        console.log("今天已经签过")
        const title = jobName
        const subTitle = "签到跳过"
        const detail = "今天已经签过啦！"
        $notification.post(title, subTitle, detail)
        $done()
    }
}

hifiniGetSign().then(sign => {
    hifiniSign(sign)
})