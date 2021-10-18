/*v22cukEHP7K4bhqlhoN2uEGhwQma52lRQdoPMWZ8PDiAiZhsZJ24piWC6FlcYWB7*/
﻿import { toast } from 'nc-lightapp-front';
import { commondata } from '../public/utils/constant'

/**
 * 展开行
 * @param {*} operate DELETE,COMMIT，UNCOMMIT
 * @param {*} state 操作状态 0：全部失败 2部分失败 1：全部成功
 * @param {*} successIndex 成功行号 []
 * @param {*} failIndex  失败行号  []
 * @param {*} Message  错误信息   []
 * @param {*} content 提示内容,可以自己定义 不定义则方法固定生成
 */
export const BatchToast = function (op, status, total, successIndex, failIndex, Message, content) {
	let operate = '';

	if (op === commondata.DELETE) {
		operate = this.state.json['36070-000000'];/* 国际化处理： 删除*/
	}
	if (op === commondata.COMMIT) {
		operate = this.state.json['36070-000001'];/* 国际化处理： 提交*/
	}
	if (op === commondata.UNCOMMIT) {
		operate = this.state.json['36070-000002'];/* 国际化处理： 收回*/
	}
	if (op === commondata.SETTLE) {
		operate = this.state.json['36070-000003'];/* 国际化处理： 结算*/
	}
	if (op === commondata.UNSETTLE) {
		operate = this.state.json['36070-000004'];/* 国际化处理： 取消结算*/
	}
	if (op === commondata.SIGN) {
		operate = this.state.json['36070-000036'];/* 国际化处理： 签字*/
	}
	if (op === commondata.UNSIGN) {
		operate = this.state.json['36070-000037'];/* 国际化处理： 取消签字*/
	}
	if (op === commondata.TRANSFERFTS) {
		operate = this.state.json['36070-000005'];/* 国际化处理： 委托办理*/
	}
	if (op === commondata.UNTRANSFERFTS) {
		operate = this.state.json['36070-000006'];/* 国际化处理： 取消委托*/
	}
	if (op === commondata.REDHANDLE) {
		operate = this.state.json['36070-000007'];/* 国际化处理： 红冲*/
	}
	if (op == commondata.NETPAY) {
		operate = this.state.json['36070-000008'];/* 国际化处理： 网上付款*/
	}
	if (op == commondata.UPDATENETBANKE) {
		operate = this.state.json['36070-000009'];/* 国际化处理： 更新网银支付状态*/
	}
	if (op == commondata.BLANKBILL_LYCANCEL) {
		operate = this.state.json['36070-000038'];/* 国际化处理： 空白票据取消领用*/
	}
	if (op == commondata.BLANKBILL_BXCANCEL) {
		operate = this.state.json['36070-000039'];/* 国际化处理： 空白票据取消报销*/
	}
	if (op == commondata.BLANKBILL_ZFCANCEL) {
		operate = this.state.json['36070-000040'];/* 国际化处理： 空白票据取消作废*/
	}
	let title = operate + this.state.json['36070-000010'];/* 国际化处理： 完毕，*/
	let color = 'success';

	//begin tm tangleic 20200220 判断全部的场景时不能单独靠标志位，标志位来自后端，但有些异常是前端代码来做的分析 像预算提示信息 有的时候不能算成功
	// if (status == 0) {
	let allPassFlag =  failIndex == 0 && Message.length == 0;
	let allFialFlag =  successIndex == 0;
	if (allFialFlag) {
		//end tm tangleic

		title = title + this.state.json['36070-000011'];/* 国际化处理： 全部失败*/
		color = 'danger';
	}
	//begin tm tangleic 20200220 判断全部的场景时不能单独靠标志位，标志位来自后端，但有些异常是前端代码来做的分析 像预算提示信息 有的时候不能算成功
	// if (status == 1) {
	else if (allPassFlag) {
		//end tm tangleic

		title = title + this.state.json['36070-000012'];/* 国际化处理： 全部成功*/
		color = 'success';
	}
	//begin tm tangleic 20200220 判断全部的场景时不能单独靠标志位，标志位来自后端，但有些异常是前端代码来做的分析 像预算提示信息 有的时候不能算成功
	// if (status == 2) {
	else {
		//end tm tangleic

		title = title + this.state.json['36070-000013'];/* 国际化处理： 部分失败*/
		color = 'warning';

	}
	if (!content) {
		content = this.state.json['36070-000014'] + operate + total + this.state.json['36070-000015'];/* 国际化处理： 共,条，*/
		content = content + this.state.json['36070-000016'] + successIndex + this.state.json['36070-000017'];/* 国际化处理： 成功,条 ,*/
		content = content + this.state.json['36070-000018'] + failIndex + this.state.json['36070-000019'];/* 国际化处理： 失败,条*/
	}
	//begin tm tangleic 20200220 判断全部的场景时不能单独靠标志位，标志位来自后端，但有些异常是前端代码来做的分析 像预算提示信息 有的时候不能算成功
	// if (status == 1) {
	if (allPassFlag) {
		//end tm tangleic
		toast({
			duration: 5, // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: color, // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容，批量操作要输入,非必输
			groupOperation: true //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
		});
	} else {
		toast({
			duration: 'infinity', // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: color, // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容，批量操作要输入,非必输
			groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
			TextArr: [this.state.json['36070-000020'], this.state.json['36070-000021'], this.state.json['36070-000022']], //提示框文字按钮，有内容展开收起和批量操作必输3个值(第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭);/* 国际化处理： 展开,收起,关闭*/
			//  没有需要展开内容的输入2个值，点击两个按钮都是关闭
			groupOperationMsg: Message //数组的每一项，需要点击展开按钮显示的内容描述，非必输
		});
	}
};

/*v22cukEHP7K4bhqlhoN2uEGhwQma52lRQdoPMWZ8PDiAiZhsZJ24piWC6FlcYWB7*/