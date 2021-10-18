/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage,getMultiLang, ajax, base, toast, high, cardCache, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, pageInfoClick } from './events';
import { afterEvent } from '../card/events';
import { dateformat } from '../../../public/utils.js';
import { constant,requesturl } from '../config/config';
import { buttonVisible } from './events/buttonVisible';
import { commondata } from '../../../public/utils/constant';
import { sourceModel_CMP, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from'../../../public/utils/constant';
import NCCOriginalBalance from'../../../public/restmoney/list/index';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
let { NCFormControl, NCBackBtn, NCAffix, NCDiv } = base;
const { NCUploader, PrintOutput } = high;
let { getCacheById, updateCache, addCache, getCurrentLastId,getNextId, deleteCacheById } = cardCache;
class Card extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pageId = constant.approve_card_pagecode;
		this.tableId = constant.ctablecode;
		this.formId = constant.formcode1;
		this.cacheDataSource = constant.cacheDataSource;
		this.billpk = constant.pk_settlechange;
		this.state = {
			billId:'',//单据id
			billno: '' ,// 单据编号
			showUploader: false,
			target: null,
			outputData: '',
			showOriginal:false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData:[],// 联查余额取数据，将需要联查的数据赋值
			showNCbackBtn: true,
			json: {}, //多语
			inlt: null
		};
		initTemplate.call(this, props);
	}

	//操作列多语不显示
	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			// 将多语资源存储到页面级缓存中
			saveMultiLangRes(this.props,json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}
		// getMultiLang({ moduleId: constant.mutiLangCode, domainName: 'cmp', callback });
		getMultiLang({ 
			moduleId: {
			[constant.module_tmpub_name]: [constant.module_tmpub_id],
			[constant.module_name]: [constant.module_id,constant.mutiLangCode]
			}, 
		callback });
	}

	componentDidMount() {
		this.toggleShow();
		this.renderHtmlByStatus();
	}

	//切换页面状态
	toggleShow = () => {
		buttonVisible(this.props);
	};

	// 根据不同状态渲染不同数据
	renderHtmlByStatus = () =>{

		let flag=false;
		let pk = this.props.getUrlParam('id');
		let data = { pk: pk, pageCode: this.pageId };
		let urlstatus = this.props.getUrlParam('status');
		
		//查询单据详情
		if (urlstatus === 'browse') {
			if(pk){
				let queryData =  { pk: pk, pageCode: this.pageId };
				ajax({
					url: requesturl.querycard,
					data: queryData,
					async: false,
					success: (res) => {
						if (res) {
							if (res.data) {
								this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
								let billno = res.data[this.formId].rows[0].values.vbillno.value;
								// this.setState({ billno: billno });
								this.props.BillHeadInfo.setBillHeadInfoVisible({
									showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
									showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
									billCode: billno
								});
							}
						} else {
							this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						}
					}
				});
			}
		}
	}

	render() {
		let {  form, ncmodal, modal, cardPagination } = this.props;
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		const { createCardPagination } = cardPagination;
		let { createModal } = ncmodal;
		let { showUploader, target,billno,billId } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				{/* <NCAffix> */}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						<div className="header-title-search-area">
							
								{createBillHeadInfo({
									title: this.state.json['36070CPI-000013'],  ///* 国际化处理： 现金缴存*/
									billCode: this.state.billno,//单据号
									// backBtnClick: () => { //返回按钮的点击事件
									// 	this.backClick();
									// }
								})}
						</div>
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'card_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							// popContainer: document.querySelector('.header-button-area')
						})}
					</div>

					<div className="nc-faith-demo-div2">
						{/* 这里是附件上传组件的使用，需要传入三个参数 */}
						{showUploader && <NCUploader
								billId={billId}
								target={target}
								placement={'bottom'}
								billNo={billno}
								onHide={() => {
									this.setState({
										showUploader: false
									})
								}} // 关闭功能
								/>
							}
					</div>
				{/* </NCAffix> */}
				</NCDiv>
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
						expandArr: [ constant.formcode1, constant.formcode2, constant.formcode3],
						onAfterEvent: afterEvent.bind(this)
					})}
				</div>

				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url= {requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				{/* 联查期初余额 */}
				<NCCOriginalBalance
                    // 补录框显示
                    showmodal={this.state.showOriginal}
                    showOriginalData = {this.state.showOriginalData}
                    // 点击确定按钮的回调函数
                    onSureClick={(retOriginalMsg) => {
                        //关闭对话框
                        this.setState({
                            showOriginal: false
                        })
                    }}
                    onCloseClick={() => {
                        //关闭对话框
                        this.setState({
                            showOriginal: false
                        })
                    }}
                >
                </NCCOriginalBalance>

			</div>
		);
	}
}

Card = createPage({
	illinfo:{
        billtype: 'form',
        pagecode: constant.approve_card_pagecode,
        headcode: constant.formcode1
    },
	// initTemplate: initTemplate,
	mutiLangCode: constant.mutiLangCode
})(Card);

ReactDOM.render(<Card />, document.querySelector('#app'));
// export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/