//oICVasQrIWqSHQSq91EX9+jkEqeFTHliKC3qPnVHIQcC2i49DvAEiO1PaJKmFg+F
/*
 * @Author: liuqip 
 * @PageInfo: 取消按钮实现 
 * @Date: 2018-04-24 13:48:09 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-01-10 13:36:40
 */
import { showCancelDialog } from '../../../pub/tool/messageUtil.js';
import { search_BtnClick } from './index';
import { buttonControl } from '../viewController/buttonController';
export default function cancel_BtnClick(props) {
	// 弹出确认取消的框
	showCancelDialog({
		beSureBtnClick: beSure_BtnClick.bind(this, this.props)
	});
}

function beSure_BtnClick(props) {
	//设为浏览态并且重新查询
	// props.editTable.setStatus(this.headTableid, STATUS.browse);
	// props.editTable.setStatus(this.bodyTableid, STATUS.browse);
	setTimeout(() => {
		props.editTable.cancelEdit(this.headTableid);
		props.editTable.cancelEdit(this.bodyTableid);
		search_BtnClick.call(this, props);
		buttonControl.call(this, props);
	}, 0);
}

//oICVasQrIWqSHQSq91EX9+jkEqeFTHliKC3qPnVHIQcC2i49DvAEiO1PaJKmFg+F