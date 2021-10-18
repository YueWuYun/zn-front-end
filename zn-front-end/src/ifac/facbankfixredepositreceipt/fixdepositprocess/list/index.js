/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react';
import { createPage, base, getMultiLang, high,cardCache,cacheTools, ajax } from 'nc-lightapp-front';
import { requesturl } from '../cons/requesturl.js';
let {setDefData, getDefData } = cardCache;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm } from './events';
import * as CONSTANTS from '../cons/constant';
import { buttonVisible } from './events/buttonVisible';
import { saveMultiLangRes, createListWebSocket,go2CardCheck } from "../../../../tmpub/pub/util/index";//xuechh 云原生适配
import { listSingleOperator } from '../../../pub/utils/IFACButtonUtil';
//联查收款银行账户组件
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list';
let { dataSource, tableId, searchId, pageCodeList, moudleId, base_url, pkname, app_code, formId,search_key,link_key,billtype  } = CONSTANTS;//xuechh 云原生适配
const { NCDiv } = base;
//引入附件组件
const { NCUploader } = high;
class List extends Component {

	constructor(props) {
		super(props);
		this.searchId = searchId;//查询区id
		this.tableId = tableId;//表格区id
		this.pageCodeList = pageCodeList;//列表页的编码
		this.moudleId = moudleId;//模块编码
		this.pkname = pkname;//主键
		this.flag = false; //是否联查
		this.state = { 		//list的状态
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
			showOriginal: false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData: [],// 联查余额取数据，将需要联查的数据赋值给我
			accModalShow: false,//内部账户余额参数
			currentpk: '',//内部账余额参数
		};
	}


	componentWillMount() {
		let callback = (json, status, inlt) => {
			saveMultiLangRes(this.props, json);
			// json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({ json, inlt })       // 保存json和inlt到页面state中并刷新页面
			} else {
				console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}
		getMultiLang({
			moduleId: {
				'tmpub': ['3601'],
				'ifac': ['36140FDSR','36340PUBLIC']
			},
			callback
		});
	}


	componentDidMount() {
		if (this.props.getUrlParam('scene') === 'fip') {
			setDefData(link_key, dataSource, true);
			this.voucherLinkBill();
		}
		else if(this.props.getUrlParam('scene') === 'linksce'){
			let that = this;
			let pk = that.props.getUrlParam('id');
			let data={
				"pks":[pk],
				"pageCode": pageCodeList
			};
			ajax({
				url: requesturl.query,
					data: data,
					success: function (res) {
						if (res.data && res.data[tableId]) {
							that.props.table.setAllTableData(tableId, res.data[tableId]);
						} else {
							that.props.table.setAllTableData(tableId, { rows: [] });
						}
					}
			});
		}
	}

	// 凭证联查单据
	voucherLinkBill = () => {
		let checkedData = [];
		//缓存中的key为’checkedData’,
		checkedData = cacheTools.get('checkedData');
		if(checkedData && checkedData.length > 0){
			let data={
				operatingLogVO: checkedData,
				pageCode: pageCodeList
			};
			ajax({
				url: requesturl.voucherlinkbill,
					data: data,
				success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(this.tableId, data['head']);
					}else{
						this.props.table.setAllTableData(this.tableId, { rows: [] });
						}	
					}
				}
			});
		};
	};


	onRowDoubleClick = (record, index, props, e) => {
		let scene = this.props.getUrlParam('scene');//20200328
		go2CardCheck({
			url: requesturl.check2card,
			pk: record.pk_deposit.value,
			ts: record.ts.value,
			checkTS: record.ts.value ? true : false,
			fieldPK: 'pk_deposit',
			go2CardFunc: () =>{
				props.pushTo('/card', {
					status: 'browse',
					scene:scene,//20200328
					id: record.pk_deposit.value
				})
			}
		})
	}


	//切换页面状态
	toggleShow = () => {
		this.props.form.setFormStatus(formId, status);
		//设置表单状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.billNO  //修改单据号---非必传
		});
		buttonVisible.call(this, this.props);
		//开关关闭
	};


	//退回处理
	beSureClick = (props, value, flag = false) => {
		let record = this.state.record;
		let index = this.state.index;
		let extParam = {};
		extParam["returnreason"] = value;
		//这里可以加入逻辑处理
		if (flag) {
			record.returnreason = { value: value };
			this.props.table.setValByKeyAndRowId(this.tableId, record.rowid, "returnreason", { value: value });
		}
		listSingleOperator(this.props, pageCodeList, tableId, base_url + 'FDWDWbackAction.do', record, 'pk_fixeddatewithdraw', index, this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000010'), dataSource, false, extParam);/* 国际化处理： 退回成功！*/
		this.setState({ showModal: false, record: {}, index: null });//关闭模态框
	}

	// 将所有查询条件赋值进缓存
	addQueryCache = () => {
		let searchVal = this.props.search.getQueryInfo(searchId, false).querycondition;
		if (searchVal) {
			setDefData(search_key, dataSource, searchVal);
		}
	}


	render() {
		let numvalues = this.state.numvalues;
		let { table, button, search, form, BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { createForm } = form;
		let { createButton } = button;
		let scene = this.props.getUrlParam('scene');//20200328
		let linkSce = this.props.getUrlParam('scene');
		let multiLang = this.props.MutiInit.getIntl(app_code);
		let { showUploader, billID, billNO, selectedGroup, assignShow, assignData, ts, index, showModal, currentpk, accModalShow } = this.state;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				{/**创建websocket连接xuechh 云原生适配 */}
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
								title: this.props.MutiInit.getIntl("36140FDSR") &&
								this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000004'),//标题
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						{/* 按钮区 */}
						{createButtonApp({
							area: 'list_head',
							buttonLimit: 5,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				{/* 查询区 */}
				<div className="nc-bill-search-area">
				{(scene != 'linksce' && scene != 'fip' && scene != 'link') ?//20200328
						NCCreateSearch(searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						// defaultConditionsNum: 2,
						showAdvBtn: true,                           //  显示高级按钮
						// onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
					}) : null}
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

				<div>
					{/*账户余额 提示页面*/}
					{accModalShow && <InnerAccoutDialog
						id="dialog"
						showModal={accModalShow}
						accpk={currentpk}
						closeModal={() => {
							this.setState({
								accModalShow: false,
								currentpk: ''
							})
						}}
					/>}
				</div>
				<div>
					{/* 银行账户余额 */}
					<NCCOriginalBalance
						// 补录框显示
						showmodal={this.state.showOriginal}
						showOriginalData={this.state.showOriginalData}
						// 点击确定按钮的回调函数
						onSureClick={(retOriginalMsg) => {
							//console.log(retOriginalMsg, 'retOriginalMsg')
							//关闭对话框
							this.setState({ showOriginal: false })
						}}
						onCloseClick={() => {
							//关闭对话框
							this.setState({ showOriginal: false })
						}}
					>
					</NCCOriginalBalance>
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