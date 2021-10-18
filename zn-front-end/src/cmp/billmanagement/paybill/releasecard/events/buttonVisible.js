/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { ajax, base, toast } from 'nc-lightapp-front';
import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url,
	list_page_url,
	card_page_url
} from '../../cons/constant.js';
import appBase from "../../base";
const { cons, api } = appBase;

export const buttonVisible = function(props) {
	console.log('buttons', props.button.getButtons());
	let status = props.getUrlParam('status');

	// browse ===false ,edit ===true
	let flag = status === 'browse' ? false : true;
	let billstatus = props.form.getFormItemsValue('head', 'bill_status');
	let bill_no= props.form.getFormItemsValue('head', 'bill_no');
	let pk_paybill= props.form.getFormItemsValue('head', 'pk_paybill');
	let is_cf= props.form.getFormItemsValue('head', 'is_cf');
	billstatus = billstatus && billstatus.value;
	//浏览态固定显示
	//控制重试按钮显示情况
	api.comm.showErrBtn(props, { headBtnCode: cons.card.btnHeadCode, headAreaCode: cons.card.headCode });

	if (flag) {
		//编辑态
		props.button.setButtonVisible(
			[ 'save', 'saveadd', 'savecommit', 'cancel', 'file','quitBtn' ],
			flag
		);
		props.button.setButtonVisible(
			[  'addline', 'delline', 'copyline' ],
			true
		);

		props.button.setButtonVisible(
			[
				'tradetype',
				'commit',
				'edit',
				'delete',
				'uncommit',
				'edit',
				'delete',
				'copy',
				'moreopr',
				'BaseImagegroup',
				'Associate',
				'add',
				'Refresh',
				'preview'
			],
			!flag
		);

		props.form.setFormStatus('head', 'edit');
		props.cardTable.setStatus('paybilldetail_table', 'edit');
	}
	if (status === 'browse') {
		props.button.setButtonVisible(
			[ 'add','copy', 'tradetype', 'Associate', 'BaseImagegroup', 'moreopr', 'Refresh' ],
			!flag
		);
		props.button.setButtonVisible([ 'quitBtn'],true);
	
		//初始化隐藏
		props.button.setButtonVisible(
			[
				'commit',
				'uncommit',
				'edit',
				'delete',
				'save',
				'saveadd',
				'savecommit',
				'cancel',
				'file',
				'addline',
				'delline',
				'copyline',
				'reverse',
				'makebill',
				'BillLQueryVoucher',
				'billlinkquery',
				'billquery',
				'linkplanbudget',
				'preview',
				'CancelLine',
				'CopyLineLast'
			],
			false
		);

		//浏览根据状态控制
		if (!flag) {
			switch (billstatus) {
				//保存
				case '-10':
				if(is_cf&&is_cf.value){
					props.button.setButtonVisible([ 'edit', 'commit', 'billquery', 'linkplanbudget' ], true);
				}else{
					props.button.setButtonVisible([ 'edit', 'delete', 'commit', 'billquery', 'linkplanbudget' ], true);
				}
					
					break;
				//待审批
				case '-1':
					props.button.setButtonVisible([ 'uncommit', 'billquery', 'linkplanbudget','uncommit'], true);
					break;
				//未确认
				case '9':
					props.button.setButtonVisible([ 'billlinkquery' ], true);
					break;
				//审批通过
				case '1':
					props.button.setButtonVisible(['uncommit' ,'billlinkquery', 'billquery', 'linkplanbudget'], true);
					break;
				//签字
				case '8':
					props.button.setButtonVisible(
						[ 'BillLQueryVoucher', 'billlinkquery', 'billquery', 'linkplanbudget', 'reverse', 'makebill' ],
						true
					);
					break;
				//结算待定
				case '-99':
				    if(is_cf&&is_cf.value){
						props.button.setButtonVisible([ 'billquery' ], true);
					}else{
						props.button.setButtonVisible([ 'edit', 'delete', 'billquery' ], true);
					}
					//this.props.button.setButtonVisible([ 'delete', 'edit', 'back', 'submit' ], !flag);
				
					break;
					default:
			        break;
			}
		}
		props.form.setFormStatus('head', status);
		props.cardTable.setStatus('paybilldetail_table', status);
	}
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag); //设置看片翻页的显隐性
};

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/