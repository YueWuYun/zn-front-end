/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, getMultiLang, toast, createPageIcon } from 'nc-lightapp-front';
const { NCTabs, NCModal, NCRadio,NCDiv } = base;
const NCTabPane = NCTabs.NCTabPane;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, afterEvent } from './events';
import * as CONSTANTS from './constants';
let { dataSource, tableId, searchId, pagecode, formId_org, formId_01, formId_02, formId_03, formId_04, formId_05, formId_06, moduleId, oid, MODULE_ID } = CONSTANTS;

class SettlementCenterList extends Component {

	constructor(props) {
		super(props);
		this.moduleId = moduleId;
		this.searchId = searchId;
		this.tableId = tableId;
		this.pagecode = pagecode;
		this.oid = oid;
		initTemplate.call(this, props)
	}
	componentDidMount() {
	}

	componentWillMount() {
		let callback = (json) => {
			initTemplate.call(this, this.props);
		};
		getMultiLang({ moduleId: this.moduleId, domainName: 'cmp', callback });
	}
	//刷新
	refresh = () => {
		let refreshpageInfo = this.props.table.getTablePageInfo(tableId);
		let refreshsearchVal = this.props.search.getAllSearchData(searchId);
		if(!refreshsearchVal){
			return;
		}

		//动态获取oid
		if (this.props.meta.getMeta()[this.searchId].oid) {
			this.oid = this.props.meta.getMeta()[this.searchId].oid;
		}

		let data = {
			querycondition: refreshsearchVal,
			pageInfo: refreshpageInfo,
			pagecode: pagecode,
			queryAreaCode: searchId, //查询区编码
			oid: this.oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
			querytype: 'tree'
		};
		ajax({
			url: '/nccloud/cmp/release/query.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(tableId, data[tableId]);
					} else {
						this.props.table.setAllTableData(tableId, { rows: [] });						
					}
					toast({ color: 'success', content: this.props.MutiInit.getIntl("36070AIPSC") && this.props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000020') });
				}
			}
		});
	}
	render() {
		let { table, button, search, form, BillHeadInfo } = this.props;
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
                            title:this.props.MutiInit.getIntl("36070AIPSC") && this.props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000000'),//标题
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
						// showAdvBtn: true, // 显示高级按钮
						// addAdvTabs: this.addAdvTabs// 添加高级查询区自定义页签 (fun), return Dom 
					})}
					{/* {NCCreateSearch(searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 4 //默认显示几个查询条件
					})} */}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(tableId, {
						dataSource: dataSource,
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						showCheck: false
					})}
				</div>


			</div>

		);
	}
}

SettlementCenterList = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: MODULE_ID
})(SettlementCenterList);

export default SettlementCenterList;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/