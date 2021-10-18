/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { ajax, print, promptBox, toast } from "nc-lightapp-front";
import {
    linkApp,
    linkVoucherApp
} from "./../../../../../tmpub/pub/util/LinkUtil";
import { BatchToast } from "./../../utils/messageUtils";
import {
    CARD_PAGE_CODE,
    FULL_AGGCLASSNAME,
    LIST_BTN,
    LIST_PAGE_CODE,
    LIST_TABLE_CODE,
    URL_LIST
} from "./../../cons/const";
import { searchButtonClick } from "./searchButtonClick";

export function buttonClick(props, id) {
    switch (id) {
        // 新增
        case LIST_BTN.ADD:
            doAdd.call(this, props);
            break;

        // 删除
        case LIST_BTN.DELETE:
            doDelete.call(this, props);
            break;

        //刷新
        case LIST_BTN.REFRESH:
            doRefresh.call(this);
            break;

        //复制
        case LIST_BTN.COPY:
            doCopy.call(this, props);
            break;

        //提交
        case LIST_BTN.COMMIT:
            doCommit.call(this, props);
            break;

        //收回
        case LIST_BTN.UNCOMMIT:
            doUnCommit.call(this, props);
            break;

        //附件
        case LIST_BTN.FILEDOCUMENT:
            doFileDocument.call(this, props);
            break;

        //联查审批详情
        case LIST_BTN.LQUERYAPPROVEINFO:
            doLQApproveInfo.call(this, props);
            break;

        //联查付款账户余额
        case LIST_BTN.LQUERYPAYACC:
            doLQPayAcc.call(this);
            break;
        
        //联查内部结算账户余额
        case LIST_BTN.LQUERYINBALAACC:
            doLQInBalaAcc.call(this);
            break;
        
        //联查内部保证金账户余额
        case LIST_BTN.LQUERYINSECURITYACC:
            doLQInSecAcc.call(this);
            break;

        //联查票据签发
        case LIST_BTN.LQUERYSIGN:
            doLQSign.call(this);
            break;

        //联查凭证
        case LIST_BTN.LQUERYVOUCHER:
            doLQVoucher.call(this);
            break;

        case LIST_BTN.LQUERYPLAN: // 联查资金预算
            linkNtb.call(this);
            break;

        case LIST_BTN.LQUERYPJBOOK: // 联查票据台账
            linkSDBook.call(this);
            break;

        //导出格式文件
        case LIST_BTN.EXPORT:
            doExport.call(this, props);
            break;

        // 打印
        case LIST_BTN.PRINT: // 打印
            handlePrintClick.call(this);
            break;

        // 输出
        case LIST_BTN.OUTPUT:
            handleOutPutClick.call(this);
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
    props.pushTo("/card", {
        status: "add",
        id: "",
        pagecode: CARD_PAGE_CODE
    });
}

/**
 * 删除
 * @param {} props
 */
function doDelete(props) {
    let mutiInit = this.props.MutiInit.getIntl("36180BP");
    let selectedData = props.table.getCheckedRows(LIST_TABLE_CODE);
    let deleteContent;
    if (selectedData.length == 0) {
        toast({
            color: "warning",
            content: mutiInit && mutiInit.get("36180BP-000017")
        }); /* 国际化处理： 请选中至少一条数据！*/
        return;
    } else if (selectedData.length > 1) {
        deleteContent =
            mutiInit &&
            mutiInit.get(
                "36180BP-000018"
            ); /* 国际化处理： 您确定要删除所选数据吗?*/
    } else {
        deleteContent =
            mutiInit &&
            mutiInit.get("36180BP-000019"); /* 国际化处理： 确定要删除吗?*/
    }
    promptBox({
        title:
            mutiInit && mutiInit.get("36180BP-000004") /* 国际化处理： 删除*/,
        color: "warning",
        content: deleteContent,
        beSureBtnClick: delConfirm.bind(this)
    });
}

/**
 * 确认删除
 */
function delConfirm() {
    let selectDatas = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    let pks = [];
    selectDatas.forEach(e => {
        pks.push(e.data.values.pk_accept.value);
    });

    // 发送数据
    let sendData = {
        pks: pks
    };

    //成功回调
    let successCallback = function(res) {
        let that = this;
        let successIndexs = 0,
            failIndexs = 0;
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }
        failIndexs = selectDatas.length - successIndexs;
        // 全部成功
        if (failIndexs == 0) {
            BatchToast.call(
                this,
                "DELETE",
                1,
                selectDatas.length,
                successIndexs,
                failIndexs,
                null,
                null,
                that
            );
        }
        // 全部失败
        else if (selectDatas.length == failIndexs) {
            BatchToast.call(
                this,
                "DELETE",
                0,
                selectDatas.length,
                successIndexs,
                failIndexs,
                res.data.errMsg && res.data.errMsg.split("\n"),
                null,
                that
            );
        }
        // 部分成功
        else if (failIndexs > 0) {
            BatchToast.call(
                this,
                "DELETE",
                2,
                selectDatas.length,
                successIndexs,
                failIndexs,
                res.data.errMsg && res.data.errMsg.split("\n"),
                null,
                that
            );
        }
    this.setState({
        isSearchBtn: 2
    });
        searchButtonClick.call(that);
    };

    doAjax.call(this, sendData, URL_LIST.DELETE, successCallback);
}

/**
 * 刷新
 */
function doRefresh() {
    this.setState({
        isSearchBtn: 0
    });
    searchButtonClick.call(this);
}

/**
 * 复制
 */
function doCopy(props) {
    let selectDatas = props.table.getCheckedRows(LIST_TABLE_CODE);

    if (!selectDatas || selectDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                    "36180BP-000020"
                ) /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    let pk_accept = selectDatas[0].data.values.pk_accept;
    props.pushTo("/card", {
        status: "copy",
        id: pk_accept && pk_accept.value,
        pagecode: CARD_PAGE_CODE
    });
}

/**
 * 提交
 * @param {*} props
 */
function doCommit(props) {
    let selectDatas = props.table.getCheckedRows(LIST_TABLE_CODE);

    if (!selectDatas || selectDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                    "36180BP-000020"
                ) /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    let pks = [];
    let tss = [];
    selectDatas.forEach(val => {
        pks.push(val.data.values.pk_accept.value);
        tss.push(val.data.values.ts.value);
    });

    let sendData = {
        pageid: LIST_PAGE_CODE,
        pks: pks,
        tss: tss,
        isCardOpt: false
    };

    let successCallback = function(res) {
        let that = this;
        if (res.data.grid) {
            handleReturnData(that, selectDatas, res.data.grid);
        }
        if (
            res.data.workflow &&
            (res.data.workflow == "approveflow" ||
                res.data.workflow == "workflow")
        ) {
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
                BatchToast.call(
                    this,
                    "commit",
                    1,
                    selectDatas.length,
                    successIndexs,
                    failIndexs,
                    null,
                    null,
                    that
                );
            }
            // 全部失败
            else if (selectDatas.length == failIndexs) {
                BatchToast.call(
                    this,
                    "commit",
                    0,
                    selectDatas.length,
                    successIndexs,
                    failIndexs,
                    res.data.errMsg && res.data.errMsg.split("\n"),
                    null,
                    that
                );
            }
            // 部分成功
            else if (failIndexs > 0) {
                BatchToast.call(
                    this,
                    "commit",
                    2,
                    selectDatas.length,
                    successIndexs,
                    failIndexs,
                    res.data.errMsg && res.data.errMsg.split("\n"),
                    null,
                    that
                );
            }
        }
    };

    doAjax.call(this, sendData, URL_LIST.COMMIT, successCallback);
}

/**
 * 收回
 * @param {*} props
 */
function doUnCommit(props) {
    let selectDatas = props.table.getCheckedRows(LIST_TABLE_CODE);

    if (!selectDatas || selectDatas.length == 0) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                    "36180BP-000020"
                ) /* 国际化处理： 请选择至少一行数据！*/
        });
        return;
    }

    let pks = [];
    let tss = [];
    selectDatas.forEach(val => {
        pks.push(val.data.values.pk_accept.value);
        tss.push(val.data.values.ts.value);
    });

    let sendData = {
        pageid: LIST_PAGE_CODE,
        pks: pks,
        tss: tss,
        isCardOpt: false
    };

    let successCallback = function(res) {
        let that = this;
        if (res.data.grid) {
            handleReturnData(that, selectDatas, res.data.grid);
        }
        let successIndexs = 0,
            failIndexs = 0;
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }
        failIndexs = selectDatas.length - successIndexs;
        // 全部成功
        if (failIndexs == 0) {
            BatchToast.call(
                this,
                "uncommit",
                1,
                selectDatas.length,
                successIndexs,
                failIndexs,
                null,
                null,
                that
            );
        }
        // 全部失败
        else if (selectDatas.length == failIndexs) {
            BatchToast.call(
                this,
                "uncommit",
                0,
                selectDatas.length,
                successIndexs,
                failIndexs,
                res.data.errMsg && res.data.errMsg.split("\n"),
                null,
                that
            );
        }
        // 部分成功
        else if (failIndexs > 0) {
            BatchToast.call(
                this,
                "uncommit",
                2,
                selectDatas.length,
                successIndexs,
                failIndexs,
                res.data.errMsg && res.data.errMsg.split("\n"),
                null,
                that
            );
        }
    };

    doAjax.call(this, sendData, URL_LIST.UNCOMMIT, successCallback);
}

/**
 * 附件
 * @param {*} props
 */
function doFileDocument(props) {
    let selectDatass = props.table.getCheckedRows(LIST_TABLE_CODE);
    if (selectDatass && selectDatass.length < 1) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                    "36180BP-000021"
                ) /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }

    let billno = selectDatass[0].data.values.vbillno.value;
    let pk_accept = selectDatass[0].data.values.pk_accept.value;

    this.setState({
        showUploader: !this.state.showUploader,
        target: null,
        billId: pk_accept,
        billno: billno
    });
}

/**
 * 联查审批详情
 * @param {*} props
 */
function doLQApproveInfo(props) {
    let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                    "36180BP-000021"
                ) /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }

    let pk_accept = selectedRows[0].data.values.pk_accept;
    let billtype = selectedRows[0].data.values.pk_billtypecode;
    this.setState({
        showApproveDetail: true,
        billId: pk_accept && pk_accept.value,
        billtype: billtype && billtype.value
    });
}

/**
 * 联查 预算
 */
function linkNtb() {
    let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                    "36180BP-000021"
                ) /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }

    let pk;
    // 当选中条数大于等于1条数据时 取下第一条数据
    pk = selectedRows[0]["data"]["values"]["pk_accept"]["value"];
    let successCallback = function(res) {
        let { data } = res;
        if (data.hint) {
            toast({ color: "warning", content: res.data.hint });
        } else {
            this.setState({
                showNtbDetail: true,
                ntbdata: data
            });
        }
    };
    let sendData = {
        pk,
        className: FULL_AGGCLASSNAME,
        modulecode:"3618"
    };
    doAjax.call(this, sendData, URL_LIST.LINKNTB, successCallback);
}

/**
 * 联查票据台账
 */
function linkSDBook() {
    let pk_register;
    let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                    "36180BP-000021"
                ) /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }
    // 当选中条数大于等于1条数据时 取下第一条数据
    pk_register = selectedRows[0]["data"]["values"]["pk_register"]["value"];
    this.props.openTo("/fbm/fbm/counterbook/main/index.html#/card", {
        appcode: "36181BL",
        pagecode: "36181BL_C01",
        status: "browse",
        scene: 'linksce',
        id: pk_register
    });
}

/**
 * 联查付款银行账户余额
 */
function doLQPayAcc() {
    let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);

    let bankaccbalance_parr = [];
    let restpk_org_p = selectedRows[0].data.values.pk_org.value;
    let pk_register = selectedRows[0].data.values.pk_register.value;

    let sendData = {
        pk_register: pk_register
    };

    let callback = function(res) {
        let pk_payacc = res.data.pk_payacc;
        if (pk_payacc) {
            let bankaccbalance_pdata = {
                // 财务组织
                pk_org: restpk_org_p,
                // 银行账户id
                pk_account: pk_payacc
            };
            bankaccbalance_parr.push(bankaccbalance_pdata);
            this.setState({
                showOriginalData: bankaccbalance_parr,
                showOriginal: true
            });
        }else{
            toast({
                color: "warning",
                content:
                    this.props.MutiInit.getIntl("36180BP") &&
                    this.props.MutiInit.getIntl("36180BP").get(
                        "36180BP-000054"
                    ) /* 国际化处理： 出票人账户为空，未联查到相关信息*/
            });
        }
    };

    doAjax.call(this, sendData, URL_LIST.LQPAYACC, callback);
}

/**
 * 联查内部结算账户
 * @param {*} props 
 */
function doLQInBalaAcc(){

    let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    let pk_inbalaacc = selectedRows[0].data.values.pk_inbalaacc;

    if (pk_inbalaacc && pk_inbalaacc.value){
        this.setState({
            showInnerAccData: pk_inbalaacc && pk_inbalaacc.value,
            showInnerAcc:true
        });
    }else{
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                    "36180BP-000052"
                ) /* 国际化处理： 内部结算账户为空，未联查到相关信息*/
        });
    }
}

/**
 * 联查内部保证金账户
 * @param {*} props 
 */
function doLQInSecAcc(){

    let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    let pk_insecurityacc = selectedRows[0].data.values.pk_insecurityacc;
    
    if (pk_insecurityacc && pk_insecurityacc.value){
        this.setState({
            showInnerAccData: pk_insecurityacc && pk_insecurityacc.value,
            showInnerAcc:true
        });
    }else{
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                    "36180BP-000053"
                ) /* 国际化处理： 内部保证金账户为空，未联查到相关信息*/
        });
    }
}

/**
 * 联查票据签发
 */
function doLQSign() {
    let pk_register;
    let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);

    if (selectedRows && selectedRows.length < 1) {
        toast({
            color: "warning",
            content:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                    "36180BP-000021"
                ) /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }
    //取第一条联查单据主键
    pk_register = selectedRows[0].data.values.pk_register;
    //票据签发单据类型
    let billtype = "36H2";
    let linkbillExtParam = {
        status: "browse",
        id: pk_register && pk_register.value
    };
    linkApp(this.props, billtype, linkbillExtParam);
}

/**
 * 联查凭证
 */
function doLQVoucher() {
  let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);

  if (selectedRows && selectedRows.length < 1) {
    toast({
      color: "warning",
      content:
        this.props.MutiInit.getIntl("36180BP") &&
        this.props.MutiInit.getIntl("36180BP").get(
          "36180BP-000021"
        ) /* 国际化处理： 请选择一行数据进行操作！*/
    });
    return;
  }
  let index;
  // 当选中条数大于 1 条数据时 取下标最小的一条数据
  if (selectedRows.length > 1) {
    index = getMinIndex(selectedRows);
  }
  // 选中一条时
  if (selectedRows.length == 1) {
    index = 0;
  }
  //拼接联查数据,支持批量联查
  let querydata = [
    {
      pk_billtype:
        selectedRows[index]["data"]["values"]["pk_billtypecode"]["value"],
      pk_group: selectedRows[index]["data"]["values"]["pk_group"]["value"],
      pk_org: selectedRows[index]["data"]["values"]["pk_org"]["value"],
      relationID: selectedRows[index]["data"]["values"]["pk_accept"]["value"] //单据主键
    }
  ];
  let successCallback = function(res) {
    if (res.success) {
      let srcCode = res.data.src;
      if ("_LinkVouchar2019" == srcCode) {
        //走联查
        if (res.data.des) {
          //跳转到凭证界面
          if (res.data.pklist) {
            if (res.data.pklist.length == 1) {
              //单笔联查
              this.props.openTo(res.data.url, {
                status: "browse",
                appcode: res.data.appcode,
                pagecode: res.data.pagecode,
                id: res.data.pklist[0],
                n:
                  this.props.MutiInit.getIntl("36180BP") &&
                  this.props.MutiInit.getIntl("36180BP").get("36180BP-000050"), //'联查凭证'/* 国际化处理： 联查凭证*/
                backflag: "noback"
              });
              return;
            } else {
              //多笔联查
              // cacheTools.set('checkedData', res.data.pklist);
              cacheTools.set(res.data.cachekey, res.data.pklist); //之前缓存的key是”checkedData”,现在改为res.data.cachekey,从接口获取缓存的key
              let appcode =
                this.props.getSearchParam("c") || props.getUrlParam("c");
              this.props.openTo(res.data.url, {
                status: "browse",
                appcode: res.data.appcode,
                pagecode: res.data.pagecode,
                n:
                  this.props.MutiInit.getIntl("36180BP") &&
                  this.props.MutiInit.getIntl("36180BP").get("36180BP-000050"), //'联查凭证'/* 国际化处理： 联查凭证*/
                scene: appcode + srcCode //多笔联查新加scene字段
              });
              return;
            }
          }
        }
      } else {
        toast({
          color: "warning",
          content:
            this.props.MutiInit.getIntl("36180BP") &&
            this.props.MutiInit.getIntl("36180BP").get("36180BP-000051")
        }); /* 国际化处理： 未查到凭证*/
        return;
      }
    }
  };
  doAjax.call(this, querydata, URL_LIST.LinkVoucher, successCallback);
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
function doAjax(sendData, url, successCallback) {
    ajax({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, selectDatas, data) {
    let returnData = data[LIST_TABLE_CODE].rows;
    //处理选择数据
    selectDatas.forEach(val => {
        let pk_accept_check = val.data.values.pk_accept.value;
        returnData.forEach(retrunval => {
            if (pk_accept_check === retrunval.values.pk_accept.value) {
                let updateDataArr = [
                    {
                        index: val.index,
                        data: { values: retrunval.values }
                    }
                ];
                that.props.table.updateDataByIndexs(
                    LIST_TABLE_CODE,
                    updateDataArr
                );
            }
        });
    });
}

/**
 * 打印,支持批量
 */
function handlePrintClick() {
    let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    let pk_accepts = [];

    selectedRows.forEach(element => {
        let pk_accept = element["data"]["values"]["pk_accept"]["value"];
        pk_accepts.push(pk_accept);
    });

    doPrint.call(this, pk_accepts, this.props);
}

/**
 * 打印
 * @param {*} printpks
 * @param {*} props
 */
function doPrint(printpks, props) {
    let appcode = props.getSearchParam("c") || props.getUrlParam("c");

    // print方法的参数数据格式
    // {
    // 	appcode: appcode,
    // 	nodekey: 打印输出模板编码,
    // 	oids: pks
    // }
    print(
        //支持两类: 'html'为模板打印, 'pdf'为pdf打印，这里设置为pdf
        "pdf",
        URL_LIST.PRINTOUTPUT,
        {
            appcode: appcode,
            nodekey: "36180BPNCC",
            oids: printpks
        }
    );
}

/**
 * 输出,支持批量
 */
function handleOutPutClick() {
    let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    let pk_accepts = [];

    selectedRows.forEach(element => {
        let pk_accept = element["data"]["values"]["pk_accept"]["value"];
        pk_accepts.push(pk_accept);
    });

    doOutPut.call(this, pk_accepts, this.props);
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
    // 	nodekey: '36180BPNCC'//模板节点标识
    // }

    // 输出的弹框需要的的数据及格式
    // {
    //    funcode:'20521030',//功能节点编码，即模板编码
    //    nodekey:'web_print', //模板节点标识
    //    oids:['1001A41000000000A9LR'],// 功能节点的数据主键 oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
    //    outputType: 'output'
    // }
    let appcode = props.getSearchParam("c") || props.getUrlParam("c");
    // 保存打印输出信息
    this.setState(
        {
            printOutputInfo: {
                //打印输出使用
                funcode: appcode, //功能节点编码，即模板编码
                nodekey: "36180BPNCC", //模板节点标识
                oids: outputpks,
                outputType: "output"
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

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/