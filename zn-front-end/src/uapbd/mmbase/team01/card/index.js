//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, cardCache, promptBox, getMultiLang,createPageIcon } from 'nc-lightapp-front';
const { NCAffix, NCPopconfirm, NCFormControl, NCBackBtn } = base;
const { PrintOutput } = high
import { print } from 'nc-lightapp-front';

const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById, setDefData, getDefData } = cardCache;

import { showWarningDialog } from "../../public/tools/messageUtil"

const dataSource = 'mmbd.team.team01.data'
const childValues = 'pk_taxregions'

// const printUrl = '/nccloud/uapbd/taxregion/printTaxregion.do'

const NCURL = {
	QUERY: '/nccloud/mmbd/team01/queryCard.do',
	SAVE: '/nccloud/mmbd/team01/addsave.do',
	UPDATE: '/nccloud/mmbd/team01/update.do',
	DELETE: '/nccloud/mmbd/team01/delTeam.do',
	ENABLE: '/nccloud/mmbd/team01/changeEnableTeam.do',
	DISABLE: '/nccloud/mmbd/team01/changeDisableTeam.do',
	QUERYPSNDOC: '/nccloud/mmbd/team01/queryPsncl.do',
	QUERYVDEPTBYVID: '/nccloud/mmbd/team01/querydeptversionbyvid.do',
	QUERYDEPTBYVID: '/nccloud/mmbd/team01/querydeptvobyvid.do',
	QUERYORGBYVID: '/nccloud/mmbd/team01/queryorgvobyvid.do',
	QUERYORGVBYOID: '/nccloud/mmbd/team01/queryvorgvobyoid.do',
	PRINT: '/nccloud/mmbd/team01/print.do'
}


const pageId = '10140TEAMM_card';            		//pagecode
const formId = 'teamcardhead';                      //表头id
const tableId = 'teamcardb';						//子表ID
const moretableId = 'teamcardb&childform2';         //侧边子表ID
const pk_item = 'cteamid';               //单据主键--用于卡片查询刷新

const cardInnerBtnArea = 'card-inner'		//列表操作列按钮区域

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;				//表头
		this.tableId = tableId;				//表体
		this.moretableId = moretableId		//侧边栏

		this.state = {
			pk_org: null,
			pk_org_v: null,
			title_code: '',
			totalcount: 0,
			applycount: 0,
			backVisible: true,
			json: {},
			buttonkeys: [],
			copyedRows: []
		}
	}

	initTemplate = (props) => {
		props.createUIDom(
			{
				pagecode: pageId//页面id
				// appid: appId,//注册按钮的id
				// appcode: '10140TAXRE'
			},
			data => {
				if (data) {
					if (data.template) {
						let meta = data.template;
						this.modifierMeta(props, meta)
						console.log({ 'after modifierMeta': meta })
						props.meta.setMeta(meta);
					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button);
						this.getAllButtonKey(button, this.state.buttonkeys)
						// console.log(buttonkeys)
						this.toggleButton(props)
					}
					this.state.pk_org_v = { value: data.context.pk_org_v, display: data.context.org_v_Name }
					this.state.pk_org = { value: data.context.pk_org, display: data.context.org_Name }
					let status = props.getUrlParam('status');
					if (status != "add") {
						let pk = props.getUrlParam('id');

						if (status == 'browse') {
							if (pk && pk != 'undefined') {
								this.getdata(pk, () => {
									this.initBrowseAfterLoaddata()
								})
							}
						}

						if (status == 'edit') {
							if (pk && pk != 'undefined') {
								this.getdata(pk, () => {
									this.initEditAfterLoaddata()
									this.toggleButton(props)
								})
							}
						}
					}
					else {

						if (this.state.pk_org != null && this.state.pk_org.value != null) {
							let oldvalue = { value: null, display: null }
							this.props.form.setFormItemsValue(this.formId, { 'pk_org': this.state.pk_org })
							this.initAddMetaAfterOrgchange(props, oldvalue, this.state.pk_org)
							this.loadDataAfterOrgchange(props, oldvalue, this.state.pk_org)
							this.toggleButtonAfterOrgchange(props, oldvalue, this.state.pk_org)
							//补充集团默认值
							this.props.form.setFormItemsValue(this.formId, { 'pk_group': { value: window.parent.GETBUSINESSINFO().groupId, display: window.parent.GETBUSINESSINFO().groupName } });
							//初始时启用状态默认为已启用
							this.props.form.setFormItemsValue(this.formId, { 'enablestate': { value: '2', display: this.state.json['2101436701-0125'] } });/* 国际化处理： 已启用*/
						}
					}
				}
			}
		)
	}

	modifierMeta(props, meta) {
		let status = props.getUrlParam('status');
		console.log({ 'before modifierMeta': meta })
		//置表头、表体状态
		meta[formId].status = status;
		meta[tableId].status = status;		//表体状态:浏览态or编辑态

		if (status == 'browse') {
			this.initBrowseMeta(props, meta)
		} else {
			if (status == 'add') {
				this.initAddMeta(props, meta)
			}
			if (status == 'edit') {
				this.initEditMeta(props, meta)
			}
		}

		//添加行操作
		let porCol = {
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.json ? this.state.json['2101436701-0101'] : '2101436701-0101',	/* 国际化处理： 操作*/
			width: 150,
			className: 'table-opr',
			visible: true,
			fixed: 'right',
			render: (text, record, index) => {
				let status = this.props.cardTable.getStatus(tableId)
				let btnArray = status === 'browse' ? ['Ext'] : ['Ext', 'Inrt', 'Del']
				return props.button.createOprationButton(
					btnArray,
					{
						area: cardInnerBtnArea, 
						buttonLimit: status === 'browse' ? 1 : 3, 
						onButtonClick: (props, id)=>{
							this.onTableButtonClick.bind(this)(props, id, text, record, index)
						}
					}
				)
			}
		};
		console.log(porCol)

		let porCol2 = {
			itemtype: 'customer',
			attrcode: 'opr2',
			label: '',	/* 国际化处理： 操作*/
			visible: false,
			className: 'table-opr',
			width: 150,
			fixed: 'right',
			render: (text, record, index) => {
				let status = this.props.cardTable.getStatus(tableId);
				let btnArray = status === 'browse' ? [''] :['Psthere']
				return props.button.createOprationButton(
					btnArray,
					{
						area: cardInnerBtnArea, 
						buttonLimit: status === 'browse' ? 0 : 1, 
						onButtonClick: (props, id)=>{
							this.onTableButtonClick.bind(this)(props, id, text, record, index)
						}
					}
				)
			}
		};
		meta[tableId].items.push(porCol);
		meta[tableId].items.push(porCol2);

		return meta;
	}

	onTableButtonClick = (props, id, text, record, index) => {
		switch(id){
			case 'Ext':
				let status = props.cardTable.getStatus(tableId)
				if(status === 'browse'){
					props.cardTable.toggleRowView(tableId, record)
				}else{                                                             
					props.cardTable.openModel(tableId, 'edit', record, index)
				}				
				break
			case 'Inrt':
				props.cardTable.addRow(tableId, index)
				break
			case 'Del':
				props.cardTable.delRowsByIndex(tableId, index)
				break
			case 'Psthere':
				let selectedRows = this.state.copyedRows
				if (selectedRows == null || selectedRows.length == 0) {
					toast({ content: this.state.json['2101436701-0151'], color: 'warning' })/* 国际化处理： 请先粘贴要复制的表体行*/
					return
				}
				selectedRows.map((row) => {
					row.values['cteam_bid'].value = ''
					row.selected = false
				})
				props.cardTable.insertRowsAfterIndex(tableId, selectedRows, index)
				this.props.cardTable.selectAllRows(this.tableId, false)
				this.state.copyedRows = []
				this.props.button.setButtonDisabled(['CopyLine','DelLine'], true)
				this.props.button.setButtonVisible(['PasteLine', 'CopyLineCancel'], false)
				this.props.cardTable.hideColByKey(this.tableId, 'opr2')
				this.props.cardTable.setAllCheckboxAble(this.tableId, true)
				break
			default:
				break
		}
	}

	initBrowseMeta = (props, meta) => {
		console.log('initBrowseMeta')
		this.props.form.setFormStatus(this.formId, 'browse')
		this.props.cardTable.setStatus(this.tableId, 'browse')
	}

	initAddMeta = (props, meta) => {
		console.log('initAddMeta')

		this.props.form.setFormStatus(this.formId, 'add')
		this.props.cardTable.setStatus(this.tableId, 'edit')

		let itemsable = {}
		meta[formId].items.map((item) => {
			if (item.attrcode == "pk_org" || item.attrcode == "pk_org_v") {
				item.isDataPowerEnable = false
				item.queryCondition = () => {
					return { TreeRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' }
				}
			}
			if (item.attrcode == 'cwkid') {
				// item.isDataPowerEnable = false
				item.queryCondition = () => {
					return { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value, enablestate: 2 }; // 根据pk_org过滤
				}
			}

			if (item.attrcode == 'cdeptid' || item.attrcode == 'cdeptvid') {
				item.isDataPowerEnable = false
				item.queryCondition = () => {
					return {
						pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value,
						//return { pk_org: '00019110000000025USR',
						busifuncode: 'fa'
					}; // 根据pk_org过滤
				}
			}

			if (item.visible == true) {
				if (item.attrcode == "pk_org") {
					itemsable[item.attrcode] = false
				} else {
					itemsable[item.attrcode] = true
				}
			}
		})
		console.log({ 'initAddMeta-form-itemsable': itemsable })
		this.props.form.setFormItemsDisabled(formId, itemsable)
		itemsable = {}

		meta[tableId].items.map((item) => {
			if (item.attrcode == 'cteam_bid') {
				item.isDataPowerEnable = false
				item.isMultiSelectedEnabled = true
			}

			if (item.attrcode == 'cworkmanid') {
				item.isDataPowerEnable = false
				item.isMultiSelectedEnabled = true
				item.queryCondition = () => {
					return { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value,
							busifuncode: 'fa' }; // 根据pk_org过滤
				}
			}

			if (item.visible == true) {
				itemsable[item.attrcode] = true
			}
		})
		console.log({ 'initAddMeta-table-itemsable': itemsable })
		this.props.form.setFormItemsDisabled(tableId, itemsable)
		itemsable = {}

		meta[moretableId].items.map((item) => {
			if (item.attrcode == 'cteam_bid') {
				item.isDataPowerEnable = false
				item.isMultiSelectedEnabled = true
			}

			if (item.attrcode == 'cworkmanid') {
				item.isDataPowerEnable = false
				item.isMultiSelectedEnabled = true
				item.queryCondition = () => {
					return { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value,
							busifuncode: 'fa'}; // 根据pk_org过滤
				}
			}

			if (item.visible == true) {
				itemsable[item.attrcode] = true
			}
		})
		//console.log({'initAddMeta-table-itemsable':itemsable})
		this.props.form.setFormItemsDisabled(moretableId, itemsable)

	}

	initEditMeta = (props, meta) => {
		this.props.form.setFormStatus(this.formId, 'edit')
		this.props.cardTable.setStatus(this.tableId, 'edit')

		let itemsable = {}
		//['pk_org','vteamcode','vteamname','bshiftflag','cwkid','cwkid.vwkname','cwkid.vwkcode','cdeptid','cdeptid.name','cdeptid.code','vnote','enablestate',
		//'creator','creationtime','modifier','modifiedtime']
		//编辑态可以修改的字段：班组名称、轮班、工作中心编码（参照）、部门编码（参照）、备注
		meta[formId].items.map((item) => {
			// if (item.attrcode == "pk_org" || item.attrcode == "pk_org_v") {
			// 	item.isDataPowerEnable = false	
			// 	item.queryCondition = () => {
			// 		return { TreeRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgVidRefFilter' }
			// 	}
			// }

			if (item.attrcode == 'cwkid') {
				// item.isDataPowerEnable = false
				item.queryCondition = () => {
					return { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value, enablestate: 2 }; // 根据pk_org过滤
				}
			}

			if (item.attrcode == 'cdeptid' || item.attrcode == 'cdeptvid') {
				item.isDataPowerEnable = false
				item.queryCondition = () => {
					return { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value,
							busifuncode: 'fa' }; // 根据pk_org过滤
				}
			}
			if (item.visible == true) {
				if (item.attrcode == 'vteamname' || item.attrcode == 'bshiftflag' || item.attrcode == 'cwkid' || item.attrcode == 'cdeptid' || item.attrcode == 'cdeptvid' || item.attrcode == 'vbnote') {
					itemsable[item.attrcode] = false
				} else {
					itemsable[item.attrcode] = true
				}
			}
		})
		console.log({ 'initEditMeta-form-itemsable': itemsable })
		this.props.form.setFormItemsDisabled(formId, itemsable)
		itemsable = {}

		//['cworkmanid','cworkmanid.name','bmanager','pk_psncl','pk_dept','dstartdate','denddate','vbnote']
		//编辑态可以修改的字段：人员编码（参照）、负责人、开始时间、结束时间、备注
		meta[tableId].items.map((item) => {
			if (item.attrcode == 'cteam_bid') {
				item.isDataPowerEnable = false
				item.isMultiSelectedEnabled = true
				// if(status == 'edit'){
				// 	item.queryCondition = () => {
				// 		return { pk_org: props.form.getFormItemsValue(formId, 'pk_org').value }; // 根据pk_org过滤
				// 	};
				// }
			}

			if (item.attrcode == 'cworkmanid') {
				item.isDataPowerEnable = false
				item.isMultiSelectedEnabled = true
				item.queryCondition = () => {
					return { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value,
							busifuncode: 'fa' }; // 根据pk_org过滤
				}
			}

			if (item.visible == true) {
				if (item.attrcode == 'cworkmanid' || item.attrcode == 'bmanager' || item.attrcode == 'dstartdate' || item.attrcode == 'denddate' || item.attrcode == 'vbnote') {
					itemsable[item.attrcode] = false
				} else {
					itemsable[item.attrcode] = true
				}
			}
		})
		console.log({ 'initEditMeta-table-itemsable': itemsable })
		this.props.form.setFormItemsDisabled(tableId, itemsable)
		itemsable = {}

		meta[moretableId].items.map((item) => {
			if (item.attrcode == 'cteam_bid') {
				item.isDataPowerEnable = false
				item.isMultiSelectedEnabled = true
				// if(status == 'edit'){
				// 	item.queryCondition = () => {
				// 		return { pk_org: props.form.getFormItemsValue(formId, 'pk_org').value }; // 根据pk_org过滤
				// 	};
				// }
			}

			if (item.attrcode == 'cworkmanid') {
				item.isDataPowerEnable = false
				item.isMultiSelectedEnabled = true
				item.queryCondition = () => {
					return { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value,
							busifuncode: 'fa' }; // 根据pk_org过滤
				}
			}

			if (item.visible == true) {
				if (item.attrcode == 'cworkmanid' || item.attrcode == 'bmanager' || item.attrcode == 'dstartdate' || item.attrcode == 'denddate' || item.attrcode == 'vbnote') {
					itemsable[item.attrcode] = false
				} else {
					itemsable[item.attrcode] = true
				}
			}
		})
		console.log({ 'initEditMeta-table-itemsable': itemsable })
		this.props.form.setFormItemsDisabled(moretableId, itemsable)
	}

	toggleButton = (props) => {
		let buttonkeys = this.state.buttonkeys
		console.log({ 'toggleButton': buttonkeys })
		let status = props.getUrlParam('status')
		if (status == 'browse') {
			this.initBrowseButton(buttonkeys)
		}
		if (status == 'add') {
			this.initAddButton(buttonkeys)
		}
		if (status == 'edit') {
			this.initEditButton(buttonkeys)
		}

	}

	getAllButtonKey = (button, results) => {
		for (var i = 0; i < button.length; i++) {
			results.push(button[i].key)
			if (button[i].children != null && button[i].children.length > 0) {
				this.getAllButtonKey(button[i].children, results)
			}
		}
	}

	initBrowseButton = (btnkeys) => {
		//VISIBLEBTN_BROWSE = ['Add','Edit','Delete','Enable','Disable','Refresh']
		//UNVISIBLEBTN_BROWSE = ['Save','SaveAdd','Cancel','Print','AddLine','CopyLine','DelLine','PasteLine','CopyLineCancel']		
		let visibles = []
		let unvisibles = []
		let enables = []
		let disables = []
		btnkeys.map((key) => {
			if (key == 'Add' || key == 'Edit' || key == 'Delete' || key == 'Enable' || key == 'Disable' || key == 'Refresh' || key == 'Print' || key == 'Output') {
				visibles.push(key)
				if (key == 'Add' || key == 'Edit' || key == 'Delete' || key == 'Refresh' || key == 'Print' || key == 'Output') {
					enables.push(key)
				} else {
					disables.push(key)
				}
			}
			if (key == 'Save' || key == 'SaveAdd' || key == 'Cancel' || key == 'AddLine' || key == 'CopyLine' || key == 'DelLine' || key == 'PasteLine' || key == 'CopyLineCancel') {
				unvisibles.push(key)
			}
		})

		this.props.button.setButtonVisible(visibles, true)
		this.props.button.setButtonVisible(unvisibles, false)
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true)
		this.props.button.setButtonDisabled(enables, false)
		this.props.button.setButtonDisabled(disables, true)
		//特殊设置一下返回按钮的可见性
		this.setState({
			backVisible: true
		})
	}

	initAddButton = (btnkeys) => {
		//VISIBLEBTN_EDIT = ['Save','SaveAdd','Cancel','AddLine','CopyLine','DelLine']
		//UNVISIBLEBTN_EDIT = ['Add','Edit','Delete','Enable','Disable','Refresh','PasteLine','CopyLineCancel']	

		let visibles = []
		let unvisibles = []
		let enables = []
		let disables = []
		btnkeys.map((key) => {
			if (key == 'Save' || key == 'SaveAdd' || key == 'Cancel' || key == 'AddLine' || key == 'CopyLine' || key == 'DelLine') {
				visibles.push(key)
				if (key == 'Save' || key == 'SaveAdd' || key == 'Cancel') {
					enables.push(key)
				} else {
					disables.push(key)
				}
			}
			if (key == 'Add' || key == 'Edit' || key == 'Delete' || key == 'Enable' || key == 'Disable' || key == 'Refresh' || key == 'PasteLine' || key == 'CopyLineCancel' || key == 'Print' || key == 'Output') {
				unvisibles.push(key)
			}
		})

		this.props.button.setButtonVisible(visibles, true)
		this.props.button.setButtonVisible(unvisibles, false)
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false)
		this.props.button.setButtonDisabled(enables, false)
		this.props.button.setButtonDisabled(disables, true)
		//特殊设置一下返回按钮的可见性
		this.setState({
			backVisible: false
		})
	}

	initEditButton = (btnkeys) => {
		//VISIBLEBTN_EDIT = ['Save','SaveAdd','Cancel','AddLine','CopyLine','DelLine']
		//UNVISIBLEBTN_EDIT = ['Add','Edit','Delete','Enable','Disable','Refresh','PasteLine','CopyLineCancel']	
		// let num = this.props.cardTable.getNumberOfRows(this.tableId)
		let num = this.props.cardTable.getCheckedRows(this.tableId)
		let visibles = []
		let unvisibles = []
		let enables = []
		let disables = []
		btnkeys.map((key) => {
			if (key == 'Save' || key == 'Cancel' || key == 'AddLine' || key == 'CopyLine' || key == 'DelLine') {
				visibles.push(key)
				if (key == 'CopyLine' || key == 'DelLine') {
					if (num > 0) {
						enables.push(key)
					} else {
						disables.push(key)
					}
				} else {
					enables.push(key)
				}
			}
			if (key == 'Add' || key == 'SaveAdd' || key == 'Edit' || key == 'Delete' || key == 'Enable' || key == 'Disable' || key == 'Refresh' || key == 'PasteLine' || key == 'CopyLineCancel' || key == 'Print' || key == 'Output') {
				unvisibles.push(key)
			}
		})

		this.props.button.setButtonVisible(visibles, true)
		this.props.button.setButtonVisible(unvisibles, false)
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false)
		this.props.button.setButtonDisabled(enables, false)
		this.props.button.setButtonDisabled(disables, true)
		//特殊设置一下返回按钮的可见性
		this.setState({
			backVisible: false
		})
	}

	info = () => window.parent.GETBUSINESSINFO();

	componentDidMount() {
		let callback = (json) => {
			this.setState({ json }, () => {
				this.initTemplate(this.props)
			})
		}
		this.props.MultiInit.getMultiLang({ moduleId: '10140TEAMM', domainName: 'uapbd', callback })
	}

	componentWillUnmount() {
		// gCurrCountry = null
	}

	initBrowseAfterLoaddata = () => {
		console.log('initBrowseAfterLoaddata')
		//启停用按钮可用
		if (this.props.form.getFormItemsValue(this.formId, 'enablestate') != null) {
			if (this.props.form.getFormItemsValue(this.formId, 'enablestate').value == 2 || this.props.form.getFormItemsValue(this.formId, 'enablestate').value == '2') {
				this.props.button.setButtonDisabled('Enable', true)
				this.props.button.setButtonDisabled('Disable', false)
				this.props.button.setButtonVisible('Enable', false)
				this.props.button.setButtonVisible('Disable', true)
			} else {
				this.props.button.setButtonDisabled('Enable', false)
				this.props.button.setButtonDisabled('Disable', true)
				this.props.button.setButtonVisible('Enable', true)
				this.props.button.setButtonVisible('Disable', false)
			}
		}

		let id = this.props.getUrlParam('id')
		setDefData("cardpk", dataSource, id)
	}

	initEditAfterLoaddata = () => {
		console.log('initBrowseAfterLoaddata')
		let id = this.props.getUrlParam('id')
		setDefData("cardpk", dataSource, id)
	}

	initAddAfterPageto = () => {
		console.log('initAddAfterPageto')
		this.setDefaultValue()
	}


	//通过单据id查询单据信息
	getdata = (pk, callback) => {
		let data = { pk };
		ajax({
			url: NCURL.QUERY,
			data,
			success: (res) => {
				console.log({ 'getdata-res': res.data })
				if (res.data.head) {
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					//放入缓存
					// let cardData = getCacheById(pk, dataSource);
					// if(cardData == null){
					// 	addCache(res.data.head[formId].rows[0].values[pk_item].value, res.data, this.formId, dataSource)
					// }else{
					// 	updateCache(pk_item, res.data.head[formId].rows[0].values[pk_item].value, res.data, this.formId, dataSource)
					// }					
					updateCache(
						pk_item,
						res.data.head[formId].rows[0].values[pk_item].value,
						res.data,
						formId,
						dataSource
					);
					console.log({pk_item:pk_item,
						pk_item_value: res.data.head[formId].rows[0].values[pk_item].value,
						resdata: res.data,
						formId: formId,
						dataSource: dataSource})

				}
				if (res.data.body) {
					this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId])
				}
				else {
					this.props.cardTable.setTableData(this.tableId, { rows: [] })
				}

				if (callback && typeof callback == 'function') {
					callback.call(this)
				}
			}
		});
	}

	setDefaultValue = () => {
		this.props.form.EmptyAllFormValue(this.formId)
		this.props.cardTable.setTableData(this.tableId, { rows: [] })

		//补充集团默认值
		this.props.form.setFormItemsValue(this.formId, { 'pk_group': { value: window.parent.GETBUSINESSINFO().groupId, display: window.parent.GETBUSINESSINFO().groupName } });
		//初始时启用状态默认为已启用
		this.props.form.setFormItemsValue(this.formId, { 'enablestate': { value: '2', display: this.state.json['2101436701-0125'] } });/* 国际化处理： 已启用*/

	}

	buttonClick = (props, id) => {
		let _this = this;
		switch (id) {
			case 'Refresh':
				this.refreshAction()
				break
			case 'Back':
				setDefData("cardpk", dataSource, '');
				props.pushTo('/list', {back: 'back'})
				break
			case 'Enable':
				this.enableAction()
				break
			case 'Disable':
				this.disableAction()
				break
			case 'Delete':
				this.deleteHeadAction()
				break
			case 'Add':
				this.addHeadAction()
				break
			case 'Edit':
				this.editHeadAction()
				break
			case 'Cancel':
				this.cancelHeadAction()
				break
			case 'AddLine':
				this.addlineClick()
				break
			case 'DelLine':
				this.deleteLineClick()
				break
			case 'Save':
				this.saveClick()
				break
			case 'SaveAdd':
				this.saveClick(true)
				break
			case 'CopyLine':
				this.copyLineClick()
				break
			case 'CopyLineCancel':
				this.copyLineCancelClick()
				break
			case 'PasteLine':
				this.pasteLineClick()
				break
			case 'Print':
				this.output('print')
				break
			default:
				break
		}
	}

	refreshAction = () => {
		//refresh 不改变status
		let pk = this.props.getUrlParam('id')
		this.getdata(pk, () => {
			this.initBrowseAfterLoaddata()
			//toast({ title: this.state.json['2101436701-0106'], color: 'success' });/* 国际化处理： 刷新成功！*/
		})
	}

	enableAction = () => {
		let enableState = this.props.form.getFormItemsValue(formId, 'enablestate').value
		if (enableState == 2 || enableState == '2') {
			toast({ color: 'warning', content: this.state.json['2101436701-0137'] });/* 国际化处理： 已启用，无需重复启用！*/
			return
		}
		let allPks = [this.props.form.getFormItemsValue(formId, pk_item).value]
		let allTs = [this.props.form.getFormItemsValue(formId, 'ts').value]

		this.enable(allPks, allTs, () => {
			toast({ color: 'success', title: this.state.json['2101436701-0126'] })/* 国际化处理： 启用成功！*/
			this.refreshAction()
		})
	}

	disableAction = () => {
		let enableState = this.props.form.getFormItemsValue(formId, 'enablestate').value
		if (enableState == 3 || enableState == '3') {
			toast({ color: 'warning', content: this.state.json['2101436701-0138'] });/* 国际化处理： 已停用，无需重复停用！*/
			return
		}
		let allPks = [this.props.form.getFormItemsValue(formId, pk_item).value]
		let allTs = [this.props.form.getFormItemsValue(formId, 'ts').value]

		this.disable(allPks, allTs, () => {
			toast({ color: 'success', title: this.state.json['2101436701-0127'] })/* 国际化处理： 停用成功！*/
			this.refreshAction()
		})
	}

	enable = (ids, tss, callback) => {
		ajax({
			url: NCURL.ENABLE,
			data: {
				ids: ids,
				tss: tss
			},
			success: res => {
				if (callback && typeof callback == 'function') {
					callback.call(this)
				}
			}
		})
	}

	disable = (ids, tss, callback) => {
		ajax({
			url: NCURL.DISABLE,
			data: {
				ids: ids,
				tss: tss
			},
			success: res => {
				if (callback && typeof callback == 'function') {
					callback.call(this)
				}
			}
		})
	}

	deleteHeadAction = () => {
		promptBox({
			color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title: this.state.json['2101436701-0117'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
			content: this.state.json['2101436701-0118'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
			noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
			noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
			beSureBtnName: this.state.json['2101436701-0119'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
			cancelBtnName: this.state.json['2101436701-0120'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
			beSureBtnClick: this.delConfirm.bind(this)   // 确定按钮点击调用函数,非必输
		})
	}

	//删除单据
	delConfirm = () => {
		let ids = [this.props.getUrlParam('id')]
		let tss = [this.props.form.getFormItemsValue(this.formId, 'ts').value]
		ajax({
			url: NCURL.DELETE,
			data: {
				ids: ids,
				tss: tss
			},
			success: (res) => {
				if (res) {
					let id = this.props.getUrlParam("id");

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
					deleteCacheById(pk_item, id, dataSource);

					this.getDataForCache(nextId, () => {
						// console.log('getDataForCache-callback')						
						toast({ color: "success", title: this.state.json['2101436701-0104'] });/* 国际化处理： 删除成功！*/
					})
				}

			}
		});
	}

	getDataForCache = (pk, callback) => {
		console.log({ 'getDataForCache-pk': pk })
		if (!pk) {
			// this.props.form.EmptyAllFormValue(this.formId)
			// this.props.cardTable.setTableData(this.tableId, {rows: []})
			this.props.setUrlParam({ id: 'null', status: 'browse' });
			this.props.pushTo('/list', {})
			return
		}

		let cardData = getCacheById(pk, dataSource);
		console.log({ 'getDataForCache-cardData': cardData })
		if (cardData) {
			this.props.form.setAllFormValue({ [formId]: cardData.head[formId] });
			if (cardData.body && cardData.body[tableId]) {
				this.props.cardTable.setTableData(tableId, cardData.body[tableId]);
			}
			else {
				this.props.cardTable.setTableData(tableId, { rows: [] })
			}
			this.props.setUrlParam(pk)//动态修改地址栏中的id的值
			if (callback && typeof callback == 'function') {
				callback.call(this)
			}
		}
		else {
			this.getdata(pk, () => {
				this.props.setUrlParam(pk)//动态修改地址栏中的id的值
				this.toggleButton(this.props)
				this.initBrowseAfterLoaddata()
				if (callback && typeof callback == 'function') {
					callback.call(this)
				}
			})

		}

	}

	pageInfoClick = (props, pk) => {
		console.log({ 'pageInfoClick-pk': pk })
		this.getDataForCache(pk, () => {
			this.initBrowseAfterLoaddata()
		})
	}

	addHeadAction = () => {
		this.props.pushTo('/card', {
			status: 'add'
		})
		this.props.form.setFormStatus(this.formId, 'add')
		this.props.cardTable.setStatus(this.tableId, 'edit')
		this.initAddMeta(this.props, this.props.meta.getMeta())
		this.toggleButton(this.props)
		this.initAddAfterPageto()

		if (this.state.pk_org != null && this.state.pk_org.value != null) {
			let oldvalue = { value: null, display: null }
			this.props.form.setFormItemsValue(this.formId, { 'pk_org': this.state.pk_org })
			this.initAddMetaAfterOrgchange(this.props, oldvalue, this.state.pk_org)
			this.loadDataAfterOrgchange(this.props, oldvalue, this.state.pk_org)
			this.toggleButtonAfterOrgchange(this.props, oldvalue, this.state.pk_org)
		}
	}

	editHeadAction = () => {
		this.props.pushTo('/card', {
			status: 'edit',
			id: this.props.getUrlParam('id')
		})
		this.props.form.setFormStatus(this.formId, 'edit')
		this.props.cardTable.setStatus(this.tableId, 'edit')

		this.initEditMeta(this.props, this.props.meta.getMeta())
		this.toggleButton(this.props)
		this.initEditAfterLoaddata()
	}

	cancelHeadAction = () => {
		promptBox({
			color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title: this.state.json['2101436701-0130'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
			content: this.state.json['2101436701-0130'],             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
			noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
			noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
			beSureBtnName: this.state.json['2101436701-0119'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
			cancelBtnName: this.state.json['12101436701-0120'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
			beSureBtnClick: this.cancelSureEvent.bind(this)   // 确定按钮点击调用函数,非必输
		})
	}

	cancelSureEvent = () => {
		let pk = getDefData('cardpk', dataSource)
		if (pk && pk == '') {
			pk = null
		}
		this.state.copyedRows = []
		if (this.props.getUrlParam('status') === 'add') {
			this.getDataForCache(pk, () => {
				this.doAfterCancelHeadAction()
			})
		}
		if ((this.props.getUrlParam('status') === 'edit')) {
			this.props.form.cancel(this.formId);
			this.props.cardTable.resetTableData(this.tableId);

			this.doAfterCancelHeadAction()
		}

	}

	doAfterCancelHeadAction = () => {
		//编辑态取消时，修正一下页面状态
		this.props.pushTo('/card', {
			status: 'browse',
			id: this.props.getUrlParam('id')
		})

		this.props.form.setFormStatus(this.formId, 'browse')
		this.props.cardTable.setStatus(this.tableId, 'browse')
		this.initBrowseMeta(this.props, this.props.meta.getMeta())
		this.toggleButton(this.props)
		this.initBrowseAfterLoaddata()
	}

	addlineClick = () => {
		if (!this.props.form.getFormItemsValue(this.formId, 'pk_org') || !this.props.form.getFormItemsValue(this.formId, 'pk_org').value) {
			toast({ color: 'warning', content: this.state.json['2101436701-0131'] });	//"请先选择业务单元！"
			return;
		}
		// this.props.button.setButtonDisabled(['CopyLine', 'DelLine'], false)

		this.props.cardTable.addRow(this.tableId);
		this.props.cardTable.getAllRows(this.tableId).map((item) => {
			item.values["pk_group"] = { value: window.parent.GETBUSINESSINFO().groupId, display: window.parent.GETBUSINESSINFO().groupName };
			item.values["pk_org"] = this.props.form.getFormItemsValue(this.formId, "pk_org");
			item.values["pk_org_v"] = this.props.form.getFormItemsValue(this.formId, "pk_org_v");
		});


	}

	beforeEvent = (props, moduleId, key, value, oldvalue) => {
		let meta = this.props.meta.getMeta()

		if (key == 'pk_org') {
			console.log({
				'beforeEvent-pkorg': {
					'oldvalue': oldvalue,
					'newvalue': value
				}
			})

			meta[formId].items.map((item) => {
				if (item.attrcode == "pk_org" || item.attrcode == "pk_org_v") {
					// item.isDataPowerEnable = false
					item.queryCondition = () => {
						return { TreeRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' }
					}
				}
			})
		}
		if (key == 'cwkid') {
			meta[formId].items.map((item) => {
				if (item.attrcode == "cwkid") {
					// item.isDataPowerEnable = false
					item.queryCondition = () => {
						//return { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value, enablestate: 2}; // 根据pk_org过滤
						let ret = { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value }
						if (this.props.form.getFormItemsValue(formId, 'cdeptid') != null && this.props.form.getFormItemsValue(formId, 'cdeptid') != null) {
							ret['cdeptid'] = this.props.form.getFormItemsValue(formId, 'cdeptid').value
						}
						return ret
					}
				}
			})
		}

		if (key == 'cdeptvid') {
			console.log({
				'beforeEvent-cdeptvid': {
					'oldvalue': oldvalue,
					'newvalue': value
				}
			})
			meta[formId].items.map((item) => {
				if (item.attrcode == 'cdeptid' || item.attrcode == 'cdeptvid') {
					item.isDataPowerEnable = false
					item.queryCondition = () => {
						return { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value,
								busifuncode: 'fa' }; // 根据pk_org过滤
					}
				}
			})
		}
		return true
	}


	afterEvent = (props, moduleId, key, value, oldvalue) => {
		if (key == 'pk_org') {
			console.log({
				'afterEvent-pkorg': {
					'oldvalue': oldvalue,
					'newvalue': value
				}
			})

			this.initAddMetaAfterOrgchange(props, oldvalue, value)
			this.loadDataAfterOrgchange(props, oldvalue, value)
			this.toggleButtonAfterOrgchange(props, oldvalue, value)
		}
		if (key == 'cwkid') {
			this.loadDataAfterCwkidchange(value)
			this.loadDeptDataAfterCwkidchange(value, oldvalue)
		}

		if (key == 'cdeptvid') {
			this.loadDataAfterDeptvidchange(value)
			this.loadCwkidDataAfterDeptidchange(value, oldvalue)
			this.updateCwkidQueryCondition(value)
		}

	}

	initAddMetaAfterOrgchange = (props, oldvalue, newvalue) => {
		let meta = this.props.meta.getMeta()
		let itemsable = {}

		if ((oldvalue.value == null || oldvalue.value == '') && (newvalue.value && newvalue.value != '')) {	//从无到有			
			meta[formId].items.map((item) => {
				if (item.visible == true) {
					if (item.attrcode == 'cwkid.vwkname' || item.attrcode == 'cdeptid.name' || item.attrcode == 'cdeptvid.name' || item.attrcode == 'cwkid.vwkcode' || item.attrcode == 'cdeptid.code' || item.attrcode == 'cdeptvid.code' || item.attrcode == 'enablestate' || item.attrcode == 'creator' || item.attrcode == 'creationtime' || item.attrcode == 'modifier' || item.attrcode == 'modifiedtime') {
						itemsable[item.attrcode] = true
					} else {
						itemsable[item.attrcode] = false
					}
				}
			})
			console.log({ 'initAddMetaAfterOrgchange-form-itemsable': itemsable })
			this.props.form.setFormItemsDisabled(formId, itemsable)
		}
		if (oldvalue.value && newvalue.value && oldvalue.value != newvalue.value) {		//改变业务单元
			//不需要改变meta			
		}
		if (oldvalue.value && newvalue.value == null) {		//从有到无
			meta[formId].items.map((item) => {
				if (item.visible == true) {
					if (item.attrcode == 'pk_org' || item.attrcode == 'pk_org_v') {
						itemsable[item.attrcode] = false
					} else {
						itemsable[item.attrcode] = true
					}
				}
			})
			console.log({ 'initAddMetaAfterOrgchange-table-itemsable': itemsable })
			this.props.form.setFormItemsDisabled(formId, itemsable)
		}
		if (oldvalue.value && newvalue.value && oldvalue.value == newvalue.value) {		//没变化
			//不需要改变meta
		}

	}

	toggleButtonAfterOrgchange = (props, oldvalue, newvalue) => {

		let btnkeys = this.state.buttonkeys
		let btnable = []
		btnkeys.map((key) => {
			if (key == 'AddLine') {
				btnable.push(key)
			}
		})

		if ((oldvalue.value == null || oldvalue.value == '') && (newvalue.value && newvalue.value != '')) {	//从无到有
			this.props.button.setButtonDisabled(btnable, false)
		}
		if (oldvalue.value && newvalue.value && oldvalue.value != newvalue.value) {		//改变业务单元
			this.props.button.setButtonDisabled(btnable, false)
		}
		if (oldvalue.value && newvalue.value == null) {		//从有到无
			this.props.button.setButtonDisabled(btnable, true)
		}
		if (oldvalue.value && newvalue.value && oldvalue.value == newvalue.value) {		//没变化
			this.props.button.setButtonDisabled(btnable, true)
		}

	}

	loadDataAfterOrgchange = (props, oldvalue, newvalue) => {
		this.props.form.setFormItemsValue(this.formId, { 'pk_group': { value: window.parent.GETBUSINESSINFO().groupId, display: window.parent.GETBUSINESSINFO().groupName } });

		this.props.form.setFormItemsValue(this.formId, { 'enablestate': { value: '2', display: this.state.json['2101436701-0125'] } });/* 国际化处理： 已启用*/
		if ((oldvalue.value == null || oldvalue.value == '') && (newvalue.value && newvalue.value != '')) {	//从无到有
			//不需要load data		
			this.loadOrgV(newvalue.value)

		}
		if (oldvalue.value && newvalue.value && oldvalue.value != newvalue.value) {		//改变业务单元
			// props.modal.show('sureChangeOrg')	//提示并清空已输入数据
			showWarningDialog(this.state.json['2101436701-0111'], this.state.json['2101436701-0132'], {
			/* 国际化处理： 确认修改,是否修改组织，这样会清空您录入的信息？*/
				beSureBtnClick: this.sureChangeOrg.bind(this)
			});

		}
		if (oldvalue.value && newvalue.value == null) {		//从有到无
			//props.modal.show('sureChangeOrg')	//提示并清空已输入数据
			showWarningDialog(this.state.json['2101436701-0111'], this.state.json['2101436701-0132'], {
			/* 国际化处理： 确认修改,是否修改组织，这样会清空您录入的信息？*/
				beSureBtnClick: this.sureChangeOrg.bind(this)
			});

		}
		if (oldvalue.value && newvalue.value && oldvalue.value == newvalue.value) {		//没变化			
		}
	}


	sureChangeOrg = () => {
		console.log('sureChangeOrg')
		let meta = this.props.meta.getMeta()
		let emptyitems = {}
		meta[formId].items.map((item) => {
			if (item.visible == true) {
				if (item.attrcode != 'pk_group' && item.attrcode != 'pk_org' && item.attrcode != 'pk_org_v') {
					emptyitems[item.attrcode] = { value: '', display: '' }
				}
			}
		})
		console.log({ 'sureChangeOrg-emptyitems': emptyitems })

		this.props.form.setFormItemsValue(this.formId, emptyitems)
		this.props.form.setFormItemsValue(this.formId, { 'enablestate': { value: '2', display: this.state.json['2101436701-0125'] } });/* 国际化处理： 已启用*/
		this.props.cardTable.setTableData(this.tableId, { rows: [] })

		let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value

		if (pk_org != '') {
			this.loadOrgV(pk_org)

		}
	}

	loadOrg = (vid) => {
		let data = {
			pk_org_v: vid
		}
		ajax({
			url: NCURL.QUERYORGBYVID,
			data,
			success: (res) => {
				if (res.success) {
					let responsejson = JSON.parse(res.data[0])
					this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value: responsejson.pk, display: responsejson.code } })
				}
			}
		})
	}

	loadOrgV = (oid) => {
		let data = {
			pk_org: oid
		}
		ajax({
			url: NCURL.QUERYORGVBYOID,
			data,
			success: (res) => {
				if (res.success) {
					let responsejson = JSON.parse(res.data[0])
					this.props.form.setFormItemsValue(this.formId, { 'pk_org_v': { value: responsejson.pk, display: responsejson.code } })
				}
			}
		})
	}

	loadDataAfterCwkidchange = (newvalue, oldvalue) => {
		let ref = {}
		if (newvalue) {
			ref = { refpk: newvalue.value, refcode: newvalue.refcode, refname: newvalue.refname }
		}

		console.log({ 'cwkidref': ref })

		this.props.form.setFormItemsValue(this.formId, { 'cwkid': { value: ref.refpk, display: ref.refcode } })
		this.props.form.setFormItemsValue(this.formId, { 'cwkid.vwkcode': { value: ref.refpk, display: ref.refcode } })
		this.props.form.setFormItemsValue(this.formId, { 'cwkid.vwkname': { value: ref.refpk, display: ref.refname } })
	}

	loadDataAfterDeptvidchange = (newvalue) => {
		let ref = {}
		if (newvalue) {
			ref = { refpk: newvalue.value, refcode: newvalue.refcode, refname: newvalue.refname }
		}

		console.log({ 'cdeptvref': ref })

		this.props.form.setFormItemsValue(this.formId, { 'cdeptvid': { value: ref.refpk, display: ref.refcode } })
		this.props.form.setFormItemsValue(this.formId, { 'cdeptvid.code': { value: ref.refpk, display: ref.refcode } })
		this.props.form.setFormItemsValue(this.formId, { 'cdeptvid.name': { value: ref.refpk, display: ref.refname } })

		if (ref.refpk == null) {
			this.props.form.setFormItemsValue(this.formId, { 'cdeptid': { value: ref.refpk, display: ref.refcode } })
			this.props.form.setFormItemsValue(this.formId, { 'cdeptid.code': { value: ref.refpk, display: ref.refcode } })
			this.props.form.setFormItemsValue(this.formId, { 'cdeptid.name': { value: ref.refpk, display: ref.refname } })
		} else {
			let data = { cdeptvid: ref.refpk }

			ajax({
				url: NCURL.QUERYDEPTBYVID,
				data,
				success: (res) => {
					let ref2 = {}
					let responsejson = JSON.parse(res.data[0])
					ref2 = {
						refpk: responsejson.pk,
						refcode: responsejson.code,
						refname: responsejson.name
					}

					this.props.form.setFormItemsValue(this.formId, { 'cdeptid': { value: ref2.refpk, display: ref2.refcode } })
					this.props.form.setFormItemsValue(this.formId, { 'cdeptid.code': { value: ref2.refpk, display: ref2.refcode } })
					this.props.form.setFormItemsValue(this.formId, { 'cdeptid.name': { value: ref2.refpk, display: ref2.refname } })
				}
			})
		}

	}


	loadDeptDataAfterCwkidchange = (newCwkidvalue, oldCwkidvalue) => {
		if ((oldCwkidvalue.value == null || oldCwkidvalue.value == '') && (newCwkidvalue.value && newCwkidvalue.value != '')) {	//从无到有
			this.getDeptById(newCwkidvalue.values['cdeptvid'])
		}
		if (oldCwkidvalue.value && newCwkidvalue.value && oldCwkidvalue.value != newCwkidvalue.value) {		//改变业务单元
			this.getDeptById(newCwkidvalue.values['cdeptvid'])
		}
		if (oldCwkidvalue.value && newCwkidvalue.value == null) {		//从有到无
			let nulldeptvalue = { value: null, refcode: null, refname: null }
			this.loadDataAfterDeptvidchange(nulldeptvalue)
			this.updateCwkidQueryCondition(nulldeptvalue)
		}
		if (oldCwkidvalue.value && newCwkidvalue.value && oldCwkidvalue.value == newCwkidvalue.value) {		//没变化			
		}
	}

	loadCwkidDataAfterDeptidchange = (newCwkidvalue, oldCwkidvalue) => {
		let nullcwkidvalue = { value: null, refcode: null, refname: null }
		if ((oldCwkidvalue.value == null || oldCwkidvalue.value == '') && (newCwkidvalue.value && newCwkidvalue.value != '')) {	//从无到有
			this.loadDataAfterCwkidchange(nullcwkidvalue)
		}
		if (oldCwkidvalue.value && newCwkidvalue.value && oldCwkidvalue.value != newCwkidvalue.value) {		//改变业务单元
			this.loadDataAfterCwkidchange(nullcwkidvalue)
		}
		if (oldCwkidvalue.value && newCwkidvalue.value == null) {		//从有到无
			this.loadDataAfterCwkidchange(nullcwkidvalue)

		}
		if (oldCwkidvalue.value && newCwkidvalue.value && oldCwkidvalue.value == newCwkidvalue.value) {		//没变化			
		}
	}

	getDeptById = (deptvid) => {
		let cdeptvids = [deptvid.value]
		let data = {
			cdeptvid: cdeptvids
		}
		ajax({
			url: NCURL.QUERYVDEPTBYVID,
			data,
			success: (res) => {
				if (res.data) {
					let ref = {}
					if(res.data.length > 0){
						let responsejson = JSON.parse(res.data[0])
						ref = {
							value: responsejson.pk,
							refcode: responsejson.code,
							refname: responsejson.name
						}
					}					

					this.loadDataAfterDeptvidchange(ref)
					this.updateCwkidQueryCondition(ref)
				}

			}
		})
	}


	updateCwkidQueryCondition = (newvalue) => {
		let meta = this.props.meta.getMeta()
		meta[this.formId].items.map((item) => {
			if (item.visible == true && item.attrcode == 'cwkid') {
				item.queryCondition = () => {
					let ret = { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value }
					if (newvalue != null && newvalue.value != null) {
						ret['cdeptid'] = this.props.form.getFormItemsValue(formId, 'cdeptid').value
					}
					return ret
				}
			}
		})

	}

	onCardTableBeforeEvent = (props, moduleId, key, value, changedrows, index, record, status) => {
		if (key == 'cworkmanid') {
			props.meta.getMeta()[this.tableId].items.map((item) => {
				item.queryCondition = () => {
					let pkorg = props.form.getFormItemsValue(this.formId, 'pk_org').value;

					return { pk_org: pkorg,
								busifuncode: 'fa' };
				}
			})
			props.meta.getMeta()[this.moretableId].items.map((item) => {
				item.queryCondition = () => {
					let pkorg = props.form.getFormItemsValue(this.formId, 'pk_org').value;

					return { pk_org: pkorg,
								busifuncode: 'fa'};
				}
			})
		}
		return true;
	}


	onCardTableAfterEvent(props, moduleId, key, value, changedrows, index, record) {
		console.log({
			'onCardTableAfterEvent-param': {
				'changedrows': changedrows,
				'value': value,
				'record': record
			}
		})

		if (key == 'cworkmanid') {
			let rowitem = {}
			let meta = this.props.meta.getMeta()
			meta[this.tableId].items.map((item) => {
				if (item.attrcode != 'cteam_bid' && item.attrcode != 'ts') {
					rowitem[item.attrcode] = { value: '', display: '' }
				}
			})


			let pk_psnjob = []
			if(value instanceof Array){
				if(value.length == 0){
					this.props.cardTable.setValByKeysAndIndex(this.tableId, index, rowitem)
				}
				let k = 0
				let selrow = []
				value.forEach(item => {
					if(item.values == null){
						k++
						this.props.cardTable.setValByKeyAndIndex(this.tableId, index, 'cworkmanid', { value: item.refpk, display: item.refname })
						this.props.cardTable.setValByKeyAndIndex(this.tableId, index, 'cworkmanid.code', { value: item.refname, display: item.refname })
						return
					}

					if(k != 0){
						this.props.cardTable.addRow(this.tableId, index + k)
					}else{
						this.props.cardTable.setValByKeysAndIndex(this.tableId, index + k, rowitem)
					}
					k++

					if(item.values.pk_psnjob != null){
						pk_psnjob.push(item.values.pk_psnjob.value)
					}
				})
				
			}

			if (pk_psnjob.length > 0) {
				let data = { pk_psnjob: pk_psnjob }
				ajax({
					url: NCURL.QUERYPSNDOC,
					data,
					success: (res) => {
						if (res.data) {
							let resjson = []
							res.data.map((line) => {
								resjson.push(JSON.parse(line))
							})
							let i = 0
							let j = 0
							value.forEach(item => {
								if(item.values == null){
									i++
									return
								}

								this.props.cardTable.setValByKeyAndIndex(this.tableId, (index + i), 'cworkmanid', { value:item.refpk, display: item.refcode })
								this.props.cardTable.setValByKeyAndIndex(this.tableId, (index + i), 'cworkmanid.code', { value: item.refcode, display:item.refcode })
								this.props.cardTable.setValByKeyAndIndex(this.tableId, (index + i), 'cworkmanid.name', { value: item.refname, display: item.refname })

								this.props.cardTable.setValByKeyAndIndex(this.tableId, (index + i), 'pk_psnjob', { value: resjson[j].pk_psnjob, display: resjson[j].pk_psnjob })
								this.props.cardTable.setValByKeyAndIndex(this.tableId, (index + i), 'pk_psncl', { value: resjson[j].pk_psncl, display: resjson[j].psnclname })
								this.props.cardTable.setValByKeyAndIndex(this.tableId, (index + i), 'pk_dept', { value: resjson[j].pk_dept, display: resjson[j].deptname })
								i++
								j++
							})

						}
					}
				})
			}
		}

	}

	deleteLineClick = () => {
		let selectedRows = this.props.cardTable.getCheckedRows(this.tableId)
		if (selectedRows == null || selectedRows.length == 0) {
			toast({ content: this.state.json['2101436701-0148'], color: 'warning' })/* 国际化处理： 请选择需要删除的表体行！*/
			return
		}

		let selectedIndex = []
		selectedRows.forEach((item) => {
			selectedIndex.push(item.index)
		})
		this.props.cardTable.delRowsByIndex(this.tableId, selectedIndex)

		this.props.cardTable.selectAllRows(this.tableId, false)
		this.props.button.setButtonDisabled(['CopyLine', 'DelLine'], true)
		// let num = this.props.cardTable.getNumberOfRows(this.tableId)
		// if (num == 0) {
		// 	this.props.button.setButtonDisabled(['CopyLine', 'DelLine'], true)
		// }
	}

	//保存单据
	saveClick = (saveAdd = false) => {
		// 空行过滤
		this.props.cardTable.filterEmptyRows(tableId, ['cteam_bid', 'pk_group', 'pk_org', 'pk_org_v']);

		let CardData = this.props.createMasterChildData(pageId, this.formId, this.tableId);
		delete CardData.head[formId].rows[0].values[childValues]
		// CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
		let validate = this.validate(CardData)
		if (validate.success == false) {
			toast({ content: validate.msg, color: 'warning' })		//validate 验证未通过
			return
		}

		let url = NCURL.SAVE;//新增保存
		if (this.props.getUrlParam('status') === 'edit') {
			url = NCURL.UPDATE;//修改保存
		}
		ajax({
			url: url,
			data: CardData,
			success: (res) => {
				let pk_value = null
				if (res.success) {
					if (res.data) {
						pk_value = res.data.head[this.formId].rows[0].values[pk_item].value
						if (url == NCURL.SAVE) {
							//新增保存
							addCache(pk_value, res.data, this.formId, dataSource);
						}
						if (saveAdd == false) {
							this.props.pushTo('/card', {
								status: 'browse',
								id: pk_value
							})
							this.props.form.setFormStatus(this.formId, 'browse')
							this.props.cardTable.setStatus(this.tableId, 'browse')

							this.getdata(pk_value, () => {
								this.toggleButton(this.props)
								this.initBrowseAfterLoaddata()
							})
						} else {
							this.props.pushTo('/card', {
								status: 'add'
							})
							this.props.form.setFormStatus(this.formId, 'add')
							this.props.cardTable.setStatus(this.tableId, 'edit')

							this.getdata(pk_value, () => {
								this.props.form.EmptyAllFormValue(this.formId)
								this.props.table.setAllTableData(this.tableId, { rows: [] })
								this.toggleButton(this.props)
								this.initAddAfterPageto()
							})
						}
					}
					//更正缓存
					// if (url == NCURL.SAVE) {
					// 	//新增保存
					// 	addCache(pk_value, res.data, this.formId, dataSource);
					// } else {
					// 	//修改保存
					// 	updateCache(
					// 		pk_item,
					// 		res.data.head[formId].rows[0].values[pk_item].value,
					// 		res.data,
					// 		formId,
					// 		dataSource
					// 	);
					// }
					toast({ content: this.state.json['2101436701-0135'], color: 'success' });/* 国际化处理： 保存成功*/
				}
			}
		})
	}

	validate = (CardData) => {
		let head = CardData.head[this.formId]
		let ret = { success: true, msg: null }
		if (head != null && head.rows.length == 1) {
			
			for (let item in head.rows[0].values) {
				if (item == 'cwkid') {		//当是否轮班勾选时，工作中心不能为空
					if (head.rows[0].values['bshiftflag'].value == true || head.rows[0].values['bshiftflag'].value == 'true') {
						if (head.rows[0].values[item].value == null || head.rows[0].values[item].value == '') {
							ret = { success: false, msg: this.state.json['2101436701-0152'] }
							return ret;
						}
					}
				}
				if (item == 'pk_org' || item == 'pk_org_v' || item == 'vteamcode' || item == 'vteamname' || item == 'cdeptid' || item == 'cdeptvid') {
					if (head.rows[0].values[item].value == null || head.rows[0].values[item].value == '') {
						ret = { success: false, msg: this.state.json['2101436701-0149'] }
						return ret;
					}
				}
			}
		}
		let body = CardData.body[this.tableId]
		if (body != null && body.rows.length > 0) {
			body.rows.map((row) => {
				for (let item in row.values) {
					if (item == 'cworkmanid' || item == 'dstartdate') {
						if (row.values[item].value == null || row.values[item].value == '') {
							ret = { success: false, msg: this.state.json['2101436701-0150'] }
						}
					}
				}
			})
		}
		return ret
	}

	copyLineClick = () => {
		let selectedRows = this.props.cardTable.getCheckedRows(this.tableId)
		if (selectedRows == null || selectedRows.length == 0) {
			toast({ content: this.state.json['2101436701-0151'], color: 'warning' })/* 国际化处理： 请选择需要复制的表体行*/
			return
		}

		for (let item of selectedRows) {
			this.state.copyedRows.push(item.data)
		}


		this.props.button.setButtonDisabled(['CopyLine','DelLine'], true)
		this.props.button.setButtonVisible(['PasteLine', 'CopyLineCancel'], true)
		this.props.cardTable.showColByKey(this.tableId, 'opr2')
		this.props.cardTable.setAllCheckboxAble(this.tableId, false)
		// let selectedIndex = []
		// selectedRows.forEach((item) => {
		// 	selectedIndex.push(item.index)
		// })
		// this.props.cardTable.delRowsByIndex(this.tableId, selectedIndex)
	}

	copyLineCancelClick = () => {
		this.props.cardTable.selectAllRows(this.tableId, false)
		this.state.copyedRows = []
		this.props.button.setButtonDisabled(['CopyLine','DelLine'], true)
		this.props.button.setButtonVisible(['PasteLine', 'CopyLineCancel'], false)
		this.props.cardTable.hideColByKey(this.tableId, 'opr2')
		this.props.cardTable.setAllCheckboxAble(this.tableId, true)
	}

	pasteLineClick = () => {
		let selectedRows = this.state.copyedRows
		if (selectedRows == null || selectedRows.length == 0) {
			toast({ content: this.state.json['2101436701-0151'], color: 'warning' })/* 国际化处理： 请先粘贴要复制的表体行*/
			return
		}
		selectedRows.map((row) => {
			row.values['cteam_bid'].value = ''
			row.selected = false
		})
		let num = this.props.cardTable.getNumberOfRows(this.tableId)
		this.props.cardTable.insertRowsAfterIndex(this.tableId, selectedRows, num)

		this.props.cardTable.selectAllRows(this.tableId, false)
		this.state.copyedRows = []
		this.props.button.setButtonDisabled(['CopyLine','DelLine'], true)
		this.props.button.setButtonVisible(['PasteLine', 'CopyLineCancel'], false)
		this.props.cardTable.hideColByKey(this.tableId, 'opr2')
		this.props.cardTable.setAllCheckboxAble(this.tableId, true)
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



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
				oldData.rows[0][pop] = { value: formData.rows[0][pop].value, display: formData.rows[0][pop].display };
			}
		}
		return oldData;
	}









	updateCardTableBtnStatus() {
		let checkedRows = this.props.cardTable.getCheckedRows(this.tableId)

		if (checkedRows.length > 0) {
			this.props.button.setButtonDisabled(['CopyLine','DelLine'], false);
		}
		else {
			this.props.button.setButtonDisabled(['CopyLine','DelLine'], true);
		}
	}





	modelSave = (props) => {
		props.cardTable.closeModel(this.tableId);
		this.saveClick();
	}

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button'
		} else {
			return 'secondary - button'
		}
	};

	//输出和打印功能函数
	output(type = '') {
		let headpk = this.props.form.getFormItemsValue(formId, 'cteamid').value
		let pks = [headpk];
		
		if (type == 'print') {
			//打印
			print(
				'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				NCURL.PRINT,
				{
					billtype: '',  //单据类型
					funcode: '10140TEAMM',      //功能节点编码，即模板编码
					nodekey: '10140TEAM_Print',     //模板节点标识
					oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
				}
			);
		} else if (type = 'output') {
			this.setState({
				pks: pks
			}, this.refs.printOutput.open());
		}
	}

	//获取列表肩部信息
	getTableHead = () => {
		let { button } = this.props;
		let { createButtonApp } = button;
		let buttons = this.props.button.getButtons();
		let status = this.props.getUrlParam("status");
		return (
			<div className="shoulder-definition-area">

				<div className="definition-icons" style={{ padding: "0px" }}>
					{createButtonApp({
						area: 'body-action',//按钮注册中的按钮区域
						onButtonClick: this.buttonClick.bind(this)
					})}
					{this.props.cardTable.createBrowseIcons(this.tableId, {
						iconArr: ['close', 'open', 'max', 'setCol'],
						maxDestAreaId: 'nc-bill-card'
					})}
				</div>
			</div>
		)
	}
	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		const { createCardPagination } = cardPagination;
		const {createBillHeadInfo} = this.props.BillHeadInfo
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp } = button;
		let { createModal } = modal;
		let status = this.props.getUrlParam('status');
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<div className='nc-bill-header-area'>
							<div className='header-title-search-area'>
								<span>
									{createBillHeadInfo({
										title: this.state.json['2101436701-0004'],
										backBtnClick: ()=>{
											this.buttonClick.call(this, this.props, 'Back')
										}
									})}
								</span>
							</div>
							
							<div className="header-button-area">
								{createButtonApp({
									area: 'header-action',//按钮注册中的按钮区域
									onButtonClick: this.buttonClick.bind(this)
								})}
								{createCardPagination({
									handlePageInfoChange: this.pageInfoClick.bind(this),
									dataSource: dataSource
								})}
							</div>
						</div>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							onBeforeEvent: this.beforeEvent.bind(this),
							onAfterEvent: this.afterEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead.bind(this),
							hideModelSave: true,
							modelSave: this.modelSave.bind(this),
							onBeforeEvent: this.onCardTableBeforeEvent.bind(this),
							onAfterEvent: this.onCardTableAfterEvent.bind(this),
							showIndex: true,
							showCheck: true,
							onSelected: this.updateCardTableBtnStatus.bind(this),
							onSelectedAll: this.updateCardTableBtnStatus.bind(this)
						})}
					</div>
				</div>
				{createModal('delete', {
					title: this.state.json ? this.state.json['2101436701-0111'] : '2101436701-0111',/* 国际化处理： 注意*/
					content: this.state.json ? this.state.json['2101436701-0103'] : '2101436701-0103',/* 国际化处理： 确认删除？*/
					size: 'sm',
					beSureBtnClick: this.delConfirm.bind(this)
				})}
				{createModal('sureChangeOrg', {
					title: this.state.json ? this.state.json['2101436701-0111'] : '2101436701-0111',/* 国际化处理： 注意*/
					content: this.state.json ? this.state.json['2101436701-0132'] : '2101436701-0132',/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					size: 'sm',
					beSureBtnClick: this.sureChangeOrg.bind(this)
				})}

				{createModal('cancel', {
					title: this.state.json ? this.state.json['2101436701-0133'] : '2101436701-0133',/* 国际化处理： 确认取消*/
					content: this.state.json ? this.state.json['2101436701-0134'] : '2101436701-0135',/* 国际化处理： 是否确认要取消？*/
					size: 'sm',
					beSureBtnClick: this.cancelSureEvent.bind(this)
				})}


				<PrintOutput
					ref='printOutput'
					url={NCURL.PRINT}
					data={{
						funcode: '10140TEAMM',
						nodekey: '10140TEAM_Print',
						oids: this.state.pks,
						outputType: 'output'
					}}
				/>
			</div>

		);
	}
}

Card = createPage({
	initTemplate: []
})(Card);

//切换页面状态
function toggleShow(props, enableState = 2) {
	let status = props.getUrlParam('status');

	//按钮的显示状态
	let visibleButtons = []
	let unvisibleButtons = []
	if (status == 'edit' || status == 'add') {
		unvisibleButtons = ['Edit', 'Add', 'back', 'Delete', 'Refresh', 'Enable', 'Disable', 'Print', 'Output']
		visibleButtons = ['Save', 'Cancel', 'AddLine', 'DelLine']
		if (status == 'add') {
			visibleButtons.push('SaveAdd')
		}
		else {
			unvisibleButtons.push('SaveAdd')
		}
		props.button.setButtonVisible(unvisibleButtons, false);
		props.button.setButtonVisible(visibleButtons, true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	} else {
		unvisibleButtons = ['Save', 'Cancel', 'AddLine', 'DelLine', 'SaveAdd']
		visibleButtons = ['Add', 'Edit', 'Delete', 'back', 'Refresh', 'Print', 'Output']
		if (enableState == 2) {
			visibleButtons.push('Disable')
			unvisibleButtons.push('Enable')
		}
		else {
			visibleButtons.push('Enable')
			unvisibleButtons.push('Disable')
		}
		props.button.setButtonVisible(unvisibleButtons, false);
		props.button.setButtonVisible(visibleButtons, true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
	}
	props.form.setFormStatus(formId, status);
	props.cardTable.setStatus(tableId, status == 'edit' || status == 'add' ? 'edit' : 'browse');

	//添加浏览器窗口关闭监听事件
	if (status != 'add' && status != "edit") {
		window.onbeforeunload = null;
	} else {
		window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['2101436701-0117'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
				content: this.state.json['2101436701-0145'],             // 提示内容,非必输/* 国际化处理： 还有未保存的记录，确认关闭页签？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.state.json['2101436701-0119'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.state.json['2101436701-0120'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: this.deleteAction.bind(this)   // 确定按钮点击调用函数,非必输
			})
		};
	}


};

export default Card

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65