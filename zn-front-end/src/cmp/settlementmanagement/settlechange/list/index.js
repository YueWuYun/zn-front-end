/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表

import React, { Component } from 'react';
import { createPage, ajax, toast, base, high, cardCache, getMultiLang, deepClone, createPageIcon } from 'nc-lightapp-front';
import { constant,requesturl } from '../config/config';
import { commondata } from '../../../public/utils/constant';
import {  SHOWMODEL_BULU } from'../../../public/utils/constant';
import PayBuluForm from'../../../../obm/ebankbulu/bulu/form/index';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, setButtonUsability, onrowDoubleclick } from './events';
import NCCOriginalBalance from'../../../public/restmoney/list/index';
import { BatchToast } from '../../../public/CMPMessage';
import NCTabs from '../../../../tmpub/pub/util/NCTabs/index';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
let {setDefData, getDefData } = cardCache;
// let { NCTabs } = base;
const { NCDiv } = base;
//tm begin lidyu 添加ApprovalTrans 20200320
const { NCUploader, PrintOutput ,ApprovalTrans} = high;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pagecode = constant.lpagecode; 
		this.searchId = constant.searchcode;
		this.tableId = constant.ltablecode;
		this.cacheDataSource = constant.cacheDataSource;
		this.pkname = constant.pk_settlechange;
		this.pk = null;
		this.ts = null;
		this.index = null;
		this.state = {
			tabInfo: '0', // 选中页签的信息
			savetab: 0,
			tobesettletab: 0,
			alltab: 0,
			billId:'', //单据id
			billno: '', // 单据编号
			showUploader: false,
			target: null,
			showBuLu: false, //设置显示补录模态框显隐性
			onLineData: [],
			moduleType: 'CMP',
			modelType: SHOWMODEL_BULU,
			outputData: '',
			showOriginal:false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData:[], // 联查余额取数据，将需要联查的数据赋值给我
			compositedata: null, // 指派数据
			compositedisplay: null, // 指派弹框是否弹框
			json: {}, //多语
			inlt: null
		};
		// initTemplate.call(this, props);
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
	}

	// 将state保存到缓存中
	setCacheState = () =>{
		setDefData('state', this.cacheDataSource, this.state);
	}

	// 获取缓存中state值
	getCacheState = () =>{

		// 获取缓存页签数据
		let savenum = getDefData(this.cacheDataSource, constant.savetab);
		let tobesettlenum = getDefData(this.cacheDataSource, constant.tobesettletab);
		//页签赋值
		this.setState({
			savetab: savenum,
			tobesettletab: tobesettlenum
		});

	}
	
	//页签筛选
	navChangeFun = (status, className, e) => {
		this.setState({
			tabInfo: status
		})
		setDefData(constant.tabInfo, this.cacheDataSource, status);
		this.getData(this.gettabserval(status));
	}

	// 页签添加条件
	gettabserval = (tabkey) =>{
		let serval
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
						firstvalue: '3',
						secondvalue: null
					},
					oprtype: '=',
					display: null
				}
			];
			return serval;
		}else if(tabkey == '2'){
			serval = [
			];
			return serval;
		}
	}


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
	
	refreshHtml = (props) => {
		let refreshsearchVal = props.search.getAllSearchData(constant.searchcode); //查询condition
		let refreshpageInfo = props.table.getTablePageInfo(constant.ltablecode); //分页
		this.querydata(refreshsearchVal,refreshpageInfo);
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
			if(search){
			}else{
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
					let {
						success,
						data
					} = res;
					if (success) {
						if (data) {
							this.props.table.setAllTableData(constant.ltablecode, data.model);
							// 缓存页签数据
							setButtonUsability.call(this, this.props);
							let billid 
							if(data.model.rows[0]){
								billid = data.model.rows[0].values[this.pkname].value;
							}
							//页签赋值
							let savenum = data.tabnum.savenum;
							let tobesettlenum = data.tabnum.tobesettlenum;
							// 缓存页签数据
							setDefData(this.cacheDataSource, constant.savetab, savenum);
							setDefData(this.cacheDataSource, constant.tobesettletab, tobesettlenum);
							//页签赋值
							this.setState({
								savetab: savenum,
								tobesettletab: tobesettlenum
							});
						} else {
							this.props.table.setAllTableData(constant.ltablecode, {
								rows: []
							});
							//页签赋值
							this.setState({
								savetab: 0,
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
					let {
						success,
						data
					} = res;
					if (success) {
						if (data) {
							
							this.props.table.setAllTableData(constant.ltablecode, data.model);
							let savenum = data.tabnum.savenum;
							let tobesettlenum = data.tabnum.tobesettlenum;
							// 缓存页签数据
							setDefData(this.cacheDataSource, constant.savetab, savenum);
							setDefData(this.cacheDataSource, constant.tobesettletab, tobesettlenum);
							setButtonUsability.call(this, this.props);
							//页签赋值
							this.setState({
								savetab: savenum,
								tobesettletab: tobesettlenum
							});
							if(data.tabnum.allnum > 0){
								toast({
									color: 'success'
								});
							}else{
								toast({
									color: 'warning',
									content: this.state.json['36070CPI-000026']/* 国际化处理： 请选择数据*/
								});
							}
							
						} else {
							toast({
								color: 'warning',
								content: this.state.json['36070CPI-000026']/* 国际化处理： 请选择数据*/
							});
							this.props.table.setAllTableData(constant.ltablecode, {
								rows: []
							});
							//页签赋值
							this.setState({
								savetab: 0,
								tobesettletab: 0,
								alltab: 0
							});
						}
					}
	
				}
			});
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
				content: this.state.json['36070CPI-000016']/* 国际化处理： 请选择数据*/
			});
			return;
		}
		
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		//处理选择数据
		selectdata.forEach((val) => {
			let pk = val.data.values.pk_settlechange.value;
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

	// 保存网银补录数据
	// processRetMsg = async (retPayMsg) => {        
	// 	let selectedData = this.props.table.getCheckedRows(this.tableId);        
	// 	let pks = [];         //let tss = [];
	// 	        
	// 	if (!selectedData || selectedData.length == 0) {            
	// 		toast({
	// 			color: 'warning',
	// 			content: this.state.json['36070CPI-000019')/* 国际化处理： 请选择一条数据*/
	// 		});            
	// 		return;        
	// 	}
	// 	//处理选择数据 
	// 	let signdata = await Sign({
	// 		isSign: false,
	// 		isKey: true,
	// 		data: null,
	// 		encryptVOClassName: null
	// 	});
	// 	if (signdata.isStop) {
	// 		return;
	// 	}
	// 	//处理选择数据
	// 	let val = selectedData[0];
	// 	let pk = val.data.values.pk_settlechange.value;
	// 	let ts = val.data.values.ts.value;
	// 	pks.push(pk);//主键数组
	// 	let pkMapTs = {};        
	// 	pkMapTs[pk] = ts;        
	// 	let data = {            
	// 		pktsmap: pkMapTs,
	// 		pks: pks,
	// 		payRetMsg: retPayMsg,
	// 		pageCode: this.pageId      
	// 	}

	// 	if(this.state.modelType === SHOWMODEL_ZHIFU){
	// 		ajax({
	// 			url: requesturl.pay,
	// 			data: data,
	// 			success: (res) => {                
	// 				let {
	// 					data,
	// 					success
	// 				} = res;                
	// 				if (success) {                    
	// 					if (data) {
	// 						//this.props.table.setAllTableData(this.tableId, data);
	// 						}                
	// 				}            
	// 			}        
	// 		}); 
	// 	}

	// 	let val = selectedData[0];        
	// 	let pk = val.data.values.pk_settlechange.value;        
	// 	let ts = val.data.values.ts.value;        
	// 	pks.push(pk); 
	// 	//主键数组
	// 	//tss.push(ts); 
	// 	        
	// 	let pkMapTs = {};        
	// 	pkMapTs[pk] = ts;        
	// 	let data = {            
	// 		pktsmap: pkMapTs,
	// 		pks: pks,
	// 		results: retPayMsg,
	// 		pageCode: this.pageId        
	// 	}        
	// }


	// 查询区渲染完成回调函数
    renderCompleteEvent = () => {
		// 获取缓存中页签的值
		let tabkey = getDefData(constant.tabInfo, this.cacheDataSource);
		if(tabkey){
			this.setState({
				tabInfo: tabkey
			})
		}
        // let cachesearch = getDefData( this.cacheDataSource, constant.searchKey);
        // if (cachesearch && cachesearch.conditions) {
        //   // this.props.search.setSearchValue(this.searchId, cachesearch);
        //   for(let item of cachesearch.conditions){
        //     if (item.field == 'billdate') {
        //        // 时间类型特殊处理
        //        let time = [];
        //        time.push(item.value.firstvalue);
        //        time.push(item.value.secondvalue);
        //        this.props.search.setSearchValByField(this.searchId,item.field,
        //                 {display:item.display,value:time});
        //     }else{
        //         this.props.search.setSearchValByField(this.searchId,item.field,
        //         {display:item.display,value:item.value.firstvalue});
        //      }
        //   }
        // }
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
					let pk = val.data.values.pk_settlechange.value;
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
		let { table, search, modal, BillHeadInfo } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { showUploader, target,billno,billId } = this.state;
		const { NCTabPane } = NCTabs;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				{/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: this.state.json['36070CPI-000013'],
								// loadMultiLang(this.props, '36070CPI-000013'),//国际化处理： 单位支付信息变更
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							// popContainer: document.querySelector('.header-button-··area')
						})}
					</div>
					{/* 网银补录div */}
					<PayBuluForm showmodal={this.state.showBuLu} modal={modal} 
					//输入参数： 
						onLineData={this.state.onLineData} 
						modelType={this.state.modelType}
						moduleType={this.state.moduleType}
						//点击确定按钮的回调函数
						onSureClick={(retPayMsg)=>{ 
						//处理补录信息(输出参数：PaymentRetMsg[])
						// this.processRetMsg(retPayMsg);
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
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this), // 查询方法绑定
						showAdvBtn: true, // 高级查询：显示-true 隐藏-false
						// oid: constant.oid, // 查询模板id
						renderCompleteEvent: this.renderCompleteEvent // 缓存查询区数据
					})}
				</div>
				<div className="tab-definInfo-area">
					<NCTabs activeKey={this.state.tabInfo} onChange={(v) => {this.navChangeFun.call(this, v);}}>
                        <NCTabPane key={'0'} tab={
							<span>{this.state.json['36070CPI-000021']+ '('}
								<span>{this.state.savetab || 0}</span>
								{')'}
							</span>
                            // 保存
							// this.state.json['36070CPI-000021']+ '(' +  (this.state.savetab || 0)+ ')'
                        } />
                        <NCTabPane key={'1'} tab={
							<span>{this.state.json['36070CPI-000022']+ '('}
								<span>{this.state.tobesettletab || 0}</span>
								{')'}
							</span>
                            // 待结算
							// this.state.json['36070CPI-000022']+ '(' +  (this.state.tobesettletab || 0)+ ')'
                        } />                        
                        <NCTabPane key={'2'} tab={
                            // 全部
                            this.state.json['36070CPI-000023']
                        } />
                    </NCTabs>
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						dataSource: this.cacheDataSource,
						showCheck: true,
						showIndex: true,
						pkname: 'pk_settlechange',
						onSelected: setButtonUsability.bind(this, this.props),
						onSelectedAll: setButtonUsability.bind(this, this.props),
						onRowDoubleClick: onrowDoubleclick.bind(this),
						componentInitFinished: () => {
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
							//begin tm lidyu  20200326 表格数据加载完毕 处理按钮可用性
							setButtonUsability.call(this, this.props)
							//end lidyu
						} //双击事件
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

				{this.state.compositedisplay ? <ApprovalTrans
                    title={this.state.json['36070CPI-000027']}
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
	// mutiLangCode: constant.mutiLangCode
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/