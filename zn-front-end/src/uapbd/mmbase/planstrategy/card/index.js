//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
	createPage,
	ajax,
	base,
	toast,
	high,
	cardCache,
	promptBox,
	createPageIcon,
	getMultiLang
} from 'nc-lightapp-front';
const { NCAffix, NCPopconfirm, NCFormControl, NCBackBtn } = base;
const { PrintOutput } = high;
import { print } from 'nc-lightapp-front';
const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;

const dataSource = 'mmbd.psinfo.planstrategy.data';
const formId = 'bd_planstrategy'; //表头id
const pageId = '10140PST_card'; //pagecode
const queryCardUrl = '/nccloud/mmbd/pst/cardquery.do'; //卡片查询url
const saveUrl = '/nccloud/mmbd/pst/save.do'; //新增保存
const updateUrl = '/nccloud/mmbd/pst/updatesave.do'; //修改保存
const deleteUrl = '/nccloud/mmbd/pst/delete.do'; //删除
const isRef = '/nccloud/mmbd/pst/isReferenced.do'; //修改默认教验
const isDefault = '/nccloud/mmbd/pst/queryDefault.do'; //关于默认教验
const pk_item = 'pk_pst'; //单据主键--用于卡片查询刷新
const printUrl = '/nccloud/mmbd/pst/pstPrint.do';

//全局变量，为了设置行政区划参照的范围
let gCurrCountry = null;

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;

		this.state = {
			pk_org: null,
			totalcount: 0,
			applycount: 0,
			backVisible: true,
			json: {}
		};
	}

	initTemplate = (props) => {
		props.createUIDom(
			{
				pagecode: pageId //页面id
				// appid: appId,//注册按钮的id
				// appcode: '10140PST'
			},
			(data) => {
				if (data) {
					if (data.template) {
						let meta = data.template;
						this.modifierMeta(props, meta);
						props.meta.setMeta(meta);
					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button);
						this.toggleShow();
					}
				}
			}
		);
	};

	modifierMeta(props, meta) {
		let status = props.getUrlParam('status');
		meta[formId].status = status;
		return meta;
	}

	componentDidMount() {
		let callback = (json) => {
			this.setState({ json }, () => {
				this.initTemplate(this.props);
			});
		};
		this.props.MultiInit.getMultiLang({ moduleId: '10140PST', domainName: 'uapbd', callback });

		//this.toggleShow();

		let status = this.props.getUrlParam('status');
		let pk_org = this.props.getUrlParam('pk_org');
		this.setState({
			pk_org: pk_org
		});
		if (status != 'add') {
			let pk = this.props.getUrlParam('id');
			if (pk && pk != 'undefined') {
				this.getdata(pk);
			}
		} else {
			this.props.form.setFormItemsValue(this.formId, {
				pk_org: { value: pk_org.refpk, display: pk_org.refname }
			});
			this.setDefaultValue();
		}

		if (status == 'add' || status == 'edit') {
			//点击修改或者新增进入的时候，返回按钮不可见
			this.setState({
				backVisible: false
			});
		}
	}

	componentWillUnmount() {
		gCurrCountry = null;
	}

	//切换页面状态
	toggleShow(enableState = 2) {
		let status = this.props.getUrlParam('status');
		let id = this.props.getUrlParam('id');
		//按钮的显示状态
		let visibleButtons = [];
		let unvisibleButtons = [];
		if (status == 'browse' && id == 'null') {
			visibleButtons = [ 'Add' ];
			unvisibleButtons = [ 'Edit', 'back', 'Delete', 'Refresh', 'Print', 'Output', 'Save', 'Cancel' ];
		} else if (status == 'edit' || status == 'add') {
			unvisibleButtons = [ 'Edit', 'Add', 'Delete', 'Refresh' ];
			visibleButtons = [ 'Save', 'Cancel' ];
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
		} else {
			unvisibleButtons = [ 'Save', 'Cancel', 'AddLine', 'DelLine' ];
			visibleButtons = [ 'Add', 'Edit', 'Delete', 'back', 'Refresh', 'Print', 'Output' ];
			if (enableState == 2) {
				visibleButtons.push('Disable');
				unvisibleButtons.push('Enable');
			} else {
				visibleButtons.push('Enable');
				unvisibleButtons.push('Disable');
			}
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
		}
		this.props.form.setFormStatus(formId, status);
		this.props.button.setButtonVisible(unvisibleButtons, false);
		this.props.button.setButtonVisible(visibleButtons, true);

		//添加浏览器窗口关闭监听事件
		if (status != 'add' && status != 'edit') {
			window.onbeforeunload = null;
		} else {
			window.onbeforeunload = () => {
				//编辑态关闭页签或浏览器的提示
				return '';
			};
		}
	}

	setDefaultValue = () => {
		let info = window.parent.GETBUSINESSINFO();
		this.props.form.setFormItemsValue(this.formId, { pk_group: { value: info.groupId, display: info.groupName } });
		// this.props.form.setFormItemsValue(this.formId,{'bill_status':{value:'0',display:this.state.json['10140PST-000001']}});/* 国际化处理： 自由态*/
		// this.props.form.setFormItemsValue(this.formId,{'enablestate':{value:'2',display:this.state.json['10140PST-000002']}});/* 国际化处理： 已启用*/
		// this.props.form.setFormItemsValue(this.formId,{'dataoriginflag':{value:'0',display:this.state.json['10140PST-000003']}});/* 国际化处理： 本级产生*/
	};

	buttonClick = (props, id) => {
		let _this = this;
		switch (id) {
			case 'Add':
				props.form.EmptyAllFormValue(this.formId);
				props.pushTo('/card', {
					status: 'add',
					id: props.getUrlParam('id')
				});
				this.setDefaultValue();
				this.props.form.setFormItemsValue(this.formId, {
					pk_org: { value: this.state.pk_org.refpk, display: this.state.pk_org.refname }
				});
				this.toggleShow();
				//特殊设置一下返回按钮的可见性
				this.setState({
					backVisible: false
				});
				break;
			case 'Edit':
				props.pushTo('/card', {
					status: 'edit',
					id: props.getUrlParam('id')
				});
				this.toggleShow();

				//设置一下修改时根据国家地区设置行政区划参照的参照范围
				let currCountry = this.props.form.getFormItemsValue(this.formId, 'pk_country');
				let meta = props.meta.getMeta();
				//特殊设置一下返回按钮的可见性
				this.setState({
					backVisible: false
				});
				break;
			case 'Delete':
				//this.props.modal.show('delete');
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140PST-000004'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
					content: this.state.json['10140PST-000005'], // 提示内容,非必输/* 国际化处理： 确认删除？*/
					noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false, // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140PST-000006'], // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140PST-000007'], // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.delConfirm.bind(this) // 确定按钮点击调用函数,非必输
				});
				break;
			case 'Back':
				props.pushTo('/list', {
					pk_org: this.state.pk_org
				});
				break;
			case 'Save':
				this.saveClick();
				break;
			case 'Cancel':
				//this.props.modal.show('cancel')
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140PST-000008'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
					content: this.state.json['10140PST-000009'], // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
					noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false, // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140PST-000006'], // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140PST-000007'], // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.cancelSureEvent.bind(this) // 确定按钮点击调用函数,非必输
				});
				break;

			case 'Refresh':
				// props.pushTo('/card', {
				// 	status:props.getUrlParam('status'),
				// 	id:props.getUrlParam('id')
				// })
				this.getdata(this.props.getUrlParam('id'), () => {
					toast({ title: this.state.json['10140PST-000013'], color: 'success' }); /* 国际化处理： 刷新成功！*/
				});
				break;
			case 'Print':
				this.output('print');
				break;
			case 'Output':
				let pks = [];
				pks.push(this.props.getUrlParam('id'));
				this.setState(
					{
						pks: pks
					},
					() => {
						this.refs.printOutput.open();
					}
				);
				break;
			default:
				break;
		}
	};

	output(type = '') {
		let pks = [];
		pks.push(this.props.getUrlParam('id'));
		//原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
		if (type != '') {
			//打印
			print('pdf', printUrl, {
				funcode: /*this.props.config.funcode*/ '10140PST', //功能节点编码
				nodekey: 'pstprint', //模板节点标识
				oids: pks,
				outputType: type
			});
		}
	}

	cancelSureEvent() {
		if (this.props.getUrlParam('status') === 'add') {
			let pk = getCurrentLastId(dataSource);
			this.getDataForCache(pk, () => {
				//编辑态取消时，修正一下页面状态
				this.props.pushTo('/card', {
					status: 'browse',
					id: this.props.getUrlParam('id')
				});
				this.props.form.setFormStatus(this.formId, 'browse');
			});
		}
		if (this.props.getUrlParam('status') === 'edit') {
			this.props.form.cancel(this.formId);
			this.props.pushTo('/card', {
				status: 'browse',
				id: this.props.getUrlParam('id')
			});
			//let enableState = this.props.form.getFormItemsValue(this.formId,'enablestate')
			this.toggleShow();
		}
		//特殊设置一下返回按钮的可见性
		this.setState({
			backVisible: true
		});
	}

	pageInfoClick = (props, pk) => {
		this.getDataForCache(pk);
	};

	afterEvent(props, moduleId, key, value, oldValue) {
		if (key != 'pk_country' || value.value == oldValue.value) {
			return;
		}

		//修正一下行政区划的参照的过滤
		let meta = props.meta.getMeta();
	}

	//通过单据id查询单据信息
	getdata = (pk, callback) => {
		let data = { pk };
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				if (res.data.head) {
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					this.toggleShow();

					//设置一下修改时根据国家地区设置行政区划参照的参照范围
					let currCountry = res.data.head[this.formId].rows[0].values.pk_country;
					let meta = this.props.meta.getMeta();

					//放入缓存
					updateCache(
						pk_item,
						res.data.head[formId].rows[0].values[pk_item].value,
						res.data,
						formId,
						dataSource
					);
				}

				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg, {
						[formId]: 'form'
					});
				}

				if (callback && typeof callback == 'function') {
					callback.call(this);
				}
			}
		});
	};

	onCardTableAfterEvent(props, moduleId, key, value, changedrows, index, record) {
		if (changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
			let setObj = {};
			setObj.value = record.values.pk_region.value;
			setObj.display = value.refname;
			record.values.pk_region.display = value.refcode;
		}
	}

	//保存单据
	saveClick = () => {
		let status = this.props.getUrlParam('status');
		let bisdefault = this.props.form.getFormItemsValue(this.formId, 'bisdefault').value;
		let fplanpurpose = this.props.form.getFormItemsValue(this.formId, 'fplanpurpose');
		let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
		let pk_pst = this.props.form.getFormItemsValue(this.formId, 'pk_pst');
		let isNeed = false;
		if (bisdefault) {
			if (status === 'add') {
				isNeed = true;
			} else if (status === 'edit') {
				let postdata = {
					fplanpurpose: fplanpurpose.value,
					id: pk_pst.value
				};
				ajax({
					url: isRef,
					data: postdata,
					async: false,
					success: (res) => {
						isNeed = res.data.isneed;
					}
				});
			}
		}
		if (isNeed) {
			let isNeed2 = false;
			ajax({
				url: isDefault,
				data: {
					pk_org: pk_org.value,
					id: pk_pst.value,
					fplanpurpose: fplanpurpose.value
				},
				async: false,
				success: (res) => {
					isNeed2 = res.data.isneed2;
				}
			});
			if (isNeed2) {
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					content:
						this.state.json['10140PST-000001'] +
						':' +
						pk_org.display +
						',' +
						this.state.json['10140PST-000002'] +
						':' +
						fplanpurpose.display +
						',' +
						this.state.json['10140PST-000003'], // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
					noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false, // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140PST-000006'], // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140PST-000007'], // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.beSure.bind(this), // 确定按钮点击调用函数,非必输
					cancelBtnClick: this.beCancel.bind(this)
				});
			} else {
				this.confirmSave();
			}
		} else {
			this.confirmSave();
		}
	};
	beSure() {
		this.confirmSave();
	}
	async beCancel() {
		await this.props.form.setFormItemsValue(this.formId, { bisdefault: { display: null, value: false } });
		this.confirmSave();
	}

	confirmSave() {
		if (!this.props.form.isCheckNow(formId, 'warning')) {
			return;
		}

		let status = this.props.getUrlParam('status');
		let CardData = this.props.createMasterChildData(pageId, this.formId);
		let url = saveUrl; //新增保存
		if (status === 'edit') {
			url = updateUrl; //修改保存
		}
		this.props.validateToSave(
			CardData,
			() => {
				ajax({
					url: url,
					data: CardData,
					success: (res) => {
						let pk_value = null;
						if (res.success) {
							if (res.data) {
								if (res.data.head && res.data.head[this.formId]) {
									this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
									pk_value = res.data.head[this.formId].rows[0].values[pk_item].value;
								}
							} else {
								pk_value = res.data.head[this.formId].rows[0].values[pk_item].value;
							}
							this.props.pushTo('/card', {
								status: 'browse',
								id: pk_value
							});
							this.getdata(pk_value);
							//特殊设置一下返回按钮的可见性
							this.setState({
								backVisible: true
							});

							//更正缓存
							if (url == saveUrl) {
								//新增保存
								addCache(pk_value, res.data, this.formId, dataSource);
							} else {
								//修改保存
								updateCache(
									pk_item,
									res.data.head[formId].rows[0].values[pk_item].value,
									res.data,
									formId,
									dataSource
								);
							}
							toast({ content: this.state.json['10140PST-000018'], color: 'success' }); /* 国际化处理： 保存成功*/
						}
					}
				});
			},
			{ head: formId }
		);
	}

	getDataForCache(pk, callback) {
		if (!pk) {
			this.props.setUrlParam({ id: 'null', status: 'browse' });
			this.toggleShow();
			return;
		}
		let cardData = getCacheById(pk, dataSource);
		if (cardData) {
			this.props.form.setAllFormValue({ [formId]: cardData.head[formId] });
			this.props.setUrlParam(pk); //动态修改地址栏中的id的值
		} else {
			this.getdata(pk);
			this.props.setUrlParam(pk); //动态修改地址栏中的id的值
		}

		if (callback && typeof callback == 'function') {
			callback.call(this);
		}

		//将更新按钮状态的调用延后到callback之后，否则新增取消的时候显示的还是编辑态的按钮
		if (cardData) {
			this.toggleShow();
		}
	}

	//删除单据
	delConfirm = () => {
		ajax({
			url: deleteUrl,
			data: {
				param: [
					{
						id: this.props.getUrlParam('id'),
						ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
					}
				]
			},
			success: (res) => {
				if (res.data.sucessNum == 1) {
					let id = this.props.getUrlParam('id');

					//根据当前id,获取下个id
					/*
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					let nextId = getNextId(id, dataSource);

					//调用删除缓存数据方法
					/*
					* idname: 数据主键的命名
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					deleteCacheById(pk_item, id, dataSource);

					this.getDataForCache(nextId, () => {
						//this.props.cardPagination.setCardPaginationId({id: nextId,status: 1})
						toast({ color: 'success', title: this.state.json['10140PST-000019'] }); /* 国际化处理： 删除成功！*/
					});
				}
			}
		});
	};

	modelSave = (props) => {
		this.saveClick();
	};

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		const { createCardPagination } = cardPagination;
		const { createBillHeadInfo } = this.props.BillHeadInfo
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp } = button;
		let { createModal } = modal;
		let status = this.props.getUrlParam('status');
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<div className="nc-bill-header-area">							
							<div className='header-title-search-area'>
								<span>
									{createBillHeadInfo({
										title: this.state.json['10140PST-000029'],
										backBtnClick: ()=>{
											this.buttonClick.call(this, this.props, 'Back')
										}
									})}
								</span>
							</div>

							<div className="header-button-area">
								{createButtonApp({
									area: 'header-action', //按钮注册中的按钮区域
									onButtonClick: this.buttonClick.bind(this)
									//popContainer: document.querySelector('.header-button-area')
								})}
								{createCardPagination({
									handlePageInfoChange: this.pageInfoClick.bind(this),
									dataSource: dataSource
								})}
							</div>
						</div>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							onAfterEvent: this.afterEvent.bind(this),
							expandArr: [ 'auditinfo', 'demanSrc', 'supplySrc' ]
						})}
					</div>
				</div>

				<PrintOutput
					ref="printOutput"
					url={printUrl}
					data={{
						funcode: '10140PST',
						nodekey: 'pstprint',
						oids: this.state.pks,
						outputType: 'output'
					}}
				/>
			</div>
		);
	}
}

Card = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: pageId,
		headcode: formId
	},
	initTemplate: []
})(Card);

export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65