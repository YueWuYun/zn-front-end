/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { ajax, cardCache, print, promptBox, toast } from "nc-lightapp-front";
import { createSimpleBillData } from "../../../../../tmpub/pub/util/index";
import { apiSaga } from "../../../../public/container/common";
import { CARD_FORM_CODE6 } from "../../../acceptAppr/cons/const";
import { linkApp } from "./../../../../../tmpub/pub/util/LinkUtil";
import { CARD_AREA, CARD_BTN, CARD_FORM_CODE, CARD_FORM_CODE2, CARD_FORM_CODE3, CARD_FORM_CODE4, CARD_FORM_CODE5, CARD_PAGE_CODE, DATASOURCE, FULL_AGGCLASSNAME, URL_LIST } from "./../../cons/const";
let {
    getNextId,
    getCurrentLastId,
    deleteCacheById,
    getCacheById,
    updateCache,
    addCache
} = cardCache;

export function buttonClick(props, id) {
    switch (id) {
        //新增
        case CARD_BTN.ADD:
            doAdd.call(this, props);
            break;

        //取消
        case CARD_BTN.CANCEL:
            promptBox({
                title:
                    this.props.MutiInit.getIntl("36180BP") &&
                    this.props.MutiInit.getIntl("36180BP").get(
                        "36180BP-000002"
                    ) /* 国际化处理： 取消*/,
                color: "warning",
                content:
                    this.props.MutiInit.getIntl("36180BP") &&
                    this.props.MutiInit.getIntl("36180BP").get(
                        "36180BP-000003"
                    ) /* 国际化处理： 是否确认要取消?*/,
                beSureBtnClick: doCancel.bind(this, props)
            });
            break;

        //保存
        case CARD_BTN.SAVE:
            doBeforeSave.call(this, props, true);
            break;

        //保存新增
        case CARD_BTN.SAVEADD:
            doBeforeSave.call(this, props, false, true, false);
            break;

        //保存提交
        case CARD_BTN.SAVECOMMIT:
            doBeforeSave.call(this, props, false, false, true);
            break;

        //修改
        case CARD_BTN.EDIT:
            doEdit.call(this, props);
            break;

        //删除
        case CARD_BTN.DELETE:
            promptBox({
                title:
                    this.props.MutiInit.getIntl("36180BP") &&
                    this.props.MutiInit.getIntl("36180BP").get(
                        "36180BP-000004"
                    ) /* 国际化处理： 删除*/,
                color: "warning",
                content:
                    this.props.MutiInit.getIntl("36180BP") &&
                    this.props.MutiInit.getIntl("36180BP").get(
                        "36180BP-000005"
                    ) /* 国际化处理： 是否确任要删除?*/,
                beSureBtnClick: doDelete.bind(this, props)
            });
            break;

        //复制
        case CARD_BTN.COPY:
            doCopy.call(this, props);
            break;

        //刷新
        case CARD_BTN.REFRESH:
            doRefresh.call(this, props, true);
            break;

        //提交
        case CARD_BTN.COMMIT:
            doCommit.call(this, props);
            break;

        //收回
        case CARD_BTN.UNCOMMIT:
            doUnCommit.call(this, props);
            break;

        //制证
        case CARD_BTN.VOUCHER:
            doVoucher.call(this, props);
            break;

        //取消制证
        case CARD_BTN.CANCELVOUCHER:
            doCancelVoucher.call(this, props);
            break;

        //附件
        case CARD_BTN.FILEDOCUMENT:
            doFileDocument.call(this, props);
            break;

        //联查凭证
        case CARD_BTN.LQUERYVOUCHER:
            doLQVoucher.call(this, props);
            break;

        //联查审批详情
        case CARD_BTN.LQUERYAPPROVEINFO:
            doLQApproveInfo.call(this, props);
            break;

        //联查 票据台账
        case CARD_BTN.LQUERYPJBOOK:
            doLinkBook.call(this, props);
            break;

        //联查 计划预算
        case CARD_BTN.LQUERYPLAN:
            doLinkNtb.call(this, props);
            break;

        //联查付款银行账户余额
        case CARD_BTN.LQUERYPAYACC:
            doLQPayAcc.call(this, props);
            break;

        //联查票据签发
        case CARD_BTN.LQUERYSIGN:
            doLQSign.call(this, props);
            break;

        //联查内部结算账户
        case CARD_BTN.LQUERYINBALAACC:
            doLQInBalaAcc.call(this, props);
            break;

        //联查内部保证金账户
        case CARD_BTN.LQUERYINSECURITYACC:
            doLQInSecAcc.call(this, props);
            break;

        // 打印
        case CARD_BTN.PRINT:
            doPrint.call(this, props);
            break;

        // 输出
        case CARD_BTN.OUTPUT:
            doOutPut.call(this, props);
            break;
    }
}

/**
 * 新增
 * @param {*} props
 */
function doAdd(props) {
    // let pk = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_accept') && props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_accept').value
    // if (!pk) {
    // 	pk = ''
    // }

    // props.pushTo("/card", {
    // 	status: 'add',
    // 	id: pk,
    // 	pagecode: CARD_PAGE_CODE,
    // });

    // this.componentDidMount()
    // this.props.initMetaByPkorg()
    // this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'pk_org': false })
    // 云原生事务异常时会有叹号，新增的时候这里清空一下
    this.props.button.toggleErrorStatus(CARD_AREA, { isError: false });
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_accept') && props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_accept').value
    if (!pk) {
    	pk = ''
    }
    this.props.setUrlParam({
        status: "add",
        id: pk
    });
    this.props.form.setFormStatus(CARD_FORM_CODE, "add");
    this.componentDidMount();
    this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
    this.initTemplate.call(this, props);
    this.props.form.setFormStatus(CARD_FORM_CODE, "add");
}

/**
 * 取消
 * @param {*} props
 */
function doCancel(props) {
    let status = props.getUrlParam("status");
    let id = props.getUrlParam("id");
    if (status === "edit") {
        // 表格返回上一次的值
        this.props.pushTo("/card", {
            status: "browse",
            id: id,
            pagecode: CARD_PAGE_CODE
        });
        this.componentDidMount();
    }
    //保存中的取消操作
    else if (status === "add") {
        //进入空白页
        props.pushTo("/card", {
            id: id,
            status: "browse",
            pagecode: CARD_PAGE_CODE
        });

        this.componentDidMount();
    }
    //复制中的取消操作
    else if (status === "copy") {
        this.props.pushTo("/card", {
            id: id,
            status: "browse",
            pagecode: CARD_PAGE_CODE
        });
        this.componentDidMount();
    }
    //浏览查询详情
    else if (status === "browse") {
        this.props.pushTo("/card", {
            status: "browse",
            id: id,
            pagecode: CARD_PAGE_CODE
        });
        this.componentDidMount();
    }
}

/**
 * 保存
 * @param {*} props
 * @param {*} showToast
 * @param {*} isAdd
 * @param {*} isCommit
 */
async function doSave(props, showToast, isAdd, isCommit) {
    // 采用轻量级的api获取页面数据，去除scale,display
    let cardData = createSimpleBillData(
        props,
        CARD_PAGE_CODE,
        CARD_FORM_CODE,
        [],
        false
    );
    // let cardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);

    // console.log(cardData, 'sign before cardDataf');
    // let result = await Sign({
    // 	isSign: true,
    // 	isKey: true,
    // 	data: cardData,
    // 	isSave: true,
    // 	encryptVOClassName: 'nccloud.itf.fbm.gather.GatherEncryptVO4NCC'
    // });
    // if (result.isStop) {
    // 	return;
    // }
    // cardData = result.data;
    // console.log(cardData, 'sign after cardData');

    let saveBeforePk = this.props.form.getFormItemsValue(
        CARD_FORM_CODE,
        "pk_accept"
    );

    let saveCallback = function(res) {
        if (res.data.card.head) {
            this.props.form.setAllFormValue({
                [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
            });
            //页签赋值
            let pk_accept =
                res.data.card.head[CARD_FORM_CODE].rows[0].values.pk_accept;
            let vbillno =
                res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno;
            this.setState({
                billno: vbillno && vbillno.value,
                isBlank: false
            });
            this.props.setUrlParam({
                status: "browse",
                id: pk_accept && pk_accept.value
            });
            if (saveBeforePk && saveBeforePk.value) {
                updateCache(
                    "pk_accept",
                    res.data.card.head[CARD_FORM_CODE].rows[0].values.pk_accept
                        .value,
                    res.data.card,
                    CARD_FORM_CODE,
                    DATASOURCE,
                    res.data.card.head[CARD_FORM_CODE].rows[0].values
                );
            } else {
                addCache(
                    res.data.card.head[CARD_FORM_CODE].rows[0].values.pk_accept
                        .value,
                    res.data.card,
                    CARD_FORM_CODE,
                    DATASOURCE,
                    res.data.card.head[CARD_FORM_CODE].rows[0].values
                );
            }

            if (isAdd) {
                doAdd.call(this, props);
                return;
            }
            if (isCommit) {
                doCommit.call(this, props);
                return;
            }
            // 保存成功头部标题按钮显示
            this.titleno =
            res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno.value;
            // 保存不需要做跨事务按钮控制
            this.toggleShow4Ncc();

            if (showToast) {
                toast({
                    color: "success",
                    content:
                        this.props.MutiInit.getIntl("36180BP") &&
                        this.props.MutiInit.getIntl("36180BP").get(
                            "36180BP-000006"
                        ) /* 国际化处理： 保存成功*/
                });
            }
        }
    };
    doAjax.call(this, cardData, URL_LIST.SAVE, saveCallback);
}

/**
 * 修改
 * @param {*} props
 */
function doEdit(props) {
    let tableName = "fbm_accept";
    let pk = this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value 
    let data = { pk:pk, fieldPK:this.primaryId, tableName:tableName};
        apiSaga.call(this, {
            data: data,
            success: res => {
                props.pushTo("/card", {
                    status: "edit",
                    id: props.getUrlParam("id"),
                    pagecode: CARD_PAGE_CODE
                });
                //成功进入编辑态，说明事务已经解冻，将saga_frozen和saga_status设置为0
                if (this.props.form.getFormItemsValue(this.formId, 'saga_frozen')){
                    this.props.form.setFormItemsValue(this.formId,{'saga_frozen':{value:'0'}});
                }
                if (this.props.form.getFormItemsValue(this.formId, 'saga_status')){
                    this.props.form.setFormItemsValue(this.formId,{'saga_status':{value:'0'}});
                }
                this.componentDidMount();
            }
        })
}

/**
 * 删除
 * @param {*} props
 */
function doDelete(props) {
    let id = props.getUrlParam("id");
    let sendData = {
        pks: [id]
    };

    let successCallback = function(res) {
        toast({
            color: "success",
            content:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get("36180BP-000007")
        }); /* 国际化处理： 删除成功!*/

        let deleteid = this.props.getUrlParam("id");
        let deletenextId = getNextId(deleteid, DATASOURCE);
        deleteCacheById("pk_accept", deleteid, DATASOURCE);

        //注意：查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求。
        this.props.setUrlParam({
            status: "browse",
            id: deletenextId ? deletenextId : ""
        });
        this.componentDidMount();
    };

    doAjax.call(this, sendData, URL_LIST.DELETE, successCallback);
}

/**
 * 复制
 * @param {*} props
 */
function doCopy(props) {
    // 云原生事务异常时会有叹号，新增的时候这里清空一下
    this.props.button.toggleErrorStatus(CARD_AREA, { isError: false });
    let pk = props.getUrlParam("id");
    if (!pk) {
        toast({
            color: "error",
            content:
                this.props.MutiInit.getIntl("36180BP") &&
                this.props.MutiInit.getIntl("36180BP").get(
                    "36180BP-000008"
                ) /* 国际化处理： URL中没有主键*/
        });
        return;
    }

    let sendData = {
        pk: pk
    };

    let successCallback = function(res) {
        if (res.data) {
            this.props.form.setAllFormValue({
                [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
            });

            this.titleno =
                res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno.value;

            this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                pk_org: true
            });
            this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
                vbillno: true
            });

            this.props.setUrlParam({
                status: "copy"
            });
            this.toggleShow();
        }
    };

    doAjax.call(this, sendData, URL_LIST.COPY, successCallback);
}

/**
 * 保存前动作
 * @param {*} props
 */
function doBeforeSave(props, showToast, isAdd, isCommit) {
    if (
        props.form.isCheckNow(
            [
                CARD_FORM_CODE,
                CARD_FORM_CODE2,
                CARD_FORM_CODE3,
                CARD_FORM_CODE4,
                CARD_FORM_CODE5,
                CARD_FORM_CODE6
            ],
            "warning"
        )
    ) {
        let saveAllData = props.form.getAllFormValue(CARD_FORM_CODE);
        let savedata = {
            pageid: CARD_PAGE_CODE,
            model: {
                areacode: CARD_FORM_CODE,
                rows: saveAllData.rows,
                areaType: "form"
            }
        };

        // 验证公式
        props.validateToSave(
            savedata,
            doSave.bind(this, props, showToast, isAdd, isCommit),
            "",
            "form"
        );
    }
}

/**
 * 提交
 * @param {*} props
 */
function doCommit(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_accept");
    let ts = props.form.getFormItemsValue(CARD_FORM_CODE, "ts");

    let sendData = {
        pageid: CARD_PAGE_CODE,
        pks: [pk && pk.value],
        tss: [ts && ts.value],
        isCardOpt: true
    };

    let successCallback = function(res) {
        let that = this;
        if (res.data && res.data.errMsg) {
            toast({ color: "error", content: res.data.errMsg });
        } else {
            if (
                res.data.workflow &&
                (res.data.workflow == "approveflow" ||
                    res.data.workflow == "workflow")
            ) {
                that.setState({
                    compositedata: res.data,
                    compositedisplay: true
                });
            } else {
                that.setState({
                    compositedata: res.data,
                    compositedisplay: false
                });
                if (res.data.card.head) {
                    that.props.form.setAllFormValue({
                        [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                    });
                    updateCache(
                        "pk_accept",
                        pk && pk.value,
                        res.data.card,
                        CARD_FORM_CODE,
                        DATASOURCE
                    );
                    this.titleno =
                    res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno.value;
                    this.toggleShow4Ncc();
                    toast({
                        color: "success",
                        content:
                            this.props.MutiInit.getIntl("36180BP") &&
                            this.props.MutiInit.getIntl("36180BP").get(
                                "36180BP-000009"
                            ) /* 国际化处理： 提交成功！*/
                    });
                }
            }
        }
      //  doRefresh.call(this, this.props, false);
    };

    doAjax.call(this, sendData, URL_LIST.COMMIT, successCallback);
}
/**
 * 刷新
 * @param {*} props
 */
function doRefresh(props, showToast) {
    let pk_accept = props.getUrlParam("id");
    if (!pk_accept) {
        this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
        this.setState({
            isBlank: true
        });
        this.toggleShow();
        return;
    }
    let queryData = {
        pk: pk_accept
    };

    // 成功回调
    let successCallback = function(res) {
        if (res.data) {
            this.props.form.setAllFormValue({
                [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
            });

            this.titleno =
                res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno.value;

            this.toggleShow();

            if (showToast) {
                toast({
                    color: "success",
                    content:
                        this.props.MutiInit.getIntl("36180BP") &&
                        this.props.MutiInit.getIntl("36180BP").get(
                            "36180BP-000010"
                        ) /* 国际化处理： 刷新成功！*/
                });
            }
        }
    };

    doAjax.call(this, queryData, URL_LIST.CARD_QUERY, successCallback);
}

/**
 * 收回
 * @param {*} props
 */
function doUnCommit(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_accept");
    let ts = props.form.getFormItemsValue(CARD_FORM_CODE, "ts");

    let sendData = {
        pageid: CARD_PAGE_CODE,
        pks: [pk && pk.value],
        tss: [ts && ts.value],
        isCardOpt: true
    };

    let successCallback = function(res) {
        let that = this;
        if (res.data && res.data.errMsg) {
            toast({ color: "error", content: res.data.errMsg });
        } else {
            if (res.data.card.head) {
                that.props.form.setAllFormValue({
                    [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                });
                updateCache(
                    "pk_accept",
                    pk && pk.value,
                    res.data.card,
                    CARD_FORM_CODE,
                    DATASOURCE
                );
                toast({
                    color: "success",
                    content:
                        this.props.MutiInit.getIntl("36180BP") &&
                        this.props.MutiInit.getIntl("36180BP").get(
                            "36180BP-000011"
                        ) /* 国际化处理： 收回成功！*/
                });
            }
        }
        doRefresh.call(this, this.props, false);
    };

    doAjax.call(this, sendData, URL_LIST.UNCOMMIT, successCallback);
}

/**
 * 制证
 * @param {*} props
 */
function doVoucher(props) {
    let that = this;
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_accept");
    let sendData = {
        pk: pk && pk.value,
        pageid: CARD_PAGE_CODE,
        isCardOpt: true
    };

    let callback = function(res) {
        if (res.data) {
            if (res.data.errMsg) {
                toast({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                if (res.data.card.head) {
                    that.props.form.setAllFormValue({
                        [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                    });
                    updateCache(
                        "pk_accept",
                        pk && pk.value,
                        res.data.card,
                        CARD_FORM_CODE,
                        DATASOURCE
                    );
                    this.toggleShow4Ncc();
                    toast({
                        color: "success",
                        content:
                            this.props.MutiInit.getIntl("36180BP") &&
                            this.props.MutiInit.getIntl("36180BP").get(
                                "36180BP-000012"
                            ) /* 国际化处理： 制证成功！*/
                    });
                }
            }
        }
      //  doRefresh.call(this, this.props, false);
    };
    doAjax.call(this, sendData, URL_LIST.VOUCHER, callback);
}

/**
 * 取消制证
 * @param {*} props
 */
function doCancelVoucher(props) {
    let that = this;
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_accept");
    let sendData = {
        pk: pk && pk.value,
        pageid: CARD_PAGE_CODE,
        isCardOpt: true
    };

    let callback = function(res) {
        if (res.data) {
            if (res.data.errMsg) {
                toast({
                    color: "error",
                    content: res.data.errMsg
                });
            } else {
                if (res.data.card.head) {
                    that.props.form.setAllFormValue({
                        [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
                    });
                    updateCache(
                        "pk_accept",
                        pk && pk.value,
                        res.data.card,
                        CARD_FORM_CODE,
                        DATASOURCE
                    );
                    this.toggleShow4Ncc();
                    toast({
                        color: "success",
                        content:
                            this.props.MutiInit.getIntl("36180BP") &&
                            this.props.MutiInit.getIntl("36180BP").get(
                                "36180BP-000013"
                            ) /* 国际化处理： 取消制证成功！*/
                    });
                }
            }
        }
        doRefresh.call(this, this.props, false);
    };
    doAjax.call(this, sendData, URL_LIST.CANCELVOUCHER, callback);
}

/**
 * 附件
 * @param {*} props
 */
function doFileDocument(props) {
    let billno = props.form.getFormItemsValue(CARD_FORM_CODE, "vbillno").value;
    let pk_accept = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_accept")
        .value;

    this.setState({
        showUploader: !this.state.showUploader,
        target: null,
        billId: pk_accept,
        billno: billno
    });
}

/**
 * 联查 审批详情
 * @param {*} props
 */
function doLQApproveInfo(props) {
    let billid = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_accept");
    let billtype = props.form.getFormItemsValue(
        CARD_FORM_CODE,
        "pk_billtypecode"
    );
    this.setState({
        approveshow: true,
        billId: billid && billid.value,
        billtype: billtype && billtype.value
    });
}

/**
 * 联查凭证
 * @param {*} props
 */
function doLQVoucher(props) {
  let pk_h = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_accept");
  let pk_group = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_group");
  let pk_org = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_org");
  let pk_billtype = props.form.getFormItemsValue(
    CARD_FORM_CODE,
    "pk_billtypecode"
  );
  pk_h = pk_h && pk_h.value;
  pk_group = pk_group && pk_group.value;
  pk_org = pk_org && pk_org.value;
  pk_billtype = pk_billtype && pk_billtype.value;

  let sendData = [
    {
      pk_group: pk_group, //集团主键
      pk_org: pk_org, //组织主键
      relationID: pk_h, //单据主键
      pk_billtype: pk_billtype //交易类型
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
  doAjax.call(this, sendData, URL_LIST.LinkVoucher, successCallback);
}

/**
 * 联查付款银行账户余额
 * @param {*} props
 */
function doLQPayAcc(props) {
    let bankaccbalance_parr = [];
    let restpk_org_p = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_org");
    let pk_register = props.form.getFormItemsValue(
        CARD_FORM_CODE,
        "pk_register"
    );

    let sendData = {
        pk_register: pk_register && pk_register.value
    };

    let callback = function(res) {
        let pk_payacc = res.data.pk_payacc;
        if (pk_payacc) {
            let bankaccbalance_pdata = {
                // 财务组织
                pk_org: restpk_org_p && restpk_org_p.value,
                // 银行账户id
                pk_account: pk_payacc
            };
            bankaccbalance_parr.push(bankaccbalance_pdata);
            this.setState({
                showOriginalData: bankaccbalance_parr,
                showOriginal: true
            });
        }
    };

    doAjax.call(this, sendData, URL_LIST.LQPAYACC, callback);
}

/**
 * 联查内部结算账户
 * @param {*} props 
 */
function doLQInBalaAcc(props){
    let pk_inbalaacc = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_inbalaacc');

    if (pk_inbalaacc && pk_inbalaacc.value){
        this.setState({
            showInnerAccData: pk_inbalaacc && pk_inbalaacc.value,
            showInnerAcc:true
        });
    }
}

/**
 * 联查内部保证金账户
 * @param {*} props 
 */
function doLQInSecAcc(props){
    let pk_insecurityacc = props.form.getFormItemsValue(CARD_FORM_CODE, 'pk_insecurityacc');

    if (pk_insecurityacc && pk_insecurityacc.value){
        this.setState({
            showInnerAccData: pk_insecurityacc && pk_insecurityacc.value,
            showInnerAcc:true
        });
    }
}

/**
 * 联查票据签发
 * @param {*} props
 */
function doLQSign(props) {
    //联查单据主键
    let pk_register = props.form.getFormItemsValue(
        CARD_FORM_CODE,
        "pk_register"
    );
    //票据签发单据类型
    let billtype = "36H2";
    let linkbillExtParam = {
        status: "browse",
        id: pk_register && pk_register.value
    };
    linkApp(props, billtype, linkbillExtParam);
}

/**
 * 联查 票据台账
 * @param {*} props
 */
function doLinkBook(props) {
    let pk_register = props.form.getFormItemsValue(
        CARD_FORM_CODE,
        "pk_register"
    ).value;
    this.props.openTo("/fbm/fbm/counterbook/main/index.html#/card", {
        billtype:"36HM",
        appcode: "36181BL",
        pagecode: "36181BL_C01",
        status: "browse",
        scene: 'linksce',
        sence:"4",
        id: pk_register
    });
}
/**
 * 联查 计划预算
 * @param {*} props
 */
function doLinkNtb(props) {
    let pk = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_accept").value;
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
 * 打印
 * @param {*} props
 */
function doPrint(props) {
    let printpks = [props.getUrlParam("id")];
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
 * 输出
 * @param {*} props
 */
function doOutPut(props) {
    let outputpks = [props.getUrlParam("id")];
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

function doAjax(sendData, url, successCallback) {
    ajax({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/