/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, toast, base, high, cardCache, getMultiLang, deepClone, cacheTools, createPageIcon } from 'nc-lightapp-front';
import { constant, requesturl, buttonDisabled }  from '../config/config';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, setButtonUsability, onSelected, afterEvent } from './events';
import { commondata } from '../../../public/utils/constant';
import { saveMultiLangRes } from "../../../../tmpub/pub/util/index";
const { NCModal, NCDiv } = base;
let { setDefData, getDefData } = cardCache;

class List extends Component {
	// 构造器
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pagecode = constant.lpagecode;
		this.cpagecode = constant.cpagecode;
		this.searchId = constant.searchcode;
		this.tableId = constant.ltablecode;
		this.formid = constant.formcode;
		this.cacheDataSource = constant.cacheDataSource;
		this.pkname = constant.pkname;
		this.pk = null;
		this.ts = null;
		this.index = null;
		this.state = {
			billId:'', //单据id
			billno: '' , // 单据编号
			addid: '',
			target: null,
			json: {}, // 多语
			inlt: null,
			showModalQueryForm: false
		};
		this.close = this.closeQueryForm.bind(this);
	}

	// 关闭损益记录查询框
	closeQueryForm() {
		this.setState({ showModalQueryForm: false });
	}
	
	// 打开损益记录查询框
	openQueryForm() {
		this.setState({ showModalQueryForm: true });
	}

	// 操作列多语不显示
	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
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
				'tmpub':['3601'],
				'cmp':['36070', '36070AA']
			}, 
		callback });
	}

	componentDidMount() {
		setButtonUsability.call(this, this.props);
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
		setDefData( this.cacheDataSource, constant.searchKey, searchVal);
		return searchdata;
	}
	
	// 查询按钮查询数据
	querydata = (searchVal,pageInfo) =>{

		if(searchVal){
			// 获取查询条件
			let searchArea = this.props.search.getAllSearchData(constant.searchcode);
			let searchdata = {
				searchArea:this.getsearchdata(searchArea,pageInfo),
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
								billid = data.model.rows[0].values[this.pkname].value;
							}
							setButtonUsability.call(this, this.props);
						} else {
							toast({
								color: 'warning',
								content: this.state.json['36070AA-000047']//{/* 国际化处理：未查询出符合条件的数据！*/}
							});
							this.props.table.setAllTableData(constant.ltablecode, {rows: []});
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

	// 查询区渲染完成回调函数
    renderCompleteEvent = () => {

    }
	
	refreshHtml = (props) => {// 刷新页面方法
		let search = getDefData(constant.searchKey, this.cacheDataSource);
		let refreshsearchVal = deepClone(search);
		if(!refreshsearchVal){
			refreshsearchVal = this.props.search.getAllSearchData(this.searchId);
		}
		if(refreshsearchVal){
			if(refreshsearchVal.conditions.length != 0){
				let refreshpageInfo = this.props.table.getTablePageInfo(this.tableId);
				refreshpageInfo.pageIndex = 0;
				this.querydata(refreshsearchVal, refreshpageInfo);
			}
		}
	}

	onCalculation = (props) => {// 计算损益
		let pkOrg;
		let year;
		let month;
		let selectedData = this.props.editTable.getCheckedRows(this.tableId);
		if(this.props.search.getSearchValByField(this.searchId,"pkOrg")){
			pkOrg = this.props.search.getSearchValByField(this.searchId,"pkOrg").value.firstvalue
		}
		if(this.props.search.getSearchValByField(this.searchId,"yearArr")){
			year = this.props.search.getSearchValByField(this.searchId,"yearArr").value.firstvalue
		}
		if(this.props.search.getSearchValByField(this.searchId,"periodArr")){
			month = this.props.search.getSearchValByField(this.searchId,"periodArr").value.firstvalue
		}
		if(pkOrg == null || pkOrg == ""){
			toast({
				color: 'warning',
				content: this.state.json['36070AA-000030']//{/* 国际化处理：请选择财务组织*/}
			});
			return;
		}
		if(year == null || year == ""){
			toast({
				color: 'warning',
				content: this.state.json['36070AA-000069']//{/* 国际化处理：请选择年度！*/}
			});
			return;
		}
		if(month == null || month == ""){
			toast({
				color: 'warning',
				content: this.state.json['36070AA-000070']//{/* 国际化处理：请选择期间！*/}
			});
			return;
		}
		this.setState({
			pageCode: this.pagecode,
			pkOrg: pkOrg,
			year: year,
			month: month
		})
		let bodyArr = [];
		let body = {
			bzPk:'',
			bzName:'',
			lastCalQj:'',
			cashAccount:[],
			bankAccount:[]
		}
		for(let i=0; i<selectedData.length; i++){
			body.bzPk = selectedData[i].data.values.bzPk.value;
			body.bzName = selectedData[i].data.values.bzName.value;
			body.lastCalQj = selectedData[i].data.values.lastCalQj.value;
			if(selectedData[i].data.values.cashAccount.value == null || selectedData[i].data.values.cashAccount.value.length <= 0){
				body.cashAccount = null;
			} else {
				body.cashAccount = selectedData[i].data.values.cashAccount.value.split(',');
			}
			if(selectedData[i].data.values.bankAccount.value == null || selectedData[i].data.values.bankAccount.value.length <= 0){
				body.bankAccount = null;
			} else {
				body.bankAccount = selectedData[i].data.values.bankAccount.value.split(',');
			}
			if(body.cashAccount == null && body.bankAccount == null){
				toast({
					color: 'warning',
					content: this.state.json['36070AA-000066']//{/* 国际化处理：请选择账户！*/}
				});
				return;
			}
			bodyArr[i] = body;
		}
		let data={
			pageCode: this.pagecode,
			pkOrg: pkOrg,
			year: year,
			month: month,
			bodyArr: bodyArr
		};
		ajax({
			url: requesturl.oncalculation,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.onCalculationAfterEvent();
				}
			}
		});
	}

	initHistoryRecordForm = () => {// 初始化损益记录查询框
		let pkOrg,pkOrgDisplay;
		if(this.props.search.getSearchValByField(this.searchId,"pkOrg")){
			pkOrg = this.props.search.getSearchValByField(this.searchId, "pkOrg").value.firstvalue
			pkOrgDisplay = this.props.search.getSearchValByField(this.searchId, "pkOrg").display;
		}
		this.props.form.setFormItemsValue(this.formid, { pkOrg: { value: pkOrg, display: pkOrgDisplay }});
		
		let data={
			pkOrg: pkOrg,
			pageCode: constant.lpagecode
		};
		ajax({
			url: requesturl.defaultquery,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					let meta = this.props.meta.getMeta();

					if(data.head != null){
						// 年份
						let yearArr = data.head[this.tableId].rows[0].values.yearArr.value;
						let yearArrItem = meta[this.formid].items.find(e => e.attrcode === 'year');
						yearArrItem.options = [];
							for (let item of yearArr) {
							yearArrItem.options.push({
								display: item,
								value: item
							});
						}

						// 期间
						let periodArr = data.head[this.tableId].rows[0].values.periodArr.value;
						let periodArrItem = meta[this.formid].items.find(e => e.attrcode === 'period');
						periodArrItem.options = [];
							for (let itemperiod of periodArr) {
							periodArrItem.options.push({
								display: itemperiod,
								value: itemperiod
							});
						}
					}

					// 币种
					if(data.body != null){
						let bzArr = data.body[this.tableId].rows;
						let bzItem = meta[this.formid].items.find(e => e.attrcode === 'bz');
						bzItem.options = [{display:this.state.json['36070AA-000071'], value:null}];
						for (let bzVal of bzArr) {
							bzItem.options.push({
								display: bzVal.values.bzName.value,
								value: bzVal.values.bzPk.value
							});
						}
					}
					
					this.props.meta.setMeta(meta);

					if(data.head != null){
						let selectedYear = data.head[this.tableId].rows[0].values.selectedYear.value;// 年份默认值
						let selectedPeriod = data.head[this.tableId].rows[0].values.selectedPeriod.value;// 期间默认值
						this.props.form.setFormItemsValue(this.formid, { year:   { value: selectedYear, display: selectedYear } });
						this.props.form.setFormItemsValue(this.formid, { period: { value: selectedPeriod, display: selectedPeriod } });
					}
					this.props.form.setFormItemsValue(this.formid, { bz: { value: null, display : this.state.json['36070AA-000071'] } });
				}
			}
		});
	}

	queryHisRecord = (props) => {// 查询损益记录
		let pkOrg,pkUser,pkCurrtype,billNoBeg,billNoEnd,year,month;
		if(this.props.form.getFormItemsValue(this.formid,"pkOrg")){
			pkOrg = this.props.form.getFormItemsValue(this.formid,"pkOrg").value
		} 
		if(pkOrg.length <= 0){
			toast({
				color: 'warning',
				content: this.state.json['36070AA-000030']//{/* 国际化处理：请选择组织！*/}
			});
			return;
		}
		if(this.props.form.getFormItemsValue(this.formid,"user")){
			pkUser = this.props.form.getFormItemsValue(this.formid,"user").value
		}
		if(this.props.form.getFormItemsValue(this.formid,"bz")){
			pkCurrtype = this.props.form.getFormItemsValue(this.formid,"bz").value
		}
		if(this.props.form.getFormItemsValue(this.formid,"billNoBeg")){
			billNoBeg = this.props.form.getFormItemsValue(this.formid,"billNoBeg").value
		}
		if(this.props.form.getFormItemsValue(this.formid,"billNoEnd")){
			billNoEnd = this.props.form.getFormItemsValue(this.formid,"billNoEnd").value
		}
		if(this.props.form.getFormItemsValue(this.formid,"year")){
			year = this.props.form.getFormItemsValue(this.formid,"year").value
		}
		if(this.props.form.getFormItemsValue(this.formid,"period")){
			month = this.props.form.getFormItemsValue(this.formid,"period").value
		}
		this.setState({
			pageCode: this.cpagecode,
			pkOrg: pkOrg,
			pkUser: pkUser,
			pkCurrtype: pkCurrtype,
			billNoBeg: billNoBeg,
			billNoEnd: billNoEnd,
			year: year,
			month: month
		})
		let data={
			pageCode: this.cpagecode,
			pkOrg: pkOrg,
			pkUser: pkUser,
			pkCurrtype: pkCurrtype,
			billNoBeg: billNoBeg,
			billNoEnd: billNoEnd,
			year: year,
			month: month	
		};

		this.closeQueryForm();
		
		setDefData(constant.queryCacheKey, this.cacheDataSource, data);

		// 缓存财务组织，为了表格2的损益记录查询用
		if(this.props.search.getSearchValByField(this.searchId, "pkOrg")){
			let cacheOrg = {
				pkOrg: this.props.search.getSearchValByField(this.searchId, "pkOrg").value.firstvalue,
				pkOrgDisplay : this.props.search.getSearchValByField(this.searchId, "pkOrg").display
			}
			setDefData(constant.orgCacheKey, this.cacheDataSource, cacheOrg);
		}

		this.props.pushTo(constant.cardpath, {
			status: 'browse',
			appcode: this.moduleId,
			pagecode: this.cpagecode
		});
	}

	cancelCalculate = (props) => {// 取消损益
		let pkOrg,year,month;
		if(this.props.search.getSearchValByField(this.searchId,"pkOrg")){
			pkOrg = this.props.search.getSearchValByField(this.searchId,"pkOrg").value.firstvalue
		}
		if(this.props.search.getSearchValByField(this.searchId,"year")){
			year = this.props.search.getSearchValByField(this.searchId,"year").value.firstvalue
		}
		if(this.props.search.getSearchValByField(this.searchId,"month")){
			month = this.props.search.getSearchValByField(this.searchId,"month").value.firstvalue
		}
		this.setState({
			pkOrg: pkOrg,
			year: year,
			month: month
		})
		let data={
			pageCode: constant.lpagecode,
			pkOrg: pkOrg,
			year: year,
			month: month
		};

		ajax({
			url: requesturl.cancelCalculate,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if(data){
						toast({ color: 'success' });
					}else{
						/* 国际化处理：未查询出符合条件的数据! */
						// toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300WDM") 
						// 	&& this.props.MutiInit.getIntl("36300WDM").get('36300WDM--000027') });
						// this.props.table.setAllTableData(this.tableId, {rows:[]});
					}
					setButtonUsability.call(this,this.props);
				}
			}
		});
	}

	onCalculationAfterEvent() {// 计算损益之后，重新查询
		let pkOrg;
		if(this.props.search.getSearchValByField(this.searchId,"pkOrg")){
			pkOrg = this.props.search.getSearchValByField(this.searchId,"pkOrg").value.firstvalue
		}
		this.setState({
			pkOrg: pkOrg
		})
		let data={
			pkOrg: pkOrg,
			pageCode: constant.lpagecode
		};

		ajax({
			url: requesturl.defaultquery,
			data: data,
			success: (res) => {
				let aa = res;
				let { success, data } = res;
				if (success) {
					if(data.head != null){
						toast({ color: 'success' });
						// 设置查询区
						// 年份
						let meta = this.props.meta.getMeta();

						let yearArr = data.head[this.tableId].rows[0].values.yearArr.value;// 年份
						let yearArrItem = meta[this.searchId].items.find(e => e.attrcode === 'yearArr');
						yearArrItem.options = [];
						for (let item of yearArr) {
							yearArrItem.options.push({
								display: item,
								value: item
							});
						}

						// 期间
						let periodArr = data.head[this.tableId].rows[0].values.periodArr.value;// 期间
						let periodArrItem = meta[this.searchId].items.find(e => e.attrcode === 'periodArr');
						periodArrItem.options = [];
						for (let itemperiod of periodArr) {
							periodArrItem.options.push({
								display: itemperiod,
								value: itemperiod
							});
						}
						
						this.props.meta.setMeta(meta);

						let selectedYear = data.head[this.tableId].rows[0].values.selectedYear.value;// 年份默认值
						let selectedPeriod = data.head[this.tableId].rows[0].values.selectedPeriod.value;// 期间默认值
						this.props.search.setSearchValByField(this.searchId, 'yearArr',{ display: selectedYear, value: selectedYear });
						this.props.search.setSearchValByField(this.searchId, 'periodArr',{ display: selectedPeriod, value: selectedPeriod });
					}

					if(data.body != null){
						// 设置表格区
						this.props.editTable.setTableData(this.tableId, data.body[this.tableId], true);
						this.props.button.setButtonDisabled(buttonDisabled.allBtn, false);
						this.props.button.setButtonDisabled(buttonDisabled.orgChangedisable, true);
					} else {
						this.props.editTable.setTableData(this.tableId, {rows:[]}, true);
					}

					// 设置表格
					this.props.editTable.setStatus(constant.ltablecode, 'browse', null);
					let alldata = this.props.editTable.getAllRows(this.tableId);
					if(alldata.length > 0){
						alldata.forEach((val,index)=>{
							this.props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'bzName', false);
							this.props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'lastCalQj', false);
							this.props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'bankAccount', false);
							this.props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'cashAccount', false);

							this.props.editTable.setValByKeyAndIndex(this.tableId, index, 'bankAccount', {value:'',display:'',scale:0,isEdit:false});
							this.props.editTable.setValByKeyAndIndex(this.tableId, index, 'cashAccount', {value:'',display:'',scale:0,isEdit:false});
						});
					}
				}
			}
		});
	};

	searchOnAfterEvent (field) {// 查询编辑后事件
		// 缓存财务组织，为了表格2的损益记录查询用
		let cacheOrg = getDefData(constant.orgCacheKey, this.cacheDataSource);
		let pkOrg;
		if(field == "pkOrg"){
			if(this.props.search.getSearchValByField(this.searchId,"pkOrg")){
				pkOrg = this.props.search.getSearchValByField(this.searchId,"pkOrg").value.firstvalue
			}
		} else if (cacheOrg != null && field == null){
			pkOrg = cacheOrg.pkOrg;
			this.props.search.setSearchValByField(this.searchId, 'pkOrg',{ display: cacheOrg.pkOrgDisplay, value: cacheOrg.pkOrg });
		} else {
			return;
		}
		
		this.setState({
			pkOrg: pkOrg
		})
		let data={
			pkOrg: pkOrg,
			pageCode: constant.lpagecode
		};

		ajax({
			url: requesturl.defaultquery,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if(data.head != null){
						// toast({ color: 'success' });
						
						// 设置查询区
						// 年份
						let meta = this.props.meta.getMeta();

						let yearArr = data.head[this.tableId].rows[0].values.yearArr.value;// 年份
						let yearArrItem = meta[this.searchId].items.find(e => e.attrcode === 'yearArr');
						yearArrItem.options = [];
						for (let item of yearArr) {
							yearArrItem.options.push({
								display: item,
								value: item
							});
						}

						// 期间
						let periodArr = data.head[this.tableId].rows[0].values.periodArr.value;// 期间
						let periodArrItem = meta[this.searchId].items.find(e => e.attrcode === 'periodArr');
						periodArrItem.options = [];
						for (let itemperiod of periodArr) {
							periodArrItem.options.push({
								display: itemperiod,
								value: itemperiod
							});
						}
						
						this.props.meta.setMeta(meta);

						let selectedYear = data.head[this.tableId].rows[0].values.selectedYear.value;// 年份默认值
						let selectedPeriod = data.head[this.tableId].rows[0].values.selectedPeriod.value;// 期间默认值
						this.props.search.setSearchValByField(this.searchId, 'yearArr',{ display: selectedYear, value: selectedYear });
						this.props.search.setSearchValByField(this.searchId, 'periodArr',{ display: selectedPeriod, value: selectedPeriod });
					}

					if(data.body != null){
						// 设置表格区
						this.props.editTable.setTableData(this.tableId, data.body[this.tableId], true);
						this.props.button.setButtonDisabled(buttonDisabled.allBtn, false);
						this.props.button.setButtonDisabled(buttonDisabled.orgChangedisable, true);
						let message = this.state.json['36070AA-000067'] + data.body[this.tableId].rows.length + this.state.json['36070AA-000068'];
						toast({
							content: message,/* 国际化处理： 查询成功！*/
							color: 'success'
						})
					} else {
						this.props.editTable.setTableData(this.tableId, {rows:[]}, true);
						this.props.button.setButtonDisabled(buttonDisabled.allBtn, true);
					}
				}
			}
		});
	};
	
	render() {
		let { table, search, ncmodal, form, button, BillHeadInfo } = this.props;
		let { createEditTable } = this.props.editTable;
		let { NCCreateSearch } = search;
		let { createModal } = ncmodal;
		let { createForm } = form;
		const { createBillHeadInfo } = BillHeadInfo;
		let { target,billno,billId } = this.state;
		let { createButtonApp } = button;
		return (
			<div className="nc-bill-list">
				
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
					<div className="header-title-search-area">
						{/* {createPageIcon()}
						<h2 className="title-search-detail">{this.state.json['36070AA-000019']}</h2>国际化处理： 账户汇兑损益计算 */}
						{createBillHeadInfo(
                                {
                                    title: this.state.json['36070AA-000019'],//{/* 国际化处理： 账户汇兑损益计算*/}
                                    initShowBackBtn: false
                                }
                            )}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
						})}
					</div>
				</NCDiv>
				
				<div className="nc-bill-search-area" style={{ marginTop: '0px'}}>
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						//默认显示几个查询条件
						defaultConditionsNum: 3,
						// 显示高级按钮
						showAdvBtn: false,
						// 编辑后事件
						onAfterEvent: this.searchOnAfterEvent.bind(this),
						// 隐藏查询按钮区域  
						hideBtnArea: true,
					})}
				</div>
				
				<div className="nc-bill-table-area">
					{createEditTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						// tableModelConfirm: tableModelConfirm,// 弹窗确认事件回调
						showCheck: true,
						showIndex: false,
						dataSource: this.cacheDataSource,
						// pkname: pkname,
						// onSelected: onSelected.bind(this, this.props),
						selectedChange: onSelected.bind(this, this.props),
						adaptionHeight: true,
						// onRowDoubleClick: onrowDoubleclick.bind(this), //双击事件
						componentInitFinished:()=>{
							// 缓存数据赋值成功的钩子函数
							// 若初始化数据后需要对数据做修改，可以在这里处理
						}
						
					})}
				</div>

				{/* 损益记录 */}
				<NCModal
				    fieldid= "recordquery"
					show={this.state.showModalQueryForm}
					onHide = {this.close}  
					className="showModal-capital"
					style={{ backgroundColor: 'white' }}
					>
					
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{this.state.json['36070AA-000065']}{/* 国际化处理：取消损益过滤条件*/}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div>
							{createForm(this.formid, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'queryForm',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							modalRelation:'showModal-capital'
						})}
					</NCModal.Footer>

				</NCModal>
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

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/