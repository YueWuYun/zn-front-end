/*3qjakgBz8U307oLILQl1lx3XstScvLgmLN/C321/eZA4AjtcYm0K1c08g9qyfA+E*/
/**
 * 背书办理列表 表体按钮事件
 * @author：gaokung
 *
 */
import { toast } from 'nc-lightapp-front';
import { URI, LIST,CARD, LIST_BODY_BTN } from '../../cons/constant';
import { doAjax, isEmptyObject } from '../../utils/commonUtil';
export function listBodyBtnClick(key, record, index) {
	console.log(key, record, index);
	// 当前行 主键
	let pk = record.pk_endore.value;
	switch (key) {
		case LIST_BODY_BTN.edit: // 编辑按钮
			this.props.pushTo('/card', {
				status: 'edit',
				pagecode: CARD.pageCode,
				id: pk
			});
			break;
		case LIST_BODY_BTN.delete: // 删除按钮
			handleDelInnerClick.call(this, pk, index, record);
			break;
		case LIST_BODY_BTN.commit: // 提交按钮
			handleCommitInnerClick.call(this, pk, index, record);
			break;
		case LIST_BODY_BTN.uncommit: // 收回按钮
			handleUncommitInnerClick.call(this, pk, index, record);
			break;
		case LIST_BODY_BTN.voucherMake: // 制证按钮
			handleVoucherInnerClick.call(this, pk, index, record);
			break;
		case LIST_BODY_BTN.voucherCancel: // 取消制证按钮
			handleUnVoucherInnerClick.call(this, pk, index, record);
			break;
		case LIST_BODY_BTN.commandSend: // 发送指令按钮
			handleSendCommandInnerClick.call(this, pk, index, record);
			break;
		case LIST_BODY_BTN.commandCancel: // 撤回指令按钮
			handleCancelCommandInnerClick.call(this, pk, index, record);
			break;
		case LIST_BODY_BTN.nullify: // 作废按钮
			handleDisableInnerClick.call(this, pk, index, record);
			break;
		case LIST_BODY_BTN.nullifyCancel: // 取消作废按钮
			handleUnDisableInnerClick.call(this, pk, index, record);
			break;
		default:
			break;
	}
}
/**
 * 表格行内删除按钮点击事件
 * @param {*} pk
 * @param {*} index
 * @param {*} record
 */
const handleDelInnerClick = function(pk, index, record) {
	// 需要删除的主键数组
	let sendData = {
		pks: [ pk ]
	};

	let successCallback = function(res) {
		if (res.data.errMsg) {
			toast({
				color: 'danger',
				content: res.data.errMsg
			});
		} else {
			toast({
				color: 'success',
				content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000028')/* 国际化处理： 删除成功！*/
			});
			// 后台删除成功之后 进行前端数据删除
			this.props.table.deleteTableRowsByIndex(this.tableId, index);
		}
	};

	doAjax.call(this, sendData, URI.endoreCardDelete, successCallback);
};

/**
 * 表格行内提交按钮点击事件
 * @param {*} pk
 * @param {*} record
 * @param {*} index
 */
const handleCommitInnerClick = function(pk, index, record) {
	let ts = record.ts.value;
	let sendData = {
		pageid: LIST.pageCode,
		pks: [ pk ],
		tss: [ ts ],
		isCardOpt: false
	};
	let successCallback = function(res) {
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, record, res.data.grid, index);
			// that.props.table.updateDataByIndexs(LIST_TABLE_CODE, res.data.grid[LIST_TABLE_CODE].rows[0].values);
		}
		if (res.data.workflow && (res.data.workflow === 'approveflow' || res.data.workflow === 'workflow')) {
			this.setState({
				compositedata: res.data,
				compositedisplay: true
			});
			this.index = index;
			this.record = record;
		} else {
			let successIndexs = 0;
			if (res.data.successpks) {
				successIndexs = res.data.successpks.length;
			}

			// 全部成功
			if (successIndexs === 1) {
				toast({
					color: 'success',
					content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000002')/* 国际化处理： 提交成功！*/
				});
			} else {
				toast({
					color: 'danger',
					content: res.data.errMsg && res.data.errMsg.split('\n')
				});
			}
		}
	};
	doAjax.call(this, sendData, URI.endoreListCommit, successCallback);
};

/**
 * 表格行内收回按钮点击事件
 * @param {*} pk
 * @param {*} index
 * @param {*} record
 */
const handleUncommitInnerClick = function(pk, index, record) {
	let ts = record.ts.value;

	let sendData = {
		pageid: LIST.pageCode,
		pks: [ pk ],
		tss: [ ts ],
		isCardOpt: false
	};

	let successCallback = function(res) {
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, record, res.data.grid, index);
			// that.props.table.updateDataByIndexs(LIST_TABLE_CODE, res.data.grid[LIST_TABLE_CODE].rows[0].values);
		}
		// 全部失败
		if (res.data.status == 0) {
			toast({
				color: 'danger',
				content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000029')/* 国际化处理： 存在后续操作，不可收回！*/
			});
		}
		// 全部成功
		if (res.data.status == 1) {
			toast({
				color: 'success',
				content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000011')/* 国际化处理： 收回成功！*/
			});
		}
	};
	doAjax.call(this, sendData, URI.endoreListUnCommit, successCallback);
};

/**
 * 表格行内制证按钮点击事件
 * @param {*} pk
 * @param {*} index
 * @param {*} record
 */
const handleVoucherInnerClick = function(pk, index, record) {
	let ts = record.ts.value;

	let sendData = {
		pageid: LIST.pageCode,
		pks: [ pk ],
		tss: [ ts ],
		isCardOpt: false
	};

	let successCallback = function(res) {
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, record, res.data.grid, index);
		}
		// 全部失败
		if (res.data.status == 0) {
			toast({
				color: 'danger',
				content: isEmptyObject(res.data.errMsgs[0]) ? this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000030') : res.data.errMsgs[0]/* 国际化处理： 制证失败！*/
			});
		}
		// 全部成功
		if (res.data.status == 1) {
			toast({
				color: 'success',
				content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000014')/* 国际化处理： 制证成功！*/
			});
		}
	};
	doAjax.call(this, sendData, URI.endoreListVoucher, successCallback);
};

/**
 * 表格行取消内制证按钮点击事件
 * @param {*} pk
 * @param {*} index
 * @param {*} record
 */
const handleUnVoucherInnerClick = function(pk, index, record) {
	let ts = record.ts.value;

	let sendData = {
		pageid: LIST.pageCode,
		pks: [ pk ],
		tss: [ ts ],
		isCardOpt: false
	};

	let successCallback = function(res) {
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, record, res.data.grid, index);
		}
		// 全部失败
		if (res.data.status == 0) {
			toast({
				color: 'danger',
				content: isEmptyObject(res.data.errMsgs[0]) ? this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000031') : res.data.errMsgs[0]/* 国际化处理： 取消制证失败！*/
			});
		}
		// 全部成功
		if (res.data.status == 1) {
			toast({
				color: 'success',
				content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000015')/* 国际化处理： 取消制证成功！*/
			});
		}
	};
	doAjax.call(this, sendData, URI.endoreListUnvoucher, successCallback);
};

/**
 * 表格行内发送指令按钮点击事件
 * @param {*} pk
 * @param {*} index
 * @param {*} record
 */
const handleSendCommandInnerClick = function(pk, index, record) {
	let ts = record.ts.value;

	let sendData = {
		pageid: LIST.pageCode,
		pks: [ pk ],
		tss: [ ts ],
		isCardOpt: false
	};

	let successCallback = function(res) {
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, record, res.data.grid, index);
		}
		// 全部失败
		if (res.data.status == 0) {
			toast({
				color: 'danger',
				content: isEmptyObject(res.data.errMsgs[0]) ? this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000032') : res.data.errMsgs[0]/* 国际化处理： 发送指令失败！*/
			});
		}
		// 全部成功
		if (res.data.status == 1) {
			toast({
				color: 'success',
				content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000012')/* 国际化处理： 发送指令成功！*/
			});
		}
	};
	doAjax.call(this, sendData, URI.endoreListCommandSend, successCallback);
};

/**
 * 表格行取消内撤回指令按钮点击事件
 * @param {*} pk
 * @param {*} index
 * @param {*} record
 */
const handleCancelCommandInnerClick = function(pk, index, record) {
	let ts = record.ts.value;

	let sendData = {
		pageid: LIST.pageCode,
		pks: [ pk ],
		tss: [ ts ],
		isCardOpt: false
	};

	let successCallback = function(res) {
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, record, res.data.grid, index);
		}
		// 全部失败
		if (res.data.status == 0) {
			toast({
				color: 'danger',
				content: isEmptyObject(res.data.errMsgs[0]) ? this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000033') : res.data.errMsgs[0]/* 国际化处理： 撤回指令失败！*/
			});
		}
		// 全部成功
		if (res.data.status == 1) {
			toast({
				color: 'success',
				content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000013')/* 国际化处理： 撤回指令成功！*/
			});
		}
	};
	doAjax.call(this, sendData, URI.endoreListCommandCancel, successCallback);
};

/**
 * 表格行内作废按钮点击事件
 * @param {*} pk
 * @param {*} index
 * @param {*} record
 */
const handleDisableInnerClick = function(pk, index, record) {
	this.setState({
		disabledComShow: true,
		disableClickBtn: 'BODY',
		disableTmpData: {
			key: pk,
			record: record,
			index: index
		}
	});
	this.setState({
		disabledComShow: true,
		disableTmpData: {
			key: pk,
			record: record,
			index: index
		}
	},()=>{
		this.props.form.setFormStatus(this.disableNote, 'edit');
	});
};

/**
 * 作废弹框回调函数
 * @param {*} disableReason 
 */
export function confirmOfDisableOnListBody(disableReason) {
	let pk = this.state.disableTmpData.key;
	let index = this.state.disableTmpData.index;
	let record = this.state.disableTmpData.record;
	let ts = record.ts.value;

	let sendData = {
		pageid: LIST.pageCode,
		pks: [ pk ],
		tss: [ ts ],
		isCardOpt: false,
		disableReason: disableReason[LIST.disableNote]
	};

	let successCallback = function(res) {
		this.setState({
			disabledComShow: false
		});
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, record, res.data.grid, index);
		}
		// 全部失败
		if (res.data.status == 0) {
			toast({
				color: 'danger',
				content: isEmptyObject(res.data.errMsgs[0]) ? this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000034') : res.data.errMsgs[0]/* 国际化处理： 作废失败！*/
			});
		}
		// 全部成功
		if (res.data.status == 1) {
			toast({
				color: 'success',
				content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000016')/* 国际化处理： 作废成功！*/
			});
		}
	};
	doAjax.call(this, sendData, URI.endoreListNullify, successCallback);
}

/**
 * 表格行取消作废按钮点击事件
 * @param {*} pk
 * @param {*} index
 * @param {*} record
 */
const handleUnDisableInnerClick = function(pk, index, record) {
	let ts = record.ts.value;

	let sendData = {
		pageid: LIST.pageCode,
		pks: [ pk ],
		tss: [ ts ],
		isCardOpt: false
	};

	let successCallback = function(res) {
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, record, res.data.grid, index);
		}
		// 全部失败
		if (res.data.status == 0) {
			toast({
				color: 'danger',
				content: isEmptyObject(res.data.errMsgs[0]) ? this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000035') : res.data.errMsgs[0]/* 国际化处理： 取消作废失败！*/
			});
		}
		// 全部成功
		if (res.data.status == 1) {
			toast({
				color: 'success',
				content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000017')/* 国际化处理： 取消作废成功！*/
			});
		}
	};
	doAjax.call(this, sendData, URI.endoreListNullifyCancel, successCallback);
};

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, record, data, index) {
	let returnData = data[LIST.tableCode].rows;
	//处理选择数据
	let pk_endore_h_check = record.pk_endore.value;
	returnData.forEach((returnval) => {
		if (pk_endore_h_check === returnval.values.pk_endore.value) {
			let updateDataArr = [
				{
					index: index,
					data: { values: returnval.values }
				}
			];
			that.props.table.updateDataByIndexs(LIST.tableCode, updateDataArr);
		}
	});
}

/*3qjakgBz8U307oLILQl1lx3XstScvLgmLN/C321/eZA4AjtcYm0K1c08g9qyfA+E*/