//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 供应商税类
 * @author	wangyang12
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, cacheTools, base, high, toast, getBusinessInfo, print, getMultiLang, promptBox, createPageIcon } from 'nc-lightapp-front';
const { PrintOutput } = high;
import Utils from '../../../../uapbd/public/utils';
let { NCPopconfirm, NCModal } = base;
let { NCDropdown: Dropdown, NCIcon: Icon, NCMenu: Menu, NCButton: Button } = base;
import './index.less';
import ProducePlanGridRef from '../../../../uapbd/refer/org/ProducePlanGridRef/index';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';


const searchId = 'listqry';
const tableId = 'list';
const pagecode = '10140BOMRT_list';
const appcode = '10140BOMRT';
const urls = {
	print: '/nccloud/mmbd/vermatch/print.do',
	save: '/nccloud/mmbd/vermatch/save.do',
	query: '/nccloud/mmbd/vermatch/queryAll.do',
	queryPage: '/nccloud/mmbd/vermatch/queryPage.do',
	queryTemplet: '/nccloud/platform/templet/querypage.do',
	customerevent:'/nccloud/mmbd/vermatch/custmatevent.do'
};
const getOrgVid = '/nccloud/mmbd/pub/queryOrgVid.do';

const isShowOffEnable = false;			//是否启用“显示停用”功能
let allTableData = {};
const keys = ['dataoriginflag'];  //过来空行时，忽略的字段

//获取并初始化模板
let initTemplate = (props) => {
	props.createUIDom({
		pagecode: pagecode,
		//appcode : appcode
	},
		(data) => {
			let meta = data.template;
			meta = modifierMeta(props, meta)
			props.meta.setMeta(meta);
			data.button && props.button.setButtons(data.button);
			data.button && props.button.setButtonDisabled({
				Delete: true,
				Save: true,
				Cancel: true
			});
			props.button.setPopContent({ 'Delline': props.MutiInit.getIntl("10140BOMRT") && props.MutiInit.getIntl("10140BOMRT").get('10140BOMRT-000000') })/* 国际化处理： 确认要删除该信息吗*/
			props.button.setButtonVisible(['InsertLine', 'Delline'], false)
		});

}

//对表格模板进行加工操作
function modifierMeta(props, meta) {
	meta[tableId].status = "browse";
	meta[searchId].items.forEach(item => {
		switch (item.attrcode) {
			case 'pk_org': {
				
				item.queryCondition = () => {
					return {
						GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter'

					};
				};
			} break;
			case 'ccustomerid':{
				item.isShowUnit = true;
				
				item.queryCondition = () => {  
					return {
						pk_org: props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue
					}
				}

				item.unitProps ={
					multiLang: {
						domainName: 'uapbd',
						currentLocale: 'zh-CN',
						moduleId: 'refer_uapbd',
					},
					unitProps: unitConf,
					refType: 'grid',
					refName: 'refer-000535',/* 国际化处理： 计划组织*/
					placeholder: 'refer-000535',/* 国际化处理： 计划组织*/
					refCode: 'uapbd.refer.org.ProducePlanGridRef',
					queryGridUrl: '/nccloud/uapbd/org/ProducePlanGridRef.do',
					isMultiSelectedEnabled: false,
					columnConfig: [{ name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] }]/* 国际化处理： 编码,名称*/
				}
				item.unitProps.queryCondition=()=>{
						return { GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' }
					}
				
			}
				break;
			case 'cvendorid':{
				item.isShowUnit = true;
				
				item.queryCondition = () => {
				let data = props.search.getSearchValByField(searchId,'pk_org');
                data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
                return { pk_org: data };
					// return {
						
					// 	pk_org: props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue
					// }
				}

				item.unitProps ={
					multiLang: {
						domainName: 'uapbd',
						currentLocale: 'zh-CN',
						moduleId: 'refer_uapbd',
					},
					unitProps: unitConf,
					refType: 'grid',
					refName: 'refer-000535',/* 国际化处理： 计划组织*/
					placeholder: 'refer-000535',/* 国际化处理： 计划组织*/
					refCode: 'uapbd.refer.org.ProducePlanGridRef',
					queryGridUrl: '/nccloud/uapbd/org/ProducePlanGridRef.do',
					isMultiSelectedEnabled: false,
					columnConfig: [{ name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] }]/* 国际化处理： 编码,名称*/
				}
				item.unitProps.queryCondition=()=>{

					
						return { GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' }
					}
				}
				break;
			case 'cproductorid':{
				item.isShowUnit = true;
				
				item.queryCondition = () => {
					return {
						pk_org: props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue
					}
				}

				item.unitProps ={
					multiLang: {
						domainName: 'uapbd',
						currentLocale: 'zh-CN',
						moduleId: 'refer_uapbd',
					},
					unitProps: unitConf,
					refType: 'grid',
					refName: 'refer-000535',/* 国际化处理： 计划组织*/
					placeholder: 'refer-000535',/* 国际化处理： 计划组织*/
					refCode: 'uapbd.refer.org.ProducePlanGridRef',
					queryGridUrl: '/nccloud/uapbd/org/ProducePlanGridRef.do',
					isMultiSelectedEnabled: false,
					columnConfig: [{ name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] }]/* 国际化处理： 编码,名称*/
				}
				item.unitProps.queryCondition=()=>{
						return { GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' }
					}
			}
				break;
			case 'cprojectid':{
				item.isShowUnit = true;
				
				item.queryCondition = () => {
					return {
						pk_org: props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue
					}
				}

				item.unitProps ={
					multiLang: {
						domainName: 'uapbd',
						currentLocale: 'zh-CN',
						moduleId: 'refer_uapbd',
					},
					unitProps: unitConf,
					refType: 'grid',
					refName: 'refer-000535',/* 国际化处理： 计划组织*/
					placeholder: 'refer-000535',/* 国际化处理： 计划组织*/
					refCode: 'uapbd.refer.org.ProducePlanGridRef',
					queryGridUrl: '/nccloud/uapbd/org/ProducePlanGridRef.do',
					isMultiSelectedEnabled: false,
					columnConfig: [{ name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] }]/* 国际化处理： 编码,名称*/
				}
				item.unitProps.queryCondition=()=>{
						return { GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' }
					}
			}
				break;
			case 'cmaterialid': {
				item.isHasDisabledData=true;
				item.isShowDisabledData=true;
				item.queryCondition = () => {
					return {
						GridRefActionExt: ' nccloud.web.mmbd.vermatch.action.VermatchFilterMatAction',
						pk_org: props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue
					};
				};
			} break;
			
			case 'cbomid':{
				item.queryCondition = () => {
					let param = {
						pk_group: window.parent.GETBUSINESSINFO().groupId,
						pk_org: props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue,
						fbomtype: 1
					}
					if (props.search.getSearchValByField(searchId, 'cmaterialid').value && props.search.getSearchValByField(searchId, 'cmaterialid').value.firstvalue ) {
						param.hcmaterialid = props.search.getSearchValByField(searchId, 'cmaterialid' ).value.firstvalue;
					}
					if (props.search.getSearchValByField(searchId, 'cmaterialid').value && props.search.getSearchValByField(searchId, 'cmaterialvid').value.firstvalue) {
						param.hcmaterialvid = props.search.getSearchValByField(searchId, 'cmaterialvid').value.firstvalue;
					}
					return param
				}
			} break;
			case 'cpackbomid':{
				item.queryCondition = () => {
					let param = {
						pk_group: window.parent.GETBUSINESSINFO().groupId,
						pk_org: props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue,
						fbomtype: 2
					}
					if (props.search.getSearchValByField(searchId, 'cmaterialid').value && props.search.getSearchValByField(searchId, 'cmaterialid').value.firstvalue ) {
						param.hcmaterialid = props.search.getSearchValByField(searchId, 'cmaterialid' ).value.firstvalue;
					}
					if (props.search.getSearchValByField(searchId, 'cmaterialid').value && props.search.getSearchValByField(searchId, 'cmaterialvid').value.firstvalue) {
						param.hcmaterialvid = props.search.getSearchValByField(searchId, 'cmaterialvid').value.firstvalue;
					}
					return param
				}
			} break;
			case 'workcenter':{
				item.queryCondition = () => {
					return {
						pk_org: props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue
					}
				}
			} break;
			default:
				break;
		}
	})
	//VermatchEditFilterMatAction
	meta[tableId].items.forEach(item => {
		switch (item.attrcode) {
			case 'cmaterialid': {
				// item.isHasDisabledData=true;
				// item.isShowDisabledData=true;
				item.queryCondition = () => {
					return {
						GridRefActionExt: ' nccloud.web.mmbd.vermatch.action.VermatchEditFilterMatAction',
						pk_org: props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue
					};
				};
				item.editAfterFlag = true;
			}
				break;
			// case 'cmaterialvid':{
			// 	item.queryCondition = () => {
			// 		return {
			// 		  'pk_org': props.form.getFormItemsValue(AREA.bomcardh, "pk_org").value, 
			// 		  materialoid: props.form.getFormItemsValue(AREA.bomcardh, 'hcmaterialid').value,
			// 		  GridRefActionExt: 'nccloud.web.mmbd.refer.pub.MaterialvidRefFilter'
			// 		}
			// 	  }
			// }
		}
	})



	//添加表格操作列
	let event = {
		label: props.MutiInit.getIntl("10140BOMRT") && props.MutiInit.getIntl("10140BOMRT").get('10140BOMRT-000001'),/* 国际化处理： 操作*/
		attrcode: 'opr',
		key: 'opr',
		itemtype: 'customer',
		visible: true,
		fixed: 'right',
		render(text, record, index) {
			let tableStatus = props.editTable.getStatus(tableId);
			let btnArray = ['DeleteSingle', 'InsertLine', 'Delline'];

			return props.button.createOprationButton(
				btnArray,
				{
					area: "table-opr-button",
					buttonLimit: 3,
					onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
				}
			)
		}
	};

	meta[tableId].items.push(event);

	//props.renderItem('table',tableId,'creator',refer('creator'));
	return meta;
}

function tableButtonClick(props, id, text, record, index) {

	switch (id) {
		case 'Delline': {
			let tableStatus = props.editTable.getStatus(tableId);
			if (tableStatus == 'browse') {

			} else {
				props.editTable.deleteTableRowsByIndex(tableId, index);
			}
		}
			break;
		case 'InsertLine': {
			let info = window.parent.GETBUSINESSINFO();
			let pk_org = props.search.getSearchValByField(searchId, 'pk_org');

			ajax({
				url: getOrgVid,
				data: { pk_org: pk_org.value.firstvalue },
				success: (res) => {
					props.editTable.addRow(tableId, index, true, {
						pk_group: { value: info.groupId, display: info.groupName },
						pk_org: { value: props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue, display: pk_org.display },
						pk_org_v: { value: res.data[props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue] },
						deffectdate: { value: getBusinessInfo().businessDate }
					});
				}
			})

		} break;
		case 'DeleteSingle': {
			let delObj = {
				rowId: index,
				status: '3',
				values: {
					// ts: {
					// 	display: '时间戳',
					// 	value: record.values.ts.value
					// },
					// pk_suptaxes: {
					// 	display: '主键',
					// 	value: record.values.pk_suptaxes.value
					// }
				}
			};
			delObj.values = record.values;
			let indexArr = [];
			indexArr.push(index);
			let data = {
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: [delObj],
					areacode: tableId//添加表单的areacode编码
				}
			};
			ajax({
				url: urls['save'],
				data,
				success: function (res) {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
					let { success, data } = res;
					if (success) {
						props.editTable.deleteTableRowsByIndex(tableId, indexArr);
						let allD = props.editTable.getAllData(tableId);
						Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
						props.editTable.setTableData(tableId, allD);
						allTableData = allD;
						toast({ title: props.MutiInit.getIntl("10140BOMRT") && props.MutiInit.getIntl("10140BOMRT").get('10140BOMRT-000002'), color: 'success' });/* 国际化处理： 删除成功！*/
						//getLoadData(props);
					}
				}.bind(this)
			});
		}
			break;
		default:
			break;
	}
}


//请求列表数据
function getLoadData(props) {
	ajax({
		url: urls['query'],
		data: {
			pageid: pagecode,
		},
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data && data[tableId]) {
					props.editTable.setTableData(tableId, data[tableId]);
					let flag = data[tableId].rows && data[tableId].rows.length > 0;
					props.button.setButtonDisabled({
						Edit: !flag,
						Print: !flag,
						Output: !flag,
					});
				} else {
					props.editTable.setTableData(tableId, { rows: [] });
					props.button.setButtonDisabled({
						Edit: true,
						Print: true,
						Output: true,
					});
				}
			}
		}
	});
};

class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.searchVal = null;
		this.searchId = searchId;//查询区域id
		this.tableId = tableId;//表格id
		this.state = {
			searchValue: '',
			searchDisable: false,				//简单搜索框是否禁用	true：禁用		false：可用
			//moreButton:false,				//更多按钮状态
			json: {},
			pk_org: null,
			showOffDisable: true,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff: false,			//列表是否显示停用数据
			pks: [],hidesearch:false
		}
	}
	componentDidMount() {
		//this.getData(false);
		let visibleButtons = []
		let unvisibleButtons = []
		unvisibleButtons = ['Save', 'Cancel'];
		visibleButtons = ['Add', 'Edit', 'Delete', 'Print', 'Output', 'Refresh']
		this.props.button.setButtonVisible(unvisibleButtons, false);
		this.props.button.setButtonVisible(visibleButtons, true);
		this.props.button.setButtonDisabled(['Edit', 'Delete', 'Print', 'Output', 'Refresh'], true);
	}

	componentWillMount() {
		let callback = (json) => {
			this.setState({ json })
		}
		getMultiLang({ moduleId: appcode, domainName: 'uapbd', callback })
		let callbacknoinit = (json, status, inlt) => {
			if (status) {
				this.setState({ pubjson: { ...json } })
			}
		}
		this.props.MultiInit.getMultiLang({ moduleId: '10140MMPUBMSG', domainName: 'uapbd', callback: callbacknoinit })

	}

	componentDidUpdate() {
		let tableStatus = this.props.editTable.getStatus(tableId)
		if (tableStatus != 'add' && tableStatus != 'edit') {
			window.onbeforeunload = null;
		} else {
			window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
				return '';
			};
		}
	}

	pageInfoClick = (props, config, pks) => {

		let pageInfo = props.editTable.getTablePageInfo(this.tableId);
		let searchVal = props.search.getAllSearchData(searchId);
		// 后台还没更新，暂不可用
		let queryInfo = this.props.search.getQueryInfo(searchId)

		let OID = this.props.meta.getMeta()[searchId].oid;

		let data = {
			...queryInfo,
			showDisableDataFlag: this.state.checkValue,
			querycondition: searchVal,
			pageCode: pagecode,
			queryAreaCode: searchId,  //查询区编码
			oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'simple',
			pageInfo: pageInfo,
			pagepks: pks  //翻页时pk集合
		};
		//得到数据渲染到页面
		ajax({
			url: urls.queryPage,
			data: data,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改,
			success: function (res) {
				let { success, data } = res;
				if (success) {
					if (data) {
						props.editTable.setTableData(tableId, data[tableId]);
						// props.table.setAllTableData(tableId, data[tableId]);
					} else {
						props.table.setAllTableData(tableId, { rows: [] });
					}
				}
			}
		});
	}

	clickSearchBtn = (props, searchVal) => {
		if (props.editTable.getStatus(tableId) == 'edit') {
			return; 
		}
		this.searchVal = searchVal
		//cacheTools.set('searchParams', searchVal)

		this.getData(searchVal)
	}
	//请求列表数据
	getData = (searchVal) => {
		//let showOff = this.state.isShowOff;		
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		//获取查询模板信息
		let queryInfo = this.props.search.getQueryInfo('listqry')
		console.log(queryInfo)
		let OID = queryInfo.oid
		let psgData = {
			...queryInfo,
			pageInfo: {
				pageIndex: 0,
				pageSize: 10,
				total: 0,
				totalPage: 0
			},
			pagecode: pagecode,
			queryAreaCode: searchId,  //查询区编码
			oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			queryType: 'simple',
		};

		ajax({
			url: urls['query'],
			data: psgData,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {

						this.props.editTable.setTableData(tableId, data[tableId]);
						this.props.button.setButtonDisabled({
							Edit: false,
							Print: false,
							Output: false,
						});
						let allPks = []
						data[tableId].allpks.forEach(row => {
							allPks.push(row)
						})
						cacheTools.set('allpks', allPks);
					} else {
						this.props.editTable.setTableData(tableId, { rows: [] });
						this.props.button.setButtonDisabled({
							Edit: true,
							Print: true,
							Output: true,
						});
						toast({ color: 'success', title: this.state.pubjson['10140PUBMESSAGE-000030'] })
					}

					this.toggleShow("browse");
				}
			}
		});
	};

	//切换页面状态
	toggleShow = (status) => {
		let flag = status === 'browse' ? false : true;
		if (!flag) {
			this.props.button.setPopContent('DeleteSingle', this.state.json['10140BOMRT-000003']);/* 国际化处理： 确认要删除该信息吗？*/
			this.props.search.setDisabled(searchId, false)
			this.setState({hidesearch:false})

		} else {
			this.props.button.setPopContent('Delline', '');
			this.props.search.setDisabled(searchId, true)
			this.setState({hidesearch:true})
		}
		// this.props.button.setButtonVisible(['Save','Cancel'],flag);
		// this.props.button.setButtonVisible(['Edit','Refresh','Print','Output'],!flag);
		this.props.button.setButtonVisible({
			Save: flag,
			Add: true,
			Delete: true,
			Edit: !flag,
			Cancel: flag,
			Refresh: !flag,
			Print: !flag,
			Output: !flag
		});
		this.props.button.setDisabled({
			Save: !flag,
			Add: false,
			Delete: false,
			Cancel: !flag,
			Refresh: flag,
		});
		let props = this.props;
		this.props.button.setMainButton('Add', !flag);
		if (!flag) {//设置浏览态打印按钮是否可用
			if (this.props.editTable.getNumberOfRows(tableId) > 0) {
				this.props.button.setDisabled({
					Print: false,
					Output: false,
				});
			} else {
				this.props.button.setDisabled({
					Print: true,
					Output: true,
				});
			}
		}
		this.setState({
			searchDisable: flag,
			showOffDisable: flag
		});
		this.props.editTable.setStatus(tableId, status === 'browse' ? "browse" : "edit");

	}

	//表格编辑后事件
	onAfterEvent(props, moduleId, key, changerows, value, index, data) {
		if (key == 'cmaterialvid') {
			if (!changerows.values) {

				return;
			}
			let version = changerows.values.version.value;
			props.editTable.setValByKeyAndIndex(moduleId, index, 'cmaterialvid', { display: version, value: changerows.refpk })
			props.editTable.setValByKeyAndIndex(moduleId, index, 'cmaterialname', { display: changerows.values.name.value, value: changerows.values.name.value })

			props.editTable.setValByKeyAndIndex(moduleId, index, 'cbomid', { display: '', value: '' })
			props.editTable.setValByKeyAndIndex(moduleId, index, 'cpackbomid', { display: '', value: '' })
			props.editTable.setValByKeyAndIndex(moduleId, index, 'crtid', { display: '', value: '' })

			let urldata = {
				pageid: pagecode,
				model: {
					areaType: "table",
					pageinfo: null,
					rows: [],
					areacode: tableId//添加表单的areacode编码
				}
			};
			urldata.model.rows.push(data);
			ajax(
				{
					url: urls['customerevent'],
					data: urldata,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							if (data) {
								let custmat = data[tableId].rows[0].values.ccustmaterialid;
								props.editTable.setValByKeyAndIndex(moduleId, index, 'ccustmaterialid',custmat);

								// props.editTable.setValByKeyAndRowId(moduleId,data)
							}

						}
					}

				}
			)
		}
		if (key == 'cmaterialid') {
			if (!changerows.values) {
				props.editTable.setValByKeyAndIndex(moduleId, index, 'cmaterialname', { display: '', value: '' })
				props.editTable.setValByKeyAndIndex(moduleId, index, 'cmaterialid.materialspec', { display: '', value: '' })
				props.editTable.setValByKeyAndIndex(moduleId, index, 'cmaterialid.materialtype', { display: '', value: '' })
				props.editTable.setValByKeyAndIndex(moduleId, index, 'cmaterialid.graphid', { display: '', value: '' })
				//清空
				props.editTable.setValByKeyAndIndex(moduleId, index, 'cmaterialvid', { display: '', value: '' })
				props.editTable.setValByKeyAndIndex(moduleId, index, 'cbomid', { display: '', value: '' })
				props.editTable.setValByKeyAndIndex(moduleId, index, 'cpackbomid', { display: '', value: '' })
				props.editTable.setValByKeyAndIndex(moduleId, index, 'crtid', { display: '', value: '' })

				return;
			}
			props.editTable.setValByKeyAndIndex(moduleId, index, 'cmaterialname', { display: changerows.values.name.value, value: changerows.values.name.value })
			props.editTable.setValByKeyAndIndex(moduleId, index, 'cmaterialid.materialspec', { display: changerows.values.materialspec.value, value: changerows.values.materialspec.value })
			props.editTable.setValByKeyAndIndex(moduleId, index, 'cmaterialid.materialtype', { display: changerows.values.materialtype.value, value: changerows.values.materialtype.value })
			props.editTable.setValByKeyAndIndex(moduleId, index, 'cmaterialid.graphid', { display: changerows.values.graphid.value, value: changerows.values.graphid.value })
			//清空
			props.editTable.setValByKeyAndIndex(moduleId, index, 'cmaterialvid', { display: '', value: '' })
			props.editTable.setValByKeyAndIndex(moduleId, index, 'cbomid', { display: '', value: '' })
			props.editTable.setValByKeyAndIndex(moduleId, index, 'cpackbomid', { display: '', value: '' })
			props.editTable.setValByKeyAndIndex(moduleId, index, 'crtid', { display: '', value: '' })

			let urldata = {
				pageid: pagecode,
				model: {
					areaType: "table",
					pageinfo: null,
					rows: [],
					areacode: tableId//添加表单的areacode编码
				}
			};
			urldata.model.rows.push(data);
			ajax(
				{
					url: urls['customerevent'],
					data: urldata,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							if (data) {
								let custmat = data[tableId].rows[0].values.ccustmaterialid;
								props.editTable.setValByKeyAndIndex(moduleId, index, 'ccustmaterialid',custmat);

								// props.editTable.setValByKeyAndRowId(moduleId,data)
							}

						}
					}

				}
			)

		}
		if (key == 'dloseeffectdate') {
			if (!changerows) {
				props.editTable.setValByKeyAndIndex(moduleId, index, 'dloseeffectdate', { value: '2999-12-31 23:59:59' })
				return;
			}
			let effectdate = new Date(data.values.deffectdate.value);
			let denddate = new Date(changerows);
			if (denddate.getTime() < effectdate.getTime()) {
				props.editTable.setValByKeyAndIndex(moduleId, index, 'dloseeffectdate', { value: '2999-12-31 23:59:59' })
			}
		}
		if (key == 'deffectdate') {
			if (!changerows) {
				props.editTable.setValByKeyAndIndex(moduleId, index, 'deffectdate', { value: getBusinessInfo().businessDate })
				return;
			}
			let effectdate = new Date(changerows);
			let denddate = new Date(data.values.dloseeffectdate.value);
			if (denddate.getTime() < effectdate.getTime()) {
				props.editTable.setValByKeyAndIndex(moduleId, index, 'deffectdate', { value: getBusinessInfo().businessDate })
			}
		}
		if (key == 'ccustomerid') {
			if (value && value.value){
				props.editTable.setEditableByKey(moduleId, data.rowid, key, true);
			let urldata = {
				pageid: pagecode,
				model: {
					areaType: "table",
					pageinfo: null,
					rows: [],
					areacode: tableId//添加表单的areacode编码
				}
			};
			urldata.model.rows.push(data);
			ajax(
				{
					url: urls['customerevent'],
					data: urldata,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							if (data) {
								let custmat = data[tableId].rows[0].values.ccustmaterialid;
								props.editTable.setValByKeyAndIndex(moduleId, index, 'ccustmaterialid',custmat);

								// props.editTable.setValByKeyAndRowId(moduleId,data)
							}

						}
					}

				}
			)
			}else{
				props.editTable.setValByKeyAndIndex(moduleId, index, 'ccustmaterialid',{value:'',display:''});
	
			}
		}

		//自动增行
		// setTimeout(() => {
		// 	let length = this.props.editTable.getNumberOfRows(moduleId);
		// 	if(((length-2)===index)&&data.status==='2'){
		// 		this.props.editTable.filterEmptyRows(tableId,keys);
		// 		this.addTableRow(false);
		// 	}
		// }, 2);

	}
	//表格编辑前事件
	onBeforeEvent(props, moduleId, key, index, value, data) {
		let info = window.parent.GETBUSINESSINFO();
		if (key.attrcode == 'cmaterialid') {
			props.meta.getMeta()[tableId].items.forEach(item => {
				if (item.attrcode == 'cmaterialid') {
					item.editAfterFlag=true
				}
			})
			if (data.status != "2") {
				toast({ color: 'warning', title: this.state.json['10140BOMRT-000025'] });
				props.editTable.setEditableByKey(moduleId, data.rowid, key, false);
				return false;
			}
		}
		if (key.attrcode == 'cmaterialvid') {
			props.meta.getMeta()[tableId].items.forEach(item => {
				if (item.attrcode == 'cmaterialvid') {
					item.queryCondition = () => {
						return {
							pk_org: data.values.pk_org.value,
							GridRefActionExt: 'nccloud.web.mmbd.refer.pub.MaterialvidRefFilter',
							materialoid: data.values.cmaterialid.value
						}
					}
				}
			})
		}
		if (key.attrcode == 'workcenter') {
			props.meta.getMeta()[tableId].items.forEach(item => {
				if (item.attrcode == 'workcenter') {
					item.queryCondition = () => {
						return {
							pk_org: data.values.pk_org.value
						}
					}
				}
			})
		}
		if (key.attrcode == 'ccustomerid') {
			props.meta.getMeta()[tableId].items.forEach(item => {
				if (item.attrcode == 'ccustomerid') {
					item.queryCondition = () => {
						return {
							pk_org: data.values.pk_org.value
						}
					}
				}
			})
		}
		if (key.attrcode == 'cvendorid') {
			props.meta.getMeta()[tableId].items.forEach(item => {
				if (item.attrcode == 'cvendorid') {
					item.queryCondition = () => {
						return {
							pk_org: data.values.pk_org.value
						}
					}
				}
			})
		}
		if (key.attrcode == 'cprojectid') {
			props.meta.getMeta()[tableId].items.forEach(item => {
				if (item.attrcode == 'cprojectid') {
					item.queryCondition = () => {
						return {
							pk_org: data.values.pk_org.value
						}
					}
				}
			})
		}
		if (key.attrcode == 'cbomid') {
			props.meta.getMeta()[tableId].items.forEach(item => {
				if (item.attrcode == 'cbomid') {
					item.queryCondition = () => {
						return {
							pk_org: data.values.pk_org.value,
							pk_group: info.groupId,
							hcmaterialid: data.values.cmaterialid.value,
							hcmaterialvid: data.values.cmaterialvid.value,
							fbomtype: 1
						}
					}
				}
			})
		}
		if (key.attrcode == 'cpackbomid') {
			props.meta.getMeta()[tableId].items.forEach(item => {
				if (item.attrcode == 'cpackbomid') {
					item.queryCondition = () => {
						return {
							pk_org: data.values.pk_org.value,
							pk_group: info.groupId,
							hcmaterialid: data.values.cmaterialid.value,
							hcmaterialvid: data.values.cmaterialvid.value,
							fbomtype: 2
						}
					}
				}
			})
		}
		if (key.attrcode == 'crtid') {
			props.meta.getMeta()[tableId].items.forEach(item => {
				if (item.attrcode == 'crtid') {
					item.queryCondition = () => {
						return {
							pk_org: data.values.pk_org.value,
							pk_group: info.groupId,
							cmaterialid: data.values.cmaterialid.value,
							cmaterialvid: data.values.cmaterialvid.value,
						}
					}
				}
			})
		}
		if (key.attrcode == 'ccustmaterialid') {
			if (!data.values.ccustomerid.value) {
				toast({ color: 'warning', title: this.state.json['10140BOMRT-000024'] })
				return false;
			}
			props.meta.getMeta()[tableId].items.forEach(item => {
				if (item.attrcode == 'ccustmaterialid') {
					
					item.queryCondition = () => {
						return {

							pk_customer: data.values.ccustomerid.value,
						}
					}
				}
			})
		}

		if (key.attrcode == 'cprojectid') {

		}
		return true;

		//自动增行
		// setTimeout(() => {
		// 	let length = this.props.editTable.getNumberOfRows(moduleId);
		// 	if(((length-2)===index)&&data.status==='2'){
		// 		this.props.editTable.filterEmptyRows(tableId,keys);
		// 		this.addTableRow(false);
		// 	}
		// }, 2);

	}


	//更新按钮状态
	updateButtonStatus() {
		//此处控制按钮的隐藏显示及启用状态
		let tableData = this.props.editTable.getCheckedRows(tableId);
		let length = tableData.length;//获取列表页选择数据的行数
		if (length === 0) {//未选择数据
			this.props.button.setButtonDisabled({
				Delete: true
			});
		} else if (length === 1) {//选择一行数据
			this.props.button.setButtonDisabled({
				Delete: false
			});
		} else {//选择多行数据
			this.props.button.setButtonDisabled({
				Delete: false
			});
		}

	}

	//显示停用数据
	showOffChange() {
		this.setState({
			isShowOff: !this.state.isShowOff
		});
		this.getData(this.state.isShowOff);
	}

	onCancelSureEvent(props) {
		this.props.editTable.cancelEdit(tableId, () => { this.toggleShow("browse") });

		// this.props.editTable.cancelEdit(tableId);
		this.toggleShow("browse")
		this.props.button.setButtonVisible(['InsertLine', 'Delline'], false);
		this.props.button.setButtonVisible(['DeleteSingle'], true);
	}
	//按钮点击事件
	onButtonClick(props, id) {
		let info = window.parent.GETBUSINESSINFO();
		switch (id) {
			case 'Add':
				if (!this.props.search.getSearchValByField(searchId, 'pk_org')
					|| !this.props.search.getSearchValByField(searchId, 'pk_org').value
					|| !this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue) {
					toast({ content: this.state.json['10140BOMRT-000023'], color: 'warning' })/* 国际化处理： 没有要保存的数据*/
					return;
				}
				let pk_org = this.props.search.getSearchValByField(searchId, 'pk_org');

				ajax({
					url: getOrgVid,
					data: { pk_org: pk_org.value.firstvalue },
					success: (res) => {
						let num = this.props.editTable.getNumberOfRows(tableId); //获取列表总行数
						this.props.editTable.addRow(tableId, num, true, {
							pk_group: { value: info.groupId, display: info.groupName },
							pk_org: { value: this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue, display: pk_org.display },
							pk_org_v: { value: res.data[this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue] },
							deffectdate: { value: getBusinessInfo().businessDate }
						});
						this.toggleShow("edit");
					}
				})

				this.props.button.setButtonVisible(['InsertLine', 'Delline'], true);
				this.props.button.setButtonVisible(['DeleteSingle'], false);

				//this.props.editTable.setValByKeyAndIndex(tableId, num, 'dataoriginflag', {value: '0', display:this.state.json['10140BOMRT-000004']});//设置状态分类默认值/* 国际化处理： 本级产生*/
				break;
			case 'Edit':
				this.props.editTable.setStatus(tableId, 'edit');
				this.toggleShow("edit");
				this.props.button.setButtonVisible(['InsertLine', 'Delline'], true);
				this.props.button.setButtonVisible(['DeleteSingle'], false);
				break;
			case 'Cancel':
				let that = this;
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140BOMRT-000005'],/* 国际化处理： 确认取消*/
					content: this.state.json['10140BOMRT-000006'],/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick: () => { this.onCancelSureEvent(that.props) }
				})
				return;
				break;
			case 'Save':
				setTimeout(() => {
					this.props.editTable.filterEmptyRows(tableId, keys);
					//let tableData = this.props.editTable.getChangedRows(tableId);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
					let tableData = this.props.editTable.getAllRows(tableId, true);
					let that = this;
					if (!tableData || tableData.length === 0) {
						toast({ content: this.state.json['10140BOMRT-000007'], color: 'info' })/* 国际化处理： 没有要保存的数据*/
						return;
					}
					if (!this.props.editTable.checkRequired(tableId, tableData)) return;
					let data = {
						pageid: pagecode,
						model: {
							areaType: "table",
							pageinfo: null,
							rows: [],
							areacode: tableId//添加表单的areacode编码
						}
					};
					data.model.rows = tableData;
					this.props.validateToSave(data, () => {
						ajax({
							url: urls['save'],
							data,
							success: function (res) {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success, data } = res;
								if (success) {
									that.props.editTable.setStatus(tableId, 'browse');//设置表格状态为浏览态
									Utils.handleTableReData({
										data: data,
										tableId: tableId,
										props: this.props,
										empty: (data) => {	//数据为空时执行回调方法
											//this.props.editTable.setTableData(tableId, {rows: []});
											that.getData();
											// that.props.button.setButtonDisabled({
											// 	Edit:true,
											// 	Print:true,
											// 	Output:true,
											// });	
										},
										notEmpty: (data) => {
											let allD = this.props.editTable.getAllData(tableId);
											Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
											// Utils.convertGridEnablestate(data[tableId].rows);
											Utils.filterResult(allD, data[tableId].rows);//将保存后返回的数据重新放置到页面
											that.props.editTable.setTableData(tableId, allD);
											allTableData = allD;
											that.props.button.setButtonDisabled({
												Edit: false,
												Print: false,
												Output: false
											});
										}
									});
								}
								this.toggleShow("browse");
								this.props.button.setButtonVisible(['InsertLine', 'Delline'], false);
								this.props.button.setButtonVisible(['DeleteSingle'], true);
								toast({ title: this.state.json['10140BOMRT-000008'], color: 'success' });		/* 国际化处理： 保存成功！*/
							}.bind(this)
						});
					}, { [tableId]: "editTable" });
				}, 0)
				break;
			case "Delete":
				let selectedData = this.props.editTable.getCheckedRows(tableId);
				if (selectedData.length == 0) {
					toast({ content: this.state.json['10140BOMRT-000009'], color: 'warning' });/* 国际化处理： 请选择要删除的数据*/
					return
				}
				if (this.props.editTable.getStatus(tableId) === 'edit') {//编辑状态
					let indexArr = [];
					selectedData.forEach((val) => {
						indexArr.push(val.index);
					});
					this.props.editTable.deleteTableRowsByIndex(tableId, indexArr);
				} else {
					// this.props.modal.show('modal',{
					// 	title : '确认删除',
					// 	content : '您确认删除所选数据？',
					// 	beSureBtnClick : this.onDelForBrowse.bind(this)
					// });
					promptBox({
						color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title: this.state.json['10140BOMRT-000010'],/* 国际化处理： 删除提醒*/
						content: this.state.json['10140BOMRT-000011'],/* 国际化处理： 确定要删除数据吗？*/
						beSureBtnClick: () => { this.onDelForBrowse() }
					})
					this.toggleShow("browse");
				}

				break;
			case "Refresh":
				//this.setState({ searchValue:'' });
				this.getData();
				toast({ title: this.state.json['10140BOMRT-000012'], color: 'success' });/* 国际化处理： 刷新成功！*/
				break;
			case 'Print':
				this.output('print');
				break;
			case 'Output':
				this.output('output');
				break;
		}

	}

	//输出和打印功能函数
	output(type = '') {
		let allData = this.props.editTable.getAllData(tableId);
		let pks = [];
		allData.rows.forEach((item) => {
			pks.push(item.values['cbmrtid'].value);
		});
		if (type == 'print') {
			//打印
			print(
				'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				urls['print'],
				{
					billtype: '',  //单据类型
					funcode: appcode,      //功能节点编码，即模板编码
					nodekey: '10140BMRT_Print',     //模板节点标识
					oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
				}
			);
		} else if (type = 'output') {
			//输出
			// print(
			// 	'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
			// 	urls['print'], 
			// 	{
			// 		billtype:'',  //单据类型
			// 		funcode: appcode,      //功能节点编码，即模板编码
			// 		nodekey:'suppliertaxes_print',     //模板节点标识
			// 		oids: pks,
			// 		outputType:'output'
			// 	}
			// 	);
			this.setState({
				pks: pks
			}, this.refs.printOutput.open());
		}
	}

	onSelectMoreButton({ key }) {
		toast({ content: this.state.json['10140BOMRT-000013'], color: 'warning' });/* 国际化处理： 努力开发中......*/

	}

	//按钮状态
	onSetButton(allTableData) {
		console.log('new', allTableData)
		if (allTableData.rows.length > 0) {
			this.props.button.setButtonDisabled({
				Edit: false,
				Print: false,
				Output: false,
			});
		} else {
			this.props.button.setButtonDisabled({
				Edit: true,
				Print: true,
				Output: true,
			});
		}
	}


	//浏览态确认删除事件
	onDelForBrowse() {
		let selectedData = this.props.editTable.getCheckedRows(tableId);
		let indexArr = [];
		let dataArr = [];
		let _that = this;
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					// ts: {
					// 	display: '时间戳',
					// },
					// pk_suptaxes: {
					// 	display: '主键',
					// }
				}
			};
			delObj.rowId = val.data.rowId;
			delObj.values = val.data.values;
			// delObj.values.ts.value=val.data.values.ts.value;
			// delObj.values.pk_suptaxes.value=val.data.values.pk_suptaxes.value;
			dataArr.push(delObj);
			indexArr.push(val.index);
		});
		let data = {
			pageid: pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: dataArr
			}
		};
		ajax({
			url: urls['save'],
			data,
			success: function (res) {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					_that.props.editTable.deleteTableRowsByIndex(tableId, indexArr);
					let allD = this.props.editTable.getAllData(tableId);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					_that.props.editTable.setTableData(tableId, allD);
					allTableData = allD;
					_that.onSetButton(allTableData);
					toast({ title: this.state.json['10140BOMRT-000002'], color: 'success' });/* 国际化处理： 删除成功！*/
				}
			}.bind(this)
		});
	}

	// 列表勾选事件
	onSelected = () => {
		let rows = this.props.editTable.getCheckedRows(tableId);

		let isDisable = (rows && rows.length > 0) ? false : true;

		this.props.button.setButtonDisabled(['Delete'], isDisable);
		this.setState(this.state);
	}

	onUnitChange = (refdata) => {
		this.setState({
			pk_org: refdata
		})


	}

	onSearchAfterEvent = (field, val) =>{
		if (field === 'pk_org') {
			console.log('pk_org onSearchAfterEvent')
			let metaItems = this.props.meta.getMeta()[searchId].items;
			for (const iterator of metaItems) {
				if (iterator.attrcode == 'ccustomerid' || iterator.attrcode == 'cvendorid' || iterator.attrcode == 'cprojectid') {
					iterator.queryCondition = () => {
						return { pk_org: this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue }
					}
				}
			}
		}
	}

	render() {
		let { table, button, search, editTable, modal } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { NCFormControl, NCCheckbox } = base;
		let { createModal } = modal;
		const { Item } = Menu;
		let moreButton = (
			<Menu
				onSelect={this.onSelectMoreButton.bind(this)}>
				<Item key="1">this.state.json['10140BOMRT-000019'] </Item>/* 国际化处理： 打印*/
				<Item key="2">this.state.json['10140BOMRT-000020']</Item>/* 国际化处理： 预览*/
				<Item key="3">this.state.json['10140BOMRT-000021']</Item>/* 国际化处理： 输出*/
			</Menu>
		);
		return (
			<div className="nc-bill-list">
				{/* 头部 header */}
				<div className='nc-bill-header-area'>
					<div className='header-title-search-area'>
						{createPageIcon()}
						<h2 className='title-search-detail'>{this.state.json ? this.state.json['10140BOMRT-000022'] : '10140PST-000029'}</h2></div>


					<div className="header-button-area">
						{createButtonApp({
							area: 'list_head',
							buttonLimit: 3,
							onButtonClick: this.onButtonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')

						})}
					</div>

				</div>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
					  clickSearchBtn: this.clickSearchBtn.bind(this),
					  hideBtnArea:this.state.hidesearch,
					  hideSearchCondition:this.state.hidesearch,
					  showAdvBtn:!this.state.hidesearch,
					  onAfterEvent: this.onSearchAfterEvent.bind(this)
					})}
				</div>
				{/* 列表区 */}
				<div className='nc-singleTable-table-area'>
					{createEditTable(tableId, {//列表区
						onSelected: this.onSelected.bind(this),                        // 左侧选择列单个选择框回调
						onSelectedAll: this.onSelected.bind(this),                   // 弹窗控件点击关闭事件 
						onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
						onBeforeEvent: this.onBeforeEvent.bind(this),
						useFixedHeader: true,
						adaptionHeight: true,
						selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
						//statusChange: this.updateButtonStatus.bind(this),				//表格状态监听
						statusChange: function () {
							setTimeout(() => {
								this.updateButtonStatus();
							}, 0)
						}.bind(this),				//表格状态监听
						showIndex: true,				//显示序号
						isAddRow: false,   // 失去焦点是否自动增行
						showCheck: true,			//显示复选框
						showPagination: true,
						handlePageInfoChange: this.pageInfoClick.bind(this) 
					})}
				</div>
				{/* 删除前确认模态框 */}
				{createModal('modal', {
					title: this.state.json['10140BOMRT-000015'],										//标题/* 国际化处理： 确认删除*/
					content: this.state.json['10140BOMRT-000016'],							//内容/* 国际化处理： 确认删除所选数据？*/
					beSureBtnClick: this.onDelForBrowse.bind(this),		//确定按钮事件回调
					//cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
					leftBtnName: this.state.json['10140BOMRT-000017'],   								//左侧按钮名称/* 国际化处理： 确认*/
					rightBtnName: this.state.json['10140BOMRT-000018']   								//右侧按钮名称/* 国际化处理： 关闭*/
				})}
				<PrintOutput
					ref='printOutput'
					url={urls['print']}
					data={{
						funcode: appcode,      //功能节点编码，即模板编码
						nodekey: '10140BMRT_Print',     //模板节点标识
						oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: "output"
					}}
				//callback={this.onSubmit}
				>
				</PrintOutput>
			</div>
		);
	}
}

SingleTable = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: pagecode,
		bodycode: tableId
	},
	initTemplate: initTemplate,
	mutiLangCode: '10140BOMRT'
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65