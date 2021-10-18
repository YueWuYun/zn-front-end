/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, getMultiLang, ajax, base, toast, high, cardCache } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { constant, requesturl } from '../config/config';
import { buttonVisible } from './events/buttonVisible';
import { orgVersionUtil } from '../config/orgVersionUtil';
import { setPropCache, saveMultiLangRes, loadMultiLang, createCardWebSocket } from "../../../../tmpub/pub/util/index";

let { NCBackBtn, NCDiv, NCAffix } = base;
let { getCacheById, updateCache, addCache, getCurrentLastId,getNextId, deleteCacheById, setDefData, getDefData } = cardCache;
const { NCUploader, PrintOutput } = high;

class Card extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pageId = constant.cpagecode;
		this.searchId = constant.searchcode;
		this.formId = constant.formcode1;
		this.tableId = constant.ltablecode;
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
				//console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}

		// getMultiLang({ moduleId: {'tmpub':['3601'], 'cmp':['36070', '36140RFD']}, 
		// 	callback: (lang) => {
		// 	//将多语资源数据存储到页面级缓存中
		// 	saveMultiLangRes(this.props, lang);
		// 	//初始化模板
		// 	initTemplate(this.props);
		// }});

		getMultiLang({ 
			moduleId: {
				'tmpub':['3601'],
				'ifac':['36140RFD']
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
				// this.browseRender(pk);
				this.toggleShow();
			}
		}
	}

	// 浏览态数据渲染
	browseRender = (pkbill) =>{
		// let cardData,billstatus,billno,pk_fixredeposit
		let cardData,billno,pk_fixredeposit
		if(pkbill){
			cardData = getCacheById(pkbill, this.cacheDataSource);
			let queryData =  { pk: pkbill, pageCode: this.pageId };
			if(cardData){
				this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId] });

				billno = cardData[this.formId].rows[0].values.vbillcode.value;
				pk_fixredeposit = cardData[this.formId].rows[0].values[this.pkname].value;
				// billstatus = cardData[this.formId].rows[0].values.billstatus.value;
				buttonVisible(this.props);
				this.props.form.setFormStatus(this.formId, 'browse');
				this.setState({ 
					billno: billno,
					addid: pk_fixredeposit,
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
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								billno = res.data.head[this.formId].rows[0].values.vbillcode.value;
								pk_fixredeposit = res.data.head[this.formId].rows[0].values[this.pkname].value;
								// billstatus = res.data[this.formId].rows[0].values.billstatus.value;

								// billno = res.data[this.formId].values.vbillno.value;
								// pk_fixredeposit = res.data[this.formId].values[this.pkname].value;
								// billstatus = res.data[this.formId].rows[0].values.billstatus.value;

								this.setState({ 
									billno: billno,
									addid: pk_fixredeposit,
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

	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let copyFlag = this.props.getUrlParam('copyFlag');
		let id = this.props.getUrlParam('id');
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		
		this.props.form.setFormStatus(this.formId, status);
		this.props.cardTable.setStatus(this.tableId, status);
		
		//查询缓存数据
		let cardData = getCacheById(id, this.cacheDataSource);
		//判断返回箭头是否显示
		if (status == 'browse') {
			if (this.props.getUrlParam('saveres')) {
				toast({ color: 'success', content: this.state.json['36340CDIR-000009']});/* 国际化处理： 保存成功*/
				this.props.setUrlParam({ saveres: false });
			}
		} 

		//查询单据详情
		if (this.props.getUrlParam('status') == 'browse') {
			let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId };
			let that = this;
			if (cardData) {
				this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
				if (cardData.body == null) {
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
				} else {
					this.props.cardTable.setTableData(this.tableId, cardData.body[this.tableId]);
				}
				buttonVisible(this.props);
			} else {
				ajax({
					url: requesturl.querycard,
					data: data,
					success: (res) => {
						if (res.data) {
							let pk_fixredeposit = null;
							if (res.data.head) {
								pk_fixredeposit = res.data.head[this.formId].rows[0].values.pk_fixredeposit.value;
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								let vbillno = res.data.head[this.formId].rows[0].values.vbillcode.value;
								this.setState({
									billno: vbillno,
									vbillno: vbillno
								});
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							// this.props.form.setFormItemsValue(this.formId, { 'pk_intobj.objcode': { value:res.data.head[this.formId].rows[0].values.pk_intobj.value, display: res.data.head[this.formId].rows[0].values.pk_intobj.display } });
							this.props.form.setFormStatus(this.formId, 'browse');
							this.props.cardTable.setStatus(this.tableId, 'browse');
							//处理公式
							// processFormulamsg(this.props, res);
							// if(this.props.getUrlParam('scene') == 'linksce') {
							// 	if(getDefData(pk_fixredeposit, constant.cacheDataSource)){
							// 		updateCache(this.tableId, id, this.formId, constant.cacheDataSource, res.data.head[this.formId].rows[0].values);
							// 	}else{
							// 		addCache(pk_fixredeposit, res.data,this.formId,constant.cacheDataSource);
							// 		setDefData(pk_fixredeposit, constant.cacheDataSource, res.data);
							// 	}
							// }else{
							// 	updateCache(this.tableId, id, this.formId, constant.cacheDataSource, res.data.head[this.formId].rows[0].values);
							// }
							updateCache(this.tableId, id, this.formId, constant.cacheDataSource, res.data.head[this.formId].rows[0].values);
							buttonVisible(this.props);
						} else {
							this.props.form.EmptyAllFormValue(this.formId);
							this.props.cardTable.setTableData(this.tableId, { rows: [] });
						}
					}
				});
			}
		}

		if (this.props.getUrlParam('status') == 'edit') {
			let extParam;
			extParam = { 'uiState': 'edit' };
			let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId, extParam };
			let isBankAcc = true;
			
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							this.props.initMetaByPkorg();
							this.props.form.setFormItemsDisabled(this.formId,{'pk_org':true});
							this.props.form.setFormItemsDisabled(this.formId,{'redepositamount':false}); // 转存原币金额
							let vbillno = res.data.head[this.formId].rows[0].values.vbillcode.value;

							// this.props.form.setFormItemsValue(this.formId, { 'pk_intobj.objcode': { value:res.data.head[this.formId].rows[0].values.pk_intobj.value, display: res.data.head[this.formId].rows[0].values.pk_intobj.display } });
							this.setState({
								billno: vbillno,
								vbillno: vbillno
							});
						}

						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}		
						this.props.form.setFormStatus(this.formId, 'edit');
						this.props.cardTable.setStatus(this.tableId, 'edit');
						//处理公式
//                       	processFormulamsg(this.props, res);				
					} else {
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					buttonVisible(this.props);
				}
			});
		}	
	};

	emptyData = () => {
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.setUrlParam({
			status: 'browse',
			id: null
		});
		buttonVisible(this.props);
		this.setState({ 
			billno: null,
			addid: null,
			showNCbackBtn: true
		});
		//设置卡片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	}

	// processFormulamsg = (props, res)  => {
	// 	    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
	// 	        let tableCode = card_table_id;
	// 	        let obj = {};
	// 	        obj[tableCode] = 'cardTable';
	// 	        props.dealFormulamsg(
	// 	            formulamsg,
	// 	            obj
	// 	     );
	// 	 }
	// }

	// 按钮点击后渲染数据
	buttonAfter(billdata){
	
		let billno = billdata[this.formId].rows[0].values.vbillcode.value;
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
		window.onbeforeunload = null;
		let scene = this.props.getUrlParam("scene");
		this.props.pushTo(constant.listpath,{
			resource:'card',
			scene: scene
		});
	}

	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}

	render() {
		let { form, cardPagination, BillHeadInfo, button } = this.props;
		let { createForm } = form;
		const { createCardPagination } = cardPagination;
		let { showUploader, target, billno, billId } = this.state;
		// const { createBillHeadInfo } = this.props.BillHeadInfo;
		let scene = this.props.getUrlParam("scene");
		let islisttocard = this.props.getUrlParam('islisttocard');
		let showBackBtn = true;
		if(scene && (scene == 'linksce' || scene == 'fip') && islisttocard != 'islisttocard')
		{
				showBackBtn = false;
		}
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: showBackBtn,
			showBillCode: true,
			billCode: billno || billId
		});
		const { createBillHeadInfo } = BillHeadInfo;
		const { createErrorFlag } = button;
		return (
			<div className="nc-bill-card">
				{/**创建websocket */}
				{createCardWebSocket(this.props, {
                    headBtnAreaCode: constant.cbtncode,
                    formAreaCode: constant.formcode1,
                    billpkname: constant.pkname,
					billtype: constant.billtype,
					dataSource: constant.cacheDataSource
                    // serverLocation: '10.16.2.231:9991'
                })}
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
					<div className="header-title-search-area">
						{/* {createBillHeadInfo({
							title: this.state.json['36140RFD-000019'],
							billCode: billno || billId, //单据号
							backBtnClick: () => {           //返回按钮的点击事件
								this.backClick();
							}
						})} */}
						{createBillHeadInfo(
							{
								title: this.state.json['36140RFD-000019'],//标题
								billCode: billno || billId, //单据号
								backBtnClick:  () => {           //返回按钮的点击事件
									this.backClick();
								}
							}
                        )}
					</div>
					
					<div className="header-button-area">
						{createErrorFlag({
                            headBtnAreaCode: constant.cbtncode
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
						onAfterEvent: afterEvent.bind(this)
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

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/