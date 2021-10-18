/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import {
    ajax,
    toast,
    cardCache,
    print,
    pageTo,
    promptBox
} from "nc-lightapp-front";
import { baseReqUrl, javaUrl, printData } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import {
    fileMgr,
    setEditStatus,
    getCardData,
    cardBtnOperation,
    clearAll,
    cancel,
    add,
    edit,
    cardVoucher
} from "../../../public/cardEvent";
let { updateCache, addCache } = cardCache;

/**
 * 内贷还本-卡片肩部按钮点击事件
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
    // 当前单据状态
    let status = props.getUrlParam("status");
    let pk = props.getUrlParam("id");
    if (pk) {
        this.cacheId = pk;
    }
    // 当前单据的全部数据
    let cardData = this.props.createExtCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    switch (id) {
        //头部 新增
        case "add":
            add.call(this, props);
            break;
        //头部 新增
        case "add_n":
            add.call(this, props);
            break;
        //头部 复制
        case "copy":
            copy.call(this, props, pk);
            break;
        //头部保存
        case "save":
            cardSave.call(this, props, "browse", javaUrl.save, this.state.json["36360INCP-000004"]);/* 国际化处理： 保存成功*/
            this.props.cardTable.closeModel(this.tabCode);//关闭侧拉
            break;
        //头部新增保存
        case "saveAdd":
            cardSaveAdd.call(this, props, "add", javaUrl.save, this.state.json["36360INCP-000004"]);/* 国际化处理： 保存成功*/
            break;
        // 头部保存提交
        case "saveCommit":
            cardSaveCommit.call(this, props, "browse", javaUrl.save);
            break;
        //修改
        case "edit":
            props.setUrlParam({ id: this.cacheId });
            edit.call(this, props);
            break;
        //头部 删除
        case "delete":
            promptBox({
                color: "warning",
                title: this.state.json["36360INCP-000005"],/* 国际化处理： 删除*/
                content: this.state.json["36360INCP-000006"],/* 国际化处理： 确定要删除么？*/
                beSureBtnClick: () => {
                    cardBtnOperation.call(
                        this,
                        `${baseReqUrl}${javaUrl.delete}`,
                        this.state.json["36360INCP-000007"]/* 国际化处理： 删除成功!*/
                    );
                }
            });
            break;
        // 头部 取消
        case "cancel":
            promptBox({
                color: "warning",
                title: this.state.json["36360INCP-000008"],/* 国际化处理： 取消*/
                content: this.state.json["36360INCP-000009"],/* 国际化处理： 确定要取消么？*/
                beSureBtnClick: () => {
                    cancel.call(this, props);
                }
            });
            break;
        //头部 提交
        case "commit":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.commit}`,
                this.state.json["36360INCP-000010"]/* 国际化处理： 提交成功!*/
            );
            break;
        //头部 收回
        case "unCommit":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.uncommit}`,
                this.state.json["36360INCP-000011"]/* 国际化处理： 收回成功!*/
            );
            break;
        //头部 附件
        case "Attachment":
            fileMgr.call(this);
            break;
        //头部 打印
        case "print":
            printData.oids = [pk];
            print("pdf", `${baseReqUrl}${javaUrl.print}.do`, {
                ...printData,
                userjson: JSON.stringify(cardData)
            });
            break;
            break;
        //头部 输出
        case "printOut":
            let { printOut } = this.state;
            printOut.userjson = JSON.stringify(cardData);
            printOut.oids = [pk];
            this.setState({ printOut }, () => {
                this.refs.printOutput.open();
            });
            break;
        //头部 刷新
        case "refresh":
            getCardData.call(
                this,
                this.cardUrl,
                this.props.getUrlParam("id"),
                true,
                true
            );
            break;
        //头部 联查审批详情
        case "approveDetail":
            this.setState({
                showApproveDetail: true,
                billInfo: { billId: pk }
            });
            break;
        //头部 刷新
        case "refresh":
            getCardData.call(
                this,
                `${baseReqUrl}${javaUrl.card}`,
                this.props.getUrlParam("id"),
                true,
                true
            );
            break;
        //头部 历史版本
        case "viewVersion_n":
            this.props.setUrlParam({
                pageType: "version",
                id: this.props.getUrlParam("id")
            });
            this.initVersionTree();
            this.setState({
                linkFrom: "card"//历史版本返回按钮判断是用到
            });
            break;
        //头部 历史版本
        case "viewVersion":
            this.props.setUrlParam({
                pageType: "version",
                id: this.props.getUrlParam("id")
            });
            this.initVersionTree();
            this.setState({
                linkFrom: "card"//历史版本返回按钮判断是用到
            });
            break;
        //头部 变更  审批通过可变更，走save接口
        case "change":
            this.props.setUrlParam({ status: "change" });
            buttonVisible.call(this, props);
            setEditStatus.call(this, "edit");
            setChangeDisable.call(this, props);
            break;
        //头部 删除版本
        case "delete_version":
            promptBox({
                color: "warning",
                title: this.state.json['36360PUBLIC-000063'],/* 国际化处理： 删除版本*/
                content: this.state.json['36360PUBLIC-000064'],/* 国际化处理： 是否删除当前最新版本?*/
                beSureBtnClick: cardBtnOperation.bind(
                    this,
                    `${baseReqUrl}${javaUrl.delversion}`,
                    this.state.json[
                    "36360INCP-00003"
                    ] /* 国际化处理： 删除版本成功!*/
                )
            });
            break;
        //头部 终止
        case "termination":
            promptBox({
                color: "warning",
                title: this.state.json['36360PUBLIC-000055'],/* 国际化处理： 结束协议*/
                content: this.state.json['36360PUBLIC-000056'],/* 国际化处理： 是否结束当前协议?*/
                beSureBtnClick: cardBtnOperation.bind(
                    this,
                    `${baseReqUrl}${javaUrl.termination}`,
                    this.state.json["36360INCP-000034"] /* 国际化处理： 终止成功!*/
                )
            });
            break;
        //头部 取消终止
        case "unTermination":
            promptBox({
                color: "warning",
                title: this.state.json['36360PUBLIC-000057'],/* 国际化处理： 取消结束协议*/
                content: this.state.json['36360PUBLIC-000058'],/* 国际化处理： 是否取消结束当前协议?*/
                beSureBtnClick: cardBtnOperation.bind(
                    this,
                    `${baseReqUrl}${javaUrl.unTermination}`,
                    this.state.json["36360INCP-000035"] /* 国际化处理： 取消终止成功!*/
                )
            });
            break;
        //头部 冻结
        case "frozen":
            promptBox({
                color: "warning",
                title: this.state.json['36360PUBLIC-000059'],/* 国际化处理： 冻结协议*/
                content: this.state.json['36360PUBLIC-000060'],/* 国际化处理： 是否冻结当前协议?*/
                beSureBtnClick: cardBtnOperation.bind(
                    this,
                    `${baseReqUrl}${javaUrl.frozen}`,
                    this.state.json["36360INCP-000036"] /* 国际化处理： 冻结成功!*/
                )
            });
            break;
        //头部 取消冻结
        case "unFrozen":
            promptBox({
                color: "warning",
                title: this.state.json['36360PUBLIC-000061'],/* 国际化处理： 取消冻结协议*/
                content: this.state.json['36360PUBLIC-000062'],/* 国际化处理： 是否取消冻结当前协议?*/
                beSureBtnClick: cardBtnOperation.bind(
                    this,
                    `${baseReqUrl}${javaUrl.unFrozen}`,
                    this.state.json["36360INCP-000037"] /* 国际化处理： 取消冻结成功!*/
                )
            });
            break;
        default:
            break;
    }
}
/**
 * 保存前事件
 *
 * @param {*} callback - 保存之前进行的操作
 */
function saveBefore(callback) {
    let data = this.props.createTabsCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    // 公式验证
    if (typeof this.saveBefore == "function") {
        this.saveBefore(() => {
            this.props.validateToTabSave
                ? this.props.validateToTabSave(data, callback, "cardTable", "")
                : this.props.validateToSave(data, callback, "cardTable", "");
        });
    } else {
        this.props.validateToTabSave
            ? this.props.validateToTabSave(data, callback, "cardTable", "")
            : this.props.validateToSave(data, callback, "cardTable", "");
    }
}
/**
 * 保存
 * @param {*} props  页面内置对象
 */
function cardSave(props, type, url, content) {
    saveBefore.call(this, () => {
        saveBill.call(this, props, type, url, content).then(id => {
            this.props.setUrlParam({
                id,
                status: "browse"
            });
            setEditStatus.call(this, "browse");
            getCardData.call(this, this.cardUrl, id);
        });
    });
}
/**
 * 保存新增
 * @param {*} props  页面内置对象
 */
function cardSaveAdd(props, type, url, content) {
    saveBefore.call(this, () => {
        saveBill.call(this, props, type, url, content).then(id => {
            this.props.setUrlParam({
                id,
                status: "add"
            });
            add.call(this, props);
        });
    });
}
/**
 * 保存提交
 * @param {*} props  页面内置对象
 */
function cardSaveCommit(props, type, url, content) {
    saveBefore.call(this, () => {
        saveBill.call(this, props, type, url, content).then(id => {
            /**保存完提交失败也要留在浏览态 */
            this.props.setUrlParam({
                id,
                status: "browse"
            });
            setEditStatus.call(this, "browse");//设置编辑性
            getCardData.call(this, this.cardUrl, id);//查询渲染数据
            cardBtnOperation.call(this, this.cardCommitUrl, this.state.json["36360INCP-000015"]);/* 国际化处理： 保存提交成功!*/
        });
    });
}
/**
 * 自定义校验
 * @param {*} props  页面内置对象
 */
function businessCheck(props) {
    let businessFlag = true;
    let data = this.props.createTabsCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    //console.log(data);
    //主表校验
    //子表校验
    if (data.bodys) {
        //还本
        if (
            data.bodys.repayPrcplPlan &&
            data.bodys.repayPrcplPlan.rows.length
        ) {
            if (!props.cardTable.checkTabRequired("repayPrcplPlan")) {
                businessFlag = false;
                return;
            }
        }
    }
    //console.log(businessFlag);
    return businessFlag;
}
/**
 * 复制
 * @param {*} props 页面内置对象
 */
function copy(props, pk) {
    props.pushTo("/card", {
        status: "copy",
        id: pk
    });
    props.resMetaAfterPkorgEdit();
    setEditStatus.call(this, "add");
    getCardData.call(this, `${baseReqUrl}${javaUrl.copy}`, pk, true, true);
}
/**
 * 保存
 * @param {*} props  页面内置对象
 */
function saveBill(props, type, url, content) {
    return new Promise(resolve => {
        // 校验
        let checkFormFlag = props.form.isCheckNow(this.formId); //主表
        if (!checkFormFlag) {
            return;
        }
        let businessFlag = businessCheck.call(this, props); //自定义校验
        if (!businessFlag) {
            return;
        }
        let data = this.props.createTabsCardData(
            this.pageId,
            this.formId,
            this.tabOrder
        );
        let status = this.props.getUrlParam("status");
        ajax({
            url: `${baseReqUrl}${url}.do`,
            data,
            success: res => {
                let { success, data } = res;
                if (success) {
                    let id =
                        res.data.head[this.formId].rows[0].values[
                            this.primaryId
                        ].value;
                    let ts = res.data.head[this.formId].rows[0].values.ts.value;
                    let tbbmessage =
                        res.data.head[this.formId].rows[0].values.tbbmessage;
                    this.setState({
                        pk: id
                    });
                    this.ts = ts;
                    if (tbbmessage && tbbmessage.value) {
                        toast({
                            color: "warning",
                            content: `${tbbmessage.value}`
                        });
                    }
                    content &&
                        toast({ color: "success", content: `${content}` });
                    resolve(id, res);
                    // 缓存
                    if (status === "add" || status === "copy") {
                        addCache(id, data, this.formId, this.dataSource);
                    } else {
                        updateCache(
                            this.primaryId,
                            id,
                            data,
                            this.formId,
                            this.dataSource
                        );
                    }
                }
            }
        });
    });
}

/**
 * 设置变更字段编辑性
 * @param {*} props  页面内置对象
 */
export function setChangeDisable(props) {
    props.initMetaByPkorg();
    //隐藏子表按钮
    props.form.setFormItemsDisabled(this.formId, {
        pk_org: true
    });
    // 表头-可变更字段
    props.form.setFormItemsDisabled(this.formId, {
        ctrlmethod: false,//控制方式
        cdtlnamt: false,//原币额度
        remark: false,// 备注
        enddate: false,// 结束日期
        periodunit: false,// 期间单位
        periodcount: false,// 期间
        vdef1: false,
        vdef2: false,
        vdef3: false,
        vdef4: false,
        vdef5: false,
        vdef6: false,
        vdef7: false,
        vdef8: false,
        vdef9: false,
        vdef10: false,
        vdef11: false,
        vdef12: false,
        vdef13: false,
        vdef14: false,
        vdef15: false,
        vdef16: false,
        vdef17: false,
        vdef18: false,
        vdef19: false,
        vdef20: false
    });
    // 表体-可变更子表
    props.cardTable.setColEditableByKey(
        this.tabCode,
        [
            "cdtlnamt",// 原币额度
            "vdef1",
            "vdef2",
            "vdef3",
            "vdef4",
            "vdef5",
            "vdef6",
            "vdef7",
            "vdef8",
            "vdef9",
            "vdef10",
            "vdef11",
            "vdef12",
            "vdef13",
            "vdef14",
            "vdef15",
            "vdef16",
            "vdef17",
            "vdef18",
            "vdef19",
            "vdef20"
        ],
        false
    );
    //禁用表格复选框
    props.cardTable.setAllCheckboxAble(this.tabCode, true);
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/