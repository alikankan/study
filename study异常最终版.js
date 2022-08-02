auto.waitFor();
importClass(android.database.sqlite.SQLiteDatabase);
importClass(java.net.HttpURLConnection);
importClass(java.net.URL);
importClass(java.io.File);
importClass(java.io.FileOutputStream);
var url = "https://gh-proxy.com//https://raw.githubusercontent.com/Twelve-blog/Study_hamibot/main/QuestionBank.db";
var path = "/sdcard/QuestionBank.db";
var path_replace = "/sdcard/replace.js";
var path_question = "/sdcard/question";
device.wakeUpIfNeeded(); //点亮屏幕
var first = true; //记录答题的第一次
var r; // 替换用；
var meizhou_txt = hamibot.env.checkbox_02;
var zhuanxiang_txt = hamibot.env.checkbox_01;
var siren = hamibot.env.checkbox_03;
var shuangren = hamibot.env.shuangren;

var articles = hamibot.env.article;
var video = hamibot.env.video;
var meiri = hamibot.env.meiri;
var tiaozhan = hamibot.env.tiaozhan;

var choose = hamibot.env.select_01;

var 专项答题下滑 = hamibot.env.select;
var 每周答题下滑 = hamibot.env.selectm;

var 订阅 = hamibot.env.ssub;
var 乱序 = "a";
// var 随机 = hamibot.env.suiji;

var 延迟时间 = hamibot.env.delay_s * 1;
if (!延迟时间 || 延迟时间 < 0) 延迟时间 = 0;
var stronger = hamibot.env.stronger; //每日答题增强模式
var { username } = hamibot.env;
var { password } = hamibot.env;
var { domainname } = hamibot.env;
var { projectname } = hamibot.env;
var { endpoint } = hamibot.env;
var { projectId } = hamibot.env;
var { sct_token } = hamibot.env;
var pushplus_token = hamibot.env.Token;
let ocr;
var token;
var ttt;
var { consoleshow } = hamibot.env;
var question_list = [];
//var init_true = false;
var { init_true } = hamibot.env;
var { 首轮不答 } = hamibot.env;
var { 点击延迟时间 } = hamibot.env.delay_click * 50;
if (!点击延迟时间 || 点击延迟时间 < 0) 点击延迟时间 = 0;
var downloadDialog = null;
// var init_url = "https://git.yumenaka.net/https://raw.githubusercontent.com/Twelve-blog/picture/master/question";
var init_url = "https://gh-proxy.com/https://raw.githubusercontent.com/alikankan/study/main/question";
var file_tmp = false;
//var { file_tmp } = hamibot.env;
var tikus = "";
const { TELEMETRY } = hamibot.env;
var logs = [];
/**
 * 获取用户token
 */
function get_baidu_token() {
    // 百度ocr
    if (!hamibot.env.AK || !hamibot.env.SK) {
        console.error("百度ocr配置未填写!!!");
        exit();
    }
    var res = http.post("https://aip.baidubce.com/oauth/2.0/token", {
        grant_type: "client_credentials",
        client_id: hamibot.env.AK.replace(/ /g, ""),
        client_secret: hamibot.env.SK.replace(/ /g, ""),
    });
    var xad = res.body.json()["access_token"];
    if (xad == null) {
        console.error("百度文字识别（OCR）配置出错了！！！，脚本结束");
        exit();
    } else {
        console.info("百度文字识别（OCR）配置正确");
    }
    return xad;
}
function get_token() {
    // 华为ocr
    var res = http.postJson(
        "https://iam.cn-south-1.myhuaweicloud.com/v3/auth/tokens",
        {
            auth: {
                identity: {
                    methods: ["password"],
                    password: {
                        user: {
                            name: username, //替换为实际用户名
                            password: password, //替换为实际的用户密码
                            domain: {
                                name: domainname, //替换为实际账号名
                            },
                        },
                    },
                },
                scope: {
                    project: {
                        name: projectname, //替换为实际的project name，如cn-south-1
                    },
                },
            },
        },
        {
            headers: {
                "Content-Type": "application/json;charset=utf8",
            },
        }
    );
    if (res.headers["X-Subject-Token"] == null) {
        console.error("华为文字识别（OCR）配置出错了！！！，脚本结束");
        exit();
    } else {
        console.info("华为文字识别（OCR）配置正确");
    }
    return res.headers["X-Subject-Token"];
}

function getVersion(package_name) {
    // 得到包名的版本
    let pkgs = context.getPackageManager().getInstalledPackages(0).toArray();
    for (let i in pkgs) {
        if (pkgs[i].packageName.toString() === package_name) {
            return pkgs[i].versionName;
        }
    }
}
function get_ocr() {
    console.info("你选择了第三方文字识别（OCR）");
    try {
        ocr = plugins.load("com.hraps.ocr");
    } catch (e) {
        console.error("未安装OCR插件，正在跳转浏览器下载\n密码:7faj");
        app.openUrl("https://twelve123.lanzouq.com/b017az0kj");
        exit();
    }
}

function get_hamibot_ocr() {
    console.info("你选择了hamibot内置文字识别（OCR）");
    if (app.versionName < "1.3.0-beta.1") {
        console.error("请去hamibot官网下载版本1.3.0以上的hamibot！！！，脚本结束");
        exit();
    }
}

var showlog = false;
if (shuangren == true || siren == true || stronger != "a" || tiaozhan) {
    if (consoleshow == true) console.show();

    if (siren == true || shuangren == true) {
        console.error("正在获取截图权限，并检查ocr配置是否正确");
        if (choose == "b") get_ocr();
        else if (choose == "a") {
            token = get_token();
        } else if (choose == "c") {
            get_hamibot_ocr();
        } else if (choose == "d") token = get_baidu_token();
    }
    if (stronger != "a") {
        console.info("正在检测增强模式配置");
        if (stronger == "c") {
            // 百度ocr
            if (siren == true && choose == "d") {
                ttt = token;
            } else {
                ttt = get_baidu_token();
            }
        } else if (stronger == "b") {
            // 华为ocr
            if (siren == true && choose == "a") {
                ttt = token;
            } else {
                ttt = get_token();
            }
        }
    }
    console.info("正在打开Hamibot");
    if (!files.exists(path)) {
        //toastLog('没有题库,正在下载题库，请等待！！！');
        threads.start(function () {
            var tiku = http.get(url).body.bytes();
            //console.log(tiku)
            files.writeBytes(path, tiku);
        });
    }
    launchApp("Hamibot");
    delay(1);
    // show_log();
    // while(!showlog){sleep(1000);};

    if (tiaozhan || siren || shuangren) init();
    if (tiaozhan && !(siren == true || shuangren == true || stronger != "a")) {
    } //只开了挑战答题的话
    else {
        //请求横屏截图权限
        threads.start(function () {
            if (!requestScreenCapture(false)) {
                toastLog("请求截图失败,脚本结束");
                exit();
            }
        });
        delay(1.5);
        if (textContains("立即开始").exists() || textContains("允许").exists()) {
            if (textContains("立即开始").exists()) {
                textContains("立即开始").className("Button").findOne().click();
            } else {
                textContains("允许").className("Button").findOne().click();
            }
            console.info("自动点击获取权限按键！！！");
        }
        while (true) {
            try {
                captureScreen();
                break;
            } catch (e) {
                console.log("等待截图权限中");
            }
            sleep(1500);
        }
        console.info("立即开始，允许截图权限已获取！！！");

        if (choose == "b") {
            console.time("文字识别");
            console.log("\n测试第三方OCR识别中");
            console.info("\n如果脚本结束，出现红字，则安装错误的OCR位数,卸载安装的OCR插件");
            ocr_api(images.clip(captureScreen(), 0, Math.floor(device.height / 2), device.width, Math.floor(device.height / 2)));
            console.timeEnd("文字识别");
            console.log("");
        } else if (choose == "c") {
            console.time("文字识别");
            console.log("\n测试Hamibot内置OCR识别中");
            hamibot_ocr_api(images.clip(captureScreen(), 0, Math.floor(device.height / 2), device.width, Math.floor(device.height / 2)));
            console.timeEnd("文字识别");
            console.log("");
        }
    }
}

var lCount = 1; //挑战答题轮数
var qCount = 5; //挑战答题每轮答题数

//var asub = 2; //订阅数
var aCount = 6; //文章默认学习篇数
var vCount = 6; //小视频默认学习个数
var cCount = 2; //收藏+分享+评论次数
var dayCount = 1; // 每日答题
var tzCount = 1; // 挑战答题
var zsyCount = 1; //争上游答题
var doubleCount = 1; // 双人对战
var meizhou = 1; //每周答题
var zhuanxiang = 1; //专项答题

var aTime = hamibot.env.time1; //有效阅读一分钟1分*6
var vTime = hamibot.env.time2; //每个小视频学习-5秒
var rTime = 370; //广播收听6分 * 60 = 360秒

var myScores = {}; //分数
var article_list = [];
var delay_time = 1000;
/**
 * @description: 延时函数
 * @param: seconds-延迟秒数s
 * @return: null
 */
function delay(seconds) {
    sleep(1000 * seconds + randomNum(0, 500)); //sleep函数参数单位为毫秒所以乘1000
}
/**
 * @description: 随机秒数
 * @param: seconds-秒数s
 * @return: [seconds+100,seconds+1000]
 */
function random_time(time) {
    return time + random(100, 1000);
}
/**
 * @description: 点击文本控件
 * @param: 文本
 * @return: null
 */
function my_click_clickable(target) {
    text(target).waitFor();
    click(target);
}
/**
 * @description: 生成从minNum到maxNum的随机数
 * @param: minNum-较小的数
 * @param: maxNum-较大的数
 * @return: null
 */
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        default:
            return 0;
    }
}

/**
 * @description: 文章学习计时(弹窗)函数
 * @param: n-文章标号 seconds-学习秒数
 * @return: null
 */
function article_timing(n, seconds) {
    var seconds = seconds * 1;
    seconds = seconds + randomNum(1, 5);
    h = device.height; //屏幕高
    w = device.width; //屏幕宽
    x = (w / 3) * 2;
    h1 = (h / 6) * 5;
    h2 = h / 6;
    for (var i = 0; i < seconds; i++) {
        while (!textContains("欢迎发表你的观点").exists()) {
            //如果离开了文章界面则一直等待
            console.error("当前已离开第" + (n + 1) + "文章界面，请重新返回文章页面...");
            delay(2);
        }
        if (i % 5 == 0) {
            //每5秒打印一次学习情况
            console.info("第" + (n + 1) + "篇文章已经学习" + (i + 1) + "秒,剩余" + (seconds - i - 1) + "秒!");
        }
        sleep(1000);
        if (i % 10 == 0) {
            //每10秒滑动一次，如果android版本<7.0请将此滑动代码删除
            toast(".");
            if (i <= seconds / 2) {
                swipe(x, h1, x, h2, 500); //向下滑动
            } else {
                swipe(x, h2, x, h1, 500); //向上滑动
            }
        }
    }
}

/**
 * @description: 视频学习计时(弹窗)函数
 * @param: n-视频标号 seconds-学习秒数
 * @return: null
 */
function video_timing_bailing(n, seconds) {
    var seconds = seconds * 1;
    seconds = seconds + randomNum(1, 5);
    delay(1);
    for (var i = 0; i < seconds; i++) {
        sleep(1000);
        while (!textContains("播放").exists() || desc("工作").exists()) {
            //如果离开了百灵小视频界面则一直等待
            console.error("当前已离开第" + (n + 1) + "个视频界面，请重新返回视频");
            delay(2);
        }
        console.info("第" + (n + 1) + "个视频已经观看" + (i + 1) + "秒,剩余" + (seconds - i - 1) + "秒!");
    }
}

/**
 * @description: 广播学习计时(弹窗)函数
 * @param: r_time-已经收听的时间 seconds-学习秒数
 * @return: null
 */
function radio_timing(r_time, seconds) {
    var seconds = seconds * 1;
    for (var i = 0; i < seconds; i++) {
        sleep(1000);
        if (i % 5 == 0) {
            //每5秒打印一次信息
            console.info("广播已经收听" + (i + 1 + r_time) + "秒,剩余" + (seconds - i - 1) + "秒!");
        }
        if (i % 15 == 0) {
            //每15秒弹一次窗防止息屏
            toast("这是防息屏弹窗，可忽略-. -");
        }
    }
    logs.push("广播已经收听");
}

/**
 * @description: 已读文章判断
 * @param: null
 * @return: null
 */
function insertLearnedArticle(article) {
    article_list.push(article);
}

function getLearnedArticle(article) {
    for (var i = 0; i < article_list.length; i++) {
        if (article_list[i] == article) {
            return true;
        }
    }
    return false;
}

var commentText = [
    "中国特色社会主义不是从天上掉下来的",
    "时代是出卷人，我们是答卷人，人民是阅卷人",
    "这个新时代是中国特色社会主义新时代，而不是别的什么新时代",
    "决不能因为胜利而骄傲，决不能因为成就而懈怠，决不能因为困难而退缩",
    "要打好防范和抵御风险的有准备之战，也要打好化险为夷、转危为机的战略主动战",
]; //评论内容，可自行修改，大于5个字便计分
/**
 * @description: 分享评论
 * @param: null
 * @return: null
 */
function collectCommentShare() {
    while (!text("欢迎发表你的观点").exists()) {
        toastLog("需要在文章界面");
        delay(1);
    }
    var textOrder = text("欢迎发表你的观点").findOnce().drawingOrder();

    var zhuanOrder = textOrder + 3;

    var shareIcon = className("ImageView")
        .filter(function (iv) {
            return iv.drawingOrder() == zhuanOrder;
        })
        .findOnce();

    var num = random(0, commentText.length - 1); //随机数
    click("欢迎发表你的观点");
    delay(1);
    setText(commentText[num]); //输入评论内容
    delay(1);
    click("发布"); //点击右上角发布按钮
    //toastLog("评论成功!");
    delay(2);
    click("删除"); //删除该评论
    delay(2);
    click("确认"); //确认删除
    //toastLog("评论删除成功!");
    delay(2);
    // collectIcon.click(); //取消收藏
    // delay(1);
    toastLog("分享,评论结束");
    logs.push("评论删除确认");
    //toastLog("收藏成功!");
    //分享
}

/**
 * @description: 文章学习函数  (阅读文章+文章学习时长)---6+6=12分
 * @param: null
 * @return: null
 */
function articleStudy(x) {
    var aCatlog = "推荐";
    while (!desc("工作").exists()); //等待加载出主页
    var listView = className("ListView"); //获取文章ListView控件用于翻页
    if (x == 0) {
        desc("工作").click(); //点击主页正下方的"学习"按钮
        delay(2);
        click(aCatlog);
    }
    delay(2);
    var zt_flag = false; //判断进入专题界面标志
    var fail = 0; //点击失败次数
    var x = aCount;

    console.log("需要学习" + x + "篇");
    for (var i = 0, t = 0; i < x;) {
        if (aCount <= 0) aTime = 6;
        try {
            if (text("播报").findOnce(t).parent().parent().parent().child(0).parent().parent().click() == true) {
                delay(3);
                // // delay(10); //等待加载出文章页面，后面判断是否进入了视频文章播放要用到
                //获取当前正在阅读的文章标题
                let n = 0;
                while (!textContains("欢迎发表你的观点").exists()) {
                    //如果没有找到评论框则认为没有进入文章界面，一直等待
                    delay(1);
                    console.warn("正在等待加载文章界面...");
                    if (n > 2) {
                        //等待超过3秒则认为进入了专题界面，退出进下一篇文章
                        console.warn("没找到评论框!该界面非文章界面!");
                        zt_flag = true;
                        break;
                    }
                    n++;
                }
                if (text("展开").exists()) {
                    //如果存在“展开”则认为进入了文章栏中的视频界面需退出
                    console.warn("进入了视频界面，退出并进入下一篇文章!");
                    t++;
                    back();
                    listView.scrollForward();
                    delay(1.5);
                    if (rTime != 0) {
                        while (!desc("工作").exists());
                        console.info("因为广播被打断，重新收听广播...");
                        delay(0.5);
                        listenToRadio(); //听电台广播
                        while (!desc("工作").exists());
                        desc("工作").click();
                    }
                    delay(2);
                    continue;
                }
                if (zt_flag == true) {
                    //进入专题页标志
                    console.warn("进入了专题界面，即将退出并进下一篇文章!");
                    t++;
                    back();
                    delay(2);
                    zt_flag = false;
                    continue;
                }
                var currentNewsTitle = "";
                if (id("xxqg-article-header").exists()) {
                    currentNewsTitle = id("xxqg-article-header").findOne().child(0).text(); // 最终解决办法
                } else if (textContains("来源").exists()) {
                    currentNewsTitle = textContains("来源").findOne().parent().children()[0].text();
                } else if (textContains("作者").exists()) {
                    currentNewsTitle = textContains("作者").findOne().parent().children()[0].text();
                } else if (descContains("来源").exists()) {
                    currentNewsTitle = descContains("来源").findOne().parent().children()[0].desc();
                } else if (descContains("作者").exists()) {
                    currentNewsTitle = descContains("作者").findOne().parent().children()[0].desc();
                } else {
                    console.log("无法定位文章标题,即将退出并阅读下一篇");
                    t++;
                    back();
                    delay(2);
                    continue;
                }
                if (currentNewsTitle == "") {
                    console.log("标题为空,即将退出并阅读下一篇");
                    t++;
                    back();
                    delay(2);
                    continue;
                }
                var flag = getLearnedArticle(currentNewsTitle);
                if (flag) {
                    //已经存在，表明阅读过了
                    console.info("该文章已经阅读过，即将退出并阅读下一篇");
                    t++;
                    back();
                    delay(2);
                    continue;
                } else {
                    //没阅读过，添加到数据库
                    insertLearnedArticle(currentNewsTitle);
                }
                console.log("正在学习第" + (i + 1) + "篇文章,标题：", currentNewsTitle);
                fail = 0; //失败次数清0
                //开始循环进行文章学习
                article_timing(i, aTime);
                aCount--;
                delay(2);
                if (sCount != 0) {
                    console.info("第" + (3 - sCount) + "次评论开始");
                    sCount--;
                    collectCommentShare(); //评论和分享
                }
                back(); //返回主界面
                console.info("返回主界面");
                delay(0.3);
                var 加载主页次数 = 1;
                while (!desc("工作").exists()) {
                    //等待加载出主页
                    console.info("等待加载主页");
                    delay(2);
                    back();
                    加载主页次数++;
                    if (加载主页次数 > 5) {
                        back_table();
                    }
                }
                delay(2);
                //console.info('i++，t++')
                listView.scrollForward();
                delay(1);
                i++;
                t++; //t为实际点击的文章控件在当前布局中的标号,和i不同,勿改动!
            } else {
                t++;
            }
        } catch (e) {
            listView.scrollForward();
            //console.info('异常')
            t = 0;
            delay(1.5);
        }
    }
    logs.push("文章阅读完成");
    aTime = hamibot.env.time1;
}

/**
 * @description:百灵小视频学习函数
 * @param: null
 * @return: null
 */
function videoStudy_news(tmp) {
    h = device.height; //屏幕高
    w = device.width; //屏幕宽
    x = (w / 3) * 2;
    h1 = (h / 6) * 5;
    h2 = h / 6;
    //delay(1)
    if (tmp == 1) {
        desc("工作").click();
        delay(2);
        click("百灵");
        delay(1);
    }
    var contentsText = ["推荐", "党史", "竖", "炫", "窗", "藏", "靓", "秀"];
    var contentsNum = random(0, contentsText.length - 1); //随机数
    console.info("视频看的" + contentsText[contentsNum]);
    click(contentsText[contentsNum]);
    delay(2);
    //获取listView视频列表控件用于翻页
    // var v = className("android.widget.FrameLayout").clickable(true).depth(24).findOne().bounds();
    // press(v.centerX(), v.centerY(), 150);
    log("点击:" + "android.widget.FrameLayout");
    className("android.widget.FrameLayout").clickable(true).depth(24).findOne().click();

    if (text("继续播放").exists()) click("继续播放");
    if (text("刷新重试").exists()) click("刷新重试");
    // if (text('').exists())
    //     text('').findOnce(0).parent().parent().parent().parent().child(0).click();
    delay(1);
    //var listView = className("ListView");
    var completed_watch_count = 1;
    while (completed_watch_count <= vCount) {
        log("视听学习：" + completed_watch_count + "总次数" + vCount);
        sleep(random_time(delay_time / 2));

        className("android.widget.LinearLayout").clickable(true).depth(16).waitFor();
        // 当前视频的时间长度
        try {
            var video_name = className("android.widget.TextView").clickable(true).depth(15).findOne().text();
            console.info("视频标题" + video_name);
            var video_flag = getLearnedArticle(video_name);
            if (video_flag) {
                //已经存在，表明阅读过了
                console.info("该视频已经看过，即将滑动看下一个");
                swipe(x, h1, x, h2, 500); // 下滑动
                continue;
            } else {
                //没阅读过，添加到数据库
                insertLearnedArticle(video_name);
            }
            var current_video_time = className("android.widget.TextView").clickable(false).depth(16).findOne().text().match(/\/.*/).toString().slice(1);
            // 如果视频超过一分钟就跳过
            if (Number(current_video_time.slice(0, 3)) >= 2) {
                swipe(x, h1, x, h2, 500); // 下滑动
                delay(1);
                continue;
            } else {
                delay(1);
                console.error("百灵视频小于2分钟 可以看");
            }
            sleep(Number(current_video_time.slice(4)) * 1000 + 500);
        } catch (error) {
            // 如果被"即将播放"将读取不到视频的时间长度，此时就sleep 3秒
            sleep(3000);
        }
        completed_watch_count++;
    }

    delay(2);
    back();
    logs.push("修改版百灵视频学习完成");
}

/**
 * @description: 听“电台”新闻广播函数  (视听学习+视听学习时长)---6+6=12分
 * @param: null
 * @return: null
 */
function listenToRadio() {
    click("电台");
    delay(1);
    click("听广播");
    delay(2);
    while (!(textContains("正在收听").exists() || textContains("最近收听").exists() || textContains("推荐收听").exists())) {
        log("等待加载");
        delay(1);
    }
    if (click("最近收听") == 0) {
        if (click("推荐收听") == 0) {
            click("正在收听");
        }
    }
    delay(2);
    if (id("btn_back").findOne().click() == 0) {
        delay(2);
        back(); //返回电台界面
    }
    delay(2);
}
/**
 * 处理访问异常
 */
function swipeThread(stime, ptime) {
    try {
        textContains("访问异常").waitFor();

        var bound = idContains("nc_1_n1t").findOne().bounds();
        var slider_bound = text("向右滑动验证").findOne().bounds();
        var x_start = bound.centerX();
        var dx = x_start - slider_bound.left;
        var x_end = slider_bound.right - dx;
        var x_mid = (x_end - x_start) * random(5, 8) / 10 + x_start;
        var back_x = (x_end - x_start) * random(2, 3) / 10;
        var y_start = random(bound.top, bound.bottom);
        var y_end = random(bound.top, bound.bottom);
        x_start = random(x_start - 7, x_start);
        x_end = random(x_end, x_end + 10);
        gesture(random(stime, ptime), [x_start, y_start], [x_mid, y_end], [x_mid - back_x, y_start], [x_end, y_end]);
        sleep(500);
    } catch (error) {
        log(error + "使用另一版本滑动验证");
        logs.push(error + "使用另一版本滑动验证");
        var b = textContains("向右滑动验证").findOne(2000).parent().child(2).bounds();
        delay(1);
        console.error("当前需要验证，正在过验证");
        gestures([0, random(400, 1000), [b.centerX(), b.centerY()], [device.width, b.centerY()]]);
        delay(2);

    }
    if (text("刷新").exists()) {
        text("刷新").findOne(1000).parent().click();
    }

}
function handling_access_exceptions() {
    toast("");
    if (text("访问异常").exists()) {
        logs.push("-----幸运的碰上了异常验证--------------");
        swipeThread(600, 1500);
        push_weixin_message("异常验证出现咯", Date.now().toString());
        while (text("访问异常").exists() || text("刷新").exists()) {
            if (text("刷新").exists()) {
                var thread_refreshexceptions = threads.start(function () {
                    try {
                        click("刷新");
                        text("刷新").click();
                        delay(5);
                        logs.push("-----异常验证第二次刷新咯--------------");
                        push_weixin_message("异常验证第二次刷新咯", Date.now().toString());
                        // className("android.view.View").text("刷新").findOne().click();
                        sleep(random_time(delay_time * 3));
                        swipeThread(700, 2000);
                    } catch (error) {
                        logs.push("-----异常验证刷新异常catch--------------:" + error);
                        push_weixin_message("异常验证刷新点击异常:" + error);
                        console.error("异常验证刷新点击异常:" + error);
                        swipeThread(800, 2500);
                    }
                });
                if (thread_refreshexceptions) clearInterval(thread_refreshexceptions);
            }

            // 需要开启新线程获取控件

            // 执行脚本只需通过一次验证即可，通过后将定时器关闭
            // threads.shutDownAll();
        }
    }
    if (textContains("网络开小差").exists()) {
        click("确定");
    }
}

/**
 * @description: 启动app
 * @param: null
 * @return: null
 */
function start_app() {
    if (consoleshow == true) {
        console.setPosition(0, device.height / 2); //部分华为手机console有bug请注释本行
        console.show(); //部分华为手机console有bug请注释本行
    }
    console.log("正在启动app...");
    if (!(launchApp("学习强国") || launch("cn.xuexi.android"))) {
        //启动学习强国app
        console.error("找不到学习强国App!，请自己尝试打开");
        // return;
    }
    delay(5);
    while (!desc("工作").exists()) {
        console.log("正在等待加载出主页，如果一直加载此信息，请检测是否在主界面，或者无障碍服务可能出现BUG，请停止运行hamibot重新给无障碍服务");
        if (textContains("取消").exists() && textContains("立即升级").exists()) {
            //toast('1');
            text("取消").click();
        }
        delay(1);
        back_table();
        logs.push("未找到主页，重新启动APP");
    }
    if (textContains("取消").exists() && textContains("立即升级").exists()) {
        text("取消").findOne().click();
    }
    delay(4);
}

/**
 * @description: 本地频道
 * @param: null
 * @return: null
 */
function localChannel() {
    delay(1);
    while (!desc("工作").exists()); //等待加载出主页
    desc("工作").click();
    console.log("点击本地频道");
    if (text("四川").exists()) {
        text("要闻").findOne().parent().parent().child(3).click();
        delay(2);
        className("android.support.v7.widget.RecyclerView").findOne().child(0).click();
        delay(2);
        back();
    } else {
        className("android.widget.LinearLayout").clickable(true).depth(26).waitFor();
        sleep(1000);
        log("点击:" + "android.widget.LinearLayout");
        className("android.widget.LinearLayout").clickable(true).depth(26).drawingOrder(1).findOne().click();
        sleep(1000);
        back();
    }
}

/**
 * @description: 获取积分
 * @param: null
 * @return: null
 */
function getScores(i) {
    while (!desc("工作").exists()); //等待加载出主页
    console.log("正在获取积分...");
    delay(2);
    while (!text("积分明细").exists()) {
        if (id("comm_head_xuexi_score").exists()) {
            id("comm_head_xuexi_score").findOnce().click();
        } else if (text("积分").exists()) {
            text("积分").findOnce().parent().child(1).click();
        }
        delay(3);
    }
    while (!text("登录").exists()) {
        delay(0.5);
    }
    let err = false;
    while (!err) {
        try {
            className("android.widget.ListView")
                .findOnce()
                .children()
                .forEach((item) => {
                    var name;
                    try {
                        name = item.child(0).child(0).text();
                    } catch (e) {
                        name = item.child(0).text();
                    }
                    let str = item.child(2).text().split("/");
                    // let score = str[0].match(/[0-9][0-9]*/g);
                    let score = str[0].match(/\d+/);
                    myScores[name] = score;
                });
            err = true;
        } catch (e) {
            console.log(e);
        }
    }
    if (i == 3) {
        var score = textContains("今日已累积").findOne().text();
        score += "%0A四人赛：" + myScores["四人赛"] + "分";
        score += "%0A双人赛：" + myScores["双人对战"] + "分";
        score += "%0A成长总积分：" + textContains("成长总积分").findOne().parent().child(3).text() + "分%0A";
        log(score);
        back();
        return score;
    }
    //console.log(myScores);

    aCount = Math.ceil((12 - myScores["我要选读文章"]) / 2); //文章个数
    if (i == 1) {
        console.info("检查阅读文章是否满分！");
        aCount = 12 - myScores["我要选读文章"];
        if (aCount != 0) {
            console.log("还需要阅读：" + aCount.toString() + "篇！");
        } else {
            console.info("已满分！");
        }
        delay(1);
        back();
        delay(1);
        return;
    }
    if (i == 2) {
        console.info("检查视频是否满分！");
        vCount = 6 - myScores["视听学习"];
        if (vCount != 0) {
            console.log("还需要观看：" + vCount.toString() + "篇！");
        } else {
            console.info("已满分！");
        }
        delay(1);
        back();
        delay(1);
        return;
    }
    if (aCount != 0) {
        aCount = aCount;
    }
    vCount = 6 - myScores["视听学习"];
    rTime = (6 - myScores["视听学习时长"]) * 60;
    //asub = 2 - myScores["订阅"];
    sCount = 2;
    cCount = 1 - myScores["发表观点"];
    if (myScores["每日答题"] < 5) dayCount = 1;
    else dayCount = 0;
    if (myScores["挑战答题"] < 5) tzCount = 1;
    else tzCount = 0;
    if (myScores["四人赛"] == 0) zsyCount = 1;
    else zsyCount = 0;
    if (myScores["双人对战"] == 0) doubleCount = 1;
    else doubleCount = 0;
    if (myScores["每周答题"] == 0) meizhou = 1;
    else meizhou = 0;
    if (myScores["专项答题"] == 0) zhuanxiang = 1;
    else zhuanxiang = 0;

    console.log("评论：" + cCount.toString() + "个");
    //console.log("分享：" + sCount.toString() + "个");
    //console.log("订阅：" + asub.toString() + "个");
    console.log("剩余文章：" + aCount.toString() + "篇");
    // console.log('剩余每篇文章学习时长：' + aTime.toString() + '秒')
    console.log("剩余视频：" + vCount.toString() + "个");
    console.log("剩视听学习时长：" + rTime.toString() + "秒");
    console.log("每日答题：\t" + dayCount.toString());
    console.log("挑战答题：\t" + tzCount.toString());
    console.log("四人赛：\t" + zsyCount.toString());
    console.log("双人对战：\t" + doubleCount.toString());
    if (meizhou_txt == "开启") console.log("每周答题：\t" + meizhou.toString());
    if (zhuanxiang_txt == "开启") console.log("专项答题：\t" + zhuanxiang.toString());

    delay(1);
    back();
    delay(1);
}

/**
@description: 停止广播
@param: null
@return: null
*/
function stopRadio() {
    console.log("停止收听广播！");
    click("电台");
    delay(1);
    click("听广播");
    delay(2);
    while (!(textContains("正在收听").exists() || textContains("最近收听").exists() || textContains("推荐收听").exists())) {
        log("等待加载");
        delay(2);
    }
    if (click("正在收听") == 0) {
        click("最近收听");
    }
    delay(3);
    id("v_play").findOnce(0).click();
    delay(2);
    if (id("btn_back").findOne().click() == 0) {
        delay(2);
        back();
    }
    delay(2);
    try {
        if (id("v_playing").exists()) id("v_playing").findOnce(0).click();
    } catch (e) { }
}

function questionShow() {
    while (!desc("工作").exists()) {
        console.log("等待加载出主页");
        delay(1);
        if (text("排行榜").exists()) {
            return;
        } else {
            delay(1);
            等待主页(1);
        }
    }
    console.log("当前在主界面");
    if (text("我的").exists()) {
        text("我的").click();
        console.log("点击我的");
    }
    delay(1);
    while (!desc("我的信息").exists()) {
        console.log("等待 我的 界面");
        delay(1);
    }
    console.log("点击我要答题");
    text("我要答题").findOne().parent().click();
    delay(1);
}

function meizhouAnswer() {
    h = device.height; //屏幕高
    w = device.width; //屏幕宽
    x = (w / 3) * 2;
    h1 = (h / 6) * 5;
    h2 = h / 6;
    while (!text("排行榜").exists()) {
        console.info("等待我要答题界面");
        delay(1);
        questionShow(); // 进入我要答题
    }
    var textOrder = text("排行榜").findOnce().parent();
    while (text("排行榜").exists()) {
        console.info("点击每周答题");
        textOrder.child(3).click();
        delay(1);
        handling_access_exceptions();
    }
    delay(3);
    var t = 0;
    while (true) {
        if (text("未作答").exists()) {
            text("未作答").findOne().parent().click();
            dailyAnswer();
            break;
        } else {
            if (每周答题下滑 == "a") {
                console.info("没有可答题的题目，返回");
                back();
                delay(1);
                if (text("已作答").exists() || t > 5) {
                    // 防止出现网络卡顿
                    back();
                    delay(1);
                }
                break;
            } else {
                if (textContains("您已经看到了我的底线").exists()) {
                    console.log("已经没有可答题的题目了，返回");
                    back();
                    delay(1);
                    break;
                }
                swipe(x, h1, x, h2, 100); // 下滑动
                try {
                    textContains("月").findOnce(0).parent().parent().parent().scrollForward();
                } catch (e) { }
                delay(1);
                if (t % 10 == 0) console.log("向下滑动中！！！");
                t++;
            }
        }
    }
    logs.push("每周答题完成");
}

function zhuanxiangAnswer() {
    h = device.height; //屏幕高
    w = device.width; //屏幕宽
    x = (w / 3) * 2;
    h1 = (h / 6) * 5;
    h2 = h / 6;
    while (!text("排行榜").exists()) {
        console.info("等待我要答题界面");

        questionShow(); // 进入我要答题
        delay(1);
    }
    var textOrder = text("排行榜").findOnce().parent();
    while (text("排行榜").exists()) {
        console.info("点击专项答题");
        textOrder.child(4).click();
        delay(1);
        handling_access_exceptions();
    }
    delay(3);
    var t = 0;

    while (true) {
        if (text("继续答题").exists() || text("开始答题").exists()) {
            if (text("继续答题").exists()) text("继续答题").findOne().click();
            else if (text("开始答题").exists()) text("开始答题").findOne().click();
            delay(1);
            dailyAnswer();
            break;
        } else {
            if (专项答题下滑 == "a") {
                console.log("没有可答题的题目，返回");
                back();
                delay(1);
                if (text("已满分").exists() || text("继续答题").exists() || text("开始答题").exists() || t > 5) {
                    // 防止出现网络卡顿
                    back();
                    delay(1);
                }
                break;
            } else {
                if (textContains("您已经看到了我的底线").exists() || t > 5) {
                    console.log("已经没有可答题的题目了，返回");
                    back();
                    delay(1);
                    break;
                }
                swipe(x, h1, x, h2, 300); // 下滑动
                try {
                    textContains("专项").findOnce(0).parent().scrollForward();
                } catch (e) { }

                //delay(1);
                if (t % 10 == 0) console.log("向下滑动中！！！");
                t++;
            }
        }
    }
}

/**
 * @description: 获取填空题题目数组
 * @param: null
 * @return: questionArray
 */
function getFitbQuestion() {
    var questionCollections = className("EditText").findOnce().parent().parent();
    var questionArray = [];
    var findBlank = false;
    var blankCount = 0;
    var blankNumStr = "";
    var i = 0;
    questionCollections.children().forEach((item) => {
        if (item.className() != "android.widget.EditText") {
            if (item.text() != "") {
                //题目段
                if (findBlank) {
                    blankNumStr = "|" + blankCount.toString();
                    questionArray.push(blankNumStr);
                    findBlank = false;
                }
                questionArray.push(item.text());
            } else {
                findBlank = true;
                blankCount = className("EditText").findOnce(i).parent().childCount() - 1;
                i++;
            }
        }
    });
    return questionArray;
}

/**
 * @description: 获取选择题题目数组
 * @param: null
 * @return: questionArray
 */
function getChoiceQuestion() {
    var questionCollections = className("ListView").findOnce().parent().child(1);
    var questionArray = [];
    questionArray.push(questionCollections.text());
    return questionArray;
}

/**
 * @description: 获取提示字符串
 * @param: null
 * @return: tipsStr
 */
function getTipsStr() {
    var tipsStr = "";
    while (tipsStr == "") {
        if (text("查看提示").exists()) {
            var seeTips = text("查看提示").findOnce();
            seeTips.click();
            delay(1);
            click(device.width * 0.5, device.height * 0.41);
            delay(1);
            click(device.width * 0.5, device.height * 0.35);
        } else {
            console.error("未找到查看提示");
        }
        if (text("提示").exists()) {
            var tipsLine = text("提示").findOnce().parent();
            //获取提示内容
            var tipsView = tipsLine.parent().child(1).child(0);
            tipsStr = tipsView.text();
            //关闭提示
            tipsLine.child(1).click();
            break;
        }
        delay(1);
    }
    return tipsStr;
}

/**
 * @description: 从提示中获取填空题答案
 * @param: timu, tipsStr
 * @return: ansTips
 */
function getAnswerFromTips(timu, tipsStr) {
    var ansTips = "";
    for (var i = 1; i < timu.length - 1; i++) {
        if (timu[i].charAt(0) == "|") {
            if (timu[i].charAt(0) == "|") {
                var blankLen = timu[i].substring(1);
                // var indexKey = tipsStr.indexOf(timu[i + 1].substr(0,Math.min(8,timu[i + 1].length)));
                // if(timu[i + 1]=='。') indexKey = tipsStr.length - 1;
                // var ansFind = tipsStr.substr(indexKey - blankLen, blankLen);
                // ansTips += ansFind;
                var s = timu[i - 1].substr(Math.max(0, timu[i - 1].length - 12), 12);
                var indexKey = tipsStr.indexOf(s) + s.length;
                var ansFind = tipsStr.substr(indexKey, blankLen);
                ansTips += ansFind;
            }
        }
    }
    return ansTips;
}

/**
 * @description: 根据提示点击选择题选项
 * @param: tipsStr
 * @return: clickStr
 */
function clickByTips(tipsStr) {
    var clickStr = "";
    var isFind = false;
    if (className("ListView").exists()) {
        var listArray = className("ListView").findOne().children();
        listArray.forEach((item) => {
            var ansStr = item.child(0).child(2).text();
            if (tipsStr.indexOf(ansStr) >= 0) {
                item.child(0).click();
                clickStr += item.child(0).child(1).text().charAt(0);
                isFind = true;
            }
        });
        if (!isFind) {
            //没有找到 点击第一个
            listArray[0].child(0).click();
            clickStr += listArray[0].child(0).child(1).text().charAt(0);
        }
    }
    return clickStr;
}

/**
 * @description: 根据答案点击选择题选项
 * @param: answer
 * @return: null
 */
function clickByAnswer(answer) {
    var click_true = false;
    if (className("ListView").exists()) {
        var listArray = className("ListView").findOnce().children();
        listArray.forEach((item) => {
            var listIndexStr = item.child(0).child(1).text().charAt(0);
            //单选答案为非ABCD
            var listDescStr = item.child(0).child(2).text();
            if (answer.indexOf(listIndexStr) >= 0 || answer == listDescStr) {
                //  sleep(点击延迟时间);
                item.child(0).click();
                click_true = true;
            }
        });
    }
    if (!click_true) {
        console.error("没有找到选项，选A跳过");
        className("ListView").findOnce().child(0).child(0).click();
    }
}

/**
 * @description: 检查答案是否正确
 * @param: question, ansTiku, answer
 * @return: null
 */
function checkAndUpdate(question, ansTiku, answer) {
    sleep(500);
    if (textContains("答案解析").exists()) {
        //答错了
        swipe(device.width / 2, device.height - 200, 100, 100, 500);
        if (text("确定").exists()) {
            text("确定").click();
        } else if (textContains("下一题").exists()) {
            textContains("下一题").click();
        } else if (className("Button").exists()) {
            className("Button").findOnce().click();
        } else {
            click(device.width * 0.85, device.height * 0.06);
        }
    }
}

function daily_Answer(question, table_name) {
    try {
        var db = SQLiteDatabase.openOrCreateDatabase(path, null);
        sql = "SELECT answer FROM " + table_name + " WHERE question LIKE '" + question + "%'";
        var cursor = db.rawQuery(sql, null);
        if (cursor.moveToFirst()) {
            var answer = cursor.getString(0);
            cursor.close();
            return answer;
        } else {
            cursor.close();
            return "";
        }
    } catch (e) {
        return "";
    }
}
/**
 * @description: 每日答题循环
 * @param: null
 * @return: null
 */
function dailyQuestionLoop() {
    var vdlNum = 1;
    while (true) {
        if (textStartsWith("填空题").exists()) {
            var questionArray = getFitbQuestion();
            break;
        } else if (textStartsWith("多选题").exists() || textStartsWith("单选题").exists()) {
            var questionArray = getChoiceQuestion();
            break;
        }
        log("等待题目出现");
        vdlNum++;
        if (vdlNum > 8) {
            back_table();

            break;
        }
        delay(1);
    }

    var blankArray = [];
    var question = "";
    questionArray.forEach((item) => {
        if (item != null && item.charAt(0) == "|") {
            //是空格数
            blankArray.push(item.substring(1));
        } else {
            //是题目段
            question += item;
        }
    });
    question = question.replace(/\s/g, "");
    console.log("题目：" + question);
    logs.push("题目：" + question);
    var ansTiku = daily_Answer(question, "tiku");

    if (ansTiku.length == 0) {
        //tiku表中没有则到tikuNet表中搜索答案
        ansTiku = daily_Answer(question, "tikuNet");
    }
    var answer = ansTiku.replace(/(^\s*)|(\s*$)/g, "");
    // getAnswer(question);

    if (textStartsWith("填空题").exists()) {
        if (answer == "") {
            if (stronger == "a") {
                var tipsStr = getTipsStr();
                answer = getAnswerFromTips(questionArray, tipsStr);
                console.info("提示中的答案：" + answer);
                logs.push("提示中的答案：" + answer);
            } else if (stronger == "b") {
                var seeTips = text("查看提示").findOnce();
                seeTips.click();
                delay(1);
                var img = captureScreen();
                try {
                    var t = text("提示").findOne(3000);
                    t = t.parent().parent().child(1).child(0).bounds();
                    img = images.clip(img, t.left, t.top, t.right - t.left, t.bottom - t.top);
                } catch (e) { }
                answer = huawei_ocr_api(images.inRange(img, "#FFFF0000", "#FFFF0000"), ttt);
                console.info("华为OCR识别的答案：" + answer);
                logs.push("华为OCR识别的答案：" + answer);
                back();
            } else if (stronger == "c") {
                var seeTips = text("查看提示").findOnce();
                seeTips.click();
                delay(1);
                var img = captureScreen();
                try {
                    var t = text("提示").findOne(3000);
                    t = t.parent().parent().child(1).child(0).bounds();
                    img = images.clip(img, t.left, t.top, t.right - t.left, t.bottom - t.top);
                } catch (e) { }
                answer = baidu_ocr_api(images.inRange(img, "#FFFF0000", "#FFFF0000"), ttt);
                console.info("百度OCR识别的答案：" + answer);
                logs.push("百度OCR识别的答案：" + answer);
                back();
            }

            if (answer == "") answer = "没有找到提示";
            setText(0, answer.substr(0, blankArray[0]));
            if (blankArray.length > 1) {
                for (var i = 1; i < blankArray.length; i++) {
                    setText(i, answer.substr(blankArray[i - 1], blankArray[i]));
                }
            }
        } else {
            console.info("答案：" + answer);
            logs.push("答案：" + answer);
            setText(0, answer.substr(0, blankArray[0]));
            if (blankArray.length > 1) {
                for (var i = 1; i < blankArray.length; i++) {
                    setText(i, answer.substr(blankArray[i - 1], blankArray[i]));
                }
            }
        }
    } else if (textStartsWith("多选题").exists() || textStartsWith("单选题").exists()) {
        if (answer == "") {
            if (stronger == "a") {
                var tipsStr = getTipsStr();
                answer = clickByTips(tipsStr);
                console.info("提示中的答案：" + answer);
                logs.push("提示中的答案：" + answer);
            } else if (stronger == "b") {
                var seeTips = text("查看提示").findOnce();
                seeTips.click();
                delay(1);
                var img = captureScreen();
                try {
                    var t = text("提示").findOne(3000);
                    t = t.parent().parent().child(1).child(0).bounds();
                    img = images.clip(img, t.left, t.top, t.right - t.left, t.bottom - t.top);
                } catch (e) { }
                answer = huawei_ocr_api(images.inRange(img, "#FFFF0000", "#FFFF0000"), ttt);
                console.info("华为OCR识别的答案：" + answer);
                logs.push("华为OCR识别的答案：" + answer);
                back();
                delay(1);
                click_answer(answer);
            } else if (stronger == "c") {
                var seeTips = text("查看提示").findOnce();
                seeTips.click();
                delay(1);
                var img = captureScreen();
                try {
                    var t = text("提示").findOne(3000);
                    t = t.parent().parent().child(1).child(0).bounds();
                    img = images.clip(img, t.left, t.top, t.right - t.left, t.bottom - t.top);
                } catch (e) { }
                answer = baidu_ocr_api(images.inRange(img, "#FFFF0000", "#FFFF0000"), ttt);
                console.info("百度OCR识别的答案：" + answer);
                logs.push("百度OCR识别的答案：" + answer);
                back();
                delay(1);
                click_answer(answer);
            }
        } else {
            console.info("答案：" + answer);
            logs.push("答案：" + answer);
            clickByAnswer(answer);
        }
    }

    delay(3);

    if (text("确定").exists()) {
        delay(3);
        text("确定").click();
        handling_access_exceptions();
        delay(5);
    } else if (text("下一题").exists()) {
        click("下一题");
        delay(0.5);
    } else if (text("完成").exists()) {
        text("完成").click();
        delay(2);
        handling_access_exceptions();
        delay(3);
    } else {
        console.warn("未找到右上角确定按钮控件，根据坐标点击(可能是模拟器)");
        click(device.width * 0.85, device.height * 0.06); //右上角确定按钮，根据自己手机实际修改
    }

    checkAndUpdate(question, ansTiku, answer);
    console.log("------------");
    logs.push("------------");
    delay(2);
}
function click_answer(answer) {
    var f = true;
    if (className("ListView").exists()) {
        if (textStartsWith("多选题").exists()) {
            var listArray = className("ListView").findOnce().children();
            listArray.forEach((item) => {
                var listIndexStr = item.child(0).child(2).text();
                var num = 0;
                for (var i = 0; i < listIndexStr.length; i++) {
                    if (answer.indexOf(listIndexStr[i]) != -1) {
                        num++;
                    }
                }
                if (num / listIndexStr.length > 1 / 2) {
                    item.child(0).click();
                    f = false;
                }
            });
        } else {
            var listArray = className("ListView").findOnce().children();
            listArray.forEach((item) => {
                var listIndexStr = item.child(0).child(2).text();
                if (answer.indexOf(listIndexStr) != -1) {
                    item.child(0).click();
                    f = false;
                    return;
                }
            });
            if (f) {
                var a = 0;
                var num = 0;
                var ch = 0;
                listArray.forEach((item) => {
                    var maxx = 0;
                    var listIndexStr = item.child(0).child(2).text();
                    for (var i = 0; i < listIndexStr.length; i++) {
                        if (answer.indexOf(listIndexStr[i]) != -1) {
                            maxx++;
                        }
                    }
                    if (maxx > num) {
                        num = maxx;
                        ch = a;
                    }
                    a++;
                });
                className("ListView").findOnce().child(ch).child(0).click();
                f = false;
            }
        }
        if (f) {
            if (textContains("A").exists()) {
                textContains("A").click();
            }
            console.error("没有找到,选A跳过");
            logs.push("没有找到,选A跳过");
        }
    }
}
/**
 * @description: 每日答题
 * @param: null
 * @return: null
 */
function dailyAnswer() {
    console.info("开始答题");
    console.setPosition(0, 0);
    delay(1);
    let dlNum = 0; //每日答题轮数
    var flag = true;
    if (textStartsWith("填空题").exists() || textStartsWith("多选题").exists() || textStartsWith("单选题").exists()) {
        flag = false;
    }
    if (flag) {
        var s = 1;
        while (!text("排行榜").exists()) {
            console.log("等待我要答题界面");
            delay(1);
            if (textStartsWith("填空题").exists() || textStartsWith("多选题").exists() || textStartsWith("单选题").exists()) {
                s = 0;
                break;
            }
        }
        if (s == 1) {
            var textOrder = text("排行榜").findOnce().parent();
            while (!className(textOrder.child(2).className()).exists()) {
                toastLog("等待界面出现");
            }
            textOrder.child(2).click();
        }
    }
    // var widget = text("太阳每天都是新的").findOne();
    // click(widget.bounds().centerX(), widget.bounds().centerY());
    delay(0.5);
    while (true) {
        delay(2);
        // if (!(textStartsWith("填空题").exists() || textStartsWith("多选题").exists() || textStartsWith("单选题").exists())) {
        //     // toastLog("没有找到题目！请检查是否进入答题界面！");
        //     console.error("没有找到题目！请检查是否进入答题界面！");
        //     console.log("停止");
        //     故意报错重启脚本;
        //     break;
        // } //冗余
        dailyQuestionLoop();
        if (text("再练一次").exists()) {
            console.log("每周答题结束！");
            text("返回").click();
            delay(2);
            back();
            break;
        } else if (text("查看解析").exists()) {
            console.log("专项答题结束！");
            back();
            delay(0.5);
            back();
            delay(0.5);
            break;
        } else if (text("再来一组").exists()) {
            delay(2);
            dlNum++;
            if (!text("领取奖励已达今日上限").exists()) {
                text("再来一组").click();
                console.warn("第" + (dlNum + 1).toString() + "轮答题:");
                delay(1);
            } else {
                console.log("每日答题结束！");
                text("返回").click();
                delay(2);
                break;
            }
        }
    }
    console.setPosition(0, device.height / 2);
}

////////////////////////////挑战答题模块功能////////////////////////
/**
 * @description: 从数据库中搜索答案
 * @param: question 问题
 * @return: answer 答案
 */
function getAnswer(question) {
    var question1 = question.split("来源：")[0]; //去除来源
    question1 = question1.replace(/ /g, ""); //再删除多余空格
    question1 = question1.replace(/  /g, "");
    try {
        var option = "";
        var similars = 0;
        var pos = -1;
        for (var i = 0; i < question_list.length; i++) {
            var s = similarity(question_list[i][0], "", question1, 0);
            if (s > similars) {
                similars = s;
                pos = i;
            }
        }
        option = question_list[pos][1];
        var ans = question_list[pos][2].split("	")[option[0].charCodeAt(0) - 65];
        if (!ans) return "A";
        return ans;
        // return option;
    } catch (e) {
        return "A";
    }
}

function indexFromChar(str) {
    return str.charCodeAt(0) - "A".charCodeAt(0);
}

/**
 * @description: 每次答题循环
 * @param: conNum 连续答对的次数
 * @return: null
 */
function challengeQuestionLoop(conNum) {
    let ClickAnswer; //定义已点击答案
    if (conNum >= qCount) {
        //答题次数足够退出，每轮qCount=5+随机1-3次
        let listArray = className("ListView").findOnce().children(); //题目选项列表
        let i = random(0, listArray.length - 1);
        console.log("本轮答题数足够，随机点击答案");
        var question = className("ListView").findOnce().parent().child(0).text();
        question = question.replace(/\s/g, "");
        var options = []; //选项列表
        if (className("ListView").exists()) {
            className("ListView")
                .findOne()
                .children()
                .forEach((child) => {
                    var answer_q = child.child(0).child(1).text();
                    options.push(answer_q);
                });
        } else {
            console.error("答案获取失败!");
            return;
        } //20201217添加 极低概率下，答题数足够，下一题随机点击，碰到字形题
        if (question == "选择正确的读音" || question == "选择词语的正确词形" || question == "下列词形正确的是") {
            // 选择第一个
            console.log((conNum + 1).toString() + ".直接选第一个!!!");
            className("android.widget.RadioButton").depth(28).findOne().click();
            return;
        }
        console.log((conNum + 1).toString() + ".随机点击题目：" + question);
        delay(random(0.5, 1)); //随机延时0.5-1秒
        listArray[i].child(0).click(); //随意点击一个答案
        ClickAnswer = listArray[i].child(0).child(1).text(); //记录已点击答案
        console.log("随机点击:" + ClickAnswer);
        //如果随机点击答案正确，则更新到本地题库tiku表
        delay(0.5); //等待0.5秒，是否出现X
        console.log("---------------------------");
        return;
    }
    if (className("ListView").exists()) {
        var question = className("ListView").findOnce().parent().child(0).text();
    } else {
        console.error("提取题目失败!");
        let listArray = className("ListView").findOnce().children(); //题目选项列表
        let i = random(0, listArray.length - 1);
        console.log("随机点击");
        delay(random(0.5, 1)); //随机延时0.5-1秒
        listArray[i].child(0).click(); //随意点击一个答案
        return;
    }
    var chutiIndex = question.lastIndexOf("出题单位");
    if (chutiIndex != -1) {
        question = question.substring(0, chutiIndex - 2);
    }
    //question = question.replace(/\s/g, "");
    var options = []; //选项列表
    if (className("ListView").exists()) {
        className("ListView")
            .findOne()
            .children()
            .forEach((child) => {
                var answer_q = child.child(0).child(1).text();
                options.push(answer_q);
            });
    } else {
        console.error("答案获取失败!");
        return;
    }
    var reg = /.*择词语的正确.*/g;
    var rea = /.*择正确的读音.*/g;
    var reb = /.*不属于二十四史的是.*/g;
    if (reg.test(question) || rea.test(question) || reb.test(question)) {
        // 选择第一个
        console.log((conNum + 1).toString() + ".直接选第一个!!!");
        className("android.widget.RadioButton").depth(28).findOne().click();
        return;
    }
    console.log((conNum + 1).toString() + ".题目：" + question);
    logs.push((conNum + 1).toString() + ".题目：" + question);
    var answer = getAnswer(question);
    console.info("答案：" + answer);
    logs.push("答案：" + answer);
    if (/^[a-zA-Z]{1}$/.test(answer)) {
        //如果为ABCD形式
        var indexAnsTiku = indexFromChar(answer.toUpperCase());
        answer = options[indexAnsTiku];
        toastLog(answer);
    }
    let hasClicked = false;
    let listArray = className("ListView").findOnce().children(); //题目选项列表
    if (answer == "") {
        //如果没找到答案
        let i = random(0, listArray.length - 1);
        console.error("没有找到答案，随机点击");
        delay(random(0.5, 1)); //随机延时0.5-1秒
        listArray[i].child(0).click(); //随意点击一个答案
        ClickAnswer = listArray[i].child(0).child(1).text(); //记录已点击答案
        hasClicked = true;
        console.log("随机点击:" + ClickAnswer); //如果随机点击答案正确，则更新到本地题库tiku表
        delay(0.5); //等待0.5秒，是否出现X
        console.log("---------------------------");
    } //如果找到了答案
    else {
        listArray.forEach((item) => {
            var listDescStr = item.child(0).child(1).text();
            if (listDescStr == answer) {
                delay(random(0.5, 1)); //随机延时0.5-1秒
                try {
                    item.child(0).click(); //点击答案
                    hasClicked = true;
                } catch (e) { }
                delay(0.5); //等待0.5秒，是否出现X
                if (!text("v5IOXn6lQWYTJeqX2eHuNcrPesmSud2JdogYyGnRNxujMT8RS7y43zxY4coWepspQkvw" + "RDTJtCTsZ5JW+8sGvTRDzFnDeO+BcOEpP0Rte6f+HwcGxeN2dglWfgH8P0C7HkCMJOAAAAAElFTkSuQmCC").exists() || text("再来一局").exists()) {
                    //遇到❌号，则答错了,不再通过结束本局字样判断
                    // console.log("题库答案正确……");
                }
                if (text("v5IOXn6lQWYTJeqX2eHuNcrPesmSud2JdogYyGnRNxujMT8RS7y43zxY4coWepspQkvw" + "RDTJtCTsZ5JW+8sGvTRDzFnDeO+BcOEpP0Rte6f+HwcGxeN2dglWfgH8P0C7HkCMJOAAAAAElFTkSuQmCC").exists() || text("再来一局").exists()) {
                    //遇到❌号，则答错了,不再通过结束本局字样判断
                    console.error("答案错误!!!");
                    /*checkAndUpdate(question, answer, ClickAnswer);*/
                }
                console.log("---------------------------");
            }
        });
    }
    if (!hasClicked) {
        //如果没有点击成功
        //因导致不能成功点击问题较多，故该部分不更新题库，大部分问题是题库题目适配为填空题或多选题或错误选项
        console.error("未能成功点击，随机点击");
        let i = random(0, listArray.length - 1);
        delay(random(0.5, 1)); //随机延时0.5-1秒
        listArray[i].child(0).click(); //随意点击一个答案
        console.log("随机点击:" + ClickAnswer);
        delay(0.5); //等待0.5秒，是否出现X
        if (!text("v5IOXn6lQWYTJeqX2eHuNcrPesmSud2JdogYyGnRNxujMT8RS7y43zxY4coWepspQkvw" + "RDTJtCTsZ5JW+8sGvTRDzFnDeO+BcOEpP0Rte6f+HwcGxeN2dglWfgH8P0C7HkCMJOAAAAAElFTkSuQmCC").exists() || text("再来一局").exists()) {
            //遇到❌号，则答错了,不再通过结束本局字样判断
            console.log("随机点击正确……");
        }
        if (text("v5IOXn6lQWYTJeqX2eHuNcrPesmSud2JdogYyGnRNxujMT8RS7y43zxY4coWepspQkvw" + "RDTJtCTsZ5JW+8sGvTRDzFnDeO+BcOEpP0Rte6f+HwcGxeN2dglWfgH8P0C7HkCMJOAAAAAElFTkSuQmCC").exists() || text("再来一局").exists()) {
            //遇到❌号，则答错了,不再通过结束本局字样判断
            console.error("随机点击错误!!!");
            /*checkAndUpdate(question, answer, ClickAnswer);*/
        }
        console.log("---------------------------");
        logs.push("---------------------------");
    }
}

/**
 * @description: 挑战答题
 * @param: null
 * @return: null
 */
function challengeQuestion() {
    // init();
    if (!className("RadioButton").exists()) {
        while (!text("排行榜").exists()) {
            console.info("等待我要答题界面");

            questionShow(); // 进入我要答题
            delay(3);
        }
        var textOrder = text("排行榜").findOnce().parent();
        while (text("排行榜").exists()) {
            console.info("点击挑战答题");
            textOrder.child(10).click();
            delay(2);
        }
    }
    let conNum = 0; //连续答对的次数
    let lNum = 0; //轮数
    var 复活 = true;
    while (true) {
        delay(2);
        if (!className("RadioButton").exists()) {
            if (复活 == false) {
                console.log("出现错误，等5秒开始下一轮...");
                delay(3); //等待3秒才能开始下一轮
                text("再来一局").click();
                delay(4);
                conNum = 0;
                复活 = true;
            } else {
                // toastLog("没有找到题目！请检查是否进入答题界面！");
                console.error("没有找到题目！请检查是否进入答题界面！");
                console.log("停止");
                break;
            }
        }
        challengeQuestionLoop(conNum);
        delay(1);
        if (text("wrong@3x.9ccb997c").exists() || text("2kNFBadJuqbAAAAAElFTkSuQmCC").exists() || textStartsWith("v5IOXn6lQWYTJeqX2eHuNcrPesmSud2Jdog").exists()) {
            //遇到❌号，则答错了,不再通过结束本局字样判断
            if (conNum >= qCount) {
                lNum++;
                qCount = randomNum(3, 6);
            }
            if (lNum >= lCount) {
                console.log("挑战答题结束！返回我要答题界面！");
                if (复活) {
                    textContains("每局仅可复活一次").waitFor();
                    delay(1);
                    back();
                }
                textContains("再来一局").waitFor();
                delay(1);
                back();
                delay(2);
                break;
            } else {
                if (复活 && conNum < qCount) {
                    复活 = false;
                    // textContains("分享就能复活").findOne().click();
                    if (text("立即复活").exists()) {
                        click("立即复活");
                    }
                    delay(0.5);
                    back();
                    delay(1);
                } else {
                    if (复活) {
                        textContains("每局仅可复活一次").waitFor();
                        delay(1);
                        back();
                    }
                    console.log("等5秒开始下一轮...");
                    delay(3); //等待3秒才能开始下一轮
                    text("再来一局").click();
                    delay(4);
                    conNum = 0;
                    复活 = true;
                }
            }
        } //答对了
        else {
            conNum++;
        }
    }
    delay(1);
    if (desc("我的信息").exists()) {
        text("我要答题").findOne().parent().click();
        delay(2);
    }
}
//挑战答题
//////////////////////////////////////////////////////////////////

// var xn = 0;
var 音字 = false;
function do_contest_answer(depth_option, question1) {
    // console.time('搜题');
    question1 = question1.replace(/'/g, "");
    question1 = question1.replace(/"/g, "");
    old_question = JSON.parse(JSON.stringify(question1));
    question1 = question1.split("来源:")[0]; //去除来源
    question1 = question1.split("来源：")[0]; //去除来源
    question = question1.split("A.")[0];
    // question = question.split('（.*）')[0];
    reg = /下列..正确的是.*/g;
    reb = /选择词语的正确.*/g;
    rea = /选择正确的读音.*/g;
    rec = /下列不属于二十四史的是.*/g;
    rex = /劳动行政部门自收到集体合同文本之日起.*/g;
    var option = "N";
    var answer = "N";
    var similars = 0;
    var pos = -1;
    var answers_list = "";
    if (rex.test(question) || rec.test(question) || reg.test(question) || rea.test(question) || reb.test(question)) {
        音字 = true;
        first = false;
        try {
            old_question = old_question.replace(/4\./g, "A.");
            var old_answers = old_question.split("A.")[1].split("C")[0];
            for (var k = 0; k < 2; k++) {
                answers = old_answers.split("B.")[k];
                // answers = answers.match(/[\u4e00-\u9fa5]/g).join(""); //剩余汉字
                answers = answers.replace(/哆峻/g, "啰唆");
                answers = answers.replace(/罗峻/g, "罗唆");
                answers = answers.replace(/暖陀/g, "蹉跎");
                answers = answers.replace(/暖跑/g, "蹉跎");
                answers = answers.replace(/跨踏/g, "踌躇");
                answers = answers.replace(/chuo/g, "chuò");
                answers = answers.replace(/cuotuo/g, "cuōtuó");
                answers = answers.replace(/duo/g, "duō");
                answers = answers.replace(/蹈/g, "踌躇");
                answers = answers.replace(/调帐/g, "惆怅");
                answers = answers.replace(/任悔/g, "忏悔");
                answers = answers.replace(/仟悔/g, "忏悔");
                answers = answers.replace(/忧心../g, "忧心忡忡");
                answers = answers.replace(/美轮美./g, "美轮美奂");
                answers = answers.replace(/决穿/g, "诀窍");
                answers = answers.replace(/浙临/g, "濒临");
                answers = answers.replace(/不落../g, "不落窠臼");
                answers = answers.replace(/.目结舌/g, "膛目结舌");
                answers = answers.replace(/泉水../g, "泉水淙淙");
                answers = answers.replace(/饮.止渴/g, "饮鸠止渴");
                answers = answers.replace(/趋之若./g, "趋之若鹜");
                answers = answers.replace(/一.而就/g, "一蹴而就");
                answers = answers.replace(/刚.自用/g, "刚愎自用");
                answers = answers.replace(/风驰电./g, "风驰电掣");
                answers = answers.replace(/不.而走/g, "不胫而走");
                answers = answers.replace(/.声叹气/g, "唉声叹气");
                answers = answers.replace(/.而走险/g, "铤而走险");
                answers = answers.replace(/底护/g, "庇护");
                answers = answers.replace(/蓓./g, "蓓蕾");
                answers = answers.replace(/抵悟/g, "抵牾");
                answers = answers.replace(/情懒/g, "慵懒");
                answers = answers.replace(/差道/g, "差遣");
                answers = answers.replace(/泽炼/g, "淬炼");
                answers = answers.replace(/博奔/g, "博弈");
                answers = answers.replace(/相形见./g, "相形见绌");
                answers = answers.replace(/对.公堂/g, "对簿公堂");
                answers = answers.replace(/疼李/g, "痉挛");
                answers = answers.replace(/痉李/g, "痉挛");
                answers = answers.replace(/..人口/g, "脍炙人口");
                answers = answers.replace(/.意安为/g, "恣意妄为");
                answers = answers.replace(/凌合/g, "凑合");
                answers = answers.replace(/神抵/g, "神祗");
                answers = answers.replace(/叫苦不./g, "叫苦不迭");
                answers = answers.replace(/草.人命/g, "草菅人命");
                answers = answers.replace(/鞭./g, "鞭笞");
                answers = answers.replace(/发物/g, "发轫");
                answers = answers.replace(/..充数/g, "滥芋充数");
                answers = answers.replace(/水蒸气/g, "水蒸气 水蒸汽");
                answers = answers.replace(/..置疑/g, "毋庸置疑");
                answers = answers.replace(/..不振/g, "萎靡不振");
                answers = answers.replace(/瓜熟.落/g, "瓜熟蒂落");
                answers = answers.replace(/虎视../g, "虎视眈眈");
                answers = answers.replace(/进裂/g, "崩裂");
                // try{
                //     answers = r.replace(answers);
                // }catch(e){}
                answers_list += answers;
            }
        } catch (e) {
            while (!className("android.widget.RadioButton").depth(32).exists()) {
                if (text("继续挑战").exists()) return -1;
            }
            return -2;
        }
    }
    if (音字) question = answers_list;
    for (var i = 0; i < question_list.length; i++) {
        // 搜题
        // question answer q flag
        var s = similarity(question_list[i][0], question_list[i][2], question, 音字);
        if (s > similars) {
            similars = s;
            pos = i;
        }
        if (s == 999) break;
    }
    if (pos != -1) {
        option = question_list[pos][1];
        answer = question_list[pos][2];
    } else {
        console.error("没搜到答案,题目异常：\n“" + old_question + "”");
        logs.push("手动添加题库-----           --------- ");
        logs.push(" 没搜到答案,题目异常：“" + question + "-----选项为:  " + old_question + "”");
        logs.push("-----           --------- 手动添加题库");
        console.info("此题pos = " + pos + ",s=" + s);
    }
    if (option[0] >= "A" && option[0] <= "D") {
        var ans = answer.split("	")[option[0].charCodeAt(0) - 65];
        logs.push("答案:" + ans);
        console.info("答案:" + ans);
        var last = option;
        if (乱序 == "a" && !first && !音字) {
            while (true) {
                if (className("android.widget.RadioButton").depth(32).exists()) {
                    break;
                }
                if (text("继续挑战").exists()) return -1;
            }
            try {
                var img = captureScreen();
                var b = className("ListView").depth(29).findOne(3000).bounds();
                img = images.clip(img, b.left, b.top, b.right - b.left, b.bottom - b.top);
                if (choose == "a") {
                    // 文字识别
                    old_question = huawei_ocr_api(img, token);
                } else if (choose == "b") {
                    old_question = ocr_api(img);
                } else if (choose == "c") {
                    old_question = hamibot_ocr_api(img);
                } else old_question = baidu_ocr_api(img, token);
                // images.save(img, "/sdcard/选项"+xn+".png", "png", 50);
                // xn++;
                log(old_question);
                logs.push("选项：" + old_question);
                logs.push("=================================== ");
            } catch (e) {
                console.error(e);
                console.info("选项获取失败");
            }
        }
        if (乱序 == "a") {
            try {
                option = click_by_answer(ans, old_question);
                if (!option) option = last;
            } catch (e) {
                console.error("此题选项异常！！！");
            }
            //  logs.push("点击选项:" + option + "  原选项：" + last);
            console.info("点击选项:" + option + "  原选项：" + last);
        } else {
            logs.push("点击选项:" + option);
            console.info("点击选项:" + option);
        }
        if (text("继续挑战").exists()) return -1;
        while (!className("ListView").exists()) {
            // className('android.widget.RadioButton').findOnce(answer[0].charCodeAt(0) - 65).click();
            if (text("继续挑战").exists()) return -1;
        }
        if (text("继续挑战").exists()) return -1;
        if (!first && !音字) {
            sleep(延迟时间);
        }
        first = false;
        try {
            while (
                !className("ListView")
                    .findOne(5000)
                    .child(option[0].charCodeAt(0) - 65)
                    .child(0)
                    .click()
            ) {
                if (text("继续挑战").exists()) return -1;
            }
        } catch (e) {
            while (!className("android.widget.RadioButton").depth(depth_option).exists()) {
                if (text("继续挑战").exists()) return -1;
            }
            try {
                className("android.widget.RadioButton")
                    .depth(depth_option)
                    .findOnce(option[0].charCodeAt(0) - 65)
                    .click();
            } catch (e) {
                console.error("没找到选项,选A跳过");
                className("android.widget.RadioButton").depth(depth_option).findOnce(0).click();
            }
        }
        return 0;
    }
    try {
        className("android.widget.RadioButton").depth(depth_option).findOnce(0).click();
    } catch (e) {
        while (!className("ListView").findOne(5000).child(0).child(0).click()) {
            if (text("继续挑战").exists()) return -1;
        }
    }
    return 0;
}
var o = ["A.", "B.", "C.", "D.", "AAAA"];
var o1 = ["A", "B", "C", "D", "AAAA"];
function click_by_answer(ans, question) {
    ans = ans.match(/[\u4e00-\u9fa5a-zA-Z0-9āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü]/g).join("");
    question = question.replace(/ /g, "");
    question = question.replace(/4\./g, "A.");
    question = question.replace(/:/g, "：");
    try {
        question = r.replace(question);
    } catch (e) { }
    // question = question.split('A.');
    question = question.replace(/c\./g, "C.");
    question = question.replace(/，/g, ".");

    var sum = 0;
    for (var i = 0; i < question.length; i++) {
        if (question[i] >= "A" && question[i] <= "D") {
            sum++;
        }
    }
    var op = [];
    if (sum <= 4) {
        question = question.replace(/\./g, "");
        for (var i = 0; i < 4; i++) {
            try {
                var tmp = question
                    .split(o1[i])[1]
                    .split(o1[i + 1])[0]
                    .split("推荐：")[0]
                    .split("出题")[0];
                op.push(tmp.match(/[\u4e00-\u9fa5a-zA-Z0-9āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü]/g).join(""));
            } catch (e) {
                op.push("&");
            }
        }
    } else {
        for (var i = 0; i < 4; i++) {
            try {
                var tmp = question
                    .split(o[i])[1]
                    .split(o[i + 1])[0]
                    .split("推荐：")[0]
                    .split("出题")[0];
                op.push(tmp.match(/[\u4e00-\u9fa5a-zA-Z0-9āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü]/g).join(""));
            } catch (e) {
                op.push("&");
            }
        }
    }
    // op[op.length-1] = op[op.length-1].split('推荐')[0].split('出题')[0];
    var s = 0;
    var pos = -1;
    for (var i = 0; i < op.length; i++) {
        if (op[i] == "&") continue;
        if (op[i] == ans) {
            return o1[i];
        }
        var tmp = similarity_answer(op[i], ans);
        if (tmp > s) {
            s = tmp;
            pos = i;
        }
    }
    //  sleep(点击延迟时间);
    return o1[pos];
}
function similarity_answer(op, ans) {
    var num = 0;
    for (var i = 0; i < ans.length; i++) {
        if (op.indexOf(ans[i]) != -1) num++;
    }
    for (var i = 0; i < ans.length - 1; i++) {
        if (op.indexOf(ans[i] + ans[i + 1]) != -1) num++;
    }
    for (var i = 0; i < ans.length - 2; i++) {
        if (op.indexOf(ans[i] + ans[i + 1] + ans[i + 2]) != -1) num++;
    }
    return num / (2 * op.length + 2 * ans.length);
}
function similarity(question, answer, q, flag) {
    var num = 0;
    if (flag) {
        if (q.indexOf("十五日") != -1 && question.indexOf("劳动行政部门自收到集体合同文本之日起") != -1 && answer.split("\t")[0].indexOf("十日") != -1) {
            return 999;
        }
        if (q.indexOf("十五日") == -1 && q.indexOf("十日") != -1 && question.indexOf("劳动行政部门自收到集体合同文本之日起") != -1 && answer.split("\t")[0].indexOf("五日") != -1) {
            return 999;
        }
        if (question.indexOf("正确") == -1 && question.indexOf("下列不属于二十四史的") == -1) {
            return 0;
        }
        for (var i = 0; i < q.length; i++) {
            if (answer.indexOf(q[i]) != -1) {
                num++;
            }
        }
        return num / (answer.length + q.length);
    } else {
        var tmp = 1;
        if (q.length > 20) tmp = 2;
        if (q.length > 40) tmp = 3;
        if (q.length > 50) tmp = 4;
        for (var i = 0; i < q.length - tmp; i += tmp) {
            if (question.indexOf(q[i] + q[i + 1]) != -1) {
                num++;
            }
        }
        return num / (question.length + q.length);
    }
}
/**
 * 点击对应的去答题或去看看
 * @param {image} img 传入图片
 */
function baidu_ocr_api(img, tokens) {
    console.log("百度ocr文字识别中");
    var answer = "";
    var res = http.post("https://aip.baidubce.com/rest/2.0/ocr/v1/general", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        access_token: tokens,
        image: images.toBase64(img),
    });

    var res = res.body.json();
    try {
        var words_list = res.words_result;
    } catch (error) {
        console.error("百度ocr文字识别请求错误，可能有以下情况\n1.百度ocr欠费\n2.其他的错误");
        exit();
    }
    for (var i in words_list) {
        answer += words_list[i].words;
    }
    return answer.replace(/\s*/g, "");
}
/**
 * 点击对应的去答题或去看看
 * @param {image} img 传入图片,,本地。
 */
function ocr_api(img) {
    console.log("第三方本地ocr文字识别中");
    try {
        var answer = "";
        var results = ocr.detect(img.getBitmap(), 1);
        for (var i = 0; i < results.size(); i++) {
            var s = results.get(i).text;
            answer += s;
        }
        // console.info(answer.replace(/\s*/g, ""));
        return answer.replace(/\s*/g, "");
    } catch (e) {
        console.error(e);
        console.info("第三方OCR插件安装错了位数，分为64位和32位\n卸载之前的插件，换一个位数安装");
        exit();
    }
}

function hamibot_ocr_api() {
    console.log("hamibot文字识别中");
    let list = ocr.recognize(arguments[0])["results"]; // 识别文字，并得到results
    let eps = 30; // 坐标误差
    if (arguments.length >= 2) eps = arguments[1];
    for (
        var i = 0;
        i < list.length;
        i++ // 选择排序对上下排序,复杂度O(N²)但一般list的长度较短只需几十次运算
    ) {
        for (var j = i + 1; j < list.length; j++) {
            if (list[i]["bounds"]["bottom"] > list[j]["bounds"]["bottom"]) {
                var tmp = list[i];
                list[i] = list[j];
                list[j] = tmp;
            }
        }
    }

    for (
        var i = 0;
        i < list.length;
        i++ // 在上下排序完成后，进行左右排序
    ) {
        for (var j = i + 1; j < list.length; j++) {
            // 由于上下坐标并不绝对，采用误差eps
            if (Math.abs(list[i]["bounds"]["bottom"] - list[j]["bounds"]["bottom"]) < eps && list[i]["bounds"]["left"] > list[j]["bounds"]["left"]) {
                var tmp = list[i];
                list[i] = list[j];
                list[j] = tmp;
            }
        }
    }
    let res = "";
    for (var i = 0; i < list.length; i++) {
        res += list[i]["text"];
    }
    list = null;
    return res;
}
function huawei_ocr_api(img, tokens) {
    console.log("华为ocr文字识别中");
    var answer = "";
    var res = http.postJson(
        "https://" + endpoint + "/v2/" + projectId + "/ocr/web-image",
        {
            image: images.toBase64(img),
        },
        {
            headers: {
                "User-Agent": "API Explorer",
                "X-Auth-Token": tokens,
                "Content-Type": "application/json;charset=UTF-8",
            },
        }
    );
    var res = res.body.json();
    try {
        var words_list = res.result.words_block_list;
    } catch (error) {
        // console.info('华为ocr文字识别请求错误，可能有两种情况\n1.华为ocr欠费\n2.配置时除账号密码外，其他的出错')
        toastLog(error);
        exit();
    }
    for (var i in words_list) {
        answer += words_list[i].words;
    }
    // console.info(answer.replace(/\s*/g, ""));
    return answer.replace(/\s*/g, "");
}

var download = null;
/**
 * @description: 加载题库和加载替换
 * @param: null
 * @return: null
 */

function init() {
    if (init_true == true) {
        threads.start(function () {
            if (!files.exists(path_replace)) {
                try {
                    var x = http.get("https://gh-proxy.com//https://raw.githubusercontent.com/Twelve-blog/picture/master/replace.js").body.string();
                    files.write("/sdcard/replace.js", x);

                    r = require("/sdcard/replace.js");
                } catch (e) { }
                x = null;
            } else {
                r = require("/sdcard/replace.js");
            }
        });
        //是否更新题库

        files.remove(path_question);
        delay(2);

    }

    try {

        if (!files.exists(path_question)) {
            toastLog("下载question读取题库");
            console.info("正在加载题库中.....");
            downloadDialog = dialogs
                .build({
                    title: "正在加载题库...",
                    progress: {
                        max: 100,
                        showMinMax: true,
                    },
                    autoDismiss: false,
                    cancelable: true,
                })
                .show();
            startDownload();
            // delay(2);
            download.join(1000 * 60);
            if (!file_tmp) {
                download.interrupt();
                console.error("题库加载超时！，再次加载一次");
                startDownload();
            }
            while (!file_tmp) {
                toastLog("等待加载题库!!!");
                delay(2);
            }
        } else {
            tikus = files.read(path_question);
            toastLog("本地读取题库");
        }

        file_tmp = null;

        tikus = tikus.split("\n");
        for (var i = 0; i < tikus.length; i++) {
            var t = tikus[i].split(" ");
            if (t[1] && t[0]) {
                var answer = "";
                for (var j = 2; j < t.length; j++) {
                    // 可能tiku答案有空格，但是被切割了
                    answer += t[j];
                }
                question_list.push([t[1], t[0], answer]);
            }
        }
        answer = null;
        tikus = null;
        init_true = true;
        if (question_list.length < 1000) {
            console.info("题库崩了！！！，等！！！");
            exit();
        }
    } catch (e) {
        console.error("题库获取失败，检查网络连接！！！" + e);
        exit();
    }


    function startDownload() {
        download = threads.start(function () {
            toastLog("等待加载题库!!!");
            try {
                var conn = new URL(init_url).openConnection();
                conn.connect();
                let is = conn.getInputStream();
                let count = 0;
                length = 973328;
                let buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
                while (true) {
                    var p = Math.abs(Math.min((count / length) * 100, 100));
                    let numread = is.read(buffer);
                    count += numread;
                    if (numread < 0) {
                        toast("加载完成");
                        console.info("加载完成");
                        downloadDialog.dismiss();
                        downloadDialog = null;
                        break;
                    }
                    downloadDialog.setProgress(p);
                    tikus += java.lang.String(buffer, "UTF-8").slice(0, numread);
                    console.error("将题库写入到本地" + tikus.length);
                    files.write(path_question, tikus);
                }
                is.close();
                file_tmp = true;
            } catch (e) {
                console.error(e);
                console.warn("题库加载失败");
                question_list = null;
                is.close();
                tikus = null;
                hamibot.exit();
                exit();
            }
        });
    }
}

/**
 * @description: 四人赛
 * @param: null
 * @return: null
 */
var xxx = 1;
function zsyAnswer() {
    //首轮不答
    if (首轮不答) {
        delay(2);
        if (text("随机匹配").exists()) {
            text("随机匹配").findOne(3000).parent().child(0).click();
            console.log("点击随机匹配");
        } else {
            console.log("点击开始比赛");
            var s = text("开始比赛").findOne(2000);
            if (s) {
                s.click();
            } else {
                console.log("没有找到开始比赛，点击随机匹配");
                text("随机匹配").findOne(3000).parent().child(0).click();
            }
        }
        delay(1);
        if (text("知道了").exists()) {
            console.warn("答题已满");
            text("知道了").findOnce().click();
            delay(2);
            if (text("随机匹配").exists() || text("开始比赛").exists()) {
                console.info("停止脚本");
                exit();
            } else return 0;
        }
        className("ListView").waitFor();
        console.info("等待比赛结束");
        while (!text("继续挑战").exists()) {
            sleep(5000);
        }
        console.info("比赛结束");
        delay(1);
        text("继续挑战").click();
        delay(3);
        var j = text("开始比赛").findOne(5000);
        if ((j = null)) {
            console.error("不在竞赛页面，停止脚本");
            exit();
        }
        console.info("开始正式比赛");
    }

    var img = captureScreen();
    try {
        var point = findColor(img, "#1B1F25", {
            region: [0, 0, 100, 100],
            threshold: 10,
        });
    } catch (e) {
        console.error(e);
        console.info("你可能使用了模拟器并且hamibot的版本是1.3.0及以上，请使用hamibot1.1.0版本");
        exit();
    }
    // init();
    if (choose == "a") {
        huawei_ocr_api(img, token);
    } else if (choose == "b") {
        ocr_api(img);
    } else if (choose == "c") {
        hamibot_ocr_api(img);
    } else baidu_ocr_api(img, token);
    var count = 2;
    console.info("改变提示框位置");
    console.setPosition(device.width / 4, -device.height / 4);
    for (var i = 0; i < count; i++) {
        sleep(random_time(delay_time));
        if (text("随机匹配").exists()) {
            text("随机匹配").findOne(3000).parent().child(0).click();
            console.log("点击随机匹配");
            count = 1;
        } else {
            console.log("点击开始比赛");
            // my_click_clickable('开始比赛');
            var s = text("开始比赛").findOne(5000);
            if (s) {
                s.click();
            } else {
                console.log("没有找到开始比赛，点击随机匹配");
                text("随机匹配").findOne(3000).parent().child(0).click();
                count = 1;
            }
        }
        first = true;
        音字 = false;
        delay(1);
        if (text("知道了").exists()) {
            console.warn("答题已满");
            text("知道了").findOnce().click();
            delay(2);
            if (text("随机匹配").exists() || text("开始比赛").exists()) {
                break;
            } else return 0;
        }
        className("ListView").waitFor();
        var range = className("ListView").findOnce().parent().bounds();
        var x = range.left + 20,
            dx = range.right - x - 20;
        var y = range.top,
            dy = device.height - 300 - y;
        console.log("坐标获取完成");

        while (!text("继续挑战").exists()) {
            do {
                img = captureScreen();
                var point = findColor(img, "#1B1F25", {
                    region: [x, y, dx, dy],
                    threshold: 10,
                });
                // console.log("等待题目显示");
            } while (!point);
            console.time("答题");
            try {
                range = className("ListView").findOnce().parent().bounds();
                // if (choose == 'a') img = images.inRange(img, '#000000', '#444444');
                if (!first && !音字) img = images.clip(img, x, y, dx, (range.bottom - y) / 3);
                else img = images.clip(img, x, y, dx, range.bottom - y);
            } catch (e) {
                img = images.clip(img, x, y, dx, dy);
            }
            // images.save(img, "/sdcard/题目"+xxx+".jpg", "jpg", 50);
            // xxx++;
            var question;
            if (choose == "a") {
                // 文字识别
                if (!first && !音字) img = images.inRange(img, "#000000", "#444444");
                question = huawei_ocr_api(img, token);
            } else if (choose == "b") {
                question = ocr_api(img);
            } else if (choose == "c") {
                if (!first && !音字)
                    // 第一题不变色的原因的：
                    img = images.inRange(img, "#000000", "#444444");
                question = hamibot_ocr_api(img);
            } else {
                if (!first && !音字) img = images.inRange(img, "#000000", "#444444");
                question = baidu_ocr_api(img, token);
            }
            question = question.slice(question.indexOf(".") + 1);
            question = question.replace(/,/g, "，");
            log(question);
            logs.push("题目:" + question);
            if (question) {
                var c = do_contest_answer(32, question);
                if (c == -1) {
                    break;
                } else if (c == -2) {
                    className("android.widget.RadioButton").waitFor();
                    continue;
                }
            } else {
                images.save(img, "/sdcard/截图.jpg", "jpg", 50);
                console.error("没有识别出任何内容，为了查错已经将截图保存在根目录./截图.jpg，如果截图正常并使用的是本地ocr，那么当前你的手机可能并不适配该ocr，百度/华为ocr则检查扣费次数情况");
                console.log("截图坐标为(" + x + "," + y + "),(" + dx + "," + dy + ")");
                break;
            }
            console.timeEnd("答题");
            img.recycle();
            do {
                var point = findColor(captureScreen(), "#555AB6", {
                    region: [x, y, dx, dy],
                    threshold: 10,
                });
            } while (!point);
            console.log("等待下一题\n----------");
            // logs.push("等待下一题------------------------");
            音字 = false;
        }
        if (i == 0 && count == 2) {
            sleep(random_time(delay_time));
            console.log("第二轮答题开始");
            while (!click("继续挑战"));
            sleep(random_time(delay_time));
        }
    }
    if (hamibot.env.another) var x = hamibot.env.another * 1;
    else var x = 0;
    while (x > 0) {
        console.info("额外的 " + x + " 轮即将开始!");
        x--;
        delay(2);
        click("继续挑战");
        delay(3);
        if (text("随机匹配").exists()) {
            text("随机匹配").findOne().parent().child(0).click();
            console.log("点击随机匹配");
        } else {
            console.log("点击开始比赛");
            // my_click_clickable('开始比赛');
            var s = text("开始比赛").findOne(5000);
            if (s) {
                s.click();
            } else {
                console.log("没有找到开始比赛，点击随机匹配");
                text("随机匹配").findOne(3000).parent().child(0).click();
            }
        }
        delay(1);
        if (text("知道了").exists()) {
            console.warn("答题已满");
            text("知道了").findOnce().click();
            delay(1);
            return 0;
        }
        while (true) {
            if (text("继续挑战").exists()) break;
            while (!className("android.widget.RadioButton").depth(32).exists()) {
                delay(randomNum(3, 5));
                if (text("继续挑战").exists()) break;
            }
            delay(2);
            console.warn("随机点击");
            try {
                var t = className("ListView").findOne(5000).childCount();
                t = randomNum(0, t - 1);
                className("android.widget.RadioButton").depth(32).findOnce(t).click();
            } catch (e) { }
            if (text("继续挑战").exists()) break;
            sleep(200);
        }
        // console.warn('额外一轮结束!');
    }
    console.info("答题结束");
    logs.push("答题结束");
    delay(2);
    back();
    delay(2);
    back();
    if (count == 1) {
        delay(2);
        if (text("退出").exists()) {
            textContains("退出").click();
            delay(1);
        } else {
            console.warn("没有找到退出，按坐标点击(可能失败)\n如果没返回，手动退出双人赛即可继续运行");
            // console.setPosition(device.width * 0.2, device.height * 0.5);
            click(device.width * 0.2, device.height * 0.6);
        }
        sleep(random_time(delay_time));
    }
}

//运行主函数
// if (随机) {

// } else {
//     main();
// }

var ta = hamibot.env.alltime * 1;
if (!ta || ta <= 0) ta = 1500;
var thread = null;
function rt() {
    var num = 0;
    while (true) {
        num++;
        console.log("设置脚本运行最长时间为：" + ta + "s");
        device.keepScreenOn(ta * 1000 + 60000);
        thread = threads.start(function () {
            rand_mode();
        });
        thread.join(ta * 1000);
        thread.interrupt();
        console.error("脚本超时或者出错！！！，重启脚本");
        if (!(launchApp("学习强国") || launch("cn.xuexi.android"))) {
            //启动学习强国app
            delay(10);
        }
        console.info("等待10s后继续开始");
        toast("等待10s后继续开始");
        delay(5);
        back_table();
        toast(" ");
        delay(1);
        if (num > 3) break;
    }
    console.error("已经重新运行了3轮，停止脚本");
    question_list = null;
    console.error("无障碍服务可能出了问题");
    exit();
}
rt();
//var brand = device.brand + device.model; //品牌厂商
function push_weixin_message(message) {
    if (sct_token != "") {
        URL = "https://sctapi.ftqq.com/" + sct_token + ".send";
        http.post(URL, {
            title: device.brand + device.model + "异常验证通知",
            desp: message,
        });
    }
}
function push_score() {
    console.warn("正在获取今日积分");
    var score = getScores(3);

    score += "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n";
    try {
        http.postJson("http://www.pushplus.plus/send", {
            token: pushplus_token,
            title: device.brand + device.model + "学习通知",
            content: "已得分" + score,
        });
    } catch (e) { }
}

function re_store() {
    try {
        if (hamibot.env.xianzhi == true) {
            console.warn("四人双人答题无限制开启");
            zsyCount = 1;
            doubleCount = 1;
        }
    } catch (e) { }
}

function back_table() {
    delay(1);
    var num = 0;
    while (!desc("工作").exists()) {
        //等待加载出主页
        console.info("当前没有在主页，正在返回主页");
        back();
        delay(1);
        num++;
        if (className("Button").textContains("退出").exists()) {
            var c = className("Button").textContains("退出").findOne(3000);
            if (c) c.click();
            delay(1);
        }
        if (num > 5) {
            console.error("返回超过10次，可能当前不在xxqg，正在启动app...");
            if (!(launchApp("学习强国") || launch("cn.xuexi.android"))) {
                //启动学习强国app
            }
            console.info("等待10s继续进行");
            delay(10);
            num = 0;
        }
    }
    // console.info('当前在主页，回到桌面！');
    // home();  //回到桌面
}

function rand_mode() {
    start_app(); //启动app
    /* 
          处理访问异常，滑动验证
          */
    var id_handling_access_exceptions;
    // 在子线程执行的定时器，如果不用子线程，则无法获取弹出页面的控件
    var thread_handling_access_exceptions = threads.start(function () {
        // 每2秒就处理访问异常
        id_handling_access_exceptions = setInterval(handling_access_exceptions, 5000);
    });

    var start = new Date().getTime(); //程序开始时间
    // console.info('随机模式开始');
    getScores(0); //获取积分
    re_store();

    var arr = [0, 1, 2, 3, 4, 5, 6, 7];
    var t;
    for (var i = 0; i < arr.length; i++) {
        var rand = parseInt(Math.random() * arr.length);
        t = arr[rand];
        arr[rand] = arr[i];
        arr[i] = t;
    }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == 0) {
            专项();
        } else if (arr[i] == 1) {
            每周();
        } else if (arr[i] == 2) {
            视频学习();
        } else if (arr[i] == 3) {
        } else if (arr[i] == 4) {
            挑战();
            四人();
            双人();
        } else if (arr[i] == 5) {
            本地();
            文章和广播();
        } else if (arr[i] == 6) {
        } else if (arr[i] == 7) {
            每日();

        }
    }
    question_list = null;
    article_list = null;
    // 取消访问异常处理循环
    try {
        if (id_handling_access_exceptions) clearInterval(id_handling_access_exceptions);
        logs.push("运行结束,取消异常处理");
    } catch (error) { }
    back_table();
    if (hamibot.env.Token != null || hamibot.env.Token.length > 6) {
        delay(1);
        push_score();
    }
    end = new Date().getTime();
    logs.push("运行结束,共耗时" + parseInt(end - start) / 1000 + "秒");
    console.log("3s后自动关闭悬浮窗，查看日志请到hamibot内查看");
    if (consoleshow == true) {
        desc("工作").click();
        delay(3);
        console.hide();
    }
    hamibot.postMessage(Date.now().toString(), {
        telemetry: true, // 由用户决定是否发送报告
        data: {
            title: "study异常处理最终版",
            attachments: [
                {
                    type: "json",
                    data: JSON.stringify({
                        // 要收集的信息，根据脚本需要自行收集，这里仅作演示
                        app: app.versionName, // Hamibot 版本
                        currentActivity: currentActivity(), // 当前运行的 Activity
                        // 自定义日志，仅作参考
                        logs: logs,
                    }),
                },
            ],
        },
    });
    device.cancelKeepingAwake();
    hamibot.exit();
    exit();
}

function 专项() {
    if (zhuanxiang_txt == true && zhuanxiang != 0) {
        console.info("开始专项答题");
        logs.push("开始专项答题");
        delay(1);
        if (!text("排行榜").exists()) {
            console.info("进入我要答题");
            questionShow(); // 进入我要答题
            delay(1);
        }
        zhuanxiangAnswer();
        delay(0.5);
    }
}

function 每周() {
    if (meizhou_txt == true && meizhou != 0) {
        logs.push("开始每周答题");
        console.info("开始每周答题");
        delay(1);
        if (!text("排行榜").exists()) {
            console.info("进入我要答题");
            questionShow(); // 进入我要答题
            delay(1);
        }
        meizhouAnswer();
        delay(0.5);
    }
}

function 双人() {
    if (doubleCount != 0 && shuangren == true) {
        console.info("开始双人答题");
        logs.push("开始双人答题");
        delay(2);
        if (!text("排行榜").exists()) {
            console.info("进入我要答题");
            questionShow(); // 进入我要答题
            delay(1);
        }
        while (!text("排行榜").exists()) {
            console.info("等待我要答题界面");
            delay(1);
        }
        var textOrder = text("排行榜").findOnce().parent();
        while (text("排行榜").exists()) {
            console.info("点击双人答题，悬浮窗位置改变");
            textOrder.child(9).click();
            delay(1);
        }
        zsyAnswer();
        delay(1);
        console.setPosition(0, device.height / 2);
    }
}

function 四人() {
    if (zsyCount != 0 && siren == true) {
        // delay(2);
        console.info("开始四人答题");
        logs.push("开始四人答题");
        delay(2);
        if (!text("排行榜").exists()) {
            console.info("进入我要答题");
            questionShow(); // 进入我要答题
            delay(1);
        }
        while (!text("排行榜").exists()) {
            console.info("等待我要答题界面");
            delay(1);
        }
        var textOrder = text("排行榜").findOnce().parent();
        while (text("排行榜").exists()) {
            console.info("点击四人赛答题，悬浮窗位置改变");
            textOrder.child(8).click();
            delay(1);
        }
        zsyAnswer();
        delay(0.5);
        console.setPosition(0, device.height / 2);
        //delay(1);
        // back();
    }
}

function 挑战() {
    // tzCount = 1;
    if (tzCount != 0 && tiaozhan == true) {
        news = false;
        console.info("开始挑战答题");
        logs.push("开始挑战答题");
        if (!text("排行榜").exists()) {
            console.info("进入我要答题");
            questionShow(); // 进入我要答题
            delay(1);
        }
        delay(1);
        challengeQuestion(); //挑战答题
        handling_access_exceptions();
        delay(0.5);
    }
}

function 每日() {
    // dayCount = 1;
    if (dayCount != 0 && meiri == true) {
        console.info("开始每日答题");
        logs.push("开始每日答题");
        if (!text("排行榜").exists()) {
            console.info("进入我要答题");
            questionShow(); // 进入我要答题
            delay(1);
        }
        delay(1);
        dailyAnswer(); // 每天答题
        delay(0.5);
        handling_access_exceptions();
    }
}
function 等待主页(waitNum) {
    console.warn("等待加载主页");
    if (text("排行榜").exists()) {
        delay(0.5);
        back();
        delay(0.5);
        back();
        delay(0.5);
    } else {
        waitNum++;

        if (waitNum > 1) {
            back_table();
        }
    }
}
function 视频学习() {
    var x = 1;
    if (text("排行榜").exists()) {
        delay(0.5);
        back();
        delay(0.5);
        back();
        delay(0.5);
    }
    while (!desc("工作").exists()) {
        //等待加载出主页
        console.info("等待加载主页");
        等待主页(1);
        delay(2);
    }
    while (vCount != 0 && video != "a") {
        // logs.push("当前第" + x + "次看视频");
        if (video == "b") videoStudy_news(x); //看视频

        console.info("等待五秒，然后确认视频是否已满分。");
        delay(5);
        getScores(2);

        x++;
        if (x > 2) {
            //尝试三次
            console.info("尝试2次，跳过。");
            break;
        }
    }
}

function 本地() {
    if (myScores["本地频道"] != 1) {
        console.info("开始本地频道");
        logs.push("开始本地频道");
        if (text("排行榜").exists()) {
            delay(0.5);
            back();
            delay(0.5);
            back();
            delay(0.5);
        }
        while (!desc("工作").exists()) {
            //等待加载出主页
            console.info("等待加载主页");
            if (text("排行榜").exists()) {
                delay(0.5);
                back();
                delay(0.5);
                back();
                delay(0.5);
            }
            delay(2);
        }
        localChannel(); //本地频道
    }
}

function 文章和广播() {
    if (text("排行榜").exists()) {
        delay(0.5);
        back();
        delay(0.5);
        back();
        delay(0.5);
    }
    while (!desc("工作").exists()) {
        //等待加载出主页
        console.info("等待加载主页");
        等待主页(1);
        delay(2);
    }
    if (rTime != 0 && articles == true) {
        listenToRadio(); //听电台广播
        h = device.height; //屏幕高
        w = device.width; //屏幕宽
        x = (w / 3) * 2;
        h1 = (h / 6) * 5;
        h2 = h / 6;
        delay(1);
        swipe(x, h1, x, h2, 100);
    }
    var r_start = new Date().getTime(); //广播开始时间
    var x = 0;
    while (aCount != 0 && articles == true) {
        aTime = hamibot.env.time1;
        articleStudy(x); //学习文章，包含点赞、分享和评论
        console.info("等待五秒，然后确认文章是否已满分。");
        delay(5);
        getScores(1);

        x++;
        if (x > 2) {
            //尝试三次
            console.info("尝试3次未满分，暂时跳过。");
            break;
        }
    }
    if (articles == true) {
        var end = new Date().getTime(); //广播结束时间
        var radio_time = parseInt((end - r_start) / 1000); //广播已经收听的时间
        radio_timing(parseInt((end - r_start) / 1000), rTime - radio_time); //广播剩余需收听时间
        if (rTime != 0) {
            stopRadio();
        }
    }
}

//toastLog(logs);
