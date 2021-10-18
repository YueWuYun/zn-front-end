/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表

import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { createPage, ajax, toast, base, high, cardCache, getMultiLang, deepClone, cacheTools, createPageIcon} from 'nc-lightapp-front';
import { constant, requesturl } from '../config/config';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm,setButtonUsability, onrowDoubleclick } from './events';
import { commondata } from '../../../public/utils/constant';
import NCTabs from '../../../../tmpub/pub/util/NCTabs/index';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
import BXCard from '../bxcard/index';
import ZFCard from '../zfcard/index';
let {setDefData, getDefData } = cardCache;
const { NCUploader, PrintOutput } = high;
const { NCDiv } = base;
import { BBM_CONST, APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../cons/constant';
const {  } = BBM_CONST;
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE,CARD_FORMCODE2,CARD_FORMCODE3,
	PRINT_TEMPLATEID,PRINT_FUNCODE,PRINT_NODEKEY } = APP_INFO;
const { PK_NAME,PK_ORG,VBILLNO,BILL_STATUS,TS, } = BILL_FIELD;
const {  QUERY,QUERYBYIDS,QUERYCARD,BBMBX,BBMBXCANCEL,BBMLY,BBMLYCANCEL,BBMZF,BBMZFCANCEL,PRINT } = REQUEST_URL;
const { LY_BTN,LY_GROUP,LYCANCEL_BTN,BX_BTN,BX_GROUP,BXCANCEL_BTN,ZF_BTN,ZF_GROUP,ZFCANCEL_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN,REFRESH_BTN } = BTN;

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
		this.billStatus = null;
		this.state = {
			tabInfo: '0', // 选中页签的信息
			tobesubmittab:0, // 待提交页签
			approvingtab:0, // 待审批页签
			tobesettletab: 0, // 待结算页签
			alltab: 0, // 全部页签
			billId:'', //单据id
			billno: '' , // 单据编号
			showBxCard: false, // 报销弹框显示
			showBxCardData:[], // 报销弹框数据
			showZfCard: false, // 报销弹框显示
			showZfCardData:[], // 报销弹框数据
			target: null, // 附件
			outputData: '', // 输出数据
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
			saveMultiLangRes(this.props,json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				console.log(this.state.json['36070BBM-000018'])   // 未请求到多语资源的后续操作
			}
		}
		getMultiLang({ 
			moduleId: {
			[constant.module_tmpub_name]: [constant.module_tmpub_id],
			[constant.module_name]: [constant.module_id,constant.mutiLangCode]
			}, 
		callback });
	}

	// 组件挂载
	componentDidMount() {
		this.getCacheState();
		setButtonUsability.call(this, this.props);
	}
	
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
					field: BILL_STATUS,
					value: {
						firstvalue: '0',
						secondvalue: null
					},
					oprtype: '=',
					display: null
				}
			];
			this.billStatus = '0';
			return serval;
		}else if(tabkey == '1'){
			serval = [
				{
					field: BILL_STATUS,
					value: {
						firstvalue: '1',
						secondvalue: null
					},
					oprtype: '=',
					display: null
				}
			];
			this.billStatus = '1';
			return serval;
		}else if(tabkey == '2'){
			serval = [
				{
					field: BILL_STATUS,
					value: {
						firstvalue: '2',
						secondvalue: null
					},
					oprtype: '=',
					display: null
				}
			];
			this.billStatus = '2';
			return serval;
		}else if(tabkey == '3'){
			serval = [
			];
			this.billStatus = null;
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
			// let billstatus = this.gettabbillstatus(this.state.tabInfo);
			let searchdata = {
				searchArea: this.getsearchdata(search,pageInfo),
				tabAndSearchArea: this.getsearchdata(searchVal,pageInfo),
				billStatus: this.billStatus
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
			// let billstatus = this.gettabbillstatus(this.state.tabInfo);
			let searchdata = {
				searchArea:this.getsearchdata(searchArea,pageInfo),
				tabAndSearchArea: this.getsearchdata(searchVal,pageInfo),
				billStatus: this.billStatus
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
									content: this.state.json['36070BBM-000022']
									});
							}else{
								toast({
									duration: 3,
									color: 'warning',
									content: this.state.json['36070BBM-000005']
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
								content: this.state.json['36070BBM-000005']
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

	savecallback(){
		this.refreshHtml();
	}

	render() {
		let { table, search, BillHeadInfo } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { target,billno,billId } = this.state;
		let isfiplink = getDefData(constant.fipscene_key, this.cacheDataSource);
		const { NCTabPane } = NCTabs;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				{/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: this.state.json['36070BBM-000000'],
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
				
				{/* <div style={{borderTop: '1px solid #CCC'}}></div> */}
				{!isfiplink &&<div className="tab-definInfo-area">

					<NCTabs activeKey={this.state.tabInfo} onChange={(v) => {this.navChangeFun.call(this, v);}}>
						<NCTabPane key={'0'} tab={
							<span>{this.state.json['36070BBM-000001']+ '('}
								<span>{this.state.tobesubmittab || 0}</span>
								{')'}
							</span>
							//待提交
							// this.state.json['36070BBM-000001']+ '(' +  (this.state.tobesubmittab || 0)+ ')'
						} />
						<NCTabPane key={'1'} tab={
							<span>{this.state.json['36070BBM-000002']+ '('}
								<span>{this.state.approvingtab || 0}</span>
								{')'}
							</span>
							//审批中
							// this.state.json['36070BBM-000002']+ '(' +  (this.state.approvingtab || 0)+ ')'
						} />                        
						<NCTabPane key={'2'} tab={
							<span>{this.state.json['36070BBM-000003']+ '('}
								<span>{this.state.tobesettletab || 0}</span>
								{')'}
							</span>
							//待结算
							// this.state.json['36070BBM-000003']+ '(' +  (this.state.tobesettletab || 0)+ ')'
						} />
						<NCTabPane key={'3'} tab={
							//全部
							this.state.json['36070BBM-000004']
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
						}
					
					})}
				</div>

				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url= {PRINT}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				<BXCard
                    // 报销框显示
                    showmodal={this.state.showBxCard}
                    showBxCardData = {this.state.showBxCardData}
                    // 点击确定按钮的回调函数
                    onSureClick={(retOriginalMsg) => {
                        //关闭对话框
                        this.setState({
                            showBxCard: false
                        })
                    }}
                    onCloseClick={() => {
                        //关闭对话框
                        this.setState({
                            showBxCard: false
                        })
					}}
					savecallback={this.savecallback.bind(this)}
                >
                </BXCard>

				<ZFCard
                    // 作废框显示
                    showmodal={this.state.showZfCard}
                    showZfCardData = {this.state.showZfCardData}
                    // 点击确定按钮的回调函数
                    onSureClick={(retOriginalMsg) => {
                        //关闭对话框
                        this.setState({
                            showZfCard: false
                        })
                    }}
                    onCloseClick={() => {
                        //关闭对话框
                        this.setState({
                            showZfCard: false
                        })
					}}
					savecallback={this.savecallback.bind(this)}
                >
                </ZFCard>

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