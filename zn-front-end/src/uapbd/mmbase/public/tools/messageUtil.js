//sfNYjniBpROe6lptounUq8NABdTbI/EYXsItFcQxEMQe9d39N+akWr/k+YOvkhdI
import { createPage, ajax, cacheTools, base, toast, high, promptBox, cardCache, getMultiLang } from 'nc-lightapp-front';

class LangContainer {
	constructor() {
		this.lang = null;
		this.inlt = null;
		console.log('LangContainer初始化');
		// 初始化提示多语信息
		getMultiLang({
			moduleId: '10140MMPUBMSG',
			domainName: 'uapbd',
			callback: this.init.bind(this),
			needInlt: true
		});
	}

	init(lang, status, inlt) {
		if (status) {
			this.lang = lang;
			this.inlt = inlt;
		}
	}

	getLangByResId(resid, param) {
		let str = resid;
		if (param) {
			str = this.inlt.get(resid, param);
			return str ? str : resid;
		} else {
			// 如果还没有加载回来，则返回空，避免页面显示多语字符串
			if (this.lang) {
				str = this.lang[resid];
				return str ? str : resid;
			} else {
				return resid;
			}
		}
	}
}

/**
 * 实例化多语容器
 */
const lang = new LangContainer();


function showBatchOprMessage(
	title = lang.getLangByResId('10140PUBMESSAGE-000003'),
	messageInfo,
	param = {},
	btnname = ''
) {
	/* 国际化处理： 提示*/
	let failedNum = messageInfo.failedNum?messageInfo.failedNum:0;
	let sucessNum = messageInfo.sucessNum;
	// 全部成功，提示即可
	if (failedNum == 0) {
		showSuccessInfo(
			lang.getLangByResId('10140PUBMESSAGE-000018', { 0: btnname }),
			lang.getLangByResId('10140PUBMESSAGE-000022', { 0: messageInfo.sucessNum })
		); /* 国际化处理： 处理成功{0}条！*/
	} else if (sucessNum == 0) {
		title = lang.getLangByResId('10140PUBMESSAGE-000019', { 0: btnname });
		let content = lang.getLangByResId('10140PUBMESSAGE-000020', {
			0: messageInfo.failedNum,
			1: messageInfo.failedNum
		});
		/* 国际化处理：共处理{0}条，失败{1}条！*/
		toast({
			duration: 'infinity', // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: 'danger', // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容,非必输
			groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
			TextArr: [
				lang.getLangByResId('10140PUBMESSAGE-000000'),
				lang.getLangByResId('10140PUBMESSAGE-000001'),
				lang.getLangByResId('10140PUBMESSAGE-000002')
			], //提示框按钮文字，第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭，批量操作必输/* 国际化处理： 展开,收起,我知道了*/
			groupOperationMsg: messageInfo.errorMessages, //数组的每一项，是批量操作之后数据处理结果的描述，非必输
			onExpand: param.onExpand, // 点击展开按钮的回调函数,非必输
			onClose: param.onClose // 关闭按钮的回调函数,非必输
		});
	} else {
		title = lang.getLangByResId('10140PUBMESSAGE-000019', { 0: btnname });
		let content = lang.getLangByResId('10140PUBMESSAGE-000021', {
			0: Number(messageInfo.sucessNum) + Number(messageInfo.failedNum),
			1: messageInfo.sucessNum,
			2: messageInfo.failedNum
		}); /* 国际化处理： 共处理{0}条，成功{1}条，失败{2}条！*/
		toast({
			duration: 'infinity', // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: 'danger', // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容,非必输
			groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
			TextArr: [
				lang.getLangByResId('10140PUBMESSAGE-000000'),
				lang.getLangByResId('10140PUBMESSAGE-000001'),
				lang.getLangByResId('10140PUBMESSAGE-000002')
			], //提示框按钮文字，第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭，批量操作必输/* 国际化处理： 展开,收起,我知道了*/
			groupOperationMsg: messageInfo.errorMessages, //数组的每一项，是批量操作之后数据处理结果的描述，非必输
			onExpand: param.onExpand, // 点击展开按钮的回调函数,非必输
			onClose: param.onClose // 关闭按钮的回调函数,非必输
		});
	}
}

/**
 * 显示成功Dialog
 * @param {*} title 标题  非必输 默认：已成功
 * @param {*} content 内容  非必输
 * @param {*} param 参数 非必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick closeBtnClick closeByClickBackDrop
 */
function showSuccessDialog(title, content, param = {}) {
	showMessageDialog(title, content, param);
}

/**
 * 显示操作成功信息
 * @param {*} title 非必输 默认：已成功
 * @param {*} content 非必输
 * @param {*} duration 非必输 默认3秒 值为infinity 不消失
 */
function showSuccessInfo(title, content, duration) {
	showInfo(title, content, duration);
}

/**
 * 显示警告信息
 * @param {*} title 非必输 默认：请注意
 * @param {*} content 非必输
 * @param {*} duration 非必输 默认3秒 值为infinity 不消失
 */
function showWarningInfo(title, content, duration) {
	showInfo(title, content, duration, 'warning');
}

/**
 * 显示显示帮助信息信息
 * @param {*} title 非必输 默认：帮助信息
 * @param {*} content 非必输
 * @param {*} duration 非必输 默认3秒 值为infinity 不消失
 */
function showInfoInfo(title, content, duration) {
	showInfo(title, content, duration, 'info');
}

function showInfo(title, content, duration, color, groupOperation, TextArr, groupOperationMsg, onExpand, onClose) {
	toast({
		duration: duration, // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
		color: color, // 提示类别，默认是 "success",非必输
		title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
		content: content, // 提示内容,非必输
		groupOperation: groupOperation, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
		TextArr: TextArr, //提示框按钮文字，第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭，批量操作必输
		groupOperationMsg: groupOperationMsg, //数组的每一项，是批量操作之后数据处理结果的描述，非必输
		onExpand: onExpand, // 点击展开按钮的回调函数,非必输
		onClose: onClose // 关闭按钮的回调函数,非必输
	});
}

/**
 * 显示警告Dialog
 * @param {*} title 标题  非必输 默认：请注意
 * @param {*} content 内容  非必输
 * @param {*} param 参数 非必输 参数列表：noFooter noCancelBtn beSureBtnName cancelBtnName beSureBtnClick cancelBtnClick closeBtnClick closeByClickBackDrop
 */
function showWarningDialog(title, content, param = {}) {
	showMessageDialog(title, content, param, 'warning');
}

function showMessageDialog(title, content, param = {}, color) {
	promptBox({
		color: color, // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
		title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
		content: content, // 提示内容,非必输
		noFooter: param.noFooter, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
		noCancelBtn: param.noCancelBtn, // 是否显示取消按钮,，默认显示(false),非必输
		beSureBtnName: param.beSureBtnName, // 确定按钮名称, 默认为"确定",非必输
		cancelBtnName: param.cancelBtnName, // 取消按钮名称, 默认为"取消",非必输
		beSureBtnClick: param.beSureBtnClick, // 确定按钮点击调用函数,非必输
		cancelBtnClick: param.cancelBtnClick, // 取消按钮点击调用函数,非必输
		closeBtnClick: param.closeBtnClick, //关闭按钮点击调用函数，非必输
		closeByClickBackDrop: param.closeByClickBackDrop //点击遮罩关闭提示框，默认是true点击关闭，阻止关闭是false
	});
}


export {
	
	showBatchOprMessage,
	showWarningDialog
	
};
//sfNYjniBpROe6lptounUq8NABdTbI/EYXsItFcQxEMQe9d39N+akWr/k+YOvkhdI