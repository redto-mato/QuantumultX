// #region 农历/万年历计算库 (SolarLunar Library)
/**
 * @name SolarLunar
 * @description 农历/公历互转
 */
var solarLunar = (function () {
    var lunarData = new Array(
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
        0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
    );
    var TianGan = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸");
    var DiZhi = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");
    var Animals = new Array("鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪");
    var solarTerm = new Array("小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至");
    var sTermInfo = new Array(0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758);
    var nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
    var nStr2 = new Array('初', '十', '廿', '卅', '□');
    var monthName = new Array("正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月");

    function lYearDays(y) {
        var i, sum = 348;
        for (i = 0x8000; i > 0x8; i >>= 1) sum += (lunarData[y - 1900] & i) ? 1 : 0;
        return (sum + leapDays(y));
    }
    function leapDays(y) {
        if (leapMonth(y)) return ((lunarData[y - 1900] & 0x10000) ? 30 : 29);
        else return (0);
    }
    function leapMonth(y) {
        return (lunarData[y - 1900] & 0xf);
    }
    function monthDays(y, m) {
        if ((m > 12) || (m < 1)) { return -1 }//月份参数从1至12，参数错误返回-1
        return ((lunarData[y - 1900] & (0x10000 >> m)) ? 30 : 29);
    }
    function Lunar(objDate) {
        var i, leap = 0, temp = 0;
        var baseDate = new Date(1900, 0, 31);
        var offset = (objDate - baseDate) / 86400000;
        this.dayCyl = offset + 40;
        this.monCyl = 14;
        for (i = 1900; i < 2050 && offset > 0; i++) {
            temp = lYearDays(i);
            offset -= temp;
            this.monCyl += 12;
        }
        if (offset < 0) {
            offset += temp;
            i--;
            this.monCyl -= 12;
        }
        this.year = i;
        this.yearCyl = i - 1864;
        leap = leapMonth(i);
        this.isLeap = false;
        for (i = 1; i < 13 && offset > 0; i++) {
            if (leap > 0 && i == (leap + 1) && this.isLeap == false) {
                --i;
                this.isLeap = true;
                temp = leapDays(this.year);
            }
            else {
                temp = monthDays(this.year, i);
            }
            if (this.isLeap == true && i == (leap + 1)) this.isLeap = false;
            offset -= temp;
            if (this.isLeap == false) this.monCyl++;
        }
        if (offset == 0 && leap > 0 && i == leap + 1)
            if (this.isLeap) {
                this.isLeap = false;
            }
            else {
                this.isLeap = true;
                --i;
                --this.monCyl;
            }
        if (offset < 0) {
            offset += temp;
            --i;
            --this.monCyl;
        }
        this.month = i;
        this.day = offset + 1;
    }
    function Solar(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
    var Holiday = {
        "0101": { "name": "元旦" },
        "0214": { "name": "情人节" },
        "0308": { "name": "妇女节" },
        "0312": { "name": "植树节" },
        "0401": { "name": "愚人节" },
        "0501": { "name": "劳动节" },
        "0504": { "name": "青年节" },
        "0601": { "name": "儿童节" },
        "0701": { "name": "建党节" },
        "0801": { "name": "建军节" },
        "0910": { "name": "教师节" },
        "1001": { "name": "国庆节" },
        "1225": { "name": "圣诞节" }
    }
    var lHoliday = {
        "0101": { "name": "春节" },
        "0115": { "name": "元宵节" },
        "0505": { "name": "端午节" },
        "0707": { "name": "七夕" },
        "0715": { "name": "中元节" },
        "0815": { "name": "中秋节" },
        "0909": { "name": "重阳节" },
        "1208": { "name": "腊八" },
        "1223": { "name": "小年" },
        "1230": { "name": "除夕" }
    }
    function lunarToSolar(year, month, day) {
        var isLeapYear = leapMonth(year);
        var daysInMonth = monthDays(year, month);
        if (isLeapYear && month > isLeapYear) {
            month++;
        }
        if (day > daysInMonth) {
            day = daysInMonth;
        }
        var offset = 0;
        for (var i = 1900; i < year; i++) {
            offset += lYearDays(i);
        }
        var isLeap = false;
        var leap = leapMonth(year);
        for (var i = 1; i < month; i++) {
            if (leap > 0 && i == (leap + 1) && isLeap == false) {
                --i;
                isLeap = true;
                temp = leapDays(year);
            } else {
                temp = monthDays(year, i);
            }
            offset += temp;
        }
        if (isLeap == true && i == (leap + 1)) {
            isLeap = false;
        }
        offset += day - 1;
        var baseDate = new Date(1900, 0, 31);
        var solarDate = new Date(baseDate.valueOf() + offset * 86400000);
        return new Solar(solarDate.getFullYear(), solarDate.getMonth() + 1, solarDate.getDate());
    }
    return {
        lunarToSolar: lunarToSolar
    };
})();
// #endregion

// #region 固定头部 (兼容 QuantumultX 和 Surge)
let isQuantumultX = $task != undefined;
let isSurge = $httpClient != undefined;
var $done = (obj={}) => {
    var isRequest = typeof $request != "undefined";
    if (isQuantumultX) { return isRequest ? $done({}) : "" }
    if (isSurge) { return isRequest ? $done({}) : $done() }
}
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
if (isQuantumultX) {
    var errorInfo = { error: '' };
    $httpClient = {
        get: (url, cb) => {
            var urlObj = (typeof (url) == 'string') ? { url: url } : url;
            $task.fetch(urlObj).then(response => { cb(undefined, response, response.body) }, reason => { errorInfo.error = reason.error; cb(errorInfo, response, '') })
        },
        post: (url, cb) => {
            var urlObj = (typeof (url) == 'string') ? { url: url } : url;
            url.method = 'POST';
            $task.fetch(urlObj).then(response => { cb(undefined, response, response.body) }, reason => { errorInfo.error = reason.error; cb(errorInfo, response, '') })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => { if (response) { response.body = data; resolve(response, { error: error }); } else { resolve(null, { error: error }) } })
                } else {
                    $httpClient.get(url, (error, response, data) => { if (response) { response.body = data; resolve(response, { error: error }); } else { resolve(null, { error: error }) } })
                }
            })
        }
    }
}
if (isQuantumultX) { $persistentStore = { read: key => { return $prefs.valueForKey(key); }, write: (val, key) => { return $prefs.setValueForKey(val, key); } } }
if (isSurge) { $prefs = { valueForKey: key => { return $persistentStore.read(key); }, setValueForKey: (val, key) => { return $persistentStore.write(val, key); } } }
if (isQuantumultX) { $notification = { post: (title, subTitle, detail) => { $notify(title, subTitle, detail); } } }
if (isSurge) { $notify = function (title, subTitle, detail) { $notification.post(title, subTitle, detail); } }
// #endregion

/*
倒数日 (集成万年历版)
*/

Date.prototype.format = function(fmt) {
    var o = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds() };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

function dateDiff(startDate, endDate) {
    var sdate = new Date(startDate);
    var edate = new Date(endDate);
    return parseInt((sdate - edate) / (1000 * 60 * 60 * 24));
}

// ======================= 您需要修改的区域 =======================
// type: 'solar' 代表公历, 'lunar' 代表农历
// date: "MM-DD" 格式的月和日
const events = [
    // --- 公历事件 ---
    //{ name: "十一周年", type: "solar", date: "09-11" },

    // --- 农历事件 ---
    { name: "四月庙",   type: "lunar", date: "04-15" }, // 农历四月十五
    { name: "结婚周年", type: "lunar", date: "07-20" }, // 农历七月二十
    { name: "妈生日",   type: "lunar", date: "07-22" }, // 农历七月二十二
    { name: "芳生日",   type: "lunar", date: "08-19" }, // 农历八月十九
    { name: "贝生日",   type: "lunar", date: "08-21" }, // 农历八月二十一
    { name: "二姐生日", type: "lunar", date: "08-23" }, // 农历八月二十三
    { name: "九月庙",   type: "lunar", date: "09-15" }, // 农历九月十五
    { name: "大姐生日", type: "lunar", date: "10-11" }, // 农历十月十一
    { name: "则生日",   type: "lunar", date: "11-16" }, // 农历十一月十六
    { name: "爸生日",   type: "lunar", date: "12-15" }, // 农历十二月十五
    { name: "除夕",     type: "lunar", date: "12-30" }, // 农历十二月三十 (如果某年是廿九，库会自动处理)
];
// =================================================================

day();

function valcal(days) {
    if (days == 0) return "就是今天";
    else if (days > 0) return "剩余 : " + days + "天";
    else return "已过 : " + Math.abs(days) + "天";
}

function getTargetDateStr(event) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentYear = now.getFullYear();
    
    let targetDate;

    if (event.type === 'solar') {
        let eventDateThisYear = new Date(`${currentYear}-${event.date}`);
        targetDate = (eventDateThisYear < today) ? new Date(`${currentYear + 1}-${event.date}`) : eventDateThisYear;
    } else if (event.type === 'lunar') {
        const [lunarMonth, lunarDay] = event.date.split('-').map(Number);

        // 计算今年的农历对应公历
        let solarDateThisYear = solarLunar.lunarToSolar(currentYear, lunarMonth, lunarDay);
        let eventDateThisYear = new Date(solarDateThisYear.year, solarDateThisYear.month - 1, solarDateThisYear.day);

        // 如果已过，计算明年的
        if (eventDateThisYear < today) {
            let solarDateNextYear = solarLunar.lunarToSolar(currentYear + 1, lunarMonth, lunarDay);
            targetDate = new Date(solarDateNextYear.year, solarDateNextYear.month - 1, solarDateNextYear.day);
        } else {
            targetDate = eventDateThisYear;
        }
    }
    
    return targetDate ? targetDate.format("yyyy-MM-dd") : null;
}

function day() {
    const nowStr = new Date().format("yyyy-MM-dd");
    let content = "";

    // 对事件进行排序，确保通知内容按时间顺序排列
    const sortedEvents = events.map(event => {
        const targetDateStr = getTargetDateStr(event);
        const diff = dateDiff(targetDateStr, nowStr);
        return { ...event, targetDateStr, diff };
    }).sort((a, b) => a.diff - b.diff);

    for (const event of sortedEvents) {
        if (!event.targetDateStr || isNaN(event.diff)) continue;
        
        const u = valcal(event.diff);
        content += `${event.name}• ${u}\n`;
    }
    
    content = content.trim();
    console.log(content);
    $notification.post('倒数日', "", content);
}

$done();
