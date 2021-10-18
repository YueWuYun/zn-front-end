/*d6Z8ZWDvNnjqjuGgR7RR3gulOpK8l1x5jaEu3/G6wBzCWdS2bEimMGtCU7mBNL9D*/
import { toast } from 'nc-lightapp-front';

/**
 * 展开行
 * @param {*} operate DELETE,COMMIT，UNCOMMIT
 * @param {*} state 操作状态 0：全部失败 2部分失败 1：全部成功
 * @param {*} successIndex 成功行号 []
 * @param {*} failIndex  失败行号  []
 * @param {*} Message  错误信息   []
 * @param {*} content 提示内容,可以自己定义 不定义则方法固定生成
 */
export const BatchToast = function (op, status, total, successIndex, failIndex, message, content, that) {
	let operate = '';
	let mutiInit = that.props.MutiInit.getIntl("36320AATF");
	if (op === 'DELETE') {
		operate = mutiInit.get('36320AATF-000017');//删除
	} else if (op === 'BACK') {
		operate = mutiInit.get('36320AATF-000075');//退回
	} else if (op === 'pay') {
		operate = mutiInit.get('36320AATF-000037');//支付
	} else if (op === 'unpay') {
		operate = mutiInit.get('36320AATF-000098');//取消支付
	} else if (op === 'commit') {
		operate = mutiInit.get('36320AATF-000072');//提交
	} else if (op === 'uncommit') {
		operate = mutiInit.get('36320AATF-000073');//提交
	}
	let title = operate + mutiInit.get('36320AATF-000099');//完毕
	let color = 'success';

	if (status == 0) {
		title = title + mutiInit.get('36320AATF-000100');//全部失败
		color = 'danger';
	}
	else if (status == 1) {
		title = title + mutiInit.get('36320AATF-000101');//全部成功
		color = 'success';
	}
	else if (status == 2) {
		title = title + mutiInit.get('36320AATF-000102');//部分失败
		color = 'danger';
	}
	if (!content) {
		//共多少条，成功--条，失败--条
		content = mutiInit.get('36320AATF-000103') + operate + total +mutiInit.get('36320AATF-000104');
		content = content + mutiInit.get('36320AATF-000105') + successIndex + mutiInit.get('36320AATF-000104');
		content = content + mutiInit.get('36320AATF-000106') + failIndex + mutiInit.get('36320AATF-000109');
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
				mutiInit.get('36320AATF-000107'), //展开
				mutiInit.get('36320AATF-000108'),  //收起
				mutiInit.get('36320AATF-000112'),  //我知道了
			],
			//  没有需要展开内容的输入2个值，点击两个按钮都是关闭
			groupOperationMsg: message //数组的每一项，需要点击展开按钮显示的内容描述，非必输<必须为数组>
		});
	}
};

/*d6Z8ZWDvNnjqjuGgR7RR3gulOpK8l1x5jaEu3/G6wBzCWdS2bEimMGtCU7mBNL9D*/