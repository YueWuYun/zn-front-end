/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, getMultiLang,cardCache,} from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, afterEvent } from './events';
import * as CONSTANTS from '../cons/constant';
import { buttonVisible } from './events/buttonVisible';
import { saveMultiLangRes, loadMultiLang,createListWebSocket,go2CardCheck } from "../../../../tmpub/pub/util/index";
let { setDefData } = cardCache;
let {tableId, searchId, moudleName,pageCodeList,FixedWithDrawReceiptConst, moudleId,pkname, app_code,gotocardcheck,billtype } = CONSTANTS;
const { NCDiv } = base;
class List extends Component {

	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.pageCodeList = pageCodeList;
		this.moudleId = moudleId;
		this.pkname = pkname;
		this.state = {
			//多语
			json: {},
			inlt: null,
			//时间戳
			ts: null,
			index: null,
			record: {},
		};
	}

	componentWillMount() {
		window.onbeforeunload = () => {
		};
		let callback = (json, status, inlt) => {
			saveMultiLangRes(this.props, json);
			if(status) {
				this.setState({ json, inlt });
				initTemplate.call(this, this.props);
				//将多语资源数据存储到页面级缓存中
				
			}
		}
		getMultiLang({ moduleId: {
			['ifac']: ['36340NDSR',],
			['tmpub']: ['3601']
		} , domainName: moudleName, callback });
	}

	componentDidMount() {

	}
	onRowDoubleClick = (record, index, props, e) => {
		let scene = props.getUrlParam('scene');
		go2CardCheck({
			props,
			url: gotocardcheck,
			pk: record[pkname].value,
			ts: record["ts"].value,
			checkTS: false,
			fieldPK: pkname,
			go2CardFunc: () => {
				props.pushTo('/card', {
					status: 'browse',
					id: record.pk_receipt.value,
					scene
				});
			}
		})
		
	} 
	//刷新
	refresh = () => {
		searchBtnClick.call(this, this.props, null, true);
	}
	render() {
		let { table, button, search, form, BillHeadInfo } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let scene = this.props.getUrlParam('scene');
		const { createBillHeadInfo } = BillHeadInfo;
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
								title: loadMultiLang(this.props, '36340NDSR-000001'),//标题
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
					{(scene!='linksce'&&scene!='fip')&&NCCreateSearch(searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						showAdvBtn: true,//  显示高级按钮
						// onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
					})}
				</div>
				{/* 列表区 */}
				<div className="nc-bill-table-area">
					{createSimpleTable(tableId, {
						pkname: FixedWithDrawReceiptConst.pk_filed,
						dataSource: FixedWithDrawReceiptConst.dataSource,
						handlePageInfoChange: pageInfoClick.bind(this),
						componentInitFinished: () => {
							buttonVisible.call(this, this.props);
						},
						onRowDoubleClick: this.onRowDoubleClick.bind(this),
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