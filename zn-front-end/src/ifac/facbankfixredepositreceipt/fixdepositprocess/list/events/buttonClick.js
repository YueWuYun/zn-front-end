/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print, output, promptBox } from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
import { getDefData } from '../../../../../tmpub/pub/util/cache';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
import { listMultiOperator } from '../../../../pub/utils/IFACButtonUtil';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
import {head_hidden_buttons } from "../../cons/constant";
let { pageCodeCard, tableId, base_url, nodekey, searchId, app_code, pageCodeList, dataSource, search_key, pkname } = CONSTANTS;
export default function buttonClick(props, id, text, index) {
    switch (id) {
        //头部新增
        case 'Add':
            props.pushTo('/card', {
                pagecode: pageCodeCard,
                status: 'add'
            });
            break;

        //头部删除
        case 'Delete':
            let multiLang = this.props.MutiInit.getIntl(app_code);
            let deleteDatas = this.props.table.getCheckedRows(tableId);
            promptBox({
                color: "warning",
                title: multiLang.get('36140FDSR-000015'),/* 国际化处理： 删除*/
                content: multiLang.get('36140FDSR-000013'),/* 国际化处理： 确认要删除吗?*/
                //beSureBtnClick: delBill.bind(this, props)
                beSureBtnClick: delMultBill.bind(this, deleteDatas, base_url + 'MultDeleteaction.do', null, true, null, multiLang.get('36140FDSR-000015'))  /* 国际化处理： 删除*/
            });
            break;
        //头部 复制
        case 'Copy':
            let copyData = searchdata.call(this, props);
            copyBill.call(this, props, copyData);
            break;
        //头部 记账
        case 'Tally':
            tallyHeadConfirm.call(this, props);
            break;
        //头部 取消记账
        case 'Untally':
            untallyHeadConfirm.call(this, props);
            break;
        //头部 刷新
        case 'Refresh':
            refreshHtml.call(this, props);
            break;
        //附件管理
        case 'File':
            fileMgr.call(this, props);
            break;
        // 联查凭证
        case 'queryVoucher':
            let voucherData = searchdata.call(this, props);
            if (voucherData.length != 1) {
                toast({
                    color: 'warning',
                    content: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000018') //{/* 国际化处理： 未查询出符合条件的数据！*/} /* 国际化处理： 请选择一行进行操作！*/
                });
                return;
            }
            let pk_deposit, billnov, pk_groupv, pk_orgv;
            let billtype = '36E1';
            //处理选择数据
            voucherData.forEach((val) => {
                pk_deposit = val.data.values.pk_deposit.value;
                billnov = val.data.values.vbillcode.value;
                pk_groupv = val.data.values.pk_group.value;
                pk_orgv = val.data.values.pk_org.value;
            });
            linkVoucherApp(
                this.props,
                pk_deposit,
                pk_groupv,
                pk_orgv,
                billtype,
                billnov,
            );
            break;
        //头部 联查--结算账户余额    
        case 'balanceAccount':
            let selectDatas = searchdata.call(this, props);
            if (selectDatas.length != 1) {
                toast({
                    color: 'warning',
                    content: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000018') //{/* 国际化处理： 未查询出符合条件的数据！*/} /* 国际化处理： 请选择一行进行操作！*/
                });
                return;
            }
            let settleacc_arr = [];
            let pk_org_settleacc, pk_settleacc;
            pk_org_settleacc = selectDatas[0].data.values.pk_org.value;
            pk_settleacc = selectDatas[0].data.values.pk_settleacc.value;

            let settleacc_data = {
                // 资金组织
                pk_org: pk_org_settleacc,
                // 结算账户
                pk_account: pk_settleacc,
            };
            settleacc_arr.push(settleacc_data);
            this.setState({
                showOriginalData: settleacc_arr,
                showOriginal: true,
            });
            break;

        // 打印
        case 'Print':
            let printData = searchdata.call(this, props);
            let pks = [];
            printData.forEach((vale) => {
                pks.push(vale.data.values.pk_deposit.value);
            });
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                base_url + 'FDSRPrintaction.do',
                {
                    appcode: app_code,
                    nodekey: null,//模板节点标识
                    oids: pks
                }
            );
            break;
        // 输出
        case 'Output':
            let outputData = props.table.getCheckedRows(tableId);
            let outputpks = [];
            outputData.forEach((item) => {
                outputpks.push(item.data.values.pk_deposit.value);
            });
            output({
                url: base_url + 'FDSRPrintaction.do',
                data: {
                    nodekey: null,
                    appcode: app_code,
                    oids: outputpks,
                    outputType: 'output'
                }
            });
            break;
    }
}

const searchdata = function (props) {
    let selectdata = props.table.getCheckedRows(tableId);
    //数据校验
    if (selectdata.length == 0) {
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36140FDSR-000045") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000045'),/* 国际化处理： 请选中一行数据！*/
        });
        return;
    }
    return selectdata;
};
/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
const fileMgr = function (props) {
    let selectDatas = props.table.getCheckedRows(tableId);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000018') });/* 国际化处理： 请选中一行数据！*/
        return;
    }
    let billID = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[pkname] && selectDatas[0].data.values[pkname].value;
    let billNO = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['vbillcode'] && selectDatas[0].data.values['vbillcode'].value;
    this.setState({
        showUploader: !this.state.showUploader,
        billID,
        billNO
    });
}
//刷新列表信息
const refreshHtml = function (props) {
    let searchVal = getDefData(dataSource, search_key);
    // 分页
    let pageInfo = props.table.getTablePageInfo(tableId);
    pageInfo.pageIndex = 0;
    //查询condition
    if (!searchVal) {
        searchVal = props.search.getAllSearchData(searchId);
    }
    let queryInfo = props.search.getQueryInfo(searchId);
    let oid = queryInfo.oid;
    if (searchVal) {
        let data = {
            querycondition: searchVal,
            conditions: searchVal,
            pageInfo: pageInfo,
            pageCode: pageCodeList,
            queryAreaCode: searchId,
            oid: oid,
            querytype: 'tree'
        };
        ajax({
            url: requesturl.query,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        props.table.setAllTableData(tableId, data[tableId]);
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                    }
                    toast({
                        duration: 3,
                        title: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000037'),/* 国际化处理： 刷新成功！*/
                        color: 'success'
                    })
                }
            }
        });
    }
}
/**
 * 删除数据
 */
const delBill = function (props, record) {
    listMultiOperator(
        props,
        pageCodeList,
        tableId,
        pkname,
        base_url + 'FDSRDeleteaction.do',
        loadMultiLang(props, '36140FDSR-000015'),
        dataSource);/* 国际化处理： 删除*/
    props.button.setButtonDisabled(head_hidden_buttons, true);
    //新增，刷新可见
    props.button.setButtonDisabled(['Add', 'Refresh', 'Link'], false);
}
/**
 * 批量删除数据
 */
const delMultBill = function (list, path, content, isBatch = false, userObj = null, opername) {
    let data = {
        pageCode: pageCodeList,
        pks: [],
        pkMapTs: new Map()
    };
    let indexArr = [], pkMapRowIndex = new Map();
    for (let item of list) {
        let pk = item.data.values["pk_deposit"] && item.data.values["pk_deposit"].value;
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
        url: path,
        data,
        success: (res) => {
            if (res.success) {
                    PromptMessage.call(this, res, opername, content);
                    let deleteRowIndexArr = [];
                    let deleteRowPksArr = [];
                    if (res.data.status == '0') {//全部成功
                        deleteRowPksArr = data.pks;
                        deleteRowIndexArr = indexArr;
                    } else if (res.data.status == '2') {//部分失败
                        if (res.data && res.data.billCards) {
                            res.data.billCards.forEach((value) => {
                                let pk = value.head[tableId].rows[0].values["pk_deposit"].value;
                                deleteRowPksArr.push(pk);
                                deleteRowIndexArr.push(pkMapRowIndex.get(pk));
                            });
                        }
                    }
                    this.props.table.deleteCacheId(tableId, deleteRowPksArr);
                    this.props.table.deleteTableRowsByIndex(tableId, deleteRowIndexArr);
                
            }}})
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
    	if(opername=='删除' && total==1){
            toast({
                color: "success",
                title: "删除成功",
                TextArr: [this.state.json['3636PUBLIC-000007'], this.state.json['3636PUBLIC-000008'], this.state.json['3636PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
                groupOperation: true
            });
        }else{
	        toast({
	            color: "success",
	            title: opername + msg,
	            content: content,
	            TextArr: [this.state.json['3636PUBLIC-000007'], this.state.json['3636PUBLIC-000008'], this.state.json['3636PUBLIC-000009']],/* 国际化处理： 展开,收起,关闭*/
	            groupOperation: true
	        	});
        	}
            this.props.button.setButtonDisabled(head_hidden_buttons, true);
            //新增，刷新可见
            this.props.button.setButtonDisabled(['Add', 'Refresh', 'Link'], false);
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

/**
 * 修改加载数据
 */
const copyBill = function (props, record) {
    let pk = record[0].data.values['pk_deposit'].value;
    props.pushTo('/card', {
        pagecode: pageCodeCard,
        status: 'add',
        id: pk,
        isCopy: 'copy'
    });
}

/**
 * 记账
 * @param {*} props 
 */
const tallyHeadConfirm = function (props) {
    let requrl = base_url + 'FDSRTallyaction.do';
    let multiLang = this.props.MutiInit.getIntl(app_code);
	//20200115xuechh云原生适配
    listMultiOperator(props, pageCodeList, tableId, pkname, requrl, multiLang.get('36140FDSR-000067'), CONSTANTS.FixDepositProcessConst.dataSource, null, { btncode: 'Tally', pagecode: pageCodeList });/* 国际化处理：记账成功*/
};

/**
 * 取消记账
 * @param {*} props 
 */
const untallyHeadConfirm = function (props) {
    let requrl = base_url + 'FDSRUntallyaction.do';
    let multiLang = this.props.MutiInit.getIntl(app_code);
	//20200115xuechh云原生适配
    listMultiOperator(props, pageCodeList, tableId, pkname, requrl, multiLang.get('36140FDSR-000068'), CONSTANTS.FixDepositProcessConst.dataSource, null, { btncode: 'Untally', pagecode: pageCodeList });/* 国际化处理：取消记账成功*/
};
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/