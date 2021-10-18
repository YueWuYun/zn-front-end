/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
﻿
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, getMultiLang, toast, createPageIcon,cardCache, cacheTools ,viewModel} from 'nc-lightapp-front';
const { NCTabs, NCModal, NCRadio, NCDiv} = base;
const NCTabPane = NCTabs.NCTabPane;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, afterEvent, buttonVisible } from './events';
import * as CONSTANTS from './constants';
import '../css/index.less';
let { tableId, searchId, pagecode, moduleId, oid, formId_01, formId_02, MODULE_ID ,DATA_SOURCE,CACHE_KEY} = CONSTANTS;
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;

class SettlementCenterList extends Component {
	constructor(props) {
		super(props);
		this.moduleId = MODULE_ID;
		this.searchId = searchId;
		this.tableId = tableId;
		this.pagecode = pagecode;
		this.oid = oid;
		this.state = {
			showModal_publish: false,
			showModal_finance_01: false,
			showModal_finance_02: false
		};
		this.close_publish = this.close_publish.bind(this);
		this.open_publish = this.open_publish.bind(this);

		// initTemplate.call(this, props)
	}
	//关闭发布弹窗
	close_publish() {
		this.setState({ showModal_publish: false });
	}
	//打开发布弹窗
	open_publish() {
		this.setState({ showModal_publish: true });
	}

	close_showModal_finance_01() {
        this.setState({ showModal_finance_01: false });
	}
	
	close_showModal_finance_02() {
        this.setState({ showModal_finance_02: false });
    }


	componentWillMount() {
		let callback = (json) => {
			initTemplate.call(this, this.props);
		};
		getMultiLang({ moduleId: this.moduleId, domainName: 'cmp', callback });
	}
   //联查默认加载数据
   initData = () => {	
	//报账
	if (this.props.getUrlParam('scene')=='bz') {
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let data = {
			pageInfo: pageInfo
		}
		ajax({
			url: '/nccloud/cmp/release/sscLink.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(this.tableId, data[this.tableId]);	
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}
				}
			}
		});	
	}else{
		let ishasqry = getGlobalStorage('sessionStorage', CACHE_KEY.HAS_QRY)
		if(ishasqry){			
			searchBtnClick.call(this,this.props,null);
		}
	}
};


	//刷新
	refresh = () => {
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let refreshsearchVal = this.props.search.getAllSearchData(searchId);
		if (refreshsearchVal == false) {
			return;
		}

		//动态获取oid
		if (this.props.meta.getMeta()[this.searchId].oid) {
			this.oid = this.props.meta.getMeta()[this.searchId].oid;
		}

		let data = {
			querycondition: refreshsearchVal,
			pageInfo: pageInfo,
			pagecode: pagecode,
			queryAreaCode: searchId,  //查询区编码
			oid: this.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		ajax({
			url: '/nccloud/cmp/release/sscquery.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(this.tableId, data[this.tableId]);
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}
					toast({ color: 'success', content: this.props.MutiInit.getIntl("36070AIPSSC") && this.props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000003') });
				}
			}
		});
	}
	render() {
		let { table, button, search, form , BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { createForm } = form;
		let { createButton } = button;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				 <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
			
					<div className="header-title-search-area">
					{createBillHeadInfo(
                        {
                            title: this.props.MutiInit.getIntl("36070AIPSSC") && this.props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000000'),//标题
                            initShowBackBtn: false
                                }
                            )}
					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'list_head',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
					</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2, //默认显示几个查询条件
						// showAdvBtn: true
					})}
					{/* {NCCreateSearch(searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 4 //默认显示几个查询条件
					})} */}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(tableId, {
						dataSource: DATA_SOURCE,
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true,
						onSelected: buttonVisible.bind(this, this.props),
						onSelectedAll: buttonVisible.bind(this, this.props)
					})}
				</div>
				{/* 生单补录信息：付款结算单，收款结算单*/}
				<NCModal  className="modal-finance-01"  fieldid='modal_finance_01'
				 show={this.state.showModal_finance_01} onHide={this.close_showModal_finance_01.bind(this)} style={{ height: '268px', width: '520px' }}>
					<NCModal.Header  closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AIPSSC") && this.props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000001')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body className="showModal-publish">
						<div >
							{createForm(formId_01, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'finance_01',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							modalRelation: 'modal-finance-01'
						})}
					</NCModal.Footer>

				</NCModal>
				{/* 生单补录信息：付款结算单，收款结算单*/}
				<NCModal className="modal-finance-02" fieldid='modal_finance_02'
				 show={this.state.showModal_finance_02} onHide={this.close_showModal_finance_02.bind(this)} style={{ height: '268px', width: '520px' }}>
					<NCModal.Header  closeButton={true}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36070AIPSSC") && this.props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000008')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body className="showModal-publish">
						<div >
							{createForm(formId_02, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'finance_02',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							modalRelation: 'modal-finance-02'
						})}
					</NCModal.Footer>

				</NCModal>
			</div>

		);
	}
}

SettlementCenterList = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: MODULE_ID
})(SettlementCenterList);

ReactDOM.render(<SettlementCenterList />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/