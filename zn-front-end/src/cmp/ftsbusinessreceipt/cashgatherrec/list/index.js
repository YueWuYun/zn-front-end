/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, getMultiLang, toast, deepClone, cardCache,createPageIcon } from 'nc-lightapp-front';
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index"
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, afterEvent } from './events';
import * as CONSTANTS from '../const/constants';
let { setDefData, getDefData } = cardCache;
let { dataSource, search_key, tableId, searchId, pageCodeList, moudleId, pkname, Query_List_URL } = CONSTANTS;
const { NCDiv } = base;

class List extends Component {

	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.pageCodeList = pageCodeList;
		this.moudleId = moudleId;
		this.pkname = pkname;
		initTemplate.call(this, props)
	}

	componentWillMount() {
	}

	refresh = () => {
		let refreshpageInfo = this.props.table.getTablePageInfo(tableId);
		//缓存的查询条件{需要先克隆一下}
		let searchVal = deepClone(getDefData(search_key, dataSource));
		if (!searchVal) {
			searchVal = this.props.search.getAllSearchData(searchId);//查询区条件
			if(!searchVal) return;
			// 将所有查询条件赋值进缓存[查询的时候已经放入缓存]
			setDefData(search_key, dataSource, searchVal);
		}
		let oid = this.props.meta.getMeta()[searchId].oid;
		let data = {
			querycondition: searchVal,
			pageInfo: refreshpageInfo,
			pageCode: pageCodeList,
			queryAreaCode: searchId,
			oid: oid,
			querytype: 'tree'
		};
		ajax({
			url: Query_List_URL,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data && data.table && data.table.rows && data.table.rows.length) {
                        this.props.table.setAllTableData(tableId, data[tableId]);
                        toast({
                            color: 'success', 
                            content: this.props.MutiInit.getIntl("36300REC").get('36300REC-000015')
                        });
                    } else {
						this.props.table.setAllTableData(tableId, { rows: [] });
						toast({ color: 'warning', content: this.props.MutiInit.getIntl("36300WCR") && this.props.MutiInit.getIntl("36300WCR").get('36300WCR--000002') });
					}
				}

			}
		});
	}

	DoubleClick = (record, index, props, e) => {
		this.props.pushTo('/card', {
			status: 'browse',
			id: record.pk_cashgather_receipt_h.value,
		});
	}

	/**
	 * 表格选择框有变动的钩子函数
	 * props, moduleId(区域id), newVal(被选中的行数), oldVal(旧的被选中的行数)
	 */
	selectedChangeFn = (props, moduleId, newVal, oldVal) => {
		if(newVal && newVal > 0){
			//获取选中行数据
			let checkRows = props.table.getCheckedRows(moduleId);
			if(checkRows && checkRows.length > 0){
				props.button.setButtonDisabled(['formalprint', 'supplyprint', 'print', "printout"], false);
			}
		}else{
			props.button.setButtonDisabled(['formalprint', 'supplyprint', 'print', "printout"], true);
		}
	}

	render() {
		let { table, button, search, form , BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { createForm } = form;
		let { createButton } = button;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				{/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
                                {
									title: this.props.MutiInit.getIntl("36300REC") && 
										this.props.MutiInit.getIntl("36300REC").get('36300REC-000004'),//标题
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
					})}
				</div>
				{/* 表单区 */}
				<div className="nc-bill-table-area">
					{createSimpleTable(tableId, {
						pkname: pkname,
						dataSource: dataSource,
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						onRowDoubleClick: this.DoubleClick.bind(this),
						selectedChange: this.selectedChangeFn.bind(this),
						showCheck: true,
						showIndex: true
					})}
				</div>
			</div>
		);
	}
}

List = createPage({
	mutiLangCode: moudleId,
	billinfo: {
		billtype: 'grid',
		pagecode: pageCodeList,
		bodycode: tableId
	}
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/