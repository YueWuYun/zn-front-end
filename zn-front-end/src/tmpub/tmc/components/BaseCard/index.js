/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 卡片页组件
 created by：liyaoh 2018-09-03
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { base, high } from 'nc-lightapp-front';
import { card } from '../../container';
import Header from './Header';
import './index.less';
const { NCScrollElement } = base;
const { PrintOutput, NCUploader, ApproveDetail, ApprovalTrans } = high;

class BaseCard extends Component {
	static defaultProps = {
		customState: {}
	};

	constructor(props) {
		super(props);
		//将常量绑定到this上，方便其他地方调用
		for (let k in props.config) {
			this[k] = props.config[k];
		}
		this.buttonVisible = props.buttonVisible.bind(this);
		this.saveBefore = props.saveBefore && props.saveBefore.bind(this); //保存前事件
		this.state = {
			json: {},
			inlt: null,
			billNo: '', //单据编号
			isPaste: false, //粘贴
			//输出用
			outputData: {
				funcode: '', //功能节点编码，即模板编码
				nodekey: '', //模板节点标识
				oids: [],
				outputType: 'output'
			},
			showUploader: false, //是否显示附件上传
			billInfo: {}, //附件上传信息
			showApproveDetail: false, //是否显示审批详情
			compositedisplay: false, //是否显示指派
			compositedata: null, //指派信息
			...props.customState
		};
		props.initTemplate.call(this, props, props.cardDidMount.bind(this));
	}

	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				this.setState({ json, inlt })       // 保存json和inlt到页面state中并刷新页面
			}
		}
		this.props.MultiInit.getMultiLang({ moduleId: 'TMCPUB', domainName: 'bond', callback });
	}

	componentDidMount() {
		//审批详情联查单据隐藏返回按钮
		if (this.props.getUrlParam('scene') === 'approvesce') {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false
			});
		}
	}

	//返回按钮事件配置
	handleBackClick() {
		let scene = this.props.getUrlParam('scene');
		let urlParm;
		if (scene) urlParm = { scene };
		this.props.pushTo('/list', urlParm);
	}

	//获取列表肩部信息
	getTableHead = () => (
		<div className="shoulder-definition-area">
			<div className="definition-icons">
				{this.props.button.createButtonApp({
					area: this.props.shoulderBtnArea,
					// buttonLimit: btnLimit,
					onButtonClick: this.props.bodyButtonClick && this.props.bodyButtonClick.bind(this),
					popContainer: document.querySelector('.header-button-area')
				})}
			</div>
		</div>
	);

	tabsChange = (key) => {
		this.props.tabsTableChange && this.props.tabsTableChange(key);
	};

	//提交即指派
	getAssginUsedr = (value) => {
		card.cardCommit.call(this, {
			data: {
				pks: [ this.props.getUrlParam('id') ],
				userObj: value,
				pageCode: this.pageId
			},
			successAfter: () => {
				this.compositeTurnOff();
			}
		});
	};

	//取消提交即指派
	compositeTurnOff = () => {
		this.setState({
			compositedata: null,
			compositedisplay: false
		});
	};

	//主表form
	renderForm = ({ afterEvent, formConfig, form }) => (
		<NCScrollElement name="forminfo">
			<div className="nc-bill-form-area">
				{form.createForm(this.formId, {
					onAfterEvent: afterEvent && afterEvent.bind(this),
					...formConfig
				})}
			</div>
		</NCScrollElement>
	);

	//子表render
	renderTabsTable = ({
		createTabsTable,
		isBrowse,
		afterTableEvent,
		bodySelectedEvent,
		bodySelectedAllEvent,
		tabsConfig
	}) => (
			<div className="nc-bill-bottom-area">
				<NCScrollElement>
					<div className="nc-bill-table-area">
						{createTabsTable(this.tabCode, {
							showCheck: !isBrowse,
							showIndex: true,
							onAfterEvent: afterTableEvent && afterTableEvent.bind(this),
							tableHead: this.getTableHead.bind(this),
							onTabChange: this.tabsChange.bind(this),
							onSelected: bodySelectedEvent && bodySelectedEvent.bind(this), // 左侧选择列单个选择框回调
							onSelectedAll: bodySelectedAllEvent && bodySelectedAllEvent.bind(this), // 左侧选择列全选回调
							...tabsConfig
						})}
					</div>
				</NCScrollElement>
			</div>
		);

	

	render() {
		const {
			config,
			afterEvent,
			afterTableEvent,
			buttonClick,
			bodySelectedEvent,
			bodySelectedAllEvent,
			pageTitle,
			headBtnArea,
			formConfig = {},
			tabsConfig = {},
			pageClick,
			children,
			socket
		} = this.props;
		const { cardTable, form, button, cardPagination, BillHeadInfo } = this.props;
		const {
			showUploader,
			billInfo,
			outputData,
			showApproveDetail,
			compositedata,
			compositedisplay
		} = this.state;
		const { createCardPagination } = cardPagination;
		const { createButtonApp } = button;
		const { createBillHeadInfo } = BillHeadInfo;
		const { createTabsTable } = cardTable;
		const isBrowse = this.props.getUrlParam('status') === 'browse';
		const billNo = this.props.form.getFormItemsValue(this.formId, this.billNo);
		const scene = this.props.getUrlParam('scene'); //场景

		//通用组件
		let commonRender = [
			<PrintOutput ref="printOutput" url={this.print} data={outputData} callback={this.onSubmit} />
		];

		//修改部分--附件
		if (showUploader) {
			commonRender.push(
				<NCUploader
					placement={'bottom'}
					{...billInfo}
					onHide={() => {
						this.setState({
							showUploader: false
						});
					}}
				/>
			);
		} else if (showApproveDetail) {
			//修改部分--审批详情
			commonRender.push(
				<ApproveDetail
					show={showApproveDetail}
					billtype={this.billtype}
					billid={billInfo.billId}
					close={() => {
						this.setState({
							showApproveDetail: false
						});
					}}
				/>
			);
		} else if (compositedisplay) {
			//修改部分--提交及指派
			commonRender.push(
				<ApprovalTrans
					title={this.state.json['TMCPUB-000012']}/* 国际化处理： 指派*/
					data={compositedata}
					display={compositedisplay}
					getResult={this.getAssginUsedr}
					cancel={this.compositeTurnOff}
				/>
			);
		} 

		return (
			<div className="nc-bill-card">
			{/* 适配 socket 开始 */}
			{socket.connectMesg({
             tableAreaCode: this.tableId,
             billpkname: this.primaryId,
             billtype: this.billtype,
             dataSource: this.dataSource
          })}
          {/* 适配 socket 结束 */}
				<div className="card-wrapper">
					<div className="nc-bill-top-area">
						{/* 修改小程序头部 */}
						<Header>
						{this.props.button.createErrorFlag({     
                         headBtnAreaCode:  headBtnArea   
                         })}
							{createBillHeadInfo({
								title: pageTitle, //标题
								billCode: billNo && billNo.value, //单据号
								backBtnClick: this.handleBackClick.bind(this)
							})}
							{createButtonApp({
								area: headBtnArea,
								onButtonClick: buttonClick.bind(this)
							})}
							{
								isBrowse &&
								scene !== 'linksce' &&
								scene !== 'approvesce' &&
								createCardPagination({
									dataSource: this.dataSource,
									handlePageInfoChange: pageClick.bind(this)
								})
							}
						</Header>

						{/* 修改部分5--表头form */}
						{this.renderForm({ afterEvent, formConfig, form })}
					</div>

					{/* 修改部分2--下部tabs */}
					{config.tabCode && this.renderTabsTable({
						createTabsTable,
						isBrowse,
						afterTableEvent,
						bodySelectedEvent,
						bodySelectedAllEvent,
						tabsConfig
					})}
				</div>

				{/* 通用组件 */}
				{commonRender}

				{/* 自定义区域 根据父组件传进来的children渲染 */}
				{children && children(this)}
			</div>
		);
	}
}

BaseCard.propTypes = {
	config: PropTypes.object.isRequired, //常量
	initTemplate: PropTypes.func.isRequired, //模板加载方法
	headBtnArea: PropTypes.string.isRequired, //头部按钮区域
	buttonClick: PropTypes.func.isRequired, //头部按钮点击事件
	pageTitle: PropTypes.string.isRequired, //页面标题
	pageClick: PropTypes.func.isRequired,
	formConfig: PropTypes.object, //form参数
	tabsConfig: PropTypes.object, //form参数
	buttonVisible: PropTypes.func,
	afterEvent: PropTypes.func,
	afterTableEvent: PropTypes.func,
	bodyButtonClick: PropTypes.func,
	bodySelectedEvent: PropTypes.func,
	bodySelectedAllEvent: PropTypes.func,
	shoulderBtnArea: PropTypes.string,
	cardDidMount: PropTypes.string,
	saveBefore: PropTypes.string
};

export default BaseCard;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/