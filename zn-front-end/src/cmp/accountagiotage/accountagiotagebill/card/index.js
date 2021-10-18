/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, getMultiLang, ajax, base, toast, high, cardCache } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { constant, requesturl } from '../config/config';
import { buttonVisible } from './events/buttonVisible';
import NCCOriginalBalance from'../../../public/restmoney/list/index';
import { orgVersionUtil } from '../config/orgVersionUtil';
import { setPropCache, saveMultiLangRes, loadMultiLang,createCardWebSocket } from "../../../../tmpub/pub/util/index";
let { NCBackBtn, NCDiv, NCAffix } = base;
let { getCacheById, updateCache, addCache, getCurrentLastId,getNextId, deleteCacheById } = cardCache;
const { NCUploader, PrintOutput } = high;

class Card extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pageId = constant.cpagecode;
		this.searchId = constant.searchcode;
		this.formId = constant.formcode1;
		this.cacheDataSource = constant.cacheDataSource;
		this.pkname = constant.pkname;
		this.state = {
			billId:'',//单据id
			billno: '' ,// 单据编号
			addid: '',
			oldorg:'',
			oldorgDis:'',
			showUploader: false, // 附件弹框
			target: null,
			outputData: '', // 输出数据
			showOriginal:false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData:[],// 联查余额取数据，将需要联查的数据赋值给我
			showNCbackBtn: true, // 返回按钮
			json: {}, // 多语
			inlt: null
		};
	}

	//浏览器页签关闭提示
	componentWillMount() {

		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			saveMultiLangRes(this.props,json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}

		// getMultiLang({ moduleId: {'tmpub':['3601'], 'cmp':['36070', '36070AB']}, 
		// 	callback: (lang) => {
		// 	//将多语资源数据存储到页面级缓存中
		// 	saveMultiLangRes(this.props, lang);
		// 	//初始化模板
		// 	initTemplate(this.props);
		// }});

		getMultiLang({ 
			moduleId: {
				'tmpub':['3601'],
				'cmp':['36070', '36070AB']
			}, 
		callback });

		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '';
			}
		}
	}

	componentDidMount() {
		this.renderHtmlByStatus();
	}

	// 根据不同状态渲染不同数据
	renderHtmlByStatus = () =>{
		let flag=false;
		let pk = this.props.getUrlParam('id');
		let data = { pk: pk, pageCode: this.pageId };
		let urlstatus = this.props.getUrlParam('status');
		// orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
		let statusflag = urlstatus === 'browse' ? false : true;
		if(statusflag){
			this.setState({ showNCbackBtn: false});
			buttonVisible(this.props);
			//设置看片翻页的显隐性
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag);
		}

		//查询单据详情
		if (urlstatus === 'browse') {
			if(pk){
				this.browseRender(pk);
			}
		}
	}

	// 浏览态数据渲染
	browseRender = (pkbill) =>{
		// let cardData,billstatus,billno,pk_accountagiotage
		let cardData,billno,pk_accountagiotage
		if(pkbill){
			cardData = getCacheById(pkbill, this.cacheDataSource);
			let queryData =  { pk: pkbill, pageCode: this.pageId };
			if(cardData){
				this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId] });

				billno = cardData[this.formId].rows[0].values.vbillno.value;
				pk_accountagiotage = cardData[this.formId].rows[0].values[this.pkname].value;
				// billstatus = cardData[this.formId].rows[0].values.billstatus.value;
				buttonVisible(this.props);
				this.props.form.setFormStatus(this.formId, 'browse');

				this.setState({ 
					billno: billno,
					addid: pk_accountagiotage,
					showNCbackBtn: true
					});
				orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
			}else{
				ajax({
					url: requesturl.querycard,
					data: queryData,
					success: (res) => {
						if (res) {
							if (res.data) {
								this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
								billno = res.data[this.formId].rows[0].values.vbillno.value;
								pk_accountagiotage = res.data[this.formId].rows[0].values[this.pkname].value;
								// billstatus = res.data[this.formId].rows[0].values.billstatus.value;

								// billno = res.data[this.formId].values.vbillno.value;
								// pk_accountagiotage = res.data[this.formId].values[this.pkname].value;
								// billstatus = res.data[this.formId].rows[0].values.billstatus.value;

								this.setState({ 
									billno: billno,
									addid: pk_accountagiotage,
									showNCbackBtn: true
								});
								buttonVisible(this.props);
								this.props.form.setFormStatus(this.formId, 'browse');
								orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
							}else{
								this.emptyData();
							}
						} else {
							this.emptyData();
						}
					}
				});
			}
		}else{
			this.emptyData();
		}
		
	}

	emptyData = () => {
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.setUrlParam({
			status: 'browse',
			id: null
		});
		buttonVisible(this.props);
		this.setState({ 
			billno: this.state.billno,
			addid: null,
			showNCbackBtn: true
		});
		//设置卡片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	}

	// 按钮点击后渲染数据
	buttonAfter(billdata){
	
		let billno = billdata[this.formId].rows[0].values.vbillno.value;
		let id = billdata[this.formId].rows[0].values[this.pkname].value;
		// let billstatus = billdata[this.formId].rows[0].values.billstatus.value;

		// 更新缓存
		updateCache(this.pkname,id,billdata,this.formId,this.cacheDataSource, billdata[this.formId].rows[0].values);

		this.setState({
			billno: billno,
			showNCbackBtn: true
		});
		//动态修改地址栏中的id的值
		this.props.setUrlParam({
			status: 'browse',
			id: id
		});
		this.props.form.setAllFormValue({
			[this.formId]: billdata[this.formId]
		});
		this.props.form.setFormStatus(this.formId, 'browse');
		// buttonVisible(this.props, billstatus);
		buttonVisible(this.props);
	}

	// 更改组织确认按钮
	ortBeSureBtnClick = () => {
		
	};

	// 组织修改取消
	orgCancelBtnClick = () => {
		this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value:this.state.oldorg, display: this.state.oldorgDis } });
		this.props.form.setFormStatus(this.formId, 'edit');
	};

	// 更改组织清空输入数据
	orgchangecleandata = () => {

	}

	// 清空组织，清空其他数据
	emptyorgcleandata = () =>{
		this.orgchangecleandata();
	}
	
	// 取消弹框取消按钮操作
	cancelModalCancel = () => {

	};
	
	// 返回方法
	backClick = () =>{
		// window.onbeforeunload = null;
		// this.props.pushTo(constant.listpath,{
		// 	resource:'card'
		// });
		window.onbeforeunload = null;
		this.props.pushTo(constant.listpath,{
			pagecode: constant.lpagecode,
		});
	}

	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}

	render() {
		let { form, cardPagination,BillHeadInfo } = this.props;
		let { createForm } = form;
		const { createCardPagination } = cardPagination;
		let { showUploader, target, billno, billId } = this.state;
		let scene = this.props.getUrlParam('scene');
		// const { createBillHeadInfo } = this.props.BillHeadInfo;
		if(scene){
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: billno || billId
			});
		}else{
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true,
			showBillCode: true,
			billCode: billno || billId
		});
	}
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-card">
			{/* <div className="nc-bill-top-area"> */}
				 {/**创建websocket */}
				 {createCardWebSocket(this.props, {
                    headBtnAreaCode: 'card_head',
                    formAreaCode: constant.formcode1,
                    billpkname: constant.pkname,
                    billtype: constant.billtype,
					// serverLocation: '10.16.2.231:9991'
					dataSource:constant.cacheDataSource
                })}
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
					<div>
						{/* {createBillHeadInfo({
							title: this.state.json['36070AB-000019'],
							billCode: billno || billId, //单据号
							backBtnClick: () => {           //返回按钮的点击事件
								this.backClick();
							}
						})} */}
						{createBillHeadInfo(
							{
								title: this.state.json['36070AB-000019'],//标题
								billCode: this.state.billno, //单据号
								backBtnClick:  () => {           //返回按钮的点击事件
									this.backClick();
								}
							}
                        )}
					</div>
					{/** 渲染按钮 **/}
					<div className="header-button-area">
					{this.props.button.createErrorFlag({
                         headBtnAreaCode: 'card_head'
                                })}
						{this.props.button.createButtonApp({
							area: 'card_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
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
								onHide={this.onHideUploader} // 关闭功能
								/>
						}
					</div>
					<div className="header-cardPagination-area" style={{ float: 'right' }}>
						{createCardPagination({
							handlePageInfoChange: pageInfoClick.bind(this),
							dataSource: this.cacheDataSource
						})}
					</div>
				</NCDiv>
				</NCAffix>
				{/* 设置卡片展开于隐藏 默认隐藏 */}
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
						// expandArr: [ this.formId, constant.formcode2 ],
						// onAfterEvent: afterEvent.bind(this)
					})}
				</div>

				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url={requesturl.print}
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
        pagecode: constant.cpagecode,
        headcode: constant.formcode1
    },
	// initTemplate: initTemplate,
	// mutiLangCode: constant.mutiLangCode
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/