/*sfNYjniBpROe6lptounUqwHP3qhHm+nexdfCE7ZuvSKpeEvbPqefNeO3OV1lllpk*/
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
	let operate = '';
	// let mutiInit = that.props.MutiInit.getIntl("36320FDA");
	if (op === 'DELETE') {
		/* 国际化处理： 删除 */
		// operate = '删除';
		// operate = mutiInit.get('36320FDA--000099');
		operate = this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000005');/* 国际化处理： 删除*/
	}else if(op === 'BACK'){
		/* 国际化处理： 退回 */
		// operate = mutiInit.get('36320FDA--000100');
		operate = this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000022');/* 国际化处理： 退回*/
	}else if(op === 'pay'){
		// 国际化处理： 支付
		// operate = mutiInit.get('36320FDA--000101');
		operate = this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000023');/* 国际化处理： 支付*/
	}else if(op === 'unpay'){
		// 国际化处理： 取消支付
		// operate = mutiInit.get('36320FDA--000102');
		operate = this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000024');/* 国际化处理： 取消支付*/
	}else if(op === 'commit'){
		// 国际化处理： 提交
		// operate = mutiInit.get('36320FDA--000103');
		operate = this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000025');/* 国际化处理： 提交*/
	}else if(op === 'uncommit'){
		// 国际化处理： 收回
		// operate = mutiInit.get('36320FDA--000104');
		operate = this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000026');/* 国际化处理： 收回*/
	}
	/* 国际化处理：完毕， */
	// let title = operate + mutiInit.get('36320FDA--000105');
	let title = operate + this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000027')/* 国际化处理： 完毕*/
	let color = 'success';

	if (status == 0) {
		/* 国际化处理：全部失败 */
		// title = title + '全部失败';
		// title = title + mutiInit.get('36320FDA--000106');
		title = title + this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000028')/* 国际化处理： 全部失败*/
		color = 'danger';
	}
	else if (status == 1) {
		/* 国际化处理：全部成功 */
		// title = title + '全部成功';
		// title = title + mutiInit.get('36320FDA--000107');
		title = title + this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000029')/* 国际化处理： 全部成功*/
		color = 'success';
	}
	else if (status == 2) {
		/* 国际化处理： 部分失败 */
		// title = title+ '部分失败';
		// title = title + mutiInit.get('36320FDA--000108');
		title = title + this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000030')/* 国际化处理： 部分失败*/
		color = 'warning';
	}
	if (!content) {
		// content = '共' + operate + total + '条，';
		// content = content+'成功' + successIndex + '条 ,';
		// content = content+ '失败' + failIndex + '条';

		/* 国际化处理：共 */
		// content = mutiInit.get('36320FDA--000109')
		content = this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000031')/* 国际化处理： 共*/
		+ operate + total
		/* 国际化处理：条 */
		// + mutiInit.get('36320FDA--000110')
		+this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000032')/* 国际化处理： 条*/
		+','
		/* 国际化处理：成功 */
		// + mutiInit.get('36320FDA--000111') 
		+this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000033')/* 国际化处理： 成功*/
		+ successIndex
		/* 国际化处理：条 */
		// + mutiInit.get('36320FDA--000110')
		+this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000032')/* 国际化处理： 条*/
		+','
		/* 国际化处理：失败 */
		// + mutiInit.get('36320FDA--000112')
		+this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000034')/* 国际化处理： 失败*/
		+ failIndex 
		/* 国际化处理：条 */
		// + mutiInit.get('36320FDA--000110');
		+this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000032')/* 国际化处理： 条*/
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
				this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000035'),/* 国际化处理： 展开*/
				/* 国际化处理：收起 */
				// mutiInit.get('36320FDA--000114'),
				this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000036'),/* 国际化处理： 收起*/
				/* 国际化处理：我知道了 */
				// mutiInit.get('36320FDA--000115') ], 
				this.props.MutiInit.getIntl("36180RBRAppr") && this.props.MutiInit.getIntl("36180RBRAppr").get('36180RBRAppr-000037')],/* 国际化处理： 我知道了*/
			//  没有需要展开内容的输入2个值，点击两个按钮都是关闭
			groupOperationMsg: message //数组的每一项，需要点击展开按钮显示的内容描述，非必输
		});
	}
};

/*sfNYjniBpROe6lptounUqwHP3qhHm+nexdfCE7ZuvSKpeEvbPqefNeO3OV1lllpk*/