/*sfNYjniBpROe6lptounUq0lBew5EUWsJEJXO8Id6BRiE4DNxPr/9HvlB9IlcuTXY*/
import { toast } from 'nc-lightapp-front';

/**
 * 展开行
 * @param {*} op DELETE,COMMIT，UNCOMMIT
 * @param {*} status 操作状态 0：全部失败 2部分失败 1：全部成功
 * @param {*} total 总条数
 * @param {*} successIndex 成功行号 []
 * @param {*} failIndex  失败行号  []
 * @param {*} Message  错误信息   []
 * @param {*} content 提示内容,可以自己定义 不定义则方法固定生成
 */
export const BatchToast = function(op, status, total, successIndex, failIndex, message, content) {
	let operate = '';

	if (op === 'DELETE') {
		let tempString = this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000045');
		operate = 	tempString/* 国际化处理： 删除*/
	}
	let title = this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000046');	/* 国际化处理： 完毕，*/
	title = operate + title;
	let color = 'success';

	if (status == 0) {
		let tempString = this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000047');
		title = title + tempString	/* 国际化处理： 全部失败*/
		color = 'danger';
	}
	else if (status == 1) {
		let tempString = this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000048');
		title = title + tempString	/* 国际化处理： 全部成功*/
		color = 'success';
	}
	else if (status == 2) {
		let tempString = this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000049');
		title = title + tempString	/* 国际化处理： 部分失败*/
		color = 'warning';
	}
	if (!content) {
		let tempString1 = this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000050');
		let tempString2 = this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000051');
		let tempString3 = this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000052');
		let tempString4 = this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000051');
		let tempString5 = this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000053');
		let tempString6 = this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000054');
		content = tempString1 + operate + total + tempString2;
		content = content + tempString3 + successIndex + tempString4;
		content = content + tempString5 + failIndex + tempString6;
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
				this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000055'), 
				this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000056'), 
				this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000057')
			], //提示框文字按钮，有内容展开收起和批量操作必输3个值(第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭);
			//  没有需要展开内容的输入2个值，点击两个按钮都是关闭
			groupOperationMsg: message //数组的每一项，需要点击展开按钮显示的内容描述，非必输
		});
	}
};

/*sfNYjniBpROe6lptounUq0lBew5EUWsJEJXO8Id6BRiE4DNxPr/9HvlB9IlcuTXY*/