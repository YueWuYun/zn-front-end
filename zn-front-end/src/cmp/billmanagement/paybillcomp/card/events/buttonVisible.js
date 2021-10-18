/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { ajax, base, toast } from 'nc-lightapp-front';
import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url
} from '../../cons/constant.js';
import appBase from "../../base";
const { cons, api } = appBase;

export const buttonVisible = function(props) {
	let status = props.getUrlParam('status');
	// browse ===false ,edit ===true
	let flag = status === 'browse' ? false : true;
	let billstatus = props.form.getFormItemsValue('head', 'bill_status');
	let pk_paybill= props.form.getFormItemsValue('head', 'pk_paybill');
	
	billstatus = billstatus && billstatus.value;
	let pasteflag = this.state.pasteflag || false;
	if (flag) {
		//编辑态
		props.button.setButtonVisible(
			[ 'save', 'saveadd', 'savecommit', 'canel', 'file' ],
			flag
		);
		props.button.setButtonVisible(
			[  'addline', 'delline', 'copyline' ],
			flag && !pasteflag
		);
		props.button.setButtonVisible(['CanelLine', 'CopyLineLast'], flag && pasteflag);
		props.button.setButtonVisible(
			[
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
				'confirm',
				'canelconfirm',
				'preview',
				'billQueryGroup',
				'Refresh'
			],
			!flag
		);
		props.form.setFormStatus('head', 'edit');
		props.cardTable.setStatus('paybilldetail_table', 'edit');
	}
	if (status === 'browse') {
		//控制重试按钮显示情况
        api.comm.showErrBtn(props, { headBtnCode: cons.card.btnHeadCode, headAreaCode: cons.card.headCode });
		if(!pk_paybill||!pk_paybill.value){
			this.props.button.setButtonVisible(
				[
					'delete',
					'confirm',
					'canelconfirm',
					'billQueryGroup',
					'linkquery',
					'billlinkquery',
					 'billquery',
					 'BillLQueryVoucher',
					 'billlinkquery',
					 'save', 
					 'saveadd', 
					 'savecommit',
					 'canel'
				],
				false
			);					
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			//this.props.button.setButtonVisible([ 'add' ], true);
          return ;
		}
		//浏览态固定显示
		props.button.setButtonVisible(
			[ 'billQueryGroup','linkquery','billlinkquery', 'billquery','Refresh' ],
			true
		);
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
				'CanelLine',
				'canel',
				'canelconfirm',
				'linkaprv',
				'confirm',
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
					//this.props.button.setButtonVisible([ 'delete', 'edit', 'back', 'submit' ], !flag);
					props.button.setButtonVisible([ 'billquery','billlinkquery','canelconfirm','billQueryGroup'], true);
					break;
				//待审批
				case '-1':
					props.button.setButtonVisible([ 'uncommit', 'billquery','billlinkquery','linkaprv'], true);
					break;
				//未确认
				case '9':
					props.button.setButtonVisible([ 'delete', 'confirm', 'billquery','billlinkquery' ], true);
					break;
				//审批通过
				case '1':
					props.button.setButtonVisible([ 'billlinkquery', 'billquery','linkaprv','BillLQueryVoucher' ], true);
					break;
				//签字
				case '8':
					props.button.setButtonVisible(
						[ 'billlinkquery', 'billquery', 'linkaprv', 'BillLQueryVoucher' ],
						true
					);
					break;
				//结算待定
				case '11':
					break;
			};
		
		}
		props.form.setFormStatus('head', status);
		props.cardTable.setStatus('paybilldetail_table', status);
	}
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag); //设置看片翻页的显隐性
};

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/