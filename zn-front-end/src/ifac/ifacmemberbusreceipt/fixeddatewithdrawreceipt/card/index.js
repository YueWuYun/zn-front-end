/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,getMultiLang, toast,high } from 'nc-lightapp-front';
import { buttonClick, initTemplate,pageInfoClick, afterEvent} from './events';
import {updateCacheData} from '../../../../tmpub/pub/util/cache';
import * as CONSTANTS from '../cons/constant.js';
import { buttonVisible } from './events/buttonVisible';
import { requesturl } from '../cons/requesturl.js';
import { saveMultiLangRes, loadMultiLang,createCardWebSocket} from "../../../../tmpub/pub/util/index";
let { pageCodeCard,pageCodeList,FixedWithDrawReceiptConst, moudleName,formId ,app_code,base_url,btnHeadCode,pkname,billtype } = CONSTANTS;
const { NCDiv, NCAffix } = base;
class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//时间戳
			ts: null,
			index: null,
			actionCode: '', //按钮编码
			billNO: '',
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
				
				this.toggleShow();
			}
		}
		getMultiLang({ moduleId: {
			['ifac']: ['36340NDSR',],
			['tmpub']: ['3601']}, domainName: moudleName, callback });
	}

	componentDidMount() {
		let id = this.props.getUrlParam('id');
		this.billID = id;
		if (id) {
			this.qryData(false);
		}
		// this.toggleShow();
	}
	//卡片返回按钮
	handleClick = () => {
		let scene=this.props.getUrlParam('scene');
		this.props.pushTo('/list', {
			pagecode: pageCodeList,
			status: 'browse',
			scene:scene
		});
	};
	/**
	 * 查询页面数据
	 * @param isRefresh 是否直接查询
	 */
	qryData = (isRefresh = false) => {
		let url = requesturl.cardquery;
		let data = { pk: this.props.getUrlParam('id'), pageCode: pageCodeCard };
		const that = this;
		ajax({
			url,
			data: data,
			success: (res) => {
				if (res.data) {
					if (res.data.head) {
						that.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
						this.billNO = res.data.head[formId].rows[0].values.vbillcode.value || '';
					} 
					if (isRefresh) {
						toast({ color: 'success', title: loadMultiLang(this.props, '36340NDSR-000007')});
					}
				} else {
					toast({ color: 'warning', content: loadMultiLang(this.props, '36340NDSR-000002')});
					this.billNO = '';
					this.billID = '';
					that.props.form.EmptyAllFormValue(that.formId);
				}
				this.toggleShow();
			}
		});

	};
	//切换页面状态
	toggleShow = () => {
		//开关开始
		let status = this.props.getUrlParam('status');
		let fip = this.props.getUrlParam('scene')==="linksce";
		if (status == 'browse') {
			this.setState({paginaShow:true});
			this.props.form.setFormStatus(formId,status);
			//设置表单状态
			if(fip){
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				});
			}else{
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				});
			}
		}
		else{
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		}
		buttonVisible.call(this, this.props);
	};
	render() {
		let {form, button, cardPagination, BillHeadInfo, ncmodal } = this.props;
		let { billNO} = this.state;
		let { createForm } = form;
		let { createButtonApp,createErrorFlag } = button;
		let { createModal } = ncmodal;
		const { createCardPagination } = cardPagination;
		const { createBillHeadInfo } = BillHeadInfo;
		let status = this.props.getUrlParam('status');
		let scene=this.props.getUrlParam('scene');
		let paginaShow=true;
		if(status==='edit'){ 
			paginaShow=false;
		}
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: (status == 'browse'&&scene!='linksce')?true:false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.billNO
		});
		return (
			<div className="nc-bill-card">
				{/**创建websocket */}
				{createCardWebSocket(this.props, {
				headBtnAreaCode: btnHeadCode,
				formAreaCode: formId,
				billpkname: pkname,
				billtype: billtype
				// serverLocation: '10.16.2.231:9991'
			})}
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo({
								title: loadMultiLang(this.props, '36340NDSR-000001'),
								billCode: this.billno, //单据号
								backBtnClick: () => {
									//返回按钮的点击事件
									this.handleClick();
								}
							})}
						</div>
						<div className="header-button-area">
						{createErrorFlag({
                                    headBtnAreaCode: btnHeadCode
                                })}
							{createButtonApp({
								area: 'card_head',
								buttonLimit: 3,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
						{(paginaShow)&&<div className='header-cardPagination-area' style={{ float: 'right' }}>
							{createCardPagination({
								handlePageInfoChange: pageInfoClick.bind(this),
								dataSource: FixedWithDrawReceiptConst.dataSource
						})}</div>}
					</NCDiv>
				</NCAffix>
				{/* 单据信息 */}
				<div className="nc-bill-form-area">{createForm(formId, {
					onAfterEvent: afterEvent.bind(this),
				})}</div>
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
	},
	// mutiLangCode: app_code
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/