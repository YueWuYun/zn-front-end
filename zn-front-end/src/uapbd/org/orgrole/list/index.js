//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cacheTools, print, high, promptBox,getMultiLang,createPageIcon } from 'nc-lightapp-front';
const { NCPopconfirm, NCCheckbox, NCIcon, NCTabs,NCDiv } = base;
const NCTabPane = NCTabs.NCTabPane;
const { PrintOutput } = high;
import './index.less';
import BatchAdd from '../batchAdd/AssignStepModal.js';
import {conf as unitConf} from '../../../refer/org/AdminOrgDefaultTreeRef/index';

let dataSource = 'uapbd.org.orgrole';//缓存的标识
const pageId = '10100PSRC_listview';        //pagecode
const searchId = 'search';              //查询区id
const tableId = 'AdminDeptVO';                 //表头id
const oId = '1001Z010000000005W75';     //查询区oid
const appid = '0001Z010000000002YTH';   //注册按钮id\
const appcode = '10100PSRC';        //按钮注册id
const linkItem = 'pk_busirole';        //列表卡片跳转字段
const pk_item = 'pk_busirole';           //列表主键
const queryListUrl = '/nccloud/uapbd/orgrole/querylistbusifunc.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/orgrole/busifuncquerypagegridbypks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/orgrole/deletebusifunc.do';                 //删除url
const printUrl = '/nccloud/uapbd/orgrole/BusiFuncPrintAction.do';                  //列表打印url
const enableUrl = '/nccloud/uapbd/orgrole/enablebusifunc.do' //启用
const tableBtnAry = ["editline", "delline"];     //表格列操作按钮
//const titleName = this.state.json['10100PSRC-000019'];           //节点名称/* 国际化处理： 业务人员来源*/
const listUrl = '/list';
const cardUrl = '/card';
let isShowOff = false;//默认不显示停用


let initTemplate = (props) => {

	let _this = this;
	props.createUIDom(
		{
			pagecode: pageId//页面id
			//appcode: appcode//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(props, meta)
					props.meta.setMeta(meta);
					let hasSearched = cacheTools.get("hasSearched");
					let searchVal = cacheTools.get("searchParams");
					// console.log(this.state.json['10100PSRC-000020'])/* 国际化处理： 缓存查询条件*/
					// console.log(searchVal);
					if (hasSearched && hasSearched === 1) {//hasSearched 为1表示有过查询，从缓存获取查询模板条件
						// searchVal.map((v)=>{
						// 	props.search.setSearchValByField('searchArea',v.field,v.display);
						// 	return v;
						// })
						if (searchVal && searchVal != false) {
							props.search.setSearchValue(searchId, searchVal.conditions);
						}

						//获取查询模板信息
						let queryInfo = props.search.getQueryInfo(searchId);
						let OID = queryInfo.oid;

						let data = {
							querycondition: searchVal == null ? null : searchVal,
							pageInfo: cacheTools.get('pageInfo') ? cacheTools.get('pageInfo') : props.table.getTablePageInfo(tableId),
							// {
							// 	pageIndex: 0,
							// 	pageSize: 10,
							// 	total: 0,
							// 	totalPage: 0
							// },
							pagecode: pageId,
							queryAreaCode: searchId,  //查询区编码
							oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
							querytype: 'tree',
							isShowOff: isShowOff
						};

						ajax({
							url: queryListUrl,
							data,
							success: (res) => {
								if (res.data) {
									props.table.setAllTableData(tableId, res.data[tableId]);
								} else {
									toast({title:props.MutiInit.getIntl("10100PSRC") && props.MutiInit.getIntl("10100PSRC").get('10100PSRC-000021'),content:props.MutiInit.getIntl("10100PSRC") && props.MutiInit.getIntl("10100PSRC").get('10100PSRC-000022'),color:"warning"});/* 国际化处理： 请注意！,未查询出符合条件的数据！*/
								}
							},
							error: (res) => {
								console.log(res.message);
							}
						});
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setButtonDisabled(['delete', 'batchsave', 'enable', 'disable','print','output'], true);
					// props.button.setDisabled({
					// 	delete:true,
					// 	batchsave:true,
					// 	enable:true,
					// 	disable:true
					// });
					props.button.setPopContent('delline',props.MutiInit.getIntl("10100PSRC") && props.MutiInit.getIntl("10100PSRC").get('10100PSRC-000023'))/* 国际化处理： 确认要删除该信息吗？*/
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.col = '3';
		if ((item.attrcode == 'pk_adminorg')) {

			item.isMultiSelectedEnabled = true;
			item.isShowDisabledData = true;
			item.queryCondition = function () {
				return {
					AppCode: '10100PSRC',
					TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
				}
			}
		}
		if ((item.attrcode == 'pk_dept')) {

			item.isDataPowerEnable = true;
			item.isMultiSelectedEnabled = true;
			item.isShowDisabledData = true;
			item.isShowUnit = true;
			item.unitProps = unitConf;
			item.unitCondition = () => {
				return {
					AppCode: '10100PSRC',
					TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
				}
			};
		}
		if ((item.attrcode == 'pk_busichild.pk_org')) {
			item.isMultiSelectedEnabled = true;
			item.isShowDisabledData = true;
		}

		return item;
	})
	meta[tableId].pagination = true;
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		//item.width = 150;
		if (item.attrcode == linkItem) {
			item.render = (text, record, index) => {
				return (
					<span
						style={{ textDecoration: 'underline', cursor: 'pointer' }}
						onClick={() => {
							let searchVal = props.search.getAllSearchData(searchId);
							cacheTools.set("searchParams", searchVal);
							cacheTools.set('preid', record[pk_item].value);
							cacheTools.set('pageInfo', props.table.getTablePageInfo(tableId));
							props.pushTo(cardUrl, {
								status: 'browse',
								pagecode: '10100PSRC_card',
								appcode: appcode,
								id: record[pk_item].value//列表卡片传参
							});
						}}
					>
						{record && record[linkItem] && record[linkItem].value}
					</span>
				);
			};
		}
		return item;
	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: props.MutiInit.getIntl("10100PSRC") && props.MutiInit.getIntl("10100PSRC").get('10100PSRC-000024'),/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		className: 'table-opr',
		itemtype:'customer',
		visible: true,
		render: (text, record, index) => {

			return props.button.createOprationButton(
				tableBtnAry,
				{
					area: "table-opr-area",
					buttonLimit: 3,
					onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
				}
			)

			// return (
			// 	<span>
			// 		{/* <NCIcon
			// 			type="uf-pencil-s"
			// 			onClick={() => {
			// 				props.linkTo('../card/index.html', {
			// 					status: 'edit',
			// 					id: record.crevecontid.value
			// 				});
			// 			}}
			// 		/> */}
			// 		<span
			// 			style={{cursor: 'pointer' }}
			// 			onClick={() => {
			// 				props.linkTo('../card/index.html', {
			// 					status: 'edit',
			// 					id: record[pk_item].value
			// 				});
			// 			}}
			// 		>
			// 			修改
			// 		</span><span>&nbsp; &nbsp;</span>
			// 		<NCPopconfirm
			// 			trigger="click"
			// 			placement="top"
			// 			content='确定删除？'
			// 			onClose={() => {
			// 				ajax({
			// 					url: deleteUrl,
			// 					data: {deleteinfo:[{
			// 						id: record[pk_item].value,
			// 						ts: record.ts.value
			// 					}]},
			// 					success: (res) => {
			// 						if (res.success) {
			// 							toast({ color: 'success', content: '删除成功' });
			// 							props.table.deleteTableRowsByIndex(tableId, index);
			// 						}
			// 					}
			// 				});
			// 			}}
			// 		>
			// 			<span style={{cursor: 'pointer' }}>删除</span>
			// 		</NCPopconfirm>
			// 	</span>
			// );
		}
	});
	return meta;
}

function tableButtonClick(props, id, text, record, index) {
	switch (id) {

		case 'editline':
			props.pushTo(cardUrl, {
				status: 'edit',
				id: record[pk_item].value,
				pagecode: '10100PSRC_card',
				appcode: appcode
			})
			break;
		case 'delline':
			ajax({
				url: deleteUrl,
				data:
					{
						//pk_org: cacheTools.get('pk_org'),
						deleteinfo: [
							{
								id: record[pk_item].value,
								ts: record.ts.value
							}
						]
					},
				success: (res) => {
					if (res.success) {
						toast({ color: 'success', title: props.MutiInit.getIntl("10100PSRC") && props.MutiInit.getIntl("10100PSRC").get('10100PSRC-000025') });/* 国际化处理： 删除成功！*/
						let {deleteCacheId} = props.table;
						deleteCacheId(tableId, record[pk_item].value)
						props.table.deleteTableRowsByIndex(tableId, index);
					}
				}
			});
			break;
		default:
			console.log(id, index);
			break;

	}
}

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.enableNumber = 0;
		this.disableNumber = 0;
		this.state = {
			json:{},
			inlt: null,
			isShowOff: false,				//列表是否显示停用数据
			modalState: false
		}
	}

	// componentWillMount() {
	// 	let callback = (json) => {
	// 		this.setState({json})
	// 		}
	// 	getMultiLang({moduleId: appcode, domainName: 'uapbd',callback})
	// }

	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
		  if (status) {
			  this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
		  } else {
			  console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
		  }
	
		}
		this.props.MultiInit.getMultiLang({moduleId: appcode,domainName:'uapbd',callback})
	  }
	

	componentDidMount() {

		console.log('aaaaaaaaaaaaaaaaaaaa')
	}

	// getButtonNames = (codeId) => {
	// 	if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
	// 		return 'main-button'
	// 	}else {
	// 		return 'secondary - button'
	// 	}
	// };

	buttonClick(props, id) {
		switch (id) {
			case 'enable':
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10100PSRC-000026'],/* 国际化处理： 提示*/
					content: this.state.json['10100PSRC-000027'],/* 国际化处理： 您确定要启用所选数据吗？*/
					beSureBtnClick: () => {

						let selectedRows = this.props.table.getCheckedRows(this.tableId)
						if (selectedRows.length == 0) {
							toast({ color: 'warning', content: this.state.json['10100PSRC-000028'] })/* 国际化处理： 请选择需要操作的记录！*/
						}
						let requestData = {
							isEnable: true,
							list: []
						}

						selectedRows.forEach(element => {
							let dataObj = {}
							dataObj.id = element.data.values[pk_item].value
							requestData.list.push(dataObj)
						});
						ajax({
							url: enableUrl,
							data: requestData,
							success: res => {
								this.refreshAction(props,()=>{
									toast({ color: 'success', title: this.state.json['10100PSRC-000029'] });/* 国际化处理： 启用成功！*/
								});
							}

						})
					},
					cancelBtnClick: () => {
						return;
					}
				})
				break;
			case 'disable':
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10100PSRC-000062'],/* 国际化处理： 提示*/
					content: this.state.json['10100PSRC-000030'],/* 国际化处理： 您确定要停用所选数据吗？*/
					beSureBtnClick: () => {
						let selectedRows = this.props.table.getCheckedRows(this.tableId)
						if (selectedRows.length == 0) {
							toast({ color: 'warning', content: this.state.json['10100PSRC-000028'] })/* 国际化处理： 请选择需要操作的记录！*/
						}
						let requestData = {
							isEnable: false,
							list: []
						}

						selectedRows.forEach(element => {
							let dataObj = {}
							dataObj.id = element.data.values[pk_item].value
							requestData.list.push(dataObj)
						});
						ajax({
							url: enableUrl,
							data: requestData,
							success: res => {
								this.refreshAction(props,()=>{
									toast({ color: 'success', title: this.state.json['10100PSRC-000031'] });/* 国际化处理： 停用成功！*/
								});
							}

						})
					},
					cancelBtnClick: () => {
						return;
					}
				});
				break;
			case 'add':
				props.pushTo(cardUrl, {
					status: 'add',
					pagecode: '10100PSRC_card',
					appcode: appcode
				})
				cacheTools.remove('preid');

				break;
			case 'editline':
				props.pushTo(cardUrl, {
					status: 'edit',
					id: props.record[pk_item].value,
					pagecode: '10100PSRC_card',
					appcode: appcode
				})
				break;
			case 'refresh':
				this.refreshAction(props,()=>{
                    toast({ color: 'success', title: this.state.json['10100PSRC-000032'] });/* 国际化处理： 刷新成功！*/
                });
				break;
			case 'batchsave':
				let selectedRows = this.props.table.getCheckedRows(this.tableId)
				if (selectedRows.length == 0) {
					toast({ color: 'warning', content: this.state.json['10100PSRC-000028'] })/* 国际化处理： 请选择需要操作的记录！*/
					break
				}
				this.item.show();
				break;
			case 'delete':
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10100PSRC-000033'],/* 国际化处理： 确认删除*/
					content: this.state.json['10100PSRC-000034'],/* 国际化处理： 您确定要删除所选数据吗?*/
					beSureBtnClick: () => { this.deleteAction() }
				})
				break;
			case 'printGrp':
				this.onPrint();
				break;
			case 'print':
				this.onPrint();
				break;
			case 'output':
				this.onOutput();
				break;
			default:
				break;
		}
	}

	//打印
	onPrint = () => {

		let allData = this.props.table.getCheckedRows(tableId);

		if (allData.length === 0) {
			toast({ content: this.state.json['10100PSRC-000035'], color: 'warning' });/* 国际化处理： 请勾选打印数据*/
			return;
		}


		let pks = [];

		// allData.rows.forEach((item,key)=>{
		//     pks.push(item.values[pk_item].value);
		// });
		pks.push(allData[0].data.values[pk_item].value);
		print(
			'pdf',
			printUrl,
			{
				funcode: '10100PSRC',//功能节点编码
				appcode: '10100PSRC',
				nodekey:'',     //模板节点标识
				//nodekey:this.props.printNodeKey,//模板节点编码
				oids: pks
			}
		)
	}
	//输出
	onOutput = () => {

		// let allData = this.props.table.getAllTableData(tableId);
		// if (allData.rows.length === 0) {
		// 	toast({ content: this.state.json['10100PSRC-000036'], color: 'warning' });/* 国际化处理： 无可输出的数据*/
		// 	return;
		// }
		// let pks = [];

		// allData.rows.forEach((item, key) => {
		// 	pks.push(item.values[pk_item].value);
		// });
		let allData = this.props.table.getCheckedRows(tableId);

		if (allData.length === 0) {
			toast({ content: this.state.json['10100PSRC-000035'], color: 'warning' });/* 国际化处理： 请勾选打印数据*/
			return;
		}


		let pks = [];

		// allData.rows.forEach((item,key)=>{
		//     pks.push(item.values[pk_item].value);
		// });
		pks.push(allData[0].data.values[pk_item].value);
		this.setState({
			ids: pks
		}, this.refs.printOutput.open());
	}

	// // 行选中事件
	// onSelected(props, moduleId, record, index) {
	// 	let tableData = this.props.table.getCheckedRows(tableId);
	// 	if (tableData && tableData.length > 0) {
	// 		this.props.button.setButtonDisabled(['delete', 'batchsave', 'enable', 'disable'], false);

	// 	} else {
	// 		this.props.button.setButtonDisabled(['delete', 'batchsave', 'enable', 'disable'], true);
	// 	}
	// 	this.setState(this.state);
	// }


	// 行选中事件
	onSelected(props, moduleId, record, index) {
		let tableData = this.props.table.getCheckedRows(tableId);
		if(tableData && tableData.length == 1){
			this.props.button.setButtonDisabled(['delete', 'batchsave','print','output'], false);
			if(tableData[0].data.values['enablestate'].value == 2) {
				this.enableNumber++
			}
			else {
				this.disableNumber++
			}

		}else if(tableData && tableData.length > 1){
			tableData.forEach(item => {
				if(item.data.values['enablestate'].value == 2) {
					this.enableNumber++
				}
				else {
					this.disableNumber++
				}
			})
			this.props.button.setButtonDisabled(['delete', 'batchsave'], false);
			this.props.button.setButtonDisabled(['print', 'output'], true);
		}else {
			this.props.button.setButtonDisabled(['delete', 'batchsave','print','output'], true);
		}
		let buttonStatus = {
			enable: this.disableNumber > 0 ? false : true,
			disable: this.enableNumber > 0 ? false : true
		}
		this.enableNumber = 0
		this.disableNumber = 0
		this.props.button.setButtonDisabled(buttonStatus)
		this.setState(this.state);
	}


	doubleClick = (record, index, e) => {


		console.log(this.state.json['10100PSRC-000037']);/* 国际化处理： 双击*/
		console.log(this)
		let searchVal = this.props.search.getAllSearchData(searchId);
		cacheTools.set("searchParams", searchVal);
		cacheTools.get("searchParams");
		cacheTools.set('preid', this.props.getUrlParam('id'));
		this.props.pushTo(cardUrl, {
			status: 'browse',
			id: record[pk_item].value,
			pagecode: '10100PSRC_card',
			appcode: appcode
		});
	}

	deleteAction = () => {
		let data = this.props.table.getCheckedRows(tableId);
		console.log(data)
		let params = {
			//pk_org: cacheTools.get('pk_org'),
			deleteinfo: data.map((v) => {
				let id = v.data.values[pk_item].value;
				let ts = v.data.values.ts.value;
				return {
					id, ts
				}
			})
		}
		console.log(params)
		ajax({
			url: deleteUrl,
			data: params,
			success: (res) => {
				this.refreshAction(this.props,()=>{
					toast({ color: 'success', title: this.state.json['10100PSRC-000025'] });/* 国际化处理： 删除成功！*/
				});
			}
		});
	}

	refreshAction = (props,callback) => {
		let searchVal = props.search.getAllSearchData(searchId);
		console.log(searchVal);
		if (searchVal != false) {
			//获取查询模板信息
			let queryInfo = props.search.getQueryInfo(searchId);
			let OID = queryInfo.oid;
			let data = {
				querycondition: searchVal == null ? null : searchVal,
				pageInfo: props.table.getTablePageInfo(tableId),
				// {
				//     pageIndex: 0,
				//     pageSize: 10,
				//     total: 0,
				//     totalPage: 0
				// },
				pagecode: pageId,
				queryAreaCode: searchId,  //查询区编码
				oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
				querytype: 'tree',
				isShowOff: isShowOff
			};

			ajax({
				url: queryListUrl,
				data,
				success: (res) => {
					console.log(res);
					if (res.data) {
						props.table.setAllTableData(tableId, res.data[tableId]);
					} else {
						props.table.setAllTableData(tableId, { rows: [] });
					}

					//查询时执行显示公式前端适配
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg,  //参数一：返回的公式对象
							{                //参数二：界面使用的表格类型
								[tableId]:"table"
							}
						);
					}

					this.props.button.setButtonDisabled(['delete', 'batchsave', 'enable', 'disable','print','output'], true);
					this.setState(this.state);
					callback&&callback(res.data);
				},
				error: (res) => {
					console.log(res.message);
				}
			});
		}
	}

	pageInfoClick = (props, config, pks) => {

		let pageInfo = props.table.getTablePageInfo(this.tableId);
		let searchVal = props.search.getAllSearchData(searchId);

		cacheTools.set('pageInfo', props.table.getTablePageInfo(tableId));

		let data = {
			//'pk_org':cacheTools.get('pk_org'),
			'allpks': pks,
			'pageid': pageId
		};
		//得到数据渲染到页面
		let that = this;
		ajax({
			url: queryPageUrl,
			data: data,
			success: function (res) {
				let { success, data } = res;
				if (success) {
					if (data) {
						props.table.setAllTableData(tableId, data[tableId]);
					} else {
						props.table.setAllTableData(tableId, { rows: [] });
					}
				}
			}
		});
	}

	clickSearchBtn = (props, searchVal) => {

		console.log(searchVal);

		// searchVal.conditions.map((cond)=>{
		// 		if(cond.field == 'pk_org'){
		// 			cacheTools.set('pk_org',cond.value.firstvalue);
		// 		}
		// 	})
		cacheTools.set("hasSearched", 1);
		cacheTools.set("searchParams", searchVal);
		cacheTools.set('pageInfo', props.table.getTablePageInfo(tableId));
		let metaData = props.meta.getMeta();
		//获取查询模板信息
		let queryInfo = props.search.getQueryInfo(searchId);
		let OID = queryInfo.oid;
		let data = {
			querycondition: searchVal == null ? null : searchVal,
			pageInfo: props.table.getTablePageInfo(tableId),
			// {
			//     pageIndex: 0,
			//     pageSize: 10,
			//     total: 0,
			//     totalPage: 0
			// },
			pagecode: pageId,
			queryAreaCode: searchId,  //查询区编码
			oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree',
			isShowOff: isShowOff
		};

		ajax({
			url: queryListUrl,
			data,
			success: (res) => {
				console.log(res);
				if (res.data) {
					props.table.setAllTableData(this.tableId, res.data[tableId]);
					let count = res.data[this.tableId].allpks.length;
					toast({content:this.state.inlt&&this.state.inlt.get('10100PSRC-000039', { count: count}),color:'success'})/* 国际化处理： 已成功！,查询成功，共,条。,查询成功,共,条*/
				} else {
					props.table.setAllTableData(this.tableId, { rows: [] });
					toast({content:this.state.json['10100PSRC-000022'],color:"warning"});/* 国际化处理： 请注意！,未查询出符合条件的数据！*/
				}
				this.props.button.setButtonDisabled(['delete', 'batchsave', 'enable', 'disable'], true);
				this.setState(this.state);
			},
			error: (res) => {
				console.log(res.message);
			}
		});
	}

	
	// onSaveBatch(){
	// 	var datas = this.item.getData();

	// 	var pk_busichild = '主表逐渐',
	// 		params = datas.map( data => {
	// 			debugger;
	// 			return {
	// 				pk_busichild: pk_busichild,
	// 				pk_org: data.org.id,
	// 				org_function: data.cols.map(col => col.function_id).toString()
	// 			};
	// 		});
	// 	ajax({
	// 			url: '/nccloud/uapbd/orgrole/BusiFuncBatchSaveAction.do',
	// 			data :{
	// 				datas: params
	// 			},
	// 			success: (res) => {
	// 				this.refreshAction(this.props);
	// 			},
	// 			error : (res)=>{
	// 				console.log(res.message);
	// 			}
	// 	});

	// }

	onSaveBatchAction = ({ pk_busichild }) => {
		var datas = this.item.getData();
		let params = datas.map(data => {
			return {
				pk_busichild: pk_busichild,
				pk_org: data.org.id,
				org_function: data.cols.map(col => col.function_id).toString()
			};
		});
		return params
	}
	onSaveBatch(finish) {
		console.log(finish);
		let selectedRows = this.props.table.getCheckedRows(this.tableId);
		let params = [];
		selectedRows.forEach(element => {
			params.push(...this.onSaveBatchAction({ pk_busichild: element.data.values[pk_item].value }));
		});

		ajax({
			url: '/nccloud/uapbd/orgrole/BusiFuncBatchSaveAction.do',
			data: {
				datas: params
			},
			success: (res) => {
				if (finish == 'finish_continue') {
					this.item.show();
				} else {
					this.item.cancel('finish');
					this.refreshAction(this.props);
				}
			},
			error: (res) => {
				toast({ content: res.message, color: "warning" });
				console.log(res.message);
			}
		});

	}

	modalStateFun() {
		this.setState({
			modalState: true
		})
	}

	//显示停用数据
	showOffChange() {
		isShowOff = !isShowOff;
		this.refreshAction(this.props);
	}

	render() {
		let { table, button, search, modal ,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
		let { createModal } = modal;
		let buttons = this.props.button.getButtons();
		// buttons = buttons.sort((a,b)=>{
		// 	return b.btnorder - a.btnorder;
		// });
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp, getButtons } = button;
		return (<div className="nc-bill-list">
					<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area nc-title'>
						<div className='header-title-search-area'>
							{createBillHeadInfo({
								title:this.state.json['10100PSRC-000019'],
								//backBtnClick: this.buttonClick.bind(this,this.props,'back'),
								showBackBtn:false,
								initShowBackBtn:false}
													)}

						</div>
						<span className="showOff">
							<NCCheckbox
								onChange={this.showOffChange.bind(this)}
								checked={isShowOff}
							>{this.state.json['10100PSRC-000040']/* 国际化处理： 显示停用*/}</NCCheckbox>
						</span>
						<div className="header-button-area">
							{createButtonApp({
								area: 'header-button-area',
								buttonLimit: 3,
								onButtonClick: this.buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')

							})}
							{/* {buttons.map( (v) =>{
									return (createButton(v.btncode, {
										name: v.btnname,
										onButtonClick: this.buttonClick.bind(this),
										buttonColor: this.getButtonNames(v.btncode)
									}))
								})}  */}
						</div>
					</NCDiv>
			<div className="nc-bill-search-area">
				{NCCreateSearch(this.searchId, {
					clickSearchBtn: this.clickSearchBtn.bind(this)
				})}
			</div>
			<div className="nc-bill-table-area">
				{createSimpleTable(this.tableId, {
					handlePageInfoChange: this.pageInfoClick,
					tableModelConfirm: this.tableModelConfirm,
					onSelected: this.onSelected.bind(this),
					onSelectedAll: this.onSelected.bind(this),
					showIndex: true,
					showCheck: true,
					dataSource: dataSource,//缓存的标识
					pkname: pk_item,
					onRowDoubleClick: this.doubleClick.bind(this)
				})}
			</div>
			{/* {createModal('delete', {
							title: "确认删除",
							content: '您确定要删除所选数据吗?',
							beSureBtnClick: this.deleteAction
				})} */}
			<BatchAdd ref={item => this.item = item} json={this.state.json || {}} onFinish={this.onSaveBatch.bind(this)} />
			<PrintOutput
				ref='printOutput'
				url={printUrl}
				data={{
					funcode: '10100PSRC',//功能节点编码
					appcode: '10100PSRC',
					//nodekey:this.props.printNodeKey,//模板节点编码
					nodekey: '',     //模板节点标识
					oids: this.state.ids,
					outputType: 'output'
				}}
			/>
		</div>
		);
	}
}

List = createPage({
	billinfo:{
        billtype: 'grid',
        pagecode: pageId,
        headcode: tableId
    },
	initTemplate: initTemplate,
	mutiLangCode: appcode
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));
export default List

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65