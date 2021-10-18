/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, getMultiLang, toast, cardCache,high, deepClone, createPageIcon } from 'nc-lightapp-front';
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, afterEvent } from './events';
import * as CONSTANTS from '../cons/constant';
import { requesturl } from '../cons/requesturl.js';
import { buttonVisible1 } from '../card/events/buttonVisible';
import { buttonVisible } from './events/buttonVisible';
import { saveMultiLangRes, go2CardCheck ,createListWebSocket} from "../../../../tmpub/pub/util/index";
import { listSingleOperator,listSingleOperatorNoRecord } from '../../../pub/utils/IFACButtonUtil';
const { NCTabPane } = NCTabs;
let { setDefData, getDefData } = cardCache;
let { dataSource, gotocardcheck, tableId, searchId, pageCodeList,FixedWithDrawConst, moudleId,base_url, pkname, Query_List_URL, Query_Recipt_List_URL, app_code,pageCodeCard,formId,billtype } = CONSTANTS;
const { NCDiv } = base;
//引入附件组件
const { NCUploader, ApproveDetail, BillTrack, ApprovalTrans } = high;
class List extends Component {

	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.pageCodeList = pageCodeList;
		this.moudleId = moudleId;
		this.pkname = pkname;
		this.flag = false; //是否联查
		this.state = {
			//时间戳
			ts: null,
			index: null,
			record: {},
			numvalues: {},
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			//当前选中的分组
			selectedGroup: '0',
			//是否显示附件框
			showUploader: false,
		};
		
		initTemplate.call(this, props)
	}

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
		getMultiLang({ 
			moduleId: {
				'tmpub':['3601'],
				'ifac':['36140NDSR']
			}, 
		callback });
	}

	componentDidMount() {
	}
	onRowDoubleClick = (record, index, props, e) => {
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
					id: record.pk_fixeddatewithdraw.value
				});
			}
		})
		
		buttonVisible1.call(this,props)
	}
	
	//切换页面状态
	toggleShow = () => {
		this.props.form.setFormStatus(formId,status);
		//设置表单状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.billNO  //修改单据号---非必传
		});
		buttonVisible.call(this, this.props);
		//开关关闭
	};
	
	render() {
		let numvalues = this.state.numvalues;
		let { table, button, search, form, BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { createForm } = form;
		let { createButton } = button;
		let linkSce = this.props.getUrlParam('scene');
		let multiLang = this.props.MutiInit.getIntl(app_code);
		let {showUploader,billID,billNO,selectedGroup,ts,index,showModal} = this.state;
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
								title:this.props.MutiInit.getIntl("36140NDSR") && 
								this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000004'),//标题 
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						{/* 按钮区 */}
						{createButtonApp({
							area: 'list_head',
							//buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				{/* 查询区 */}
				<div className="nc-bill-search-area">
					{(linkSce != 'linksce'&&linkSce!='fip' )&&NCCreateSearch(searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						showAdvBtn: true,                           //  显示高级按钮
					})}
				</div>
				
				{/* 列表区 */}
				<div className="nc-bill-table-area">
					{createSimpleTable(tableId, {
						pkname: pkname,
						dataSource: dataSource,
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
				
				
				{/** 附件 **/}
				<div className="nc-faith-demo-div2">
					{showUploader &&
						<NCUploader
							billId={billID}
							target={null}
							placement={'bottom'}
							billNo={billNO}
							onHide={() => {
								this.setState({ showUploader: false });
							}}
						/>
					}
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