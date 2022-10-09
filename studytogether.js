auto.waitFor();

//题库更换=A1&"="&LEFT(B1,40)
/**
 * @description: 视频学习秒数
 */
var video_s = hamibot.env.video_s * 1;
if (!video_s) video_s = 6;
/**
 * @description: 文章学习秒数
 */
var article_s = hamibot.env.article_s * 1;
if (!article_s) article_s = 45;
/**
 * @description: 文章学习篇数
 */
var article_num = 1;

/**
 * @description: 视频学习篇数
 */
var video_num = 1;

/**
 * @description: 每日答题次数
 */
var daily_num = 1;

/**
 * @description: 每周答题次数
 */
var week_num = 1;

/**
 * @description: 专项答题次数
 */
var special_num = 1;

/**
 * @description: 挑战答题次数
 */
var challenge_num = 1;
const logs = [];
const { TELEMETRY } = hamibot.env;
var challenge_loop_num = hamibot.env.challenge_loop_num;
var uptiku = hamibot.env.appendtiku;
if (!challenge_loop_num || challenge_loop_num <= 0) challenge_loop_num = 5;
/**
 * @description: 四人赛答题次数
 */
var four_num = 1;

/**
 * @description: 双人人赛答题次数
 */
var double_num = 1;

/**
 * @description: 订阅次数
 */
var sub_num = 2;

/**
 * @description: 分享次数
 */
var share_num = 0;

/**
 * @description: 评论观点次数
 */
var standpoint_num = 1;

/**
 * @description: 本地频道
 */
var local_num = 1;

/**
 * @description: 四人双人单题答题延迟时间
 */
var { init_true } = hamibot.env;
var delay_time = hamibot.env.delay_time;
if (!delay_time) delay_time = 0;

/**
 * @description: 本地题库存储->[num,[question,answer]]
 */
var storage1 = storages.create('Twelve:question');

/**
 * @description: 本地文字识别内容对应题库->[question,answer]
 */
var storage2 = storages.create('Twelve:local');
/**
 * @description: 题库列表
 */
var question_list = [];

/**
 * @description: 题是否为读音字形
 */
var yinzi = false;

/**
 * @description: 是否第一题
 */
var first = true;

/**
 * @description: 四人/双人 记录当前题目
 */
var old_q = '';

/**
 * @description: 四人/双人 记录当前题目答案
 */
var old_ans = '';

/**
 * @description: OCR模式选择
 */
var choose = hamibot.env.choose;
if (!choose) { choose = 'c'; }

/**
 * @description: 选项错字替换
 */
var replace = null;
replace = function (answers) {
    if (answers.indexOf('氨') != -1 && answers.indexOf('氮') != -1) answers = answers.replace(/氨/g, "氦");
    if (answers.indexOf('戈') != -1 && answers.indexOf('矛') != -1) answers = answers.replace(/载/g, "戟");
    if (answers.indexOf('泰') != -1 && answers.indexOf('樱') != -1) answers = answers.replace(/泰/g, "菽");
    if (answers.indexOf('缘') != -1 && answers.indexOf('舜') != -1) answers = answers.replace(/缘/g, "鲧");
    if (answers.indexOf('放松活动') != -1 && answers.indexOf('基本活动') != -1) answers = answers.replace(/一/g, "");
    if (answers.indexOf('辑拿') != -1 && answers.indexOf('绳拿') != -1) answers = answers.replace(/绳拿/g, "缉拿");
    if (answers.indexOf('黄海') != -1 && answers.indexOf('潮海') != -1) answers = answers.replace(/潮海/g, "渤海");
    answers = answers.replace(/祖击手/g, "狙击手");
    answers = answers.replace(/姓款/g, "账款");
    answers = answers.replace(/对筹公堂/g, "对簿公堂");
    answers = answers.replace(/嘎岭/g, "嘌呤");
    answers = answers.replace(/此呢风云/g, "叱咤风云");
    answers = answers.replace(/溶炼/g, "淬炼");
    answers = answers.replace(/声名鸽起/g, "声名鹊起");
    answers = answers.replace(/声名韵起/g, "声名鹊起");
    answers = answers.replace(/貂鲜/g, "貂蝉");
    answers = answers.replace(/cuotud/g, "cuōtuó");
    answers = answers.replace(/悠气/g, "憋气");
    answers = answers.replace(/0型/g, "O型");
    answers = answers.replace(/o型/g, "O型");
    answers = answers.replace(/既往不智/g, "既往不咎");
    answers = answers.replace(/继脚石/g, "绊脚石");
    answers = answers.replace(/演合/g, "凑合");
    answers = answers.replace(/刘翻/g, "刘勰");
    answers = answers.replace(/情懒/g, "慵懒");
    answers = answers.replace(/河汉/g, "河汊");
    answers = answers.replace(/谢肌/g, "谢朓");
    answers = answers.replace(/绎脚石/g, "绊脚石");
    answers = answers.replace(/修营/g, "修葺");
    answers = answers.replace(/斐秀/g, "裴秀");
    answers = answers.replace(/翡秀/g, "裴秀");
    answers = answers.replace(/奴婢bi/g, "奴婢bì");
    answers = answers.replace(/奴bi/g, "奴婢bì");
    answers = answers.replace(/杯盘狼精/g, "杯盘狼藉");
    answers = answers.replace(/有特无恐/g, "有恃无恐");
    answers = answers.replace(/荷子/g, "荀子");
    answers = answers.replace(/蒸馅水/g, "蒸馏水");
    answers = answers.replace(/粗扩/g, "粗犷");
    answers = answers.replace(/哆峻/g, "啰唆");
    answers = answers.replace(/點然失色/g, "黯然失色");
    answers = answers.replace(/chaigian/g, "chaiqian");
    answers = answers.replace(/差造/g, "差遣");
    answers = answers.replace(/青营素/g, "青蒿素");
    answers = answers.replace(/奴购/g, "奴婢");
    answers = answers.replace(/嘴之以鼻/g, "嗤之以鼻");
    answers = answers.replace(/款收/g, "歉收");
    answers = answers.replace(/链而走险/g, "铤而走险");
    answers = answers.replace(/母康置疑/g, "毋庸置疑");
    answers = answers.replace(/JI/g, "川");
    answers = answers.replace(/叫苦不送/g, "叫苦不迭");
    answers = answers.replace(/虫胡/g, "蝴");
    answers = answers.replace(/鱼鲤/g, "鱼鳔");
    answers = answers.replace(/沉缅/g, "沉湎");
    answers = answers.replace(/表秀/g, "裴秀");
    answers = answers.replace(/泽炼/g, "淬炼");
    answers = answers.replace(/bu/g, "bù");
    answers = answers.replace(/夏然而止/g, "戛然而止");
    answers = answers.replace(/垫伏/g, "蛰伏");
    answers = answers.replace(/从我/g, "从戎");
    answers = answers.replace(/跨踏/g, "踌躇");
    answers = answers.replace(/漂岭/g, "嘌呤");
    answers = answers.replace(/快密/g, "诀窍");
    answers = answers.replace(/决密/g, "诀窍");
    answers = answers.replace(/令媛/g, "令嫒");
    answers = answers.replace(/朱捷/g, "朱棣");
    answers = answers.replace(/雾淞/g, "雾凇");
    answers = answers.replace(/.阳湖/g, "潘阳湖");
    answers = answers.replace(/赔然失色/g, "黯然失色");
    answers = answers.replace(/相形见细/g, "相形见绌");
    answers = answers.replace(/饮鸽止渴/g, "饮鸩止渴");
    answers = answers.replace(/何族/g, "侗族");
    answers = answers.replace(/切碳/g, "切磋");
    answers = answers.replace(/不胜而走/g, "不胫而走");
    answers = answers.replace(/\+/g, "十");
    answers = answers.replace(/李诚/g, "李诫");
    answers = answers.replace(/晖红/g, "蹿红");
    answers = answers.replace(/蹄红/g, "蹿红");
    return answers;
}
/**
 * @description: 看门狗时长
 */
var watchdog_time = hamibot.env.watchdog_time * 1 * 1000;
if (!watchdog_time) watchdog_time = 2000 * 1000;
/**
 * @description: 百度ocr access_token
 */
var token = "";

/**
 * @description: 判断是否过验证了
 */
var captcha = false;

/**
 * @description: 随机延迟
 * @param: seconds-延迟秒数[a,a+1]
 */
function delay(a) {
    sleep(a * 1000 + Math.random() * 1000);
}
function my_click_non_clickable(target) {
    if (typeof (target) == "string") {
        text(target).waitFor();
        var tmp = text(target).findOne().bounds();
    } else {
        var tmp = target.bounds();
    }
    var randomX = random(tmp.left, tmp.right);
    var randomY = random(tmp.top, tmp.bottom);
    click(randomX, randomY);
}
/**
 * @description: 得到各项次数
 */
function get_all_num() {
    console.info('正在获取分数情况');
    delay(1);
    if (id("comm_head_xuexi_score").exists()) {
        id("comm_head_xuexi_score").findOnce().click();
    } else if (text("积分").exists()) {
        text("积分").findOnce().parent().child(1).click();
    }
    delay(1);
    if (text('知道了').exists()) {
        text('知道了').click();
    }
    // var score_id = id('comm_head_xuexi_score').findOne(5000);
    // score_id.click();
    text('登录').waitFor();
    delay(4);
    var score = {};


    // var list_view = className("android.widget.ListView").findOne(5000);
    var texts = "";
    if (arguments.length >= 2) {    // 返回分数情况->PushDeer
        try {
            texts += "%0A成长总积分：" + textContains("成长总积分").findOne().parent().child(3).text() + "分%0A";
        } catch (e) { }
        texts += textContains("今日已累积").findOne().text();
    }
    // for (var i = 0; i < list_view.childCount(); i++) {
    //     var son = list_view.child(i);
    //     try {
    //         var names = son.child(0).child(0).text();
    //     } catch (e) {
    //         var names = son.child(0).text();
    //     }
    //     var sx = son.child(2).text().split("/")[0].match(/[0-9][0-9]*/g);
    //     score[names] = Number(sx);
    //     if (arguments.length >= 2) {    // 返回分数情况->PushDeer
    //         texts += '%0A - ' + names + ':' + son.child(2).text().split("/")[0].match(/[0-9][0-9]*/g) + '/' + son.child(2).text().split("/")[1].match(/[0-9][0-9]*/g);
    //         if (i == list_view.childCount() - 1) {
    //             back_table();
    //             return texts;
    //         }
    //     }
    // }
    for (var i = 4; i < 17; i++) {
        // 由于模拟器有model无法读取因此用try catch
        try {
            var model = className("android.view.View").depth(24).findOnce(i);
            if (i == 4) {
                score['我要选读文章'] = parseInt(model.child(3).child(0).text());
                texts += '%0A - ' + '我要选读文章' + score['我要选读文章']
            } else if (i == 5) {
                score['视听学习'] = parseInt(model.child(3).child(0).text());
                texts += '%0A - ' + '视听学习' + score['视听学习']

            } else if (i == 16) {
                score['每周答题'] = parseInt(model.child(3).child(0).text());
                texts += '%0A - ' + '每周答题' + score['每周答题']
            } else if (i == 7) {
                score['每日答题'] = parseInt(model.child(3).child(0).text());
                texts += '%0A - ' + '每日答题' + score['每日答题']
            } else if (i == 8) {
                score['专项答题'] = parseInt(model.child(3).child(0).text());
                texts += '专项答题' + score['专项答题']
            } else if (i == 9) {
                score['挑战答题'] = parseInt(model.child(3).child(0).text());
                texts += '%0A - ' + '挑战答题' + score['挑战答题']
            } else if (i == 10) {
                score['四人赛'] = parseInt(model.child(3).child(0).text());
                texts += '%0A - ' + '四人赛' + score['四人赛']
            } else if (i == 11) {
                score['双人对战'] = parseInt(model.child(3).child(0).text());
                texts += '%0A - ' + '双人对战' + score['双人对战']
            }
            else if (i == 13) {
                score['发表观点'] = parseInt(model.child(3).child(0).text());
            } else if (i == 14) {
                score['本地频道'] = parseInt(model.child(3).child(0).text());
                texts += '%0A - ' + '本地频道' + score['本地频道']
            } else {
                log("i=" + i + "分数" + parseInt(model.child(3).child(0).text()))
            }
            //  finish_list.push(model.child(4).text() == "已完成");
        } catch (error) {

        }
    }
    video_num = 6 - score['视听学习'];
    if (arguments.length >= 1) {
        article_num = Math.ceil((12 - score['我要选读文章']));
    }
    else {
        article_num = Math.ceil((12 - score['我要选读文章']) / 2);
    }
    daily_num = (5 - score['每日答题']) ? 1 : 0;
    week_num = score['每周答题'] ? 0 : 1;
    special_num = score['专项答题'] ? 0 : 1;
    challenge_num = (5 - score['挑战答题']) ? 1 : 0;
    four_num = score['四人赛'] ? 0 : 1;
    double_num = score['双人对战'] ? 0 : 1;
    sub_num = 2 - score['订阅'];
    standpoint_num = 1 - score['发表观点'];
    local_num = 1 - score['本地频道'];
    // share_num = score['分享']?0:2;
    console.log('文章学习:' + article_num + '次');
    console.log('视频学习:' + video_num + '次');
    console.log('每日答题:' + daily_num + '次');
    // console.log('每周答题:'+week_num+'次');
    console.log('专项答题:' + special_num + '次');
    console.log('挑战答题:' + challenge_num + '次');
    console.log('四人赛  :' + four_num + '次');
    console.log('双人对战:' + double_num + '次');
    back();
    return texts;
    console.info('获取完成');
    delay(2);
}
var article_list = [];
/**
 * @description: 已读文章判断
 * @param: 文章名字 X 
 */
function article_check(x) {
    for (var i = 0; i < article_list.length; i++) {
        if (article_list[i] == x) return true;
    }
    article_list.push(x);
    return false;
}
var commits = ["中国特色社会主义不是从天上掉下来的",
    "时代是出卷人，我们是答卷人，人民是阅卷人",
    "这个新时代是中国特色社会主义新时代，而不是别的什么新时代",
    "决不能因为胜利而骄傲，决不能因为成就而懈怠，决不能因为困难而退缩",
    "要打好防范和抵御风险的有准备之战，也要打好化险为夷、转危为机的战略主动战"];
/**
 * @description: 文章学习
 * @param: 第xxx次学习
 */
function study_article() {
    if (article_num == 0 || !hamibot.env.article) return;
    console.info('正在文章学习');
    back_table();
    delay(2);
    start_close_radio(true);
    delay(2);
    desc('工作').click();
    delay(2);
    click('推荐');
    console.warn('还需要学习' + article_num + '篇文章');
    var x = 0;
    while (article_num > 0) {
        while (article_num > 0) {
            var b = text('播报').findOnce(x);
            if (b) {
                var names = b.parent().parent().parent().child(0).text();
                if (!article_check(names)) {
                    delay(1);
                    var tmp = b.parent().parent().parent().child(0).parent().parent().click();
                    if (!tmp) {
                        x++;
                        continue;
                    }
                    delay(3);
                    var show = textContains('2022 年').findOne(10);
                    if (!show) { console.warn('没有加载出文章，返回'); }
                    else {
                        var t = article_s + Math.floor(Math.random() * 5 + 1);
                        console.info('当前第' + (7 - article_num) + '篇文章,本篇文章学习' + t + 's');
                        for (var i = 0; i < t;) {
                            sleep(1000);
                            while (!textContains("欢迎发表你的观点").exists()) {
                                console.error('已离开文章界面');
                                delay(5);
                            }
                            var tmp = Math.random();
                            try {
                                if (tmp > 0.9) {
                                    swipe(3 * device.width / 4, 3 * device.height / 4 + Math.random() * 100, 3 * device.width / 4, device.height / 4 - Math.random() * 100, Math.random() * 1000);
                                } else if (tmp < 0.1) {
                                    swipe(3 * device.width / 4, device.height / 4 + Math.random() * 100, 3 * device.width / 4, 3 * device.height / 4 - Math.random() * 100, Math.random() * 1000);
                                }
                            } catch (e) { }
                            i++;
                            if (i % 5 == 0) {
                                console.log('已经学习文章' + i + 's,' + '还剩' + (t - i) + 's');
                            }
                        }
                        article_num--;
                        if (standpoint_num > 0) {
                            console.info('开始发表观点');
                            try {
                                var commit = text('观点').findOne(3000).parent().parent().child(2).child(1).child(0).text();
                            } catch (e) {
                                var commit = commits[random(0, commits.length - 1)];
                            }
                            standpoint_num--;
                            text('欢迎发表你的观点').click();
                            delay(2);
                            setText(commit);
                            delay(1);
                            click("发布");
                            delay(2);
                            click("删除");
                            delay(2);
                            click("确认");
                            console.info('发表观点完成');
                        }
                        if (share_num > 0) {
                            console.info('开始分享');
                            delay(2);
                            share_num--;
                            className('ImageView').depth(10).drawingOrder(4).click();
                            delay(1);
                            click("分享到学习强国");
                            delay(1);
                            back();
                            console.info('分享完成');
                        }
                    }
                    delay(2);
                    back();
                    delay(2);
                }
                x++;
            }
            else {
                x = 0;
                className("ListView").scrollForward();
                delay(2);
            }
        }
        console.info('正在检查是否完成');
        delay(5);
        article_s = 6 + random(0, 6);  // 文章未完成
        get_all_num(1);
    }
    console.info('文章学习完成');
    start_close_radio(false);
    delay(2);
}
/**
 * @description: 本地频道
 */
function local_() {
    if (local_num == 0 || !hamibot.env.local) return;
    console.info('开始本地频道');
    back_table();
    desc('工作').click();
    delay(2);
    my_click_non_clickable('四川')
    delay(2);

    if (text("四川").exists()) {

        className("android.widget.LinearLayout").clickable(true).depth(26).waitFor();

        className("android.widget.LinearLayout").clickable(true).depth(26).drawingOrder(1).findOne().click();
        toastLog('点击四川学习平台')
        back();
    } else {
        my_click_non_clickable('四川')
        my_click_non_clickable('四川学习平台')
        back();
    }

    back_table();
    console.info('本地频道完成');
    delay(2);
}
/**
 * @description: 视频学习
 */
function study_video() {
    if (video_num == 0 || !hamibot.env.video) return;
    console.info('开始视频学习');
    back_table();
    console.warn('还需学习' + (video_num) + '篇视频');
    delay(2);
    click('百灵');
    delay(2);
    var contentsText = ["推荐", "党史", "竖", "炫", "窗", "藏", "靓", "秀"];
    var contentsNum = random(0, contentsText.length - 1); //随机数
    console.info("视频看的" + contentsText[contentsNum]);
    click(contentsText[contentsNum]);
    delay(2);
    while (video_num > 0) {
        while (video_num > 0) {
            console.info('当前第' + (7 - video_num) + '篇');
            delay(2);
            try {
                className('android.widget.FrameLayout').clickable(true).depth(22).findOnce(0).click();
            }
            catch (e) {
                className('android.widget.FrameLayout').clickable(true).depth(22).findOnce(1).click();
            }
            delay(2);
            var t = video_s + random(0, 5);
            for (var i = 0; i < t;) {
                sleep(1000);
                while (!text('播放').exists()) {
                    console.error('已离开视频界面');
                    delay(5);
                }
                i++;
                console.log('已经学习视频' + i + 's,' + '还需' + (t - i) + 's');
            }
            back();
            video_num--;
            delay(1);
            className("ListView").depth(21).findOne().scrollForward();
            delay(1);
            className("ListView").depth(21).findOne().scrollForward();
            delay(1);
        }
        delay(5);
        console.info("正在获取是否完成");
        get_all_num();
    }
    console.info('视频学习完成');
    delay(2);
}

/**
 * @description: 每周专项获取提示答案列表
 * @author:Lejw
 * @return:答案列表
 */
function getAnsList() {

    ansField = className("android.view.View").clickable(true).depth(23).indexInParent(0).findOne()
    var ans = ansField.bounds()
    var x = ans.left
    var y = ans.top
    var h = ans.bottom - ans.top
    var w = ans.right - ans.left
    var img = images.clip(captureScreen(), x, y, w, h);//裁切提示
    img = images.interval(img, "#FD1111", 60)//图片二值化
    //   images.save(img,'/sdcard/1.png')
    var ansLis = []
    if (choose == 'a') {
        //TODO：HUAWEI_OCR 
    } else if (choose == 'b') {
        //TODO: THIRD_PARTY_OCR
    } else if (choose == 'c') {
        ansList = hamibot_ocr_api_return_list(img);
    } else {
        var token = get_baidu_token(hamibot.env.client_id, hamibot.env.client_secret);
        ansList = baidu_ocr_api_return_list(img, token);
    }
    retList = [];
    if (ansList.length != 0) {//处理连续字符串换行合并
        rawAns = ansField.text();
        retList.push(ansList[0]);
        for (let i = 1; i < ansList.length; i++) {
            str = ansList[i - 1] + ansList[i]
            if (rawAns.indexOf(str) != -1) {
                retList.push(retList.pop() + (ansList[i]));
            } else {
                retList.push(ansList[i]);
            }
            //       console.log(rawAns.lastIndexOf(str.substr(str.length-1,1)),rawAns.indexOf(ansList[i][0]))
            // 			if(rawAns.lastIndexOf(str.substr(str.length-1,1))==rawAns.indexOf(ansList[i][0])-1) {
            //       	retList.push(retList.pop()+(ansList[i]));
            //       }else {
            //         retList.push(ansList[i]);
            //       }
        }
    }
    return retList
}


/**
 * @description: 获取专项提示答案列表
 * @author:Lejw
 * @return:答案列表
 */
function getSpecialAnsList() {
    auto.waitFor();
    ansField = className("android.view.View").clickable(true).depth(22).indexInParent(0).findOne()
    rawAns = ansField.text()
    console.log(rawAns)
    var ans = ansField.bounds()
    var x = ans.left
    var y = ans.top
    var h = ans.bottom - ans.top
    var w = ans.right - ans.left
    console.log(x, y, h, w)
    var img = images.clip(captureScreen(), x, y, w, h);//裁切提示
    img = images.interval(img, "#FD1111", 60)//图片二值化
    images.save(img, '/sdcard/1.png')
    var ansLis = []
    if (choose == 'a') {
        //TODO：HUAWEI_OCR 
    } else if (choose == 'b') {
        //TODO: THIRD_PARTY_OCR
    } else if (choose == 'c') {
        ansList = hamibot_ocr_api_return_list(img);
    } else {
        var token = get_baidu_token(hamibot.env.client_id, hamibot.env.client_secret);
        ansList = baidu_ocr_api_return_list(img, token)
    }
    retList = [];
    if (ansList.length != 0) {//处理连续字符串换行合并
        retList.push(ansList[0]);
        for (let i = 1; i < ansList.length; i++) {
            str = ansList[i - 1] + ansList[i]
            if (rawAns.indexOf(str) != -1) {
                retList.push(retList.pop() + (ansList[i]));
            } else {
                retList.push(ansList[i]);
            }
            //       console.log(rawAns.lastIndexOf(str.substr(str.length-1,1)),rawAns.indexOf(ansList[i][0]))
            // 			if(rawAns.lastIndexOf(str.substr(str.length-1,1))==rawAns.indexOf(ansList[i][0])-1) {
            //       	retList.push(retList.pop()+(ansList[i]));
            //       }else {
            //         retList.push(ansList[i]);
            //       }
        }
    }
    return retList
}

/**
 * @description: 每日答题 - 单题
 */
function click_daily() {
    var xxxxxxxxxx = '';
    var click_true = false;
    text("查看提示").findOne().click();
    var tips = text("提示").findOne().parent().parent().child(1).child(0).text();
    delay(1);
    back();
    delay(1);
    if (textContains('选题').exists()) {
        className("ListView").findOne().children().forEach(option => {
            if (tips.indexOf(option.child(0).child(2).text()) != -1) {
                xxxxxxxxxx += option.child(0).child(2).text();
                option.child(0).click();
                click_true = true;
            }
        })
        if (click_true == false) {
            className("ListView").findOne().child(0).child(0).click();
        }
        console.log('答案:' + xxxxxxxxxx);
    }
    else {
        var q_list = [];
        var space_num = [];
        className("EditText").findOnce().parent().parent().children().forEach(item => {
            if (item.childCount() == 0) {
                q_list.push(item.text());
            }
            else {
                q_list.push('@' + (item.childCount() - 1));
                space_num.push((item.childCount() - 1));
            }
        })
        var ans = '';
        for (var i = 1; i < q_list.length - 1; i++) {
            if (q_list[i][0] == '@') {
                var ss = q_list[i - 1].substr(Math.max(0, q_list[i - 1].length - 5), 5);
                var aaa = tips.indexOf(ss) + ss.length;
                var aaaa = tips.substr(aaa, Number(q_list[i][1]));
                ans += aaaa;
            }
        }
        if (ans == '') { ans = "没有找到答案！！！" }
        console.log('答案:' + ans);
        setText(0, ans.substr(0, space_num[0]));
        if (space_num.length > 1) {
            for (var i = 1; i < space_num.length; i++) {
                setText(i, ans.substr(space_num[i - 1], space_num[i]));
            }
        }
    }
    delay(1);
    text('确定').findOne().click();
    delay(0.5);
    if (text('下一题').exists()) {
        click('下一题');
    }
    if (text('完成').exists()) {
        click('完成');
    }
    delay(1);
}
/**
 * @description: 每日答题
 */
function daily_Answer() {
    if (daily_num == 0 || !hamibot.env.day) return;
    console.info('开始每日答题');
    questionShow();
    delay(1);
    text('每日答题').findOne().parent().click();
    delay(3);
    var x = 0;
    while (true) {
        click_daily();
        x++;
        if (x >= 5) {
            text("再来一组").waitFor()
            delay(3);
            if (!text("领取奖励已达今日上限").exists()) {
                console.warn('积分未满，再答一次');
                x = 0;
                text("再来一组").click();
                delay(2);
            } else {
                text("返回").click();
                delay(2);
                break;
            }
        }
    }
    console.info('每日答题结束');
    delay(2);
}
/**
 * @description: 挑战 单题答题
 */
function challenge_loop(x) {
    yinzi = false;
    if (x > 5) {

        try {
            console.info('答题次数已满，随机点击');
            var tmp = className("ListView").findOne().childCount();
            className("ListView").findOne().child(random(0, tmp - 1)).child(0).child(0).click();
        } catch (error) {
            console.info('随机点击错误')
            back();

        }

    }
    else {
        reg = /下列..正确的是.*/g;
        reb = /选择词语的正确.*/g;
        rea = /选择正确的读音.*/g;
        rec = /下列不属于二十四史的是.*/g;
        var question = className("ListView").findOnce().parent().child(0).text();
        if (rec.test(question) || reg.test(question) || rea.test(question) || reb.test(question)) {
            yinzi = true;
            question = '';
            className("ListView").findOne().children().forEach(option => {
                question += option.child(0).child(1).text();
            })
        }
        var similars = 0;
        var answer = '';
        for (var i = 0; i < question_list.length; i++) {
            var tmp = similarity(question_list[i][1], question_list[i][0], question, yinzi);
            if (tmp > similars) {
                similars = tmp;
                answer = question_list[i][0];
            }
        }
        console.log('答案：' + answer);
        var option = className("ListView").findOne();
        var click_option = 0;
        var similars = 0;
        for (var i = 0; i < option.childCount(); i++) {
            var tmp = similarity_answer(option.child(i).child(0).child(1).text(), answer);
            if (tmp > similars) {
                similars = tmp;
                click_option = i;
            }
        }
        try {
            option.child(click_option).child(0).child(0).click();
        } catch (error) {
            console.log('挑战答题点击答案异常');
        }

    }
    delay(1);

}


/**
 * @description: 专项答题 - 单题
 * @author:Lejw
 */
function click_special() {
    var xxxxxxxxxx = '';
    var click_true = false;
    text("查看提示").findOne().click();
    delay(1);
    var ansList = getSpecialAnsList();
    back();
    delay(1);
    if (textContains('选题').exists()) {
        var tips = '';
        ansList.forEach(x => {
            tips += x;
        })
        className("ListView").findOne().children().forEach(option => {
            if (tips.indexOf(option.child(0).child(2).text()) != -1) {
                xxxxxxxxxx += option.child(0).child(2).text();
                option.child(0).click();
                click_true = true;
            }
        })
        if (click_true == false) {
            className("ListView").findOne().child(0).child(0).click();
        }
        console.log('答案:' + xxxxxxxxxx);
    }
    else {
        for (let i = 0; i < ansList.length; i++) {
            setText(i, ansList[i]);
        }
    }
    delay(0.5);
    if (text('下一题').exists()) {
        click('下一题');
    }
    if (text('完成').exists()) {
        click('完成');
    }
    delay(1);
}


/**
 * @description: 查找每周答题入口
 * @Author: Lejw
 */
function checkWeekEntry() {
    let tryTime = 10;
    while (tryTime) {
        tryTime--;
        delay(1);
        if (text("未作答").exists()) {
            console.log("进入答题");
            text('未作答').findOne().parent().click();
            return true;
        }
        gesture(500, [100, 1300], [100, 200]);
    }
    console.log("没有未完成题目");
    return false;
}

/**
 * @description: 查找专项答题入口
 * @Author: Lejw
 */
function checkSpecialEntry() {
    let tryTime = 10
    while (tryTime) {
        tryTime--;
        delay(1);
        if (text("开始答题").exists()) {
            console.log("进入答题");
            text('开始答题').findOne().click();
            return true;
        }
        if (text("继续答题").exists()) {
            console.log("继续答题");
            text('继续答题').findOne().click();
            return true;
        }
        gesture(500, [100, 1300], [100, 200]);
    }
    console.log("没有未完成题目")
    return false;
}



/**
 * @description: 每周答题 - 单题
 * @author:Lejw
 */
function click_week() {
    var xxxxxxxxxx = '';
    var click_true = false;
    text("查看提示").findOne().click();
    delay(1);
    var ansList = getAnsList();
    back();
    delay(1);
    if (textContains('选题').exists()) {
        var tips = '';
        ansList.forEach(x => {
            tips += x;
        })
        className("ListView").findOne().children().forEach(option => {
            if (tips.indexOf(option.child(0).child(2).text()) != -1) {
                xxxxxxxxxx += option.child(0).child(2).text();
                option.child(0).click();
                click_true = true;
            }
        })
        if (click_true == false) {
            className("ListView").findOne().child(0).child(0).click();
        }
        console.log('答案:' + xxxxxxxxxx);
    }
    else {
        for (let i = 0; i < ansList.length; i++) {
            setText(i, ansList[i]);
        }
    }
    delay(1);
    text('确定').findOne().click();
    delay(0.5);
    if (text('下一题').exists()) {
        click('下一题');
    }
    if (text('完成').exists()) {
        click('完成');
    }
    delay(1);
}


/**
 * @description: 每周答题
 * @author:Lejw
 */
function week_Answer() {
    if (week_num == 0 || !hamibot.env.week || token == "") return;
    console.info('开始每周答题');
    questionShow();
    delay(1);
    text('每周答题').findOne().parent().click();
    delay(1);
    if (!checkWeekEntry()) {//找不到能进去的题
        console.log("每周答题结束");
        back();
        delay(1);
        return;
    }
    delay(3);
    while (true) {
        click_week();
        if (text("返回").exists()) {
            delay(1);
            text("返回").click();
            delay(2);
            break;
        }
    }
    back();
    console.info('每周答题结束');
    delay(2);
}

/**
 * @description: 专项答题
 * @author:Lejw
 */
function special_Answer() {
    if (special_num == 0 || !hamibot.env.special) return;
    console.info('开始专项答题');
    questionShow();
    delay(1);
    text('专项答题').findOne().parent().click();
    delay(1);
    if (!checkSpecialEntry()) {//找不到能进去的题
        console.log("专项答题结束");
        back();
        delay(1);
        return;
    }
    delay(3);
    while (true) {
        click_special();
        if (text("查看解析").exists()) {
            delay(1);
            back();
            delay(1);
            back();
            break;
        }
    }
    back();
    console.info('每项答题结束');
    delay(2);
}


/**
 * @description: 题目相似的查询
 * @param: question-题库题目，answer-题库答案，q文字识别内容，flag-字音
 */
function similarity(question, answer, q, flag) {
    var num = 0;
    if (flag) {
        if (question.indexOf('正确') == -1 && question.indexOf('下列不属于二十四史的') == -1) {
            return 0;
        }
        for (var i = 0; i < q.length; i++) {
            if (answer.indexOf(q[i]) != -1) {
                num++;
            }
        }
        return num / (answer.length + q.length);
    }
    else {
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
 * @description: 挑战答题
 */
function challenge() {
    if (challenge_num == 0 || !hamibot.env.challenge) return;
    console.info('开始挑战答题');
    questionShow();
    delay(3);
    text("排行榜").findOnce().parent().child(10).click();
    delay(5);
    var xxxxx = 1;
    while (true) {
        delay(3);
        challenge_loop(xxxxx);
        delay(0.5);
        if (text('wrong@3x.9ccb997c').exists() || text('2kNFBadJuqbAAAAAElFTkSuQmCC').exists() || text("v5IOXn6lQWYTJeqX2eHuNcrPesmSud2JdogYyGnRNxujMT8RS7y43zxY4coWepspQkvw" + "RDTJtCTsZ5JW+8sGvTRDzFnDeO+BcOEpP0Rte6f+HwcGxeN2dglWfgH8P0C7HkCMJOAAAAAElFTkSuQmCC").exists()) {
            delay(1);
            if (xxxxx < challenge_loop_num && text("立即复活").exists()) {
                click("立即复活");
                delay(1);

            } else if (text('结束本局').exists()) {
                text('结束本局').findOne().click();
                delay(2);
            }
            if (xxxxx > challenge_loop_num) {
                if (text('再来一局').exists()) {
                    text('再来一局').waitFor();
                }
                delay(1);
                back();
                break;
            }
            else {

                click('再来一局');
                delay(5);

            }
            xxxxx = 0;

        }
        else { xxxxx++; }
    }
    console.info('挑战答题结束');
    delay(2);
}
/**
 * @description: 题库提取到questi_list
 */
function init_question_list() {

    var path = "/sdcard/question_tiku.txt";
    if (init_true == true) {

        files.remove(path);
        delay(2);
    }
    var Dates = new Date();
    var Y = Dates.getFullYear();
    var M = Dates.getMonth() + 1;
    var D = Dates.getDate();

    var uptimes = Y + (M < 10 ? "0" : "") + M + (D < 10 ? "0" : "") + D;
    if (uptiku >= uptimes) {
        console.info('比当天月份大或等于 正在执行题库更新');
        try {
            var upx = http.get("https://gh-proxy.com/https://raw.githubusercontent.com/alikankan/study/main/" + uptiku).body.string();
            console.error("更新upx长度为" + upx.length)

        } catch (e) { e.error }
        if (upx.length > 100) {
            files.append("/sdcard/question_tiku.txt", upx);
            console.error('题库更新' + upx);
            toastLog("题库添加完成");
        } else {
            console.error("更新出错，upx长度为" + upx.length)
        }
        delay(3);
    } else {
        console.info('老题库 不更新');
    }
    //题库更新
    if (!files.exists(path)) {
        console.error('题库文件不存在,仔细查看脚本介绍\n3s重新下载');

        try {
            var x = http.get("https://gh-proxy.com/https://raw.githubusercontent.com/alikankan/study/main/question_tiku.txt").body.string();
            files.write("/sdcard/question_tiku.txt", x);
        } catch (e) { }
        delay(3);
        // console.close();
        // exit();
    }
    delay(3);
    var tiku = files.read(path);
    tiku = tiku.split('\n');
    for (var i = 0; i <= tiku.length; i++) {
        if (tiku[i]) {
            question_list.push(tiku[i].split('='));
        }
    }
}
/**
 * @description: 四人/双人对战
 */
function zsyAnswer() {
    console.info('开始对战');
    var img = captureScreen();
    try {
        var point = findColor(img, '#1B1F25', {
            region: [0, 0, 100, 100],
            threshold: 10,
        });
    } catch (e) {
        console.info('你可能使用了模拟器并且hamibot的版本是1.3.0及以上，请使用hamibot1.1.0版本');
        delay(3);
        exit();
    }
    if (choose == 'a') {
        huawei_ocr_api(img);
    } else if (choose == 'b') {
        ocr_api(img);
    } else if (choose == 'c') {
        hamibot_ocr_api(img);
    }
    else baidu_ocr_api(img);
    var count = 2;
    for (var i = 0; i < count; i++) {
        delay(2);
        if (text("随机匹配").exists()) {
            text("随机匹配").findOne(3000).parent().child(0).click();
            console.log("点击随机匹配");
            count = 1;
        } else {
            console.log("点击开始比赛");
            var sx = text("开始比赛").findOne(5000);
            if (sx) {
                sx.click();
            }
            else {
                console.log('没有找到开始比赛，点击随机匹配');
                text("随机匹配").findOne(3000).parent().child(0).click();
                count = 1;
            }
        }
        first = true;
        yinzi = false;
        delay(1);
        if (text('知道了').exists()) {
            console.warn('答题已满');
            text('知道了').findOnce().click();
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
        log('坐标获取完成');
        while (!text('继续挑战').exists()) {
            do {
                img = captureScreen();
                var point = findColor(img, '#1B1F25', {
                    region: [x, y, dx, dy],
                    threshold: 10,
                });
            } while (!point);
            if (!yinzi) console.time('答题');
            try {
                range = className("ListView").findOnce().parent().bounds();
                // if (choose == 'a') img = images.inRange(img, '#000000', '#444444');
                if (!first && !yinzi)
                    img = images.clip(img, x, y, dx, (range.bottom - y) / 3);
                else
                    img = images.clip(img, x, y, dx, range.bottom - y);
            }
            catch (e) {
                img = images.clip(img, x, y, dx, dy);
            }
            var question;
            if (choose == 'a') {    // 文字识别
                if (!first && !yinzi)
                    img = images.inRange(img, '#000000', '#444444');
                question = huawei_ocr_api(img);
            } else if (choose == 'b') {
                question = ocr_api(img);
            } else if (choose == 'c') {
                if (!first && !yinzi)      // 第一题不变色
                    img = images.inRange(img, '#000000', '#444444');
                question = hamibot_ocr_api(img);
            }
            else {
                if (!first && !yinzi)
                    img = images.inRange(img, '#000000', '#444444');
                question = baidu_ocr_api(img);
            }
            question = question.slice(question.indexOf('.') + 1);
            question = question.replace(/,/g, "，");
            console.log(question);
            logs.push(question);
            if (question) {
                var c = do_contest_answer(32, question);
                if (c == -1) {
                    break;
                } else if (c == -2) {
                    className('android.widget.RadioButton').waitFor();
                    continue;
                }
            } else {
                images.save(img, "/sdcard/截图.jpg", "jpg", 50);
                console.error("没有识别出任何内容，为了查错已经将截图保存在根目录./截图.jpg");
                console.log('截图坐标为(' + x + ',' + y + '),(' + dx + ',' + dy + ')');
                break;
            }
            console.timeEnd('答题');
            img.recycle();
            var q_right = true;
            do {
                img = captureScreen();
                var point = findColor(img, '#fff64e75', {
                    region: [x, y, dx, dy],
                    threshold: 10,
                });
                if (point && q_right) {
                    q_right = false;
                }
                point = findColor(img, '#555AB6', {
                    region: [x, y, dx, dy],
                    threshold: 10,
                });
            } while (!point);
            if (q_right == true) {    // 如果当前题目正确
                storage2.put(old_q, old_ans);    // 存入本地存储，减小下一次搜该题的时间
            } else {            // 当出错时
                if (storage2.contains(old_q))
                    storage2.remove(old_q);    // 可能由于上次搜题因错误答案而点击正确，则此时删除本地存储
            }
            console.log('----------');
            logs.push('----------');
            yinzi = false;
        }
        if (i == 0 && count == 2) {
            delay(1)
            console.log('第二轮答题开始');
            logs.push('第二轮答题开始');
            while (!click('继续挑战'));
            delay(1);
        }
    }
    if (hamibot.env.another) {
        //  var x = hamibot.env.another * 1;
        var x = 0;

    }
    else {
        var x = 0;
    }
    while (x > 0) {
        console.info('额外的 ' + x + ' 轮即将开始!');
        x--;
        delay(2);
        click('继续挑战');
        delay(3);
        if (text("随机匹配").exists()) {
            text("随机匹配").findOne().parent().child(0).click();
            console.log("点击随机匹配");
        } else {
            console.log("点击开始比赛");
            // my_click_clickable('开始比赛');
            var sx = text("开始比赛").findOne(5000);
            if (sx) {
                sx.click();
            }
            else {
                console.log('没有找到开始比赛，点击随机匹配');
                text("随机匹配").findOne(3000).parent().child(0).click();
            }
        }
        delay(1);
        if (text('知道了').exists()) {
            console.warn('答题已满');
            text('知道了').findOnce().click();
            delay(1);
            return 0;
        }
        while (true) {
            if (text('继续挑战').exists()) break;
            while (!className('android.widget.RadioButton').depth(32).exists()) {
                delay(random(3, 5));
                if (text('继续挑战').exists()) break;
            }
            delay(2);
            console.warn('随机点击');
            try {
                var t = className("ListView").findOne(5000).childCount();
                t = random(0, t - 1);
                className('android.widget.RadioButton').depth(32).findOnce(t).click();
            }
            catch (e) { }
            if (text('继续挑战').exists()) break;
            sleep(200);
        }
        // console.warn('额外一轮结束!');
    }
    console.info('答题结束,返回答题界面');
    delay(2);
    back();
    delay(2);
    back();
    if (count == 1) {
        delay(2);
        if (text('退出').exists()) {
            textContains('退出').click();
            delay(1);
        } else {
            console.warn('没有找到退出，按坐标点击(可能失败)\n如果没返回，手动退出双人赛即可继续运行');
            // console.setPosition(device.width * 0.2, device.height * 0.5);
            click(device.width * 0.2, device.height * 0.6);
        }
        delay(2);
    }
}
/**
 * @description: 四人/双人单题答题
 */
function do_contest_answer(depth_option, question1) {
    // console.time('搜题');
    question1 = question1.replace(/'/g, "");
    question1 = question1.replace(/"/g, "");
    old_question = JSON.parse(JSON.stringify(question1));
    question1 = question1.split('来源:')[0]; //去除来源
    question1 = question1.split('来源：')[0]; //去除来源
    question = question1.split('A.')[0];
    // question = question.split('（.*）')[0];
    reg = /下列..正确的是.*/g;
    reb = /选择词语的正确.*/g;
    rea = /选择正确的读音.*/g;
    rec = /下列不属于二十四史的是.*/g;
    var option = 'A';
    var answer = 'N';
    var similars = 0;
    var pos = -1;
    var answers_list = '';
    if (rec.test(question) || reg.test(question) || rea.test(question) || reb.test(question)) {
        yinzi = true;
        first = false;
        try {
            old_question = old_question.replace(/4\./g, 'A.');
            var old_answers = old_question.split('A.')[1].split('C')[0];
            for (var k = 0; k < 2; k++) {
                answers = old_answers.split('B.')[k];
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
                answers_list += answers;
            }
        } catch (e) {
            while (!className('android.widget.RadioButton').depth(32).exists()) {
                if (text('继续挑战').exists()) return -1;
            }
            return -2;
        };
    }
    if (yinzi) question = answers_list;
    answer = storage2.get(question);
    if (!answer) {
        for (var i = 0; i < question_list.length; i++) {          // 搜题
            var sx = similarity(question_list[i][1], question_list[i][0], question, yinzi);
            if (sx > similars) {
                similars = sx;
                pos = i;
            }
            if (sx == 999) break;
        }
        if (pos != -1) {
            answer = question_list[pos][0];
        }
        else {
            console.error('没搜到答案,题目异常：\n“' + old_question + '”');
            logs.push('没搜到答案,题目异常：\n“' + old_question + '”');
            console.error('此题异常');
        }
    }
    if (answer) {
        old_q = question;
        old_ans = answer;
        console.info('答案:' + answer);
        logs.push('答案:' + answer);
        if (!first && !yinzi) {
            while (true) {
                if (className('android.widget.RadioButton').depth(32).exists()) {
                    break;
                }
                if (text('继续挑战').exists()) return -1;
            }
            try {
                var img = captureScreen();
                var b = className('ListView').depth(29).findOne(3000).bounds();
                img = images.clip(img, b.left, b.top, b.right - b.left, b.bottom - b.top);
                if (choose == 'a') {
                    old_question = huawei_ocr_api(img);
                } else if (choose == 'b') {
                    old_question = ocr_api(img);
                } else if (choose == 'c') {
                    old_question = hamibot_ocr_api(img, 30, false);
                }
                else old_question = baidu_ocr_api(img);
                console.log(old_question);
                logs.push(old_question);
            }
            catch (e) {
                console.error(e);
                console.info('选项获取失败');
            }
        }
        try {
            option = click_by_answer(answer, old_question);
            if (!option) option = 'A';
        }
        catch (e) { console.error("此题选项异常！！！"); console.error(e); }
        console.info('点击选项:' + option);
        if (text('继续挑战').exists()) return -1;
        while (!className("ListView").exists()) {
            if (text('继续挑战').exists()) return -1;
        }
        if (text('继续挑战').exists()) return -1;
        if (!first && !yinzi) {
            sleep(delay_time);
        }
        first = false;
        try {
            while (!className("ListView").findOne(5000).child(option[0].charCodeAt(0) - 65).child(0).click()) {
                if (text('继续挑战').exists()) return -1;
            }
        } catch (e) {
            while (!className('android.widget.RadioButton').depth(depth_option).exists()) {
                if (text('继续挑战').exists()) return -1;
            }
            try {
                className('android.widget.RadioButton').depth(depth_option).findOnce(option[0].charCodeAt(0) - 65).click();
            } catch (e) {
                console.error('没找到选项,选A跳过');
                className('android.widget.RadioButton').depth(depth_option).findOnce(0).click();
            }
        }
        return 0;
    }
    try {
        className('android.widget.RadioButton').depth(depth_option).findOnce(0).click();
    }
    catch (e) {
        while (!className("ListView").findOne(5000).child(0).child(0).click()) {
            if (text('继续挑战').exists()) return -1;
        }
    }
    return 0;
}
var o = ['A.', 'B.', 'C.', 'D.', 'AAAA'];
var o1 = ['A', 'B', 'C', 'D', 'AAAA'];
/**
 * @description: 根据答案选择选项
 */
function click_by_answer(ans, question) {
    ans = ans.match(/[\u4e00-\u9fa5a-zA-Z0-9āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü]/g).join("")
    question = question.replace(/ /g, '');
    question = question.replace(/4\./g, 'A.');
    question = question.replace(/:/g, '：');
    try {
        question = replace(question);
    } catch (e) { }
    question = question.replace(/c\./g, "C.");
    question = question.replace(/，/g, ".");

    var sum = 0;
    for (var i = 0; i < question.length; i++) {
        if (question[i] >= 'A' && question[i] <= 'D') {
            sum++;
        }
    }
    var op = [];
    if (sum <= 4) {
        question = question.replace(/\./g, "");
        for (var i = 0; i < 4; i++) {
            try {
                var tmp = question.split(o1[i])[1].split(o1[i + 1])[0].split('推荐：')[0].split('出题')[0];
                op.push(tmp.match(/[\u4e00-\u9fa5a-zA-Z0-9āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü]/g).join(""));
            }
            catch (e) {
                op.push('&');
            }
        }
    }
    else {
        for (var i = 0; i < 4; i++) {
            try {
                var tmp = question.split(o[i])[1].split(o[i + 1])[0].split('推荐：')[0].split('出题')[0];
                op.push(tmp.match(/[\u4e00-\u9fa5a-zA-Z0-9āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü]/g).join(""));
            }
            catch (e) {
                op.push('&');
            }
        }
    }
    var s = 0;
    var pos = -1;
    for (var i = 0; i < op.length; i++) {
        if (op[i] == '&') continue;
        if (op[i] == ans) {
            return o1[i];
        }
        var tmp = similarity_answer(op[i], ans);
        if (tmp > s) {
            s = tmp;
            pos = i;
        }
    }
    return o1[pos];
}
/**
 * @description: 选项相似度查询
 * @param: 选择
 * @param: 正确选项
 */
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
/**
 * @description: 四人赛
 */
function four() {
    if (hamibot.env.another) {
        //  var x = hamibot.env.another * 1;
        four_num = 1;

    }
    if (four_num == 0 || !hamibot.env.four) return;
    // if (!hamibot.env.four) return;
    console.info('开始四人赛');
    logs.push('开始四人赛');
    questionShow();
    text("排行榜").findOne().parent().child(8).click();
    delay(1);
    zsyAnswer();
    delay(2);
}
/**
 * @description: 双人对战
 */
function double() {
    if (hamibot.env.another) {
        //  var x = hamibot.env.another * 1;
        double_num = 1;

    }
    if (double_num == 0 || !hamibot.env.double) return;
    // if (!hamibot.env.double) return;
    console.info('开始双人对战');
    logs.push('开始双人对战');
    questionShow();
    text("排行榜").findOne().parent().child(9).click();
    delay(1);
    zsyAnswer();
    delay(2);
}
/**
 * @description: 进入答题界面
 */
function questionShow() {
    while (!desc("工作").exists()) {
        delay(1);
        if (text("排行榜").exists()) {
            return;
        }
    }
    console.log("进入答题界面");
    text("我的").click();
    delay(1);
    while (!desc("我的信息").exists()) {
        delay(1);
    }
    text("我要答题").findOne().parent().click();
    delay(1);
    while (!text("排行榜").exists()) {
        delay(1);
    }
    delay(1);
}

/**
 * @description: 百度文字识别
 * @return: 文字识别内容
 */
function baidu_ocr_api(img) {
    console.log('百度ocr文字识别中baidu_ocr_api');
    var answer = "";
    var res = http.post(
        'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            access_token: token,
            image: images.toBase64(img),
        }
    );

    var res = res.body.json();
    try {
        var words_list = res.words_result;
    } catch (error) {
        console.error('百度ocr文字识别请求错误：可能有以下情况\n1.百度ocr欠费\n2.其他的错误');
        exit();
    }
    for (var i in words_list) {
        answer += words_list[i].words;
    }
    return answer.replace(/\s*/g, "");
}

/**
 * @description: 返回结果列表的百度文字识别
 * @author:Lejw
 * @return: 文字识别内容
 */
function baidu_ocr_api_return_list(img, token) {
    console.log('百度ocr文字识别中baidu_ocr_api_return_list');
    var res = http.post(
        'https://aip.baidubce.com/rest/2.0/ocr/v1/general',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            access_token: token,
            image: images.toBase64(img),
        }
    );

    var res = res.body.json();
    try {
        var words_list = res.words_result;
    } catch (error) {
        console.error('百度ocr文字识别失败:检查\n1.百度ocr欠费\n2.其他的错误');
        exit();
    }
    var ret = [];
    for (let i = 0; i < words_list.length; i++) {
        ret[i] = words_list[i].words.replace(/\s*/g, "");
    }
    return ret;
}

/**
 * @description: 获取百度OCR_token
 * @return: access_token
 */
function get_baidu_token(client_id, client_secret) {    // 百度ocr
    var res = http.post(
        'https://aip.baidubce.com/oauth/2.0/token',
        {
            grant_type: 'client_credentials',
            client_id: client_id,
            client_secret: client_secret
        }
    );
    var xad = res.body.json()['access_token'];
    if (xad == null) {
        console.error('百度文字识别（OCR）载入失败');
        delay(3);
        exit();
    } else {
        console.info('百度文字识别（OCR）载入成功');
    }
    return xad;
}
var ocr;
/**
 * @description: 第三方浩然文字识别
 * @return: 文字识别内容
 */
function ocr_api(img) {
    console.log('第三方本地ocr文字识别中');
    try {
        var answer = "";
        var results = ocr.detect(img.getBitmap(), 1);
        for (var i = 0; i < results.size(); i++) {
            var s = results.get(i).text;
            answer += s;
        }
        return answer.replace(/\s*/g, "");
    } catch (e) {
        console.error(e);
        console.info("第三方OCR插件安装错了位数，分为64位和32位\n卸载之前的插件，换一个位数安装");
        delay(3);
        exit();
    }
}
/**
 * @description: hamibot内置paddle文字识别
 * @return: 文字识别内容
 */
function hamibot_ocr_api() {
    console.log('hamibot文字识别中');
    let list = ocr.recognize(arguments[0])['results']; // 识别文字，并得到results
    let eps = 30; // 坐标误差
    if (arguments.length >= 2) eps = arguments[1];
    for (
        var i = 0;
        i < list.length;
        i++ // 选择排序对上下排序,复杂度O(N²)但一般list的长度较短只需几十次运算
    ) {
        for (var j = i + 1; j < list.length; j++) {
            if (list[i]['bounds']['bottom'] > list[j]['bounds']['bottom']) {
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
            if (
                Math.abs(list[i]['bounds']['bottom'] - list[j]['bounds']['bottom']) <
                eps &&
                list[i]['bounds']['left'] > list[j]['bounds']['left']
            ) {
                var tmp = list[i];
                list[i] = list[j];
                list[j] = tmp;
            }
        }
    }
    let res = '';
    for (var i = 0; i < list.length; i++) {
        res += list[i]['text'];
    }
    list = null;
    return res;
}

/**
 * @description: 返回结果列表的Hamibot文字识别
 * @author:Lejw
 * @return: 文字识别内容
 */
function hamibot_ocr_api_return_list() {
    console.log('hamibot文字识别中');
    let list = ocr.recognize(arguments[0])['results']; // 识别文字，并得到results
    let eps = 5; // 坐标误差
    if (arguments.length >= 2) eps = arguments[1];
    for (
        var i = 0;
        i < list.length;
        i++ // 选择排序对上下排序,复杂度O(N²)但一般list的长度较短只需几十次运算
    ) {
        for (var j = i + 1; j < list.length; j++) {
            if (list[i]['bounds']['bottom'] > list[j]['bounds']['bottom']) {
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
            if (
                Math.abs(list[i]['bounds']['bottom'] - list[j]['bounds']['bottom']) <
                eps &&
                list[i]['bounds']['left'] > list[j]['bounds']['left']
            ) {
                var tmp = list[i];
                list[i] = list[j];
                list[j] = tmp;
            }
        }
    }
    let res = [];
    for (var i = 0; i < list.length; i++) {
        res[i] = list[i]['text'];
    }
    list = null;
    return res;
}

/**
 * @description: 华为文字识别
 * @return: 文字识别内容
 */
function huawei_ocr_api(img) {
    console.log('华为ocr文字识别中');
    var answer = "";
    var res = http.postJson(
        'https://' + endpoint + '/v2/' + projectId + '/ocr/web-image', {
        "image": images.toBase64(img)
    }, {
        headers: {
            "User-Agent": "API Explorer",
            "X-Auth-Token": token,
            "Content-Type": "application/json;charset=UTF-8"
        }
    }
    );
    var res = res.body.json();
    try {
        var words_list = res.result.words_block_list;
    } catch (error) {
        toastLog(error);
        exit();
    }
    for (var i in words_list) {
        answer += words_list[i].words;
    }
    return answer.replace(/\s*/g, "");
}
/**
 * @description: 返回主界面
 */
function back_table() {
    delay(1);
    var back_num = 0;
    while (!desc("工作").exists()) { //等待加载出主页
        console.log("正在返回主页");
        back();
        delay(1);
        back_num++;
        if (className('Button').textContains('退出').exists()) {
            var c = className('Button').textContains('退出').findOne(3000);
            if (c) c.click();
            delay(1);
            c = null;
        }
        if (back_num > 10) {
            console.error('返回超过10次，可能当前不在xxqg，正在启动app...');
            launchApp("学习强国") || launch('cn.xuexi.android'); //启动学习强国app
            console.info('等待10s继续进行');
            delay(10);
            back_num = 0;
        }
    }
    back_num = null;
}
/**
 * @description: 开关广播
 * @param:开true -> 关false
 */
function start_close_radio(flag) {
    back_table();
    if (flag) {
        console.info("正在打开广播");
        click('电台');
        delay(2);
        click('听广播');
        delay(2);
        if (id("lay_state_icon").exists()) {
            log("等待:" + "lay_state_icon");
            id("lay_state_icon").waitFor();
            var lay_state_icon_pos = id("lay_state_icon").findOne().bounds();
            click(lay_state_icon_pos.centerX(), lay_state_icon_pos.centerY());
            delay(2);
            var home_bottom = id("home_bottom_tab_icon_large").findOne().bounds();
            click(home_bottom.centerX(), home_bottom.centerY());
        } else {
            console.info("广播点击失败换个方式");
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
            back();
        }

    }
    else {
        console.info("正在关闭广播");
        click('电台');
        delay(2);
        click('听广播');
        delay(2);
        var tmp = id('v_playing').findOne(5000);
        if (tmp) {
            tmp.click();
        }
    }
    back_table();   // 防止部分机型未在主页
}

/**
 * @description: 订阅
 */
function sub() {
    if (sub_num == 0 || !hamibot.env.sub) return;
    if (!files.exists('/sdcard/sub_position.txt')) {
        console.error('没有订阅坐标，跳过订阅');
        return;
    }
    console.info('开始订阅,还需要订阅' + (sub_num) + "个");
    back_table();
    desc('工作').click();
    delay(2);
    click('订阅');
    delay(2);
    text('添加').depth(25).findOne().parent().click();
    delay(2);
    try {
        if (hamibot.env.sub == 'b') {     // 只查看上新
            sub_click();
        }
    }
    catch (e) {
        log(e);
        console.error('坐标错误？重新生成坐标试试');
        back_table();
    }
}
/**
 * @description: 订阅平台切换
 */
function sub_click() {
    eval(files.read('/sdcard/sub_position.txt'));
    for (var i = 0; i < position.length && sub_num; i += 2) {
        press(position[i], position[i + 1], 100);
        if (i == 0 || i == 23) { delay(0.5); continue };

    }
}
/**
 * @description: 点击订阅
 */
function pic_click() {
    while (sub_num > 0) {
        let result = findColor(captureScreen(), '#E42417', {
            max: 5,
            region: [s1, 100, device.width - s1, device.height - 200], //区域
            threshold: 10,
        });
        if (result) {
            console.log("已经订阅了" + (3 - sub_num) + "个");
            press(result.x + 10, result.y + 10, 100);
            sub_num--;
        } else {
            break;
        }
        delay(1);
    }
}
/**
 * @description: 获取截图权限
 */
function get2_requestScreenCapture() {
    threads.start(function () {
        // 请求截图
        if (!requestScreenCapture(false)) {
            toastLog("请求截图失败");
            exit();
        }
    })
    delay(1);
    threads.start(function () {
        try {
            textContains("立即开始").className("Button").findOne(3000).click();
        } catch (e) { }
    })
    threads.start(function () {
        try {
            textContains("允许").className("Button").findOne(3000).click();
        } catch (e) { }
    })
}
function getVersion(package_name) {         // 得到包名的版本
    let pkgs = context.getPackageManager().getInstalledPackages(0).toArray();
    for (let i in pkgs) {
        if (pkgs[i].packageName.toString() === package_name) {
            return pkgs[i].versionName;
        }
    }
}
/**
 * @description: 进入hamibot界面获取截图权限(更稳定)
 */
function get_requestScreenCapture() {
    console.info('正在获取截图权限');
    launchApp("Hamibot");   // 若无必要，可以删除该行
    delay(2);
    get2_requestScreenCapture();
    var wait_num = 0;
    while (true) {
        sleep(3000);
        try {
            captureScreen();
            break;
        } catch (e) { }
        if (wait_num > 10) {    // 等待超过30s，重新申请截图权限
            wait_num = 0;
            get2_requestScreenCapture();
        }
        wait_num++;
    }
    wait_num = null;
    console.info('截图权限获取完成');
    if (choose == 'd') {  // 获取百度OCR的token,在hamibot内获取
        if (hamibot.env.client_id && hamibot.env.client_secret) {
            token = get_baidu_token(hamibot.env.client_id, hamibot.env.client_secret);
        }
        else {
            console.error('未填写百度OCR配置！！！');
            delay(3);
            exit();
        }
    }
    else if (choose == 'b') {
        try {
            ocr = plugins.load("com.hraps.ocr");
        }
        catch (e) {
            console.error('第三方OCR插件未安装');
            delay(3);

            exit();
        }
    }
    else if (choose == 'c') {
        var version = getVersion('com.hamibot.hamibot');
        if (version < '1.3.0') {
            console.error('Hamibot版本过低');
            delay(3);

            exit();
        }
    }
}
/**
 * @description: 数组随机排序
 */
function disorder(arr) {
    let length = arr.length;
    let current = arr.length - 1;
    let random;
    while (current >= 0) {
        random = Math.floor(length * Math.random());
        [arr[current], arr[random]] = [arr[random], arr[current]];
        current--;
    }
    return arr;
}
/**
 * @description: 积分推送到PushDeer
 */
function PushDeer() {
    if (!hamibot.env.key || hamibot.env.key == '') return;
    console.info('开始获取当天积分情况');
    back_table();
    var texts = get_all_num(1, 1);
    try {
        console.info('开始发送推送信息,请等待...');
        log(http.get(hamibot.env.key.replace(/这是推送内容不要删除/g, texts)).body.string());
    }
    catch (e) {
        console.error('推送请求失败，自己琢磨原因');
    }
    console.info('推送完成');
    texts = null;
}
/**
 * @description: 主函数
 */
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
function main() {
    device.keepScreenOn(30 * 60 * 1000);// 设置亮屏
    console.info('启动工作');
    launchApp("学习强国") || launch('cn.xuexi.android');
    while (!desc('工作').exists()) {
        delay(10);
        console.info('等待主页出现');
        等待主页(1);
        if (textContains("取消").exists() && textContains("立即升级").exists()) {
            text("取消").findOne().click();
        }
    }
    if (textContains("取消").exists() && textContains("立即升级").exists()) {
        text("取消").findOne().click();
    }
    delay(1);
    get_all_num();
    // double_num=1;
    // daily_num=1;
    delay(1);
    var list = disorder([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    list.forEach(i => {
        switch (i) {
            case 1:
                local_();
                study_article();
                break;
            case 2:
                study_video();
                break;
            case 3:
                // daily_Answer();
                break;
            case 4:
                local_();
                break;
            case 5:

                break;
            case 6:
                daily_Answer();
                four();
                double();
                challenge();
                break;
            case 7:
                //sub();
                break;
            case 8:

                break;
            case 9:
                week_Answer();
                break;
            case 10:
                daily_Answer();
                special_Answer();
                break;
        }
    })
    device.cancelKeepingAwake();    // 取消屏幕常亮
    PushDeer();
    // back_table();
    delay(1);
    if (hamibot.env.end) {
        console.info('正在执行自定义结束代码');
        try {
            eval(hamibot.env.end);
            console.info('自定义代码执行完成');
        }
        catch (e) {
            console.error('自定义代码有错误,跳过!!!');
        }
    }
    //================
    hamibot.postMessage(Date.now().toString(), {
        telemetry: true, // 由用户决定是否发送报告
        data: {
            title: "更新题库",
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

    //=============================
    console.info('脚本运行结束，3s后自动退出');
    delay(3);

    question_list = null;

    hamibot.exit();
    exit();
}
/**
 * @description: 看门狗运行主函数main()
 */
function watchdog() {
    device.wakeUpIfNeeded();
    console.info('Study togther开始运行!!!');
    console.error('脚本为免费脚本！！！');
    if (hamibot.env.head) {
        console.info('正在执行自定义开始代码');
        try {
            eval(hamibot.env.head);
            console.info('自定义代码执行完成');
        }
        catch (e) {
            console.error('自定义代码有错误,跳过!!!');
        }
    }
    if (hamibot.env.double || hamibot.env.four || hamibot.env.week || hamibot.env.special) {
        get_requestScreenCapture();
        delay(1);
    }
    if (hamibot.env.double || hamibot.env.four || hamibot.env.challenge) {
        init_question_list();
    }
    var thread = null;
    var main_num = 3;
    while (main_num--) {
        thread = threads.start(function () {
            main();
        })
        thread.join(watchdog_time);
        thread.interrupt();
        console.error('脚本超时/出错,正在重新启动');
        delay(2);
        back_table();
        delay(2);
    }
    toastLog("已经重新运行了多次，脚本结束");
    question_list = null;
    thread = null;

    exit();
}
threads.start(function () {
    while (true) {
        try {
            if (text('访问异常').exists()) {
                var b = textContains("向右滑动验证").findOne(2000).parent().child(2).bounds();;
                delay(1);
                console.error('当前需要验证，正在过验证');
                gestures([0, random(600, 1300), [b.centerX(), b.centerY()], [device.width, b.centerY()]]);
                delay(2);
                if (text('刷新').exists()) {
                    text('刷新').findOne(1000).parent().click();
                }
                else break;
            }
            delay(2);
            if (text('重试').exists()) {
                console.info('点击重试');
                text('重试').findOne(1000).click();
            }
            if (textContains("网络开小差").exists()) {
                click("确定");
            }
        }
        catch (e) { }
    }
    console.error('验证通过');
    captcha = true;
})

watchdog();
