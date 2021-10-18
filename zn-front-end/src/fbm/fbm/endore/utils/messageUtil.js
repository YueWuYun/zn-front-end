/*sfNYjniBpROe6lptounUqwHP3qhHm+nexdfCE7ZuvSKpeEvbPqefNeO3OV1lllpk*/
import { toast } from 'nc-lightapp-front';

/**
 * 批量显示提示信息
 * 
 * @param {*} op 操作类型：DELETE,COMMIT,UNCOMMIT
 * @param {*} status 操作状态 {0：全部失败 2部分失败 1：全部成功}
 * @param {*} total 总计数量
 * @param {*} successNum 成功数量
 * @param {*} failNUm 失败数量
 * @param {*} message  错误信息
 * @param {*} content 提示内容,可以自己定义 不定义则方法固定生成
 */

export const BatchToast = function(op, status, total, successNum, failNum, message, content) {
	let operate = '';
	if (op === OPERA_TYPE.DELETE) {
		operate = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000005');/* 国际化处理： 删除*/
	} else if (op === OPERA_TYPE.COMMIT) {
		operate = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000046');/* 国际化处理： 提交*/
	} else if (op === OPERA_TYPE.UNCOMMIT) {
		operate = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000047');/* 国际化处理： 收回*/
	} else if (op === OPERA_TYPE.COMMANDSEND) {
		operate = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000048');/* 国际化处理： 发送指令*/
	} else if (op === OPERA_TYPE.COMMANDCANCEL) {
		operate = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000049');/* 国际化处理： 撤回指令*/
	} else if (op === OPERA_TYPE.NULLIFY) {
		operate = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000062');/* 国际化处理： 作废*/
	} else if (op === OPERA_TYPE.NULLIFYCANCEL) {
		operate = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000063');/* 国际化处理： 取消作废*/
	}
	/* 国际化处理：完毕， */
	let finish = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000050');/* 国际化处理： 完毕*/
	let title = operate + finish;
	let color = 'success';
	let statusStr = '';
	if (status == 0) {
		/* 国际化处理：全部失败 */
		statusStr = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000051');/* 国际化处理： 全部失败*/
		title = title + statusStr;
		color = 'danger';
	} else if (status == 1) {
		/* 国际化处理：全部成功 */
		statusStr = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000052');/* 国际化处理： 全部成功*/
		title = title + statusStr;
		color = 'success';
	} else if (status == 2) {
		/* 国际化处理： 部分失败 */
		statusStr = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000053');/* 国际化处理： 部分失败*/
		title = title + statusStr;
		color = 'warning';
	}
	if (!content) {
		// content = '共' + operate + total + '条，';
		// content = content+'成功' + successNum + '条 ,';
		// content = content+ '失败' + failNum + '条';

		let gongStr = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000054');/* 国际化处理： 共*/
		let tiaoStr = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000055');/* 国际化处理： 条*/
		let cgStr = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000056');/* 国际化处理： 成功*/
		let sbStr = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000057');/* 国际化处理： 失败*/
		content =
			gongStr +/* 国际化处理： 共*/
			operate +
			total +
			tiaoStr +/* 国际化处理： 条*/
			',' +
			cgStr +/* 国际化处理： 成功*/
			successNum +
			tiaoStr +/* 国际化处理： 条*/
			',' +
			sbStr +/* 国际化处理： 失败*/
			failNum +
			tiaoStr;/* 国际化处理： 条*/
	}

	if (status == 1) {
		toast({
			duration: 6, // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
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
			TextArr: [
				// 提示框文字按钮，有内容展开收起和批量操作必输3个值
				// (第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭);

				/* 国际化处理： 展开 */
				// mutiInit.get('36320FDA--000113'),
				this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000058'),/* 国际化处理： 展开*/
				/* 国际化处理：收起 */
				// mutiInit.get('36320FDA--000114'),
				this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000059'),/* 国际化处理： 收起*/
				/* 国际化处理：我知道了 */
				// mutiInit.get('36320FDA--000115') ],
				this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000060')/* 国际化处理： 我知道了*/
			],
			//  没有需要展开内容的输入2个值，点击两个按钮都是关闭
			groupOperationMsg: message //数组的每一项，需要点击展开按钮显示的内容描述，非必输
		});
	}
};
export const OPERA_TYPE = {
	DELETE: 'DELETE',
	COMMIT: 'COMMIT',
	UNCOMMIT: 'UNCOMMIT',
	COMMANDSEND: 'COMMANDSEND',
	COMMANDCANCEL: 'COMMANDCANCEL',
	NULLIFY: 'NULLIFY',
	NULLIFYCANCEL: 'NULLIFYCANCEL'
};

/*sfNYjniBpROe6lptounUqwHP3qhHm+nexdfCE7ZuvSKpeEvbPqefNeO3OV1lllpk*/