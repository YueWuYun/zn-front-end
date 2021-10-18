/*PUZNotE2kHjTyeu8+BtTOJo0Snz5+oev51O/gzoSeD6iw+qP3+KDR7fckITDhsUp*/
import { toast } from 'nc-lightapp-front';
/**
 * 展开行
 * @param {*} operate 结算列表提示信息
 * @param {*} state 操作状态 0：全部失败 2部分失败 1：全部成功
 * @param {*} successIndex 成功条数 []
 * @param {*} failIndex  失败条数 []
 * @param {*} Message  错误信息 ，传递错误信息数据  []
 * @param {*} content 提示内容,可以自己定义 不定义则方法固定生成[可以不传递]
 */
export const NewBatchToast = function (operate, total, successIndex, failIndex, Message, content) {

	let title = operate + (this.props.MutiInit.getIntl("360704SM") &&
		this.props.MutiInit.getIntl("360704SM").get('360704SM-000075'));
	let color = 'success';

	if (total == failIndex) {
		// title = title + '全部失败';
		title = title + (this.props.MutiInit.getIntl("360704SM") &&
			this.props.MutiInit.getIntl("360704SM").get('360704SM-000093'));
		color = 'danger';
	}
	if (total == successIndex) {
		// title = title + '全部成功';
		title = title + (this.props.MutiInit.getIntl("360704SM") &&
			this.props.MutiInit.getIntl("360704SM").get('360704SM-000092'));
		color = 'success';
	}
	if (total > successIndex && total > failIndex) {
		// title = title + '部分失败';
		title = title + (this.props.MutiInit.getIntl("360704SM") &&
			this.props.MutiInit.getIntl("360704SM").get('360704SM-000096'));
		color = 'warning';
	}
	if (!content) {
		// content = '共' + operate + total + '条,';
		// content = content + '成功' + successIndex + '条 ,';
		// content = content + '失败' + failIndex + '条';
		content = (this.props.MutiInit.getIntl("360704SM") &&
			this.props.MutiInit.getIntl("360704SM").get('360704SM-000097')) + operate + total +
			(this.props.MutiInit.getIntl("360704SM") &&
				this.props.MutiInit.getIntl("360704SM").get('360704SM-000091'));
		content = content +
			(this.props.MutiInit.getIntl("360704SM") &&
				this.props.MutiInit.getIntl("360704SM").get('360704SM-000098')) +
			successIndex +
			(this.props.MutiInit.getIntl("360704SM") &&
				this.props.MutiInit.getIntl("360704SM").get('360704SM-000091'));
		content = content +
			(this.props.MutiInit.getIntl("360704SM") &&
				this.props.MutiInit.getIntl("360704SM").get('360704SM-000099'))
			+ failIndex +
			(this.props.MutiInit.getIntl("360704SM") &&
				this.props.MutiInit.getIntl("360704SM").get('360704SM-000091'));
	}

	if (total == successIndex) {//全部成功
		toast({
			// duration: 'infinity', // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: color, // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容，批量操作要输入,非必输
			groupOperation: true //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
		});

	} else {
		toast({
			// duration: 'infinity', // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
			color: color, // 提示类别，默认是 "success",非必输
			title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
			content: content, // 提示内容，批量操作要输入,非必输
			groupOperation: false, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
			TextArr: [
				(this.props.MutiInit.getIntl("360704SM") &&
					this.props.MutiInit.getIntl("360704SM").get('360704SM-000084')),
				(this.props.MutiInit.getIntl("360704SM") &&
					this.props.MutiInit.getIntl("360704SM").get('360704SM-000085')),
				(this.props.MutiInit.getIntl("360704SM") &&
					this.props.MutiInit.getIntl("360704SM").get('360704SM-000086'))
			], //提示框文字按钮，有内容展开收起和批量操作必输3个值(第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭);
			//  没有需要展开内容的输入2个值，点击两个按钮都是关闭
			groupOperationMsg: Message, //数组的每一项，需要点击展开按钮显示的内容描述，非必输
			// onClose: refresh.bind(this) // 关闭按钮的回调函数,非必输
		});
	}
};

/*PUZNotE2kHjTyeu8+BtTOJo0Snz5+oev51O/gzoSeD6iw+qP3+KDR7fckITDhsUp*/