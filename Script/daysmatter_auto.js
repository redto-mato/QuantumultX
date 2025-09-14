// #region 精准农历/万年历计算库 (Calendar.js)
var calendar = {
	/**
	 * 农历1900-2100的润大小信息表
	 * @Array Of Property
	 * @return Hex
	 */
	lunarInfo: [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0],
	/**
	 * 返回农历y年一整年的总天数
	 * @param y lunar Year
	 * @return Number
	 */
	lYearDays: function (y) {
		var i, sum = 348;
		for (i = 0x8000; i > 0x8; i >>= 1) sum += (this.lunarInfo[y - 1900] & i) ? 1 : 0;
		return (sum + this.leapDays(y));
	},
	/**
	 * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
	 * @param y lunar Year
	 * @return Number (0-12)
	 */
	leapMonth: function (y) {
		return (this.lunarInfo[y - 1900] & 0xf);
	},
	/**
	 * 返回农历y年闰月的天数 若该年没有闰月则返回0
	 * @param y lunar Year
	 * @return Number (0、29、30)
	 */
	leapDays: function (y) {
		if (this.leapMonth(y)) return ((this.lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
		return (0);
	},
	/**
	 * 返回农历y年m月（非闰月）的总天数
	 * @param y lunar Year
	 * @param m lunar Month
	 * @return Number (-1、29、30)
	 */
	monthDays: function (y, m) {
		if (m < 1 || m > 12) return -1;
		return ((this.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
	},
	/**
	 * 农历/公历转换主函数
	 * @param y solar Year
	 * @param m solar Month
	 * @param d solar Day
	 */
	lunar2solar: function (y, m, d, isLeap) {
		isLeap = !!isLeap;
		var leapMonth = this.leapMonth(y);
		var leapDay = this.leapDays(y);
		if (isLeap && (leapMonth !== m)) return -1; //传参要求计算闰月 但当年却没有闰m月
		if (d < 1 || d > this.monthDays(y, m)) return -1;
        if(isLeap && d > leapDay) return -1;

		var offset = 0;
		for (var i = 1900; i < y; i++) {
			offset += this.lYearDays(i);
		}
		
		for(var i = 1; i < m; i++){
			offset += this.monthDays(y, i);
		}

        if(leapMonth && m > leapMonth) offset += leapDay;
		if(isLeap) offset += this.monthDays(y,m);
		
		offset += d -1;

		var baseDate = new Date(1900, 0, 31);
		var solarDate = new Date(baseDate.valueOf() + offset * 86400000);
		
		return {
			cYear: solarDate.getFullYear(),
			cMonth: solarDate.getMonth() + 1,
			cDay: solarDate.getDate()
		}
	}
};
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
倒数日 (集成万年历精确版)
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
    // { name: "十一周年", type: "solar", date: "09-11" },

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
    { name: "除夕",     type: "lunar", date: "12-30" }, // 农历十二月三十 (脚本会自动判断当年是29还是30)
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

        // 封装一个函数来获取公历日期对象，以处理除夕等特殊情况
        const getSolarDate = (year, month, day) => {
            let solarObj = calendar.lunar2solar(year, month, day);
            // 如果返回-1，说明当月没有30号（即除夕是廿九），则尝试获取廿九
            if (solarObj === -1 && day === 30) {
                solarObj = calendar.lunar2solar(year, month, 29);
            }
            if (solarObj === -1) return null; // 无效日期
            return new Date(solarObj.cYear, solarObj.cMonth - 1, solarObj.cDay);
        };

        let eventDateThisYear = getSolarDate(currentYear, lunarMonth, lunarDay);

        // 如果已过，或日期无效，计算明年的
        if (!eventDateThisYear || eventDateThisYear < today) {
            targetDate = getSolarDate(currentYear + 1, lunarMonth, lunarDay);
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
        const diff = targetDateStr ? dateDiff(targetDateStr, nowStr) : null;
        return { ...event, targetDateStr, diff };
    }).filter(e => e.diff !== null) // 过滤掉无效日期
      .sort((a, b) => a.diff - b.diff);

    for (const event of sortedEvents) {
        const u = valcal(event.diff);
        content += `${event.name}• ${u}\n`;
    }
    
    content = content.trim();
    console.log(content);
    $notification.post('倒数日', "", content);
}

$done();
