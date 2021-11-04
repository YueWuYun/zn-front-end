//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, cardCache, promptBox, getMultiLang, createPageIcon } from 'nc-lightapp-front';
const { NCAffix, NCPopconfirm, NCFormControl, NCBackBtn } = base;
const { PrintOutput } = high;
import { print } from 'nc-lightapp-front';
const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
const dataSource = 'mmbd.psinfo.psg.data';
const formId = 'psgcardh'; //表头id
const tableId = 'psgcardb';
const moretableId = 'psgcardb&childform2'; //子表id
const pageId = '10140PSG_card'; //pagecode
const searchId = 'search'; //查询区id
const queryCardUrl = '/nccloud/mmbd/psg/querycard.do'; //卡片查询url
const saveUrl = '/nccloud/mmbd/psg/addsave.do'; //新增保存
const updateUrl = '/nccloud/mmbd/psg/update.do'; //修改保存
const deleteUrl = '/nccloud/mmbd/psg/delete.do'; //删除
const changeEnableStatus = '/nccloud/uapbd/taxregion/changeEnableTaxregion.do';
const pk_item = 'pk_planstrategygroup'; //单据主键--用于卡片查询刷新
const titleCode = 'code'; //单据编码--用于卡片表头显示
const childValues = 'pk_taxregions';
const printUrl = '/nccloud/uapbd/taxregion/printTaxregion.do';

const cardInnerBtnArea = 'card-inner'

//全局变量，为了设置行政区划参照的范围
let gCurrCountry = null;

//切换页面状态
function toggleShow(props, enableState = 2) {
	let status = props.getUrlParam('status');
	let flag = status === 'browse' ? false : true;
	//按钮的显示状态
	let visibleButtons = [];
	let unvisibleButtons = [];
	if (status == 'edit' || status == 'add') {
		unvisibleButtons = [ 'Edit', 'Add', 'back', 'Delete', 'Refresh', 'Enable', 'Disable', 'Print', 'Output' ];
		visibleButtons = [ 'Save', 'Cancel', 'AddLine', 'DelLine' ];
		if (status == 'add') {
			visibleButtons.push('SaveAdd');
		} else {
			unvisibleButtons.push('SaveAdd');
		}
		props.button.setButtonVisible(unvisibleButtons, false);
		props.button.setButtonVisible(visibleButtons, true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	} else {
		unvisibleButtons = [ 'Save', 'Cancel', 'AddLine', 'DelLine', 'SaveAdd' ];
		visibleButtons = [ 'Add', 'Edit', 'Delete', 'back', 'Refresh', 'Print', 'Output' ];
		if (enableState == 2) {
			visibleButtons.push('Disable');
			unvisibleButtons.push('Enable');
		} else {
			visibleButtons.push('Enable');
			unvisibleButtons.push('Disable');
		}
		props.button.setButtonVisible(unvisibleButtons, false);
		props.button.setButtonVisible(visibleButtons, true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
	}
	props.form.setFormStatus(formId, status);
	props.cardTable.setStatus(tableId, status == 'edit' || status == 'add' ? 'edit' : 'browse');

	//添加浏览器窗口关闭监听事件
	if (status != 'add' && status != 'edit') {
		window.onbeforeunload = null;
	} else {
		window.onbeforeunload = () => {
			//编辑态关闭页签或浏览器的提示
			return '';
		};
	}
	if (status == 'add') {
		props.form.setFormItemsDisabled(formId, {
			creator: true,
			creationtime: true,
			modifier: true,
			modifiedtime: true
		});
		if (!props.form.getFormItemsValue(formId, 'pk_org') || !props.form.getFormItemsValue(formId, 'pk_org').value) {
			props.form.setFormItemsDisabled(formId, {
				vpsgcode: true,
				vpsgname: true,
				vnote: true
			});
			props.button.setButtonDisabled([ 'AddLine' ], true);
		}else{
			props.form.setFormItemsDisabled(formId, {
				vpsgcode: false,
				vpsgname: false,
				vnote: false
			});
			props.button.setButtonDisabled([ 'AddLine' ], false);

		}
	} else if (status == 'edit') {
		props.form.setFormItemsDisabled(formId, {
			pk_org: true,
			creator: true,
			creationtime: true,
			modifier: true,
			modifiedtime: true
		});
	}
}

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		this.searchId = searchId;
		this.tableId = tableId;
		this.old_pk_org = '';
		this.state = {
			pk_org: '',
			title_code: '',
			totalcount: 0,
			applycount: 0,
			backVisible: true,
			json: {}
		};
	}

	initTemplate = (props) => {
		props.createUIDom(
			{
				pagecode: pageId //页面id
			},
			(data) => {
				if (data) {
					if (data.template) {
						let meta = data.template;
						this.modifierMeta(props, meta);
						props.meta.setMeta(meta);
					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button);
					}
					//计划组织默认值
					if (data.context.pk_org) {
						this.props.form.setFormItemsValue(formId, {
							pk_org: { value: data.context.pk_org, display: data.context.org_Name }
						});
						// this.toggleShow(false);
						this.setState({
							pk_org: { value: data.context.pk_org, display: data.context.org_Name }
						});
						this.props.button.setButtonDisabled([ 'AddLine' ], false);
					}
					toggleShow(props);
				}
			}
		);
	};

	modifierMeta(props, meta) {
		let status = props.getUrlParam('status');
		meta[formId].status = status;
		meta[tableId].status = status;
		//纠正一下子表行政区划参照的参照范围，因为getdata执行的时候可能initTemplet还没有准备好数据
		meta[tableId].items.map((item) => {
			if (item.attrcode == 'pk_planstrategy') {
				item.isDataPowerEnable = false;
				item.isMultiSelectedEnabled = true;
			}
		});
		meta[formId].items.map((item) => {
			if (item.attrcode == 'pk_org') {
				item.isDataPowerEnable = false;
				item.queryCondition = () => {
					return { GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' };
				};
			}
		});
		meta[moretableId].items.map((item) => {
			if (item.attrcode == 'pk_planstrategy') {
				item.isDataPowerEnable = false;
				item.isMultiSelectedEnabled = true;
			}
		});

		if (status == 'edit') {
			props.form.setFormItemsDisabled(formId, { pk_org: false });
			meta[tableId].items.map((item) => {
				if (item.attrcode == 'pk_planstrategy') {
					item.isDataPowerEnable = false;
					item.queryCondition = () => {
						return { pk_org: props.form.getFormItemsValue(formId, 'pk_org').value }; // 根据pk_org过滤
					};
					item.isMultiSelectedEnabled = true;
				}
			});
			meta[moretableId].items.map((item) => {
				if (item.attrcode == 'pk_planstrategy') {
					item.isDataPowerEnable = false;
					item.queryCondition = () => {
						return { pk_org: props.form.getFormItemsValue(formId, 'pk_org').value }; // 根据pk_org过滤
					};
					item.isMultiSelectedEnabled = true;
				}
			});
		}
		let porCol = {
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.json ? this.state.json['110140PST0030'] : '110140PST0030',
			visible: true,
			className: 'table-opr',
			width: 200,
			fixed: 'right',
			render: (text, record, index) => {
				let status = this.props.cardTable.getStatus(tableId);
				let btnArray = status === 'browse' ? ['Ext'] : ['Del']
				return props.button.createOprationButton(
					btnArray,
					{
						area: cardInnerBtnArea,
						buttonLimit: 1,
						onButtonClick: (props, id) => {
							this.onTableButtonClick.bind(this)(props, id, text, record, index)
						}
					}
				)
			}
		};
		meta[tableId].items.push(porCol);
		return meta;
	}
	info = () => window.parent.GETBUSINESSINFO();

	onTableButtonClick = (props, id, text, record, index) => {
		if(id === 'Ext'){
			props.cardTable.toggleRowView(tableId, record);
		}

		if(id === 'Del'){
			props.cardTable.delRowsByIndex(tableId, index);
		}
	}

	componentDidMount() {
		let callback = (json) => {
			this.setState({ json }, () => {
				this.initTemplate(this.props);
			});
		};
		let callbacknoinit = (json, status, inlt) => {
			if (status) {
				this.setState({ pubjson: { ...json } });
			}
		};
		this.props.MultiInit.getMultiLang({ moduleId: '10140MMPUBMSG', domainName: 'uapbd', callback: callbacknoinit });
		this.props.MultiInit.getMultiLang({ moduleId: '10140PSG', domainName: 'uapbd', callback });
		toggleShow(this.props);
		this.updateCardTableBtnStatus();
		let status = this.props.getUrlParam('status');
		if (status != 'add') {
			let pk = this.props.getUrlParam('id');
			if (pk && pk != 'undefined') {
				this.getdata(pk);
			}
		} else {
			this.setDefaultValue();
		}
		if (status == 'add' || status == 'edit') {
			//点击修改或者新增进入的时候，返回按钮不可见
			this.setState({
				backVisible: false
			});
		}
	}

	componentWillUnmount() {
		gCurrCountry = null;
	}

	setDefaultValue = () => {
		//补充集团默认值
		this.props.form.setFormItemsValue(this.formId, {
			pk_group: {
				value: window.parent.GETBUSINESSINFO().groupId,
				display: window.parent.GETBUSINESSINFO().groupName
			}
		});
	};

	buttonClick = (props, id) => {
		let _this = this;
		switch (id) {
			case 'Add':
				props.pushTo('/card', {
					status: 'add'
				});
				props.form.EmptyAllFormValue(this.formId);
				props.cardTable.setTableData(this.tableId, { rows: [] });
				props.form.setFormItemsDisabled(formId, {
					pk_org: false,
					creator: true,
					creationtime: true,
					modifier: true,
					modifiedtime: true
				});
				if (this.state.pk_org) {
					this.props.form.setFormItemsValue(formId, {
						pk_org: { ...this.state.pk_org }
					});
				}
				toggleShow(this.props);
				this.setDefaultValue();
				//特殊设置一下返回按钮的可见性
				this.setState({
					backVisible: false
				});
				break;
			case 'Edit':
				props.form.setFormItemsDisabled(formId, {
					pk_org: true,
					creator: true,
					creationtime: true,
					modifier: true,
					modifiedtime: true
				});
				props.pushTo('/card', {
					status: 'edit',
					id: props.getUrlParam('id')
				});
				toggleShow(this.props);
				//设置一下修改时根据国家地区设置行政区划参照的参照范围
				//特殊设置一下返回按钮的可见性
				this.setState({
					backVisible: false
				});
				break;
			case 'Delete':
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140TAXRE-000004'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
					content: this.state.json['110140PST0032'], // 提示内容,非必输/* 国际化处理： 确认删除？*/
					noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false, // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.pubjson['10140PUBMESSAGE-000029'], // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.pubjson['10140PUBMESSAGE-000007'], // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.delConfirm.bind(this) // 确定按钮点击调用函数,非必输
				});
				break;
			case 'Back':
				props.pushTo('/list', {});
				break;
			case 'Save':
				this.saveClick();
				break;
			case 'Cancel':
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['110140PST0000'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
					content: this.state.json['110140PST0038'], // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
					noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false, // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140TAXRE-000006'], // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140TAXRE-000007'], // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.cancelSureEvent.bind(this) // 确定按钮点击调用函数,非必输
				});
				break;
			case 'AddLine':
				if (
					!this.props.form.getFormItemsValue(this.formId, 'pk_org') ||
					!this.props.form.getFormItemsValue(this.formId, 'pk_org').value
				) {
					toast({ color: 'warning', content: this.state.json['110140PST0029'] });
					return;
				}
				props.cardTable.addRow(this.tableId);
				props.cardTable.getAllRows(this.tableId).map((item) => {
					item.values['pk_group'] = {
						value: window.parent.GETBUSINESSINFO().groupId,
						display: window.parent.GETBUSINESSINFO().groupName
					};
					item.values['pk_org'] = props.form.getFormItemsValue(this.formId, 'pk_org');
				});
				toggleShow(this.props);

				break;
			case 'DelLine':
				let selectedRows = props.cardTable.getCheckedRows(this.tableId);
				let selectedIndex = [];
				selectedRows.forEach((item) => {
					selectedIndex.push(item.index);
				});
				props.cardTable.delRowsByIndex(this.tableId, selectedIndex);
				break;
			case 'Refresh':
				this.getdata(this.props.form.getFormItemsValue(this.formId, 'pk_planstrategygroup').value, () => {
					toast({ title: this.state.json['110140PST0042'], color: 'success' }); /* 国际化处理： 刷新成功！*/
				});
				break;
			case 'SaveAdd':
				this.saveClick(true);
				break;
			default:
				break;
		}
	};

	cancelSureEvent() {
		if (this.props.getUrlParam('status') === 'add') {
			let pk = getCurrentLastId(dataSource);
			this.getDataForCache(pk, () => {
				//编辑态取消时，修正一下页面状态
				this.props.pushTo('/card', {
					status: 'browse',
					id: this.props.getUrlParam('id')
				});
				this.props.form.setFormStatus(this.formId, 'browse');
				this.props.cardTable.setStatus(this.tableId, 'browse');
			});
		}
		if (this.props.getUrlParam('status') === 'edit') {
			this.props.form.cancel(this.formId);
			this.props.cardTable.resetTableData(this.tableId);
			this.props.pushTo('/card', {
				status: 'browse',
				id: this.props.getUrlParam('id')
			});
			toggleShow(this.props);
		}
		//特殊设置一下返回按钮的可见性
		this.setState({
			backVisible: true
		});
	}

	pageInfoClick = (props, pk) => {
		this.getDataForCache(pk);
	};
	//确认修改计划组织
	sureChangeOrg() {
		this.props.form.setFormItemsValue(formId, {
			vpsgcode: { value: '', display: '' },
			vpsgname: { value: '', display: '' }
		});
		this.props.cardTable.setTableData(tableId, { rows: [] });
		if (this.props.form.getFormItemsValue(formId, 'pk_org').value) {
			this.props.form.setFormItemsDisabled(formId, {
				vpsgcode: false,
				vpsgname: false,
				vnote: false
			});
			this.props.button.setButtonDisabled([ 'AddLine' ], false);
		} else {
			this.props.form.setFormItemsDisabled(formId, {
				vpsgcode: true,
				vpsgname: true,
				vnote: true
			});
			this.props.button.setButtonDisabled([ 'AddLine' ], true);
		}
		//加入表体计划策略的参照过滤
		let meta = this.props.meta.getMeta();
		meta[tableId].items.map((item) => {
			if (item.attrcode == 'pk_planstrategy') {
				item.queryCondition = () => {
					return { pk_org: value.value }; // 根据pk_org过滤
				};
			}
		});
		meta[moretableId].items.map((item) => {
			if (item.attrcode == 'pk_planstrategy') {
				item.queryCondition = () => {
					return { pk_org: value.value }; // 根据pk_org过滤
				};
			}
		});
	}
	//取消修改工厂
	cancelChangeOrg() {
		let { display, value } = this.old_pk_org;
		this.props.form.setFormItemsValue(formId, {
			pk_org: { display, value }
		});
	}
	afterEvent(props, moduleId, key, value, oldValue) {
		if (key != 'pk_org' || value.value == oldValue.value) {
			return;
		}
		if (key == 'pk_org') {
			if (oldValue && oldValue.value) {
				props.modal.show('sureChangeOrg');
				this.old_pk_org = oldValue;
			} else {
				props.form.setFormItemsDisabled(formId, {
					vpsgcode: false,
					vpsgname: false,
					vnote: false
				});
				props.button.setButtonDisabled([ 'AddLine' ], false);
			}
		}
	}

	//通过单据id查询单据信息
	getdata = (pk, callback) => {
		let data = { pk };
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				if (res.data.head) {
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					toggleShow(this.props);
				}
				if (res.data.body) {
					this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
				} else {
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
				}
				if (callback && typeof callback == 'function') {
					callback.call(this);
				}
			}
		});
	};

	onCardTableAfterEvent(props, moduleId, key, value, changedrows, index, record) {
		let planpurposemap = [ this.state.json['110140PST0045'], this.state.json['110140PST0046'] ];
		if (key == 'pk_planstrategy') {
			let addcount = 0;
			if (!value || value.length == 0) {
				props.cardTable.setValByKeyAndIndex(this.tableId, index, 'pk_planstrategy', { value: '', display: '' });
				props.cardTable.setValByKeyAndIndex(this.tableId, index, 'pk_planstrategy.name', {
					value: '',
					display: ''
				});
				props.cardTable.setValByKeyAndIndex(this.tableId, index, 'fplanpurpose', { value: '', display: '' });
				return;
			}
			changedrows.map((item) => {
				if (item.newvalue.value != item.oldvalue.value) {
					if (addcount != 0) {
						props.cardTable.addRow(tableId);
						props.cardTable.getAllRows(this.tableId).map((item) => {
							item.values['pk_group'] = {
								value: window.parent.GETBUSINESSINFO().groupId,
								display: window.parent.GETBUSINESSINFO().groupName
							};
							item.values['pk_org'] = props.form.getFormItemsValue(this.formId, 'pk_org');
						});
					}
					let setObj = {};
					setObj.value = value[addcount].refpk;
					setObj.display = value[addcount].refcode;
					props.cardTable.setValByKeyAndIndex(this.tableId, index + addcount, 'pk_planstrategy', setObj);
					props.cardTable.setValByKeyAndIndex(this.tableId, index + addcount, 'pk_planstrategy.name', {
						value: value[addcount].refname,
						display: value[addcount].refname
					});
					if (item.newvalue.value) {
						let newitem = value.find((val) => val.refpk == item.newvalue.value);
						props.cardTable.setValByKeyAndIndex(this.tableId, index + addcount, 'fplanpurpose', {
							value: newitem.values.fplanpurpose.value,
							display: planpurposemap[newitem.values.fplanpurpose.value]
						});
					} else {
						props.cardTable.setValByKeyAndIndex(this.tableId, index + addcount, 'fplanpurpose', {});
					}
					addcount++;
				} else {
					addcount++;
				}
			});
		}
	}

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

	onCardTableBeforeEvent = (props, moduleId, key, value, changedrows, index, record, status) => {
		if (key == 'pk_planstrategy') {
			props.meta.getMeta()[this.tableId].items.map((item) => {
				item.queryCondition = () => {
					let pkorg = props.form.getFormItemsValue(this.formId, 'pk_org').value;
					return { pk_org: pkorg };
				};
			});
		}
		return true;
	};

	//保存单据
	saveClick = (saveAdd = false) => {
		if (!this.props.form.isCheckNow(formId, 'warning')) {
			return;
		}
		// 空行过滤
		this.props.cardTable.filterEmptyRows(tableId, [ 'pk_planstrategy.name' ],'include');
		let isempty = true;
		let rows = this.props.cardTable.getAllRows(this.tableId);
		rows.forEach((row) => {
			if (row.status != 3) {
				isempty = false;
			}
		});
		if (isempty) {
			toast({
				color: 'warning',
				title: this.state.json['110140PST0044'] ? this.state.json['110140PST0044'] : '110140PST0044'
			});
			return;
		}
		let CardData = this.props.createMasterChildData(pageId, this.formId, this.tableId);
		delete CardData.head[formId].rows[0].values[childValues];
		let url = saveUrl; //新增保存
		if (this.props.getUrlParam('status') === 'edit') {
			url = updateUrl; //修改保存
		}
		ajax({
			url: url,
			data: CardData,
			success: (res) => {
				let pk_value = null;
				if (res.success) {
					if (res.data && !saveAdd) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							toggleShow(this.props);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						} else {
							this.props.cardTable.setTableData(this.tableId, { rows: [] });
						}
					} else {
						pk_value = res.data.head[this.formId].rows[0].values[pk_item].value;
					}
					//更正缓存
					if (url == saveUrl) {
						//新增保存
						addCache(pk_value, res.data, this.formId, dataSource);
					} else {
						//修改保存
						updateCache(
							pk_item,
							res.data.head[formId].rows[0].values[pk_item].value,
							res.data,
							formId,
							dataSource
						);
					}
					let pkorg = this.props.form.getFormItemsValue(formId, 'pk_org')
					if (!saveAdd) {
						this.props.pushTo('/card', {
							status: 'browse',
							id: pk_value
						});
						toggleShow(this.props);
						//特殊设置一下返回按钮的可见性
						this.setState({
							backVisible: true
						});
					} else {
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.table.setAllTableData(this.tableId, { rows: [] });
						this.props.form.setFormItemsDisabled(formId, {
							pk_org: false,
							creator: true,
							creationtime: true,
							modifier: true,
							modifiedtime: true
						});
						toggleShow(this.props);
						this.setDefaultValue();
						this.props.form.setFormItemsValue(formId, {pk_org:pkorg})
						this.props.form.setFormItemsDisabled(formId, {
							vpsgcode: false,
							vpsgname: false,
							vnote: false
						});
						this.props.button.setButtonDisabled([ 'AddLine' ], false);
					}
					toast({ content: this.state.json['110140PST0037'], color: 'success' }); /* 国际化处理： 保存成功*/
				}
			}
		});
	};

	getDataForCache(pk, callback) {
		if (!pk) {
			this.props.pushTo('/list', {});
			return;
		}
		let cardData = getCacheById(pk, dataSource);
		if (cardData) {
			this.props.form.setAllFormValue({ [formId]: cardData.head[formId] });
			if (cardData.body && cardData.body[tableId]) {
				this.props.cardTable.setTableData(tableId, cardData.body[tableId]);
			} else {
				this.props.cardTable.setTableData(tableId, { rows: [] });
			}
			this.props.setUrlParam(pk); //动态修改地址栏中的id的值
		} else {
			this.getdata(pk);
			this.props.setUrlParam(pk); //动态修改地址栏中的id的值
		}
		if (callback && typeof callback == 'function') {
			callback.call(this);
		}
		toggleShow(this.props);
	}

	//删除单据
	delConfirm = () => {
		ajax({
			url: deleteUrl,
			data: {
				param: [
					{
						id: this.props.form.getFormItemsValue(this.formId, 'pk_planstrategygroup').value,
						ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
					}
				]
			},
			success: (res) => {
				if (res.data.sucessNum == 1) {
					let id = this.props.form.getFormItemsValue(this.formId, 'pk_planstrategygroup').value;
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
						//this.props.cardPagination.setCardPaginationId({id: nextId,status: 1})
						toast({ color: 'success', title: this.state.json['110140PST0033'] }); /* 国际化处理： 删除成功！*/
					});
				} else {
					toast({ color: 'danger', content: res.data.errorMessages[0] }); /* 国际化处理： 删除成功*/
				}
			}
		});
	};

	updateCardTableBtnStatus() {
		let checkedRows = this.props.cardTable.getCheckedRows(this.tableId);
		if (checkedRows.length > 0) {
			this.props.button.setButtonDisabled([ 'DelLine' ], false);
		} else {
			this.props.button.setButtonDisabled([ 'DelLine' ], true);
		}
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

	//获取列表肩部信息
	getTableHead = () => {
		let { button } = this.props;
		let { createButtonApp } = button;
		let buttons = this.props.button.getButtons();
		let status = this.props.getUrlParam('status');
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons" style={{ padding: '0px' }}>
					{createButtonApp({
						area: 'body-action', //按钮注册中的按钮区域
						onButtonClick: this.buttonClick.bind(this)
					})}
					{this.props.cardTable.createBrowseIcons(this.tableId, {
						iconArr: [ 'close', 'open', 'max', 'setCol' ],
						maxDestAreaId: 'nc-bill-card'
					})}
				</div>
			</div>
		);
	};
	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		const { createCardPagination } = cardPagination;
		const { createBillHeadInfo } = this.props.BillHeadInfo
		let { createForm } = form;
		let { createCardTable } = cardTable;
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
										title: this.state.json['110140PST0022'],
										backBtnClick: ()=>{
											this.buttonClick.call(this, this.props, 'Back')
										}
									})}
								</span>
							</div>
							<div className="header-button-area">
								{createButtonApp({
									area: 'header-action', //按钮注册中的按钮区域
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
							onAfterEvent: this.afterEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead.bind(this),
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
				{createModal('sureChangeOrg', {
					color: 'warning',
					size: 'sm',
					title: this.state.json ? this.state.json['110140PST0036'] : '110140PST0036' /* 国际化处理： 提示信息*/,
					content: this.state.json ? this.state.json['110140PST0043'] : '110140PST0043' /* 国际化处理： */,
					beSureBtnClick: this.sureChangeOrg.bind(this),
					cancelBtnClick: this.cancelChangeOrg.bind(this)
				})}
			</div>
		);
	}
}

Card = createPage({
	initTemplate: []
})(Card);

export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65