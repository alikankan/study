auto.waitFor();
var { huaweiphone } = hamibot.env;
if (huaweiphone == "接听") {
    toastLog("接听");
    if (className("android.widget.ImageButton").desc("接听").click()) toastLog('dest接听点击成功')
    else className("android.widget.ImageButton").clickable(true).depth(11).findOnce(1).bounds().click();
}

if (huaweiphone == "拒绝") {
    toastLog("拒绝");
    if (className("android.widget.ImageButton").desc("拒绝").click()) toastLog('dest拒绝点击成功');
    else className("android.widget.ImageButton").clickable(true).depth(11).findOnce(1).bounds().click();
}

if (huaweiphone == "结束通话") {
    toastLog("结束通话");
    if (className("android.widget.ImageButton").desc("结束通话").click() || className("android.widget.ImageButton").desc("挂断视频通话").click()) {
        toastLog('dest结束通话 或挂断视频电话点击成功');
    }
    else {
        className("android.widget.ImageButton").clickable(true).depth(8).findOnce(1).bounds().click();

        toastLog("挂断视频通话");

        className("android.widget.ImageButton").clickable(true).depth(10).findOnce(1).bounds().click();
    }
}