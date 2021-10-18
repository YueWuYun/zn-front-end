/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//高级查询
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, cacheTools, high } from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, tableButtonClick } from './events';
import { Templatedata } from "../config/Templatedata";//配置的id和area信息
let { NCTabsControl, NCButton, NCDiv } = base;
const { BillTrack, Inspection, Refer, NCUploader, ApproveDetail } = high;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = Templatedata.list_moduleid;
		this.searchId = Templatedata.list_advsearchid;
		this.tableId = Templatedata.list_tableid;
		this.pageId = Templatedata.list_advpageid;
		this.state = {
			showInspection: false,//联查预算
			sourceData: null,//联查预算数据源
			showbilltrack: false,//联查单据
			showbilltrackpk: '',//联查单据pk
			showbilltracktype: '',//联查单据类型
			show: false,//审批意见是否显示
			billid: '',//审批意见单据pk
			billtype: '',//审批意见单据类型
			billId: '',//单据pk
			billno: '',//附件管理使用单据编号
			showUploader: false,//控制附件弹出框
			target: null,//控制弹出位置
			tpflag: true,
			tradetype: 'D4',
			tradename: this.props.MutiInit.getIntl("36070RBMLINK") && this.props.MutiInit.getIntl("36070RBMLINK").get('36070RBMLINK-000013'),/* 国际化处理： 收款结算单*/
			tradepk: '0000Z6000000000000F4'
		}
		initTemplate.call(this, props);
	}
	componentDidMount() {
	}

	/* 添加高级查询区中的页签 */
	addAdvTabs = () => {
		return [
		]
	};

	/* 替换高级查询body区域 */
	replaceAdvBody = () => {
		return (
			<div>3333</div>
		)
	}
	//刷新列表
	refresh = () => {

		let refreshpageInfo = this.props.table.getTablePageInfo(this.tableId);//分页
		let refreshsearchVal = this.props.search.getAllSearchData(this.searchId);//查询condition


		let searchdata = {
			conditions: refreshsearchVal.conditions || refreshsearchVal,
			pageInfo: refreshpageInfo,
			pagecode: this.pageId,
			queryAreaCode: this.searchId,  //查询区编码
			oid: Templatedata.list_oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
			queryType: Templatedata.list_querytype
		};
		ajax({
			url: '/nccloud/cmp/recbill/recbillquery.do',
			data: searchdata,
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

	}
	render() {
		let { table, button, search } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons } = button;
		let { showUploader, target, billno, billId } = this.state;//附件相关内容变量
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} >
					<div className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: this.props.MutiInit.getIntl("36070RBMLINK") &&
										this.props.MutiInit.getIntl("36070RBMLINK").get('36070RBMLINK-000031'),//标题
									initShowBackBtn: false
								}
							)}
						</div>
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2, //默认显示几个查询条件
						showAdvBtn: true,                           //  显示高级按钮
						searchBtnName: 'advance',
						onlyShowAdvArea: true
						// searchBtnName :''                        //    查询按钮名称，默认查询
						// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
						// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
						// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom 
						// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom 
						// onAfterEvent: this.onAfterEvent.bind(this),  //编辑后事件
						// addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom 
						// oid: Templatedata.list_oid

					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						showCheck: true
					})}
				</div>
			</div>
		);
	}
}

List = createPage({
	mutiLangCode: Templatedata.list_moduleid
})(List);

ReactDOM.render(<List />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/