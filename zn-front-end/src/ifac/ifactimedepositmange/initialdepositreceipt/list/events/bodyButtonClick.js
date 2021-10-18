/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/
import { ajax, toast } from 'nc-lightapp-front';
import { searchBtnClick } from './search';
import { list, card, baseReqUrl, javaUrl, COMMON_BTN } from '../../cons/constant.js';
// import { promptMessage } from '../../commom';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/IFACButtonUtil';
const {  EDIT_INNER_BTN, DELETE_INNER_BTN, CONFIRM_INNER_BTN, UNCONFIRM_INNER_BTN,
    COPY_BTN,
    EDIT_BTN,
    DELETE_BTN,
    CONFIRM_BTN,
    UNCONFIRM_BTN,
    ENCLOSURE_BTN,
    //LINK,
    // LINK_GROUP,
    AIACT_RATE,
    DEPOSIT_RATE,
    PREVIEW_BTN,
    PRINT_BTN,
    PRINT_GROUP,
    PRINT,
    OUTPUT_BTN } = COMMON_BTN;

/**
 * table-button点击事件
 * @param {*} key     注册按钮编码
 * @param {*} record  当前单据的全数据
 * @param {*} index   当前单据的行下标
 */
export function bodyButtonClick(props,key, record, index) {
    let list = [{
        data: {
            values: record
        },
        index
    }];
    switch (key) {
        case EDIT_INNER_BTN:  //修改

            let eidtid = record[this.primaryId].value;
            let querydata = { pk: eidtid };
            ajax({
                url: `${baseReqUrl}${javaUrl.editpermission}.do`,
                data: querydata,
                success: (res) => {
                    if (res.success) {
                        go2CardCheck({
                            props: this.props,
                            url: `${baseReqUrl}${javaUrl.check2card}.do`,
                            pk: record[this.primaryId].value,
                            ts: record["ts"].value,
                            checkTS: record["ts"].value ? true : false,
                            checkSaga: false,
                            fieldPK: this.primaryId,
                            go2CardFunc: () => {
                                this.props.pushTo("/card", {
                                    status: "edit",
                                    id: record[this.primaryId].value,
                                    pagecode: card.pageCode
                                });
                            }
                        })
                        // this.props.pushTo('/card', {
                        //     status: 'edit',
                        //     id: eidtid,
                        //     pagecode: card.pageCode
                        // });
                    }
                }
            });

            break;
        //确认
        case CONFIRM_INNER_BTN:
            tallyConfirm.call(this, props, record, index);
            break;
        //取消确认
        case UNCONFIRM_INNER_BTN:
            unTallyConfirm.call(this, props,record, index);
            break;
        // case CONFIRM_INNER_BTN:  //提交
        //     bodyBtnOperation.call(this, list, javaUrl.confirm, this.state.json['36340FDLI-000001'], false, null, this.state.json['36340FDLI-000023']);/* 国际化处理： 提交成功!,提交,提交*/
        //     break;
        // case  UNCONFIRM_INNER_BTN:  //收回
        //     bodyBtnOperation.call(this, list, javaUrl.unconfirm, this.state.json['36340FDLI-000010'], false, null, this.state.json['36340FDLI-000024']);/* 国际化处理： 收回成功!,收回,收回*/
        //     break;
        case DELETE_INNER_BTN:  //删除 
            bodyBtnOperation.call(this, list, javaUrl.delete, this.state.json['36340FDLI-000007'], false, null, this.state.json['36340FDLI-000005'])/* 国际化处理： 删除成功!*/
            break;
        default:
            break;
    }
}
const tallyConfirm = function (props, record, index) {
	
	let pkMapTs = {};
	let pk = record[list.primaryId].value;
	let ts = record.ts.value;
	pkMapTs[pk] = ts;
	ajax({
		url: `${baseReqUrl}${javaUrl.confirm}.do`,
		data: {
			pkMapTs,
			pageCode: list.pageCode
		},
		success: (res) => {
			// toast({ color: 'success', content: loadMultiLang(props, '36340FDLB--000064') });/* 国际化处理： 删除成功*/
			toast({ color: 'success', content: this.state.json['36340FDLI-000017'] });/* 国际化处理： 确认成功*/
			let updateDataArr = [{
				index: index,
				data: { values: res.data.head[card.headCode].rows[0].values }
				}];
			props.table.updateDataByIndexs(list.tableCode, updateDataArr);
			//buttonUsability.call(this, props, null);
		}
	});
};


//取消确认
const unTallyConfirm = function (props, record, index) {
	
	let pkMapTs = {};
	let pk = record[list.primaryId].value;
	let ts = record.ts.value;
	pkMapTs[pk] = ts;
	ajax({
		url: `${baseReqUrl}${javaUrl.unconfirm}.do`,
		data: {
			pkMapTs,
			pageCode: list.pageCode
		},
		success: (res) => {
			// toast({ color: 'success', content: loadMultiLang(props, '36340FDLB--000065') });/* 国际化处理： 删除成功*/
			toast({ color: 'success', content: this.state.json['36340FDLI-000010'] });/* 国际化处理： 取消确认成功*/
			let updateDataArr = [{
				index: index,
				data: { values: res.data.head[card.headCode].rows[0].values }
				}];
			props.table.updateDataByIndexs(list.tableCode, updateDataArr);
			//buttonUsability.call(this, props, null);
		}
	});
};

/**
 * 按钮交互
 * @param {*} data         数据
 * @param {*} path         接口地址
 * @param {*} content      toast弹框显示内容
 * @param {*} isBatch      是否是批量操作
 * @param {*} userObj      提交即指派使用
 * @param {*} opername     为批量操作提示语准备
 */
export function bodyBtnOperation(list, path, content, isBatch = false, userObj = null, opername) {
    if (isBatch && !list.length) {
        toast({
            color: 'warning', content: this.state.json['36340FDLI-000020']/* 国际化处理： 请选择至少一条数据!*/
        });
        return;
    }
    let data = {
        pageCode: this.pageId,
        pks: [],
        pkMapTs: new Map()
    };
    let indexArr = [], pkMapRowIndex = new Map();
    for (let item of list) {
        let pk = item.data.values[this.primaryId] && item.data.values[this.primaryId].value;
        let ts = item.data.values.ts && item.data.values.ts.value;
        let index = item.index;
        indexArr.push(index);
        data.pks.push(pk);
        if (pk && ts) {
            data.pkMapTs.set(pk, ts);
            pkMapRowIndex.set(pk, index);
        }
    }

    if (userObj) {
        data.userObj = userObj;
    }
    ajax({
        url: `${baseReqUrl}${path}.do`,
        data,
        success: (res) => {
            if (res.success) {
                if (path === javaUrl.delete) {
                    PromptMessage.call(this, res, opername, content);
                    let deleteRowIndexArr = [];
                    let deleteRowPksArr = [];
                    if (res.data.status == '0') {//全部成功
                        deleteRowPksArr = data.pks;
                        deleteRowIndexArr = indexArr;
                    } else if (res.data.status == '2') {//部分失败
                        if (res.data && res.data.billCards) {
                            res.data.billCards.forEach((value) => {
                                let pk = value.head[this.tableId].rows[0].values[this.primaryId].value;
                                deleteRowPksArr.push(pk);
                                deleteRowIndexArr.push(pkMapRowIndex.get(pk));
                            });
                        }
                    }
                    this.props.table.deleteCacheId(this.tableId, deleteRowPksArr);
                    this.props.table.deleteTableRowsByIndex(this.tableId, deleteRowIndexArr);
                } else if (path === javaUrl.confirm && !isBatch) {
                    if (res.data.result && res.data.result.workflow && ['approveflow', 'workflow'].includes(res.data.result.workflow)) {
                        this.setState({
                            compositedisplay: true, 		//是否显示指派弹窗 
                            compositedata: res.data.result, 		//指派信息
                            selectDatas: [list[0]]
                        });
                    } else {
                        this.setState({
                            compositedisplay: false, 		//是否显示指派弹窗 
                            compositedata: null, 		    //指派信息
                            selectDatas: []
                        });
                        // promptMessage(res, opername, content);
                        if (res.data.status == "0" || res.data.status == "2") {
                            if (res.data && res.data.billCards) {
                                let row = res.data.billCards[0].head[this.tableId].rows[0];
                                let updateDataArr = [{
                                    index: list[0].index,
                                    data: { values: row.values }
                                }];
                                this.props.table.updateDataByIndexs(this.tableId, updateDataArr);
                            }
                        }

                        PromptMessage.call(this, res, opername, content);
                    }
                } else {
                    // promptMessage(res, opername, content);
                    let result;
                    if (res.data && res.data.billCards) {
                        result = res.data.billCards;
                    }
                    if (res.data.status == "0" || res.data.status == "2") {
                        if (result) {
                            result.forEach(value => {
                                let pk =
                                    value.head[this.tableId].rows[0].values[this.primaryId].value;
                                let updateDataArr = [{
                                    index: pkMapRowIndex.get(pk),
                                    data: {
                                        values: value.head[this.tableId].rows[0].values
                                    }
                                }];
                                this.props.table.updateDataByIndexs(
                                    this.tableId,
                                    updateDataArr
                                );
                            });
                        }
                    }
                    PromptMessage.call(this, res, opername, content);
                }
                buttonDisabled.call(this);
            }
        }
    });
}

/**
 * 列表消息提示
 * @param {*} res           返回的response
 * @param {*} opername      操作名称
 */
export function PromptMessage(res, opername, Msg) {
    // if (Msg) {
    //     toast({ color: "success", content: Msg });
    //     return;
    // }
    let { status, msg } = res.data;
    let content;
    let total = res.data.total;
    let successNum = res.data.successNum;
    let failNum = res.data.failNum;
    content = this.state.json['3636PUBLIC-000001'] + opername + total + this.state.json['3636PUBLIC-000002'];/* 国际化处理： 共,条，*/
    content = content + this.state.json['3636PUBLIC-000003'] + successNum + this.state.json['3636PUBLIC-000004'];/* 国际化处理： 成功,条 ,,成功*/
    content = content + this.state.json['3636PUBLIC-000005'] + failNum + this.state.json['3636PUBLIC-000006'];/* 国际化处理： 失败,条,条*/
    let errMsgArr = res.data.errormessages;
    //全部成功
    if (status == 0) {
        toast({
            color: "success",
            title: opername + msg,
            content: content,
            TextArr: [this.state.json['3636PUBLIC-000007'], this.state.json['3636PUBLIC-000008'], this.state.json['3636PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
            groupOperation: true
        });
    }
    //全部失败
    else if (status == 1) {
        toast({
            duration: "infinity",
            color: "danger",
            title: opername + msg,
            content: content,
            TextArr: [this.state.json['3636PUBLIC-000007'], this.state.json['3636PUBLIC-000008'], this.state.json['3636PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
            groupOperation: true,
            groupOperationMsg: errMsgArr
        });
    }
    //部分成功
    else if (status == 2) {
        toast({
            duration: "infinity",
            color: "danger",
            title: opername + msg,
            content: content,
            TextArr: [this.state.json['3636PUBLIC-000007'], this.state.json['3636PUBLIC-000008'], this.state.json['3636PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
            groupOperation: true,
            groupOperationMsg: errMsgArr
        });
    }
}

export function buttonDisabled() {
    let selected = this.props.table.getCheckedRows(this.tableId);
    let btnArray = [
        // BTN_GROUP,
        // ADD_BTN,
        COPY_BTN,
        EDIT_BTN,
        DELETE_BTN,
        CONFIRM_BTN,
        UNCONFIRM_BTN,
        ENCLOSURE_BTN,
        //LINK,
        // LINK_GROUP,
        AIACT_RATE,
        DEPOSIT_RATE,
        PREVIEW_BTN,
        PRINT_BTN,
        PRINT_GROUP,
        PRINT,
        OUTPUT_BTN];
    // for (let item of btnArray) {
    //     btnObj[item] = !selected.length;
    // }
    if (selected.length) {
        this.props.button.setButtonDisabled(btnArray);
    }else{
        this.props.button.setButtonDisabled(btnArray,true);
    }
    
}
/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/