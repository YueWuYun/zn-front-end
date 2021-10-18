/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, toast, base, high, cardCache, getMultiLang, deepClone, cacheTools, createPageIcon } from 'nc-lightapp-front';
import { constant, requesturl, buttonDisabled }  from '../config/config';
import { buttonClick, initTemplate, pageInfoClick, setButtonUsability, afterEvent } from './events';
import { commondata } from '../../../public/utils/constant';
import { saveMultiLangRes } from "../../../../tmpub/pub/util/index";
const { NCModal, NCDiv, NCAffix } = base;
let {setDefData, getDefData } = cardCache;

class List extends Component {
	// 构造器
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pagecode = constant.lpagecode;
		this.searchId = constant.searchcode;
		this.tableId = constant.ltablecode;
		this.tableId2 = constant.ltablecode2;
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
 
	closeQueryForm() {
		this.setState({ showModalQueryForm: false });
	}
	
	openQueryForm() {
		this.setState({ showModalQueryForm: true });
	}

	//操作列多语不显示
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
		//this.getData();
		this.getCacheState();
		setButtonUsability.call(this, this.props);
		// this.linkbill();
	}

	// 获取缓存中state值
	getCacheState = () =>{

	}

	// 初始化损益记录查询框
	initHistoryRecordForm = () => {
		let orgCache = getDefData(constant.orgCacheKey, this.cacheDataSource);
		this.props.form.setFormItemsValue(this.formid, { pkOrg: { value: orgCache.pkOrg, display: orgCache.pkOrgDisplay }});
		
		let data={
			pkOrg: orgCache.pkOrg,
			pageCode: constant.cpagecode
		};
		ajax({
			url: requesturl.defaultquery,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					let meta = this.props.meta.getMeta();

					// 年份
					let yearArr = data.head[this.tableId2].rows[0].values.yearArr.value;
					let yearArrItem = meta[this.formid].items.find(e => e.attrcode === 'year');
					yearArrItem.options = [];
					for (let item of yearArr) {
						yearArrItem.options.push({
							display: item,
							value: item
						});
					}

					// 期间
					let periodArr = data.head[this.tableId2].rows[0].values.periodArr.value;
					let periodArrItem = meta[this.formid].items.find(e => e.attrcode === 'period');
					periodArrItem.options = [];
					for (let itemperiod of periodArr) {
						periodArrItem.options.push({
							display: itemperiod,
							value: itemperiod
						});
					}

					// 币种
					let bzArr = data.body[this.tableId2].rows;
					let bzItem = meta[this.formid].items.find(e => e.attrcode === 'bz');
					bzItem.options = [{display:'全部', value:null}];
					for (let bzVal of bzArr) {
						bzItem.options.push({
							display: bzVal.values.bzName.value,
							value: bzVal.values.bzPk.value
						});
					}
					
					this.props.meta.setMeta(meta);

					let selectedYear = data.head[this.tableId2].rows[0].values.selectedYear.value;// 年份默认值
					let selectedPeriod = data.head[this.tableId2].rows[0].values.selectedPeriod.value;// 期间默认值
					this.props.form.setFormItemsValue(this.formid, { year:   { value: selectedYear, display: selectedYear } });
					this.props.form.setFormItemsValue(this.formid, { period: { value: selectedPeriod, display: selectedPeriod } });
					this.props.form.setFormItemsValue(this.formid, { bz: { value: null, display : '全部' } });
				}
			}
		});
	}

	// 查询损益记录
	queryHisRecord = (props) => {
		let pkOrg,pkUser,pkCurrtype,billNoBeg,billNoEnd,year,month;
		if(this.props.form.getFormItemsValue(this.formid,"pkOrg")){
			pkOrg = this.props.form.getFormItemsValue(this.formid,"pkOrg").value
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
			pkOrg: pkOrg,
			pkUser: pkUser,
			pkCurrtype: pkCurrtype,
			billNoBeg: billNoBeg,
			billNoEnd: billNoEnd,
			year: year,
			month: month
		})
		let data={
			pageCode: constant.cpagecode,
			pkOrg: pkOrg,
			pkUser: pkUser,
			pkCurrtype: pkCurrtype,
			billNoBeg: billNoBeg,
			billNoEnd: billNoEnd,
			year: year,
			month: month	
		};

		// 放入缓存，为了取消损益之后，重新查询损益记录，刷新页面
		setDefData(constant.queryCacheKey, this.cacheDataSource, data);

		ajax({
			url: requesturl.queryHisRecord,
			data: data,
			success: (res) => {
				let { success, data } = res;
				this.closeQueryForm();
				if (success && data != null) {
					// toast({ color: 'success' });
					this.props.table.setAllTableData(this.tableId2, data[constant.ltablecode2]);
					if(data[constant.ltablecode2].rows.length > 0){
						this.props.button.setButtonDisabled(buttonDisabled.allBtn, false);
						this.props.button.setButtonDisabled(buttonDisabled.queryHaveRecordDisable, true);
					} else {
						this.props.button.setButtonDisabled(buttonDisabled.allBtn, false);
						this.props.button.setButtonDisabled(buttonDisabled.queryNoRecordDisable, true);
					}
					let message = this.state.json['36070AA-000067'] + data[constant.ltablecode2].rows.length + this.state.json['36070AA-000068'];
					toast({
						content: message,/* 国际化处理： 查询成功！*/
						color: 'success'
					})
				} else {
					this.props.table.setAllTableData(this.tableId2, {rows:[]});
					this.props.button.setButtonDisabled(buttonDisabled.allBtn, false);
					this.props.button.setButtonDisabled(buttonDisabled.queryNoRecordDisable, true);
				}
			}
		});
	}

	// 取消损益之后，重新查询损益记录，刷新列表
	reQueryHisRecord = () => {
		let queryCacheKey = getDefData(constant.queryCacheKey, this.cacheDataSource);

		ajax({
			url: requesturl.queryHisRecord,
			data: queryCacheKey,
			success: (res) => {
				let { success, data } = res;
				this.closeQueryForm();
				if (success && data != null) {
					this.props.table.setAllTableData(this.tableId2, data[constant.ltablecode2]);
					if(data[constant.ltablecode2].rows.length > 0){
						this.props.button.setButtonDisabled(buttonDisabled.queryHaveRecordDisable, true);
					} else {
						this.props.button.setButtonDisabled(buttonDisabled.queryNoRecordDisable, true);
					}
				} else {
					this.props.table.setAllTableData(this.tableId2, {rows:[]});
					this.props.button.setButtonDisabled(buttonDisabled.queryNoRecordDisable, true);
				}
			}
		});
	}

	// 取消损益
	cancelCalculate = (props) => {
		let selectedData = props.table.getCheckedRows(constant.ltablecode2);
		let bodyArr = [];
		for(let i=0; i<selectedData.length; i++){
			let body = {
				pk_accountagiotage:'',
				yearMonth:'',
				userName:'',
				currName:'',
				billNo:'',
				amount:''
			}
			body.pk_accountagiotage = selectedData[i].data.values.pk_accountagiotage.value == null ? null : selectedData[i].data.values.pk_accountagiotage.value;
			body.yearMonth = selectedData[i].data.values.yearMonth.value == null ? null : selectedData[i].data.values.yearMonth.value;
			body.userName = selectedData[i].data.values.userName.value == null ? null : selectedData[i].data.values.userName.value;
			body.currName = selectedData[i].data.values.currName.value == null ? null : selectedData[i].data.values.currName.value;
			body.billNo = selectedData[i].data.values.billNo.value == null ? null : selectedData[i].data.values.billNo.value;
			body.amount = selectedData[i].data.values.amount.value == null ? null : selectedData[i].data.values.amount.value;
			bodyArr.push(body);
		}
		ajax({
			url: requesturl.cancelCalculate,
			data: bodyArr,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					toast({ color: 'success' });
					this.reQueryHisRecord();
				}
			}
		});
	}
	
	render() {
		let { table, search, ncmodal, form, button, BillHeadInfo } = this.props;
		let { createSimpleTable } = this.props.table;
		let { NCCreateSearch } = search;
		let { createModal } = ncmodal;
		let { createForm } = form;
		let { target, billno, billId } = this.state;
		let { createButtonApp } = button;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
					<div className="header-title-search-area">
						{/* {createPageIcon()}
						<h2 className="title-search-detail">{this.state.json['36070AA-000019']}</h2>国际化处理： 账户汇兑损益计算 */}
						{createBillHeadInfo(
							{
								title: this.state.json['36070AA-000019'],//标题
								// backBtnClick: false
								initShowBackBtn: false
							}
                        )}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'card_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
						})}
					</div>
				</NCDiv>
				</NCAffix>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId2, {
						handlePageInfoChange: pageInfoClick.bind(this),
						showCheck: true,
						showIndex: false,
						dataSource: this.cacheDataSource,
						componentInitFinished:()=>{
							// let alldata = this.props.table.getAllTableData(this.tableId2);
							// let sumamount;
							// alldata.forEach((val)=>{
							// 	sumamount = val.data.values.amount.value;
							// });
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
						<NCModal.Title>{this.state.json['36070AA-000065']}{/* 国际化处理： 取消损益过滤条件*/}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div>
							{createForm(this.formid, { onAfterEvent: afterEvent.bind(this) })}
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