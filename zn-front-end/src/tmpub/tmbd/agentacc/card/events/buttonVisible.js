/*2+0Qf+roUlDHXBeA/o9JMGpngx6mRLzeeckBoa7ZnDExoDpVCBk7Msmh7CDdTbDQ*/
import { card_from_id, card_table_id } from '../../cons/constant.js';
const formId = card_from_id;
const tableId = card_table_id;

export const buttonVisible = function(props) {
	// //console.log('buttons', props.button.getButtons());
	let status = props.getUrlParam('status');
	let flag = status === 'browse' ? false : true;
    let pasteflag = this.state.pasteflag || false;//表体肩部按钮
    this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: !flag  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
    });
	//编辑态
	props.button.setButtonVisible([ 'Save', 'Cancel', 'AddbodyBtn', 'DeletebodyBtn', 'CopybodyBtn' ], flag);
	//浏览态显示
	props.button.setButtonVisible([ 'Add', 'Print', 'Enable', 'UnEnable', 'Delete', 'Modify', 'Confirm', 'Edit', 'UnConfirm', 'Reflesh', 'CancelPasteBtn','PastebodyLastBtn' ], !flag);
	//按照状态区分
	// billstatus 确认标识 0=未确认，1=已确认，2=变更待确认
	// enablestate 停用标志 1=未启用，2=已启用，3=已停用
	let enableBtn = false;
	let disableBtn = false;
	let billstatus = props.form.getFormItemsValue(formId, 'billstatus');
	billstatus = billstatus && billstatus.value;
	let enablestate = props.form.getFormItemsValue(formId, 'enablestate');
	enablestate = enablestate && enablestate.value;
	if (enablestate === '2') {
		disableBtn = true;
	}
	else if (enablestate === '3') {
		enableBtn = true;
	}
	let bodyRows = [];
	if (!flag) {
		bodyRows = props.cardTable.getVisibleRows(tableId);
	}
	else {
		props.button.setButtonVisible([ 'AddbodyBtn', 'DeletebodyBtn', 'CopybodyBtn' ], !pasteflag);
		props.button.setButtonVisible([ 'CancelPasteBtn','PastebodyLastBtn' ], pasteflag);
	}
	for (let row of bodyRows) {
		let bodyEnable = row.values.enablestate;
		if (!disableBtn && (bodyEnable && bodyEnable.value) === '2') {
			disableBtn = true;
		}
		else if (!enableBtn && (bodyEnable && bodyEnable.value) === '3') {
			enableBtn = true;
		}
	}
	let buttonAry = [];

	if (billstatus === '0' && !flag) {
		buttonAry.push('Add');
		buttonAry.push('Edit');
		buttonAry.push('Delete');
		buttonAry.push('Confirm');
	}

	else if (billstatus === '1' && !flag) {
		buttonAry.push('Add');
		buttonAry.push('Modify');
		buttonAry.push('UnConfirm');
		if (enableBtn) {
			buttonAry.push('Enable');
		}
		if (disableBtn) {
			buttonAry.push('UnEnable');
		}
	}

	else if (billstatus === '2' && !flag) {
		buttonAry.push('Add');
		buttonAry.push('Modify');
		buttonAry.push('Confirm');
	}

	if(buttonAry.length>0){
        props.button.setButtonVisible(['Add', 'Modify', 'Enable', 'UnEnable', 'Confirm','Edit','Delete','UnConfirm', 'CancelPasteBtn','PastebodyLastBtn' ], flag);
        props.button.setButtonVisible(buttonAry, true);
    }
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag); //设置卡片翻页的显隐性
	//设置次要按钮
	props.button.setMainButton(['Add'],false);
	
	//设置字段的浏览和编辑状态
	let editStatus = status === 'browse' ? 'browse' : 'edit';
	props.form.setFormStatus(formId, editStatus);
	props.cardTable.setStatus(tableId, editStatus);
};

/*2+0Qf+roUlDHXBeA/o9JMGpngx6mRLzeeckBoa7ZnDExoDpVCBk7Msmh7CDdTbDQ*/