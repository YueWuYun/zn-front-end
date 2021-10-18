/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/
import { ajax, toast } from 'nc-lightapp-front';
import { searchBtnClick } from './search';
import { card, baseReqUrl, javaUrl,datastatus } from '../../cons/constant.js';
import { buttonDisabled } from './buttonClick'
// import { promptMessage } from '../../commom';
import { COMMON_BTN,BTN_AREA } from '../../../../public/cons/constant';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
const { EDIT_INNER_BTN, DELETE_INNER_BTN, SUBMIT_INNER_BTN, UNSUBMIT_INNER_BTN, ENTRUST_INNER_BTN, UNENTRUST_INNER_BTN} = COMMON_BTN;
const {allsuccess,allfail,partialsuccess} = datastatus;
/**
 * table-button点击事件
 * @param {*} key     注册按钮编码
 * @param {*} record  当前单据的全数据
 * @param {*} index   当前单据的行下标
 */
export function bodyButtonClick (key, record, index) {
    let list= [{
        data: {
            values: record
        },
        index
    }];
    switch (key) {
        case EDIT_INNER_BTN:  //修改
            let eidtid = record[this.primaryId].value;
			let querydata = {pk: eidtid};
			ajax({
				url: `${baseReqUrl}${javaUrl.editpermission}.do`,
				data: querydata,
				success: (res) => {
					if (res.success) {
						// props.table.selectAllRows(this.tableId,false);
						// props.pushTo(constant.cardpath, {
						// 	status: 'edit',
						// 	id: eidtid
                        // });
                        go2CardCheck({
                            props: this.props,
                            url: `${baseReqUrl}${javaUrl.gotocardcheck}.do`,
                            pk: record[this.primaryId].value,
                            ts: record["ts"].value,
                            checkTS: record["ts"].value ? true : false,
                            checkSaga: false,
                            fieldPK: this.primaryId,
                            go2CardFunc: () => {
                                this.props.pushTo('/card', {
                                    status: 'edit',
                                    id: eidtid,
                                    pagecode: card.pageCode
                                });
                            }
                        })
					}
				}
			});
            break;
        case DELETE_INNER_BTN:  //删除 
            bodyBtnOperation.call(this, list, javaUrl.delete, this.state.json['36362IDA-000007'], false, null, this.state.json['36362IDA-000005'])/* 国际化处理： 删除成功!*/
            break;
        case SUBMIT_INNER_BTN:  //提交
            bodyBtnOperation.call(this, list, javaUrl.commit, this.state.json['36362IDA-000001'], false, null, this.state.json['36362IDA-000023']);/* 国际化处理： 提交成功!,提交,提交*/
            break;
        case  UNSUBMIT_INNER_BTN:  //收回
            bodyBtnOperation.call(this, list, javaUrl.uncommit, this.state.json['36362IDA-000010'], false, null, this.state.json['36362IDA-000024']);/* 国际化处理： 收回成功!,收回,收回*/
            break;
        case ENTRUST_INNER_BTN:  //委托办理
            bodyBtnOperation.call(this, list, javaUrl.entrust, this.state.json['36362IDA-000028'], false, null, this.state.json['36362IDA-000030']);/* 国际化处理： 提交成功!,提交,提交*/
            break;
        case  UNENTRUST_INNER_BTN:  //取消委托办理
            bodyBtnOperation.call(this, list, javaUrl.unentrust, this.state.json['36362IDA-000029'], false, null, this.state.json['36362IDA-000031']);/* 国际化处理： 收回成功!,收回,收回*/
            break;
        default:
            break;
    }
}

/**
 * 按钮交互
 * @param {*} data         数据
 * @param {*} path         接口地址
 * @param {*} content      toast弹框显示内容
 * @param {*} isBatch      是否是批量操作
 * @param {*} userObj      提交即指派使用
 * @param {*} opername     为批量操作提示语准备
 */
export function bodyBtnOperation (list, path, content, isBatch= false, userObj= null, opername) {
    if (isBatch && !list.length) {
        toast({
            color: 'warning', content: this.state.json['36362IDA-000020']/* 国际化处理： 请选择至少一条数据!*/
        });
        return;
    }
    let data= {
        pageCode: this.pageId,
        pks: [],
        pkMapTs: new Map()
    };
    let indexArr= [], pkMapRowIndex= new Map();
    for (let item of list) {
        let pk= item.data.values[this.primaryId] && item.data.values[this.primaryId].value;
        let ts= item.data.values.ts && item.data.values.ts.value;
        let index= item.index ;
        indexArr.push(index);
        data.pks.push(pk);
        if (pk && ts) {
            data.pkMapTs.set(pk, ts);
            pkMapRowIndex.set(pk, index);
        }
    }
    
    if (userObj) {
        data.userObj= userObj;
    }
    ajax({
        url: `${baseReqUrl}${path}.do`,
        data,
        success: (res) => {
            if (res.success) {
                
                if (path=== javaUrl.delete) {
                    PromptMessage.call(this, res, opername,content);
                    let deleteRowIndexArr = [];
                    let deleteRowPksArr = [];
                    if (res.data.status ==  allsuccess) {//全部成功
                        deleteRowPksArr= data.pks;
                        deleteRowIndexArr= indexArr;
                    } else if (res.data.status == partialsuccess) {//部分失败
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
                } else if (path=== javaUrl.commit && !isBatch) {
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
                        if(res.data.status == allsuccess || res.data.status == partialsuccess){
                            if (res.data && res.data.billCards) {
                                let row = res.data.billCards[0].head[this.tableId].rows[0];
                                let updateDataArr = [{
                                    index: list[0].index,
                                    data: { values: row.values }
                                }];
                                this.props.table.updateDataByIndexs(this.tableId, updateDataArr);
                            }
                        }
                        
                        PromptMessage.call(this, res, opername,content);
                    }
                } else {
                    // promptMessage(res, opername, content);
                    let result;
                    if (res.data && res.data.billCards) {
                        result = res.data.billCards;
                    }
                    if (res.data.status == allsuccess || res.data.status == partialsuccess) {
                        if (result) {
                            result.forEach(value => {
                                let pk =
                                    value.head[this.tableId].rows[0].values[this.primaryId].value;
                                let updateDataArr = [{
                                        index: pkMapRowIndex.get(pk),
                                        data: {
                                            values:value.head[this.tableId].rows[0].values
                                        }
                                    }];
                                this.props.table.updateDataByIndexs(
                                    this.tableId,
                                    updateDataArr
                                );
                            });
                        }
                    }
                    PromptMessage.call(this, res, opername,content);
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
    let { status, msg } = res.data;
    let errMsgArr = res.data.errormessages;
    if (Msg) {
        if(status == allsuccess){
            toast({ color: "success", content: Msg });
        }else if (status == allfail){
            toast({ color: "danger", content: errMsgArr[0] });
        }
        return;
    }
    let content;
    let total = res.data.total;
    let successNum = res.data.successNum;
    let failNum = res.data.failNum;
    content = this.state.json['3636PUBLIC-000001'] + opername + total + this.state.json['3636PUBLIC-000002'];/* 国际化处理： 共,条，*/
    content = content + this.state.json['3636PUBLIC-000003'] + successNum + this.state.json['3636PUBLIC-000004'];/* 国际化处理： 成功,条 ,,成功*/
    content = content + this.state.json['3636PUBLIC-000005'] + failNum + this.state.json['3636PUBLIC-000006'];/* 国际化处理： 失败,条,条*/
    //全部成功
    if (status == allsuccess) {
        toast({
            color: "success",
            title: opername + msg,
            content: content,
            TextArr: [this.state.json['3636PUBLIC-000007'], this.state.json['3636PUBLIC-000008'], this.state.json['3636PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
            groupOperation: true
        });
    }
    //全部失败
    else if (status == allfail) {
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
    else if (status == partialsuccess) {
        toast({
            duration: "infinity",
            color: "warning",
            title: opername + msg,
            content: content,
            TextArr: [this.state.json['3636PUBLIC-000007'], this.state.json['3636PUBLIC-000008'], this.state.json['3636PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
            groupOperation: true,
            groupOperationMsg: errMsgArr
        });
    }
}
/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/