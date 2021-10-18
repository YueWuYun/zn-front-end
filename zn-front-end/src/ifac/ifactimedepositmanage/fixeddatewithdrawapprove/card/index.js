/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, getMultiLang,high } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent} from './events';
import * as CONSTANTS from '../cons/constant.js';
import { saveMultiLangRes, loadMultiLang, createCardWebSocket } from "../../../../tmpub/pub/util/index";
let {pageCodeCard, billtype,pkname,FixedWithDrawApproveConst, formId ,base_url } = CONSTANTS;
const { NCDiv, NCAffix } = base;
const { NCUploader, ApproveDetail} = high;
class Card extends Component {
	constructor(props) {
		super(props);
		this.isSaveAdd = false; //是否保存新增
		this.state = {
			//时间戳
			ts: null,
			index: null,
			showUploader: false,//控制附件弹出框
			actionCode: '', //按钮编码
			showApproveDetail: false, //显示审批详情
			//单据主键
			billID: '',
			//多语
			json: {},
			inlt: null,
			//单据编码
			billNO: '',
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
		getMultiLang({ 
			moduleId: {
				['ifac']: ['36340FDW', '36340PUBLIC'],
				['tmpub']: ['3601']
			}, 
			callback });
	}

	componentDidMount() {
		let id = this.props.getUrlParam('id');
		this.billID = id;
		if (id) {
			this.qryData();
		}
	}
	/**
	 * 查询页面数据
	 * @param isRefresh 是否直接查询
	 */
	qryData = () => {
		let url = base_url+'querycardaction.do';
		let data = { pk: this.props.getUrlParam('id'), pageCode: pageCodeCard };
		ajax({
			url,
			data: data,
			success: (res) => {
				if (res.data) {
					if (res.data.head) {
						this.setState({billNO:res.data.head[formId].rows[0].values.vbillcode.value});
						// this.billNO = res.data.head[formId].rows[0].values.vbillcode.value || '';
						this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
					} 
				} 
			}
		});

	};
	render() {
		let {form, button,BillHeadInfo, ncmodal } = this.props;
		let { createForm } = form;
		let { createButtonApp ,createErrorFlag} = button;
		let { createModal } = ncmodal;
		const { createBillHeadInfo } = BillHeadInfo;
		let {showUploader,billID,billNO,showApproveDetail} = this.state;
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode:billNO
		});
		return ( 
			<div className="nc-bill-card">
				{/**创建websocket */}
				{createCardWebSocket(this.props, {
                    headBtnAreaCode: 'card_head',
                    formAreaCode: formId,
                    billpkname: pkname,
					billtype: billtype,
					dataSource:FixedWithDrawApproveConst.dataSource
                    // serverLocation: '10.16.2.231:9991'
                })}
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo({
								title: loadMultiLang(this.props, '36340FDW-000004'),
								billCode: this.billno, //单据号
							})}
						</div>
						<div className="header-button-area">
							{createErrorFlag({
                                headBtnAreaCode: 'card_head'
                            })}
							{createButtonApp({
								area: 'card_head',
								buttonLimit: 3,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</NCDiv>
				</NCAffix>
				{/* 单据信息 */}
				<div className="nc-bill-form-area">{createForm(formId, {
					onAfterEvent: afterEvent.bind(this),
				})}</div>
				{createModal('MessageDlg', {
					size: 'lg'
				})}
				{/** 联查工作流 **/}
				<div>
					{showApproveDetail && <ApproveDetail
						show={showApproveDetail}
						billtype={billtype}
						billid={billID}
						close={() => {
							this.setState({
								showApproveDetail: false,
								billID: ''
							})
						}}
					/>}
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

Card = createPage({
	billinfo: {
		billtype: 'form',
		pagecode: pageCodeCard,
		headcode: formId,
		bodycode: []
	}
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/