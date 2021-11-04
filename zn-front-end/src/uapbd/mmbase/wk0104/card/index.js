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
	getMultiLang,
	print
} from 'nc-lightapp-front';
import { getLangByResId } from '../../public/tools/multiLangUtil';
const { NCAffix, NCPopconfirm, NCFormControl, NCBackBtn } = base;
const { PrintOutput } = high;
const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
const dataSource = 'mmbd.wk.wk0104.data';
const formId = 'wk_card'; //表头id
const pageId = '10140WK_card'; //pagecode
const getOrgVid = '/nccloud/mmbd/pub/queryOrgVid.do';
const queryCardUrl = '/nccloud/mmbd/wk/cardquery.do'; //卡片查询url
const saveUrl = '/nccloud/mmbd/wk/save.do'; //新增保存
const updateUrl = '/nccloud/mmbd/wk/updatesave.do'; //修改保存
const deleteUrl = '/nccloud/mmbd/wk/delete.do'; //删除
const changeEnableStatus = '/nccloud/mmbd/wk/changeable.do';
const pk_item = 'cwkid'; //单据主键--用于卡片查询刷新
const titleCode = 'vwkcode'; //单据编码--用于卡片表头显示
const printUrl = '/nccloud/mmbd/wk/print.do';
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		this.old_pk_org = '';
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
				pagecode: pageId
			},
			(data) => {
				if (data) {
					let meta = data.template;
					if (data.template) {
						this.modifierMeta(props, meta);
						props.meta.setMeta(meta);
					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button);
					}
					//工厂默认值
					if (data.context.pk_org) {
						this.props.form.setFormItemsValue(formId, {
							pk_org: { value: data.context.pk_org, display: data.context.org_Name }
						});
						this.toggleShow(false);
						this.setState({
							pk_org: { value: data.context.pk_org, display: data.context.org_Name }
						});
					} else {
						this.toggleShow();
					}
				}
			}
		);
	};

	modifierMeta(props, meta) {
		let status = props.getUrlParam('status');
		meta[formId].status = status;
		if (status != 'add') {
			props.form.setFormItemsDisabled(formId, { pk_org: true, vwkcode: true });
		} else {
			this.setItemDisabled(true);
			props.form.setFormItemsDisabled(formId, { pk_org: false });
		}
		meta[formId].items.map((item) => {
			if (item.attrcode == 'pk_org') {
				item.queryCondition = () => {
					return { GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' };
				};
			}
			if (item.attrcode == 'cwkclassid') {
				item.isDataPowerEnable = false;
				item.queryCondition = () => {
					return { pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,enablestate:2 }; // 根据pk_org过滤
				};
			}
			if (item.attrcode == 'cdeptid') {
				item.isDataPowerEnable = false;
				item.queryCondition = () => {
					return { pk_org: props.form.getFormItemsValue(formId, 'pk_org').value, busifuncode: 'fa' }; // 根据pk_org过滤
				};
			}
		});
		return meta;
	}
	// 未选择工厂，表单其他项不可编辑
	setItemDisabled(disabled) {
		this.props.form.setFormItemsDisabled(formId, {
			vwkcode: disabled,
			vwkname: disabled,
			cwkclassid: disabled,
			cdeptid: disabled,
			vnote: disabled
		});
	}

	componentDidMount() {
		let callback = (json) => {
			this.setState({ json }, () => {
				this.initTemplate(this.props);
			});
		};
		this.props.MultiInit.getMultiLang({ moduleId: '10140WK', domainName: 'uapbd', callback });

		let status = this.props.getUrlParam('status');
		if (status != 'add') {
			let pk = this.props.getUrlParam('id');
			this.props.cardPagination.setCardPaginationId({ id: this.props.getUrlParam('id'), status: 0 });
			if (pk && pk != 'undefined') {
				this.getdata(pk);
			}
		} else {
			let pk = this.props.getUrlParam('id');
			if (pk && pk != 'undefined') {
				this.handleCopy(pk);
			} else {
				this.setDefaultValue();
				this.setItemDisabled(true);
				this.props.form.setFormItemsDisabled(formId, { pk_org: false });
			}
		}
		if (status == 'add' || status == 'edit') {
			//点击修改或者新增进入的时候，返回按钮不可见
			this.setState({
				backVisible: false
			});
		}
	}

	//切换页面状态
	toggleShow(enableState) {
		let status = this.props.getUrlParam('status');
		if (status == 'add' && enableState != 'copy') {
			this.props.form.setFormItemsDisabled(this.formId, { pk_org: false });
			this.setItemDisabled(!enableState ? false : true);
		}
		if (status == 'edit') {
			this.setItemDisabled(false);
			this.props.form.setFormItemsDisabled(formId, { pk_org: true, vwkcode: true });
		}
		//按钮的显示状态
		let visibleButtons = [];
		let unvisibleButtons = [];
		if (status == 'edit' || status == 'add') {
			unvisibleButtons = [
				'Edit',
				'Add',
				'back',
				'Delete',
				'Copy',
				'Refresh',
				'Enable',
				'Disable',
				'Print',
				'Output'
			];
			visibleButtons = [ 'Save', 'Cancel' ];
			if (status == 'add') {
				visibleButtons.push('SaveAdd');
			} else {
				unvisibleButtons.push('SaveAdd');
			}
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			this.props.form.setFormItemsDisabled(formId, {
				creator: true,
				creationtime: true,
				modifier: true,
				modifiedtime: true
			});
		} else {
			unvisibleButtons = [ 'Save', 'SaveAdd', 'Cancel' ];
			visibleButtons = [ 'Add', 'Edit', 'Delete', 'Copy', 'back', 'Refresh', 'Print', 'Output' ];
			if (!enableState) {
				enableState = this.props.form.getFormItemsValue(this.formId, 'enablestate').value;
			}
			if (enableState == 2) {
				unvisibleButtons.push('Enable');
				visibleButtons.push('Disable');
			} else if (enableState == 3) {
				unvisibleButtons.push('Disable');
				visibleButtons.push('Enable');
			}
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
		}
		this.props.button.setButtonVisible(unvisibleButtons, false);
		this.props.button.setButtonVisible(visibleButtons, true);
		this.props.form.setFormStatus(formId, status);
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
	//设置默认值
	setDefaultValue = () => {
		let info = window.parent.GETBUSINESSINFO();
		this.props.form.setFormItemsValue(this.formId, { pk_group: { value: info.groupId, display: info.groupName } });

		if (
			this.props.form.getFormItemsValue(formId, 'pk_org') &&
			this.props.form.getFormItemsValue(formId, 'pk_org').value
		) {
			ajax({
				url: getOrgVid,
				data: { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value },
				success: (res) => {
					this.props.form.setFormItemsValue(formId, {
						pk_org_v: { value: res.data[this.props.form.getFormItemsValue(formId, 'pk_org').value] }
					});
				}
			});
		}
	};
	//按钮点击
	buttonClick = (props, id) => {
		switch (id) {
			case 'Add':
				let state = true;
				props.form.EmptyAllFormValue(this.formId);
				props.pushTo('/card', {
					status: 'add',
					id: props.getUrlParam('id')
				});
				if (this.state.pk_org) {
					state = false;
					this.props.form.setFormItemsValue(formId, {
						pk_org: { ...this.state.pk_org }
					});
				}
				this.setDefaultValue();
				this.toggleShow(state);
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
				//特殊设置一下返回按钮的可见性
				this.setState({
					backVisible: false
				});
				break;
			case 'Delete':
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140WK-000004'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
					content: this.state.json['10140WK-000005'], // 提示内容,非必输/* 国际化处理： 确认删除？*/
					noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false, // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140WK-000006'], // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140WK-000007'], // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.delConfirm.bind(this) // 确定按钮点击调用函数,非必输
				});
				break;
			case 'Copy':
				props.form.EmptyAllFormValue(this.formId);
				props.pushTo('/card', {
					status: 'add',
					id: props.getUrlParam('id')
				});
				this.toggleShow('copy');
				this.handleCopy(props.getUrlParam('id'));
				//特殊设置一下返回按钮的可见性
				this.setState({
					backVisible: false
				});
				break;
			case 'Back':
				props.pushTo('/list', {});
				break;
			case 'Save':
				if (
					props.form.getFormItemsValue(formId, 'pk_org_v').value == null ||
					props.form.getFormItemsValue(formId, 'pk_org_v').value == ''
				) {
					ajax({
						url: getOrgVid,
						data: { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value },
						success: (res) => {
							this.props.form.setFormItemsValue(formId, {
								pk_org_v: { value: res.data[this.props.form.getFormItemsValue(formId, 'pk_org').value] }
							});
							this.saveClick();
						}
					});
				} else {
					this.saveClick();
				}
				break;
			case 'SaveAdd':
				if (
					props.form.getFormItemsValue(formId, 'pk_org_v').value == null ||
					props.form.getFormItemsValue(formId, 'pk_org_v').value == ''
				) {
					ajax({
						url: getOrgVid,
						data: { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value },
						success: (res) => {
							this.props.form.setFormItemsValue(formId, {
								pk_org_v: { value: res.data[this.props.form.getFormItemsValue(formId, 'pk_org').value] }
							});
							this.saveClick(true);
						}
					});
				} else {
					this.saveClick(true);
				}
				break;
			case 'Cancel':
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140WK-000007'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
					content: this.state.json['10140WK-000009'], // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
					noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false, // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140WK-000006'], // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140WK-000007'], // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.cancelSureEvent.bind(this) // 确定按钮点击调用函数,非必输
				});
				break;
			case 'Refresh':
				this.getdata(this.props.getUrlParam('id'), () => {
					toast({ title: this.state.json['10140WK-000043'], color: 'success' }); /* 国际化处理： 刷新成功！*/
				});
				break;
			case 'Enable':
				this.enable();
				break;
			case 'Disable':
				this.disable();
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
	//复制
	handleCopy = (pk) => {
		let data = { pk };
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				if (res.data.head) {
					let { values } = res.data.head[formId].rows[0];
					this.props.form.setFormItemsValue(formId, {
						pk_org: { ...values.pk_org },
						pk_org_v: { ...values.pk_org_v },
						pk_group: { ...values.pk_group },
						vwkcode: { value: '', display: '' },
						vwkname: { value: '', display: '' },
						cwkclassid: { ...values.cwkclassid },
						'cwkclassid.name': { ...values['cwkclassid.name'] },
						cdeptid: { ...values.cdeptid },
						cdeptvid: { ...values.cdeptvid },
						'cdeptid.name': { ...values['cdeptid.name'] },
						enablestate: { value: '2', display: this.state.json['10140WK-000002'] },
						vnote: { ...values.vnote }
					});
					this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
					this.setItemDisabled(false);
				}
			}
		});
	};

	//启用停用逻辑处理
	changeEnableClick() {
		ajax({
			url: changeEnableStatus,
			data: {
				id: this.props.getUrlParam('id')
			},
			success: (res) => {
				this.getdata(this.props.getUrlParam('id'), (enablestate) => {
					if (enablestate == 2) {
						toast({ color: 'success', title: this.state.json['10140WK-000020'] }); /* 国际化处理： 启用成功！*/
					} else {
						toast({ color: 'success', title: this.state.json['10140WK-000021'] }); /* 国际化处理： 停用成功！*/
					}
				});
			}
		});
	}
	//启用停用逻辑处理
	changeDisableClick() {
		ajax({
			url: changeDisableStatus,
			data: {
				id: this.props.getUrlParam('id')
			},
			success: (res) => {
				this.getdata(this.props.getUrlParam('id'), (enablestate) => {
					if (enablestate == 2) {
						toast({ color: 'success', title: this.state.json['10140WK-000020'] }); /* 国际化处理： 启用成功！*/
					} else {
						toast({ color: 'success', title: this.state.json['10140WK-000021'] }); /* 国际化处理： 停用成功！*/
					}
				});
			}
		});
	}
	//启用
	enable() {
		if (this.props.form.getFormItemsValue(this.formId, 'enablestate').value == 2) {
			toast({ color: 'warning', content: this.state.json['10140WK-000043'] }); /* 国际化处理： 已启用，无需重复启用！*/
			return;
		}
		this.changeEnableClick();
	}
	//停用
	disable() {
		if (this.props.form.getFormItemsValue(this.formId, 'enablestate').value == 3) {
			toast({ color: 'warning', content: this.state.json['10140WK-000044'] }); /* 国际化处理： 已停用，无需重复停用！*/
			return;
		}
		this.changeEnableClick();
	}
	//输出
	output(type = '') {
		let pks = [];
		pks.push(this.props.getUrlParam('id'));
		//原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
		if (type != '') {
			//打印
			print('pdf', printUrl, {
				funcode: /*this.props.config.funcode*/ '10140WK', //功能节点编码
				nodekey: 'wkprintcard', //模板节点标识
				oids: pks,
				outputType: type
			});
		}
	}
	//确认取消
	cancelSureEvent() {
		if (this.props.getUrlParam('status') === 'add') {
			let pk = this.props.getUrlParam('id');
			if (!pk || pk == 'null') {
				if (getCurrentLastId(dataSource)) {
					pk = getCurrentLastId(dataSource);
				} else {
					this.props.form.EmptyAllFormValue(formId);
					this.props.form.setFormItemsValue(formId, {
						enablestate: { value: '', display: '' }
					});
					this.props.button.setButtonDisabled(
						[ 'Edit', 'Delete', 'Copy', 'Refresh', 'Enable', 'Disable', 'Print', 'Output' ],
						true
					);
				}
			}
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
		}
		this.toggleShow();
		//特殊设置一下返回按钮的可见性
		this.setState({
			backVisible: true
		});
	}

	pageInfoClick = (props, pk) => {
		this.getDataForCache(pk);
	};
	//确认修改工厂，清空其他字段值
	sureChangeOrg() {
		if (
			this.props.form.getFormItemsValue(formId, 'pk_org') &&
			this.props.form.getFormItemsValue(formId, 'pk_org').value
		) {
			ajax({
				url: getOrgVid,
				data: { pk_org: this.props.form.getFormItemsValue(formId, 'pk_org').value },
				success: (res) => {
					this.props.form.setFormItemsValue(formId, {
						pk_org_v: { value: res.data[this.props.form.getFormItemsValue(formId, 'pk_org').value] }
					});
				}
			});
		}
		this.props.form.setFormItemsValue(formId, {
			vwkcode: { value: '', display: '' },
			vwkname: { value: '', display: '' },
			cwkclassid: { value: '', display: '' },
			'cwkclassid.name': { value: '', display: '' },
			cdeptid: { value: '', display: '' },
			'cdeptid.name': { value: '', display: '' },
			vnote: { value: '', display: '' }
		});
		this.setItemDisabled(false);
	}
	//取消修改工厂
	cancelChangeOrg = () => {
		let { display, value } = this.old_pk_org;
		this.props.form.setFormItemsValue(formId, {
			pk_org: { display, value }
		});
		this.setItemDisabled(false);
	};
	//表单编辑后事件
	afterEvent(props, moduleId, key, value, oldValue) {
		if (key != 'pk_org' || value.value == oldValue.value) {
			return;
		}
		if (key == 'pk_org') {
			let meta = props.meta.getMeta();
			let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
			meta[formId].items.map((item) => {
				if (item.attrcode == 'cwkclassid') {
					item.isDataPowerEnable = false;
					item.queryCondition = () => {
						return { pk_org: pk_org,enablestate:2 }; // 根据pk_org过滤
					};
				}
			});
			if (oldValue && oldValue.value) {
				this.props.modal.show('sureChangeOrg');
				this.old_pk_org = oldValue;
			} else {
				this.sureChangeOrg(value.value);
			}
		}
	}
	//通过单据id查询单据信息
	getdata = (pk, callback) => {
		let data = { pk };
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				if (res.data.head) {
					let enablestate = res.data.head[this.formId].rows[0].values.enablestate.value;
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					this.toggleShow(res.data.head[this.formId].rows[0].values.enablestate.value);
					//放入缓存
					updateCache(
						pk_item,
						res.data.head[formId].rows[0].values[pk_item].value,
						res.data,
						formId,
						dataSource
					);
					if (callback && typeof callback == 'function') {
						callback && callback(enablestate);
					}
				}
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg, {
						[formId]: 'form'
					});
				}
			}
		});
	};
	//保存单据
	saveClick = (saveAdd = false) => {
		let CardData = this.props.createMasterChildData(pageId, this.formId);
		let url = saveUrl; //新增保存
		if (this.props.getUrlParam('status') === 'edit') {
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
							if (res.data && !saveAdd) {
								if (res.data.head && res.data.head[this.formId]) {
									this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
									pk_value = res.data.head[this.formId].rows[0].values[pk_item].value;
								}
							} else {
								pk_value = res.data.head[this.formId].rows[0].values[pk_item].value;
							}
							if (!saveAdd) {
								this.props.pushTo('/card', {
									status: 'browse',
									id: pk_value
								});
								this.getdata(pk_value);
								//特殊设置一下返回按钮的可见性
								this.setState({
									backVisible: true
								});
							} else {
								this.props.form.EmptyAllFormValue(this.formId);
								this.setDefaultValue();
								this.props.form.setFormItemsValue(formId, {
									pk_org: { ...res.data.head[this.formId].rows[0].values.pk_org }
								});
								this.props.form.setFormItemsDisabled(this.formId, { pk_org: false });
							}
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
							toast({ content: this.state.json['10140WK-000018'], color: 'success' }); /* 国际化处理： 保存成功*/
						}
					}
				});
			},
			{ head: formId }
		);
	};
	//通过缓存获取数据
	getDataForCache = (pk, callback) => {
		if (!pk || pk == 'null') {
			this.props.pushTo('/list', {});
			return;
		}
		let cardData = getCacheById(pk, dataSource);
		if (cardData) {
			this.props.form.setAllFormValue({ [formId]: cardData.head[formId] });
		} else {
			this.getdata(pk);
		}
		this.props.setUrlParam(pk); //动态修改地址栏中的id的值
		if (callback && typeof callback == 'function') {
			callback.call(this);
		}
		//将更新按钮状态的调用延后到callback之后，否则新增取消的时候显示的还是编辑态的按钮
		if (cardData) {
			this.toggleShow(cardData.head[formId].rows[0].values.enablestate.value);
		}
	};
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
					if(nextId != null){
						this.getDataForCache(nextId, () => {
							toast({ color: 'success', title: this.state.json['10140WK-000019'] }); /* 国际化处理： 删除成功！*/
						});
					}else{
						this.props.pushTo('/list', {})
					}
				}
			}
		});
	};
	render() {
		let { form, button, modal, cardPagination } = this.props;
		const { createCardPagination } = cardPagination;
		const { createBillHeadInfo } = this.props.BillHeadInfo
		let { createForm } = form;
		let { createButtonApp } = button;
		let { createModal } = modal;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<div className="nc-bill-header-area">
							<div className='header-title-search-area'>
								<span>
									{createBillHeadInfo({
										title: this.state.json['10140WK-000029'],
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
							onAfterEvent: this.afterEvent.bind(this)
						})}
					</div>
				</div>
				<PrintOutput
					ref="printOutput"
					url={printUrl}
					data={{
						funcode: '10140WK',
						nodekey: 'wkprint',
						oids: this.state.pks,
						outputType: 'output'
					}}
				/>
				{createModal('sureChangeOrg', {
					size: 'sm',
					title: this.state.json ? this.state.json['10140WK-000010'] : '10140WK-000010' /* 国际化处理： 注意*/,
					content: this.state.json ? this.state.json['10140WK-000011'] : '10140WK-000011' /* 国际化处理： 确认删除？*/,
					beSureBtnClick: this.sureChangeOrg.bind(this),
					cancelBtnClick: this.cancelChangeOrg.bind(this)
				})}
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