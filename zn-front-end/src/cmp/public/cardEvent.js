/*QB6Cta54YZYj18ukkNSw6gs7VRISnv9QdaiLWFNc+l5MkTzoPNUyvzods+qh9P8e*/
/**
 * 贷款管理卡片公共事件函数
 * @author：zhangyangz
 */
import {
    ajax,
    toast,
    cacheTools,
    cardCache,
    deepClone
} from "nc-lightapp-front";
import { orgVersionView } from "../../tmpub/pub/util/version/index";
// import { moduleId } from "../contract/cons/constant";
import { getappurl } from "./listHeadBtnClick";
let {
    setDefData,
    getDefData,
    getCacheById,
    updateCache,
    addCache,
    getNextId,
    deleteCacheById
} = cardCache;
/**
 * 获取编辑后事件接口数据
 *
 * @param {*} data - 整单数据
 */
export function getAfterEventData(data, url) {
    return new Promise(resolve => {
        ajax({
            url: `${url}.do`,
            data,
            success: res => {
                resolve(res);
            }
        });
    });
}
/**
 * 计算银团子表金额和比例
 *
 * @param {*} type - 输入的类型（比例 金额）
 * @param {*} loanmny - 主表贷款金额
 * @param {*} value - 输入的值（比例 金额）
 * @returns 计算出的比例和金额
 */
export function getAmountAndPercent(type, loanmny, value) {
    let result;
    if (type === "mny") {
        //输入为金额
        result = (+value / loanmny) * 100;
    } else if (type === "scale") {
        //输入为比例
        //console.log(loanmny, value);
        result = (loanmny * +value) / 100;
    }
    return result;
}
/**
 * 根据币种设置汇率编辑性 人民币时不可编辑
 *
 * @param {*} data - 整单数据
 */
export function setOlcDisabled(data) {
    let headData = data.head
        ? data.head && data.head[this.formId].rows[0].values
        : data.rows[0].values;
    let { initPk_currtype } = this.state;
    //币种为人民币
    if (
        headData["pk_currtype"] &&
        headData["pk_currtype"].value !== initPk_currtype
    ) {
        this.props.form.setFormItemsDisabled(this.formId, {
            olcrate: false,
            olcfinancamount: false
        });
    } else if (
        headData["pk_currtype"] &&
        headData["pk_currtype"].value == initPk_currtype
    ) {
        this.props.form.setFormItemsDisabled(this.formId, {
            olcrate: true,
            olcfinancamount: true
        });
    } else if (
        headData["pk_currtype"] &&
        headData["pk_currtype"].value === "1002Z0100000000001K1"
    ) {
        this.props.form.setFormItemsDisabled(this.formId, {
            olcrate: true,
            olcfinancamount: true
        });
    } else {
        this.props.form.setFormItemsDisabled(this.formId, {
            olcrate: false,
            olcfinancamount: false
        });
    }
}
/**
 * 有银团子表是根据行号判断自动代理行还是参与行
 *
 * @param {*} props - 页面内置对象
 */
export function addBankType(props) {
    //获取的行号 0为代理行 其余为参与行
    let num = props.cardTable.getNumberOfRows(this.tabCode, false);
    num++;
    if (num == 1) {
        props.cardTable.addRow(this.tabCode, num - 1, {
            banktype: {
                display: this.state.json["36630PUBLIC-000035"],
                value: "AGENT"
            } /* 国际化处理： 代理行*/
        });
    } else {
        props.cardTable.addRow(this.tabCode, num - 1, {
            banktype: {
                display: this.state.json["36630PUBLIC-000036"],
                value: "JOIN"
            } /* 国际化处理： 参与行*/
        });
    }
}
/**
 * 插行时根据行号判断自动代理行还是参与行
 *
 * @param {*} props - 页面内置对象
 * @param {*} index - 行号
 */
export function insertBankType(props, index) {
    let olcrate = props.form.getFormItemsValue(this.formId, "olcrate"); //组织本币汇率
    props.cardTable.addRow(this.tabCode, index, {
        banktype: {
            display: this.state.json["36630PUBLIC-000036"],
            value: "JOIN"
        } /* 国际化处理： 参与行*/,
        olcsynrate: {
            value: olcrate && olcrate.value ? olcrate.value : null
        }
    });
}
/**
 * 对复制行的数据进行粘贴处理
 * @param {*} props          页面内置对象
 * @param {*} currTableId    当前选中tab-table的code
 * @param {*} selectArr      选中的数据
 * @param {*} index          行下标
 * 其中： tabs.tabId[currTableId]代表当前table的主键id的可以
 */
export function copyResolve(props, currTableId, selectArr, index) {
    props.cardTable.insertRowsAfterIndex(currTableId, selectArr, index);
    props.cardTable.setValByKeyAndIndex(
        currTableId,
        index,
        tabs.tabId[currTableId],
        { value: null }
    );
    this.setState({ isPaste: false }, () => {
        this.buttonVisible(props);
        props.cardTable.setStatus(currTableId, "edit");
    });
}
/**
 * 卡片附件管理
 */
export function fileMgr() {
    let billId = this.props.form.getFormItemsValue(this.formId, this.primaryId)
        .value;
    let billNo = this.props.form.getFormItemsValue(this.formId, "vbillno")
        .value;
    this.setState({
        showUploader: !this.state.showUploader,
        billInfo: { billId, billNo }
    });
}
/**
 * 凭证联查单据
 * @param {*} props        页面内置对象
 * @param {*} moduleName   节点名
 */
export function linkVoucher(props, moduleName) {
    //src修改为scene
    let src = props.getUrlParam("scene");
    if (src) {
        //fip代表会计平台
        if ("fip" == src) {
            voucherLinkBill.call(this, moduleName);
        }
    }
}
/**
 * 凭证联查单据
 *
 * @param {*} moduleName - 模块名称 用于拼接url
 */
export function voucherLinkBill(moduleName) {
    let checkedData = [];
    //缓存中的key为’checkedData’,
    checkedData = cacheTools.get("checkedData");
    if (checkedData && checkedData.length > 0) {
        ajax({
            url: `/nccloud/cdmc/${moduleName}/voucherlinkedbill.do`,
            data: {
                operatingLogVO: checkedData,
                pageCode: this.pageId
            },
            success: res => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        let rowlenght = data[this.tableId].rows;
                        if (rowlenght.length == 1) {
                            let record = rowlenght[0];
                            //1条数据跳转到卡片页面
                            this.props.pushTo("/card", {
                                status: "browse",
                                id:
                                    record.values[this.primaryId] &&
                                    record.values[this.primaryId].value,
                                scene: "linksce"
                            });
                        } else {
                            //多条数据跳转到列表页面
                            this.props.table.setAllTableData(
                                this.tableId,
                                data[this.tableId]
                            );
                        }
                    } else {
                        this.props.table.setAllTableData(this.tableId, {
                            rows: []
                        });
                    }
                }
            }
        });
    }
}
/**
 * 卡片设置编辑性
 * @param {*} status  编辑状态
 */
export function setEditStatus(status) {
    this.props.form.setFormStatus(this.formId, status);
    this.props.cardTable.setStatus(this.tabCode, status);
    orgVersionView(this.props, "header");
}

/**
 * 卡片列表单选事件
 * @param {*} props        页面内置对象
 * @param {*} moduleId     模块ID
 * @param {*} record       行数据
 * @param {*} index        index
 * @param {*} status       选中状态
 */
export function bodySelectedEvent(props, moduleId, record, index, status) {
    let checkedRows = props.cardTable.getCheckedRows(this.tabCode);
    disabledBodyButton.call(this);
}
/**
 * 卡片列表全选事件
 * @param {*} props        页面内置对象
 * @param {*} moduleId     模块ID
 * @param {*} status       选中状态
 * @param {*} length       勾选数据长度
 */
export function bodySelectedAllEvent(props, moduleId, status, length) {
    props.button.setButtonDisabled(["deleteRow"], !status);
}
/**
 * 卡片列表禁用按钮
 * @param  无
 */
export function disabledBodyButton() {
    let checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
    if (checkedRows.length > 0) {
        this.props.button.setButtonDisabled(["deleteRow"], false);
    } else {
        this.props.button.setButtonDisabled(["deleteRow"], true);
    }
}
/**
 * 卡片翻页按钮
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pks
 */
export function pageClick(props, pks) {
    props.setUrlParam(pks);
    getCardData.call(this, this.cardUrl, pks);
}
export function initData(props) {
    let id = props.getUrlParam("id");
    if (id) {
        let cardData = getCacheById(id, this.cache);
        if (cardData && cardData.head && cardData.head[this.formId]) {
            //有缓存且不是刷新按钮
            cardData.head &&
                this.props.form.setAllFormValue({
                    [this.formId]: cardData.head[this.formId]
                });
            if (cardData.bodys && JSON.stringify(cardData.bodys) !== "{}") {
                let tabDefData = getDefData(this.tabCache, this.dataSource);
                let tabKeys = (tabDefData && tabDefData.get(id)) || [];
                let keys = tabKeys.length ? tabKeys : this.tabShow;
                this.props.cardTable.setAllTabsData(
                    cardData.bodys,
                    this.tabOrder,
                    afterSetData.bind(
                        this,
                        this.props,
                        Object.keys(cardData.bodys) == keys
                            ? keys
                            : keys.concat(Object.keys(cardData.bodys))
                    ),
                    Object.keys(cardData.bodys) == keys
                        ? keys
                        : keys.concat(Object.keys(cardData.bodys))
                );
            } else {
                this.props.cardTable.setAllTabsData(
                    null,
                    this.tabOrder,
                    null,
                    []
                );
            }
            this.setState(
                {
                    billNo:
                        cardData.head[this.formId].rows[0].values.vbillno.value
                },
                () => {
                    this.buttonVisible(this.props);
                }
            );
            return;
        }
    }
}
/**
 * 卡片获取单据详情
 * @param {*} url        请求路径
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */
export function getCardData(url, id, isFirst = false, isRefresh = false) {
    let cardData = getCacheById(id, this.cache);
    if (cardData && !isRefresh && !isFirst) {
        if (!isFirst) {
            //第一次走initTemplate.js中的initPage
            initData.call(this, this.props);
        }
        return;
    }
    ajax({
        url: `${url}.do`,
        data: {
            pk: id,
            pageCode: this.pageId
        },
        success: res => {
            let { success, data } = res;
            if (success) {
                if (data && data.head) {
                    this.props.form.setAllFormValue({
                        [this.formId]: data.head[this.formId]
                    });
                    this.setState({
                        billNo: this.props.form.getFormItemsValue(
                            this.formId,
                            "vbillno"
                        ).value,
                        ts: data.head[this.formId].rows[0].values.ts.value
                    });
                    if (
                        this.primaryId == "pk_financepay" ||
                        this.primaryId == "pk_contract" ||
                        this.primaryId == "pk_apply"
                    ) {
                        if (
                            data.head[this.formId].rows[0].values.repaytype &&
                            data.head[this.formId].rows[0].values.repaytype
                                .value &&
                            data.head[this.formId].rows[0].values.repaytype
                                .value == "once"
                        ) {
                            let key =
                                this.primaryId == "pk_financepay"
                                    ? "pk_settledate"
                                    : "iadate";
                            this.props.form.setFormItemsRequired(this.formId, {
                                [key]: false
                            });
                            this.props.form.setFormItemsDisabled(this.formId, {
                                [key]: true
                            });
                        }
                        if (
                            data.head[this.formId].rows[0].values.pk_banktype &&
                            data.head[this.formId].rows[0].values.pk_banktype
                                .value
                        ) {
                            this.pk_banktype =
                                data.head[
                                    this.formId
                                ].rows[0].values.pk_banktype.value;
                        }
                    }
                    if (this.primaryId == "pk_financepay") {
                        let values = data.head[this.formId].rows[0].values;
                        let effecttype = values.effecttype;
                        let finance_rate_type = values.finance_rate_type;
                        let ispayusecc = values.ispayusecc;
                        let accountinter = values.accountinter;
                        let invstfincvartyid = values.invstfincvartyid;
                        let agentbankmgt = values.agentbankmgt;
                        if (
                            this.props.getUrlParam("status") !== "change" &&
                            invstfincvartyid &&
                            invstfincvartyid.display ==
                                this.state.json[
                                    "36630PUBLIC-000037"
                                ] /* 国际化处理： 银团贷款*/ &&
                            agentbankmgt &&
                            agentbankmgt.value
                        ) {
                            this.props.form.setFormItemsDisabled(this.formId, {
                                fininstitutionid: true //金融机构
                            });
                        } else {
                            this.props.form.setFormItemsDisabled(this.formId, {
                                fininstitutionid: false //金融机构
                            });
                        }
                        if (accountinter && accountinter.value) {
                            this.setState({
                                isAccountinter: true
                            });
                            this.props.cardTable.setColEditableByKey(
                                "repayplan",
                                [
                                    "planrepaycode",
                                    "planrepaydate",
                                    "premny",
                                    "preinterest"
                                ],
                                true
                            );
                            this.props.button.setButtonVisible(
                                ["addRow", "deleteRow"],
                                false
                            );
                        } else {
                            this.setState({
                                isAccountinter: false
                            });
                            this.props.cardTable.setColEditableByKey(
                                "repayplan",
                                [
                                    "planrepaycode",
                                    "planrepaydate",
                                    "premny",
                                    "preinterest"
                                ],
                                false
                            );
                            this.props.button.setButtonVisible(
                                ["addRow", "deleteRow"],
                                true
                            );
                        }
                        if (
                            finance_rate_type &&
                            finance_rate_type.value == "1"
                        ) {
                            this.props.form.setFormItemsValue(this.formId, {
                                floatpoint: { display: null, value: null },
                                advancefloatpoint: {
                                    display: null,
                                    value: null
                                }
                            });
                            this.props.form.setFormItemsDisabled(this.formId, {
                                floatscale: false,
                                advancefloatscale: false,
                                floatpoint: true,
                                advancefloatpoint: true
                            });
                        } else if (
                            finance_rate_type &&
                            finance_rate_type.value == "2"
                        ) {
                            // libor利率
                            this.props.form.setFormItemsValue(this.formId, {
                                floatscale: { display: null, value: null },
                                advancefloatscale: {
                                    display: null,
                                    value: null
                                }
                            });
                            this.props.form.setFormItemsDisabled(this.formId, {
                                floatscale: true,
                                advancefloatscale: true,
                                floatpoint: false,
                                advancefloatpoint: false
                            });
                        } else {
                            // 其余利率
                            this.props.form.setFormItemsValue(this.formId, {
                                floatpoint: { display: null, value: null },
                                advancefloatpoint: {
                                    display: null,
                                    value: null
                                },
                                floatscale: { display: null, value: null },
                                advancefloatscale: {
                                    display: null,
                                    value: null
                                }
                            });
                            this.props.form.setFormItemsDisabled(this.formId, {
                                floatpoint: true,
                                advancefloatpoint: true,
                                floatscale: true,
                                advancefloatscale: true
                            });
                        }
                        if (effecttype && effecttype.value == "VDEFDATE") {
                            this.props.form.setFormItemsRequired(this.formId, {
                                adjbegdate: true
                            });
                        } else {
                            this.props.form.setFormItemsRequired(this.formId, {
                                adjbegdate: false
                            });
                        }
                        if (ispayusecc && ispayusecc.value) {
                            this.props.form.setFormItemsDisabled(this.formId, {
                                payreleaseauth: false
                            });
                        } else {
                            this.props.form.setFormItemsDisabled(this.formId, {
                                payreleaseauth: true
                            });
                        }
                    }
                    if (
                        this.primaryId == "pk_repayintst" &&
                        this.props.getUrlParam("status") == "edit"
                    ) {
                        let repaytointerest =
                            data.head[this.formId].rows[0].values
                                .repaytointerest; //利随本清
                        if (repaytointerest && repaytointerest.value) {
                            this.props.initMetaByPkorg();
                            this.props.form.setFormItemsDisabled(this.formId, {
                                pk_org: true,
                                pk_repayplanitem: false,
                                loanunitid: false,
                                summary: false
                            });
                        }
                    }
                }
                if (data && data.bodys && JSON.stringify(data.bodys) !== "{}") {
                    if (this.primaryId == "pk_repayintst") {
                        let agencymanage =
                            data.head[this.formId].rows[0].values.agencymanage; //代理行统管
                        if (agencymanage && !agencymanage.value) {
                            this.setState({
                                showBank: false
                            });
                        } else {
                            this.setState({
                                showBank: true
                            });
                        }
                    }
                    this.props.cardTable.setAllTabsData(
                        deepClone(data.bodys),
                        this.tabOrder,
                        afterSetData.bind(
                            this,
                            this.props,
                            Object.keys(data.bodys)
                        ),
                        this.tabShow == Object.keys(data.bodys)
                            ? this.tabShow
                            : this.tabShow.concat(Object.keys(data.bodys))
                    );
                    if (
                        this.primaryId == "pk_financepay" &&
                        data.bodys.bankgroup &&
                        data.bodys.bankgroup.rows &&
                        data.bodys.bankgroup.rows.length
                    ) {
                        let bankgroup = data.bodys.bankgroup;
                        bankgroup.rows.map((item, index) => {
                            this.pk_banktypeMap.set(
                                index,
                                item.values.pk_banktype &&
                                    item.values.pk_banktype.value
                            );
                        });
                    }
                    if (this.primaryId == "pk_financepay") {
                        let ispayusecc =
                            data.head[this.formId].rows[0].values.ispayusecc; //放款占用授信
                        if (
                            ispayusecc &&
                            !ispayusecc.value &&
                            data.bodys.authinfo &&
                            data.bodys.authinfo.rows &&
                            data.bodys.authinfo.rows.length
                        ) {
                            this.props.form.setFormItemsVisible(this.formId, {
                                ispayusecc: false
                            });
                            this.setState({
                                hideCreditButton: true
                            });
                            this.props.cardTable.setColEditableByKey(
                                "authinfo",
                                [
                                    "ccprotocolid",
                                    "authtype",
                                    "creditbankid",
                                    "cctypeid",
                                    "cccurrtypeid",
                                    "ccmny",
                                    "olcccmny"
                                ],
                                true
                            );
                            this.props.button.setButtonVisible(
                                ["addRow", "deleteRow"],
                                false
                            );
                        } else {
                            this.props.form.setFormItemsVisible(this.formId, {
                                ispayusecc: true
                            });
                            this.setState({
                                hideCreditButton: false
                            });
                        }
                        if (data.bodys.repayplan && data.bodys.repayplan.rows) {
                            data.bodys.repayplan.rows.map((item, index) => {
                                if (
                                    item.values.isrepay &&
                                    item.values.isrepay.value
                                ) {
                                    this.props.cardTable.setEditableByRowId(
                                        "repayplan",
                                        index,
                                        [
                                            "planrepaycode",
                                            "planrepaydate",
                                            "premny",
                                            "preinterest"
                                        ],
                                        false
                                    );
                                }
                            });
                        }
                    }
                    if (
                        this.primaryId == "pk_contract" &&
                        data.bodys.payplan &&
                        data.bodys.payplan.rows
                    ) {
                        data.bodys.payplan.rows.map((item, index) => {
                            if (
                                item.values.canpaymny.value &&
                                +item.values.canpaymny.value == 0
                            ) {
                                this.props.cardTable.setEditableByIndex(
                                    "payplan",
                                    index,
                                    [
                                        "payplancode",
                                        "creditdate",
                                        "paymny",
                                        "olcpaycdtlnamt"
                                    ],
                                    false
                                );
                            }
                        });
                    }
                } else {
                    this.props.cardTable.setAllTabsData(
                        null,
                        this.tabOrder,
                        null,
                        []
                    );
                }
                this.buttonVisible(this.props);
                let tabDefData =
                    getDefData(this.tabCache, this.dataSource) || new Map();
                tabDefData.set(
                    id,
                    this.tabShow.concat(Object.keys(data.bodys))
                );
                setDefData(this.tabCache, this.dataSource, tabDefData);
                // 更新缓存
                updateCache(this.primaryId, id, data, this.formId, this.cache);
            }
        }
    });
}
/**
 * 卡片按钮操作
 * @param {*} path       接口地址
 * @param {*} content    toast弹框显示内容
 * @param {*} data       指派数据
 */
export function cardBtnOperation(path, content, data) {
    let vbillNo = this.props.form.getFormItemsValue(this.formId, this.primaryId)
        .value;
    if (!vbillNo) {
        vbillNo = this.state.pk;
    }
    let pkMapTs = {};
    pkMapTs[vbillNo] = this.state.ts
        ? this.state.ts
        : this.props.form.getFormItemsValue(this.formId, "ts") &&
          this.props.form.getFormItemsValue(this.formId, "ts").value;

    let saveData = {
        pkMapTs,
        pks: [vbillNo],
        pageCode: this.pageId
    };
    // 如果有指派数据 存到userObj里
    if (data) {
        saveData.userObj = data;
    }
    ajax({
        url: `${path}.do`,
        data: saveData,
        success: res => {
            if (res.success) {
                if (path.indexOf("commit") !== -1) {
                    //提交即指派
                    if (
                        (res.data.workflow &&
                            res.data.workflow == "approveflow") ||
                        res.data.workflow == "workflow"
                    ) {
                        this.setState({
                            compositedata: res.data,
                            compositedisplay: true
                        });
                    } else {
                        let ts =
                            res.data.head[this.formId].rows[0].values.ts.value;
                        this.setState({
                            ts: ts,
                            compositedata: null,
                            compositedisplay: false
                        });
                        if (res.data) {
                            updateCache(
                                this.primaryId,
                                vbillNo,
                                res.data,
                                this.formId,
                                this.dataSource
                            );
                            setEditStatus.call(this, "browse");
                            this.props.setUrlParam({
                                id: vbillNo,
                                status: "browse"
                            });
                            getCardData.call(this, this.cardUrl, vbillNo);
                            this.buttonVisible(this.props);
                        }
                        toast({ color: "success", content });
                    }
                } else {
                    toast({ color: "success", content });
                    if (path.indexOf("delete") !== -1) {
                        // 获取下一条数据的id
                        let nextId = getNextId(vbillNo, this.cache);
                        //删除缓存
                        deleteCacheById(this.primaryId, vbillNo, this.cache);
                        if (nextId) {
                            this.props.setUrlParam({
                                id: nextId
                            });
                            getCardData.call(this, this.cardUrl, nextId);
                        } else {
                            // 删除的是最后一个的操作
                            this.props.setUrlParam({
                                id: null
                            });
                            this.setState({
                                billNo: ""
                            });
                            setEditStatus.call(this, "browse");
                            clearAll.call(this, this.props, false);
                        }
                    } else if (path.indexOf("delversion") !== -1) {
                        let id =
                            res.data.head[this.formId].rows[0].values[
                                this.primaryId
                            ].value;
                        deleteCacheById(this.primaryId, vbillNo, this.cache);
                        if (id) {
                            this.props.setUrlParam({
                                id: id
                            });
                            getCardData.call(this, this.cardUrl, id);
                        } else {
                            // 删除的是最后一个的操作
                            this.props.setUrlParam({
                                id: null
                            });
                            this.setState({
                                billNo: ""
                            });
                            setEditStatus.call(this, "browse");
                            clearAll.call(this, this.props, false);
                        }
                    } else if (res.data) {
                        let ts =
                            res.data.head[this.formId].rows[0].values.ts.value;
                        this.setState({
                            ts: ts
                        });
                        updateCache(
                            this.primaryId,
                            vbillNo,
                            res.data,
                            this.formId,
                            this.dataSource
                        );
                        this.props.form.setAllFormValue({
                            [this.formId]: res.data.head[this.formId]
                        });
                        setEditStatus.call(this, "browse");
                        this.props.setUrlParam({
                            id: vbillNo,
                            status: "browse"
                        });
                        this.buttonVisible(this.props);
                    }
                }
            }
        }
    });
}
/**
 * 卡片提交即指派确认
 * @param {*} value       指派数据
 */
export function getAssginUsedrCard(value) {
    cardBtnOperation.call(
        this,
        this.cardCommitUrl,
        this.state.json["36630PUBLIC-000012"],
        value
    ); /* 国际化处理： 提交成功!*/
}
/**
 * 提交即指派取消
 * @param {*} value       指派数据
 */
export function compositeTurnOff(value) {
    this.setState({
        compositedata: null,
        compositedisplay: false
    });
}
/**
 * 取消
 * @param {*} props  页面内置对象
 */
export function cancel(props) {
    let id = props.getUrlParam("id");
    props.setUrlParam({ status: "browse" });
    if (id) {
        props.form.cancel(this.formId);
        this.tabCode && this.props.cardTable.resetTableData(this.tabCode);
        getCardData.call(this, this.cardUrl, id);
        setEditStatus.call(this, "browse");
        let billNo = this.props.form.getFormItemsValue(this.formId, "vbillno")
            .value;
        this.setState({ billNo }); //设置单据号
        //console.log(props.getUrlParam("status"));
        props.resMetaAfterPkorgEdit();
    } else {
        clearAll.call(this, props, true);
    }
}
/**
 * 清空所有的数据
 * @param {*} props  页面内置对象
 */
export function clearAll(props, flag) {
    let data = {};
    props.form.EmptyAllFormValue(this.formId);
    for (let item of this.tabOrder) {
        data[item] = { rows: [] };
    }
    if (flag) {
        props.cardTable.setAllTabsData(
            data,
            this.tabOrder,
            afterSetData.bind(this, this.props, this.tabCode),
            this.tabShow
        );
    } else {
        props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
    }
    props.button.setButtonDisabled(this.disabled_TabBtn, true);
    orgVersionView(this.props, "header");
    this.setState(
        {
            billNo: ""
        },
        () => {
            this.buttonVisible.call(this, props);
        }
    );
}
/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function add(props) {
    props.setUrlParam({ status: "add" });
    // 初始化编辑性
    props.initMetaByPkorg();
    clearAll.call(this, props, false);
    props.setUrlParam({ id: null });
    this.initTemplate.call(this, props);
}

/**
 * 修改
 * @param {*} props  页面内置对象
 */
export function edit(props) {
    props.setUrlParam({ status: "edit" });
    this.buttonVisible.call(this, props);
    orgVersionView(props, "header");
    props.button.setButtonDisabled(["deleteRow"], true);
    props.button.setButtonDisabled(["addRow"], false);
    props.form.setFormItemsDisabled(this.formId, {
        pk_org: true //组织
    });
}
/**
 * 卡片联查凭证
 * @param {*} props  页面内置对象
 * @param {*} cardData 单据
 */
export function cardVoucher(props, cardData) {
    // 拼装凭证数据
    let voucherData = cardData.head.header.rows[0].values;
    let voucherArr = [
        {
            pk_billtype: this.pk_billtype,
            pk_group: voucherData.pk_group && voucherData.pk_group.value,
            pk_org: voucherData.pk_org && voucherData.pk_org.value,
            relationID:
                voucherData[this.primaryId] && voucherData[this.primaryId].value
        }
    ];
    ajax({
        url: "/nccloud/cdmc/common/loanlinkbill.do", //业务组自己写入口类
        data: voucherArr,
        success: res => {
            if (res.success) {
                let srcCode = res.data.src;
                if ("_LinkVouchar2019" == srcCode) {
                    //走联查
                    if (res.data.des) {
                        //跳转到凭证界面
                        if (res.data.pklist) {
                            if (res.data.pklist.length == 1) {
                                //单笔联查
                                props.openTo(res.data.url, {
                                    status: "browse",
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    id: res.data.pklist[0],
                                    n: this.state.json["36630PUBLIC-000034"], //'联查凭证'

                                    backflag: "noback"
                                });
                                return;
                            } else {
                                //多笔联查
                                cacheTools.set("checkedData", res.data.pklist);
                                props.openTo(res.data.url, {
                                    status: "browse",
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    n: this.state.json["36630PUBLIC-000034"] //'联查凭证'
                                });
                                return;
                            }
                        }
                    } else {
                        //跳转到会计平台 这里的appcode是业务组的小应用编码
                        cacheTools.set(this.appcode + srcCode, res.data.pklist);
                    }
                } else {
                    if (res.data.src && res.data.src == "_Preview2019") {
                        toast({
                            color: "warning",
                            content: this.state.json["36630PUBLIC-000045"]
                        });
                        return;
                    }
                }
                //打开凭证节点
                props.openTo(res.data.url, {
                    status: "browse",
                    appcode: res.data.appcode,
                    pagecode: res.data.pagecode,
                    scene: this.appcode + srcCode,
                    n: this.state.json["36630PUBLIC-000034"] // '凭证预览' 凭证使用这个参数,会计平台不用
                });
            }
        }
    });
}
/**
 * 试算结果利息清单弹窗渲染数据
 */
export function renderTrycalData() {
    let { trycalData } = this.props;
    if (trycalData) {
        if (trycalData && trycalData.head) {
            this.props.form.setAllFormValue({
                [this.formId]: trycalData.head[this.formId]
            });
            this.setState({
                billNo: this.props.form.getFormItemsValue(
                    this.formId,
                    "vbillno"
                ).value
            });
        }
        if (
            trycalData &&
            trycalData.bodys &&
            JSON.stringify(trycalData.bodys) !== "{}"
        ) {
            this.props.cardTable.setAllTabsData(
                trycalData.bodys,
                this.tabOrder,
                null,
                Object.keys(trycalData.bodys)
            );
        }
    }
}
/**
 * 检验输入的金额不能为负数
 * @param {*} key         字段
 * @param {*} value       输入的数据
 * @returns 检测正数还是负数
 */
export function checkNegative(key, value) {
    if (value.value && +value.value < 0) {
        this.props.form.setFormItemsValue(this.formId, {
            [key]: {
                display: null,
                value: null
            }
        });
        toast({
            color: "warning",
            content: this.state.json["36070-000041"]
        }); /* 国际化处理： 输入的金额不能为负！*/
        return false;
    } else {
        return true;
    }
}

/**
 * 校验输入的比例 范围 在 -100% ~ 100%之间
 * @param {*} key
 * @param {*} value
 */
export function checkFloatingRatio(key, value) {
    if (value.value) {
        if (
            (value.value - 0 > 0 && value.value - 0 > 100) ||
            (value.value - 0 < 0 && value.value - 0 < -100)
        ) {
            this.props.form.setFormItemsValue(this.formId, {
                [key]: {
                    display: null,
                    value: null
                }
            });
            toast({
                color: "warning",
                content: "输入的比例范围应为-100%~100%"
            });
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}
/**
 * 子表检验输入的金额不能为负数
 * @param {*} key         字段
 * @param {*} value       输入的数据
 * @returns 检测正数还是负数
 */
export function checkNegativeTable(key, value, moduleId, index) {
    if (value && +value < 0) {
        this.props.cardTable.setTabValByKeyAndIndex(moduleId, index, key, {
            display: null,
            value: null
        });
        toast({
            color: "warning",
            content: this.state.json["36630PUBLIC-000038"]
        }); /* 国际化处理： 输入的金额不能为负！*/
        return false;
    } else {
        return true;
    }
}
/**
 * 还款方式控制结息日
 * @param {*} props
 * @param {*} value       还款方式选中值
 * @todo repay_intst_period为付息方式 repay_prcpl_period为还本方式。值都为-1为一次性还本付息 结息日不可输入非必填
 */
export function returnModeControlIadate(props, value) {
    let key = this.primaryId == "pk_financepay" ? "pk_settledate" : "iadate";
    // 清空结息日
    props.form.setFormItemsValue(this.formId, {
        [key]: {
            display: null,
            value: null
        }
    });
    if (value && value.values) {
        let repay_intst_period =
            value.values.repay_intst_period &&
            value.values.repay_intst_period.value;
        let repay_prcpl_period =
            value.values.repay_prcpl_period &&
            value.values.repay_prcpl_period.value;
        if (repay_intst_period == "-1" && repay_prcpl_period == "-1") {
            props.form.setFormItemsDisabled(this.formId, {
                [key]: true
            });
            props.form.setFormItemsRequired(this.formId, {
                [key]: false
            });
            props.form.setFormItemsValue(this.formId, {
                repaytype: { display: null, value: "once" }
            });
        } else {
            props.form.setFormItemsDisabled(this.formId, {
                [key]: false
            });
            props.form.setFormItemsRequired(this.formId, {
                [key]: true
            });
            props.form.setFormItemsValue(this.formId, {
                repaytype: { display: null, value: null }
            });
        }
    } else {
        props.form.setFormItemsDisabled(this.formId, {
            [key]: false
        });
        props.form.setFormItemsRequired(this.formId, {
            [key]: true
        });
        props.form.setFormItemsValue(this.formId, {
            repaytype: { display: null, value: null }
        });
    }
}
// 用于解决保存数据后当前页签数据不显示
export function afterSetData(props, keys) {
    if (!keys.length) {
        return;
    }
    let key = keys.includes(this.tabCode) ? this.tabCode : keys[0];
    props.cardTable.setCurrTabKey(key);
    if (
        this.primaryId == "pk_financepay" ||
        this.primaryId == "pk_contract" ||
        this.primaryId == "pk_apply"
    ) {
        let data = this.props.createTabsCardData(
            this.pageId,
            this.formId,
            this.tabOrder
        );
        let values = data.head[this.formId].rows[0].values;
        // 还款方式控制结息日
        if (
            values.repaytype &&
            values.repaytype.value &&
            values.repaytype.value == "once"
        ) {
            let key =
                this.primaryId == "pk_financepay" ? "pk_settledate" : "iadate";
            this.props.form.setFormItemsRequired(this.formId, {
                [key]: false
            });
            this.props.form.setFormItemsDisabled(this.formId, {
                [key]: true
            });
        }
    }
    if (props.getUrlParam("status") == "change") {
        if (this.primaryId == "pk_financepay") {
            // 设置还款方式不可修改
            props.form.setFormItemsDisabled(this.formId, {
                pk_returnmethod: true
            });
            if (key == "authinfo" || key == "repayplan") {
                props.button.setButtonVisible(["addRow", "deleteRow"], true);
            } else {
                props.button.setButtonVisible(["addRow", "deleteRow"], false);
            }
        } else if (this.primaryId == "pk_contract") {
            if (key == "repayrule" || key == "syndicatedloan") {
                props.button.setButtonVisible(["addRow", "deleteRow"], false);
            } else {
                props.button.setButtonVisible(["addRow", "deleteRow"], true);
            }
        }
    } else if (props.getUrlParam("pageType") == "version") {
        props.button.setButtonVisible(["addRow", "deleteRow"], false);
    } else {
        if (this.primaryId == "pk_financepay") {
            if (key == "execute") {
                props.button.setButtonVisible(["addRow", "deleteRow"], false);
            } else {
                props.button.setButtonVisible(["addRow", "deleteRow"], true);
            }
        }
    }
}
// 用于解决编辑后事件页签切换问题
export function reverseTab(props, key) {
    props.cardTable.setCurrTabKey(this.tabCode, () => {
        props.cardTable.setCurrTabKey(key);
    });
}
// 平台delTabData方法 用于解决1811盘无此方法问题
export function delTabData(props, key) {
    let data = props.cardTable.getTabData(key);
    let delTabData = [];
    //console.log(data);
    for (let item of data.rows) {
        if (["0", "1"].includes(item.status)) {
            item.status = "3";
        }
        delTabData.push(item);
    }
    data.rows = delTabData;
    props.cardTable.setTabData(key, data);
}
/**
 * 获取编辑前事件接口
 */
export function getBeforeEventCurrtype(props, key) {
    //  组织本币汇率、集团本币汇率、全局本币汇率
    const currType = ["olcrate", "glcrate", "gllcrate"];
    if (currType.includes(key)) {
        let pk_org = props.form.getFormItemsValue(this.formId, "pk_org").value; //财务组织
        let pk_currtype = props.form.getFormItemsValue(
            this.formId,
            "pk_currtype"
        ).value; //源币
        let rateType = "";
        if (key === "olcrate") {
            rateType = "rate";
        } else if (key === "glcrate") {
            rateType = "grouprate";
        } else if (key === "gllcrate") {
            rateType = "globalrate";
        }
        const CurrtypeData = {
            pk_org: pk_org,
            pk_currtype: pk_currtype,
            ratekey: rateType
        };
        let editTable = getNewCurrtype(CurrtypeData).then(res => {
            if (res.data) {
                return true;
            } else {
                return false;
            }
        });
        return editTable;
    } else {
        return true;
    }
}
// 获取最新的汇率数据
const getNewCurrtype = data => {
    return new Promise((resolve, reject) => {
        ajax({
            url: "/nccloud/cdmc/common/operatecurrtrate.do",
            async: false,
            data,
            success: res => {
                resolve(res);
            },
            error: res => {
                toast({ color: "danger", content: res.message });
                reject(res);
            }
        });
    });
};

/*QB6Cta54YZYj18ukkNSw6gs7VRISnv9QdaiLWFNc+l5MkTzoPNUyvzods+qh9P8e*/