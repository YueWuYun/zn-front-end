/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { ajax, base, toast } from 'nc-lightapp-front';
import appBase from "../../base";
const { cons, api } = appBase;

export const buttonVisible = function(props) {
	let status = props.getUrlParam('status');
	let src = props.getUrlParam('src');
	// browse ===false ,edit ===true
	let flag = status === 'browse' ? false : true;
	let billstatus = props.form.getFormItemsValue('head', 'bill_status');
	let opr=this.props.getUrlParam('op') ;
	let pk_paybill = props.form.getFormItemsValue('head', 'pk_paybill');
	let is_cf = props.form.getFormItemsValue('head', 'is_cf');
	let isfromindependent = props.form.getFormItemsValue('head', 'isfromindependent');
	let showCfBtn=this.showCfBtn();
	billstatus = billstatus && billstatus.value;
	let pasteflag = this.state.pasteflag || false;
	//控制重试按钮显示情况
	api.comm.showErrBtn(props, { 
		headBtnCode: cons.card.btnHeadCode,
		headAreaCode: cons.card.headCode ,
		fieldPK: cons.field.pk,
		datasource: cons.comm.dataSource
	});
	if (flag) {
		//编辑态
		props.button.setButtonVisible([ 'save', 'saveadd', 'savecommit', 'cancel' ], flag);
		props.button.setButtonVisible([ 'addline', 'delline', 'copyline' ], flag && !pasteflag);

		props.button.setButtonVisible([ 'CancelLine', 'CopyLineLast' ], flag && pasteflag);
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
				'preview',
				'makebill',
				'reverse',
				'printbtn',
				'print',
				'output',
				'billQueryGroup',
				'unprotopay',
				'protopay',
				'linkaprv',
				'file',
				'linkprintbtn',
				'linkprint',
				'linkoutput',
				'elecinvoice'
			],
			!flag
		);
		this.props.button.setButtonVisible(
			[
				'LinkImageGroup',
				'LinkImageShow',
				'LinkImageScan',
				'LinkImage'
			],
			false
		);

		// props.form.setFormStatus('head', 'edit');
		// props.cardTable.setStatus('paybilldetail_table', 'edit');
	}
	if (status === 'browse') {
		if(opr&&opr=='cancel'){
			//设置按钮
			this.props.button.setButtonVisible(
				[
					'save',
					'saveadd',
					'savecommit',
					'cancel',
					'file',
					'addline',
					'delline',
					'copyline',
					'printbtn',
					'output',
					'linkprintbtn',
					'linkprint',
					'linkoutput',
					'elecinvoice'
				],
				false
			);
				//设置按钮
			this.props.button.setButtonVisible([ 'add' ], true);
           return
	   }

		if (props.getUrlParam('scene')&&props.getUrlParam('scene')!='bz') {
			this.props.button.setButtonVisible(
				[
					'copy',
					'Associate',
					'edit',
					'delete',
					'commit',
					'uncommit',
					'unprotopay',
					'protopay',
					'add',
					'makebill',
					'Associate',
					'Associategroup',
					'reverse',
					'elecinvoice'
				],
				false
			);
			this.props.button.setButtonVisible(
				[
					'save',
					'saveadd',
					'savecommit',
					'cancel',
					'addline',
					'delline',
					'copyline',
					'copy',
					'CopyAtLine',
					'CancelLine',
					'moreopr',
					'CopyLineLast'
				],
				false
			);
			if(props.getUrlParam('scene')&&props.getUrlParam('scene')=='zycl'){

				this.props.button.setButtonVisible(
					[
						'LinkImageGroup',
						'LinkImageShow',
						'LinkImageScan',
						'LinkImage',
						'Refresh'
					],
					true
				);

			}
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			return;
		}

		if (!pk_paybill || !pk_paybill.value) {
			this.props.button.setButtonVisible(
				[
					'copy',
					'Associate',
					'edit',
					'delete',
					'commit',
					'uncommit',
					'BaseImagegroup',
					'moreopr',
					'Refresh',
					'unprotopay',
					'protopay',
					'billQueryGroup',
					'printbtn',
					'output',
					'linkprintbtn',
				    'linkprint',
					'linkoutput',
					'elecinvoice'
				],
				false
			);
			this.props.button.setButtonVisible(
				[
					'LinkImageGroup',
					'LinkImageShow',
					'LinkImageScan',
					'LinkImage'
				],
				false
			);
			this.props.button.setButtonVisible(
				[
					'save',
					'saveadd',
					'savecommit',
					'cancel',
					'file',
					'addline',
					'delline',
					'copyline',
					'printbtn',
					'output'
				],
				false
			);
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			this.props.button.setButtonVisible([ 'add' ], true);
			return;
		}
		//浏览态固定显示
		props.button.setButtonVisible(
			[
				'add',
				'copy',
				'tradetype',
				'Associate',
				'Associategroup',
				'BaseImagegroup',
				'printbtn',
				'print',
				'output',
				'moreopr',
				'Refresh',
				'otherfunction',
				'filemore'
			],
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
				'preview',
				'CancelLine',
				'CopyLineLast',
				'unprotopay',
				'protopay',
				'linkaprv',
				'unassociate',
				'linkprintbtn',
				'linkprint',
				'linkoutput',
				'elecinvoice'
			],
			false
		);
		this.props.button.setButtonVisible(
			[
				'LinkImageGroup',
				'LinkImageShow',
				'LinkImageScan',
				'LinkImage'
			],
			false
		);

		//浏览根据状态控制
		if (!flag) {
			switch (billstatus) {
				//保存
				case '-10':
					props.button.setButtonVisible(
						[ 'edit', 'commit', 'billquery', 'linkplanbudget', 'billlinkquery', 'linkReceipt'],
						true
					);
					if(this.state.showElec){
					props.button.setButtonVisible(
						[ 'elecinvoice'],
						true
					)}
					if (is_cf && is_cf.value) {
						props.button.setButtonVisible([ 'unprotopay' ], true);
					} else {
						props.button.setButtonVisible([ 'delete' ], true);
					}
					if (isfromindependent && isfromindependent.value === '1') {
						props.button.setButtonVisible([ 'unassociate' ], true);
					}
					break;
				//待审批
				case '-1':
					props.button.setButtonVisible(
						[
							'uncommit',
							'billquery',
							'linkplanbudget',
							'uncommit',
							'billlinkquery',
							'linkReceipt',
							'linkaprv'
						],
						true
					);
					break;
				//未确认
				case '9':
					props.button.setButtonVisible([ 'billlinkquery', 'linkReceipt' ], true);
					break;
				case '2':
					props.button.setButtonVisible(
						[ 'billlinkquery', 'billquery', 'linkplanbudget', 'linkaprv', 'linkReceipt' ],
						true
					);
					break;

				//审批通过
				case '1':
					props.button.setButtonVisible(
						[ 'uncommit', 'billlinkquery', 'billquery', 'linkplanbudget', 'linkaprv', 'linkReceipt' ],
						true
					);
					break;
				//签字
				case '8':
					props.button.setButtonVisible(
						[
							'BillLQueryVoucher',
							'billlinkquery',
							'billquery',
							'linkplanbudget',
							'reverse',
							'makebill',
							'linkaprv',
							'linkReceipt'
						],
						true
					);
					break;
				//结算待定
				case '-99':
					if (is_cf && is_cf.value) {
						props.button.setButtonVisible([ 'billquery', 'protopay' ], true);
					   
						if(showCfBtn){
							props.button.setButtonVisible(['protopay'], false);
							props.button.setButtonVisible(['edit'], true);
						}
						
					} else {
						props.button.setButtonVisible([ 'edit', 'delete', 'billquery' ], true);
					}
					if (isfromindependent && isfromindependent.value === '1') {
						props.button.setButtonVisible([ 'unassociate' ], true);
					}
					break;
				default:
					break;
			}
		}
	}

	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag); //设置看片翻页的显隐性
	if (src) {
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置看片翻页的显隐性
	}
};

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/