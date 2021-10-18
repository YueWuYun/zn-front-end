/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, cardCache, toast, getMultiLang, deepClone, cacheTools, createPageIcon } from 'nc-lightapp-front';
import { constant, requesturl } from '../config/config';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, setButtonUsability,onrowDoubleclick } from './events';
import PayBuluForm from'../../../../obm/ebankbulu/bulu/form/index';
import NCCOriginalBalance from'../../../public/restmoney/list/index';
import { sourceModel_CMP, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU, commondata } from'../../../public/utils/constant'
import { BatchToast } from '../../../public/CMPMessage';
import Sign from '../../../../tmpub/pub/util/ca';
import { commonurl } from '../../../public/utils/constant';
import NCTabs from '../../../../tmpub/pub/util/NCTabs/index';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
// import JointBill from '../../../../sscrp/refer/jointbill/JointBillTableRef/config/JointBillModal';
import './index.less';
const { NCDiv } = base;
let {setDefData, getDefData,hasCacheData } = cardCache;
const { NCUploader, ApproveDetail, BillTrack, PrintOutput, ApprovalTrans ,ExcelImport } = high;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pagecode = constant.lpagecode; 
		this.searchId = constant.searchcode; 
		this.tableId = constant.ltablecode; 
		this.cacheDataSource = constant.cacheDataSource;
		this.billpk = constant.pk_transformbill;
		this.pk = null;
		this.ts = null;
		this.index = null;
		this.selectedPKS= []; //导出数据的主键pk
		this.state = {
			tabInfo: '0', // 选中页签的信息
			tobesubmittab: 0,
			approvingtab: 0,
			tobesettletab: 0,
			alltab: 0,
			billId:'',//单据id
			billno: '' ,// 单据编号
			addid: '',
			showUploader: false,
			target: null,
			approveshow: false,
			billtrackshow: false,
			showBuLu: false,         //设置显示补录模态框显隐性
			onLineData: [],
			moduleType: 'CMP',
			modelType: SHOWMODEL_BULU,
			outputData: '',
			showOriginal:false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData:[], // 联查余额取数据，将需要联查的数据赋值给我
			compositedata: null, // 指派数据
			compositedisplay: null, // 指派弹框是否弹框
			json: {}, //多语
			sscivmMessage:'',
			inlt: null
		};
		// initTemplate.call(this, props);
	}

	//操作列多语不显示
	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			saveMultiLangRes(this.props,json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				//console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}
		// getMultiLang({ moduleId: [constant.mutiLangCode,'36070'], domainName: 'cmp', callback });
		getMultiLang({ 
			moduleId: {
			[constant.module_tmpub_name]: [constant.module_tmpub_id],
			[constant.module_name]: [constant.module_id,constant.mutiLangCode]
			}, 
		callback });
	}

	componentDidMount() {
		this.getCacheState();
		setButtonUsability.call(this, this.props);
		this.linkbill();
	}

	linkbill(){
		let scene = this.props.getUrlParam('scene');
		if(scene){
			if(commondata.fipscene == scene){
				setDefData(constant.fipscene_key, this.cacheDataSource, true);
				this.voucherLinkBill();
			}
		}
	}

	// 凭证联查单据
    voucherLinkBill = () => {
        let checkedData = [];
        //缓存中的key为’checkedData’,
        checkedData = cacheTools.get('checkedData');
        if(checkedData && checkedData.length > 0){
            let data={
                operatingLogVO: checkedData,
                pageCode: this.pagecode,
            };
            ajax({
				url: requesturl.voucherlink,
	         	data: data,
			    success: (res) => {
					let { success, data } = res;
					if (success) {
					if (data) {
							if(data.model){
								if(data.model.rows.length>1){
									this.props.table.setAllTableData(this.tableId, data.model);
								}else{
									this.linkGoToCard(data.model.rows[0].values.pk_transformbill.value);
								}
							} else {
								this.props.table.setAllTableData(this.tableId, { rows: [] });
							}
						} 
					}
				}
			});
		};
	};

	linkGoToCard = (id) => {
		this.props.pushTo('/card', {
			pagecode: constant.cpagecode,
			status: 'browse',
			id: id,
			scene: 'scene',
			auto: true
		});
	};

	// 获取缓存中state值
	getCacheState = () =>{
		//hasCacheData函数根据缓存数据命名空间进行查询是否有数据,
		// 判断有值就会赋值，没有就不赋值
		// if(this.props.table.hasCacheData(this.cacheDataSource)){
		// 	// 没有值，将所有的按钮置为不可用
		// 	// 选中清空
		// 	this.props.table.selectAllRows(this.tableId, true);
		// };

		let tobesubmitnum = getDefData(this.cacheDataSource,constant.tobesubmittab);
		let approvingnum = getDefData(this.cacheDataSource, constant.approvingtab);
		let tobesettlenum = getDefData(this.cacheDataSource, constant.tobesettletab);
		
		this.setState({
			tobesubmittab: tobesubmitnum,
			approvingtab: approvingnum,
			tobesettletab: tobesettlenum
		});
	}
	
	//页签筛选
	navChangeFun = (status, className, e) => {
		//页签赋值
		this.setState({
			tabInfo: status, // 选中页签的信息
		});
		setDefData(constant.tabInfo, this.cacheDataSource,status);
		this.getData(this.gettabserval(status));
	};

	gettabserval = (tabkey) =>{
		let serval;
		if(tabkey == '0'){
			serval = [
				{
					field: 'busistatus',
					value: {
						firstvalue: '1',
						secondvalue: null
					},
					oprtype: '=',
					display: null
				}
			];
			return serval;
		}else if(tabkey == '1'){
			serval = [
				{
					field: 'busistatus',
					value: {
						firstvalue: '2',
						secondvalue: null
					},
					oprtype: '=',
					display: null
				}
			];
			return serval;
		}else if(tabkey == '2'){
			serval = [
				{
					field: 'busistatus',
					value: {
						firstvalue: '3',
						secondvalue: null
					},
					oprtype: '=',
					display: null
				}
			];
			return serval;
		}else if(tabkey == '3'){
			serval = [
			];
			return serval;
		}
	}

	// 页签获取数据
	getData = (serval) => {
		let	search = getDefData(constant.searchKey, this.cacheDataSource);
		//查询条件先取缓存，再去查询区
		let searchVal = deepClone(search);//缓存的查询条件{需要先克隆一下}
		if(searchVal){
			if(searchVal.conditions.length != 0){
				searchVal.conditions.push(...serval);
				let pageInfo = this.props.table.getTablePageInfo(this.tableId);
				this.querydataBytab(searchVal,pageInfo);
			}
		}else{
			return;
		}
	};

	//删除单据
	delConfirm = () => {

		let selectdata = this.props.table.getCheckedRows(this.tableId);
		let { deleteCacheId } = this.props.table;
		//数据校验
		if (selectdata.length == 0) {
			toast({
				color: 'warning',
				content: this.state.json['36070TBR-000034']/* 国际化处理： 请选择数据*/
			});
			return;
		}
		
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		//处理选择数据
		selectdata.forEach((val) => {
			let pk = val.data.values.pk_transformbill.value;
			let ts = val.data.values.ts.value;
			pksArr.push(pk); //主键数组
			pktsmap[pk] = ts;
			indexmap[pk] = val.index;
		});

		//自定义请求数据
		let deldata = {
			pageCode: this.pagecode,
			pktsmap: pktsmap,
			indexmap: indexmap,
			pks: pksArr
		};

		ajax({
			url: requesturl.delete,
			data: deldata,
			success: (res) => {
				let {
					success,
					data
				} = res;
				if (success) {
					if(res.data){
						let {status,totalNum,successNum,failNum,failMsg,successPks,successIndex } = res.data;
						BatchToast.call(this, commondata.DELETE,status,totalNum,successNum,failNum,failMsg,null);
						if (successPks.length > 0) {
							successPks.forEach((val) => {
								deleteCacheId(this.tableId, val);//删除成功后, 删除allpk中pk
							})
						}
						if (successIndex.length > 0) {
							this.props.table.deleteTableRowsByIndex(this.tableId, successIndex)//直接删除table中的行列
						}
					}

				}
			}
		});
	};

	// 刷新页面
	refreshHtml = () => {
		//刷新列表信息
		let search = getDefData(constant.searchKey, this.cacheDataSource);
		let refreshsearchVal = deepClone(search);
		let serval = this.gettabserval(this.state.tabInfo);
		if(!refreshsearchVal){
			refreshsearchVal = this.props.search.getAllSearchData(this.searchId);
		}
		if(refreshsearchVal){
			if(refreshsearchVal.conditions.length != 0){
				refreshsearchVal.conditions.push(...serval);
				let refreshpageInfo = this.props.table.getTablePageInfo(this.tableId); //分页
				refreshpageInfo.pageIndex = 0;
				this.querydataBytab(refreshsearchVal,refreshpageInfo);
			}
		}
	}

	// 组装查询条件参数
	getsearchdata = (searchVal,pageInfo) =>{
		let queryInfo = this.props.search.getQueryInfo(this.searchId, false);
		let oid=queryInfo.oid;
		let searchdata = {
			querycondition: searchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions: []
			},
			pageInfo: pageInfo,
			pageCode: constant.lpagecode,
			appregisterPk: constant.appregisterpk,
			appcode: constant.appcode,
			queryAreaCode: constant.searchcode, //查询区编码
			oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		return searchdata;
	}

	// 切换页签查询数据
	querydataBytab = (searchVal,pageInfo) =>{
		if(searchVal){
			let	search = getDefData(constant.searchKey, this.cacheDataSource);
			if(!search){
				search = this.props.search.getAllSearchData(constant.searchcode);
			}
			let searchdata = {
				searchArea:this.getsearchdata(search,pageInfo),
				tabAndSearchArea: this.getsearchdata(searchVal,pageInfo)
			}
			ajax({
				url: requesturl.query,
				data: searchdata,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							this.props.table.setAllTableData(constant.ltablecode, data.model);
							let billid 
							if(data.model.rows[0]){
								billid = data.model.rows[0].values[this.billpk].value;
							}
							setButtonUsability.call(this, this.props);
							//页签赋值
							this.setState({
								addid: billid
							});
							let tobesubmitnum = data.tabnum.tobesubmitnum;
							let approvingnum = data.tabnum.approvingnum;
							let tobesettlenum = data.tabnum.tobesettlenum;
							// let allnum = data.tabnum.allnum;

							// 缓存页签总数
							setDefData(this.cacheDataSource, constant.tobesubmittab, tobesubmitnum);
							setDefData(this.cacheDataSource, constant.approvingtab, approvingnum);
							setDefData(this.cacheDataSource, constant.tobesettletab, tobesettlenum);

							this.setState({
								tobesubmittab: tobesubmitnum,
								approvingtab: approvingnum,
								tobesettletab: tobesettlenum
							});
						} else {
							this.props.table.setAllTableData(constant.ltablecode, {
								rows: []
							});
							//页签赋值
							this.setState({
								tobesubmittab: 0,
								approvingtab: 0,
								tobesettletab: 0,
								alltab: 0
							});
						}
					}
				}
			});
		}
	}

	// 查询按钮查询数据
	querydata = (searchVal,pageInfo) =>{
		if(searchVal){
			let serval = this.gettabserval(this.state.tabInfo);
			searchVal.conditions.push(...serval);
			let searchArea = this.props.search.getAllSearchData(constant.searchcode);
			let searchdata = {
				searchArea:this.getsearchdata(searchArea,pageInfo),
				tabAndSearchArea: this.getsearchdata(searchVal,pageInfo)
			}
			ajax({
				url: requesturl.query,
				data: searchdata,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {

							let tobesubmitnum = data.tabnum.tobesubmitnum;
							let approvingnum = data.tabnum.approvingnum;
							let tobesettlenum = data.tabnum.tobesettlenum;
							let allnum = data.tabnum.allnum;

							// 缓存页签总数
							setDefData(this.cacheDataSource, constant.tobesubmittab, tobesubmitnum);
							setDefData(this.cacheDataSource, constant.approvingtab, approvingnum);
							setDefData(this.cacheDataSource, constant.tobesettletab, tobesettlenum);

							this.setState({
								tobesubmittab: tobesubmitnum,
								approvingtab: approvingnum,
								tobesettletab: tobesettlenum
							});

							if(allnum > 0){
								toast({
									color: 'success',
									content: this.state.json['36070TBR-000077']
								});
							}else{
								toast({
									color: 'warning',
									content: this.state.json['36070TBR-000078']
								});
							}
							
							this.props.table.setAllTableData(constant.ltablecode, data.model);
							let billid 
							if(data.model.rows[0]){
								billid = data.model.rows[0].values[this.billpk].value;
							}
							setButtonUsability.call(this, this.props);
							//页签赋值
							this.setState({
								addid: billid
							});
						} else {
							toast({
								color: 'warning',
								content: this.state.json['36070TBR-000078'] /* 国际化处理： 只能选择一条数据!*/
							});
							this.props.table.setAllTableData(constant.ltablecode, {
								rows: []
							});
							//页签赋值
							this.setState({
								tobesubmittab: 0,
								approvingtab: 0,
								tobesettletab: 0,
								alltab: 0
							});
						}
					}
				}
			});
		}
	}

	// 清空选择框
	emptychoicebox = () =>{
		// this.props.table.selectAllRows(this.tableId,false);
		setButtonUsability.call(this, this.props);
	}

	// 查询区渲染完成回调函数
    renderCompleteEvent = () => {
		let tabkey = getDefData(constant.tabInfo, this.cacheDataSource);
		if(tabkey){
			//页签赋值
			this.setState({
				tabInfo: tabkey, // 选中页签的信息
			});
		}
    }

	  // 保存网银补录数据
	processRetMsg = async (retPayMsg) => {
		let selectedData = this.props.table.getCheckedRows(this.tableId);
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		if(this.pk){
			let pk = this.pk;
			let ts = this.ts;
			pksArr.push(pk); //主键数组
			pktsmap[pk] = ts;
			indexmap[pk] = this.index;
		}else{
			if (!selectedData || selectedData.length == 0) {
				toast({
					color: 'warning',
					content: this.state.json['36070TBR-000042']	/* 国际化处理： 请选择一条数据*/
				});
				return;
			}else{
				//处理选择数据
				selectedData.forEach((val) => {
					let pk = val.data.values.pk_transformbill.value;
					let ts = val.data.values.ts.value;
					pksArr.push(pk); //主键数组
					pktsmap[pk] = ts;
					indexmap[pk] = val.index;
				});
			}
		}

		if(this.state.modelType === SHOWMODEL_ZHIFU){
			let signdata = await Sign({
				isSign: true,
				isKey: true,
				data: null,
				encryptVOClassName: null,
				primaryId: pksArr
			});
			if (signdata.isStop) {
				return;
			}
			let data = {
				payRetMsg: retPayMsg,
				pageCode: constant.lpagecode,
				pktsmap: pktsmap,
				indexmap: indexmap,
				pks: pksArr,
				requestsrc: 'list',
				clearText: signdata.data.text, // 明文串
				cipherText: signdata.data.signText,// 密文串
				userJson: signdata.data.userjson// 用户信息
			};
			
			ajax({
				url: requesturl.pay,
				data: data,
				success: (res) => {
					let {
						data,
						success
					} = res;                
					if (success) {
						if (data) {
								this.updateData(res.data, commondata.NETPAY);
							}                
					}
				}
			});
		}else if(this.state.modelType === SHOWMODEL_BULU){
			let signdata = await Sign({
				isSign: false,
				isKey: false,
				data: null,
				encryptVOClassName: null
			});
			if (signdata.isStop) {
				return;
			}else{
				toast({
					color: 'success',
					content: this.state.json['36070TBR-000076']
				});
			}
		}
	}

	// 更新列数据
	updateData(updata, operation){
		let { status, totalNum, successNum, failNum, failMsg, listmap } = updata;
		BatchToast.call(this, operation, status, totalNum, successNum, failNum, failMsg, null);
		//加载更新缓存数据
		if (listmap != null && listmap.length > 0) {
			listmap.forEach((val) => {
				let updatedataArr = [{
					index: val.index,
					data: {
						values: val.rows.values
					} //自定义封装数据
				}];
				this.props.table.updateDataByIndexs(this.tableId, updatedataArr);
			});
		}
	}

	closeModal=()=>{
		this.setState({billCodeModalShow:false})
	}

	// 提交即指派
	getAssginUsedr = (value) => {

		let selectdata = this.props.table.getCheckedRows(constant.ltablecode);
		
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		if(selectdata.length != 0){
			//处理选择数据
			selectdata.forEach((val) => {
				let pk = val.data.values.pk_transformbill.value;
				let ts = val.data.values.ts.value;
				pksArr.push(pk); //主键数组
				pktsmap[pk] = ts;
				indexmap[pk] = val.index;
			});
		}else{
			let pk = this.pk;
			let ts = this.ts;
			pksArr.push(pk); //主键数组
			pktsmap[pk] = ts;
			indexmap[pk] = this.index;
		}
		//自定义请求数据
		let data = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			indexmap: indexmap,
			pks: pksArr,
			userObj:value
		};

		ajax({
			url: requesturl.commit,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if(data){
						let { status,totalNum,successNum,failNum,failMsg,listmap } = data;
						BatchToast.call(this, commondata.COMMIT, status, totalNum, successNum, failNum, failMsg, null);
						//加载更新缓存数据
						if (listmap != null && listmap.length > 0) {
							listmap.forEach((val) => {
								let updatedataArr = [{
									index: val.index,
									data: {
										values: val.rows.values
									} //自定义封装数据
								}];
								this.props.table.updateDataByIndexs(this.tableId, updatedataArr);
							});
						}
						this.setState({
							compositedata: data,
							compositedisplay: false,
						});
					}
				} else {
					this.props.table.setAllTableData(this.tableId, { rows: [] });
				}
			}
		});
	}

	render() {
		let { table, search, modal, BillHeadInfo } = this.props;
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { showUploader, target,billno,billId } = this.state;
		let isfiplink = getDefData(constant.fipscene_key, this.cacheDataSource);
		const { NCTabPane } = NCTabs;
		const { ncmodal } = this.props;
		let { createModal } = ncmodal;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list cmp-transformbill">
				{/**创建websocket连接 */}
                {api.comm.createListWebSocket(this.props, {
                    tableAreaCode: cons.list.tableCode,
                    tablePkName: cons.field.pk,
                    billtype: cons.comm.billType
                    // serverLocation: '10.16.2.231:9991'
                })}
				{/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: this.state.json['36070TBR-000023'],
								// loadMultiLang(this.props, '36070TBR-000023'),//国际化处理： 划账结算
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							// popContainer: document.querySelector('.header-button-area')
						})}
					</div>

					<PayBuluForm showmodal={this.state.showBuLu} modal={modal} 
					//输入参数： 
						onLineData={this.state.onLineData} 
						modelType={this.state.modelType}
						moduleType={this.state.moduleType}
						//点击确定按钮的回调函数
						onSureClick={(retPayMsg)=>{
							//处理补录信息(输出参数：PaymentRetMsg[])
							this.processRetMsg(retPayMsg);
 							//关闭对话框
							this.setState({
								showBuLu : false
							})              
						}} 
						//点击关闭按钮的回调函数
						onCloseClick={()=>{
						//关闭对话框
							this.setState({
								showBuLu : false
							})
						}}>
					</PayBuluForm> 
				</NCDiv>
				{!isfiplink&&<div className="nc-bill-search-area">
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
						renderCompleteEvent:this.renderCompleteEvent
					})}
				</div>}
				{!isfiplink&&<div className="tab-definInfo-area">
					<NCTabs activeKey={this.state.tabInfo} onChange={(v) => {this.navChangeFun.call(this, v);}}>
                        <NCTabPane key={'0'} tab={
							<span>{this.state.json['36070TBR-000043']+ '('}
								<span>{this.state.tobesubmittab || 0}</span>
								{')'}
							</span>
                            //待提交
                        } />
                        <NCTabPane key={'1'} tab={
							<span>{this.state.json['36070TBR-000044']+ '('}
								<span>{this.state.approvingtab || 0}</span>
								{')'}
							</span>
                            //审批中
							// this.state.json['36070TBR-000044']+ '(' +  (this.state.approvingtab || 0)+ ')'
                        } />                        
                        <NCTabPane key={'2'} tab={
							<span>{this.state.json['36070TBR-000045']+ '('}
								<span>{this.state.tobesettletab || 0}</span>
								{')'}
							</span>
                            //待结算
                            // this.state.json['36070TBR-000045']+ '(' +  (this.state.tobesettletab || 0)+ ')'
                        } />
						<NCTabPane key={'3'} tab={
                            //全部
                            this.state.json['36070TBR-000046']
                        } />
                    </NCTabs>
				</div>}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true,
						dataSource: this.cacheDataSource,
						// pkname: pkname,
						onSelected: setButtonUsability.bind(this, this.props),
						onSelectedAll: setButtonUsability.bind(this, this.props),
						onRowDoubleClick: onrowDoubleclick.bind(this),//双击事件
						componentInitFinished:()=>{
							// 缓存数据赋值成功的钩子函数
							// 若初始化数据后需要对数据做修改，可以在这里处理
							setButtonUsability.call(this, this.props);
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
						customInterface={
							{
								queryLeftTree: commonurl.lefttreequery,
								queryAttachments: requesturl.enclosurequery
							}
						}
                        />
					}
				</div>

				<div>
                	{/* <NCButton colors="primary" onClick={this.openBillTrack}>单据追溯</NCButton> */}
                	<BillTrack
                   		show={this.state.billtrackshow}
                   		close={()=>{
                       		this.setState({billtrackshow: false})
                   		}}
                   		pk={billId}  //单据id
                   		type={constant.billtype}  //单据类型
                	/>
            	</div>

				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url= {requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				{/* 联查期初余额 */}
				<NCCOriginalBalance
                    // 补录框显示
                    showmodal={this.state.showOriginal}
                    showOriginalData = {this.state.showOriginalData}
                    // 点击确定按钮的回调函数
                    onSureClick={(retOriginalMsg) => {
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
                    	close={() =>{
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
					createModal('importModal',{
						noFooter: true,
						className: 'import-modal',
						hasBackDrop:false,
					})
				}
				<ExcelImport
					{...Object.assign(this.props)}
					moduleName="cmp" //模块名
					billType={'36S4'} //单据类型
					pagecode={constant.cpagecode}
					appcode = {constant.appcode}
					selectedPKS={this.selectedPKS}
				/>
				</div>

				{/* 增值税发票 */}
				{/* <JointBill show={this.state.billCodeModalShow} 
				close={()=>this.closeModal()} 
				billCode={this.state.billCode} 
				{...this.props} /> */}

				{this.state.compositedisplay ? <ApprovalTrans
                    title={this.state.json['36070TBR-000081']}
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