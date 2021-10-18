/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表

import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { createPage, ajax, toast, base, high, cardCache, getMultiLang, deepClone, createPageIcon } from 'nc-lightapp-front';
import { constant, requesturl } from '../config/config';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, setButtonUsability, onrowDoubleclick } from './events';
import NCCOriginalBalance from '../../../public/restmoney/list/index';
import NCTabs from '../../../../tmpub/pub/util/NCTabs/index';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
//import {clickBtn }from './events/setButtonUsability';
let { setDefData, getDefData } = cardCache;
const { NCUploader, ApproveDetail, PrintOutput, ApprovalTrans, ExcelImport } = high;
const { NCDiv } = base;
class List extends Component {
	// 构造器
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pagecode = constant.lpagecode;
		this.searchId = constant.searchcode;
		this.tableId = constant.ltablecode;
		this.cacheDataSource = constant.cacheDataSource;
		this.pkname = constant.pkname;
		this.pk = null;
		this.ts = null;
		this.index = null;
		this.selectedPKS = [];
		this.state = {
			tabInfo: '0', // 选中页签的信息
			//tobesubmittab:0, // 待提交页签
			//approvingtab:0, // 待审批页签
			//tobesettletab: 0, // 待结算页签
			alltab: 0, // 全部页签
			billId: '', //单据id
			billno: '', // 单据编号
			showUploader: false, // 附件组件显示
			target: null, // 附件
			approveshow: false,
			outputData: {
				funcode: 'NCC36070DC', //功能节点编码，即模板编码
				nodekey: 'NCC36070DC', //模板节点标识
				printTemplateID: '1001Z61000000000F2QU', //模板id
				oids: [],
				outputType: 'output'
			}, // 输出数据
			addid: '',
			showOriginal: false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData: [], // 联查余额取数据，将需要联查的数据赋值给我
			conditionCache: null, // 查询区条件缓存
			custconditionCache: null, //页签信息缓存
			pageInfo: null, // 翻页信息缓存
			json: {}, // 多语
			inlt: null
		};
	}

	//操作列多语不显示
	componentWillMount() {

		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			// 将多语资源存储到页面级缓存中
			saveMultiLangRes(this.props, json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({ json, inlt })       // 保存json和inlt到页面state中并刷新页面
			} else {
				// console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}
		getMultiLang({
			moduleId: {
				[constant.module_tmpub_name]: [constant.module_tmpub_id],
				[constant.module_name]: [constant.module_id, constant.mutiLangCode]
			},
			callback
		});
	}

	// 组件挂载
	componentDidMount() {
		//this.getCacheState();
		setButtonUsability.call(this, this.props);
		this.linkbill();
	}

	linkbill() {
		let scene = this.props.getUrlParam('scene');
		if (scene) {
			if (constant.fipscene == scene) {
				setDefData(constant.fipscene_key, this.cacheDataSource, true);
				this.voucherLinkBill();
			}
		}
	}


	// 设置查询条件缓存
	setSearchData() {
		let pageInfo = getDefData(this.cacheDataSource, constant.pageInfo);
		let searchVal = getDefData(this.cacheDataSource, constant.conditionCache);
		if (searchVal) {
			this.props.search.setSearchValue(constant.oid, searchVal.conditions);
		}
		if (pageInfo) {
			this.props.search.setSearchValue(constant.oid, searchVal.conditions);
		}
	}

	// 查询数据
	getData = (serval) => {
		let search = getDefData(constant.searchKey, this.cacheDataSource);
		let searchVal = deepClone(search);
		if (searchVal) {
			if (searchVal.conditions.length != 0) {
				searchVal.conditions.push(...serval);
				let pageInfo = this.props.table.getTablePageInfo(this.tableId);
				this.querydataBytab(searchVal, pageInfo);
			}
		}
	};

	// 组装查询条件参数
	getsearchdata = (searchVal, pageInfo) => {
		let queryInfo = this.props.search.getQueryInfo(this.searchId, false);
		let oid = queryInfo.oid;
		let searchdata = {
			querycondition: searchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions: []
			},
			pageInfo: pageInfo,
			pageCode: this.pagecode,
			appregisterPk: constant.appregisterpk,
			appcode: constant.appcode,
			queryAreaCode: this.searchId, //查询区编码
			oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};

		return searchdata;
	}

	// 查询ajax
	querydata = (searchVal, pageInfo, sta) => {
		if (searchVal) {
			let queryInfo = this.props.search.getQueryInfo(this.searchId, false);
			let oid = queryInfo.oid;
			let searchdata = {
				querycondition: searchVal,
				custcondition: {
					logic: 'and', //逻辑操作符，and、or
					conditions: []
				},
				pageInfo: pageInfo,
				pageCode: this.pagecode,
				appregisterPk: constant.appregisterpk,
				appcode: constant.appcode,
				queryAreaCode: this.searchId, //查询区编码
				oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
				querytype: 'tree'
			};

			setDefData(this.cacheDataSource, constant.searchKey, searchVal);

			ajax({
				url: requesturl.query,
				data: searchdata,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							this.props.table.setAllTableData(this.tableId, data[this.tableId]);
							//判断刷新查询状态
							if (sta == 'refresh') {
								toast({
									color: 'success',
									content: this.state.json['36070AGR-000058']/* 国际化处理： 刷新成功*/
								});
							}
							else if (sta == 'query') {
								toast({
									color: 'success',
									// content: this.state.json['36070AGR-000057' ]/* 国际化处理： 查询成功*/
									content: this.state.json['36070AGR-000057'] + data['36070AGR_list_table'].allpks.length + this.state.json['36070AGR-000061']

									// content: '查询成功,共'+  res.data[] + '条'
								});
							}
							setDefData(this.tableId, this.cacheDataSource, data);//放入缓存
						}
						else{
							this.props.table.setAllTableData(this.tableId, { rows: [] });
							toast({
								color: 'warning',
								content: this.state.json['36070AGR-000051']/* 国际化处理： 未查询出符合条件的数据*/
							});
						}
					}
					
				}
			});
		}
	}

	// 清空列表选择框
	emptychoicebox = () => {
		this.props.table.selectAllRows(this.tableId, false);
		setButtonUsability.call(this, this.props);
	}

	// 回调函数
	renderCompleteEvent = () => {
		// 获取缓存中页签的值
		let tabkey = getDefData(constant.tabInfo, this.cacheDataSource);
		if (tabkey) {
			this.setState({
				tabInfo: tabkey
			})
		}

	}


	//列表删除（单条）
	delConfirm = () => {
		let selectdata = this.props.table.getCheckedRows(this.tableId);
		let { deleteCacheId } = this.props.table;
		//数据校验
		if (selectdata.length == 0) {
			toast({
				color: 'warning',
				content: this.state.json['36070AGR-000026']/* 国际化处理： 请选择数据*/
			});
			return;
		}
		//let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		let pks;
		//let tss;
		let index;
		//处理选择数据
		selectdata.forEach((val) => {
			let pk = val.data.values.pk_autoinform.value;
			let ts = val.data.values.ts.value;
			pks = pk;
			//tss = ts;
			index = val.index;
			//pksArr.push(pk); //主键数组
			pktsmap[pk] = ts;
			indexmap[pk] = val.index;

		});

		//自定义请求数据
		let deldata = {
			pageCode: this.pagecode,
			pktsmap: pktsmap,
			indexmap: indexmap,
			pk: pks
		};

		ajax({
			url: requesturl.delete,
			data: deldata,
			success: (res) => {
				let { success } = res;
				if (success) {
					if (res.data) {
						toast({
							color: 'success',
							content: this.state.json['36070AGR-000007']/* 国际化处理： 删除成功*/
						});
						deleteCacheId(this.tableId, pks);//删除成功后, 删除allpk中pk
						this.props.table.deleteTableRowsByIndex(this.tableId, index)//直接删除table中的行列
					}
				}
			}
		});
	};

	//启用
	startConfirm = () => {
		let searchdata = this.props.table.getCheckedRows(constant.ltablecode);
		let selectdata = searchdata;
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		let pkvalue;
		//处理选择数据
		selectdata.forEach((val) => {
			let pk = val.data.values.pk_autoinform.value;
			let ts = val.data.values.ts.value;
			pksArr.push(pk); //主键数组
			pktsmap[pk] = ts;
			indexmap[pk] = val.index;
			pkvalue = pk;
		});
		//自定义请求数据
		let data = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			indexmap: indexmap,
			pks: pksArr,
			pk: pkvalue
		};
		let resdata = data;
		// console.log('resdata:', resdata)
		ajax({
			url: requesturl.enable,
			data: resdata,
			success: (res) => {
				let { success } = res;
				if (success) {
					if (res.data) {
						toast({
							color: 'success',
							content: this.state.json['36070AGR-000053']/* 国际化处理： 启用成功*/
						});
						let pk = res.data['form_autoinform_head'].rows[0].values.pk_autoinform.value;
						let updatedataArr = [{
							index: resdata.indexmap[pk],
							data: {
								values: res.data['form_autoinform_head'].rows[0].values
							} //自定义封装数据
						}];
						this.props.table.updateDataByIndexs(constant.ltablecode, updatedataArr);
						this.emptychoicebox();
					}
				}
			}
		});
	}

	//停用
	stopConfirm = () => {
		let searchdata = this.props.table.getCheckedRows(constant.ltablecode);
		let selectdata = searchdata;
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		let pkvalue;
		//处理选择数据
		selectdata.forEach((val) => {
			let pk = val.data.values.pk_autoinform.value;
			let ts = val.data.values.ts.value;
			pksArr.push(pk); //主键数组
			pktsmap[pk] = ts;
			indexmap[pk] = val.index;
			pkvalue = pk;
		});
		//自定义请求数据
		let data = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			indexmap: indexmap,
			pks: pksArr,
			pk: pkvalue
		};
		let resdata = data;
		// console.log('resdata:', resdata)
		ajax({
			url: requesturl.unenable,
			data: resdata,
			success: (res) => {
				let { success } = res;
				if (success) {
					if (res.data) {
						toast({
							color: 'success',
							content: this.state.json['36070AGR-000056']/* 国际化处理： 停用成功*/
						});
						let pk = res.data['form_autoinform_head'].rows[0].values.pk_autoinform.value;
						let updatedataArr = [{
							index: resdata.indexmap[pk],
							data: {
								values: res.data['form_autoinform_head'].rows[0].values
							} //自定义封装数据
						}];
						this.props.table.updateDataByIndexs(constant.ltablecode, updatedataArr);
						this.emptychoicebox();
					}
				}
			}
		});
	}

	//刷新页面
	refreshHtml = () => {
		let search = getDefData(constant.searchKey, this.cacheDataSource);
		let refreshsearchVal = deepClone(search);
		let sta = 'refresh';
		//let serval = this.gettabserval(this.state.tabInfo);
		if (!refreshsearchVal) {
			//refreshsearchVal = this.props.search.getAllSearchData(this.searchId);
			toast({
				duration: 3,
				color: 'success',
				content: this.state.json['36070AGR-000058']
			});
			return;
		}
		if (refreshsearchVal) {
			if (refreshsearchVal.conditions.length != 0) {
				//refreshsearchVal.conditions.push(...serval);
				let refreshpageInfo = this.props.table.getTablePageInfo(this.tableId); //分页
				refreshpageInfo.pageIndex = 0;
				this.querydata(refreshsearchVal, refreshpageInfo, sta);
				//this.emptychoicebox();
			}
		}
	}



	//删除单据（可批量）
	// delConfirm = () => {
	// 	let selectdata = this.props.table.getCheckedRows(this.tableId);
	// 	let {deleteCacheId} = this.props.table;
	// 	//数据校验
	// 	if (selectdata.length == 0) {
	// 		toast({
	// 			color: 'warning',
	// 			content: this.state.json['36070AGR-000026']/* 国际化处理： 请选择数据*/
	// 		});
	// 		return;
	// 	}		
	// 	let pksArr = [];
	// 	let pktsmap = {};
	// 	let indexmap = {};
	// 	//处理选择数据
	// 	selectdata.forEach((val) => {
	// 		let pk = val.data.values.pk_autoinform.value;
	// 		let ts = val.data.values.ts.value;
	// 		pksArr.push(pk); //主键数组
	// 		pktsmap[pk] = ts;
	// 		indexmap[pk] = val.index;
	// 	});

	// 	//自定义请求数据
	// 	let deldata = {
	// 		pageCode: this.pagecode,
	// 		pktsmap: pktsmap,
	// 		indexmap: indexmap,
	// 		pks: pksArr
	// 	};

	// 	ajax({
	// 		url: requesturl.delete,
	// 		data: deldata,
	// 		success: (res) => {
	// 			let { success, data } = res;
	// 			if (success) {
	// 				if(res.data){
	// 					let {status,totalNum,successNum,failNum,failMsg,successPks,successIndex } = res.data;
	// 					BatchToast.call(this, commondata.DELETE,status,totalNum,successNum,failNum,failMsg,null);
	// 					if (successPks.length > 0) {
	// 						successPks.forEach((val) => {
	// 							deleteCacheId(this.tableId, val);//删除成功后, 删除allpk中pk
	// 						})
	// 					}
	// 					if (successIndex.length > 0) {
	// 						this.props.table.deleteTableRowsByIndex(this.tableId, successIndex)//直接删除table中的行列
	// 					}
	// 				}
	// 			}
	// 		}
	// 	});
	// };

	// 查询ajax
	// querydataBytab = (searchVal,pageInfo) =>{
	// 	if(searchVal){
	// 		let search = getDefData(constant.searchKey, this.cacheDataSource);
	// 		if(!search){
	// 			search = this.props.search.getAllSearchData(constant.searchcode);
	// 		}
	// 		let searchdata = {
	// 			searchArea:this.getsearchdata(search,pageInfo),
	// 			tabAndSearchArea: this.getsearchdata(searchVal,pageInfo)
	// 		}

	// 		ajax({
	// 			url: requesturl.query,
	// 			data: searchdata,
	// 			success: (res) => {
	// 				let { success, data } = res;
	// 				if (success) {
	// 					if (data) {
	// 						this.props.table.setAllTableData(this.tableId, data.model);
	// 						let billid 
	// 						if(data.model.rows[0]){
	// 							billid = data.model.rows[0].values[this.pkname].value;
	// 						}
	// 						setButtonUsability.call(this, this.props);
	// 						//页签赋值
	// 						this.setState({
	// 							addid: billid
	// 						});
	// 						let tobesubmitnum = data.tabnum.tobesubmitnum;
	// 						let approvingnum = data.tabnum.approvingnum;
	// 						let tobesettlenum = data.tabnum.tobesettlenum;
	// 						setDefData(this.cacheDataSource, constant.tobesubmittab, tobesubmitnum);
	// 						setDefData(this.cacheDataSource, constant.approvingtab, approvingnum);
	// 						setDefData(this.cacheDataSource, constant.tobesettletab, tobesettlenum);
	// 						this.setState({
	// 							tobesubmittab: tobesubmitnum,
	// 							approvingtab: approvingnum,
	// 							tobesettletab: tobesettlenum
	// 						});
	// 					} else {
	// 						this.props.table.setAllTableData(this.tableId, {
	// 							rows: []
	// 						});
	// 						//页签赋值
	// 						this.setState({
	// 							tobesubmittab: 0,
	// 							approvingtab: 0,
	// 							tobesettletab: 0,
	// 							alltab: 0
	// 						});
	// 					}
	// 				}
	// 			}
	// 		});
	// 	}
	// }


	// 获取缓存中state值
	// getCacheState = () =>{

	// 	let tobesubmitnum = getDefData(this.cacheDataSource,constant.tobesubmittab);
	// 	let approvingnum = getDefData(this.cacheDataSource, constant.approvingtab);
	// 	let tobesettlenum = getDefData(this.cacheDataSource, constant.tobesettletab);

	// 	this.setState({
	// 		tobesubmittab: tobesubmitnum,
	// 		approvingtab: approvingnum,
	// 		tobesettletab: tobesettlenum
	// 	});

	// }



	render() {
		let { table, search, BillHeadInfo } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { showUploader, target, billno, billId } = this.state;

		let isfiplink = getDefData(constant.fipscene_key, this.cacheDataSource);
		const { createBillHeadInfo } = BillHeadInfo;
		const { ncmodal } = this.props;
		let { createModal } = ncmodal;
		return (
			<div className="nc-bill-list">
				{/** 渲染标题栏 **/}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: this.state.json['36070AGR-000018'],//标题 到账通知自动生单规则
								initShowBackBtn: false
							}
						)}
					</div>
					{/** 渲染头部按钮 **/}
					<div className="header-button-area">

						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							// popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				{/** 渲染查询区域 **/}
				{!isfiplink && <div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						// defaultConditionsNum: 2,
						showAdvBtn: true, // 显示高级按钮
						//onAfterEvent: onSearchAfterEvent.bind(this), //编辑后事件
						//searchBtnName: multiLang && multiLang.get('3630-0029'), // 查询按钮名称，默认查询
						// showAdvSearchPlanBtn :false, //高级面板中是否显示保存方案按钮 ;默认显示
						// replaceAdvBtnEve:()=>{}, // 业务组替换高级面板 (fun)
						// replaceAdvBody: this.replaceAdvBody, // 业务组替换高级面板中的body (fun),return Dom 
						// addAdvTabs: this.addAdvTabs, // 添加高级查询区自定义页签 (fun), return Dom 
						// addAdvBody: ()=>{}, // 添加高级查询区自定义查询条件Dom (fun) , return Dom 
						// oid: constant.oid, //'1001Z61000000000B6Z5' //查询模板的oid，用于查询查询方案
						renderCompleteEvent: this.renderCompleteEvent
					})}
				</div>}
				{/* {!isfiplink &&<div className="tab-definInfo-area">

						<NCTabs activeKey={this.state.tabInfo} onChange={(v) => {this.navChangeFun.call(this, v);}}>
							<NCTabPane key={'0'} tab={
								//待提交
								this.state.json['36070DC-000032']+ '(' +  (this.state.tobesubmittab || 0)+ ')'
							} />
							<NCTabPane key={'1'} tab={
								//审批中
								this.state.json['36070DC-000033']+ '(' +  (this.state.approvingtab || 0)+ ')'
							} />                        
							<NCTabPane key={'2'} tab={
								//待结算
								this.state.json['36070DC-000034']+ '(' +  (this.state.tobesettletab || 0)+ ')'
							} />
							<NCTabPane key={'3'} tab={
								//全部
								this.state.json['36070DC-000035']
							} />
						</NCTabs>

					</div>} */}

				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true,//列表序号列
						dataSource: this.cacheDataSource,
						pkname: this.pkname,
						onSelected: setButtonUsability.bind(this, this.props),
						onSelectedAll: setButtonUsability.bind(this, this.props),
						onRowDoubleClick: onrowDoubleclick.bind(this),//双击事件
						componentInitFinished: () => {
							// 缓存数据赋值成功的钩子函数
							// 若初始化数据后需要对数据做修改，可以在这里处理
						}

					})}
				</div>

				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && <NCUploader
						billId={billId}
						target={target}
						placement={'bottom'}
						billNo={billno}
						onHide={() => {
							// 关闭功能
							this.setState({
								showUploader: false
							})
						}}
					/>
					}
				</div>

				{/* 联查期初余额 */}
				<NCCOriginalBalance
					// 补录框显示
					showmodal={this.state.showOriginal}
					showOriginalData={this.state.showOriginalData}
					// 点击确定按钮的回调函数
					onSureClick={() => {
						//关闭对话框
						this.setState({
							showOriginal: false
						})
					}}
					onCloseClick={() => {
						//关闭对话框
						this.setState({
							showOriginal: false
						})
					}}
				>
				</NCCOriginalBalance>

				{/* 联查审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.approveshow}
						close={() => {
							this.setState({
								approveshow: false
							})
						}}
						billtype={constant.billtype}
						billid={billId}
					/>
				</div>
				<div>
					{/* {导入} */}
					{
						createModal('importModal', {
							noFooter: true,
							className: 'import-modal',
							hasBackDrop: false,
						})
					}
					<ExcelImport
						{...Object.assign(this.props)}
						moduleName="cmp" //模块名
						billType={'36S1'} //单据类型
						pagecode={constant.cpagecode}
						appcode={constant.appcode}
						selectedPKS={this.selectedPKS}
					/>
				</div>

				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url={requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				{this.state.compositedisplay ? <ApprovalTrans
					title={this.state.json['36070DC-000052']}
					data={this.state.compositedata}
					display={this.state.compositedisplay}
					getResult={this.getAssginUsedr.bind(this)}
					cancel={() => {
						//关闭对话框
						this.setState({
							compositedata: null,
							compositedisplay: false,
						});
					}}
				/> : ""}

			</div>
		);
	}
}

List = createPage({
	// initTemplate: initTemplate,
	// mutiLangCode: constant.mutiLangCode
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/