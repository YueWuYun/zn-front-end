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
	console.log('buttons', props.button.getButtons());
	let status = props.getUrlParam('status');

	// browse ===false ,edit ===true
	let flag = status === 'browse' ? false : true;
	let billstatus = props.form.getFormItemsValue('head', 'bill_status');
	billstatus = billstatus && billstatus.value;
	// if (flag) {
	// 	//编辑态
	// 	props.button.setButtonVisible(
	// 		[ 'save', 'saveadd', 'savecommit', 'cancel', 'file', 'addline', 'delline', 'copyline' ],
	// 		flag
	// 	);
	// 	props.button.setButtonVisible(
	// 		[
	// 			'tradetype',
	// 			'commit',
	// 			'edit',
	// 			'delete',
	// 			'uncommit',
	// 			'edit',
	// 			'delete',
	// 			'copy',
	// 			'moreopr',
	// 			'BaseImagegroup',
	// 			'Associate',
	// 			'add'
	// 		],
	// 		!flag
	// 	);
	// 	props.form.setFormStatus('head', 'edit');
	// 	props.cardTable.setStatus('paybilldetail_table', 'edit');
	// }
	//if (status === 'browse') {
		//浏览态固定显示
		props.button.setButtonVisible(
			[ 'add', 'copy', 'tradetype', 'Associate', 'BaseImagegroup',  'Refresh' ],
			false
		);
		
		//控制重试按钮显示情况
		api.comm.showErrBtn(props, { 
			headBtnCode: cons.card.btnHeadCode,
			headAreaCode: cons.card.headCode ,
			fieldPK: cons.field.pk,
			datasource: cons.comm.dataSource
		});
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
				'moreopr'

			],
			false
		);

		//浏览根据状态控制
		//if (!flag) {

			props.button.setButtonVisible([ 'linkquery', 'linkquerybill', 'linkplanbudget',
				'printgroup', 'printbtn','output','BaseImageShow','BaseImageScan','BaseImage','BaseImageGroup',
			 'file' ], true);
			// switch (billstatus) {
			// 	//保存
			// 	case '-10':
			// 		//this.props.button.setButtonVisible([ 'delete', 'edit', 'back', 'submit' ], !flag);
			// 		props.button.setButtonVisible([ 'edit', 'delete', 'commit', 'billquery', 'linkplanbudget' ], true);
			// 		break;
			// 	//待审批
			// 	case '-1':
			// 		props.button.setButtonVisible([ 'uncommit', 'billquery', 'linkplanbudget' ], true);
			// 		break;
			// 	//未确认
			// 	case '9':
			// 		props.button.setButtonVisible([ 'billlinkquery' ], true);
			// 		break;
			// 	//审批通过
			// 	case '1':
			// 		props.button.setButtonVisible([ 'billlinkquery', 'billquery', 'linkplanbudget' ], true);
			// 		break;
			// 	//签字
			// 	case '8':
			// 		props.button.setButtonVisible(
			// 			[ 'BillLQueryVoucher', 'billlinkquery', 'billquery', 'linkplanbudget', 'reverse', 'makebill' ],
			// 			true
			// 		);
			// 		break;
			// 	//结算待定
			// 	case '11':
			// 		break;
			// }
		//}
		//props.form.setFormStatus('head', status);
		//props.cardTable.setStatus('paybilldetail_table', status);
	//}
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置看片翻页的显隐性
};

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/