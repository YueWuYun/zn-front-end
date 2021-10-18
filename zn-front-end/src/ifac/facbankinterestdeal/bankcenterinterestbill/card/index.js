/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast,high,cardCache ,getMultiLang, createPageIcon} from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix,NCBackBtn,NCDiv } = base;
import { buttonClick, initTemplate, pageInfoClick } from './events';
//import {buttonVisible} from './events/buttonVisible';
import {processFormulamsg} from '../util/util.js';
import { versionControl } from "../../../pub/util/util.js";
//引入常量定义
import { module_id, app_code, button_limit, card_page_id, card_from_id, card_table_id,fun_code,node_key,printTemplate_ID,setNull,dataSourceTam,list_table_id,bill_type, list_page_id,pk,billtype,card_head } from '../cons/constant.js';
import { requesturl } from '../cons/requesturl';
import {  createCardWebSocket} from "../../../../tmpub/pub/util/index";
let { getCacheById, updateCache,addCache,deleteCacheById,getNextId } = cardCache;


import { queryCard } from '../busbutton/intcalQuery';
const { PrintOutput } = high;
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = card_from_id;
		this.moduleId = module_id;
		this.tableId = card_table_id;
		this.pageId = card_page_id;
		this.state = {
			//多语
			json: {},
			inlt: null,
			target:null,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			//是否行复制模式
			isRowCopy: false,
			oldorg:'',
			oldorgDis:'',
			//输出用   
			//showNCbackBtn: false,//返回箭头
			outputData: {
				funcode: fun_code, //功能节点编码，即模板编码
				nodekey: node_key, //模板节点标识
				printTemplateID: printTemplate_ID, //模板id
				oids: [],
				outputType: 'output'
			}
		};
	}
	
	componentDidMount() {
		let source = this.props.getUrlParam('source');
		if (source != 'list' && this.props.getUrlParam('status') != 'add') {
			this.toggleShow();
		}
	}

	componentWillMount() {
		let callback = (json, status, inlt) => {
			if(status) {
				this.setState({ json, inlt });
				initTemplate.call(this, this.props);
			}
		}
		getMultiLang({ moduleId: '36140FDIB', domainName: 'ifac', callback });

    }

	//刷新
	refresh = () => {
		this.componentDidMount();
	}

	//刷新
	refreshcard = () => {
		queryCard.call(this,this.props);
	}
	//切换页面状态
	toggleShow = () => {
		queryCard.call(this,this.props);
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
					
					{this.props.button.createButtonApp({
                        area: 'card_body',
                        buttonLimit: 2, 
                        onButtonClick:  buttonClick.bind(this), 
                        popContainer: document.querySelector('.header-button-area')
					})}
					{this.props.cardTable.createBrowseIcons(tableId, {
						iconArr: ['close', 'open', 'max'],
						maxDestAreaId: 'finance-fts-commissionpayment-card'
					})}
					
				</div>
			</div>
		);
	};

	//卡片返回按钮
	handleClick = (type2) => {
		let scene = this.props.getUrlParam("scene");
		this.props.pushTo("/list", {
			pagecode: list_page_id,
			type:type2,
			scene:scene,
			back:'back'
		});
	}

	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp ,createErrorFlag} = button;
		let { createModal } = modal;
		let { billID, billNO,showNCbackBtn,target } = this.state;
		let billnoTitle = '';
		let scene = this.props.getUrlParam("scene");
		let type2 = this.props.getUrlParam('type');
		let douclick = this.props.getUrlParam('douclick');
		let islinkquery = this.props.getUrlParam('islinkquery');
		if(this.state.billno){
			billnoTitle = this.state.billno;
		}
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let showBackBtn = true;
		if((!douclick&&scene&&(scene == 'linksce' || scene == 'fip')) ||islinkquery)
		{
				showBackBtn = false;
		}

		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: showBackBtn, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: billnoTitle //修改单据号---非必传
		});

		return (
			<div className="nc-bill-card">
			{createCardWebSocket(this.props, {
                    headBtnAreaCode: card_head,
                    formAreaCode: card_from_id,
                    billpkname: pk,
                    billtype: billtype,
                    dataSource: dataSourceTam
                    // serverLocation: '10.16.2.231:9991'
				})}
				
			<div className="nc-bill-top-area">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER}  className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo({
									title : this.state.json['36140FDIB-000007']/**国际化处理：内部活期存款利息清单 */,
									//单据号
									billCode: billnoTitle,
									//返回按钮的点击事件     
									backBtnClick:()=>{              
										this.handleClick(type2);
									}
								})}
						</div>
						<div className="header-button-area">
						    {createErrorFlag({headBtnAreaCode: card_head })}
							{createButtonApp({area: 'card_head', onButtonClick: buttonClick.bind(this) })}
						</div>
						<div className='header-cardPagination-area' style={{ float: 'right' }}>{createCardPagination({
							handlePageInfoChange: pageInfoClick.bind(this),
							dataSource: dataSourceTam
						})}</div>
					</NCDiv>
				</NCAffix>
				<NCScrollElement name='forminfo'>
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
						})}
					</div>
				</NCScrollElement>
				</div>
				<NCScrollElement name='businfo'>
					<div className="nc-bill-table-area">
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead.bind(this, buttons, this.tableId),
							adaptionHeight: true,
							showCheck: true,
							showIndex: true
						})}
					</div>
				</NCScrollElement>

				<div>
					<PrintOutput
						ref="printOutput"
						url={requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
			</div>
		);
	}
}

Card = createPage({
	billinfo:{
        billtype: 'card', 
        pagecode: card_page_id, 
        headcode: card_from_id,
        bodycode: card_table_id
	},
	orderOfHotKey: ["head", "applychild"]
})(Card);
export default Card;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/