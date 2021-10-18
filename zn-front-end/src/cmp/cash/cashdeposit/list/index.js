/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表

import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { createPage, ajax, toast, base, high, cardCache, getMultiLang, deepClone, cacheTools, createPageIcon} from 'nc-lightapp-front';
import { constant, requesturl } from '../config/config';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm,setButtonUsability, onrowDoubleclick } from './events';
import NCCOriginalBalance from'../../../public/restmoney/list/index';
import { commondata } from '../../../public/utils/constant';
import { BatchToast } from '../../../public/CMPMessage';
// import { VoucherLinkBill } from '../util/util';
import NCTabs from '../../../../tmpub/pub/util/NCTabs/index';
import { saveMultiLangRes ,createListWebSocket} from '../../../../tmpub/pub/util';
const { NCDiv } = base;
let {setDefData, getDefData } = cardCache;
const { NCUploader, ApproveDetail, PrintOutput,ApprovalTrans ,ExcelImport } = high;
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
		this.selectedPKS=[];
		this.state = {
			tabInfo: '0', // 选中页签的信息
			tobesubmittab:0, // 待提交页签
			approvingtab:0, // 待审批页签
			tobesettletab: 0, // 待结算页签
			alltab: 0, // 全部页签
			billId:'', //单据id
			billno: '' , // 单据编号
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
			showOriginal:false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData:[], // 联查余额取数据，将需要联查的数据赋值给我
			conditionCache: null, // 查询区条件缓存
			custconditionCache: null, //页签信息缓存
			pageInfo: null, // 翻页信息缓存
			compositedata: null, // 指派数据
			compositedisplay: null, // 指派弹框是否弹框
			json: {}, // 多语
			inlt: null,
			sscivmMessage:''
			
		};
	}

	//操作列多语不显示
	componentWillMount() {

		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			// 将多语资源存储到页面级缓存中
			saveMultiLangRes(this.props,json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}
		getMultiLang({ 
			moduleId: {
			[constant.module_tmpub_name]: [constant.module_tmpub_id],
			[constant.module_name]: [constant.module_id,constant.mutiLangCode,'36070APM']
			}, 
		callback });		
	}

	// 组件挂载
	componentDidMount() {
		this.getCacheState();
		setButtonUsability.call(this, this.props);
		this.linkbill();
	}

	linkbill(){
		let scene = this.props.getUrlParam('scene');
		if(scene){
			if(constant.fipscene == scene){
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
								this.linkGoToCard(data.model.rows[0].values.pk_cashdeposit.value);
							}
                        } else {
                            props.table.setAllTableData(this.tableId, { rows: [] });
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


	// 设置查询条件缓存
	setSearchData(){
		let pageInfo = getDefData(this.cacheDataSource, constant.pageInfo);
		let searchVal = getDefData(this.cacheDataSource, constant.conditionCache);
		if(searchVal){
			this.props.search.setSearchValue(constant.oid, searchVal.conditions);
		}
		if(pageInfo){
			this.props.search.setSearchValue(constant.oid, searchVal.conditions);
		}
	}

	// 获取缓存中state值
	getCacheState = () =>{

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
		this.setState({
			tabInfo: status
		})
		setDefData(constant.tabInfo, this.cacheDataSource, status);
		let serval = this.gettabserval(status);
		this.getData(serval);
	}

	// 获取页签拼接条件
	gettabserval = (tabkey) =>{
		let serval
		if(tabkey == '0'){
			serval = [
				{
					field: 'billstatus',
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
					field: 'billstatus',
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
					field: 'billstatus',
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

	// 查询数据
	getData = (serval) => {
		let search = getDefData(constant.searchKey, this.cacheDataSource);
		let searchVal = deepClone(search);
		if(searchVal){
			if(searchVal.conditions.length != 0){
				searchVal.conditions.push(...serval);
				let pageInfo = this.props.table.getTablePageInfo(this.tableId);
				this.querydataBytab(searchVal,pageInfo);
			}
		}
	};

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
	querydataBytab = (searchVal,pageInfo) =>{
		if(searchVal){
			let search = getDefData(constant.searchKey, this.cacheDataSource);
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
							this.props.table.setAllTableData(this.tableId, data.model);
							let billid 
							if(data.model.rows[0]){
								billid = data.model.rows[0].values[this.pkname].value;
							}
							setButtonUsability.call(this, this.props);
							//页签赋值
							this.setState({
								addid: billid
							});
							let tobesubmitnum = data.tabnum.tobesubmitnum;
							let approvingnum = data.tabnum.approvingnum;
							let tobesettlenum = data.tabnum.tobesettlenum;
							setDefData(this.cacheDataSource, constant.tobesubmittab, tobesubmitnum);
							setDefData(this.cacheDataSource, constant.approvingtab, approvingnum);
							setDefData(this.cacheDataSource, constant.tobesettletab, tobesettlenum);
							this.setState({
								tobesubmittab: tobesubmitnum,
								approvingtab: approvingnum,
								tobesettletab: tobesettlenum
							});
						} else {
							this.props.table.setAllTableData(this.tableId, {
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

	// 查询ajax
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
									duration: 3,
									color: 'success',
									content: this.state.json['36070DC-000055']
									});
							}else{
								toast({
									duration: 3,
									color: 'warning',
									content: this.state.json['36070DC-000051']
								});
							}
							this.props.table.setAllTableData(this.tableId, data.model);
							let billid 
							if(data.model.rows[0]){
								billid = data.model.rows[0].values[this.pkname].value;
							}
							setButtonUsability.call(this, this.props);
							//页签赋值
							this.setState({
								addid: billid
							});
						} else {
							toast({
								duration: 3,
								color: 'warning',
								content: this.state.json['36070DC-000051']
							});
							this.props.table.setAllTableData(this.tableId, {
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
		this.props.table.selectAllRows(this.tableId,false);
		setButtonUsability.call(this, this.props);
	}

	// 回调函数
    renderCompleteEvent = () => {
		// 获取缓存中页签的值
		let tabkey = getDefData(constant.tabInfo, this.cacheDataSource);
		if(tabkey){
			this.setState({
				tabInfo: tabkey
			})
		}

    }

	//删除单据
	delConfirm = () => {

		let selectdata = this.props.table.getCheckedRows(this.tableId);
		let {deleteCacheId} = this.props.table;
		//数据校验
		if (selectdata.length == 0) {
			toast({
				color: 'warning',
				content: this.state.json['36070DC-000026']/* 国际化处理： 请选择数据*/
			});
			return;
		}
		
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		//处理选择数据
		selectdata.forEach((val) => {
			let pk = val.data.values.pk_cashdeposit.value;
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
				let { success, data } = res;
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

	//刷新页面
	refreshHtml = () => {
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

	// 提交即指派
	getAssginUsedr = (value) => {

		let selectdata = this.props.table.getCheckedRows(constant.ltablecode);
		
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
			if(selectdata.length != 0){
				//处理选择数据
				selectdata.forEach((val) => {
					let pk = val.data.values.pk_cashdeposit.value;
					let ts = val.data.values.ts.value;
					pksArr.push(pk); //主键数组
					pktsmap[pk] = ts;
					indexmap[pk] = val.index;
				});
			}
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
		let { table, search, BillHeadInfo } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { showUploader, target,billno,billId } = this.state;
	
		let isfiplink = getDefData(constant.fipscene_key, this.cacheDataSource);
		const { NCTabPane } = NCTabs;
		const { ncmodal } = this.props;
		let { createModal } = ncmodal;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
			 {/**创建websocket连接 */}
			 {createListWebSocket(this.props, {
                    tableAreaCode: constant.ltablecode,
                    tablePkName: constant.pkname,
					billtype: constant.billtype,
					dataSource:constant.cacheDataSource
                    // serverLocation: '10.16.2.231:9991'
                })}
				{/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: this.state.json['36070DC-000018'],
									// loadMultiLang(this.props, '36070DC-000018'),//国际化处理： 现金缴存
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
				</NCDiv>
				{!isfiplink &&<div className="nc-bill-search-area">
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
				{!isfiplink &&<div className="tab-definInfo-area">

					<NCTabs activeKey={this.state.tabInfo} onChange={(v) => {this.navChangeFun.call(this, v);}}>
						<NCTabPane key={'0'} tab={
							<span>{this.state.json['36070DC-000032']+ '('}
								<span>{this.state.tobesubmittab || 0}</span>
								{')'}
							</span>
							//待提交
							// this.state.json['36070DC-000032']+ '(' +  (this.state.tobesubmittab || 0)+ ')'
						} />
						<NCTabPane key={'1'} tab={
							<span>{this.state.json['36070DC-000033']+ '('}
								<span>{this.state.approvingtab || 0}</span>
								{')'}
							</span>
							//审批中
							// this.state.json['36070DC-000033']+ '(' +  (this.state.approvingtab || 0)+ ')'
						} />                        
						<NCTabPane key={'2'} tab={
							<span>{this.state.json['36070DC-000034']+ '('}
								<span>{this.state.tobesettletab || 0}</span>
								{')'}
							</span>
							//待结算
							// this.state.json['36070DC-000034']+ '(' +  (this.state.tobesettletab || 0)+ ')'
						} />
						<NCTabPane key={'3'} tab={
							//全部
							this.state.json['36070DC-000035']
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
						pkname: 'pk_cashdeposit',
						onSelected: setButtonUsability.bind(this, this.props),
						onSelectedAll: setButtonUsability.bind(this, this.props),
						onRowDoubleClick: onrowDoubleclick.bind(this),//双击事件
						componentInitFinished:()=>{
							// 缓存数据赋值成功的钩子函数
							// 若初始化数据后需要对数据做修改，可以在这里处理
							//begin tm lidyu  20200326 表格数据加载完毕 处理按钮可用性
							setButtonUsability.call(this, this.props, '');
							//end lidyu
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
						onHide={() =>{
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
					billType={'36S1'} //单据类型
					pagecode={constant.cpagecode}
					appcode = {constant.appcode}
					selectedPKS={this.selectedPKS}
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