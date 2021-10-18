/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
/**
 * 背书办理卡片界面 按钮事件
 * @author：gaokung
 */
import { toast, print, cacheTools, cardCache, promptBox } from 'nc-lightapp-front';
let { getNextId, deleteCacheById, updateCache, addCache } = cardCache;
import { CARD, CARD_BTN, URI, DATASOURCE, FULL_AGGCLASSNAME, BILLTYPE } from '../../cons/constant.js'; //配置的id和area信息
import { doAjax } from './../../utils/commonUtil';
import { saveMultiLangRes, loadMultiLang, createSimpleBillData } from '../../../../../tmpub/pub/util/index';
import Sign from '../../../../../tmpub/pub/util/ca';
import { billInitDataRule } from '../events/billRule';
export function buttonClick(props, id) {
	switch (id) {
		// 新增
		case CARD_BTN.add:
			doAdd.call(this, props);
			break;

		// 保存
		case CARD_BTN.save:
			doSave.call(this, props, true, false, false);
			break;

		// 保存新增
		case CARD_BTN.saveAdd:
			doSaveAdd.call(this, props);
			break;

		// 保存提交
		case CARD_BTN.saveCommit:
			doSaveCommit.call(this, props);
			break;

		// 取消
		case CARD_BTN.cancel:
			promptBox({
				title: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000003'),/* 国际化处理： 取消*/
				color: 'warning',
				content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000004'),/* 国际化处理： 是否确任要取消?*/
				beSureBtnClick: doCancel.bind(this, props)
			});
			break;

		// 复制
		case CARD_BTN.copy:
			doCopy.call(this, props);
			break;

		// 编辑
		case CARD_BTN.edit:
			doEdit.call(this, props);
			break;

		// 删除
		case CARD_BTN.delete:
			promptBox({
				title: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000005'),/* 国际化处理： 删除*/
				color: 'warning',
				content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000006'),/* 国际化处理： 是否确任要删除?*/
				beSureBtnClick: doDelete.bind(this, props)
			});
			break;

		// 提交
		case CARD_BTN.commit:
			doCommit.call(this, props, CARD_BTN.commit);
			break;

		// 收回
		case CARD_BTN.uncommit:
			doUnCommit.call(this, props);
			break;

		//发送指令
		case CARD_BTN.commandSend:
			doSendCommand.call(this, props);
			break;

		//撤回指令
		case CARD_BTN.commandCancel:
			doCancelCommand.call(this, props);
			break;

		//制证
		case CARD_BTN.voucherMake:
			doMkVoucher.call(this, props);
			break;

		//取消制证
		case CARD_BTN.voucherCancel:
			doVoucherCancel.call(this, props);
			break;

		//作废
		case CARD_BTN.nullify:
			doDisable.call(this);
			break;

		//取消作废
		case CARD_BTN.nullifyCancel:
			doUnDisable.call(this, props);
			break;

		//附件
		case CARD_BTN.attackment:
			doFiled.call(this, props);
			break;

		//打印
		case CARD_BTN.print:
			doPrint.call(this, props);
			break;

		//输出
		case CARD_BTN.output:
			doOutPut.call(this, props);
			break;

		//联查 票据台账
		case CARD_BTN.unionBillAccount:
			doLinkBook.call(this, props);
			break;

		//联查 付款单
		case CARD_BTN.unionPayBill:
			doLinkBill.call(this, props);
			break;

		//联查 审批详情
		case CARD_BTN.unionApprovalDetails:
			doLinkApprove.call(this, props);
			break;
		//联查 联查凭证
		case CARD_BTN.unionVoucher:
			doLinkVoucher.call(this, props);
			break;

		//联查 资金预算
		case CARD_BTN.unionFundsBudget:
			doLinkNtb.call(this, props);
			break;

		//刷新
		case CARD_BTN.refresh:
			doRefresh.call(this, props, true);
			break;

		default:
			break;
	}
}

/**
 * 新增
 * @param {*} props 
 */
function doAdd(props) {
	let pk =
		props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore') &&
		props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore').value;
	if (!pk) {
		pk = '';
	}
	this.props.setUrlParam({
		status: 'add',
		oldId: pk,
		pagecode: CARD.pageCode
	});
	this.setUIDisplay();
}

/**
 * 保存
 * @param {*} props 
 */
async function doSave(props, showToast, isAdd, isCommit) {
	// 保存前校验
	let toSave = beforeSave.call(this, props);
	if (toSave) {
		// 采用轻量级的api获取页面数据，去除scale,display
		let cardData = createSimpleBillData(props, CARD.pageCode, CARD.formHeadCode, [], false);

		// TODO open this when add CA verification
		console.log(cardData, 'before CA sign');
		let result = await Sign({
			isSign: true,
			isKey: false,
			data: cardData,
			isSave: true,
			encryptVOClassName: 'nccloud.itf.fbm.endore.vo.EndoreEncryptVO4NCC'
		});
		if (result.isStop) {
			return;
		}
		console.log(result.data, 'after CA sign');
		cardData = result.data;

		let saveBeforePk = this.props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore');

		let saveCallback = function(res) {
			if (res.data.head) {
				this.props.form.setAllFormValue({ [CARD.formHeadCode]: res.data.head[CARD.formHeadCode] });
				//页签赋值
				let pk_endore = res.data.head[CARD.formHeadCode].rows[0].values.pk_endore;
				let vbillno = res.data.head[CARD.formHeadCode].rows[0].values.vbillno;
				this.setState({
					billno: vbillno && vbillno.value,
					isBlank: false
				});
				this.props.setUrlParam({
					status: 'browse',
					id: pk_endore && pk_endore.value
				});
				if (saveBeforePk && saveBeforePk.value) {
					updateCache(
						'pk_endore',
						res.data.head[CARD.formHeadCode].rows[0].values.pk_endore.value,
						res.data,
						CARD.formHeadCode,
						DATASOURCE,
						res.data.head[CARD.formHeadCode].rows[0].values
					);
				} else {
					addCache(
						res.data.head[CARD.formHeadCode].rows[0].values.pk_endore.value,
						res.data,
						CARD.formHeadCode,
						DATASOURCE,
						res.data.head[CARD.formHeadCode].rows[0].values
					);
				}

				if (showToast) {
					toast({
						color: 'success',
						content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000007')/* 国际化处理： 保存成功*/
					});
				}

				if (isAdd) {
					doAdd.call(this, props);
					return;
				}
				if (isCommit) {
					doCommit.call(this, props, CARD_BTN.saveCommit);
					return;
				}
				if (!isAdd && !isCommit) {
					this.setUIDisplay();
				}
			}
		};

		doAjax.call(this, cardData, URI.endoreCardSave, saveCallback);
	}
}

/**
 * 保存新增
 * @param {*} props 
 */
function doSaveAdd(props) {
	doSave.call(this, props, true, true, false);
}

/**
 * 保存提交
 * @param {*} props 
 */
function doSaveCommit(props) {
	doSave.call(this, props, false, false, true);
}

/**
 * 复制
 * @param {*} props 
 */
function doCopy(props) {
	let pk = props.getUrlParam('id');
	if (!pk) {
		toast({
			color: 'warning',
			content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000008')/* 国际化处理： URL中没有主键*/
		});
		return;
	}
	this.props.setUrlParam({
		status: 'copy',
		id: pk,
		oldId: pk,
		pagecode: CARD.pageCode
	});
	this.setUIDisplay();
}

/**
 * 删除
 * @param {*} props 
 */
function doDelete(props) {
	let id = props.getUrlParam('id');
	let sendData = {
		pks: [ id ]
	};

	let successCallback = function(res) {
		toast({ color: 'success', content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000009') });/* 国际化处理： 删除成功!*/

		let deleteid = this.props.getUrlParam('id');
		let deletenextId = getNextId(deleteid, DATASOURCE);
		deleteCacheById('pk_endore', deleteid, DATASOURCE);

		//注意：查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求。
		this.props.setUrlParam({
			status: 'browse',
			id: deletenextId ? deletenextId : ''
		});
		this.setUIDisplay();
	};

	doAjax.call(this, sendData, URI.endoreCardDelete, successCallback);
}

/**
 * 取消(只有编辑态有取消按钮)
 * @param {*} props 
 */
function doCancel(props) {
	let status = props.getUrlParam('status');
	let id = props.getUrlParam('id');
	if (status === 'edit') {
		// 表格返回上一次的值
		this.props.setUrlParam({
			status: 'browse',
			id: id,
			pagecode: CARD.pageCode
		});
		this.setUIDisplay();
	} else if (status === 'add') {
		//保存中的取消操作
		this.props.setUrlParam({
			status: 'browse',
			id: id,
			pagecode: CARD.pageCode
		});
		if (id) {
			this.setUIDisplay();
		} else {
			// 单纯新增，取消时显示空白页，只留新增按钮
			// 先设置所有按钮不可见
			let allBtn = [];
			for (let value in CARD_BTN) {
				allBtn.push(CARD_BTN[value]);
			}
			this.props.button.setButtonVisible(allBtn, false);
			// 只留新增按钮
			let BLANK = [ CARD_BTN.add ];
			this.props.button.setButtonVisible(BLANK, true);

			let status = this.props.getUrlParam('status');
			// 与数据无关的画面显示
			this.controlPartPageDisplay();
			// 根据数据与业务规则，对数据部分画面进行初始化
			billInitDataRule.call(this, status);
		}
	} else if (status === 'copy') {
		let oldId = this.props.getUrlParam('oldId');
		//复制中的取消操作
		this.props.setUrlParam({
			status: 'browse',
			id: oldId,
			pagecode: CARD.pageCode
		});
		this.setUIDisplay();
	}
}

/**
 * 编辑
 * @param {*} props 
 */
function doEdit(props) {
	let id = props.getUrlParam('id');
	this.props.setUrlParam({
		status: 'edit',
		id: id,
		oldId: id,
		pagecode: CARD.pageCode
	});
	this.setUIDisplay();
}

/**
 * 提交
 * @param {*} props 
 */
function doCommit(props, callWay) {
	let pk = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore');
	let ts = props.form.getFormItemsValue(CARD.formHeadCode, 'ts');

	let sendData = {
		pageid: CARD.pageCode,
		pks: [ pk && pk.value ],
		tss: [ ts && ts.value ],
		isCardOpt: true
	};

	let successCallback = function(res) {
		let that = this;
		if (res.data && res.data.errMsg) {
			toast({ color: 'danger', content: res.data.errMsg });
		} else {
			if (res.data.workflow && (res.data.workflow === 'approveflow' || res.data.workflow === 'workflow')) {
				that.setState({
					compositedata: res.data,
					compositedisplay: true
				});
			} else {
				that.setState({
					compositedata: res.data,
					compositedisplay: false
				});
				if (res.data.head) {
					that.props.form.setAllFormValue({ [CARD.formHeadCode]: res.data.head[CARD.formHeadCode] });
					updateCache('pk_endore', pk && pk.value, res.data, CARD.formHeadCode, DATASOURCE);
					if (CARD_BTN.commit === callWay) {
						toast({
							color: 'success',
							content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000002')/* 国际化处理： 提交成功！*/
						});
					} else if (CARD_BTN.saveCommit) {
						toast({
							color: 'success',
							content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000010')/* 国际化处理： 保存提交成功！*/
						});
					}
				}
			}
		}
		doRefresh.call(this, this.props, false);
	};

	doAjax.call(this, sendData, URI.endoreCardCommit, successCallback);
}

/**
 * 收回
 * @param {*} props 
 */
function doUnCommit(props) {
	let pk = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore');
	let ts = props.form.getFormItemsValue(CARD.formHeadCode, 'ts');

	let sendData = {
		pageid: CARD.pageCode,
		pks: [ pk && pk.value ],
		tss: [ ts && ts.value ],
		isCardOpt: true
	};

	let successCallback = function(res) {
		let that = this;
		if (res.data && res.data.errMsgs && res.data.errMsgs.length > 0) {
			toast({ color: 'danger', content: res.data.errMsgs[0] });
		} else {
			if (res.data.card.head) {
				that.props.form.setAllFormValue({ [CARD.formHeadCode]: res.data.card.head[CARD.formHeadCode] });
				updateCache('pk_endore', pk && pk.value, res.data.card, CARD.formHeadCode, DATASOURCE);
				toast({
					color: 'success',
					content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000011')/* 国际化处理： 收回成功！*/
				});
			}
		}
		doRefresh.call(this, this.props, false);
	};

	doAjax.call(this, sendData, URI.endoreCardUncommit, successCallback);
}

/**
 * 发送指令
 * @param {*} props 
 */
function doSendCommand(props) {
	let pk = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore');
	let ts = props.form.getFormItemsValue(CARD.formHeadCode, 'ts');

	let sendData = {
		pageid: CARD.pageCode,
		pks: [ pk && pk.value ],
		tss: [ ts && ts.value ],
		isCardOpt: true
	};

	let successCallback = function(res) {
		let that = this;
		if (res.data && res.data.errMsgs && res.data.errMsgs.length > 0) {
			toast({ color: 'danger', content: res.data.errMsgs[0] });
		} else {
			if (res.data.card.head) {
				that.props.form.setAllFormValue({ [CARD.formHeadCode]: res.data.card.head[CARD.formHeadCode] });
				updateCache('pk_endore', pk && pk.value, res.data.card, CARD.formHeadCode, DATASOURCE);
				toast({
					color: 'success',
					content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000012')/* 国际化处理： 发送指令成功！*/
				});
			}
		}
		doRefresh.call(this, this.props, false);
	};

	doAjax.call(this, sendData, URI.endoreCardCommandSend, successCallback);
}

/**
 * 撤回指令
 * @param {*} props 
 */
function doCancelCommand(props) {
	let pk = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore');
	let ts = props.form.getFormItemsValue(CARD.formHeadCode, 'ts');

	let sendData = {
		pageid: CARD.pageCode,
		pks: [ pk && pk.value ],
		tss: [ ts && ts.value ],
		isCardOpt: true
	};

	let successCallback = function(res) {
		let that = this;
		if (res.data && res.data.errMsgs && res.data.errMsgs.length > 0) {
			toast({ color: 'danger', content: res.data.errMsgs[0] });
		} else {
			if (res.data.card.head) {
				that.props.form.setAllFormValue({ [CARD.formHeadCode]: res.data.card.head[CARD.formHeadCode] });
				updateCache('pk_endore', pk && pk.value, res.data.card, CARD.formHeadCode, DATASOURCE);
				toast({
					color: 'success',
					content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000013')/* 国际化处理： 撤回指令成功！*/
				});
			}
		}
		doRefresh.call(this, this.props, false);
	};

	doAjax.call(this, sendData, URI.endoreCardCommandCancel, successCallback);
}

/**
 * 制证
 * @param {*} props 
 */
function doMkVoucher(props) {
	let that = this;
	let pk = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore');
	let ts = props.form.getFormItemsValue(CARD.formHeadCode, 'ts');

	let sendData = {
		pageid: CARD.pageCode,
		pks: [ pk && pk.value ],
		tss: [ ts && ts.value ],
		isCardOpt: true
	};

	let callback = function(res) {
		if (res.data) {
			if (res.data && res.data.errMsgs && res.data.errMsgs.length > 0) {
				toast({ color: 'danger', content: res.data.errMsgs[0] });
			} else {
				if (res.data.card.head) {
					that.props.form.setAllFormValue({ [CARD.formHeadCode]: res.data.card.head[CARD.formHeadCode] });
					updateCache('pk_endore', pk && pk.value, res.data.card, CARD.formHeadCode, DATASOURCE);
					toast({
						color: 'success',
						content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000014')/* 国际化处理： 制证成功！*/
					});
				}
			}
		}
		doRefresh.call(this, this.props, false);
	};

	doAjax.call(this, sendData, URI.endoreCardVoucher, callback);
}

/**
 * 取消制证
 * @param {*} props 
 */
function doVoucherCancel(props) {
	let pk = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore');
	let ts = props.form.getFormItemsValue(CARD.formHeadCode, 'ts');

	let sendData = {
		pageid: CARD.pageCode,
		pks: [ pk && pk.value ],
		tss: [ ts && ts.value ],
		isCardOpt: true
	};
	let callback = function(res) {
		if (res.data) {
			if (res.data && res.data.errMsgs && res.data.errMsgs.length > 0) {
				toast({ color: 'danger', content: res.data.errMsgs[0] });
			} else {
				if (res.data.card.head) {
					this.props.form.setAllFormValue({ [CARD.formHeadCode]: res.data.card.head[CARD.formHeadCode] });
					updateCache('pk_endore', pk && pk.value, res.data.card, CARD.formHeadCode, DATASOURCE);
					toast({
						color: 'success',
						content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000015')/* 国际化处理： 取消制证成功！*/
					});
				}
			}
		}
		doRefresh.call(this, this.props, false);
	};

	doAjax.call(this, sendData, URI.endoreCardUnvoucher, callback);
}

/**
 * 作废
 */
function doDisable() {
	this.setState(
		{
			disabledComShow: true
		},
		() => {
			this.props.form.setFormStatus(this.disableNote, 'edit');
		}
	);
}

/**
 * 作废弹框回调函数
 * @param {*} disableReason 
 */
export function confirmOfDisableOnCard(disableReason) {
	let that = this;
	let pk = that.props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore');
	let ts = that.props.form.getFormItemsValue(CARD.formHeadCode, 'ts');

	let sendData = {
		pageid: CARD.pageCode,
		pks: [ pk && pk.value ],
		tss: [ ts && ts.value ],
		isCardOpt: true,
		disableReason: disableReason[CARD.disableNote]
	};

	let callback = function(res) {
		this.setState({
			disabledComShow: false
		});
		if (res.data) {
			if (res.data && res.data.errMsgs && res.data.errMsgs.length > 0) {
				toast({ color: 'danger', content: res.data.errMsgs[0] });
			} else {
				if (res.data.card.head) {
					that.props.form.setAllFormValue({ [CARD.formHeadCode]: res.data.card.head[CARD.formHeadCode] });
					updateCache('pk_endore', pk && pk.value, res.data.card, CARD.formHeadCode, DATASOURCE);
					toast({
						color: 'success',
						content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000016')/* 国际化处理： 作废成功！*/
					});
				}
			}
		}

		doRefresh.call(this, this.props, false);
	};

	doAjax.call(this, sendData, URI.endoreCardNullify, callback);
}
/**
 * 取消作废
 * @param {*} props 
 */
function doUnDisable(props) {
	let that = this;
	let pk = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore');
	let ts = props.form.getFormItemsValue(CARD.formHeadCode, 'ts');

	let sendData = {
		pageid: CARD.pageCode,
		pks: [ pk && pk.value ],
		tss: [ ts && ts.value ],
		isCardOpt: true
	};

	let callback = function(res) {
		if (res.data) {
			if (res.data && res.data.errMsgs && res.data.errMsgs.length > 0) {
				toast({ color: 'danger', content: res.data.errMsgs[0] });
			} else {
				if (res.data.card.head) {
					that.props.form.setAllFormValue({ [CARD.formHeadCode]: res.data.card.head[CARD.formHeadCode] });
					updateCache('pk_endore', pk && pk.value, res.data.card, CARD.formHeadCode, DATASOURCE);
					toast({
						color: 'success',
						content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000017')/* 国际化处理： 取消作废成功！*/
					});
				}
			}
		}
		doRefresh.call(this, this.props, false);
	};

	doAjax.call(this, sendData, URI.endoreCardNullifyCancel, callback);
}

/**
 * 联查 凭证
 * @param {*} props 
 */
function doLinkVoucher(props) {
	//拼接联查数据,支持批量联查
	let pk_group =
		props.form.getFormItemsValue(CARD.formHeadCode, 'pk_group') &&
		props.form.getFormItemsValue(CARD.formHeadCode, 'pk_group').value;
	let pk_org =
		props.form.getFormItemsValue(CARD.formHeadCode, 'pk_org') &&
		props.form.getFormItemsValue(CARD.formHeadCode, 'pk_org').value;
	let pk_endore =
		props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore') &&
		props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore').value;
	let sendData = [
		{
			pk_group: pk_group, //集团主键
			pk_org: pk_org, //组织主键
			relationID: pk_endore, //单据主键
			pk_billtype: BILLTYPE //交易类型
		}
	];
	let successCallback = function(res) {
		if (res.success) {
			let srcCode = res.data.src;
			if ('_LinkVouchar2019' == srcCode) {
				//走联查
				if (res.data.des) {
					//跳转到凭证界面
					if (res.data.pklist) {
						if (res.data.pklist.length == 1) {
							//单笔联查
							this.props.openTo(res.data.url, {
								status: 'browse',
								appcode: res.data.appcode,
								pagecode: res.data.pagecode,
								id: res.data.pklist[0],
								n: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000018'), //'联查凭证'/* 国际化处理： 联查凭证*/
								backflag: 'noback'
							});
							return;
						} else {
							//多笔联查
							cacheTools.set('checkedData', res.data.pklist);
							this.props.openTo(res.data.url, {
								status: 'browse',
								appcode: res.data.appcode,
								pagecode: res.data.pagecode,
								n: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000018') //'联查凭证'/* 国际化处理： 联查凭证*/
							});
							return;
						}
					}
				}
			} else {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000019') });/* 国际化处理： 未查到凭证*/
				return;
			}
		}
	};
	doAjax.call(this, sendData, URI.endoreCardLinkVoucher, successCallback);
}

/**
 * 联查 付款单
 * @param {*} props 
 */
function doLinkBill(props) {
	let pk_endore = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore');
	pk_endore = pk_endore && pk_endore.value;
	let pk_register = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_register');
	pk_register = pk_register && pk_register.value;

	let successaCallback = function(res) {
		let { linkinfo } = res.data;
		if (linkinfo) {
			this.props.openTo(linkinfo.url, {
				appcode: linkinfo.appCode,
				pagecode: linkinfo.linkPageCode,
				status: 'browse',
				scene: 'linksce',
				id: linkinfo.pks
			});
		}
	};

	let sendData = {
		pk_register: pk_register,
		pk_billhead: pk_endore
	};

	doAjax.call(this, sendData, URI.endoreCardLinkPayBill, successaCallback);
}

/**
 * 联查 资金预算
 * @param {*} props 
 */
function doLinkNtb(props) {
	let pk = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore').value;
	let successCallback = function(res) {
		let { data } = res;
		if (data.hint) {
			toast({ color: 'warning', content: res.data.hint });
		} else {
			this.setState({
				showNtbDetail: true,
				ntbdata: data
			});
		}
	};
	let sendData = {
		pk,
		className: FULL_AGGCLASSNAME
	};
	doAjax.call(this, sendData, URI.endoreCardLinkNtb, successCallback);
}

/**
 * 联查 票据台账
 * @param {*} props 
 */
function doLinkBook(props) {
	let pk_register = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_register').value;
	this.props.openTo('/fbm/fbm/counterbook/main/index.html#/card', {
		billtype: "36HM", // 单据类型管理中的 (目标应用)类型代码 
    	sence: "4", // 公共处理是需要的应用跳转参数 4-联查 3-审批 1-默认
		pagecode: '36181BL_C01',
		status: 'browse',
		scene: 'linksce',
		id: pk_register
	});
}

/**
 * 联查 审批详情
 * @param {*} props 
 */
function doLinkApprove(props) {
	let billid = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore');
	this.setState({
		showApproveDetail: true,
		billInfo: {
			billId: billid && billid.value
		}
	});
}

/**
 * 附件
 * @param {*} props 
 */
function doFiled(props) {
	let billno = props.form.getFormItemsValue(CARD.formHeadCode, 'vbillno').value;
	let pk_endore = props.getUrlParam('id');

	this.setState({
		showUploader: !this.state.showUploader,
		billInfo: {
			target: null,
			billId: pk_endore,
			billNo: billno
		}
	});
}

/**
 * 打印
 * @param {*} props 
 */
function doPrint(props) {
	let printpks = [ props.getUrlParam('id') ];
	let appcode = props.getSearchParam('c') || props.getUrlParam('c');

	// print方法的参数数据格式
	// {
	// 	appcode: appcode,
	// 	nodekey: 打印输出模板编码,
	// 	oids: pks
	// }
	print(
		//支持两类: 'html'为模板打印, 'pdf'为pdf打印，这里设置为pdf
		'pdf',
		URI.endoreCardPrintOutput,
		{
			appcode: appcode,
			nodekey: 'NCC36180ET_APPR',
			oids: printpks
		}
	);
}
/**
 * 输出
 * @param {*} props 
 */
function doOutPut(props) {
	let outputpks = [ props.getUrlParam('id') ];
	// state中保存的printOutput数据信息
	// printOutputInfo: {
	// 	//打印输出使用
	// 	funcode: appcode, //功能节点编码，即模板编码
	// 	nodekey: 'NCC36180ET'//模板节点标识
	// }

	// 输出的弹框需要的的数据及格式
	// {
	//    funcode:'20521030',//功能节点编码，即模板编码
	//    nodekey:'web_print', //模板节点标识
	//    oids:['1001A41000000000A9LR'],// 功能节点的数据主键 oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
	//    outputType: 'output'
	// }
	let appcode = props.getSearchParam('c') || props.getUrlParam('c');
	// 保存打印输出信息
	this.setState(
		{
			printOutputInfo: {
				//打印输出使用
				funcode: appcode, //功能节点编码，即模板编码
				nodekey: 'NCC36180ET_APPR', //模板节点标识
				oids: outputpks,
				outputType: 'output'
			}
		},
		() => {
			//此处即为PrintOutput组件中的ref="printOutput"，指打开输出的弹框
			this.refs.printOutput.open();
		}
	);
}

/**
 * 刷新
 * @param {*} props 
 */
function doRefresh(props, showToast) {
	let pk_endore = props.getUrlParam('id');
	if (!pk_endore) {
		this.props.form.EmptyAllFormValue(CARD.formHeadCode);
		this.setState({
			isBlank: true
		});
		this.setUIDisplay.call(this);
		return;
	}
	let queryData = {
		pk: pk_endore
	};

	// 成功回调
	let successCallback = function(res) {
		if (res.data) {
			this.props.form.setAllFormValue({ [CARD.formHeadCode]: res.data.head[CARD.formHeadCode] });

			let titleno = res.data.head[CARD.formHeadCode].rows[0].values.vbillno.value;
			this.setState({
				billNo: titleno
			});
			this.setUIDisplay.call(this);

			if (showToast) {
				toast({
					color: 'success',
					content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000020')/* 国际化处理： 刷新成功！*/
				});
			}
		}
	};

	doAjax.call(this, queryData, URI.endoreCardMainQuery, successCallback);
}

/**
 * 保存前校验
 * @param {*} props 
 */
function beforeSave(props) {
	let inputCheckFlag = props.form.isCheckNow(this.formHeadId); //是否校验通过，必输项等
	let cusCheckFlag = customCheckBeforeSave.call(this, props); //自定义校验内容
	return cusCheckFlag && inputCheckFlag;
}
function customCheckBeforeSave(props) {
	return true;
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/