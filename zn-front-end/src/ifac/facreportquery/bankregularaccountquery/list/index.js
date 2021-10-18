/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, getMultiLang,ajax} from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm} from './events';
import * as CONSTANTS from '../cons/constant';
import { buttonVisible } from './events/buttonVisible';
import { saveMultiLangRes, loadMultiLang,createListWebSocket } from "../../../../tmpub/pub/util/index";
let {tableId, searchId, moudleName,pageCodeList,BankRegularAccountQueryConst, moudleId, app_code,base_url,pkname,billtype } = CONSTANTS;
const { NCDiv } = base;
class List extends Component {

	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.pageCodeList = pageCodeList;
		this.moudleId = moudleId;
		this.state = {
			//多语
			json: {},
			inlt: null,
		};
	}

	componentWillMount() {
		window.onbeforeunload = () => {
		};
		let callback = (json, status, inlt) => {
			if(status) { 
				this.setState({ json, inlt });
				initTemplate.call(this, this.props);
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, json);
			}
		}
		getMultiLang({ moduleId: app_code, domainName: moudleName, callback });
	}

	componentDidMount() {
		let pk = this.props.getUrlParam('depositcode');
		let scene = this.props.getUrlParam('scene');

		if(pk&&scene&&scene==='linksce'){
			let pageInfo = this.props.table.getTablePageInfo(tableId);
			pageInfo.pageIndex= 0;
			let data = {
				pks:[pk],
				pageCode: pageCodeList,
			};
			ajax({
			   url: base_url+'linkqueryaction.do',
			   data: data,
			   success: (res) => {
				this.props.table.setAllTableData(tableId, res.data[tableId]);
			   },
			   error: (res) => {
				this.props.table.setAllTableData(tableId, []);
			   }
		   });
		}
	}
	//刷新
	refresh = () => {			
		searchBtnClick.call(this,this.props,null,false, true,false,true);
	}
	render() {
		let { table, button, search, form, BillHeadInfo } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		const { createBillHeadInfo } = BillHeadInfo;
		let scene = this.props.getUrlParam('scene');
		return (
			<div className="nc-bill-list">
				{/**创建websocket连接 */}
                {createListWebSocket(this.props, {
                    tableAreaCode: tableId,
                    tablePkName: pkname,
                    billtype: billtype
                    // serverLocation: '10.16.2.231:9991'
                })}
				{/** 渲染标题栏 **/}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{/* 标题区 */}
						{createBillHeadInfo(
							{
								title: loadMultiLang(this.props, '36141FDIBS-000001'),//标题
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						{/* 按钮区 */}
						{createButtonApp({
							area: 'list_head',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				{/* 查询区 */}
				<div className="nc-bill-search-area">
					{(scene!='linksce')&&NCCreateSearch(searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						// defaultConditionsNum: 2,
						showAdvBtn: true,                           //  显示高级按钮
					})}
				</div>
				{/* 列表区 */}
				<div className="nc-bill-table-area">
					{createSimpleTable(tableId, {
						pkname: BankRegularAccountQueryConst.pk_filed,
						dataSource: BankRegularAccountQueryConst.dataSource,
						handlePageInfoChange: pageInfoClick.bind(this),
						componentInitFinished: () => {
							buttonVisible.call(this, this.props);
						},
						onSelected: buttonVisible.bind(this, this.props),
						onSelectedAll: buttonVisible.bind(this, this.props),
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true
					})}
				</div>
			</div>
		);
	}
}

List = createPage({
	mutiLangCode: app_code,
	billinfo: {
		billtype: 'grid',
		pagecode: pageCodeList,
		bodycode: tableId
	}
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/