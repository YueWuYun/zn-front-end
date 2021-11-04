//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
	createPage,
	ajax,
	base,
	toast,
	high,
	cardCache,
	promptBox,
	getBusinessInfo,
	getMultiLang,
	createPageIcon,
	print
} from 'nc-lightapp-front';
import { URL, FIELD, PAGECODE, AREA } from '../constance';
import PowerTable from '../excomponents/power';
import { RownoUtils } from '../../utils/cardTools/RownoUtil';
import { rowCopyPasteUtils } from '../../utils/cardTools/rowCopyPasteUtils';
import { showBatchOprMessage, showWarningDialog } from '../../public/tools/messageUtil';
import { updateCacheDataForList } from '../../public/tools/cacheTools';
import { initLang, getLangByResId } from '../../public/tools/multiLangUtil';
import AssignModal from '../excomponents/assign/AssignModal';
import deepClone from '../../../public/utils/deepClone'
const { NCAffix, NCPopconfirm, NCFormControl, NCBackBtn } = base;
const { PrintOutput, ApproveDetail } = high;
const {
	addCache,
	getCacheById,
	updateCache,
	getCurrentLastId,
	getNextId,
	deleteCacheById,
	getDefData,
	setDefData
} = cardCache;

const dataSource = 'mmbd.bom.bom0202.data';
const tableId = 'psgcardb';
const searchId = 'search'; //查询区id
const queryCardUrl = '/nccloud/mmbd/psg/querycard.do'; //卡片查询url
const saveUrl = '/nccloud/mmbd/psg/addsave.do'; //新增保存
const updateUrl = '/nccloud/mmbd/psg/update.do'; //修改保存
const deleteUrl = '/nccloud/mmbd/psg/delete.do'; //删除
const pk_item = 'pk_planstrategygroup'; //单据主键--用于卡片查询刷新
const childValues = 'pk_taxregions';
const printUrl = '/nccloud/uapbd/taxregion/printTaxregion.do';

//切换页面状态
function toggleShow(props, enableState = 2) {
	let status = props.getUrlParam('status');
	if(status == null){
		props.addUrlParam({'status':'browse'})
	}
	let flag = status === 'browse' ? false : true;
	//按钮的显示状态
	let visibleButtons = [];
	let unvisibleButtons = [];
	if (status == 'edit' || status == 'add') {
		if (props.getUrlParam('reviseEdit')) {
			unvisibleButtons = [
				'Edit',
				'EditGroup',
				'ReviseEdit',
				'Add',
				'Return',
				'Delete',
				'Commit',
				'UnCommit',
				'Assign',
				'Unassign',
				'Default',
				'CancelDefault',
				'Refresh',
				'Enable',
				'Disable',
				'Print',
				'Output',
				'PasteLineEnd',
				'CancelPaste',
				'PasteHere',
				'Copy',
				'SaveCommit',
				'AddLine',
				'DelLine',
				'ResetRow',
				'CopyLine',
				'OutputsPasteHere',
				'OutputsPasteLineEnd',
				'OutputsCancelPaste',
				'Assist',
				'More',
				'InsertLine',
				'DelRow',
				'drop_more',
				'Refresh'
			];
			visibleButtons = [
				'Save',
				'SaveAdd',
				'Cancel',
				'OutputsAddLine',
				'OutputsDelLine',
				'OutputsCopyLine',
				'OutputsResetRow'
			];
		} else {
			unvisibleButtons = [
				'Edit',
				'ReviseEdit',
				'Add',
				'Return',
				'Delete',
				'Commit',
				'UnCommit',
				'Assign',
				'Unassign',
				'Default',
				'CancelDefault',
				'Refresh',
				'Enable',
				'Disable',
				'Print',
				'Output',
				'PasteLineEnd',
				'CancelPaste',
				'PasteHere',
				'OutputsPasteHere',
				'OutputsPasteLineEnd',
				'OutputsCancelPaste',
				'Copy',
				'Assist',
				'drop_more'
			];
			visibleButtons = [
				'Save',
				'SaveAdd',
				'Cancel',
				'AddLine',
				'DelLine',
				'ResetRow',
				'CopyLine',
				'OutputsAddLine',
				'OutputsDelLine',
				'OutputsCopyLine',
				'OutputsResetRow',
				'SaveCommit',
				'More',
				'InsertLine',
				'DelRow'
			];
		}

		props.button.setButtonVisible(unvisibleButtons, false);
		props.button.setButtonVisible(visibleButtons, true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);

	} else {
		unvisibleButtons = [
			'Save',
			'Cancel',
			'AddLine',
			'DelLine',
			'SaveAdd',
			'ResetRow',
			'CancelPaste',
			'PasteLineEnd',
			'CopyLine',
			'PasteHere',
			'OutputsAddLine',
			'OutputsDelLine',
			'OutputsCopyLine',
			'OutputsPasteLineEnd',
			'OutputsCancelPaste',
			'OutputsResetRow',
			'InsertLine',
			'OutputsInsertLine',
			'OutputsDelRow',
			'DelRow',
			'SaveAdd',
			'OutputsPasteHere',
			'SaveCommit'
			
		];
		visibleButtons = [
			'Add',
			'Edit',
			'ReviseEdit',
			'Delete',
			'Return',
			'Commit',
			'UnCommit',
			'Assign',
			'Unassign',
			'Default',
			'CancelDefault',
			'Refresh',
			'Print',
			'Output',
			'Copy',
			'Enable',
			'Disable',
			'Assist',
			'drop_more'
		];
		props.button.setButtonVisible(unvisibleButtons, false);
		props.button.setButtonVisible(visibleButtons, true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
	}
	if(props.form.getFormStatus("bomcard_h")!==status)
		props.form.setFormStatus('bomcard_h', status);
	props.cardTable.setStatus('bomcard_b', status == 'edit' || status == 'add' ? 'edit' : 'browse');

	props.cardTable.setStatus('bomcard_outputs', status == 'edit' || status == 'add' ? 'edit' : 'browse');

	//添加浏览器窗口关闭监听事件
	if (status != 'add' && status != 'edit') {
		window.onbeforeunload = null;
	} else {
		window.onbeforeunload = () => {
			//编辑态关闭页签或浏览器的提示
			return '';
		};
	}
	if (props.getUrlParam('reviseEdit')) {
		let item = props.meta.getMeta()[AREA.bomcardh];
		let formItem = {};
		if (item) {
			for (const i of item.items) {
				if (i.visible) {
					formItem[i.attrcode] = true;
				}
			}
		}
		formItem.bkititem = false;
		formItem.hvnote = false;
		props.form.setFormItemsDisabled(AREA.bomcardh, formItem);
		let bomcarditems = [
			'vrowno',
			'cmaterialvid',
			
			'cassmeasureid',
			'vchangerate',
			'nassitemnum',
			'ibasenum',
			'vitemversion',
			'vpackversion',
			'nbfixshrinkastnum',
			'ndissipationum',
			'fcontrol',
			'bcanreplace',
			'freplacetype',
			'cbeginperiod',
			'cendperiod',
			'bcustommaterial',
			'bprojectmaterial',
			'ccustomerid',
			'cvendorid',
			'cproductorid',
			'cprojectid'
		];
		props.cardTable.setColEditableByKey(AREA.bomcarditem, bomcarditems);
		resetTableButtonEnable(props);
	} else {
		let bomcarditems = [
			'vrowno',
			'cmaterialvid',
			
			'cassmeasureid',
			'vchangerate',
			'nassitemnum',
			'ibasenum',
			'vitemversion',
			'vpackversion',
			'nbfixshrinkastnum',
			'ndissipationum',
			'fcontrol',
			'bcanreplace',
			'freplacetype',
			'cbeginperiod',
			'cendperiod',
			'bcustommaterial',
			'bprojectmaterial',
			'ccustomerid',
			'cvendorid',
			'cproductorid',
			'cprojectid'
		];
		props.cardTable.setColEditableByKey(AREA.bomcarditem, bomcarditems,false);
		if(status=='add'){
			props.form.setFormItemsDisabled(AREA.bomcardh, {
				pk_org: false
			});
		}
		if (status != 'browse') {
			if (
				props.form.getFormItemsValue(AREA.bomcardh, 'pk_org') &&
				props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value
			) {
				setCardEditable(props, true);
				if (status == 'edit') {
					props.form.setFormItemsDisabled(AREA.bomcardh, { hcmaterialvid: true })
				}
				resetTableButtonEnable(props);
			} else {
				
				setCardEditable(props, false);
			}
		}
	}
	// if (status == 'add' || status == 'edit') {
	// 	if (status == 'add') {
	// 		props.button.setButtonVisible(['SaveAdd'], true);

	// 	} else {
	// 		props.button.setButtonVisible(['SaveAdd'], false);

	// 	}
	// }
	if (status == 'edit' && props.getUrlParam('id')) {

		props.form.setFormItemsDisabled(AREA.bomcardh, {
			pk_org: true,
			hcmaterialid: true,
			hcmaterialvid: true,
			hversion: true,
			hfversiontype: true
		});

	}
}
function resetTableButtonEnable(props) {
	let btns = ['DelLine', 'CopyLine', 'OutputsDelLine', 'OutputsCopyLine'];
	if (props.cardTable.getNumberOfRows(AREA.bomcarditem) < 1) {
		btns.push('ResetRow');
	} else {
		props.button.setButtonDisabled(['ResetRow'], false);
	}
	if (props.cardTable.getNumberOfRows(AREA.bomcardoutputs) < 1) {
		btns.push('OutputsResetRow');
	} else {
		props.button.setButtonDisabled(['OutputsResetRow'], false);
	}

	props.button.setButtonDisabled(btns, true);
}

function setCardEditable(props, canedit) {
	props.form.setFormItemsDisabled(AREA.bomcardh, {
		hvnote: !canedit,
		hcmaterialid: !canedit,
		hcmaterialvid: !canedit,
		fbomtype: !canedit,
		hversion: !canedit,
		hfversiontype: true,
		hbdefault: !canedit,
		hcassmeasureid: !canedit,
		bkititem: !canedit,
		hnassparentnum: !canedit
	});
	//材料按钮
	props.button.setButtonDisabled(['AddLine', 'DeleteLine', 'CopyLine', 'ShowGrand', 'ResetRow'], !canedit);
	//联副按钮
	props.button.setButtonDisabled(['OutputsAddLine', 'DeleteLine', 'OutputsCopyLine', 'OutputsResetRow'], !canedit);
}

class Card extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;

		this.state = {
			pks: [],
			pk_org: '',
			title_code: '',
			totalcount: 0,
			backVisible: true,
			json: {},
			grandMeta: {},
			showGrand: false,
			wipsmaintain:false,
			grandStatus: 'browse',
			context: {},
			queryG: false, //需要查询孙表
			billid: '',
			approveDetailShow: false,
			buffer: []
		};
	}

	initTemplate = (props, callback) => {
		let reqData = [
			{
				rqUrl: '/platform/templet/querypage.do',
				rqJson: `{\n  \"pagecode\": \"10140BOMM_card\",\n  \"appcode\": \"10140BOMM\"\n}`,
				rqCode: 'template'
			},
			{
				rqUrl: '/platform/templet/querypage.do',
				rqJson: `{\n  \"pagecode\": \"10140BOMM_grand\",\n  \"appcode\": \"10140BOMM\"\n}`,
				rqCode: 'templategrand'
			},
			{
				rqUrl: '/platform/appregister/queryallbtns.do',
				rqJson: `{\n  \"pagecode\": \"10140BOMM_card\",\n  \"appcode\": \"10140BOMM\"\n}`,
				rqCode: 'button'
			},
			{
				rqUrl: '/mmbd/pub/getcontext.do',
				rqJson: `{\n  \"appcode\": \"10140BOMM\"}`,
				rqCode: 'context'
			}
		];

		ajax({
			url: '/nccloud/platform/pub/mergerequest.do',
			data: reqData,
			success: (res) => {
				if (res && res.data) {
					let data = res.data;
					// debugger;
					// if (res.data.context) {
					// 	this.app_context = res.data.context;
					// }
					// if (callback && typeof callback == 'function') {
					// 	callback(meta);
					// }
					if (data.template) {
						let meta = data.template;
						this.modifierMeta(props, meta);
						this.addGrandTabsMeta.call(this, props, meta);
						props.meta.setMeta(meta);
						this.setState({ grandMeta: meta['templategrand'] });
					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button);
						console.log('line433:inittemplate-toggle')
						toggleShow(props);

					}
					if (data.context) {
						this.setState({ context: data.context });
					}

					if (props.getUrlParam('status') == 'add') {
						this.props.cardTable.addRow(AREA.bomcarduseorg, 0, {
							pk_org: { value: data.context.pk_org },
							pk_org_v: { value: data.context.pk_org_v },
							pk_useorg: { value: data.context.pk_org, display: data.context.org_Name },
							pk_useorg_v: { value: data.context.pk_org_v },
							'pk_useorg.code': { value: data.context.orgcode },
							'pk_useorg.name': { value: data.context.org_Name }
						});
					}
					callback && callback(this.props);
				}
			}
		});

		// props.createUIDom(
		// 	{
		// 		pagecode: PAGECODE.bom_card//页面id
		// 		// appid: appId,//注册按钮的id
		// 		// appcode: '10140TAXRE'
		// 	},
		// 	data => {
		// 		if (data) {
		// 			if (data.template) {
		// 				let meta = data.template;
		// 				console.log(1)
		// 				this.modifierMeta(props, meta);
		// 				this.addGrandTabsMeta.call(this, props, meta);
		// 				props.meta.setMeta(meta);
		// 			}
		// 			if (data.button) {
		// 				let button = data.button;
		// 				props.button.setButtons(button);
		// 				toggleShow(props);
		// 			}
		// 		}
		// 	}
		// )
	};

	addGrandTabsMeta(props, meta) {

	}

	modifierMeta(props, meta) {
		// let status = props.getUrlParam('status');
		// meta[AREA.bomcardh].status = status;
		// meta[tableId].status = status;

		let porCol = {
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.pubjson ? this.state.pubjson['10140PUBMESSAGE-000034'] : '10140PUBMESSAGE-000034',
			visible: true,
			className: 'table-opr',
			width: 200,
			fixed: 'right',
			render: (text, record, index) => {
				let btnArray = ['More', 'InsertLine', 'DelRow', 'ShowRowGrand', 'PasteHere'];

				return props.button.createOprationButton(btnArray, {
					area: 'itembody-action',
					buttonLimit: 3,
					onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
				});

				// let status = this.props.cardTable.getStatus(tableId);
				// return status === "browse" ? (< span onClick={
				//   () => {
				//     this.props.cardTable.toggleRowView(tableId, record);
				//   }
				// } >
				//   {
				//     " "
				//   } {
				//     this.state.pubjson ?
				//       this.state.pubjson["10140PUBMESSAGE-000000"] :
				//       "10140PUBMESSAGE-000000" /* 国际化处理： 展开*/
				//   } </span>
				// ) : (< div className="currency-opr-col" >
				//   < span className="currency-opr-del"
				//     onClick={
				//       e => {
				//         props.cardTable.openModel(AREA.bomcarditem, "edit", record, index);
				//         e.stopPropagation();
				//       }
				//     } >
				//     {
				//       this.state.pubjson ?
				//         this.state.pubjson["10140PUBMESSAGE-000035"] :
				//         "10140PUBMESSAGE-000035" /* 国际化处理： 更多*/
				//     } </span> &nbsp;&nbsp; < span className="currency-opr-del"
				//       onClick={
				//         e => {
				//           props.cardTable.delRowsByIndex(tablAREA.bomcarditemeId, index);
				//           e.stopPropagation();
				//         }
				//       } >
				//     {
				//       this.state.pubjson ?
				//         this.state.pubjson["10140PUBMESSAGE-000009"] :
				//         "10140PUBMESSAGE-000009" /* 国际化处理： 删除*/
				//     } </span>
				//     &nbsp;&nbsp; < span className="currency-opr-del"
				//       onClick={
				//         e => {
				//           props.cardTable.delRowsByIndex(tablAREA.bomcarditemeId, index);
				//           e.stopPropagation();
				//         }
				//       } >
				//     {
				//       this.state.pubjson ?
				//         this.state.pubjson["10140PUBMESSAGE-000009"] :
				//         "10140PUBMESSAGE-000009" /* 国际化处理： 删除*/
				//     } </span> &nbsp;&nbsp; < span className="currency-opr-del"
				//     onClick={
				//       e => {
				//         props.cardTable.delRowsByIndex(tablAREA.bomcarditemeId, index);
				//         e.stopPropagation();
				//       }
				//     } >
				//   {
				//     this.state.pubjson ?
				//       this.state.pubjson["10140PUBMESSAGE-000009"] :
				//       "10140PUBMESSAGE-000009" /* 国际化处理： 删除*/
				//   } </span> &nbsp;&nbsp; < span className="currency-opr-del"
				//   onClick={
				//     e => {
				//       props.cardTable.delRowsByIndex(tablAREA.bomcarditemeId, index);
				//       e.stopPropagation();
				//     }
				//   } >
				// {
				//   this.state.pubjson ?
				//     this.state.pubjson["10140PUBMESSAGE-000009"] :
				//     "10140PUBMESSAGE-000009" /* 国际化处理： 删除*/
				// } </span>
				//     </div>
				//   );
			}
		};

		let outputsporCol = {
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.pubjson ? this.state.pubjson['10140PUBMESSAGE-000034'] : '10140PUBMESSAGE-000034',
			visible: true,
			className: 'table-opr',
			width: 200,
			fixed: 'right',
			render: (text, record, index) => {
				let btnArray = ['OutputsMore', 'OutputsInsertLine', 'OutputsDelRow', 'OutputsPasteHere'];

				return props.button.createOprationButton(btnArray, {
					area: 'outputstable-action',
					buttonLimit: 3,
					onButtonClick: (props, id) => this.outputsTableButtonClick(props, id, text, record, index)
				});
			}
		};
		meta[AREA.bomcarditem].items.push(porCol);

		meta[AREA.bomcardoutputs].items.push(outputsporCol);

		/**
     * 前事件过滤
     */
		meta[AREA.bomcardh].items.forEach((item) => {
			switch (item.attrcode) {
				case 'pk_org':
					{
						item.queryCondition = () => {
							return { GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' };
						};
					}
					break;
				case 'hcmaterialid':
					{
						item.queryCondition = () => {
							return {
								pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
								GridRefActionExt: 'nccloud.web.mmbd.refer.pub.MateiralRefFilter'
							};
						};
					}
					break;
				case 'hcmaterialvid':
					{
						//item.refcode = 'mmbd/refer/mat/MaterialVersionGridRef/index'
						item.queryCondition = () => {
							return {
								pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
								materialoid: props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialid').value,
								GridRefActionExt: 'nccloud.web.mmbd.refer.pub.MaterialvidRefFilter'
							};
						};
					}
					break;
				case 'hcassmeasureid':
					{
						item.queryCondition = () => {
							if (props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialvid').value) {
								return {
									pk_material: props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialvid').value,
									GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AssMeasureRefFilter'
								};
							} else
								return {
									pk_material: props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialid').value,
									GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AssMeasureRefFilter'
								};
						};
					}
					break;
				case 'fbomtype':
					{
						if (item.options.length > 2) {
							item.options.splice(2, 1);
						}
					}
					break;
			}
		});
		/**
     * 前事件结束
     */
		meta[AREA.bomcarditem].items.forEach((item) => {
			switch (item.attrcode) {
				case 'cmaterialvid': {
						item.isMultiSelectedEnabled = true;
					} break;
				case 'fitemsource':
					{
						if (item.options.length > 3) {
							item.options.splice(3, 1);
						}
					}
					break;
				case 'ccustomerid':
				case 'cvendorid':
				case 'cprojectid':
					{
						item.queryCondition = () => {
							return {
								pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value
							};
						};
					}
					break;
			}
		});
		meta['bomcard_b_02'].items.forEach((item) => {
			switch (item.attrcode) {
				case 'cmaterialvid': {
					item.isMultiSelectedEnabled = true;

				} break;
				case 'fitemsource':
					{
						if (item.options.length > 3) {
							item.options.splice(3, 1);
						}
					}
					break;
			}
		});
		meta[AREA.bomcardoutputs].items.forEach((item) => {
			switch (item.attrcode) {
				case 'foutputtype':
					{
						if (item.options.length > 2) {
							item.options.splice(0, 1);
						}
					}
					break;
				case 'cmaterialvid':
					{
						item.fieldDisplayed = 'refcode'		//为了显示参照编码
					}
					break;
				case 'ccustomerid':
				case 'cvendorid':
				case 'cprojectid':
					{
						item.queryCondition = () => {
							return {
								pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value
							};
						};
					}
					break
			}
		});

		meta['bomcard_outputs_01'].items.forEach((item) => {
			switch (item.attrcode) {
				case 'foutputtype':
					{
						if (item.options.length > 2) {
							item.options.splice(0, 1);
						}
					}
					break;
				case 'cmaterialvid':
					{
						item.fieldDisplayed = 'refcode'		//为了显示参照编码
					}
					break;
				case 'ccustomerid':
				case 'cvendorid':
				case 'cprojectid':
					{
						item.queryCondition = () => {
							return {
								pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value
							};
						};
					}
					break
			}
		});

		meta['bomcard_outputs_02'].items.forEach((item) => {
			switch (item.attrcode) {
				case 'foutputtype':
					{
						if (item.options.length > 2) {
							item.options.splice(0, 1);
						}
					}
					break;
				case 'cmaterialvid':
					{
						item.fieldDisplayed = 'refcode'		//为了显示参照编码
					}
					break;
				case 'ccustomerid':
				case 'cvendorid':
				case 'cprojectid':
					{
						item.queryCondition = () => {
							return {
								pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value
							};
						};
					}
					break
			}
		});
		return meta;
	}
	info = () => window.parent.GETBUSINESSINFO();

	componentDidMount() {
		let callback = (json) => {
			console.log('componentDidMount-callback')
			this.setState(
				{
					json
				},
				() => {
					this.initTemplate(this.props, (props) => {
						if (props.form.getFormItemsValue(AREA.bomcardh, 'pk_org') && props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value && props.getUrlParam('status') == 'add') {
							props.cardTable.addRow(AREA.bomcarditem);
							let pk_group = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
							let pk_org = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
							let pk_org_v = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
							let num = this.props.cardTable.getNumberOfRows(AREA.bomcarditem); //获取列表总行数
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org', { value: pk_org });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_group', {
								value: pk_group
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org_v', {
								value: pk_org_v
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nassitemnum', { value: 1 });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nitemnum', { value: 1 });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'ibasenum', { value: '1' });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemsource', {
								value: '1',
								display: this.state.json['10140BOMM2-000000']/* 国际化处理： 备料*/
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemtype', {
								value: '1',
								display: this.state.json['10140BOMM2-000001']/* 国际化处理： 普通*/
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtype', {
								value: '3',
								display: this.state.json['10140BOMM2-000002']/* 国际化处理： 交互倒冲*/
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtime', {
								value: '1',
								display: this.state.json['10140BOMM2-000003']/* 国际化处理： 产品完工*/
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fsupplymode', {
								value: '1',
								display: this.state.json['10140BOMM2-000004']/* 国际化处理： 一般发料*/
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fcontrol', {
								value: '2',
								display: this.state.json['10140BOMM2-000005']/* 国际化处理： 不控制*/
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bdeliver', { value: true });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbsteploss', { value: false });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbunibatch', { value: false });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbchkitemforwr', {
								value: true
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cendperiod', {
								value: '2099-12-31 23:59:59'
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cbeginperiod', {
								value: (getBusinessInfo().businessDate.substr(0, 10) + " 00:00:00")
							});

							RownoUtils.setRowNo(this.props, AREA.bomcarditem, 'vrowno');
							console.log('line856:componentDidMount-toggle')
							toggleShow(this.props);

							this.props.button.setButtonDisabled(['ResetRow'], false);

							ajax({
								url: URL.lossscale,
								data: { pk_org },
								success: (res) => {
									if (res.data) {
										props.meta.getMeta()[AREA.bomcarditem].items.find(item => item.attrcode == 'ndissipationum').scale = res.data.lossscale;
									}
								}
							})
						}

						this.afterInittemplate()
					});
				}
			);
		};
		this.props.MultiInit.getMultiLang({ moduleId: '10140BOMM', domainName: 'uapbd', callback });
		let callbacknoinit = (json, status, inlt) => {
			if (status) {
				this.setState({ pubjson: { ...json } });
			}
		};
		this.props.MultiInit.getMultiLang({ moduleId: '10140MMPUBMSG', domainName: 'uapbd', callback: callbacknoinit });
		
	}

	afterInittemplate = () => {
		console.log('line888:afterInittemplate-toggle')
		toggleShow(this.props);

		let status = this.props.getUrlParam('status');
		if (status != 'add') {

			//this.props.cardPagination.setCardPaginationId({id: this.props.getUrlParam('id'),status: 0})
			let pk = this.props.getUrlParam('id');
			if (pk && pk != 'undefined') {
				if (getDefData('permorgs', dataSource) && getDefData('permorgs', dataSource).length > 0) {
					console.log('afterInittemplate-getDefData-getdata')
					this.getdata(pk);
				} else {
					ajax({
						url: '/nccloud/mmbd/pub/getpermorgs.do',
						data: {},
						success: (res) => {
							setDefData('permorgs', dataSource, res.data.orgs);
							console.log('componentDidMount-getpermorgs-getdata')
							this.getdata(pk);
						}
					});

				}

			}
		} else {
			this.setDefaultValue();
		}

		if (status == 'add' || status == 'edit') {
			//点击修改或者新增进入的时候，返回按钮不可见
			let pk = this.props.getUrlParam('id');
			console.log(this.props.getUrlParam('copyadd') == true, 666);
			if (pk && pk != 'undefined' && status == 'add' && this.props.getUrlParam('copyadd') == true) {
				//处理复制逻辑
				//setTimeout(this.getdata(pk),0);
				ajax({
					url: URL.copyAdd,
					data: { id: pk },
					success: (res) => {
						setTimeout(() => {
							if (res.data.card.head) {
								this.props.form.setAllFormValue({
									[AREA.bomcardh]: res.data.card.head[AREA.bomcardh]
								});
								console.log('line933:componentDidMount-toggle')
								toggleShow(this.props);
							}
							//let tabs = [AREA.bomcarditem, AREA.bomcardoutputs, AREA.bomcarduseorg];

							if (res.data.card.bodys) {
								this.props.cardTable.setTableData(
									AREA.bomcarditem,
									res.data.card.bodys[AREA.bomcarditem]
								);
								this.props.cardTable.setTableData(
									AREA.bomcardoutputs,
									res.data.card.bodys[AREA.bomcardoutputs]
								);
								this.props.cardTable.setTableData(
									AREA.bomcarduseorg,
									res.data.card.bodys[AREA.bomcarduseorg]
								);

								this.props.cardTable.getAllRows(AREA.bomcarditem).forEach((row) => {
									if (res.data.grand[row.values.vrowno.value].bodys) {
										row.bomwips = res.data.grand[row.values.vrowno.value].bodys.bomwips;
										row.bomrepls = res.data.grand[row.values.vrowno.value].bodys.bomrepls;
										row.bompos = res.data.grand[row.values.vrowno.value].bodys.bompos;
										row.bomloss = res.data.grand[row.values.vrowno.value].bodys.bomloss;
									}
								});
							} else {
								this.props.cardTable.setAllTabsData([], tabs);
								this.setState({
									tableData: []
								});
							}
						}, 0);
					}
				});
			}
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false
			});
		}
		if (status == 'edit' && this.props.getUrlParam('id')) {
			this.props.form.setFormItemsDisabled(AREA.bomcardh, {
				pk_org: true,
				hcmaterialid: true,
				hcmaterialvid: true,
				hversion: true,
				hfversiontype: true
			});
		}
	}

	tableButtonClick = (props, id, text, record, index) => {
		//'More', 'InsertLine', 'DelRow','ShowRowGrand'];
		switch (id) {
			case 'More':
				{
					if (props.getUrlParam('status') == 'browse') {
						props.cardTable.toggleRowView(AREA.bomcarditem, record);
					} else props.cardTable.openModel(AREA.bomcarditem, 'edit', record, index);
				}
				break;
			case 'InsertLine':
				{
					let pk_group = props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
					let pk_org = props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
					let pk_org_v = props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
					let num = index + 1;
					props.cardTable.addRow(AREA.bomcarditem, index);
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org', { value: pk_org });
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_group', { value: pk_group });
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org_v', { value: pk_org_v });
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nassitemnum', { value: 1 });
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nitemnum', { value: 1 });
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'ibasenum', { value: '1' });
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemsource', {
						value: '1',
						display: this.state.json['10140BOMM2-000000']/* 国际化处理： 备料*/
					});
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemtype', {
						value: '1',
						display: this.state.json['10140BOMM2-000001']/* 国际化处理： 普通*/
					});
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtype', {
						value: '3',
						display: this.state.json['10140BOMM2-000002']/* 国际化处理： 交互倒冲*/
					});
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtime', {
						value: '1',
						display: this.state.json['10140BOMM2-000003']/* 国际化处理： 产品完工*/
					});
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fsupplymode', {
						value: '1',
						display: this.state.json['10140BOMM2-000004']/* 国际化处理： 一般发料*/
					});
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fcontrol', {
						value: '2',
						display: this.state.json['10140BOMM2-000005']/* 国际化处理： 不控制*/
					});
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bdeliver', { value: true });
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbsteploss', { value: false });
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbunibatch', { value: false });
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbchkitemforwr', { value: true });
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cendperiod', {
						value: '2099-12-31 23:59:59'
					});
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cbeginperiod', {
						value: (getBusinessInfo().businessDate.substr(0, 10) + " 00:00:00")
					});

					RownoUtils.setRowNo(props, AREA.bomcarditem, 'vrowno');
					console.log('line1059:InsertLine-toggle')
					toggleShow(props);

					props.button.setButtonDisabled(['ResetRow'], false);
				}
				break;
			case 'DelRow':
				{
					props.cardTable.delRowsByIndex(AREA.bomcarditem, index);
				}
				break;
			case 'ShowRowGrand':
				{
					// props.cardTable.filterEmptyRows(AREA.bomcarditem, ["cmaterialvid"], 'include')

					//if (props.cardTable.getAllRows(AREA.bomcarditem).length > 0) {
					let temp = []
					for(let i = 0; i < props.cardTable.getAllRows(AREA.bomcarditem).length; i++){
						temp.push(JSON.parse(JSON.stringify(props.cardTable.getRowsByIndexs(AREA.bomcarditem, i))))
					}
					this.setState({buffer: temp})
					console.log(this.state.buffer)

					this.setState({
						showGrand: true,
						grandStatus: props.cardTable.getStatus(AREA.bomcarditem),
						items: props.cardTable.getRowsByIndexs(AREA.bomcarditem, index),
						headitems: props.form.getAllFormValue(AREA.bomcardh)
					});
					this.refs.itemcontent.cardTable.setStatus(AREA.bomloss, 'edit');
					this.refs.itemcontent.cardTable.setStatus(AREA.bomwips, 'edit');
					this.refs.itemcontent.cardTable.setStatus(AREA.bompos, 'edit');
					this.refs.itemcontent.cardTable.setStatus(AREA.bomrepls, 'edit');
					//}
				}
				break;
			case 'PasteHere':
				{
					this.setState(
						{
							copyRowDatas: props.cardTable.getCheckedRows(AREA.bomcarditem)
						},
						() => {
							rowCopyPasteUtils.pasteRowsToIndex.call(
								this,
								props,
								AREA.bomcarditem,
								index,
								[],
								[],
								['vrowno', 'cbom_bid', 'ts']
							);
							// let now = props.cardTable.getNumberOfRows(AREA.bomcarditem);
							// props.cardTable.getCheckedRows(AREA.bomcarditem).forEach(
							//   row => {
							//     props.cardTable.pasteRow(AREA.bomcarditem, now-1, ['vrowno', 'cbom_bid'])
							//     now++;
							//   }
							// )

							RownoUtils.setRowNo(this.props, AREA.bomcarditem, 'vrowno');
							props.button.setButtonVisible(['PasteLineEnd', 'CancelPaste', 'PasteHere'], false);
							props.button.setButtonVisible(
								[
									'AddLine',
									'DelLine',
									'CopyLine',
									'ShowGrand',
									'ResetRow',
									'More',
									'InsertLine',
									'DelRow',
									'ShowRowGrand'
								],
								true
							);
							props.button.setButtonDisabled(['DelLine', 'CopyLine'], true);
						}
					);
				}
				break;
			default:
				break;
		}
	};

	outputsTableButtonClick = (props, id, text, record, index) => {
		//'More', 'InsertLine', 'DelRow','ShowRowGrand'];
		switch (id) {
			case 'OutputsMore':
				{
					if (props.getUrlParam('status') == 'browse') {
						props.cardTable.toggleRowView(AREA.bomcardoutputs, record);
					} else props.cardTable.openModel(AREA.bomcardoutputs, 'edit', record, index);
				}
				break;
			case 'OutputsInsertLine':
				{
					//toggleShow(this.props);
					props.button.setButtonDisabled(['OutputsResetRow'], false);

					let pk_group = props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
					let pk_org = props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
					let pk_org_v = props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
					let num = index + 1;
					props.cardTable.addRow(AREA.bomcardoutputs, index);

					this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'pk_org', { value: pk_org });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'pk_group', {
						value: pk_group
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'pk_org_v', {
						value: pk_org_v
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'nbyprodsptnum', {
						value: 0
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'noutputnum', { value: 0 });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'nastoutputnum', {
						value: 0
					});

					RownoUtils.setRowNo(props, AREA.bomcardoutputs, 'vrowno');
					console.log('line1182:OutputsInsertLine-toggle')
					toggleShow(props);

					props.button.setButtonDisabled(['OutputsResetRow'], false);
				}
				break;
			case 'OutputsDelRow':
				{
					props.cardTable.delRowsByIndex(AREA.bomcardoutputs, index);
				}
				break;

			case 'OutputsPasteHere':
				{
					this.setState(
						{
							copyRowDatas: props.cardTable.getCheckedRows(AREA.bomcardoutputs)
						},
						() => {
							rowCopyPasteUtils.pasteRowsToIndex.call(
								this,
								props,
								AREA.bomcardoutputs,
								index,
								[],
								[],
								['vrowno', 'cbom_outputsid', 'ts']
							);
							RownoUtils.setRowNo(this.props, AREA.bomcardoutputs, 'vrowno');
							props.button.setButtonVisible(['PasteLineEnd', 'CancelPaste', 'PasteHere'], false);
							props.button.setButtonVisible(
								['AddLine', 'DelLine', 'CopyLine', 'ShowGrand', 'ResetRow'],
								true
							);
							props.button.setButtonDisabled(['OutputsDelLine', 'OutputsCopyLine'], true);
						}
					);
				}
				break;
			default:
				break;
		}
	};

	setDefaultValue = () => {
		//补充集团默认值
		let context = getDefData('context', dataSource);
		this.props.form.setFormItemsValue(AREA.bomcardh, {
			pk_group: {
				value: window.parent.GETBUSINESSINFO().groupId,
				display: window.parent.GETBUSINESSINFO().groupName
			},
			pk_org: context.pk_org ? { value: context.pk_org, display: context.org_Name } : {},
			pk_org_v: context.pk_org_v ? { value: context.pk_org_v, display: context.org_v_Name } : {},
			hnassparentnum: { value: 1 },
			hnparentnum: { value: 1 },
			fbomtype: {
				value: '1',
				display: this.state.json['10140BOMM2-000011']/* 国际化处理： 无效版本*/
			},
			hfversiontype: {
				value: '2',
				display: this.state.json['10140BOMM2-000012']/* 国际化处理： 无效版本*/
			},
			fbillstatus: {
				value: '-1'
			},
			hfbomsource: {
				value: '1'
			}
		});

		//toggleShow(this.props)
		let status = this.props.getUrlParam('status')
		if (status == 'add') {
			if (
				this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org') &&
				this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value
			) {
				setCardEditable(this.props, true);
			} 
		}
	};

	onDelForBrowse = () => {
		let params = [];
		let candelete = false;

		if (this.props.form.getFormItemsValue(AREA.bomcardh, 'hbdefault').value) {
			candelete = true;
		}
		params.push({
			id: this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
			ts: this.props.form.getFormItemsValue(AREA.bomcardh, 'ts').value
		});
		if (!candelete) {
			ajax({
				url: URL.delete,
				data: { param: params },
				success: (res) => {
					if (res.success && res.data.sucessNum == '1') {
						let id = this.props.form.getFormItemsValue('bomcard_h','cbomid').value;

						//根据当前id,获取下个id
						/*
             * id：数据主键的值
             * dataSource: 缓存数据命名空间
             */
						let nextId = getNextId(id, dataSource);

						//调用删除缓存数据方法
						/*
             * idname: 数据主键的命名
             * id：数据主键的值
             * dataSource: 缓存数据命名空间
             */
						deleteCacheById('cbomid', id, dataSource);

						this.getDataForCache2(nextId, () => {
							//this.props.cardPagination.setCardPaginationId({id: nextId,status: 1})
							toast({
								color: 'success',
								title: this.state.json['110140BOMM3006']
							}); /* 国际化处理： 删除成功！*/
						});
					} else {
						toast({
							color: 'danger',
							content: res.data.errorMessages[0]
						});
					}
				}
			});
		} else {
			promptBox({
				color: 'warning',
				content: this.state.json['10140BOMM2-000006'],/* 国际化处理： 选中的BOM版本是默认版本，你确定删除吗？如果删除请人为制定新的默认版本。*/
				beSureBtnClick: () => {
					ajax({
						url: URL.delete,
						data: { param: params },
						success: (res) => {
							if (res.success && res.data.sucessNum == '1') {
								let id = this.props.form.getFormItemsValue('bomcard_h','cbomid').value;
		
								//根据当前id,获取下个id
								/*
					 * id：数据主键的值
					 * dataSource: 缓存数据命名空间
					 */
								let nextId = getNextId(id, dataSource);
		
								//调用删除缓存数据方法
								/*
					 * idname: 数据主键的命名
					 * id：数据主键的值
					 * dataSource: 缓存数据命名空间
					 */
								deleteCacheById('cbomid', id, dataSource);
		
								this.getDataForCache(nextId, () => {
									//this.props.cardPagination.setCardPaginationId({id: nextId,status: 1})
									toast({
										color: 'success',
										title: this.state.json['110140BOMM3006']
									}); /* 国际化处理： 删除成功！*/
								});
							} else {
								toast({
									color: 'danger',
									content: res.data.errorMessages[0]
								});
							}
						}
					});
				}
			});
		}
	};

	buttonClick = (props, id) => {
		let _this = this;
		switch (id) {
			case 'ApproveDetail': {
				this.setState({
					billid: props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
					approveDetailShow: true

				})
			} break;
			case 'WipsMaintain':
				{
					let data = {
						cbomid: props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value
					};
					ajax({
						url: URL.queryGrand,
						data: data,
						success: (res) => {
							console.log(res);
							if (res && res.data) {
								props.cardTable.getAllRows(AREA.bomcarditem).forEach((row) => {
									if (row.values.cbom_bid.value && res.data[row.values.cbom_bid.value]&&res.data[row.values.cbom_bid.value].bodys) {
										row.bomwips = res.data[row.values.cbom_bid.value].bodys.bomwips;
										row.bomrepls = res.data[row.values.cbom_bid.value].bodys.bomrepls;
										row.bompos = res.data[row.values.cbom_bid.value].bodys.bompos;
										row.bomloss = res.data[row.values.cbom_bid.value].bodys.bomloss;
									}
								});

								this.setState({
									showGrand: true,
									grandStatus: 'edit',
									items: props.cardTable.getAllRows(AREA.bomcarditem),
									headitems: props.form.getAllFormValue(AREA.bomcardh),
									wipsmaintain:true
								});
								this.refs.itemcontent.cardTable.setStatus(AREA.bomloss, 'browse');
								this.refs.itemcontent.cardTable.setStatus(AREA.bomwips, 'edit');
								this.refs.itemcontent.cardTable.setStatus(AREA.bompos, 'browse');
								this.refs.itemcontent.cardTable.setStatus(AREA.bomrepls, 'browse');
							}
						}
					});
				}
				break;
			case 'ShowGrand':
				{
					if (props.cardTable.getAllRows(AREA.bomcarditem).length <= 0) {
						toast({ color: 'warning', title: this.state.json['10140BOMM2-000007'] });/* 国际化处理： 请先选择材料行!*/
						return;
					}
					// console.log({ head: props.form.getAllFormValue(AREA.bomcardh) });
					let temp = []
					for(let i = 0; i < props.cardTable.getAllRows(AREA.bomcarditem).length; i++){
						temp.push(JSON.parse(JSON.stringify(props.cardTable.getRowsByIndexs(AREA.bomcarditem, i))))
					}
					this.setState({buffer: temp})
					console.log(this.state.buffer)
					if (props.form.getFormStatus(AREA.bomcardh) != 'add') {
						this.setState({
							showGrand: true,
							grandStatus: props.cardTable.getStatus(AREA.bomcarditem),
							revise: props.getUrlParam('reviseEdit'),
							items: props.cardTable.getAllRows(AREA.bomcarditem),
							headitems: props.form.getAllFormValue(AREA.bomcardh)
						});
						if (props.cardTable.getStatus(AREA.bomcarditem) == 'edit') {
							this.refs.itemcontent.cardTable.setStatus(AREA.bomloss, 'edit');
							this.refs.itemcontent.cardTable.setStatus(AREA.bomwips, 'edit');
							this.refs.itemcontent.cardTable.setStatus(AREA.bompos, 'edit');
							this.refs.itemcontent.cardTable.setStatus(AREA.bomrepls, 'edit');
						} else {
							this.refs.itemcontent.cardTable.setTableData(
								AREA.bomcarditem,
								props.cardTable.getAllRows(AREA.bomcarditem)
							);
						}
					} else {
						props.cardTable.filterEmptyRows(AREA.bomcarditem, ['cmaterialvid'], 'include');
						props.cardTable.filterEmptyRows(AREA.bomcardoutputs, ['cmaterialvid'], 'include');
						if (props.cardTable.getAllRows(AREA.bomcarditem).length > 0) {
							this.setState({
								showGrand: true,
								grandStatus: props.cardTable.getStatus(AREA.bomcarditem),
								items: props.cardTable.getAllRows(AREA.bomcarditem),
								headitems: props.form.getAllFormValue(AREA.bomcardh)
							});
							this.refs.itemcontent.cardTable.setStatus(AREA.bomloss, 'edit');
							this.refs.itemcontent.cardTable.setStatus(AREA.bomwips, 'edit');
							this.refs.itemcontent.cardTable.setStatus(AREA.bompos, 'edit');
							this.refs.itemcontent.cardTable.setStatus(AREA.bomrepls, 'edit');
						}
					}
				}

				break;
			case 'gylxyzx':
				{
					ajax({
						url: URL.checkbefore,
						data: { cbomid: props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value },

						success: (res) => {
							props.openTo('/uapbd/mmbase/datamanage01/main/index.html', {
								status: 'browse',

								pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
								pk_org_d: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').display,
								cbomid: props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,

								appcode: '10140DAMA',
								pagecode: '10140DAMA_form'
							});
						}
					});
				}
				break;
			case 'LinkTree':
				{
					this.props.openTo('/uapbd/mmbase/bom0204/main/index.html', {
						status: 'browse',

						pk_org: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
						pk_org_d: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').display,
						hcmaterialid: this.props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialid').value,
						hcmaterialid_d: this.props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialid').display,
						hcmaterialvid_d: this.props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialvid').display,
						hcmaterialvid: this.props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialvid').value,
						hversion: this.props.form.getFormItemsValue(AREA.bomcardh, 'hversion').value,
						fbomtype: this.props.form.getFormItemsValue(AREA.bomcardh, 'fbomtype').value,

						appcode: '10140BOMTM',
						pagecode: '10140BOMTM_main'
					});
				}
				break;
			case 'Add':
				props.form.EmptyAllFormValue(AREA.bomcardh);
				props.form.setFormItemsDisabled(AREA.bomcardh, {
					hfversiontype: true
				});

				props.cardTable.setTableData(AREA.bomcarditem, {
					rows: []
				});
				props.cardTable.setTableData(AREA.bomcardoutputs, {
					rows: []
				});
				props.cardTable.setTableData(AREA.bomcarduseorg, {
					rows: []
				});
				props.pushTo('/card', {
					status: 'add'
				});
				this.setDefaultValue();
				//toggleShow(this.props);
				//特殊设置一下返回按钮的可见性
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false
				});
				let pk_group = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
				let pk_org = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
				let pk_org_v = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
				if (pk_org) {
					props.cardTable.addRow(AREA.bomcarditem);
					let num = this.props.cardTable.getNumberOfRows(AREA.bomcarditem); //获取列表总行数
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org', { value: pk_org });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_group', {
						value: pk_group
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org_v', {
						value: pk_org_v
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nassitemnum', { value: 1 });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nitemnum', { value: 1 });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'ibasenum', { value: '1' });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemsource', {
						value: '1',
						display: this.state.json['10140BOMM2-000000']/* 国际化处理： 备料*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemtype', {
						value: '1',
						display: this.state.json['10140BOMM2-000001']/* 国际化处理： 普通*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtype', {
						value: '3',
						display: this.state.json['10140BOMM2-000002']/* 国际化处理： 交互倒冲*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtime', {
						value: '1',
						display: this.state.json['10140BOMM2-000003']/* 国际化处理： 产品完工*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fsupplymode', {
						value: '1',
						display: this.state.json['10140BOMM2-000004']/* 国际化处理： 一般发料*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fcontrol', {
						value: '2',
						display: this.state.json['10140BOMM2-000005']/* 国际化处理： 不控制*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bdeliver', { value: true });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbsteploss', { value: false });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbunibatch', { value: false });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbchkitemforwr', {
						value: true
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cendperiod', {
						value: '2099-12-31 23:59:59'
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cbeginperiod', {
						value: (getBusinessInfo().businessDate.substr(0, 10) + " 00:00:00")
					});

					RownoUtils.setRowNo(this.props, AREA.bomcarditem, 'vrowno');
				}

				console.log('line1560:Add-toggle')
				toggleShow(this.props);
				props.button.setButtonVisible(['InsertLine', 'PasteLine', 'OutputsInsertLine', 'OutputsPasteLine'], false)
				props.button.setButtonDisabled(['ResetRow'], false);
				props.cardTable.addRow(AREA.bomcarduseorg, 0, {
					pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org'),
					pk_org_v: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v'),
					pk_useorg: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org'),
					pk_useorg_v: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v'),
					'pk_useorg.name': { value: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').display }
				});
				break;
			case 'Edit': {
				let cancontinue = false;
				ajax({
					url: URL.checkpermission,
					async: false,
					data: {
						id: props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
						actioncode: 'Edit'
					},
					success: (res) => {
						cancontinue = true
					}, error: (err) => {
						toast({ color: 'danger', content: err.message });
					}
				});
				if (!cancontinue) {
					return
				}

				props.pushTo('/card', {
					status: 'edit',
					id: props.getUrlParam('id')
				});
				console.log('line1595:Edit-toggle')
				toggleShow(this.props);
				props.form.setFormItemsDisabled(AREA.bomcardh, {
					pk_org: true,
					hcmaterialid: true,
					hcmaterialvid: true,
					hversion: true,
					hfversiontype: true
				});

				//设置一下修改时根据国家地区设置行政区划参照的参照范围
				//
				//特殊设置一下返回按钮的可见性
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false
				});
			}
				break;
			case 'ReviseEdit':
				props.pushTo('/card', {
					status: 'edit',
					reviseEdit: true,
					id: props.getUrlParam('id')
				});
				console.log('line1619:ReviseEdit-toggle')
				toggleShow(this.props);
				//特殊设置一下返回按钮的可见性
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false
				});
				break;
			case 'Copy':
				{
					props.form.setFormItemsDisabled(AREA.bomcardh, {
						pk_org: false
					});
					ajax({
						url: URL.copyAdd,
						data: { id: props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value },
						success: (res) => {
							setTimeout(() => {
								if (res.data.card.head) {
									this.props.form.setAllFormValue({
										[AREA.bomcardh]: res.data.card.head[AREA.bomcardh]
									});
									console.log('line1640:Copy-toggle')
									toggleShow(this.props);
								}
								//let tabs = [AREA.bomcarditem, AREA.bomcardoutputs, AREA.bomcarduseorg];

								if (res.data.card.bodys) {
									this.props.cardTable.setTableData(
										AREA.bomcarditem,
										res.data.card.bodys[AREA.bomcarditem]
									);
									this.props.cardTable.setTableData(
										AREA.bomcardoutputs,
										res.data.card.bodys[AREA.bomcardoutputs]
									);
									this.props.cardTable.setTableData(
										AREA.bomcarduseorg,
										res.data.card.bodys[AREA.bomcarduseorg]
									);

									this.props.cardTable.getAllRows(AREA.bomcarditem).forEach((row) => {
										if (res.data.grand[row.values.vrowno.value].bodys) {
											row.bomwips = res.data.grand[row.values.vrowno.value].bodys.bomwips;
											row.bomrepls = res.data.grand[row.values.vrowno.value].bodys.bomrepls;
											row.bompos = res.data.grand[row.values.vrowno.value].bodys.bompos;
											row.bomloss = res.data.grand[row.values.vrowno.value].bodys.bomloss;
										}
									});
								} else {
									this.props.cardTable.setAllTabsData([], tabs);
									this.setState({
										tableData: []
									});
								}
							}, 0);
						}
					});
					props.pushTo('/card', {
						status: 'add',
						id: props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
						copyadd: true
					});
					console.log('line1681:Copy-toggle')
					toggleShow(this.props);

					//设置一下修改时根据国家地区设置行政区划参照的参照范围
					//
					//特殊设置一下返回按钮的可见性

					this.props.BillHeadInfo.setBillHeadInfoVisible({
						showBackBtn: false
					});
				}
				break;
			case 'Delete':
				let cancontinue = false;

				ajax({
					url: URL.checkpermission,
					async: false,
					data: {
						id: props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
						actioncode: 'Delete'
					},
					success: (res) => {
						cancontinue = true
					}, error: (err) => {
						toast({ color: 'danger', content: err.message });
					}
				});
				if (!cancontinue) {
					return
				}
				//this.props.modal.show('delete');
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['110140BOMM3004'] /* 国际化处理： 删除提醒*/,
					content: this.state.json['110140BOMM3005'] /* 国际化处理： 确定要删除数据吗？*/,
					beSureBtnClick: () => {
						this.onDelForBrowse();
					}
				});
				break;
			case 'Return':				
				let listRefreshDisable = true
				if (this.props.getUrlParam('id') != null) {
					listRefreshDisable = false
				}
				props.pushTo('/list', {
					listRefreshDisable: listRefreshDisable
				});
				break;
			case 'Save':
				this.saveClick();
				break;
			case 'Cancel':
				//this.props.modal.show('cancel')
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					content: this.state.json['10140BOMM2-000008'], // 提示内容,非必输/* 国际化处理： 是否确认要取消,提示内容,非必输*//* 国际化处理： 是否确认要取消？*/
					noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false, // 是否显示取消按钮,，默认显示(false),非必输

					beSureBtnClick: this.cancelSureEvent.bind(this) // 确定按钮点击调用函数,非必输
				});
				break;
			case 'AddLine':
				{
					if (
						!this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org') ||
						!this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value
					) {
						toast({
							color: 'warning',
							content: this.state.json['110140BOMM3025']
						});
						return;
					}
					props.cardTable.addRow(AREA.bomcarditem);
					let pk_group = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
					let pk_org = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
					let pk_org_v = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
					let num = this.props.cardTable.getNumberOfRows(AREA.bomcarditem); //获取列表总行数
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org', { value: pk_org });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_group', {
						value: pk_group
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org_v', {
						value: pk_org_v
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nassitemnum', { value: 1 });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nitemnum', { value: 1 });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'ibasenum', { value: '1' });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemsource', {
						value: '1',
						display: this.state.json['10140BOMM2-000000']/* 国际化处理： 备料*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemtype', {
						value: '1',
						display: this.state.json['10140BOMM2-000001']/* 国际化处理： 普通*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtype', {
						value: '3',
						display: this.state.json['10140BOMM2-000002']/* 国际化处理： 交互倒冲*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtime', {
						value: '1',
						display: this.state.json['10140BOMM2-000003']/* 国际化处理： 产品完工*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fsupplymode', {
						value: '1',
						display: this.state.json['10140BOMM2-000004']/* 国际化处理： 一般发料*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fcontrol', {
						value: '2',
						display: this.state.json['10140BOMM2-000005']/* 国际化处理： 不控制*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bdeliver', { value: true });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbsteploss', { value: false });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbunibatch', { value: false });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbchkitemforwr', {
						value: true
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cendperiod', {
						value: '2099-12-31 23:59:59'
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cbeginperiod', {
						value: (getBusinessInfo().businessDate.substr(0, 10) + " 00:00:00")
					});

					RownoUtils.setRowNo(this.props, AREA.bomcarditem, 'vrowno');

					console.log('line1811:AddLine-toggle')
					toggleShow(this.props);

					props.button.setButtonDisabled(['ResetRow'], false);
				}
				break;
			case 'OutputsAddLine':
				{
					if (
						!this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org') ||
						!this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value
					) {
						toast({
							color: 'warning',
							content: this.state.json['110140BOMM3025']
						});
						return;
					}
					props.cardTable.addRow(AREA.bomcardoutputs);
					let pk_group = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
					let pk_org = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
					let pk_org_v = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
					console.log(
						this.props.cardTable.getCurTabKey(),
						this.props.cardTable.getCurTabKey() == AREA.bomcarditem
					);

					let num = this.props.cardTable.getNumberOfRows(AREA.bomcardoutputs); //获取列表总行数
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'pk_org', { value: pk_org });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'pk_group', {
						value: pk_group
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'pk_org_v', {
						value: pk_org_v
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'nbyprodsptnum', {
						value: 0
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'noutputnum', { value: 0 });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'nastoutputnum', {
						value: 0
					});

					RownoUtils.setRowNo(this.props, AREA.bomcardoutputs, 'vrowno');

					//toggleShow(this.props);
					props.button.setButtonDisabled(['OutputsResetRow'], false);
				}
				break;
			case 'OutputsDelLine':
				{
					let selectedRows = props.cardTable.getCheckedRows(AREA.bomcardoutputs);
					let selectedIndex = [];
					selectedRows.forEach((item) => {
						selectedIndex.push(item.index);
					});
					props.cardTable.delRowsByIndex(AREA.bomcardoutputs, selectedIndex);
					this.updateOutputsTableBtnStatus(props)
				}
				break;
			case 'OutputsCopyLine':
				{
					props.button.setButtonVisible(
						['OutputsPasteLineEnd', 'OutputsCancelPaste', 'OutputsPasteHere'],
						true
					);
					props.button.setButtonVisible(
						[
							'OutputsAddLine',
							'OutputsDelLine',
							'OutputsCopyLine',
							'OutputsResetRow',
							'OutputsMore',
							'OutputsInsertLine',
							'OutputsDelRow'
						],
						false
					);
				}
				break;
			case 'OutputsPasteLineEnd':
				{
					this.setState(
						{
							copyRowDatas: props.cardTable.getCheckedRows(AREA.bomcardoutputs)
						},
						() => {
							rowCopyPasteUtils.pasteRowsToTail.call(
								this,
								props,
								AREA.bomcardoutputs,
								[],
								[],
								['vrowno', 'cbom_outputsid', 'ts']
							);
							// let now = props.cardTable.getNumberOfRows(AREA.bomcarditem);
							// props.cardTable.getCheckedRows(AREA.bomcarditem).forEach(
							//   row => {
							//     props.cardTable.pasteRow(AREA.bomcarditem, now-1, ['vrowno', 'cbom_bid'])
							//     now++;
							//   }
							// )

							RownoUtils.setRowNo(this.props, AREA.bomcardoutputs, 'vrowno');
							props.button.setButtonVisible(
								['OutputsPasteLineEnd', 'OutputsCancelPaste', 'OutputsPasteHere'],
								false
							);
							props.button.setButtonVisible(
								[
									'OutputsAddLine',
									'OutputsDelLine',
									'OutputsCopyLine',
									'OutputsResetRow',
									'OutputsMore',
									'OutputsInsertLine',
									'OutputsDelRow'
								],
								true
							);
							props.button.setButtonDisabled(['OutputsDelLine', 'OutputsCopyLine'], true);
						}
					);
				}
				break;
			case 'OutputsCancelPaste':
				{
					props.button.setButtonVisible(
						['OutputsPasteLineEnd', 'OutputsCancelPaste', 'OutputsPasteHere'],
						false
					);
					props.button.setButtonVisible(
						[
							'OutputsAddLine',
							'OutputsDelLine',
							'OutputsCopyLine',
							'OutputsResetRow',
							'OutputsMore',
							'OutputsInsertLine',
							'OutputsDelRow'
						],
						true
					);
				}
				break;
			case 'DelLine':
				let selectedRows = props.cardTable.getCheckedRows(AREA.bomcarditem);
				let selectedIndex = [];
				selectedRows.forEach((item) => {
					selectedIndex.push(item.index);
				});
				props.cardTable.delRowsByIndex(AREA.bomcarditem, selectedIndex);
				this.updateCardTableBtnStatus(props)
				break;
			case 'Refresh': {
				// props.pushTo('/card', {
				// 	status:props.getUrlParam('status'),
				// 	id:props.getUrlParam('id')
				// })
				let pk = null;
				if (props.form.getFormItemsValue(AREA.bomcardh, 'cbomid') && props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value) {
					pk = props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value
				} else {
					pk = this.props.getUrlParam('id')
				}
				this.getdata(pk, () => {
					toast({
						title: this.state.pubjson['10140PUBMESSAGE-000017'],
						color: 'success'
					});
				});
			}
				break;
			case 'SaveAdd':
				this.saveClick(true);
				break;
			case 'SaveCommit':
				this.saveClick(false, true);
				break;
			case 'ResetRow':
				{
					RownoUtils.resetRowNo(this.props, AREA.bomcarditem, 'vrowno');
				}
				break;
			case 'CopyLine':
				{
					props.button.setButtonVisible(['PasteLineEnd', 'CancelPaste', 'PasteHere'], true);
					props.button.setButtonVisible(
						[
							'AddLine',
							'DelLine',
							'CopyLine',
							'ShowGrand',
							'ResetRow',
							'More',
							'InsertLine',
							'DelRow',
							'ShowRowGrand'
						],
						false
					);
				}
				break;
			case 'CancelPaste':
				{
					props.button.setButtonVisible(['PasteLineEnd', 'CancelPaste', 'PasteHere'], false);
					props.button.setButtonVisible(
						[
							'AddLine',
							'DelLine',
							'CopyLine',
							'ShowGrand',
							'ResetRow',
							'More',
							'InsertLine',
							'DelRow',
							'ShowRowGrand'
						],
						true
					);
				}
				break;
			case 'PasteLineEnd':
				{
					this.setState(
						{
							copyRowDatas: props.cardTable.getCheckedRows(AREA.bomcarditem)
						},
						() => {
							rowCopyPasteUtils.pasteRowsToTail.call(
								this,
								props,
								AREA.bomcarditem,
								[],
								[],
								['vrowno', 'cbom_bid', 'ts']
							);
							// let now = props.cardTable.getNumberOfRows(AREA.bomcarditem);
							// props.cardTable.getCheckedRows(AREA.bomcarditem).forEach(
							//   row => {
							//     props.cardTable.pasteRow(AREA.bomcarditem, now-1, ['vrowno', 'cbom_bid'])
							//     now++;
							//   }
							// )

							RownoUtils.setRowNo(this.props, AREA.bomcarditem, 'vrowno');
							props.button.setButtonVisible(['PasteLineEnd', 'CancelPaste', 'PasteHere'], false);
							props.button.setButtonVisible(
								[
									'AddLine',
									'DelLine',
									'CopyLine',
									'ShowGrand',
									'ResetRow',
									'More',
									'InsertLine',
									'DelRow',
									'ShowRowGrand'
								],
								true
							);
							props.button.setButtonDisabled(['DelLine', 'CopyLine'], true);
						}
					);
				}
				break;
			case 'Commit':
				this.commit();
				break;
			case 'UnCommit':
				{
					let info = {
						pk: this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
						ts: this.props.form.getFormItemsValue(AREA.bomcardh, 'ts').value
					};
					let data = {
						pkTsParams: [info],
						pageid: PAGECODE.bom_card
					};
					ajax({
						method: 'post',
						url: URL.uncommit,
						data: data,
						success: (res) => {
							showBatchOprMessage(null, res.data, getLangByResId(this, '10140PUBMESSAGE-000027'));
							let pk = null;
							if (props.form.getFormItemsValue(AREA.bomcardh, 'cbomid') && props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value) {
								pk = props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value
							} else {
								pk = this.props.getUrlParam('id')
							}
							this.getdata(pk, () => {
							});
							//updateCacheDataForList(props, AREA.bomlist, 'cbomid', res.data);
						}
					});
				}
				break;
			case 'Assign': {
				//BOM分配
				let ids = [this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value];
				this.assignModal.show(ids, false);
				break;
			}
			case 'Unassign': {
				//取消分配
				let ids = [this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value];
				this.assignModal.show(ids, true);
				break;
			}
			case 'Enable':
				{
					console.log(this.state, 'ss');
					let params = {
						id: this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
						ts: this.props.form.getFormItemsValue(AREA.bomcardh, 'ts').value
					};
					ajax({
						url: URL.enable,
						data: { param: [params] },
						success: (res) => {
							showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000031']);
							this.props.button.setButtonDisabled({ Enable: true, Disable: false });
							this.props.button.setButtonVisible(['Enable'], false);
							this.props.button.setButtonVisible(['Disable'], true);
							this.getdata(this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value)
							// this.props.button.setButtonVisible(['Enable'], false)
							// this.props.button.setButtonVisible(['Disable'], true)
						}
					});
				}

				break;
			case 'Disable':
				{
					let params = {
						id: this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
						ts: this.props.form.getFormItemsValue(AREA.bomcardh, 'ts').value
					};
					ajax({
						url: URL.disable,
						data: { param: [params] },
						success: (res) => {
							showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000032']);
							this.props.button.setButtonDisabled({ Enable: false, Disable: true });
							this.props.button.setButtonVisible(['Enable'], true);
							this.props.button.setButtonVisible(['Disable'], false);
							// this.props.button.setButtonVisible(['Enable'], true)
							// this.props.button.setButtonVisible(['Disable'], false)
							this.getdata(this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value)
							//this.refreshAction(props);
						}
					});
				}
				break;
			case 'Default':
				{
					let data = {
						id: this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
						ts: this.props.form.getFormItemsValue(AREA.bomcardh, 'ts').value
						// rowId: item.data.rowId
					};
					ajax({
						url: URL.default,
						data,
						success: (res) => {
							if (res.data.oriid) {
								promptBox({
									color: 'warning',
									content: this.state.json['10140BOMM2-000009'],/* 国际化处理： 物料已存在有效的默认BOM版本，是否将当前BOM设为默认BOM版本？*/
									beSureBtnClick: () => {
										ajax({
											url: URL.suredefault,
											data: { curid: res.data.curid,curts: this.props.form.getFormItemsValue(AREA.bomcardh, 'ts').value, oriid:res.data.oriid },
											success: (res) => {
												if (res.data[AREA.bomlist]) {
													this.props.form.setAllFormValue({
														[AREA.bomcardh]: res.data[AREA.bomlist]
													});
													this.props.button.setButtonDisabled({
														Default: true,
														CancelDefault: false
													});
													this.props.button.setButtonVisible(['Default'], false);
													this.props.button.setButtonVisible(['CancelDefault'], true);
													toast({ color: 'success', title: this.state.json['10140BOMM2-000010'] });/* 国际化处理： 操作成功！*/
												}
											}
										});
									}
								});
							} else if (res.data[AREA.bomlist]) {
								this.props.form.setAllFormValue({
									[AREA.bomcardh]: res.data[AREA.bomlist]
								});
								this.props.button.setButtonDisabled({ Default: true, CancelDefault: false });
								this.props.button.setButtonVisible(['Default'], false);
								this.props.button.setButtonVisible(['CancelDefault'], true);
								toast({ color: 'success', title: this.state.json['10140BOMM2-000010'] });/* 国际化处理： 操作成功！*/
							}
						}
					});
				}
				break;
			case 'CancelDefault':
				{
					let data = {
						id: this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
						ts: this.props.form.getFormItemsValue(AREA.bomcardh, 'ts').value
					};
					ajax({
						url: URL.canceldefault,
						data,
						success: (res) => {
							if (res.data[AREA.bomlist]) {
								this.props.form.setAllFormValue({
									[AREA.bomcardh]: res.data[AREA.bomlist]
								});
								this.props.button.setButtonDisabled({ Default: false, CancelDefault: true });
								this.props.button.setButtonVisible(['Default'], true);
								this.props.button.setButtonVisible(['CancelDefault'], false);
								toast({ color: 'success', title: this.state.json['10140BOMM2-000010'] });/* 国际化处理： 操作成功！*/
							}
						}
					});
				}
				break;
			case 'Print': {
				let cancontinue = false;
				ajax({
					url: URL.checkpermission,
					async: false,
					data: {
						id: this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
						actioncode: 'Edit'
					},
					success: (res) => {
						cancontinue = true
					}, error: (err) => {
						toast({ color: 'danger', content: err.message });
					}
				});
				if (!cancontinue) {
					return
				}
				this.output('print');
			}
				break;
			case 'Output':
				{
					let pks = this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value;
					this.setState(
						{
							pks: [pks]
						},
						() => {
							this.refs.printOutput.open();
						}
					);
					break;
				}
				break;
			default:
				break;
		}
	};

	cancelSureEvent() {
		if (this.props.getUrlParam('status') === 'add') {
			let pk = getCurrentLastId(dataSource);
			this.getDataForCache2(pk, () => {
				//编辑态取消时，修正一下页面状态
				this.props.pushTo('/card', {
					status: 'browse',
					id: this.props.getUrlParam('id')
				});

				this.props.form.setFormStatus(AREA.bomcardh, 'browse');
				this.props.cardTable.setStatus(AREA.bomcarditem, 'browse');
				this.props.cardTable.setStatus(AREA.bomcardoutputs, 'browse');
			});
		}
		if (this.props.getUrlParam('status') === 'edit') {
			this.props.form.cancel(AREA.bomcardh);
			this.props.cardTable.resetTableData(AREA.bomcarditem);
			this.props.cardTable.resetTableData(AREA.bomcardoutputs);
			this.props.pushTo('/card', {
				status: 'browse',
				id: this.props.getUrlParam('id')
			});
			// let enableState = this.props.form.getFormItemsValue(AREA.bomcardh, 'enablestate')
			console.log('line2302:CancelSureEvent-toggle')
			toggleShow(this.props);
			this.getdata(this.props.getUrlParam('id'))
		}
		//特殊设置一下返回按钮的可见性
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true
		});
		if (getDefData('lastGrand', dataSource)) {
			let data = getDefData('lastGrand', dataSource)
			this.props.cardTable.getAllRows(AREA.bomcarditem).forEach((row) => {
				if (data[row.values.cbom_bid.value] && data[row.values.cbom_bid.value].bodys) {
					row.bomwips = data[row.values.cbom_bid.value].bodys.bomwips;
					row.bomrepls = data[row.values.cbom_bid.value].bodys.bomrepls;
					row.bompos = data[row.values.cbom_bid.value].bodys.bompos;
					row.bomloss = data[row.values.cbom_bid.value].bodys.bomloss;
				}
			});
		}
	}

	pageInfoClick = (props, pk) => {
		this.getDataForCache2(pk);
		this.props.setUrlParam(pk); //动态修改地址栏中的id的值
	};

	sureChangeOrg() {
		this.props.form.setFormItemsValue(AREA.bomcardh, {
			hcmaterialid: {
				value: '',
				display: ''
			},
			hcmaterialvid: {
				value: '',
				display: ''
			},
			fbomtype: {
				value: '1',
				display: this.state.json['10140BOMM2-000011']/* 国际化处理： 生产BOM*/
			},
			hfversiontype: {
				value: '2',
				display: this.state.json['10140BOMM2-000012']/* 国际化处理： 无效版本*/
			}
		});

		this.props.cardTable.setTableData(AREA.bomcarditem, {
			rows: []
		});
		this.props.cardTable.setTableData(AREA.bomcardoutputs, {
			rows: []
		});
		this.props.cardTable.setTableData(AREA.bomcarduseorg, {
			rows: []
		});

		let num = this.props.cardTable.getNumberOfRows(AREA.bomcarduseorg); //获取列表总行数
		if (num > 0) {
			this.props.cardTable.delRowsByIndex(AREA.bomcarduseorg, 0);
		}

		if (this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value) {
			ajax({
				url: URL.queryOrgVid,
				data: { pk_org: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value },
				success: (res) => {
					if (res.success) {
						if (res.data) {
							this.props.form.setFormItemsValue(AREA.bomcardh, 'pk_org_v', {
								value: res.data[this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value]
							});
							this.props.cardTable.addRow(AREA.bomcarditem);
							let pk_group = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
							let pk_org = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
							let pk_org_v = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
							let num = this.props.cardTable.getNumberOfRows(AREA.bomcarditem); //获取列表总行数
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org', { value: pk_org });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_group', {
								value: pk_group
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org_v', {
								value: pk_org_v
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nassitemnum', { value: 1 });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nitemnum', { value: 1 });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'ibasenum', { value: '1' });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemsource', {
								value: '1',
								display: this.state.json['10140BOMM2-000000']/* 国际化处理： 备料*/
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemtype', {
								value: '1',
								display: this.state.json['10140BOMM2-000001']/* 国际化处理： 普通*/
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtype', {
								value: '3',
								display: this.state.json['10140BOMM2-000002']/* 国际化处理： 交互倒冲*/
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtime', {
								value: '1',
								display: this.state.json['10140BOMM2-000003']/* 国际化处理： 产品完工*/
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fsupplymode', {
								value: '1',
								display: this.state.json['10140BOMM2-000004']/* 国际化处理： 一般发料*/
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fcontrol', {
								value: '2',
								display: this.state.json['10140BOMM2-000005']/* 国际化处理： 不控制*/
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bdeliver', { value: true });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbsteploss', { value: false });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbunibatch', { value: false });
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbchkitemforwr', {
								value: true
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cendperiod', {
								value: '2099-12-31 23:59:59'
							});
							this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cbeginperiod', {
								value: (getBusinessInfo().businessDate.substr(0, 10) + " 00:00:00")
							});

							RownoUtils.setRowNo(this.props, AREA.bomcarditem, 'vrowno');
							console.log('line2424:SureChangeOrg-toggle')
							toggleShow(this.props);

							this.props.button.setButtonDisabled(['ResetRow'], false);
						}
					}
				}
			});
			this.props.cardTable.addRow(AREA.bomcarduseorg, 0, {
				pk_org: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org'),
				pk_org_v: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v'),
				pk_useorg: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org'),
				pk_useorg_v: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v'),
				'pk_useorg.name': { value: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').display }
			});
		} else {
			console.log('line2440:SureChangeOrg-toggle')
			toggleShow(this.props);
			this.props.button.setButtonVisible(['InsertLine', '', 'PasteLine', 'OutputsPasteLine'], false);
		}
	}

	afterEvent(props, moduleId, key, value, oldValue) {
		if (value.value == oldValue.value) {
			return;
		}
		switch (key) {
			case 'pk_org':
				if (oldValue && oldValue.value) {
					//  props.modal.show('sureChangeOrg');
					showWarningDialog(this.state.json['110140BOMM3027'], this.state.json['110140BOMM3026'], {
						/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
						beSureBtnClick: this.sureChangeOrg.bind(this)
					});
				}
				else {
					if (value && value.value) {
						ajax({
							url: URL.queryOrgVid,
							data: { pk_org: value.value },
							success: (res) => {
								if (res.success) {
									if (res.data) {
										this.props.form.setFormItemsValue(AREA.bomcardh, {
											'pk_org_v': {
												value: res.data[value.value]
											}
										});
										this.props.cardTable.addRow(AREA.bomcarditem);
										let pk_group = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
										let pk_org = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
										let pk_org_v = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
										let num = this.props.cardTable.getNumberOfRows(AREA.bomcarditem); //获取列表总行数
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org', { value: pk_org });
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_group', {
											value: pk_group
										});
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org_v', {
											value: pk_org_v
										});
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nassitemnum', { value: 1 });
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nitemnum', { value: 1 });
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'ibasenum', { value: '1' });
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemsource', {
											value: '1',
											display: this.state.json['10140BOMM2-000000']/* 国际化处理： 备料*/
										});
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemtype', {
											value: '1',
											display: this.state.json['10140BOMM2-000001']/* 国际化处理： 普通*/
										});
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtype', {
											value: '3',
											display: this.state.json['10140BOMM2-000002']/* 国际化处理： 交互倒冲*/
										});
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtime', {
											value: '1',
											display: this.state.json['10140BOMM2-000003']/* 国际化处理： 产品完工*/
										});
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fsupplymode', {
											value: '1',
											display: this.state.json['10140BOMM2-000004']/* 国际化处理： 一般发料*/
										});
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fcontrol', {
											value: '2',
											display: this.state.json['10140BOMM2-000005']/* 国际化处理： 不控制*/
										});
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bdeliver', { value: true });
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbsteploss', { value: false });
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbunibatch', { value: false });
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbchkitemforwr', {
											value: true
										});
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cendperiod', {
											value: '2099-12-31 23:59:59'
										});
										this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cbeginperiod', {
											value: (getBusinessInfo().businessDate.substr(0, 10) + " 00:00:00")
										});

										RownoUtils.setRowNo(this.props, AREA.bomcarditem, 'vrowno');

										console.log('line2526:afterevent-pkorg-toggle')
										toggleShow(this.props);

										this.props.button.setButtonDisabled(['ResetRow'], false);
									}
								}
							}
						});
						this.props.cardTable.addRow(AREA.bomcarduseorg, 0, {
							pk_org: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org'),
							pk_org_v: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v'),
							pk_useorg: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org'),
							pk_useorg_v: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v'),
							'pk_useorg.code': {
								value: value.refcode
							},
							'pk_useorg.name': {
								value: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').display
							}
						});
						console.log('line2546:afterevent-pkorg-toggle')
						toggleShow(this.props);
					}
				}

				break;
			case 'hcmaterialid':
				{
					if (value && value.value) {
						ajax({
							url: URL.matoidevent,
							data: {
								pk_org: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
								hcmaterialid: value.value,
								hnassparentnum: 1,
								hnparentnum: 1,
								fbomtype: this.props.form.getFormItemsValue(AREA.bomcardh, 'fbomtype').value,
							},
							success: (res) => {
								if (res.success) {
									if (res.data) {
										console.log(res.data);
										this.props.form.setFormItemsValue(AREA.bomcardh, {
											hcmaterialname: { value: '', display: '' },
											hcassmeasureid: { value: '', display: '' },
											hcmeasureid: { value: '', display: '' },
											hbdefault: { value: false },
											'hcmaterialvid.graphid': { value: '', display: '' },
											'hcmaterialvid.materialspec': { value: '', display: '' },
											'hcmaterialvid.materialtype': { value: '', display: '' },
											hversion: { value: '', display: '' },
											hiswholesetsend: { value: false, display: '' },
											hisvirtual: { value: false, display: '' },
											hcmaterialvid: { value: '', display: '' }
										});
										this.props.form.setFormItemsValue(AREA.bomcardh, {
											hcassmeasureid:
												res.data.form[AREA.bomcardh].rows[0].values['hcassmeasureid'],
											hcmeasureid: res.data.form[AREA.bomcardh].rows[0].values['hcmeasureid'],
											hbdefault: { value: res.data.hbdefault == 'true' },
											hcmaterialname: {
												value: res.data.hcmaterialname,
												display: res.data.hcmaterialname
											},
											hisvirtual: { value: res.data.hisvirtual == 'true' },
											hiswholesetsend: { value: res.data.hiswholesetsend == 'true' },
											hvchangerate: {
												value: res.data.hvchangerate,
												display: res.data.hvchangerate
											},
											hversion: { value: res.data.hversion, display: res.data.hversion },
											hnassparentnum: {
												...res.data.form[AREA.bomcardh].rows[0].values['hnassparentnum']
											},
											hnparentnum: {

												...res.data.form[AREA.bomcardh].rows[0].values['hnparentnum']

											},
											'hcmaterialvid.graphid': {
												value: res.data['hcmaterialvid.graphid'],
												display: res.data['hcmaterialvid.graphid']
											},
											'hcmaterialvid.materialspec': {
												value: res.data['hcmaterialvid.materialspec'],
												display: res.data['hcmaterialvid.materialspec']
											},
											'hcmaterialvid.materialtype': {
												value: res.data['hcmaterialvid.materialtype'],
												display: res.data['hcmaterialvid.materialtype']
											}
											// 'hcmaterialvid':{value:this.props.form.getFormItemsValue(AREA.bomcardh,'hcmaterialvid'),}
										});
									}
								}
							}
						});
					} else {
						this.props.form.setFormItemsValue(AREA.bomcardh, {
							hcmaterialname: { value: '', display: '' },
							hcassmeasureid: { value: '', display: '' },
							hcmeasureid: { value: '', display: '' },
							hbdefault: { value: false },
							'hcmaterialvid.graphid': { value: '', display: '' },
							'hcmaterialvid.materialspec': { value: '', display: '' },
							'hcmaterialvid.materialtype': { value: '', display: '' },
							hversion: { value: '', display: '' },
							hiswholesetsend: { value: false, display: '' },
							hisvirtual: { value: false, display: '' },
							hcmaterialvid: { value: '', display: '' }
						});
					}
				}
				break;
			case 'hcmaterialvid':
				{
					if (value && value.value) {
						ajax({
							url: URL.matvidevent,
							data: {
								pk_org: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
								hcmaterialid: this.props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialid').value,
								hcmaterialvid: value.value,
								fbomtype: this.props.form.getFormItemsValue(AREA.bomcardh, 'fbomtype').value,
							},
							success: (res) => {
								if (res.success) {
									if (res.data) {
										console.log(res.data);
										this.props.form.setFormItemsValue
										(AREA.bomcardh, {hcmaterialvid: {
											value: '',
											display:''
										}})

										console.log(this.props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialvid'));

										this.props.form.setFormItemsValue(AREA.bomcardh, {
											hcassmeasureid:
												res.data.form[AREA.bomcardh].rows[0].values['hcassmeasureid'],
											hcmeasureid: res.data.form[AREA.bomcardh].rows[0].values['hcmeasureid'],
											hbdefault: { value: res.data.hbdefault == 'true' },
											hcmaterialname: {
												value: res.data.hcmaterialname,
												display: res.data.hcmaterialname
											},
											hisvirtual: { value: res.data.hisvirtual == 'true' },
											hiswholesetsend: { value: res.data.hiswholesetsend == 'true' },
											hvchangerate: {
												value: res.data.hvchangerate,
												display: res.data.hvchangerate
											},
											hversion: { value: res.data.hversion, display: res.data.hversion },
											hcmaterialvid: {
												value: value.value,
												display: res.data.matversion
											}
										});
									}
								}
							}
						});
					} else {
						ajax({
							url: URL.matoidevent,
							data: {
								pk_org: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
								hcmaterialid: this.props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialid').value,
								hnassparentnum: 1,
								hnparentnum: 1,
								fbomtype: this.props.form.getFormItemsValue(AREA.bomcardh, 'fbomtype').value,
							},
							success: (res) => {
								if (res.success) {
									if (res.data) {
										console.log(res.data);
										this.props.form.setFormItemsValue(AREA.bomcardh, {
											hcassmeasureid:
												res.data.form[AREA.bomcardh].rows[0].values['hcassmeasureid'],
											hcmeasureid: res.data.form[AREA.bomcardh].rows[0].values['hcmeasureid'],
											hbdefault: { value: res.data.hbdefault == 'true' },
											hcmaterialname: {
												value: res.data.hcmaterialname,
												display: res.data.hcmaterialname
											},
											hisvirtual: { value: res.data.hisvirtual == 'true' },
											hiswholesetsend: { value: res.data.hiswholesetsend == 'true' },
											hvchangerate: {
												value: res.data.hvchangerate,
												display: res.data.hvchangerate
											},
											hversion: { value: res.data.hversion, display: res.data.hversion },
											hnassparentnum: {
												...res.data.form[AREA.bomcardh].rows[0].values['hnassparentnum']
											},
											hnparentnum: {

												...res.data.form[AREA.bomcardh].rows[0].values['hnparentnum']

											},

											'hcmaterialvid.graphid': {
												value: res.data['hcmaterialvid.graphid'],
												display: res.data['hcmaterialvid.graphid']
											},
											'hcmaterialvid.materialspec': {
												value: res.data['hcmaterialvid.materialspec'],
												display: res.data['hcmaterialvid.materialspec']
											},
											'hcmaterialvid.materialtype': {
												value: res.data['hcmaterialvid.materialtype'],
												display: res.data['hcmaterialvid.materialtype']
											}
											// 'hcmaterialvid':{value:this.props.form.getFormItemsValue(AREA.bomcardh,'hcmaterialvid'),}
										});
									}
								}
							}
						});
					}
				}
				break;
			case 'hfversiontype':
				{
					if (value.value == '2') {
						this.props.form.setFormItemsValue(AREA.bomcardh, { hbdefault: { value: false } });
						this.props.form.setFormItemsDisabled(AREA.bomcardh, {
							hbdefault: true
						});
					} else {
						this.props.form.setFormItemsValue(AREA.bomcardh, { hbdefault: { value: true } });
						this.props.form.setFormItemsDisabled(AREA.bomcardh, {
							hbdefault: false
						});
					}
				}
				break;
			case 'hnassparentnum':
				{
					if (value && value.value) {
						ajax({
							url: URL.hnassnum,
							data: {
								//pk_org: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
								//hcmaterialid: value.value,
								hnassparentnum: Number(value.value),
								hcmeasureid: this.props.form.getFormItemsValue(AREA.bomcardh, 'hcmeasureid').value,
								hcassmeasureid: this.props.form.getFormItemsValue(AREA.bomcardh, 'hcassmeasureid')
									.value,
								hvchangerate: this.props.form.getFormItemsValue(AREA.bomcardh, 'hvchangerate').value
							},
							success: (res) => {
								if (res.success) {
									if (res.data) {
										console.log(res.data);
										this.props.form.setFormItemsValue(AREA.bomcardh, {
											hnparentnum: { value: Number(res.data.hnparentnum) }
										});
									}
								}
							}
						});
					}
				}
				break;
			case 'hnparentnum':
				{
					if (value && value.value) {
						ajax({
							url: URL.hnnum,
							data: {
								//pk_org: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
								//hcmaterialid: value.value,
								hnparentnum: Number(value.value),
								hcmeasureid: this.props.form.getFormItemsValue(AREA.bomcardh, 'hcmeasureid').value,
								hcassmeasureid: this.props.form.getFormItemsValue(AREA.bomcardh, 'hcassmeasureid')
									.value,
								hvchangerate: this.props.form.getFormItemsValue(AREA.bomcardh, 'hvchangerate').value
							},
							success: (res) => {
								if (res.success) {
									if (res.data) {
										console.log(res.data);
										this.props.form.setFormItemsValue(AREA.bomcardh, {
											hnassparentnum: { value: Number(res.data.hnassparentnum) }
										});
									}
								}
							}
						});
					}
				}
				break;
			case 'fbomtype': {
				let curl = this.props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialvid').value ? URL.matvidevent : URL.matoidevent
				ajax({
					url: curl,
					data: {
						pk_org: this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
						hcmaterialid: this.props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialid').value,
						hcmaterialvid: this.props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialvid').value,
						fbomtype: value.value,
						hnassparentnum: 1,
						hnparentnum: 1
					},
					success: (res) => {
						if (res.success) {
							if (res.data) {
								console.log(res.data);
								this.props.form.setFormItemsValue(AREA.bomcardh, {

									hversion: { value: res.data.hversion, display: res.data.hversion },

								});
							}
						}
					}
				});
			} break;
		}
	}

	beforeEvent(props, areaid, key) {
		return true;
	}
	OnHideSun() {
		return () => {
			this.setState({
				showGrand: false,
				wipsmaintain:false,
			});	

			
			console.log(this.state.buffer)
			let olddata = this.state.buffer
			this.props.cardTable.getAllRows(AREA.bomcarditem).forEach((row) => {
				
				for(let i = 0; i < olddata.length; i++){
					if(row.values.cbom_bid.value === olddata[i][0].values.cbom_bid.value){
						row.bomwips = olddata[i][0].bomwips
						row.bompos = olddata[i][0].bompos
						row.bomrepls = olddata[i][0].bomrepls
						row.bomloss = olddata[i][0].bomloss
					}
				}
			})
			// this.props.cardTable.setTableData(AREA.bomcarditem, this.state.buffer)
			console.log(this.props.cardTable.getAllRows(AREA.bomcarditem))
			this.setState({buffer: []})
			
		};
	}
	onConfirmSun() {
		return () => {
			this.setState({
				showGrand: false,
				wipsmaintain:false,

			});
			console.log(this.refs.itemcontent.cardTable.getAllRows(AREA.bomcarditem));
			let grandrows = this.refs.itemcontent.cardTable.getAllRows(AREA.bomcarditem);


			// grandrows.forEach((item) => {
			// 	let originrows = this.props.cardTable.getAllRows(AREA.bomcarditem);
			// 	let matchrow = originrows.find((currow) => currow.vrowno == item.vrowno);
			// 	matchrow.bomwips = item.bomwips;
			// 	matchrow.bompos = item.bompos;
			// 	matchrow.bomrepls = item.bomrepls;
			// 	matchrow.bomloss = item.bomloss;
			// });
			if (
				this.refs.itemcontent.cardTable.getStatus(AREA.bomwips) == 'edit' &&
				//this.refs.itemcontent.cardTable.getStatus(AREA.bomloss) == 'browse'&&
				this.props.getUrlParam('status')=='browse'
			) {
				// 空行过滤
				this.props.cardTable.filterEmptyRows(AREA.bomcarditem, ['cmaterialvid'], 'include');

				let CardData = this.props.createExtCardData(PAGECODE.bom_card, AREA.bomcardh, [
					AREA.bomcarditem,
					AREA.bomcardoutputs,
					AREA.bomcarduseorg
				]);
				delete CardData.head[AREA.bomcardh].rows[0].values[childValues];

				let itemrows = CardData.bodys[AREA.bomcarditem].rows;
				itemrows.forEach((item) => {
					item.status = '1';
					if (item.bomwips) {
						let data = {
							pageid: PAGECODE.bom_grand,
							model: {
								areaType: 'table',
								pageinfo: null,
								rows: [],
								areacode: AREA.bomwips //添加表单的areacode编码
							}
						};
						data.model.rows = item.bomwips.rows;
						item.values.bomwips = { value: JSON.stringify(data) };
					}
					if (item.bomloss) {
						let data = {
							pageid: PAGECODE.bom_grand,
							model: {
								areaType: 'table',
								pageinfo: null,
								rows: [],
								areacode: AREA.bomloss //添加表单的areacode编码
							}
						};
						data.model.rows = item.bomloss.rows;
						item.values.bomloss = { value: JSON.stringify(data) };
					}
					if (item.bomrepls) {
						let data = {
							pageid: PAGECODE.bom_grand,
							model: {
								areaType: 'table',
								pageinfo: null,
								rows: [],
								areacode: AREA.bomrepls //添加表单的areacode编码
							}
						};
						data.model.rows = item.bomrepls.rows;
						item.values.bomrepls = { value: JSON.stringify(data) };
					}
					if (item.bompos) {
						let data = {
							pageid: PAGECODE.bom_grand,
							model: {
								areaType: 'table',
								pageinfo: null,
								rows: [],
								areacode: AREA.bompos //添加表单的areacode编码
							}
						};
						data.model.rows = item.bompos.rows;
						item.values.bompos = { value: JSON.stringify(data) };
					}
				});
				// CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;

				let url = URL.update; //修改保存

				ajax({
					url: url,
					data: CardData,
					success: (res) => {
						let pk_value = null;
						if (res.success) {
							if (res.data) {
								setTimeout(() => {
									if (res.data.head) {
										this.props.form.setAllFormValue({
											[AREA.bomcardh]: res.data.head[AREA.bomcardh]
										});
										pk_value = res.data.head[AREA.bomcardh].rows[0].values['cbomid'].value;
										console.log('line2982:onConfirmSun-toggle')
										toggleShow(this.props);
									}
									//let tabs = [AREA.bomcarditem, AREA.bomcardoutputs, AREA.bomcarduseorg];

									if (res.data.bodys) {
										this.props.cardTable.setTableData(
											AREA.bomcarditem,
											res.data.bodys[AREA.bomcarditem]
										);
										this.props.cardTable.setTableData(
											AREA.bomcardoutputs,
											res.data.bodys[AREA.bomcardoutputs]?res.data.bodys[AREA.bomcardoutputs]:{rows:[]}
										);
										this.props.cardTable.setTableData(
											AREA.bomcarduseorg,
											res.data.bodys[AREA.bomcarduseorg]
										);
									} else {
										this.props.cardTable.setAllTabsData([], tabs);
										this.setState({
											tableData: []
										});
									}
								}, 0);
							}

							// this.props.pushTo('/card', {
							// 	status: 'browse',
							// 	id: pk_value
							// });
							// toggleShow(this.props);
							this.getdata(this.props.form.getFormItemsValue(AREA.bomcardh,'cbomid').value);
							//特殊设置一下返回按钮的可见性
							this.props.BillHeadInfo.setBillHeadInfoVisible({
								showBackBtn: true
							});

							//修改保存
							// updateCache(
							// 	'cbomid',
							// 	res.data.head[AREA.bomcardh].rows[0].values['cbomid'].value,
							// 	res.data,
							// 	AREA.bomcardh,
							// 	dataSource
							// );

							toast({
								content: this.state.json['110140PST0037'],
								color: 'success'
							}); /* 国际化处理： 保存成功*/
						}
					},error: (err) => {
						toast({ color: 'danger', content: err.message });
					}
				});
				
			}
		};
	}
	//通过单据id查询单据信息
	getdata = (pk, callback) => {
		let data = {
			pk
		};
		ajax({
			url: URL.queryCard,
			data,
			success: (res) => {
				setTimeout(() => {
					if (res.data.head) {
						this.props.form.setAllFormValue({
							[AREA.bomcardh]: res.data.head[AREA.bomcardh]
						});

						console.log('line3057:getData-toggle')
						toggleShow(this.props);
						this.props.button.setButtonVisible(['PasteLine', 'OutputsPasteLine'], false)
						if (!getDefData('permorgs', dataSource).includes(res.data.head[AREA.bomcardh].rows[0].values.pk_org.value)) {
							this.props.button.setButtonDisabled(
								[
									'Default',
									'CancelDefault',
									'Assign',
									'Unassign',
									'Commit',
									'UnCommit',
									'Enable',
									'Disable',
									'Copy',
									'Edit',
									'ReviseEdit',
									'Delete',
									'gylxyzx'
								],
								true
							);
							this.props.button.setButtonVisible(
								[
									'Default',
									'CancelDefault',
									'Assign',
									'Unassign',
									'Commit',
									'UnCommit',
									'Enable',
									'Disable',
									'Copy',
									'Edit',
									'ReviseEdit',
									'Delete',
									'gylxyzx'
								],
								false
							);
							if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 1) {
								this.props.button.setButtonDisabled(
									[
										'WipsMaintain'
									],
									false
								);
							}
							else {
								this.props.button.setButtonDisabled(
									[
										'WipsMaintain'
									],
									true
								);

							}

						} else {
							console.log(this.props.getUrlParam('status'))
							if(this.props.getUrlParam('status') == 'browse'){
							this.props.button.setButtonDisabled(['WipsMaintain'], true);

							if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 1) {
								this.props.button.setButtonDisabled(['ReviseEdit', 'Assign', 'Unassign'], false);
								this.props.button.setButtonDisabled(['Edit',], true);
								this.props.button.setButtonVisible(['ReviseEdit', 'Assign', 'Unassign'], true);
								this.props.button.setButtonVisible(['Edit',], false);
							} else if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 2) {
								this.props.button.setButtonDisabled(['ReviseEdit', 'Edit', 'Assign', 'Unassign'], true);
								this.props.button.setButtonDisabled('UnCommit', false);
								this.props.button.setButtonVisible(['ReviseEdit', 'Edit', 'Assign', 'Unassign'], false);
								this.props.button.setButtonVisible('UnCommit', true);
							} else {
								this.props.button.setButtonDisabled(['ReviseEdit', 'Assign'], true);
								this.props.button.setButtonDisabled(['Edit', 'Unassign'], false);
								this.props.button.setButtonVisible(['ReviseEdit', 'Assign'], false);
								this.props.button.setButtonVisible(['Edit', 'Unassign'], true);
							}
							if (res.data.head[AREA.bomcardh].rows[0].values.hfversiontype.value == 2) {
								this.props.button.setButtonDisabled({ Enable: false, Disable: true });
								this.props.button.setButtonVisible(['Enable'], true)
								this.props.button.setButtonVisible(['Disable'], false)
								// this.props.button.setButtonVisible(['Disable'], false)
							} else {
								this.props.button.setButtonDisabled({ Enable: true, Disable: false });
								this.props.button.setButtonVisible(['Enable'], false)
								this.props.button.setButtonVisible(['Disable'], true)
								// this.props.button.setButtonVisible(['Enable'], false)
							}
							if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == '1') {
								if (res.data.head[AREA.bomcardh].rows[0].values.hfversiontype.value == '1') {
									if (res.data.head[AREA.bomcardh].rows[0].values.hbdefault.value == true) {
										this.props.button.setButtonDisabled({ CancelDefault: false, Default: true });
										this.props.button.setButtonVisible(['Default'], false)
										this.props.button.setButtonVisible(['CancelDefault'], true)
									} else {
										this.props.button.setButtonDisabled({ CancelDefault: true, Default: false });
										this.props.button.setButtonVisible(['Default'], true)
										this.props.button.setButtonVisible(['CancelDefault'], false)
									}
								} else {
									this.props.button.setButtonDisabled(['Default', 'CancelDefault'], true);
									this.props.button.setButtonVisible(['Default', 'CancelDefault'], false)
								}
							} else {
								this.props.button.setButtonDisabled(['Default', 'CancelDefault', 'Enable', 'Disable'], true);
								this.props.button.setButtonVisible(['Default', 'CancelDefault', 'Enable', 'Disable'], false)
							}
							if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value != '-1') {
								this.props.button.setButtonDisabled(['Delete'], true);
								this.props.button.setButtonVisible(['Delete'], false)
							} else {
								this.props.button.setButtonDisabled(['Delete'], false);
								this.props.button.setButtonVisible(['Delete'], true)
							}
							if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value != '-1') {
								this.props.button.setButtonDisabled(['Commit'], true);
								this.props.button.setButtonDisabled(['UnCommit'], false);
								this.props.button.setButtonVisible(['Commit'], false)
								this.props.button.setButtonVisible(['UnCommit'], true)

							} else {
								this.props.button.setButtonDisabled(['Commit'], false);
								this.props.button.setButtonDisabled(['UnCommit'], true);
								this.props.button.setButtonVisible(['Commit'], true)
								this.props.button.setButtonVisible(['UnCommit'], false)
							}
						}

						}
						
						console.log(this.props.button.getButtons())
						updateCache(
							'cbomid',
							res.data.head[AREA.bomcardh].rows[0].values['cbomid'].value,
							res.data,
							AREA.bomcardh,
							dataSource
						)
					}

					//let tabs = [AREA.bomcarditem, AREA.bomcardoutputs, AREA.bomcarduseorg];

					if (res.data.bodys) {
						this.props.cardTable.setTableData(AREA.bomcarditem, res.data.bodys[AREA.bomcarditem]);
						this.props.cardTable.setTableData(AREA.bomcardoutputs, res.data.bodys[AREA.bomcardoutputs]?res.data.bodys[AREA.bomcardoutputs]: {
							rows: []
						});
						this.props.cardTable.setTableData(AREA.bomcarduseorg, res.data.bodys[AREA.bomcarduseorg]);

						if (this.props.getUrlParam('reviseEdit')) {
							let bomcarditem = [
								'vrowno',
								'cmaterialvid',
								
								'cassmeasureid',
								'vchangerate',
								'nassitemnum',
								'ibasenum',
								'vitemversion',
								'vpackversion',
								'nbfixshrinkastnum',
								'ndissipationum',
								'fcontrol',
								'bcanreplace',
								'freplacetype',
								'cbeginperiod',
								'cendperiod',
								'bcustommaterial',
								'bprojectmaterial',
								'ccustomerid',
								'cvendorid',
								'cproductorid',
								'cprojectid'
							];
							this.props.cardTable.setColEditableByKey(AREA.bomcarditem, bomcarditem);
						}

						let data = {
							cbomid: this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value
						};
						ajax({
							url: URL.queryGrand,
							data: data,
							loading: false,
							success: (res) => {
								console.log(res);
								if (res && res.data) {
									this.props.cardTable.getAllRows(AREA.bomcarditem).forEach((row) => {
										if (res.data[row.values.cbom_bid.value] && res.data[row.values.cbom_bid.value].bodys) {
											row.bomwips = res.data[row.values.cbom_bid.value].bodys.bomwips;
											row.bomrepls = res.data[row.values.cbom_bid.value].bodys.bomrepls;
											row.bompos = res.data[row.values.cbom_bid.value].bodys.bompos;
											row.bomloss = res.data[row.values.cbom_bid.value].bodys.bomloss;
										}
									});
									setDefData('lastGrand', dataSource, deepClone(res.data));
								}
							}
						});
					} else {
						this.props.cardTable.setAllTabsData([], tabs);
						this.setState({
							tableData: []
						});
					}
				}, 0);

				if (callback && typeof callback == 'function') {
					callback.call(this);
				}
			}
		});
	};

	/**
   * @description: 判断第一个参数是否为空，后面可以传其他【认为是空值】的参数
   * @param {}
   * @return: Boolean
   */
	isEmpty(val, ...rest) {
		if (val === null || val === undefined || rest.find((e) => e == val)) {
			return true;
		}
		return false;
	}

	setReferValueSimple(oldData, formData) {
		for (let pop in formData.rows[0]) {
			if (!this.isEmpty(formData.rows[0][pop].value)) {
				oldData.rows[0][pop] = {
					value: formData.rows[0][pop].value,
					display: formData.rows[0][pop].display
				};
			}
		}
		return oldData;
	}
	onCardOutputsBeforeEvent = (props, moduleId, key, value, index, record, status) => {
		let iscontinue = true;
		if (key instanceof Object) {
			switch (key.key) {
				case 'cmaterialvid':
					{
						props.cardTable.setQueryCondition(AREA.bomcardoutputs, {
							cmaterialvid: () => {
								return {
									isShowVerison: true,
									pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
									GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.CmaterialvidFilter'
								};
							}
						});
						// let item = props.meta
						// 	.getMeta()
						// 	[AREA.bomcardoutputs].items.find((item) => item.attrcode == 'cmaterialvid');
						// item.queryCondition = () => {
						// 	return {
						// 		isShowVerison: true,
						// 		pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
						// 		GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.CmaterialvidFilter'
						// 	};
						// };
					}
					break;
				case 'castunitid':
					{
						props.cardTable.setQueryCondition(AREA.bomcardoutputs, {
							castunitid: () => {
								return {
									isShowVerison: true,
									cmaterialvid: props.cardTable.getValByKeyAndIndex(
										AREA.bomcardoutputs,
										value,
										'cmaterialvid'
									).value,
									GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.AstMeasureFilter'
								};
							}
						});
						// let item = props.meta
						// 	.getMeta()
						// 	[AREA.bomcardoutputs].items.find((item) => item.attrcode == 'castunitid');
						// item.queryCondition = () => {
						// 	return {
						// 		isShowVerison: true,
						// 		cmaterialvid: props.cardTable.getValByKeyAndIndex(
						// 			AREA.bomcardoutputs,
						// 			index,
						// 			'cmaterialvid'
						// 		).value,
						// 		GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.AstMeasureFilter'
						// 	};
						// };
					}
					break;
				case 'vchangerate':
					{
						let data = {
							key,
							cmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcardoutputs, index, 'cmaterialvid')
								.value,
							cmeasureid: props.cardTable.getValByKeyAndIndex(AREA.bomcardoutputs, index, 'cunitid').value,
							cassmeasureid: props.cardTable.getValByKeyAndIndex(AREA.bomcardoutputs, index, 'castunitid')
								.value,
							model: {}
						};
						data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcardoutputs, index);
						ajax({
							url: URL.beforeBodyEdit,
							async: false,
							data,
							success: (res) => {
								iscontinue = res[key];
							}
						});
					}
					break;
			}
		} else {
			switch (key) {
				case 'cmaterialvid':
					{
						props.cardTable.setQueryCondition(AREA.bomcardoutputs, {
							cmaterialvid: () => {
								return {
									isShowVerison: true,
									pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
									GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.CmaterialvidFilter'
								};
							}
						});
						// let item = props.meta
						// 	.getMeta()
						// 	[AREA.bomcardoutputs].items.find((item) => item.attrcode == 'cmaterialvid');
						// item.queryCondition = () => {
						// 	return {
						// 		isShowVerison: true,
						// 		pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
						// 		GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.CmaterialvidFilter'
						// 	};
						// };
					}
					break;
				case 'castunitid':
					{
						props.cardTable.setQueryCondition(AREA.bomcardoutputs, {
							castunitid: () => {
								return {
									isShowVerison: true,
									cmaterialvid: props.cardTable.getValByKeyAndIndex(
										AREA.bomcardoutputs,
										index,
										'cmaterialvid'
									).value,
									GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.AstMeasureFilter'
								};
							}
						});
						// let item = props.meta
						// 	.getMeta()
						// 	[AREA.bomcardoutputs].items.find((item) => item.attrcode == 'castunitid');
						// item.queryCondition = () => {
						// 	return {
						// 		isShowVerison: true,
						// 		cmaterialvid: props.cardTable.getValByKeyAndIndex(
						// 			AREA.bomcardoutputs,
						// 			index,
						// 			'cmaterialvid'
						// 		).value,
						// 		GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.AstMeasureFilter'
						// 	};
						// };
					}
					break;
				case 'vchangerate':
					{
						let data = {
							key,
							cmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcardoutputs, index, 'cmaterialvid')
								.value,
							cmeasureid: props.cardTable.getValByKeyAndIndex(AREA.bomcardoutputs, index, 'cunitid').value,
							cassmeasureid: props.cardTable.getValByKeyAndIndex(AREA.bomcardoutputs, index, 'castunitid')
								.value,
							model: {}
						};
						data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcardoutputs, index);
						ajax({
							url: URL.beforeBodyEdit,
							async: false,
							data,
							success: (res) => {
								iscontinue = res[key];
							}
						});
					}
					break;
			}
		}

		return iscontinue;
	};
	onCardItemBeforeEvent = (props, moduleId, key, value, index, record, status) => {
		let iscontinue = true;
		if (key instanceof Object) {
			switch (key.key) {
				case 'cmaterialvid':
					{
						props.cardTable.setQueryCondition(AREA.bomcarditem, {
							cmaterialvid: () => {
								return {
									isShowVerison: true,
									pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
									GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.CmaterialvidFilter'
								};
							}
						});
						// let item = props.meta
						// 	.getMeta()
						// 	[AREA.bomcarditem].items.find((item) => item.attrcode == 'cmaterialvid');
						// item.queryCondition = () => {
						// 	return {
						// 		isShowVerison: true,
						// 		pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
						// 		GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.CmaterialvidFilter'
						// 	};
						// };
					}
					break;
				case 'cassmeasureid':
					{
						let item = props.meta
							.getMeta()
						[AREA.bomcarditem].items.find((item) => item.attrcode == 'cassmeasureid');
						item.queryCondition = () => {
							return {
								isShowVerison: true,
								cmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'cmaterialvid')
									.value,
								GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.AstMeasureFilter'
							};
						};
					}
					break;
				case 'vchangerate':
					{
						let data = {
							key: key.key,
							cmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'cmaterialvid')
								.value,
							cmeasureid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'cmeasureid').value,
							cassmeasureid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'cassmeasureid')
								.value,
							model: {}
						};
						data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, value);
						ajax({
							url: URL.beforeBodyEdit,
							async: false,
							data,
							success: (res) => {
								iscontinue = res[key.key];
							}
						});
					}
					break;
				case 'fbackflushtime':
					{
						if (props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'fbackflushtype').value == 1) {
							iscontinue = false;
						}
					}
					break;
				case 'bkitmaterial':
					{
						if (props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'fsupplymode').value == 2) {
							iscontinue = false;
						}
					}
					break;
				case 'fitemsource':
					{
						if (props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'fitemtype').value == 1) {
							iscontinue = true;
						} else {
							iscontinue = false;
						}
					}
					break;
				case 'ccustomerid':
					{
						if (props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'bcustommaterial').value) {
							iscontinue = false;
						} else {
							iscontinue = true;
						}
					}
					break;
				case 'cprojectid':
					{
						if (props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'bprojectmaterial').value) {
							iscontinue = false;
						} else {
							iscontinue = true;
						}
					}
					break;
				case 'bmainmaterial':
					{
						if (props.form.getFormItemsValue(AREA.bomcardh, 'fbomtype').value == 2) {
							iscontinue = false;
						}
					}
					break;
				case 'vitemversion':
					{
						let item = props.meta
							.getMeta()
						[AREA.bomcarditem].items.find((item) => item.attrcode == 'vitemversion');
						item.queryCondition = () => {
							return {
								pk_group: props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value,
								pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
								hcmaterialid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'cmaterialid')
									.value,
								hcmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'cmaterialvid')
									.value,
								fbomtype: '1'
							};
						};
					}
					break;
				case 'vpackversion':
					{
						let item = props.meta
							.getMeta()
						[AREA.bomcarditem].items.find((item) => item.attrcode == 'vpackversion');
						item.queryCondition = () => {
							return {
								pk_group: props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value,
								pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
								hcmaterialid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'cmaterialid')
									.value,
								hcmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'cmaterialvid')
									.value,
								fbomtype: '2'
							};
						};
					}
					break;
				case 'bbsteploss':
				case 'bupint':
				case 'nbfixshrinknum':
				case 'ndissipationum':
				case 'ileadtimenum':
				case 'nbfixshrinkastnum':
					{
						let data = {
							key: key.key,
							pk_org: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'pk_org').value,
							cmaterialoid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'cmaterialid').value,
							cmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, value, 'cmaterialvid').value,
							model: {}
						};
						data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, value);
						ajax({
							url: URL.beforeBodyEdit,
							async: false,
							data,
							success: (res) => {
								iscontinue = res.data[key.key];
							}
						});
					}
					break; 
			}
		} else {
			switch (key) {
				case 'cmaterialvid':
					{
						props.cardTable.setQueryCondition(AREA.bomcarditem, {
							cmaterialvid: () => {
								return {
									isShowVerison: true,
									pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
									GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.CmaterialvidFilter'
								};
							}
						});
						// let item = props.meta
						// 	.getMeta()
						// 	[AREA.bomcarditem].items.find((item) => item.attrcode == 'cmaterialvid');
						// item.queryCondition = () => {
						// 	return {
						// 		isShowVerison: true,
						// 		pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
						// 		GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.CmaterialvidFilter'
						// 	};
						// };
					}
					break;
				case 'cassmeasureid':
					{
						let item = props.meta
							.getMeta()
						[AREA.bomcarditem].items.find((item) => item.attrcode == 'cassmeasureid');
						item.queryCondition = () => {
							return {
								isShowVerison: true,
								cmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'cmaterialvid')
									.value,
								GridRefActionExt: 'nccloud.web.mmbd.bom0202.filter.body.AstMeasureFilter'
							};
						};
					}
					break;
				case 'vchangerate':
					{
						let data = {
							key,
							cmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'cmaterialvid')
								.value,
							cmeasureid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'cmeasureid').value,
							cassmeasureid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'cassmeasureid')
								.value,
							model: {}
						};
						data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
						ajax({
							url: URL.beforeBodyEdit,
							async: false,
							data,
							success: (res) => {
								iscontinue = res[key];
							}
						});
					}
					break;
				case 'fbackflushtime':
					{
						if (props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'fbackflushtype').value == 1) {
							iscontinue = false;
						}
					}
					break;
				case 'bkitmaterial':
					{
						if (props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'fsupplymode').value == 2) {
							iscontinue = false;
						}
					}
					break;
				case 'fitemsource':
					{
						if (props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'fitemtype').value == 1) {
							iscontinue = true;
						} else {
							iscontinue = false;
						}
					}
					break;
				case 'ccustomerid':
					{
						if (props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'bcustommaterial').value) {
							iscontinue = false;
						} else {
							iscontinue = true;
						}
					}
					break;
				case 'cprojectid':
					{
						if (props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'bprojectmaterial').value) {
							iscontinue = false;
						} else {
							iscontinue = true;
						}
					}
					break;
				case 'bmainmaterial':
					{
						if (props.form.getFormItemsValue(AREA.bomcardh, 'fbomtype').value == 2) {
							iscontinue = false;
						}
					}
					break;
				case 'vitemversion':
					{
						let item = props.meta
							.getMeta()
						[AREA.bomcarditem].items.find((item) => item.attrcode == 'vitemversion');
						item.queryCondition = () => {
							return {
								pk_group: props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value,
								pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
								hcmaterialid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'cmaterialid')
									.value,
								hcmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'cmaterialvid')
									.value,
								fbomtype: '1'
							};
						};
					}
					break;
				case 'vpackversion':
					{
						let item = props.meta
							.getMeta()
						[AREA.bomcarditem].items.find((item) => item.attrcode == 'vpackversion');
						item.queryCondition = () => {
							return {
								pk_group: props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value,
								pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
								hcmaterialid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'cmaterialid')
									.value,
								hcmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'cmaterialvid')
									.value,
								fbomtype: '2'
							};
						};
					}
					break;
				case 'bbsteploss':
				case 'bupint':
				case 'nbfixshrinknum':
				case 'ndissipationum':
				case 'ileadtimenum':
				case 'nbfixshrinkastnum':
					{
						let data = {
							key,
							pk_org: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'pk_org').value,
							cmaterialoid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'cmaterialid').value,
							cmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'cmaterialvid').value,
							model: {}
						};
						data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
						ajax({
							url: URL.beforeBodyEdit,
							async: false,
							data,
							success: (res) => {
								iscontinue = res.data[key];
							}
						});
					}
					break;
				case 'vfree1':
				case 'vfree2':
				case 'vfree3':
				case 'vfree4':
				case 'vfree5':
				case 'vfree6':
				case 'vfree7':
				case 'vfree8':
				case 'vfree9':
				case 'vfree10':
				case 'cprojectid':
				case 'cvendorid':
				case 'cproductorid':
				case 'ccustomerid': {
					let data = {
						key,
						pk_org: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'pk_org').value,
						prefix: 'vfree',
						cmaterialvid: props.cardTable.getValByKeyAndIndex(AREA.bomcarditem, index, 'cmaterialvid').value,
						model: {}
					};
					data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
					ajax({
						url: URL.beforeBodyEdit,
						async: false,
						data,
						success: (res) => {
							iscontinue = res.data[key];
						}
					});
				} break;

			}
		}

		return iscontinue;
	};
	onCardOutputsAfterEvent(props, moduleId, key, value, changedrows, index, record) {
		if (key == 'nbyprodsptnum') {
			if (value && Number(value) < 0) {
				props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, index, key, { value: 0 });
			} else {
				props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, index, key, { value: 0 });
			}
		}
		if (key == 'cmaterialvid') {
			if (value.values)
				props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, index, 'cmaterialid', {
					value: value.values.pk_source.value
				});
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcardoutputs //添加表单的areacode编码
				},
				userjson: 'cmaterialvid'
			};
			data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcardoutputs, index);
			ajax({
				url: URL.afterOutputsEdit,
				data,
				success: (res) => {
					console.log(res, '111');
					console.log(record, '222');

					props.cardTable.updateDataByRowId(AREA.bomcardoutputs, res.data[AREA.bomcardoutputs]);


				}
			});
		}
		if (key == 'nastoutputnum') {
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcardoutputs //添加表单的areacode编码
				},
				userjson: 'nastoutputnum'
			};
			data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcardoutputs, index);
			ajax({
				url: URL.afterOutputsEdit,
				data,
				success: (res) => {
					console.log(res);
					props.cardTable.updateDataByRowId(AREA.bomcardoutputs, res.data[AREA.bomcardoutputs]);
				}
			});
		}
		if (key == 'vchangerate') {
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcardoutputs //添加表单的areacode编码
				},
				userjson: 'vchangerate'
			};
			data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcardoutputs, index);
			ajax({
				url: URL.afterOutputsEdit,
				data,
				success: (res) => {
					console.log(res);
					props.cardTable.updateDataByRowId(AREA.bomcardoutputs, res.data[AREA.bomcardoutputs]);
				}
			});
		}
		if (key == 'castunitid') {
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcardoutputs //添加表单的areacode编码
				},
				userjson: 'castunitid'
			};
			data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcardoutputs, index);
			ajax({
				url: URL.afterOutputsEdit,
				data,
				success: (res) => {
					console.log(res);
					props.cardTable.updateDataByRowId(AREA.bomcardoutputs, res.data[AREA.bomcardoutputs]);
				}
			});
		}
		if (key == 'noutputnum') {
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcardoutputs //添加表单的areacode编码
				},
				userjson: 'noutputnum'
			};
			data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcardoutputs, index);
			ajax({
				url: URL.afterOutputsEdit,
				data,
				success: (res) => {
					console.log(res);
					props.cardTable.updateDataByRowId(AREA.bomcardoutputs, res.data[AREA.bomcardoutputs]);
				}
			});
		}
	}
	onCardItemAfterEvent(props, moduleId, key, value, changedrows, index, record) {
		if (key == 'cmaterialvid') {
			console.log(value, 'cmaterialvid multi')
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcarditem //添加表单的areacode编码
				},
				userjson: 'cmaterialvid'
			};
			if (value instanceof Array) {
				let count = 0
				let selrow = [];
				value.forEach(val => {
					if (!val.values) {
						count++;
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, index, 'cmaterialvid', {
							value: val.refpk, display: val.refcode
						})
						return;
					}
					//selrow.push(index)
					if (count != 0) {

						props.cardTable.addRow(AREA.bomcarditem, index + count);
					}
					let pk_group = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
					let pk_org = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
					let pk_org_v = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
					let num = index + count + 1;
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org', { value: pk_org });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_group', {
						value: pk_group
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org_v', {
						value: pk_org_v
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cmaterialid', { value: val.values.pk_source.value });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nassitemnum', { value: 1 });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nitemnum', { value: 1 });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'ibasenum', { value: '1' });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemsource', {
						value: '1',
						display: this.state.json['10140BOMM2-000000']/* 国际化处理： 备料*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemtype', {
						value: '1',
						display: this.state.json['10140BOMM2-000001']/* 国际化处理： 普通*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtype', {
						value: '3',
						display: this.state.json['10140BOMM2-000002']/* 国际化处理： 交互倒冲*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtime', {
						value: '1',
						display: this.state.json['10140BOMM2-000003']/* 国际化处理： 产品完工*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fsupplymode', {
						value: '1',
						display: this.state.json['10140BOMM2-000004']/* 国际化处理： 一般发料*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fcontrol', {
						value: '2',
						display: this.state.json['10140BOMM2-000005']/* 国际化处理： 不控制*/
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bdeliver', { value: true });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbsteploss', { value: false });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbunibatch', { value: false });
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbchkitemforwr', {
						value: true
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cendperiod', {
						value: '2099-12-31 23:59:59'
					});
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cmaterialvid', {
						value: val.refpk
					})
					this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cbeginperiod', {
						value: (getBusinessInfo().businessDate.substr(0, 10) + " 00:00:00")
					});
					selrow.push(index + count)
					count++;
				})
				data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, selrow);
				ajax({
					url: URL.afterBodyEdit,
					data,
					success: (res) => {
						console.log(res);
						props.cardTable.updateDataByRowId(AREA.bomcarditem, res.data[AREA.bomcarditem]);
						RownoUtils.setRowNo(props, AREA.bomcarditem, 'vrowno')
					}
				});

			} else {

				data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
				ajax({
					url: URL.afterBodyEdit,
					data,
					success: (res) => {
						console.log(res);
						props.cardTable.updateDataByRowId(AREA.bomcarditem, res.data[AREA.bomcarditem]);
					}
				});
			}


		}
		if (key == 'vchangerate') {
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcarditem //添加表单的areacode编码
				},
				userjson: 'vchangerate'
			};
			data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
			ajax({
				url: URL.afterBodyEdit,
				data,
				success: (res) => {
					console.log(res);
					props.cardTable.updateDataByRowId(AREA.bomcarditem, res.data[AREA.bomcarditem]);
				}
			});
		}
		if (key == 'cassmeasureid') {
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcarditem //添加表单的areacode编码
				},
				userjson: 'cassmeasureid'
			};
			data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
			ajax({
				url: URL.afterBodyEdit,
				data,
				success: (res) => {
					console.log(res);
					props.cardTable.updateDataByRowId(AREA.bomcarditem, res.data[AREA.bomcarditem]);
				}
			});
		}
		if (key == 'nbfixshrinknum') {
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcarditem //添加表单的areacode编码
				},
				userjson: 'nbfixshrinknum'
			};
			data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
			ajax({
				url: URL.afterBodyEdit,
				data,
				success: (res) => {
					console.log(res);
					props.cardTable.updateDataByRowId(AREA.bomcarditem, res.data[AREA.bomcarditem]);
				}
			});
		}
		if (key == 'nbfixshrinkastnum') {
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcarditem //添加表单的areacode编码
				},
				userjson: 'nbfixshrinkastnum'
			};
			data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
			ajax({
				url: URL.afterBodyEdit,
				data,
				success: (res) => {
					console.log(res);
					props.cardTable.updateDataByRowId(AREA.bomcarditem, res.data[AREA.bomcarditem]);
				}
			});
		}
		if (key == 'nitemnum') {
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcarditem //添加表单的areacode编码
				},
				userjson: 'nitemnum'
			};
			data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
			ajax({
				url: URL.afterBodyEdit,
				data,
				success: (res) => {
					console.log(res);
					props.cardTable.updateDataByRowId(AREA.bomcarditem, res.data[AREA.bomcarditem]);
				}
			});
		}
		if (key == 'nassitemnum') {
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcarditem //添加表单的areacode编码
				},
				userjson: 'nassitemnum'
			};
			data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
			ajax({
				url: URL.afterBodyEdit,
				data,
				success: (res) => {
					console.log(res);
					props.cardTable.updateDataByRowId(AREA.bomcarditem, res.data[AREA.bomcarditem]);
				}
			});
		}
		if (key == 'ileadtimenum') {
			let data = {
				pageid: PAGECODE.bom_card,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [],
					areacode: AREA.bomcarditem //添加表单的areacode编码
				},
				userjson: 'ileadtimenum',
				pk_org: props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value,
				hcmaterialid: props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialid').value,
				hcmaterialvid: props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialvid').value
			};
			data.model.rows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
			ajax({
				url: URL.afterBodyEdit,
				data,
				success: (res) => {
					console.log(res);
					props.cardTable.updateDataByRowId(AREA.bomcarditem, res.data[AREA.bomcarditem]);
				}
			});
		}

		if (key == 'fitemtype') {
			if (value) {
				if (value == '1') {
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, index, 'fitemsource', {
						value: '1',
						display: this.state.json['10140BOMM2-000000']/* 国际化处理： 备料*/
					});
				} else {
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, index, 'fitemsource', {
						value: '',
						display: ''
					});
				}
			}
		}
		if (key == 'fsupplymode') {
			if (value) {
				if (value == '2') {
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, index, 'bkitmaterial', { value: false });
				}
			}
		}
		if (key == 'fitemsource') {
			if (value) {
				if (value == '2') {
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, index, 'fbackflushtype', {
						value: '1',
						display: this.state.json['10140BOMM2-000013']/* 国际化处理： 不倒冲*/
					});
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, index, 'fbackflushtime', {
						value: '',
						display: ''
					});
				}
			}
		}
		if (key == 'bprojectmaterial') {
			if (value) {
				props.cardTable.setEditableByIndex(AREA.bomcarditem, index, 'cprojectid', false);
				props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, index, 'cprojectid', { value: '', display: '' });
			} else {
				props.cardTable.setEditableByIndex(AREA.bomcarditem, index, 'cprojectid', true);
			}
		}
		if (key == 'bmainmaterial') {
			if (value) {
				let num = props.cardTable.getNumberOfRows(AREA.bomcarditem);
				for (let i = 0; i < num; i++) {
					if (i != index)
						props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, i, 'bmainmaterial', { value: false });
				}
			}
		}
		if (key == 'bcustommaterial') {
			if (value) {
				props.cardTable.setEditableByIndex(AREA.bomcarditem, index, 'ccustomerid', false);
				props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, index, 'ccustomerid', { value: '', display: '' });
			} else {
				props.cardTable.setEditableByIndex(AREA.bomcarditem, index, 'ccustomerid', true);
			}
		}
		if (key == 'fbackflushtype') {
			if (value) {
				if (value == '1') {
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, index, 'fbackflushtime', {
						value: '',
						display: ''
					});
					props.cardTable.setEditableByIndex(AREA.bomcarditem, index, 'fbackflushtime', false);
				} else {
					props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, index, 'fbackflushtime', {
						value: '1',
						display: this.state.json['10140BOMM2-000003']/* 国际化处理： 产品完工*/
					});
					props.cardTable.setEditableByIndex(AREA.bomcarditem, index, 'fbackflushtime', true);
				}
			}
		}
	}
	//提交
	commit = () => {
		// 执行提交操作
		let info = {
			pk: this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
			ts: this.props.form.getFormItemsValue(AREA.bomcardh, 'ts').value
		};

		// 拼装json
		let data = {
			pkTsParams: [info],
			pageid: PAGECODE.bom_card
		};
		//指派
		// if (assign) {
		// 	data['assign'] = JSON.stringify(assign);
		// }
		// 发送请求
		ajax({
			url: URL.commit,
			data: data,
			success: (res) => {
				if (
					res.data &&
					res.data.workflow &&
					(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
				) {
					this.commitInfo = {
						index: index,
						record: record
					};
					this.setState({
						compositedata: res.data,
						compositedisplay: true
					});
					return;
				}
				if (res.success) {

					showBatchOprMessage(null, res.data, getLangByResId(this, '10140PUBMESSAGE-000025'));
					let pk = null;
					if (this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid') && this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value) {
						pk = this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value
					} else {
						pk = this.props.getUrlParam('id')
					}
					this.getdata(pk, () => {

					});

				}
			}
		});
	};
	filterEmpty = (rows, type) => {
		let result = [];
		if (type == 'wips') {
			rows.forEach(row => {
				if (row.values.cwipid.value) {
					result.push(row)
				}
			})
		}
		if (type == 'loss') {
			rows.forEach(row => {
				if (Number.isInteger(Number.parseInt(row.values.nlfromnum.value)) && Number.parseInt(row.values.nlfromnum.value) >= 0) {
					result.push(row)
				}
			})
		}
		if (type == 'repls') {
			rows.forEach(row => {
				if (row.values.creplmaterialvid.value) {
					result.push(row)
				}
			})
		}
		if (type == 'pos') {
			rows.forEach(row => {
				if (row.values.vposition.value) {
					result.push(row)
				}
			})
		}
		return result
	}
	sureSaveClick = (CardData, saveAdd = false, saveCommit = false) => {
		this.props.cardTable.filterEmptyRows(AREA.bomcarditem, ['cmaterialvid'], 'include');
		this.props.cardTable.filterEmptyRows(AREA.bomcardoutputs, ['cmaterialvid'], 'include');

		let itemrows = CardData.bodys[AREA.bomcarditem].rows;
		itemrows.forEach((item) => {
			if (item.bomwips) {
				let data = {
					pageid: PAGECODE.bom_grand,
					model: {
						areaType: 'table',
						pageinfo: null,
						rows: [],
						areacode: AREA.bomwips //添加表单的areacode编码
					}
				};

				data.model.rows = this.filterEmpty(item.bomwips.rows, 'wips');
				item.values.bomwips = { value: JSON.stringify(data) };
			}
			if (item.bomloss) {
				let data = {
					pageid: PAGECODE.bom_grand,
					model: {
						areaType: 'table',
						pageinfo: null,
						rows: [],
						areacode: AREA.bomloss //添加表单的areacode编码
					}
				};
				data.model.rows = this.filterEmpty(item.bomloss.rows, 'loss');
				item.values.bomloss = { value: JSON.stringify(data) };
			}
			if (item.bomrepls) {
				let data = {
					pageid: PAGECODE.bom_grand,
					model: {
						areaType: 'table',
						pageinfo: null,
						rows: [],
						areacode: AREA.bomrepls //添加表单的areacode编码
					}
				};
				data.model.rows = this.filterEmpty(item.bomrepls.rows, 'repls');
				item.values.bomrepls = { value: JSON.stringify(data) };
			}
			if (item.bompos) {
				let data = {
					pageid: PAGECODE.bom_grand,
					model: {
						areaType: 'table',
						pageinfo: null,
						rows: [],
						areacode: AREA.bompos //添加表单的areacode编码
					}
				};
				data.model.rows = this.filterEmpty(item.bompos.rows, 'pos');
				item.values.bompos = { value: JSON.stringify(data) };
			}
		});
		// CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
		let url = URL.insert; //新增保存
		if (this.props.getUrlParam('status') === 'edit') {
			url = URL.update; //修改保存
		}

		ajax({
			url: url,
			data: CardData,
			success: (res) => {
				let pk_value = null;
				if (res.success) {
					if (res.data && !saveAdd) {
						if (res.data.head)
							pk_value = res.data.head[AREA.bomcardh].rows[0].values['cbomid'].value
						setTimeout(() => {
							if (res.data.head) {
								this.props.form.setAllFormValue({
									[AREA.bomcardh]: res.data.head[AREA.bomcardh]
								});
								pk_value = res.data.head[AREA.bomcardh].rows[0].values['cbomid'].value;
								console.log('line24468:sureSaveClick-toggle')
								toggleShow(this.props);
								this.props.button.setButtonVisible(['PasteLine', 'OutputsPasteLine'], false)
								if (
									!getDefData('permorgs', dataSource).includes(
										res.data.head[AREA.bomcardh].rows[0].values.pk_org.value
									)
								) {
									this.props.button.setButtonDisabled(
										[
											'Default',
											'CancelDefault',
											'Assign',
											'Unassign',
											'Commit',
											'UnCommit',
											'Enable',
											'Disable',
											'Copy',
											'Edit',
											'ReviseEdit',
											'Delete',
											'gylxyzx'
										],
										true
									);
									this.props.button.setButtonVisible(
										[
											'Default',
											'CancelDefault',
											'Assign',
											'Unassign',
											'Commit',
											'UnCommit',
											'Enable',
											'Disable',
											'Copy',
											'Edit',
											'ReviseEdit',
											'Delete',
											'gylxyzx'
										],
										false
									);
									if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 1) {
										this.props.button.setButtonDisabled(
											[
												'WipsMaintain'
											],
											false
										);
									}
									else {
										this.props.button.setButtonDisabled(
											[
												'WipsMaintain'
											],
											true
										);

									}
								} else {
									this.props.button.setButtonDisabled(['WipsMaintain'], true);

									if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 1) {
										this.props.button.setButtonDisabled(['ReviseEdit', 'Assign', 'Unassign'], false);
										this.props.button.setButtonDisabled(['Edit', 'Commit', 'UnCommit'], true);
										this.props.button.setButtonVisible(['ReviseEdit', 'Assign', 'Unassign'], true);
										this.props.button.setButtonVisible(['Edit', 'Commit', 'UnCommit'], false);
									} else if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 2) {
										this.props.button.setButtonDisabled(['Commit', 'ReviseEdit', 'Edit', 'Assign', 'Unassign'], true);
										this.props.button.setButtonDisabled('UnCommit', false);
										this.props.button.setButtonVisible(['Commit', 'ReviseEdit', 'Edit', 'Assign', 'Unassign'], false);
										this.props.button.setButtonVisible('UnCommit', true);
									} else {
										this.props.button.setButtonDisabled(['ReviseEdit', 'UnCommit', 'Assign'], true);
										this.props.button.setButtonDisabled(['Edit', 'Unassign'], false);
										this.props.button.setButtonVisible(['ReviseEdit', 'UnCommit', 'Assign'], false);
										this.props.button.setButtonVisible(['Edit', 'Unassign'], true);
									}
									if (res.data.head[AREA.bomcardh].rows[0].values.hfversiontype.value == 2) {
										this.props.button.setButtonDisabled({ Enable: false, Disable: true });
										this.props.button.setButtonVisible(['Enable'], true)
										this.props.button.setButtonVisible(['Disable'], false)
										// this.props.button.setButtonVisible(['Disable'], false)
									} else {
										this.props.button.setButtonDisabled({ Enable: true, Disable: false });
										this.props.button.setButtonVisible(['Enable'], false)
										this.props.button.setButtonVisible(['Disable'], true)
										// this.props.button.setButtonVisible(['Enable'], false)
									}
									if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == '1') {
										if (res.data.head[AREA.bomcardh].rows[0].values.hfversiontype.value == '1') {
											if (res.data.head[AREA.bomcardh].rows[0].values.hbdefault.value == true) {
												this.props.button.setButtonDisabled({ CancelDefault: false, Default: true });
												this.props.button.setButtonVisible(['CancelDefault'], true)
												this.props.button.setButtonVisible(['Default'], false)
											} else {
												this.props.button.setButtonDisabled({ CancelDefault: true, Default: false });
												this.props.button.setButtonVisible(['Default'], true)
												this.props.button.setButtonVisible(['CancelDefault'], false)
											}
										} else {
											this.props.button.setButtonDisabled(['Default', 'CancelDefault'], true);
											this.props.button.setButtonVisible(['Default', 'CancelDefault'], false)
										}
									} else {
										this.props.button.setButtonDisabled(['Default', 'CancelDefault', 'Enable', 'Disable'], true);
										this.props.button.setButtonVisible(['Default', 'CancelDefault', 'Enable', 'Disable'], false)
									}
								}
							}
							//let tabs = [AREA.bomcarditem, AREA.bomcardoutputs, AREA.bomcarduseorg];

							if (res.data.bodys) {
								this.props.cardTable.setTableData(AREA.bomcarditem, res.data.bodys[AREA.bomcarditem]);
								this.props.cardTable.setTableData(
									AREA.bomcardoutputs,
									res.data.bodys[AREA.bomcardoutputs]?res.data.bodys[AREA.bomcardoutputs]: {
										rows: []
									}
								);
								this.props.cardTable.setTableData(
									AREA.bomcarduseorg,
									res.data.bodys[AREA.bomcarduseorg]
								);
								let data = {
									cbomid: res.data.head[AREA.bomcardh].rows[0].values['cbomid'].value
								};
								ajax({
									url: URL.queryGrand,
									data: data,
									loading: false,
									success: (res) => {
										console.log(res);
										if (res && res.data) {
											this.props.cardTable.getAllRows(AREA.bomcarditem).forEach((row) => {
												if (res.data[row.values.cbom_bid.value] && res.data[row.values.cbom_bid.value].bodys) {
													row.bomwips = res.data[row.values.cbom_bid.value].bodys.bomwips;
													row.bomrepls = res.data[row.values.cbom_bid.value].bodys.bomrepls;
													row.bompos = res.data[row.values.cbom_bid.value].bodys.bompos;
													row.bomloss = res.data[row.values.cbom_bid.value].bodys.bomloss;
												}
											});
										}
									}
								});
							} else {
								this.props.cardTable.setAllTabsData([], tabs);
								this.setState({
									tableData: []
								});
							}
						}, 0);
					}

					if (!saveAdd) {
						this.props.pushTo('/card', {
							status: 'browse',
							id: pk_value
						});
						toggleShow(this.props);
						if (
							!getDefData('permorgs', dataSource).includes(
								res.data.head[AREA.bomcardh].rows[0].values.pk_org.value
							)
						) {
							this.props.button.setButtonDisabled(
								[
									'Default',
									'CancelDefault',
									'Assign',
									'Unassign',
									'Commit',
									'UnCommit',
									'Enable',
									'Disable',
									'Copy',
									'Edit',
									'ReviseEdit',
									'Delete',
									'gylxyzx'
								],
								true
							);
							this.props.button.setButtonVisible(
								[
									'Default',
									'CancelDefault',
									'Assign',
									'Unassign',
									'Commit',
									'UnCommit',
									'Enable',
									'Disable',
									'Copy',
									'Edit',
									'ReviseEdit',
									'Delete',
									'gylxyzx'
								],
								false
							);
							if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 1) {
								this.props.button.setButtonDisabled(
									[
										'WipsMaintain'
									],
									false
								);
							}
							else {
								this.props.button.setButtonDisabled(
									[
										'WipsMaintain'
									],
									true
								);

							}
						} else {
							this.props.button.setButtonDisabled(['WipsMaintain'], true);

							if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 1) {
								this.props.button.setButtonDisabled(['ReviseEdit', 'Assign', 'Unassign'], false);
								this.props.button.setButtonDisabled(['Edit',], true);
								this.props.button.setButtonVisible(['ReviseEdit', 'Assign', 'Unassign'], true);
								this.props.button.setButtonVisible(['Edit',], false);
							} else if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 2) {
								this.props.button.setButtonDisabled(['ReviseEdit', 'Edit', 'Assign', 'Unassign'], true);
								this.props.button.setButtonDisabled('UnCommit', false);
								this.props.button.setButtonVisible(['ReviseEdit', 'Edit', 'Assign', 'Unassign'], false);
								this.props.button.setButtonVisible('UnCommit', true);
							} else {
								this.props.button.setButtonDisabled(['ReviseEdit', 'Assign'], true);
								this.props.button.setButtonDisabled(['Edit', 'Unassign'], false);
								this.props.button.setButtonVisible(['ReviseEdit', 'Assign'], false);
								this.props.button.setButtonVisible(['Edit', 'Unassign'], true);
							}
							if (res.data.head[AREA.bomcardh].rows[0].values.hfversiontype.value == 2) {
								this.props.button.setButtonDisabled({ Enable: false, Disable: true });
								this.props.button.setButtonVisible(['Disable'], false)
								this.props.button.setButtonVisible(['Enable'], true)
								// this.props.button.setButtonVisible(['Disable'], false)
							} else {
								this.props.button.setButtonDisabled({ Enable: true, Disable: false });
								this.props.button.setButtonVisible(['Disable'], true)
								this.props.button.setButtonVisible(['Enable'], false)
								// this.props.button.setButtonVisible(['Enable'], false)
							}
							if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == '1') {
								if (res.data.head[AREA.bomcardh].rows[0].values.hfversiontype.value == '1') {
									if (res.data.head[AREA.bomcardh].rows[0].values.hbdefault.value == true) {
										this.props.button.setButtonDisabled({ CancelDefault: false, Default: true });
										this.props.button.setButtonVisible(['Default'], false);
										this.props.button.setButtonVisible(['CancelDefault'], true);
									} else {
										this.props.button.setButtonDisabled({ CancelDefault: true, Default: false });
										this.props.button.setButtonVisible(['Default'], true);
										this.props.button.setButtonVisible(['CancelDefault'], false);
									}
								} else {
									this.props.button.setButtonDisabled(['Default', 'CancelDefault'], true);
									this.props.button.setButtonVisible(['Default', 'CancelDefault'], false);
								}
							} else {
								this.props.button.setButtonDisabled(['Default', 'CancelDefault', 'Enable', 'Disable'], true);
								this.props.button.setButtonVisible(['Default', 'CancelDefault', 'Enable', 'Disable'], false);
							}
							if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value != '-1') {
								this.props.button.setButtonDisabled(['Delete'], true);
								this.props.button.setButtonVisible(['Delete'], false);
							} else {
								this.props.button.setButtonDisabled(['Delete'], false);
								this.props.button.setButtonVisible(['Delete'], true);
							}
							if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value != '-1') {
								this.props.button.setButtonDisabled(['Commit'], true);
								this.props.button.setButtonDisabled(['UnCommit'], false);
								this.props.button.setButtonVisible(['Commit'], false);
								this.props.button.setButtonVisible(['UnCommit'], true);
							} else {
								this.props.button.setButtonDisabled(['Commit'], false);
								this.props.button.setButtonDisabled(['UnCommit'], true);
								this.props.button.setButtonVisible(['Commit'], true);
								this.props.button.setButtonVisible(['UnCommit'], false);
							}
						}
						//特殊设置一下返回按钮的可见性
						this.props.BillHeadInfo.setBillHeadInfoVisible({
							showBackBtn: true
						});
					} else {
						let lastorg = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org');
						let lastorg_v = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v');
						this.props.form.EmptyAllFormValue(AREA.bomcardh);
						this.props.cardTable.setTableData(AREA.bomcarditem, {
							rows: []
						});
						this.props.cardTable.setTableData(AREA.bomcardoutputs, {
							rows: []
						});
						// this.props.cardTable.setTableData(AREA.bomcarduseorg, {
						// 	rows: []
						// });

						this.setDefaultValue();
						this.props.form.setFormItemsValue(AREA.bomcardh, { pk_org: lastorg, pk_org_v: lastorg_v });
						this.props.form.setFormItemsDisabled(AREA.bomcardh, { pk_org: false });
						this.props.button.setButtonVisible('SaveCommit', true);

						// this.props.cardTable.addRow(AREA.bomcarduseorg, 0, {
						// 	pk_org: lastorg,
						// 	pk_org_v: lastorg_v,
						// 	pk_useorg: lastorg,
						// 	pk_useorg_v: lastorg_v,
						// 	'pk_useorg.name': { value: lastorg.display }
						// });
						this.props.cardTable.addRow(AREA.bomcarditem);
						let pk_group = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
						let pk_org = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
						let pk_org_v = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
						let num = this.props.cardTable.getNumberOfRows(AREA.bomcarditem); //获取列表总行数
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org', { value: pk_org });
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_group', {
							value: pk_group
						});
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org_v', {
							value: pk_org_v
						});
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nassitemnum', { value: 1 });
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nitemnum', { value: 1 });
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'ibasenum', { value: '1' });
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemsource', {
							value: '1',
							display: this.state.json['10140BOMM2-000000']/* 国际化处理： 备料*/
						});
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemtype', {
							value: '1',
							display: this.state.json['10140BOMM2-000001']/* 国际化处理： 普通*/
						});
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtype', {
							value: '3',
							display: this.state.json['10140BOMM2-000002']/* 国际化处理： 交互倒冲*/
						});
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtime', {
							value: '1',
							display: this.state.json['10140BOMM2-000003']/* 国际化处理： 产品完工*/
						});
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fsupplymode', {
							value: '1',
							display: this.state.json['10140BOMM2-000004']/* 国际化处理： 一般发料*/
						});
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fcontrol', {
							value: '2',
							display: this.state.json['10140BOMM2-000005']/* 国际化处理： 不控制*/
						});
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bdeliver', { value: true });
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbsteploss', { value: false });
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbunibatch', { value: false });
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbchkitemforwr', {
							value: true
						});
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cendperiod', {
							value: '2099-12-31 23:59:59'
						});
						this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cbeginperiod', {
							value: (getBusinessInfo().businessDate.substr(0, 10) + " 00:00:00")
						});

						RownoUtils.setRowNo(this.props, AREA.bomcarditem, 'vrowno');

						//toggleShow(this.props);

						this.props.button.setButtonDisabled(['ResetRow'], false);
						this.props.pushTo('/card', {
							status: 'add',
							id: pk_value
						});
						console.log('line4847:sureSaveClick-toggle')
						toggleShow(this.props);

						if (this.props.getUrlParam('reviseEdit')) {
							let bomcarditem = [
								'vrowno',
								'cmaterialvid',
								
								'cassmeasureid',
								'vchangerate',
								'nassitemnum',
								'ibasenum',
								'vitemversion',
								'vpackversion',
								'nbfixshrinkastnum',
								'ndissipationum',
								'fcontrol',
								'bcanreplace',
								'freplacetype',
								'cbeginperiod',
								'cendperiod',
								'bcustommaterial',
								'bprojectmaterial',
								'ccustomerid',
								'cvendorid',
								'cproductorid',
								'cprojectid'
							];
							this.props.cardTable.setColEditableByKey(AREA.bomcarditem, bomcarditem);
						}
						this.props.pushTo('/card', {
							status: 'add',
							id: pk_value
						});
						console.log('line4881:sureSaveClick-toggle')
						toggleShow(this.props);
					}

					//更正缓存
					if (url == URL.insert) {
						//新增保存
						addCache(pk_value, res.data, AREA.bomcardh, dataSource);
					} else {
						//修改保存
						updateCache(
							'cbomid',
							res.data.head[AREA.bomcardh].rows[0].values['cbomid'].value,
							res.data,
							AREA.bomcardh,
							dataSource
						);
					}
					toast({
						content: this.state.json['110140PST0037'],
						color: 'success'
					}); /* 国际化处理： 保存成功*/

					if (saveCommit) {
						let data = {
							pkTsParams: [
								{
									pk: res.data.head[AREA.bomcardh].rows[0].values.cbomid.value,
									ts: res.data.head[AREA.bomcardh].rows[0].values.ts.value
								}
							],
							pageid: PAGECODE.bom_list
						};
						ajax({
							url: URL.commit,
							data: data,
							success: (res) => {
								if (res.success) {
									if (res.data.sucessNum == 1 && res.data.sucessVOs) {
										toast({
											color: 'success',
											content: this.state.pubjson['10140PUBMESSAGE-000024']
										}); /* 国际化处理： 提交成功*/
										let pk = null;
										if (this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid') && this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value) {
											pk = this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value
										} else {
											pk = this.props.getUrlParam('id')
										}
										this.getdata(pk, () => {

										});
									}

									// initButtons.call(this, props);
								}
								//this.onSelect();
							}
						});
					}
				}
			}
		});
	}
	//保存单据
	saveClick = (saveAdd = false, saveCommit = false) => {
		if (!this.props.form.isCheckNow(AREA.bomcardh, 'warning')) {
			return;
		}
		// 空行过滤
		this.props.cardTable.filterEmptyRows(AREA.bomcarditem, ['cmaterialvid'], 'include');
		this.props.cardTable.filterEmptyRows(AREA.bomcardoutputs, ['cmaterialvid'], 'include');

		if (this.props.form.getFormItemsValue(AREA.bomcardh, 'fbomtype').value == 2 && this.props.cardTable.getAllRows(AREA.bomcardoutputs).length > 0) {
			promptBox({
				color: 'warning',
				content: this.state.json['110140BOMM4002'],/* 国际化处理： 物料已存在有效的默认BOM版本，是否将当前BOM设为默认BOM版本？*/
				beSureBtnClick: () => {
					if (this.props.getUrlParam('status') === 'edit') {
						this.props.cardTable.getAllRows(AREA.bomcardoutputs).forEach((row) => {
							row.status = 3;
						});

					} else {
						this.props.cardTable.setTableData(AREA.bomcardoutputs, {
							rows: []
						});
					}

					let CardData = this.props.createExtCardData(PAGECODE.bom_card, AREA.bomcardh, [
						AREA.bomcarditem,
						AREA.bomcardoutputs,
						AREA.bomcarduseorg
					]);

					delete CardData.head[AREA.bomcardh].rows[0].values[childValues];
					console.log({ CardData: CardData })
					let isdefault = CardData.head[AREA.bomcardh].rows[0].values['hbdefault']
					if (isdefault.value == false) {
						this.sureSaveClick(CardData, saveAdd, saveCommit)
					} else {
						ajax({
							url: URL.checkdefaultversion,
							data: CardData,
							success: (res) => {
								if (res.data) {
									if (res.data.hasDefaultVersion == 'false') {
										this.sureSaveClick(CardData, saveAdd, saveCommit)

									} else {
										promptBox({
											color: 'warning',
											content: this.state.json['10140BOMM2-000009'],/* 国际化处理： 物料已存在有效的默认BOM版本，是否将当前BOM设为默认BOM版本？*/
											beSureBtnClick: () => {
												console.log('beSureBtnClick')
												this.sureSaveClick(CardData, saveAdd, saveCommit)
											}
										});
									}
								}

							}
						})
					}

				}
			});
		} else {
			let CardData = this.props.createExtCardData(PAGECODE.bom_card, AREA.bomcardh, [
				AREA.bomcarditem,
				AREA.bomcardoutputs,
				AREA.bomcarduseorg
			]);

			delete CardData.head[AREA.bomcardh].rows[0].values[childValues];
			console.log({ CardData: CardData })
			let isdefault = CardData.head[AREA.bomcardh].rows[0].values['hbdefault']
			if (isdefault.value == false) {
				this.sureSaveClick(CardData, saveAdd, saveCommit)
			} else {
				ajax({
					url: URL.checkdefaultversion,
					data: CardData,
					success: (res) => {
						if (res.data) {
							if (res.data.hasDefaultVersion == 'false') {
								this.sureSaveClick(CardData, saveAdd, saveCommit)

							} else {
								promptBox({
									color: 'warning',
									content: this.state.json['10140BOMM2-000009'],/* 国际化处理： 物料已存在有效的默认BOM版本，是否将当前BOM设为默认BOM版本？*/
									beSureBtnClick: () => {
										console.log('beSureBtnClick')
										this.sureSaveClick(CardData, saveAdd, saveCommit)
									}
								});
							}
						}

					}
				})
			}
		}

	};

	getDataForCache(pk, callback) {
		if (!pk) {
			// this.props.form.EmptyAllFormValue(AREA.bomcardh)
			// this.props.cardTable.setTableData(this.tableId, {rows: []})
			this.props.pushTo('/list', {});
			return;
		}

		let cardData = getCacheById(pk, dataSource);
		if (cardData) {
			this.props.form.setAllFormValue({
				[AREA.bomcardh]: cardData.head[AREA.bomcardh]
			});
			if (getDefData('permorgs', dataSource).includes(cardData.head[AREA.bomcardh].rows[0].values.pk_org.value)) {
				if (cardData.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 1) {
					this.props.button.setButtonDisabled(['ReviseEdit', 'Assign', 'Unassign'], false);
					this.props.button.setButtonDisabled(['Edit', 'Commit', 'UnCommit'], true);
					this.props.button.setButtonVisible(['ReviseEdit', 'Assign', 'Unassign'], true);
					this.props.button.setButtonVisible(['Edit', 'Commit', 'UnCommit'], false);					
				} else if (cardData.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 2) {
					this.props.button.setButtonDisabled('Commit', true);
					this.props.button.setButtonDisabled('UnCommit', false);
					this.props.button.setButtonVisible(['Commit'], false);
					this.props.button.setButtonVisible(['UnCommit'], true);
				} else {
					this.props.button.setButtonDisabled(['ReviseEdit', 'UnCommit', 'Assign', 'Unassign'], true);
					this.props.button.setButtonDisabled('Edit', false);
					this.props.button.setButtonVisible(['ReviseEdit', 'UnCommit', 'Assign', 'Unassign'], false);
					this.props.button.setButtonVisible(['Edit'], true);
				}
				if (cardData.head[AREA.bomcardh].rows[0].values.hfversiontype.value == 2) {
					this.props.button.setButtonDisabled({ Enable: false, Disable: true });
					this.props.button.setButtonVisible(['Enable'], true)
					this.props.button.setButtonVisible(['Disable'], false)
					// this.props.button.setButtonVisible(['Disable'], false)
				} else {
					this.props.button.setButtonDisabled({ Enable: true, Disable: false });
					this.props.button.setButtonVisible(['Enable'], false)
					this.props.button.setButtonVisible(['Disable'], true)
					// this.props.button.setButtonVisible(['Enable'], false)
				}
				if (cardData.head[AREA.bomcardh].rows[0].values.fbillstatus.value == '1') {
					if (cardData.head[AREA.bomcardh].rows[0].values.hfversiontype.value == '1') {
						if (cardData.head[AREA.bomcardh].rows[0].values.hbdefault.value == true) {
							this.props.button.setButtonDisabled({ CancelDefault: false, Default: true });
							this.props.button.setButtonVisible(['CancelDefault'], true)
							this.props.button.setButtonVisible(['Default'], false)
						} else {
							this.props.button.setButtonDisabled({ CancelDefault: true, Default: false });
							this.props.button.setButtonVisible(['CancelDefault'], false)
							this.props.button.setButtonVisible(['Default'], true)
						}
					} else {
						this.props.button.setButtonDisabled(['Default', 'CancelDefault'], true);
						this.props.button.setButtonVisible(['Default', 'CancelDefault'], false);
					}
				} else {
					this.props.button.setButtonDisabled(['Default', 'CancelDefault'], true);
					this.props.button.setButtonVisible(['Default', 'CancelDefault'], false);
				}
			}
			if (cardData.body) {
				if (cardData.body[AREA.bomcarditem]) {
					this.props.cardTable.setTableData(AREA.bomcarditem, cardData.body[AREA.bomcarditem]);
				} else {
					this.props.cardTable.setTableData(AREA.bomcarditem, {
						rows: []
					});
				}
				if (cardData.body[AREA.bomcardoutputs]) {
					this.props.cardTable.setTableData(AREA.bomcardoutputs, cardData.body[AREA.bomcardoutputs]);
				} else {
					this.props.cardTable.setTableData(AREA.bomcardoutputs, {
						rows: []
					});
				}
				if (cardData.body[AREA.bomcarduseorg]) {
					this.props.cardTable.setTableData(AREA.bomcarduseorg, cardData.body[AREA.bomcarduseorg]);
				} else {
					this.props.cardTable.setTableData(AREA.bomcarduseorg, {
						rows: []
					});
				}
			}
			this.props.setUrlParam(pk); //动态修改地址栏中的id的值
		} else {
			this.getdata(pk);
			this.props.setUrlParam(pk); //动态修改地址栏中的id的值
		}

		if (callback && typeof callback == 'function') {
			callback.call(this);
		}

		//将更新按钮状态的调用延后到callback之后，否则新增取消的时候显示的还是编辑态的按钮
		if (cardData) {
			console.log('line5144:getDataForCache-toggle')
			toggleShow(this.props);
		}
	}

	getDataForCache2(pk, callback) {
		if (!pk) {
			// this.props.form.EmptyAllFormValue(AREA.bomcardh)
			// this.props.cardTable.setTableData(this.tableId, {rows: []})
			this.props.pushTo('/list', {});
			return;
		}

		this.getdata(pk);
		this.props.setUrlParam(pk); //动态修改地址栏中的id的值

		if (callback && typeof callback == 'function') {
			callback.call(this);
		}

	}

	

	//删除单据
	delConfirm = () => {
		ajax({
			url: deleteUrl,
			data: {
				id: this.props.getUrlParam('id'),
				ts: this.props.form.getFormItemsValue(AREA.bomcardh, 'ts').value
			},
			success: (res) => {
				if (res) {
					let id = this.props.getUrlParam('id');

					//根据当前id,获取下个id
					/*
           * id：数据主键的值
           * dataSource: 缓存数据命名空间
           */
					let nextId = getNextId(id, dataSource);

					//调用删除缓存数据方法
					/*
           * idname: 数据主键的命名
           * id：数据主键的值
           * dataSource: 缓存数据命名空间
           */
					deleteCacheById('cbomid', id, dataSource);

					this.getDataForCache(nextId, () => {
						//this.props.cardPagination.setCardPaginationId({id: nextId,status: 1})
						toast({
							color: 'success',
							title: this.state.json['110140PST0033']
						}); /* 国际化处理： 删除成功！*/
					});
				}
			}
		});
	};

	updateCardTableBtnStatus(props) {
		let checkedRows = props.cardTable.getCheckedRows(AREA.bomcarditem);

		if (checkedRows.length > 0) {
			props.button.setButtonDisabled(['DelLine', 'CopyLine', ''], false);
		} else {
			props.button.setButtonDisabled(['DelLine', 'CopyLine'], true);
		}
	}

	updateOutputsTableBtnStatus(props) {
		let checkedRows = props.cardTable.getCheckedRows(AREA.bomcardoutputs);

		if (checkedRows.length > 0) {
			props.button.setButtonDisabled(['OutputsDelLine', 'OutputsCopyLine', ''], false);
		} else {
			props.button.setButtonDisabled(['OutputsDelLine', 'OutputsCopyLine'], true);
		}
	}

	changeEnableClick() {
		ajax({
			url: changeEnableStatus,
			data: {
				id: this.props.getUrlParam('id')
			},
			success: (res) => {
				this.getdata(this.props.getUrlParam('id'), () => {
					if (this.enableClick) {
						toast({
							color: 'success',
							title: this.state.json['10140TAXRE-000020']
						}); /* 国际化处理： 启用成功！*/
					} else {
						toast({
							color: 'success',
							title: this.state.json['10140TAXRE-000021']
						}); /* 国际化处理： 停用成功！*/
					}
				});
			}
		});
	}

	modelSave = (props) => {
		props.cardTable.closeModel(this.tableId);
		this.saveClick();
	};

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
	onTabChange = (activekey) => {
		debugger;
		if (this.props.getUrlParam('status') == 'add' || this.props.getUrlParam('status') == 'edit') {
			if (activekey == AREA.bomcarditem) {
				this.props.button.setButtonVisible(['AddLine', 'DelLine', 'ShowGrand'], true);
			} else if (activekey == AREA.bomcardoutputs) {
				this.props.button.setButtonVisible(['ShowGrand'], false);
				this.props.button.setButtonVisible(['AddLine', 'DelLine'], true);
			} else {
				this.props.button.setButtonVisible(['AddLine', 'DelLine', 'ShowGrand'], false);
			}
		}
	};
	modalAddRow = (props) => {
		let pk_group = props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
		let pk_org = props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
		let pk_org_v = props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
		let num = props.cardTable.getNumberOfRows(AREA.bomcarditem); //获取列表总行数
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org', { value: pk_org });
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_group', { value: pk_group });
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org_v', { value: pk_org_v });
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nassitemnum', { value: 1 });
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nitemnum', { value: 1 });
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'ibasenum', { value: '1' });
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemsource', { value: '1', display: this.state.json['10140BOMM2-000000'] });/* 国际化处理： 备料*/
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fitemtype', { value: '1', display: this.state.json['10140BOMM2-000001'] });/* 国际化处理： 普通*/
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtype', {
			value: '3',
			display: this.state.json['10140BOMM2-000002']/* 国际化处理： 交互倒冲*/
		});
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fbackflushtime', {
			value: '1',
			display: this.state.json['10140BOMM2-000003']/* 国际化处理： 产品完工*/
		});
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fsupplymode', { value: '1', display: this.state.json['10140BOMM2-000004'] });/* 国际化处理： 一般发料*/
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'fcontrol', { value: '2', display: this.state.json['10140BOMM2-000005'] });/* 国际化处理： 不控制*/
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bdeliver', { value: true });
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbsteploss', { value: false });
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbunibatch', { value: false });
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'bbchkitemforwr', { value: true });
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cendperiod', { value: '2099-12-31 23:59:59' });
		props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'cbeginperiod', {
			value: (getBusinessInfo().businessDate.substr(0, 10) + " 00:00:00")
		});

		RownoUtils.setRowNo(props, AREA.bomcarditem, 'vrowno');
		console.log('line5290:modalAddRow-toggle')
		toggleShow(props);

		props.button.setButtonDisabled(['ResetRow'], false);
	};
	outputsModalAddRow = (props) => {
		let pk_group = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
		let pk_org = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
		let pk_org_v = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
		let num = this.props.cardTable.getNumberOfRows(AREA.bomcardoutputs); //获取列表总行数
		this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'pk_org', { value: pk_org });
		this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'pk_group', { value: pk_group });
		this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'pk_org_v', { value: pk_org_v });
		this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'nbyprodsptnum', { value: 0 });
		this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'noutputnum', { value: 0 });
		this.props.cardTable.setValByKeyAndIndex(AREA.bomcardoutputs, num - 1, 'nastoutputnum', { value: 0 });

		RownoUtils.setRowNo(this.props, AREA.bomcardoutputs, 'vrowno');

		//toggleShow(this.props);
		props.button.setButtonDisabled(['OutputsResetRow'], false);
	};
	addRowEvent = () => {
		RownoUtils.setRowNo(this.props, this.props.cardTable.getCurTabKey(), 'vrowno');

		let pk_group = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_group').value;
		let pk_org = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org').value;
		let pk_org_v = this.props.form.getFormItemsValue(AREA.bomcardh, 'pk_org_v').value;
		if (this.props.cardTable.getCurTabKey() == AREA.bomcarditem) {
			let num = this.props.cardTable.getNumberOfRows(AREA.bomcarditem); //获取列表总行数
			this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org', { value: pk_org });
			this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_group', { value: pk_group });
			this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org_v', { value: pk_org_v });
			this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'nassitemnum', { value: 1 });
		} else if (this.props.cardTable.getCurTabKey() == AREA.bomcardoutputs) {
			let num = this.props.cardTable.getNumberOfRows(AREA.bomcardoutputs); //获取列表总行数
			this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org', { value: pk_org });
			this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_group', { value: pk_group });
			this.props.cardTable.setValByKeyAndIndex(AREA.bomcarditem, num - 1, 'pk_org_v', { value: pk_org_v });
		}
	};

	//获取列表肩部信息
	getTableHead = () => {
		let { button } = this.props;
		let { createButtonApp } = button;
		let buttons = this.props.button.getButtons();
		let status = this.props.getUrlParam('status');
		return (
			<div className="shoulder-definition-area">
				<div
					className="definition-icons"
					style={{
						padding: '0px'
					}}
				>
					{' '}
					{createButtonApp({
						area: 'body-action', //按钮注册中的按钮区域
						onButtonClick: this.buttonClick.bind(this)
					})}{' '}
					{this.props.cardTable.createBrowseIcons(AREA.bomcarditem, {
						iconArr: ['close', 'open', 'max', 'setCol'],
						maxDestAREAId: 'nc-bill-card'
					})}{' '}
				</div>{' '}
			</div>
		);
	};

	getOutputsTableHead = () => {
		let { button } = this.props;
		let { createButtonApp } = button;
		let buttons = this.props.button.getButtons();
		let status = this.props.getUrlParam('status');
		return (
			<div className="shoulder-definition-area">
				<div
					className="definition-icons"
					style={{
						padding: '0px'
					}}
				>
					{' '}
					{createButtonApp({
						area: 'outputs-action', //按钮注册中的按钮区域
						onButtonClick: this.buttonClick.bind(this)
					})}{' '}
					{this.props.cardTable.createBrowseIcons(AREA.bomcardoutputs, {
						iconArr: ['close', 'open', 'max', 'setCol'],
						maxDestAREAId: 'nc-bill-card'
					})}{' '}
				</div>{' '}
			</div>
		);
	};
	output = (type = '') => {
		let pks = this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value;
		//原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
		if (type != '') {
			//打印
			print('pdf', URL.print, {
				funcode: /*this.props.config.funcode*/ '10140BOMM', //功能节点编码/* 国际化处理： 功能节点编码*/
				nodekey: 'bommprint', //模板节点标识
				oids: [pks],
				outputType: type
			});
		}
	};
	closeApprove = () => {
		this.setState({
			approveDetailShow: false
		})
	}
	render() {
		let { cardTable, form, button, modal, cardPagination, table, editTable } = this.props;
		const { createCardPagination } = cardPagination;
		const { createBillHeadInfo } = this.props.BillHeadInfo
		let { createForm } = form;
		let { createSimpleTable } = table;
		let { createCardTable, createTabsTable } = cardTable;
		let { createButtonApp } = button;
		let { createModal } = modal;
		let status = this.props.getUrlParam('status');
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<div className="nc-bill-header-area">							
							<div className='header-title-search-area'>
								<span>
									{createBillHeadInfo({
										title: this.state.json['110140BOMM3001'],
										backBtnClick: ()=>{
											this.buttonClick.call(this, this.props, 'Return')
										}
									})}
								</span>
							</div>
							<div className="header-button-area">
								{' '}
								{createButtonApp({
									area: 'header-action', //按钮注册中的按钮区域
									onButtonClick: this.buttonClick.bind(this)
								})}{' '}
								{createCardPagination({
									handlePageInfoChange: this.pageInfoClick.bind(this),
									dataSource: dataSource
								})}{' '}
							</div>{' '}
						</div>{' '}
					</NCAffix>{' '}
					<div className="nc-bill-form-area">
						{' '}
						{createForm(AREA.bomcardh, {
							onAfterEvent: this.afterEvent.bind(this),
							onBeforeEvent: this.beforeEvent.bind(this)
						})}{' '}
					</div>{' '}
				</div>{' '}
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{' '}
						{createCardTable(AREA.bomcarditem, {
							tableHead: this.getTableHead.bind(this),
							onTabChange: this.onTabChange.bind(this),
							// modelSave: this.modelSave.bind(this),
							onBeforeEvent: this.onCardItemBeforeEvent.bind(this),
							onAfterEvent: this.onCardItemAfterEvent.bind(this),
							modelAddRow: this.modalAddRow.bind(this),
							hideModelSave: true,
							//showIndex: true,
							showCheck: true,
							//sisAddRow: true,
							addRowCallback: this.addRowEvent.bind(this),
							onSelected: this.updateCardTableBtnStatus.bind(this),
							onSelectedAll: this.updateCardTableBtnStatus.bind(this)
						})}{' '}
					</div>
					<div className="nc-bill-table-area">
						{' '}
						{createCardTable(AREA.bomcardoutputs, {
							tableHead: this.getOutputsTableHead.bind(this),
							onTabChange: this.onTabChange.bind(this),
							// modelSave: this.modelSave.bind(this),
							onBeforeEvent: this.onCardOutputsBeforeEvent.bind(this),
							onAfterEvent: this.onCardOutputsAfterEvent.bind(this),
							modelAddRow: this.outputsModalAddRow.bind(this),
							hideModelSave: true,
							//showIndex: true,
							showCheck: true,
							//sisAddRow: true,
							addRowCallback: this.addRowEvent.bind(this),
							onSelected: this.updateOutputsTableBtnStatus.bind(this),
							onSelectedAll: this.updateOutputsTableBtnStatus.bind(this)
						})}{' '}
					</div>
					<div className="nc-bill-table-area">
						{' '}
						{createCardTable(AREA.bomcarduseorg, {
							//tableHead: this.getTableHead.bind(this),
							//onTabChange: this.onTabChange.bind(this),
							// modelSave: this.modelSave.bind(this),
							// onBeforeEvent: this.onCardTableBeforeEvent.bind(this),
							// onAfterEvent: this.onCardTableAfterEvent.bind(this),
							//showIndex: true,
							//showCheck: true,
							//sisAddRow: true,
							addRowCallback: this.addRowEvent.bind(this)
						})}{' '}
					</div>
				</div>{' '}
				{createModal('delete', {
					title: this.state.json ? this.state.json['110140PST0036'] : '110140PST0036' /* 国际化处理： 注意*/,
					content: this.state.json ? this.state.json['110140PST0032'] : '110140PST0032' /* 国际化处理： 确认删除？*/,
					beSureBtnClick: this.delConfirm.bind(this)
				})}
				{
					<PowerTable
						ref="itemcontent"
						show={this.state.showGrand}
						parent={this.state.headitems}
						rows={this.state.items}
						onHide={this.OnHideSun()}
						onConfirm={this.onConfirmSun()}
						grandStatus={this.state.grandStatus}
						wipsmaintain={this.state.wipsmaintain}
					/>
				}
				{createModal('sureChangeOrg', {
					title: this.state.json ? this.state.json['110140BOMM3027'] : '110140BOMM3027' /* 国际化处理： 注意*/,
					content: this.state.json ? this.state.json['110140BOMM3026'] : '110140BOMM3026' /* 国际化处理： 确认删除？*/,
					beSureBtnClick: this.sureChangeOrg.bind(this)
				})}
				{createModal('cancel', {
					title: this.state.json
						? this.state.json['10140TAXRE-000008']
						: '10140TAXRE-000008' /* 国际化处理： 确认取消*/,
					content: this.state.json
						? this.state.json['10140TAXRE-000009']
						: '10140TAXRE-000009' /* 国际化处理： 是否确认要取消？*/,
					beSureBtnClick: this.cancelSureEvent.bind(this)
				})}
				<PrintOutput
					ref="printOutput"
					url={URL.print}
					data={{
						funcode: '10140BOMM',
						nodekey: 'bommprint',
						oids: this.state.pks,
						outputType: 'output'
					}}
				/>
				<AssignModal ref={(assignModal) => (this.assignModal = assignModal)} {...this.props} />
				<ApproveDetail
					show={this.state.approveDetailShow}
					close={this.closeApprove.bind(this)}
					billtype='19B1'
					billid={this.state.billid}
				/>
			</div>
		);
	}
}

Card = createPage({
	initTemplate: [],
	billinfo: {
		billtype: 'extcard',
		pagecode: '10140BOMM_card',
		headcode: AREA.bomcardh,
		bodycode: [AREA.bomcarditem, AREA.bomcardoutputs, AREA.bomcarduseorg]
	}
})(Card);

export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65