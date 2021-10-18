/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, cardCache, high, getMultiLang, createPageIcon } from 'nc-lightapp-front';
let { NCScrollElement, NCAffix, NCBackBtn,NCDiv } = base;
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import {buttonVisible} from './events/buttonVisible';
//引入常量定义
import { module_id, fun_code,node_key,printTemplate_ID,list_page_id, card_table_id, qcard_page_id, qcard_from_id, qcard_table_id, card_from_id, dataSourceTam } from '../cons/constant.js';
let { addCache } = cardCache;
import { requesturl } from '../cons/requesturl';
//引入附件组件
const { NCUploader,PrintOutput,ApproveDetail } = high;
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = qcard_from_id;
		this.moduleId = module_id;
		this.tableId = qcard_table_id;
		this.pageId = qcard_page_id;
		this.state = {
			//多语
			json: {},
			inlt: null,
			//附件框是否显示
			showUploader: false,
			target:null,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			//是否行复制模式
			isRowCopy: false,
			showAppr: false,
			showNCbackBtn: true,//返回箭头
			outputData: {
				funcode: fun_code, //功能节点编码，即模板编码
				nodekey: node_key, //模板节点标识
				printTemplateID: printTemplate_ID, //模板id
				oids: [],
				outputType: 'output'
			}
		};
	}

	componentWillMount() {
		let callback = (json, status, inlt) => {
			if(status) {
				this.setState({ json, inlt });
				initTemplate.call(this, this.props);
			}
		}
		getMultiLang({ moduleId: '36340AIAC', domainName: 'tam', callback });

    }

	componentDidMount() {
		//查询单据详情
		if (this.props.getUrlParam('status') == 'browse') {
			let id = this.props.getUrlParam('id');
			let data = { pk: id, pageCode: this.pageId };
			let that = this;
			ajax({
				url: '/nccloud/tam/accountapply/querycardaction.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });

							//this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							let vbillno =res.data.head[this.formId].rows[0].values.vbillno.value;
							this.setState({
								vbillno:vbillno
							});
						}

						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						this.toggleShow();
						addCache(id,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
					} else {
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
				}
			});
		}
		
	}
	//刷新
	refresh = () => {
		this.componentDidMount();
	}
	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		this.props.form.setFormStatus(this.formId, status);
		this.props.cardTable.setStatus(this.tableId, status);
		buttonVisible(this.props);
	};

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

	//获取列表肩部信息
	getTableHead = (buttons, tableId) => {
		let { createButton } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(tableId, {
						iconArr: ['close', 'open', 'max'],
						maxDestAreaId: 'finance-fts-commissionpayment-card'
					})}
					{this.props.button.createButtonApp({
							area: 'card_body',
							buttonLimit: 3, 
							onButtonClick:  buttonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
						})}
				</div>
			</div>
		);
	};

	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}


	closeApprove = () => {
		this.setState({
			showAppr: false
		});
	};

	//卡片返回按钮
	handleClick = () => {
		this.props.pushTo("/list", {
			pagecode: list_page_id
		});
	}

	render() {
		let { cardTable, form, button, modal, cardPagination,BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp } = button;
		let { createBillHeadInfo } = BillHeadInfo;
		let { createModal } = modal;
		let { showUploader, billID, billNO,showNCbackBtn } = this.state;
		return (
			<div className="nc-bill-card">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div>
							{createBillHeadInfo({
								title: this.state.json['36340AIAC-000034'], //标题/* 国际化处理： 内部账户计息设置*/
								backBtnClick: this.handleClick.bind(this)
							})}
						</div>
						<div className="header-button-area">
							{/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
							{createButtonApp({area: 'card_head', onButtonClick: buttonClick.bind(this) })}
							{/* {buttons.map((v) => {
								if (v.btncode != 'addline' && v.btncode != 'addline2' && v.btncode != 'delline' && v.btncode != 'delline2' && v.btncode != 'copyline' && v.btncode != 'copyline2') {
									return createButton(v.btncode, {
										name: v.btnname,
										onButtonClick: buttonClick.bind(this),
										buttonColor: this.getButtonNames(v.btncode)
									});
								}
							})} */}
						</div>
						<div className='header-cardPagination-area' style={{ float: 'right' }}>{createCardPagination({
							handlePageInfoChange: pageInfoClick.bind(this)
						})}</div>
					
				</NCDiv>
				<NCScrollElement name='forminfo'>
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							onAfterEvent: afterEvent.bind(this)
						})}
					</div>
				</NCScrollElement>
				<NCScrollElement name='businfo'>
					<div className="nc-bill-table-area">
						{this.getTableHead(buttons, this.tableId)}
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead.bind(this, buttons, this.tableId),
							modelSave: this.saveBill,
							onAfterEvent: afterEvent.bind(this),
							showCheck: true,
							showIndex: true
						})}
					</div>
				</NCScrollElement>
				{/** 附件 **/}
				<div className="nc-faith-demo-div2">
					{showUploader &&
						<NCUploader
							billId={billID}
							target={null}
							placement={'bottom'}
							billNo={billNO}
							onHide={this.onHideUploader}
						/>
					}
				</div>
				{/**输出**/}
				<div>
					<PrintOutput
						ref="printOutput"
						url={requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				{/**审批详情**/}
				<div>
					<ApproveDetail
						billtype={this.state.billtype}
						billid={this.state.billid}
						show={this.state.showAppr}
						close={this.closeApprove}
					/>
				</div>

			</div>
		);
	}
}

Card = createPage({
	// initTemplate: initTemplate.bind(this),
	// mutiLangCode: '36340AIAC'
	billinfo:{
        billtype: 'card', 
        pagecode: qcard_page_id, 
        headcode: qcard_from_id,
        bodycode: qcard_table_id
	},
})(Card);

// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/