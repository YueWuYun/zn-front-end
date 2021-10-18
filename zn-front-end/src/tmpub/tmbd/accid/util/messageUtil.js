/*sfNYjniBpROe6lptounUq0lBew5EUWsJEJXO8Id6BRiE4DNxPr/9HvlB9IlcuTXY*/
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
export const BatchToast = function(op, status, total, successIndex, failIndex, message, content, that) {
	let mutiInit = that.props.MutiInit.getIntl("36010IACC");
	let operate = '';
	if (op === 'DELETE') {
		/* 国际化处理： 删除 */
		// operate = '删除';
		operate = mutiInit.get('36010IACC--000053');
	}else if(op === 'BACK'){
		/* 国际化处理： 退回 */
		operate = mutiInit.get('36010IACC--000054');
	}
	/* 国际化处理： 完毕， */
	let title = operate + mutiInit.get('36010IACC--000055');;
	let color = 'success';

	if (status == 0) {
		/* 国际化处理： 全部失败 */
		title = title + mutiInit.get('36010IACC--000056');;
		color = 'danger';
	}
	else if (status == 1) {
		/* 国际化处理： 全部成功 */
		title = title + mutiInit.get('36010IACC--000057');;
		color = 'success';
	}
	else if (status == 2) {
		/* 国际化处理： 部分失败 */
		title = title+ mutiInit.get('36010IACC--000058');;
		//应测试要求，部分成功也为danger
		color = 'danger';
	}
	if (!content) {
		/* 国际化处理： 共 */ 	/* 国际化处理： 条 */ 
		content = mutiInit.get('36010IACC--000059') + operate + total
		 + mutiInit.get('36010IACC--000060')+', '
		/* 国际化处理： 成功 */ 	/* 国际化处理： 条 */ 
		 + mutiInit.get('36010IACC--000061') + successIndex
		 + mutiInit.get('36010IACC--000060')+','
		/* 国际化处理： 失败 */ 	/* 国际化处理： 条 */ 
		 + mutiInit.get('36010IACC--000062') + failIndex
		 + mutiInit.get('36010IACC--000060');
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
				/* 国际化处理： 展开 */
				mutiInit.get('36010IACC--000063'),
				/* 国际化处理： 收起 */
				mutiInit.get('36010IACC--000064'),
				/* 国际化处理：我知道了 */
				mutiInit.get('36010IACC--000065')
			], //提示框文字按钮，有内容展开收起和批量操作必输3个值(第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭);
			//  没有需要展开内容的输入2个值，点击两个按钮都是关闭
			groupOperationMsg: message //数组的每一项，需要点击展开按钮显示的内容描述，非必输
		});
	}
};

/*sfNYjniBpROe6lptounUq0lBew5EUWsJEJXO8Id6BRiE4DNxPr/9HvlB9IlcuTXY*/