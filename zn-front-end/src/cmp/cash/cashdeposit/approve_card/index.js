/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, getMultiLang, base, ajax, high, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate } from './events';
import { constant, requesturl } from '../config/config';
import { buttonVisible } from './events/buttonVisible';
import { orgVersionUtil } from '../config/orgVersionUtil'
const { NCUploader, ApproveDetail, PrintOutput } = high;
import NCCOriginalBalance from'../../../public/restmoney/list/index';
import { saveMultiLangRes ,createCardWebSocket} from '../../../../tmpub/pub/util';
let { NCAffix,NCDiv } = base;
class Card extends Component {
	constructor(props) {
		super(props);
		this.pageId = constant.approve_card_pagecode;
		this.tableId = constant.ctablecode;
		this.searchId = constant.searchcode;
		this.formId = constant.formcode1;
		this.moduleId = constant.mutiLangCode;
		this.pkname = constant.pkname;
		this.state = {
			billId:'',//单据id
			billno: '' ,// 单据编号
			oldorg:'',
			oldorgDis:'',
			showUploader: false,
			target: null,
			approveshow: false,
			addid: '',
			outputData: '',
			showOriginal:false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData:[], // 联查余额取数据，将需要联查的数据赋值给我
			json: {}, // 多语
			inlt: null
		};
		// initTemplate.call(this, props);
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
		this.renderHtmlByStatus();
		this.toggleShow();
	}
	//切换页面状态
	toggleShow = () => {
	
		buttonVisible(this.props);
		orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
	};
	// 根据不同的状态渲染不同的页面数据
	renderHtmlByStatus = () =>{
		let pk = this.props.getUrlParam('id');
		let urlstatus = this.props.getUrlParam('status');
		//查询单据详情
		if (urlstatus === 'browse') {
			if(pk){
				let billno,pk_cashdeposit
				let queryData =  { pk: pk, pageCode: this.pageId };
				ajax({
					url: requesturl.querycard,
					data: queryData,
					success: (res) => {
						if (res) {
							if (res.data) {
								this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
								billno = res.data[this.formId].rows[0].values.billno.value;
								pk_cashdeposit = res.data[this.formId].rows[0].values[this.pkname].value;
								this.setState({ 
									// billno: ':'+billno,
									addid: pk_cashdeposit
								});
								this.props.BillHeadInfo.setBillHeadInfoVisible({
									showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
									showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
									billCode: billno
								});
								buttonVisible(this.props);
								this.props.form.setFormStatus(this.formId, 'browse');
							}else{
								this.props.form.EmptyAllFormValue(this.formId);
								this.props.setUrlParam({
									status: 'browse'
								});
								buttonVisible(this.props);
								this.setState({ 
									billno: null
								});
								this.props.BillHeadInfo.setBillHeadInfoVisible({
									showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
									showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
									// billCode: billno
								});
								this.props.form.setFormStatus(this.formId, 'browse');

							}
						} else {
							this.props.form.EmptyAllFormValue(this.formId);
							this.props.setUrlParam({
								status: 'browse'
							});
								buttonVisible(this.props);
								
								this.props.BillHeadInfo.setBillHeadInfoVisible({
									showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
									showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
									// billCode: billno
								});
						}
					}
				});
			}
		}

	}

	render() {
		let { form } = this.props;
		let { createForm } = form;
		let { showUploader, target,billno,billId } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
			 {/**创建websocket */}
			 {createCardWebSocket(this.props, {
                    headBtnAreaCode: 'card_head',
                    formAreaCode: constant.formcode1,
                    billpkname: constant.pkname,
					billtype: constant.billtype,
					dataSource:constant.cacheDataSource
                    //serverLocation: '10.16.2.231:9991'
                })}
				{/* <NCAffix> */}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
					<div className="header-title-search-area">
					
							{createBillHeadInfo({
								title: this.state.json['36070DC-000018'],  ///* 国际化处理： 现金缴存*/
								billCode: this.state.billno,//单据号
								// backBtnClick: () => { //返回按钮的点击事件
								// 	this.backClick();
								// }
							})}
					</div>
					
					<div className="header-button-area">
					{this.props.button.createErrorFlag({
                                    headBtnAreaCode: 'card_head'
                                })}
						{this.props.button.createButtonApp({
							area: 'card_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							// popContainer: document.querySelector('.header-button-area')
						})}
					</div>
					{/* 附件 */}
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
				{/* 设置卡片展开于隐藏 默认隐藏  */}
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
						expandArr: [ this.formId, constant.formcode2 ]
					})}
				</div>

				{/* 联查审批意见 */}
				<div>
                	<ApproveDetail
                    	show={this.state.approveshow}
                    	close={() =>{
							this.setState({
								approveshow: false
							})
						}}
                   		billtype={constant.billtype}
                    	billid={billId}
                	/>
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
	billinfo:{
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