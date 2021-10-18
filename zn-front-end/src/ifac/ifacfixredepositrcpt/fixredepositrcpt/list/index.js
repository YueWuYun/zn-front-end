/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表列表
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, toast, base, high, cardCache, getMultiLang, deepClone, cacheTools, createPageIcon } from 'nc-lightapp-front';
import { constant, requesturl, buttonDisable }  from '../config/config';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, buttonVisible, onrowDoubleclick } from './events';
import { setPropCache, saveMultiLangRes, loadMultiLang, createListWebSocket } from "../../../../tmpub/pub/util/index";
let { setDefData, getDefData } = cardCache;
const { NCUploader, PrintOutput } = high;
const { NCDiv } = base;

class List extends Component {
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
		this.state = {
			billId:'', //单据id
			billno: '' , // 单据编号
			showUploader: false, // 附件上传弹框显示
			target: null,
			outputData: '', // 输出数据
			showOriginal:false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData:[], // 联查余额取数据，将需要联查的数据赋值给我
			json: {}, // 多语
			inlt: null
		};
	}

	//操作列多语不显示
	componentWillMount() {
		let callback = (json, status, inlt) => { 
			saveMultiLangRes(this.props,json);
			// json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				//console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}

		// getMultiLang({ moduleId: {'tmpub':['3601'], 'cmp':['36070', '36340RFDR']}, 
		// 	callback: (lang) => {
		// 	//将多语资源数据存储到页面级缓存中
		// 	saveMultiLangRes(this.props, lang);
		// 	//初始化模板
		// 	initTemplate(this.props);
		// }});
		getMultiLang({ 
			moduleId: {
				'tmpub':['3601'],
				// 'ifac':['36340', '36340RFDR']
				'ifac':['36340RFDR']
			}, callback });

	}

	componentDidMount() {
		buttonVisible.call(this, this.props, null);
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
			// appregisterPk: constant.appregisterpk,
			// appcode: constant.appcode,
			queryAreaCode: constant.searchcode, //查询区编码
			oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		setDefData( this.cacheDataSource, constant.searchKey, searchVal);
		return searchdata;
	}
	
	// 查询按钮查询数据
	querydata = (searchVal,pageInfo) =>{

		if(searchVal){
			// 获取查询条件
			let searchArea = this.props.search.getAllSearchData(constant.searchcode);
			// let searchdata = {
			// 	searchArea:this.getsearchdata(searchArea,pageInfo),
			// }

			ajax({
				url: requesturl.query,
				data: this.getsearchdata(searchArea,pageInfo),
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							this.props.table.setAllTableData(constant.ltablecode, data[this.tableId]);
							// let billid;
							// if(data.model.rows[0]){
							// 	billid = data.model.rows[0].values[this.pkname].value;
							// }
							let message = this.state.json['36340RFDR-000046'] + data[this.tableId].allpks.length + this.state.json['36340RFDR-000049'];
							toast({
								content: message,/* 国际化处理： 查询成功！*/
								color: 'success'
							})
							// this.props.button.setButtonDisabled(buttonDisable.querydisable, false);
						} else {
							toast({
								color: 'warning',
								content: this.state.json['36340RFDR-000047']//{/* 国际化处理： 未查询出符合条件的数据！*/}
							});
							this.props.table.setAllTableData(constant.ltablecode, {rows: []});
							// this.props.button.setButtonDisabled(buttonDisable.querydisable, true);
						}
						buttonVisible.call(this, this.props, null);
					}
				}
			});
		}
	}
	
	// 清空选择框
	emptychoicebox = () =>{
		this.props.table.selectAllRows(this.tableId,false);
		buttonVisible.call(this, this.props, null);
	}

	// 刷新页面方法
	refreshHtml = (props) => {
		let search = getDefData(constant.searchKey, this.cacheDataSource);
		let refreshsearchVal = deepClone(search);
		if(!refreshsearchVal){
			refreshsearchVal = this.props.search.getAllSearchData(this.searchId);
		}
		if(refreshsearchVal){
			if(refreshsearchVal.conditions.length != 0){
				let refreshpageInfo = this.props.table.getTablePageInfo(this.tableId);
				refreshpageInfo.pageIndex = 0;
				// this.querydata(refreshsearchVal, refreshpageInfo);

				// 获取查询条件
				// let searchArea = this.props.search.getAllSearchData(constant.searchcode);
				// let searchdata = {
				// 	searchArea:this.getsearchdata(refreshsearchVal, refreshpageInfo),
				// }
				let searchdata = this.getsearchdata(refreshsearchVal, refreshpageInfo);

				ajax({
					url: requesturl.query,
					data: searchdata,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							if (data) {
								this.props.table.setAllTableData(constant.ltablecode, data[this.tableId]);
								// let billid;
								// if(data.model.rows[0]){
								// 	billid = data[this.tableId].rows[0].values[this.pkname].value;
								// }
								toast({
									content: this.state.json['36340RFDR-000048'],/* 国际化处理： 刷新成功！*/
									color: 'success'
								})
								// this.props.button.setButtonDisabled(buttonDisable.querydisable, false);
							} else {
								toast({
									color: 'warning',
									content: this.state.json['36340RFDR-000047']//{/* 国际化处理： 未查询出符合条件的数据！*/}
								});
								this.props.table.setAllTableData(constant.ltablecode, {rows: []});
								// this.props.button.setButtonDisabled(buttonDisable.querydisable, true);
							}
							buttonVisible.call(this, this.props, null);
						}
					}
				});
			}
		}
	}
	
	render() {
		let { table, search, ncmodal, BillHeadInfo } = this.props;
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createModal } = ncmodal;
		let { showUploader, target,billno,billId } = this.state;
		const { createBillHeadInfo } = BillHeadInfo;
		let scene = this.props.getUrlParam("scene");
		return (
			<div className="nc-bill-list">
                {/**创建websocket连接 */}
                {createListWebSocket(this.props, {
                    tableAreaCode: constant.ltablecode,
                    tablePkName: constant.pkname,
                    billtype: constant.billtype
                    // serverLocation: '10.16.2.231:9991'
                })}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
					<div className="header-title-search-area">
						{/* {createPageIcon()}
						<h2 className="title-search-detail">{this.state.json['36340RFDR-000019']}</h2>国际化处理： 账户汇兑损益单 */}
						{createBillHeadInfo(
							{
								title: this.state.json['36340RFDR-000019'],//标题
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

				{<div className="nc-bill-search-area">
					{(scene != 'linksce' && scene != 'fip') ? NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this), // defaultConditionsNum: 2,
						showAdvBtn: true, // 显示高级按钮 //onAfterEvent: onSearchAfterEvent.bind(this), //编辑后事件 //searchBtnName: multiLang && multiLang.get('3630-0029'), // 查询按钮名称，默认查询 // showAdvSearchPlanBtn :false, //高级面板中是否显示保存方案按钮 ;默认显示 // replaceAdvBtnEve:()=>{}, // 业务组替换高级面板 (fun) // replaceAdvBody: this.replaceAdvBody, // 业务组替换高级面板中的body (fun),return Dom // addAdvTabs: this.addAdvTabs, // 添加高级查询区自定义页签 (fun), return Dom // addAdvBody: ()=>{}, // 添加高级查询区自定义查询条件Dom (fun) , return Dom
						// oid: constant.oid, //查询模板的oid，用于查询查询方案
						// renderCompleteEvent:this.renderCompleteEvent
					}) : null}
				</div>}
				
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true,
						dataSource: this.cacheDataSource,
						// pkname: pkname,
						// onSelected: buttonVisible.bind(this, this.props),
						// onSelectedAll: buttonVisible.bind(this, this.props),
						selectedChange: buttonVisible.bind(this, this.props, null),
						onRowDoubleClick: onrowDoubleclick.bind(this), //双击事件
						componentInitFinished:()=>{
							buttonVisible.call(this, this.props, null)
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
							this.setState({
								showUploader: false
							})
						}} // 关闭功能
                        />
					}
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
			</div>
		);
	}
}

List = createPage({
	// initTemplate: initTemplate,
	// mutiLangCode: constant.mutiLangCode
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/