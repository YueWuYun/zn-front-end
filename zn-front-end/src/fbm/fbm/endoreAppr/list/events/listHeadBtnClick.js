/*9k43NIHQ9Q7ex8VdWjYvNqHOSaRzMesuRPV2YDsyKkScYtHkaVOipJBMF+2tCLH+*/
import { toast, promptBox } from 'nc-lightapp-front';
import { URI, LIST, CARD, LIST_BTN } from '../../cons/constant';
import searchBtnClick from './searchBtnClick';
import { doAjax, isEmptyObject } from '../../utils/commonUtil';
import { BatchToast, OPERA_TYPE } from '../../utils/messageUtil';
import buttonDisabledRule from './buttonDisabledRule';
/**
 * 背书办理列表 头部按钮事件
 * @author：gaokung
 */
export function listHeadBtnClick(props, key) {
	let selectedRows;
	if (key !== LIST_BTN.add) {
		// 获取选中行
		selectedRows = this.props.table.getCheckedRows(LIST.tableCode);
		if (isEmptyObject(selectedRows)) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000036') });/* 国际化处理： 未选择数据！*/
			return;
		}
	}
	switch (key) {
		case LIST_BTN.add: // 新增
			handleAddClick.call(this, selectedRows);
			break;
		case LIST_BTN.delete: // 删除
			handleDeleteClick.call(this, selectedRows);
			break;
		case LIST_BTN.copy: // 复制
			handleCopyClick.call(this, selectedRows);
			break;
		case LIST_BTN.refresh: // 刷新
			handleRefreshClick.call(this);
			break;
		case LIST_BTN.commit: // 提交
			handleCommitClick.call(this, selectedRows);
			break;
		case LIST_BTN.uncommit: // 收回
			handleUnCommitClick.call(this, selectedRows);
			break;

		case LIST_BTN.commandSend: // 发送指令
			handleCommandSendClick.call(this, selectedRows);
			break;
		case LIST_BTN.commandCancel: // 撤回指令
			handleCommandCancelClick.call(this, selectedRows);
			break;
		case LIST_BTN.nullify: // 作废
			handleNullifyClick.call(this, selectedRows);
			break;
		case LIST_BTN.nullifyCancel: // 取消作废
			handleNullifyCancelClick.call(this, selectedRows);
			break;
		case LIST_BTN.attachment: // 附件
			handleAttackmentClick.call(this, selectedRows);
			break;
		case LIST_BTN.print: // 打印
			handlePrintClick.call(this, selectedRows);
			break;
		case LIST_BTN.output: // 输出
			handleOutPutClick.call(this, selectedRows);
			break;
		case LIST_BTN.export: // 导出格式文件
			doExport.call(this, this.props);
			break;
		default:
			break;
	}
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, selectDatas, retData) {
	let returnData = retData[LIST.tableCode].rows;
	//处理选择数据
	selectDatas.forEach((val) => {
		let pk_endore_h_check = val.data.values.pk_endore.value;
		returnData.forEach((retrunval) => {
			if (pk_endore_h_check === retrunval.values.pk_endore.value) {
				let updateDataArr = [
					{
						index: val.index,
						data: { values: retrunval.values }
					}
				];
				that.props.table.updateDataByIndexs(LIST.tableCode, updateDataArr);
			}
		});
	});
}
// 处理按钮操作返回数据，刷新选中记录数据
function handleRequestData(selectDatas) {
	if (!selectDatas || selectDatas.length == 0) {
		toast({
			color: 'warning',
			content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000037')/* 国际化处理： 请选择至少一行数据！*/
		});
		return;
	}

	let pks = [];
	let tss = [];
	selectDatas.forEach((val) => {
		pks.push(val.data.values.pk_endore.value);
		tss.push(val.data.values.ts.value);
	});

	let sendData = {
		pageid: LIST.pageCode,
		pks: pks,
		tss: tss,
		isCardOpt: false
	};
	return sendData;
}
function getMinIndex(selectedRows) {
	if (selectedRows.length < 1) {
		return null;
	}
	let minIndex = selectedRows[0].index;
	selectedRows.forEach((element) => {
		if (element.index < minIndex) {
			minIndex = element.index;
		}
	});
	return minIndex;
}
/**
 * 新增按钮事件
 */
const handleAddClick = function() {
	this.props.pushTo('/card', {
		status: 'add',
		pagecode: CARD.pageCode
	});
};

/**
 * 删除按钮事件
 * @param {*} selectedRows 选中的行数据
 */
const handleDeleteClick = function(selectedRows) {
	let toastContent;
	if (selectedRows.length === 0) {
		// 未选择
		toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000038') });/* 国际化处理： 请选中至少一条数据！*/
		return;
	} else if (selectedRows.length > 1) {
		//选多条
		toastContent = this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000039');/* 国际化处理： 确定要删除所选数据吗?*/
	} else {
		// 选一条
		toastContent = this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000040');/* 国际化处理： 确定要删除吗?*/
	}
	promptBox({
		color: 'warning',
		title: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000005'),/* 国际化处理： 删除*/
		content: toastContent,
		beSureBtnClick: delConfirm.bind(this)
	});
};

/**
 * 确认删除
 */
function delConfirm() {
	let selectDatas = this.props.table.getCheckedRows(LIST.tableCode);

	let sendData = handleRequestData(selectDatas);

	//成功回调
	let successCallback = function(res) {
		// if (res.data.grid) {
		// 	handleReturnData(that, selectDatas, res.data.grid);
		// }
		if (res.data.status) {
			BatchToast(
				OPERA_TYPE.DELETE,
				res.data.status,
				res.data.total,
				res.data.successNum,
				res.data.failNum,
				res.data.errMsgs,
				null
			);
		}
		handleRefreshClick.call(this);
	};
	doAjax.call(this, sendData, URI.endoreListDelete, successCallback);
}

/**
 * 复制按钮事件
 * @param {*} selectedRows
 */
const handleCopyClick = function(selectedRows) {
	// 当选中条数大于 1 条数据时 复制下标最小的一条数据
	if (selectedRows.length > 1) {
		let minIndex = getMinIndex(selectedRows);
		this.props.pushTo('/card', {
			status: 'copy',
			id: selectedRows[minIndex]['data']['values']['pk_endore']['value'],
			oldId: selectedRows[minIndex]['data']['values']['pk_endore']['value'],
			pagecode: CARD.pageCode
		});
	}
	// 选中一条时直接跳转卡片页并传递选中行pk
	if (selectedRows.length == 1) {
		this.props.pushTo('/card', {
			status: 'copy',
			id: selectedRows[0]['data']['values']['pk_endore']['value'],
			oldId: selectedRows[0]['data']['values']['pk_endore']['value'],
			pagecode: CARD.pageCode
		});
	}
};

/**
 * 刷新按钮事件
 * @param {*} selectedRows
 */
const handleRefreshClick = function() {
	// 重新查询数据
	searchBtnClick.call(this);
};

/**
 * 提交按钮事件
 * @param {*} selectedRows
 */
const handleCommitClick = function(selectDatas) {
	let sendData = handleRequestData(selectDatas);

	let successCallback = function(res) {
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, selectDatas, res.data.grid);
		}
		if (res.data.workflow && (res.data.workflow === 'approveflow' || res.data.workflow === 'workflow')) {
			this.setState({
				compositedata: res.data,
				compositedisplay: true
			});
		} else {
			let successIndexs = 0,
				failIndexs = 0;
			if (res.data.successpks) {
				successIndexs = res.data.successpks.length;
			}
			failIndexs = selectDatas.length - successIndexs;
			// 全部成功
			if (failIndexs == 0) {
				BatchToast(OPERA_TYPE.COMMIT, 1, selectDatas.length, successIndexs, failIndexs, null, null);
			} else if (selectDatas.length == failIndexs) {
				// 全部失败
				BatchToast(
					OPERA_TYPE.COMMIT,
					0,
					selectDatas.length,
					successIndexs,
					failIndexs,
					res.data.errMsg && res.data.errMsg.split('\n'),
					null
				);
			} else if (failIndexs > 0) {
				// 部分成功
				BatchToast(
					OPERA_TYPE.COMMIT,
					2,
					selectDatas.length,
					successIndexs,
					failIndexs,
					res.data.errMsg && res.data.errMsg.split('\n'),
					null
				);
			}
		}
		// 按钮使用规则
		buttonDisabledRule.call(this);
	};
	doAjax.call(this, sendData, URI.endoreListCommit, successCallback);
};

/**
 * 收回按钮事件
 * @param {*} selectedRows
 */
const handleUnCommitClick = function(selectDatas) {
	let sendData = handleRequestData(selectDatas);

	let successCallback = function(res) {
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, selectDatas, res.data.grid);
		}
		if (res.data.status) {
			BatchToast(
				OPERA_TYPE.UNCOMMIT,
				res.data.status,
				res.data.total,
				res.data.successNum,
				res.data.failNum,
				res.data.errMsgs,
				null
			);
		}
		// 按钮使用规则
		buttonDisabledRule.call(this);
	};
	doAjax.call(this, sendData, URI.endoreListUnCommit, successCallback);
};

/**
 * 发送指令按钮事件
 * @param {*} selectedRows
 */
const handleCommandSendClick = function(selectDatas) {
	let sendData = handleRequestData(selectDatas);

	let successCallback = function(res) {
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, selectDatas, res.data.grid);
		}
		if (res.data.status) {
			BatchToast(
				OPERA_TYPE.COMMANDSEND,
				res.data.status,
				res.data.total,
				res.data.successNum,
				res.data.failNum,
				res.data.errMsgs,
				null
			);
		}
		// 按钮使用规则
		buttonDisabledRule.call(this);
	};
	doAjax.call(this, sendData, URI.endoreListCommandSend, successCallback);
};

/**
 * 撤回指令按钮事件
 * @param {*} selectedRows
 */
const handleCommandCancelClick = function(selectDatas) {
	let sendData = handleRequestData(selectDatas);

	let successCallback = function(res) {
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, selectDatas, res.data.grid);
		}
		if (res.data.status) {
			BatchToast(
				OPERA_TYPE.COMMANDCANCEL,
				res.data.status,
				res.data.total,
				res.data.successNum,
				res.data.failNum,
				res.data.errMsgs,
				null
			);
		}
		// 按钮使用规则
		buttonDisabledRule.call(this);
	};
	doAjax.call(this, sendData, URI.endoreListCommandCancel, successCallback);
};

/**
 * 作废按钮事件
 * @param {*} selectedRows
 */
const handleNullifyClick = function() {

	this.setState({
		disabledComShow: true,
		disableClickBtn: 'HEAD'
	},()=>{
		this.props.form.setFormStatus(this.disableNote, 'edit');
	});
};

/**
 * 作废弹框回调函数
 * @param {*} disableReason 
 */
export function confirmOfDisableOnListHead(disableReason) {
	let selectedRows = this.props.table.getCheckedRows(LIST.tableCode);
	let pks = [];
	let tss = [];
	selectedRows.forEach((val) => {
		pks.push(val.data.values.pk_endore.value);
		tss.push(val.data.values.ts.value);
	});

	let sendData = {
		pageid: LIST.pageCode,
		pks: pks,
		tss: tss,
		isCardOpt: false,
		disableReason: disableReason[LIST.disableNote]
	};

	let successCallback = function(res) {
		this.setState({
			disabledComShow: false
		});
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, selectedRows, res.data.grid);
		}
		if (res.data.status) {
			BatchToast(
				OPERA_TYPE.NULLIFY,
				res.data.status,
				res.data.total,
				res.data.successNum,
				res.data.failNum,
				res.data.errMsgs,
				null
			);
		}
		// 按钮使用规则
		buttonDisabledRule.call(this);
	};
	doAjax.call(this, sendData, URI.endoreListNullify, successCallback);
}

/**
 * 取消作废按钮事件
 * @param {*} selectedRows
 */
const handleNullifyCancelClick = function(selectDatas) {
	let sendData = handleRequestData(selectDatas);

	let successCallback = function(res) {
		let that = this;
		if (res.data.grid) {
			handleReturnData(that, selectDatas, res.data.grid);
		}
		if (res.data.status) {
			BatchToast(
				OPERA_TYPE.NULLIFYCANCEL,
				res.data.status,
				res.data.total,
				res.data.successNum,
				res.data.failNum,
				res.data.errMsgs,
				null
			);
		}
		// 按钮使用规则
		buttonDisabledRule.call(this);
	};
	doAjax.call(this, sendData, URI.endoreListNullifyCancel, successCallback);
};
/**
 * 附件按钮事件
 * @param {*} selectedRows
 */
const handleAttackmentClick = function(selectedRows) {
	// 当选中条数大于 1 条数据时 取用下标最小的一条数据
	if (selectedRows.length > 1) {
		// console.info(selectedRows);
		let minIndex = getMinIndex(selectedRows);
		let billno = selectedRows[minIndex]['data']['values']['vbillno']['value'];
		let pk_endore = selectedRows[minIndex]['data']['values']['pk_endore']['value'];

		this.setState({
			showUploader: !this.state.showUploader,
			billInfo: {
				target: null,
				billId: pk_endore,
				billNo: billno
			}
		});
	}
	// 选中一条时直接跳转卡片页并传递选中行pk
	if (selectedRows.length == 1) {
		let billno = selectedRows[0]['data']['values']['vbillno']['value'];
		let pk_endore = selectedRows[0]['data']['values']['pk_endore']['value'];

		this.setState({
			showUploader: !this.state.showUploader,
			billInfo: {
				target: null,
				billId: pk_endore,
				billNo: billno
			}
		});
	}
};

/**
 * 打印,支持批量
 * @param {*} selectedRows 
 */
function handlePrintClick(selectedRows) {
	let pk_endores = [];

	selectedRows.forEach((element) => {
		let pk_endore = element['data']['values']['pk_endore']['value'];
		pk_endores.push(pk_endore);
	});

	doPrint.call(this, pk_endores, this.props);
}

/**
 * 打印
 * @param {*} printpks 
 * @param {*} props 
 */
function doPrint(printpks, props) {
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
		URI.endoreListPrintOutput,
		{
			appcode: appcode,
			nodekey: 'NCC36180ET',
			oids: printpks
		}
	);
}

/**
 * 输出,支持批量
 * @param {*} selectedRows 
 */
function handleOutPutClick(selectedRows) {
	let pk_endores = [];

	selectedRows.forEach((element) => {
		let pk_endore = element['data']['values']['pk_endore']['value'];
		pk_endores.push(pk_endore);
	});

	doOutPut.call(this, pk_endores ,this.props);
}
/**
 * 输出
 * @param {*} outputpks 
 * @param {*} props
 */
function doOutPut(outputpks, props) {
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
				nodekey: 'NCC36180ET', //模板节点标识
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
 * 模板导出
 * @param {*} props
 */
function doExport(props) {
    this.setState({
        selectedPKS: []
    });
    props.modal.show("exportFileModal"); //不需要导出的只执行这行代码
}

/*9k43NIHQ9Q7ex8VdWjYvNqHOSaRzMesuRPV2YDsyKkScYtHkaVOipJBMF+2tCLH+*/