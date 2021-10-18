/*QB6Cta54YZYj18ukkNSw6s6w/5HHI50S1xG3XVdcs5/3IcD+ZCFqsh0TiFDHeGL+*/
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
import { orgVersionView } from "../../../tmpub/pub/util/version/index";
import { setEditByFixrate, setEditByRate ,setEditByPk_currtype,setEditByPrepayinterest} from "./financepayEdit";
import {setRepayIntstEditByPk_currtype} from "./repayintstEdit";
// import { moduleId } from "../contract/cons/constant";
import { getappurl } from "./listHeadBtnClick";
import { checkEditRight } from "./listEvent";
import {showErrBtn} from "../../../tmpub/pub/util/index";
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
            async: false,
            data,
            success: res => {
                resolve(res);
            },
            //单服务 借转贷新增 zhaoxbk 2020.3.15 begin
            error: res => {
                toast({ color: 'danger', content: res.message });
                if(data.attrcode == 'debittoloan'){
                    this.props.form.setFormItemsValue(this.formId,{'debittoloan':{
                        display: null,
                        value: null
                    }});
                }
            }
            //单服务 借转贷新增 zhaoxbk 2020.3.15 end
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
                display: this.state.json["36360PUBLIC-000035"],
                value: "AGENT"
            } /* 国际化处理： 代理行*/
        });
    } else {
        props.cardTable.addRow(this.tabCode, num - 1, {
            banktype: {
                display: this.state.json["36360PUBLIC-000036"],
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
            display: this.state.json["36360PUBLIC-000036"],
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
    this.setState({ isPaste: false }, () => {
        this.buttonVisible(props);
        props.cardTable.setStatus(currTableId, "edit");
    });
    props.cardTable.setValByKeyAndIndex(
        currTableId,
        index,
        tabs.tabId[currTableId],
        { value: null }
    );
   
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
            url: `/nccloud/icdmc/${moduleName}/voucherlinkedbill.do`,
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
 * 凭证联查单据
 * @param {*} props        页面内置对象
 * @param {*} moduleName   节点名
 */
export function linkVoucherForReceipt(props, moduleName) {
    //src修改为scene
    let src = props.getUrlParam("scene");
    if (src) {
        //fip代表会计平台
        if ("fip" == src) {
            //将联查标志加入缓存
            setDefData(this.linkdataSource, this.islink, true);
            voucherLinkBillForReceipt.call(this, moduleName);
        }
    }
}
/**
 * 凭证联查单据
 *
 * @param {*} moduleName - 模块名称 用于拼接url
 */
export function voucherLinkBillForReceipt(moduleName) {
    let checkedData = [];
    //缓存中的key为’checkedData’,
    checkedData = cacheTools.get("checkedData");
    if (checkedData && checkedData.length > 0) {
        ajax({
            url: `/nccloud/icdmc/${moduleName}/voucherlinkedbill.do`,
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
                            setDefData(this.linkdataSource, this.isOneLink, true);
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
    let status = props.getUrlParam("status");
    if (!id) {
        id = this.id;
    } else {
        this.id = id;
    }
    //新增的时候不能给页面赋值-wangyyx
    if (status != 'add') {
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
                this.billNo = cardData.head[this.formId].rows[0].values.vbillno.value;
                this.props.setUrlParam({
                    id: id
                });
                this.buttonVisible(this.props);

                return;
            }
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
    let status = this.props.getUrlParam("status");
    let cardData = getCacheById(id, this.cache);
    if (cardData && !isRefresh && !isFirst) {
        if (!isFirst && this.props.getUrlParam("scene") != "linksce") {
            //第一次走initTemplate.js中的initPage
            initData.call(this, this.props);
        }
        return;
    }
    ajax({
        url: `${url}.do`,
        data: {
            pk: id,
            pageCode: this.pageId,
			extParam:{
				"status":status
			}
        },
        success: res => {
            let { success, data } = res;
            if (success) {
                
                if (data && data.head) {
                    this.props.form.setAllFormValue({
                        [this.formId]: data.head[this.formId]
                    });
                    //设置id
                    this.id = id;
                    this.billNo = this.props.form.getFormItemsValue(
                        this.formId,
                        "vbillno"
                    ).value;                   
                    this.ts = data.head[this.formId].rows[0].values.ts.value;                    
                    if (status == "copy" || status == "edit") {
                        if (this.primaryId == "pk_contract_icdmc") {
                            // 设置修改可编辑性
                            setSrcEdit.call(this, this.props);                        
                            if (res.data.userjson) { 
                                let returnmode = JSON.parse(res.data.userjson);
                                let {columnPrecisions,retExtParam} =returnmode;
                                if(retExtParam){
                                    //设置组织本币列编辑性
                                    processHeadOlcRateEditable.call(this, this.props, retExtParam);       
                                }
                                if(columnPrecisions){
                                    //设置列精度         
                                    this.props.cardTable.setColScale(columnPrecisions);
                                } 
                                returnModeControlIadate.call(this, this.props, returnmode);
                                adjratemethodControl.call(this, this.props);                              
                                if(returnmode && returnmode.isinneracc){
                                    this.props.form.setFormItemsRequired(this.formId, {
                                        'creditaccount': false
                                    });
                                    this.props.form.setFormItemsRequired(this.formId, {
                                        'innercreditaccount': true
                                    });
                                    this.props.form.setFormItemsDisabled(this.formId, {
                                        'creditaccount': true//贷款账户
                                    });
                                    this.props.form.setFormItemsDisabled(this.formId, {
                                        'innercreditaccount': false//内部贷款账户
                                    });
                                }else{
                                    this.props.form.setFormItemsRequired(this.formId, {
                                        'creditaccount': true
                                    });
                                    this.props.form.setFormItemsRequired(this.formId, {
                                        'innercreditaccount': false
                                    });
                                    this.props.form.setFormItemsDisabled(this.formId, {
                                        'creditaccount': false//贷款账户
                                    });
                                    this.props.form.setFormItemsDisabled(this.formId, {
                                        'innercreditaccount': true//内部贷款账户
                                    });
                                }
                            }
                        }
                    }

                    //放款申请可编辑性控制
                    if(this.primaryId == "pk_financepayapply" && status == "add"){
                        let key = 'contractid';
                        
                        this.props.form.setFormItemsRequired(this.formId, {
                            [key]: false
                        });
                        this.props.form.setFormItemsDisabled(this.formId, {
                            [key]: true
                        });
                    }
                    if(this.primaryId == "pk_financepayapply" && (status == "edit" || status == 'copy')){
                        this.props.initMetaByPkorg();
                        this.props.form.setFormItemsDisabled(this.formId, this.editdisabled);
                        if(status == 'copy'){
                            this.props.form.setFormItemsValue(this.formId,{'pk_financepayapply':null});
                            this.props.form.setFormItemsValue(this.formId,{'vbillno':null});
                            this.buttonVisible(this.props);
                        }

                    }


                    //放款结转单可编辑性控制增加编辑性控制
                    if (this.primaryId == "pk_innerloanpay" && status == "edit") {
						if(data.head[this.formId].rows[0].values.vbillstatus &&
                            data.head[this.formId].rows[0].values.vbillstatus
                                .value &&
                            data.head[this.formId].rows[0].values.vbillstatus
                                .value != -1 ){
                                    toast({ color: "warning", content: this.state.json['3636PUBLIC-000071'] });
                                    this.props.setUrlParam({ status: "browse" });
                                    this.buttonVisible.call(this, this.props);
                                    return;
                        }
                        editDebittoLoan.call(this, this.props)
                    }
                    //放款结转单进行翻译
                    if (this.primaryId == "pk_innerloanpay" && status == "browse") {
                        debittoLoanTranslet.call(this, this.props)
                    }
                    if (
                        this.primaryId == "pk_innerloanpay" ||
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
                                this.primaryId == "pk_innerloanpay"
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
                    if (this.primaryId == "pk_innerloanpay") {

                        let values = data.head[this.formId].rows[0].values;
                        let effecttype = values.effecttype;
                        let finance_rate_type = values.finance_rate_type;
                        let ispayusecc = values.ispayusecc;
                        let prepayinterest=values.prepayinterest;
                        let pk_currtype = values.pk_currtype;
                        let accountinter = values.accountinter;
                        let invstfincvartyid = values.invstfincvartyid;
                        let agentbankmgt = values.agentbankmgt;

                        if (accountinter && accountinter.value && this.props.getUrlParam("status") != "browse") {
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
                        } else if (this.props.getUrlParam("status") != "browse") {
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
                        //根据利率档案设置编辑性
                        if (this.props.getUrlParam("status") != "browse") {
                            setEditByRate(finance_rate_type &&
                                finance_rate_type.value, this.props);
                            //根据币种设置汇率编辑性
                            setEditByPk_currtype(this.props,this.pageId,this.formId,this.formId,
                                this.tabCode,'pk_currtype',pk_currtype);
                            setEditByPrepayinterest(this.props,this.pageId,this.formId,prepayinterest);
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

                    }
                    if (
                        this.primaryId == "pk_repayintsticdmc" &&
                        this.props.getUrlParam("status") == "edit"
                    ) {
                       
                       
                        this.props.resMetaAfterPkorgEdit();
                        this.props.form.setFormItemsDisabled(this.formId, this.editdisabled);
                        let repaytointerest = this.props.form.getFormItemsValue(this.formId,'repaytointerest');//利随本清
                        let isfirstpayintst = this.props.form.getFormItemsValue(this.formId,'isfirstpayintst');  //先付息
                        if((repaytointerest && repaytointerest.value) || (isfirstpayintst && isfirstpayintst.value)) {
                            this.props.form.setFormItemsDisabled(this.formId,{'pk_innerloanpay':true});
                        }
						let loanaccount = this.props.form.getFormItemsValue(this.formId,'loanaccount');
                        if (loanaccount && loanaccount.value == ''){ //结算账户
                            this.props.form.setFormItemsDisabled(this.formId, {
                                loanaccount:true,//贷款账户
                                // fininstitutionid: false //单位内部账户
                            });
                            this.props.form.setFormItemsRequired(this.formId,{
                                'loanaccount':false,//贷款账户
                                // 'fininstitutionid': true //单位内部账户
                            });
                            this.props.form.setFormItemsValue(this.formId,{
                                'loanaccount':null,//贷款账户)
                            });
                           
                        }
                        //根据币种设置汇率编辑性
                        setRepayIntstEditByPk_currtype(this.props,this.pageId,this.formId,this.formId,
                            'pk_currtype',null);
                    }
                    //start_icdmc_zhanghjr:新增编辑性控制<单位借款账号、贷款账号和内部贷款账号>
                    if (this.primaryId == "pk_repayprcpl_h" &&
                        this.props.getUrlParam("status") == "edit") {
                        let isUtilBank = this.props.form.getFormItemsValue(this.formId, 'pk_innerloanaccount')
                            && this.props.form.getFormItemsValue(this.formId, 'pk_innerloanaccount').value;
                        if (isUtilBank) {
                            if (this.props.form.getFormItemsValue(this.formId, 'pk_innerloanaccount')
                                && this.props.form.getFormItemsValue(this.formId, 'pk_innerloanaccount').value) {
                                this.props.form.setFormItemsDisabled(this.formId, {
                                    'loanaccount': true
                                });
                                this.props.form.setFormItemsDisabled(this.formId, {
                                    'pk_innerloanaccount': false
                                });
                            } else {
                                this.props.form.setFormItemsDisabled(this.formId, {
                                    'pk_innerloanaccount': true
                                });
                                this.props.form.setFormItemsDisabled(this.formId, {
                                    'loanaccount': false
                                });
                            }
                        }else{
                            this.props.form.setFormItemsDisabled(this.formId, {
                                'loanaccount': true
                            });
                            this.props.form.setFormItemsDisabled(this.formId, {
                                'pk_innerloanaccount': true
                            });
                        }
                        //未勾选提前还本-付累计利息，利随本清，重算还款计划，不可以编辑
                        let isbeforerepayflag = this.props.form.getFormItemsValue(this.formId, 'beforerepayflag')
                            && this.props.form.getFormItemsValue(this.formId, 'beforerepayflag').value;
                            if(!isbeforerepayflag){
                                this.props.form.setFormItemsDisabled(this.formId, {
                                    'paytotalintstflag': true
                                });//付累计利息
                                this.props.form.setFormItemsDisabled(this.formId, {
                                    'intrstoffbyprcplflag': true
                                });//利随本清
                                this.props.form.setFormItemsDisabled(this.formId, {
                                    'regenrepayplan': true
                                });//重算还款计划
                            }
                    }
                    //end_icdmc_zhanghjr
                    //异常交互
                    //控制重试按钮显示情况
                    showErrBtn(this.props, {
                        headBtnCode: 'head',
                        headAreaCode:this.formId,
                        fieldPK:this.primaryId,
                        datasource: this.dataSource
                    });
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

                    if (this.primaryId == "pk_innerloanpay") {

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
                //如果是刷新提示刷新成功
                if (isRefresh && status != "copy") {
                    toast({ color: "success", content: this.state.json['3636PUBLIC-000064'] });
                }
                this.buttonVisible(this.props);
                let tabDefData =
                    getDefData(this.tabCache, this.dataSource) || new Map();
                if(data && data.bodys && JSON.stringify(data.bodys) !== "{}") {
                    tabDefData.set(
                        id,
                        this.tabShow.concat(Object.keys(data.bodys))
                    );
                }
                if (status != "copy") {
                    setDefData(this.tabCache, this.dataSource, tabDefData);
                    // 更新缓存
                    updateCache(this.primaryId, id, data, this.formId, this.cache);
                }
                
            }
        },
        error:(res)=> {
            this.props.setUrlParam({
                status: 'browse',
                id: this.props.getUrlParam('id')
            });
            toast({ color: 'danger', content: res.message });
            this.props.form.EmptyAllFormValue(this.formId);
			if (this.primaryId == "pk_repayintsticdmc" || this.primaryId == "pk_financepayapply"){
                this.billNo = null;
            }else{
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
            setDefData(this.tabCache, this.dataSource, tabDefData);
            // 更新缓存
            updateCache(this.primaryId, id, null, this.formId, this.cache);
            return;
        }
    });
}
/**
 * 卡片按钮操作
 * @param {*} path       接口地址
 * @param {*} content    toast弹框显示内容
 * @param {*} data       指派数据
 * @param {*} extParam     拓展参数
 */
export function cardBtnOperation(path, content, data, extParam) {
    let vbillNo = this.props.form.getFormItemsValue(this.formId, this.primaryId)
        .value;
    if (!vbillNo) {
        vbillNo = this.state.pk;
    }
    let pkMapTs = {};
    pkMapTs[vbillNo] = this.ts
        ? this.ts
        : this.props.form.getFormItemsValue(this.formId, "ts") &&
        this.props.form.getFormItemsValue(this.formId, "ts").value;
    if (!extParam) {
        extParam = {};
    }

    let saveData = {
        pkMapTs,
        pks: [vbillNo],
        pageCode: this.pageId,
        extParam
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
                        this.ts = ts;
                        this.setState({
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
                        let tbbmessage=res.data.head[this.formId].rows[0].values.tbbmessage;
                        if(tbbmessage&&tbbmessage.value) {
                            toast({ color: "warning", content:tbbmessage.value });
                        }else {
                            toast({ color: "success", content });
                        }   
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
                            this.billNo = "";
                            this.id="";
                            this.cacheId="";//内贷还本特有
                            // this.setState({
                            //     billNo: ""
                            // });
                            setEditStatus.call(this, "browse");
                            clearAll.call(this, this.props, false);
                        }
                        this.setState({
                            backdisplay: false
                        });
                    } else if (path.indexOf("delversion") !== -1) {
                        let id =
                            res.data.head[this.formId].rows[0].values[
                                this.primaryId
                            ].value;
                        updateCache(
                            this.primaryId,
                            vbillNo,
                            res.data,
                            this.formId,
                            this.dataSource
                        );
                        // deleteCacheById(this.primaryId, vbillNo, this.cache);
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
                            this.billNo = "";
                            // this.setState({
                            //     billNo: ""
                            // });
                            setEditStatus.call(this, "browse");
                            clearAll.call(this, this.props, false);
                        }
                    } else if (res.data) {
                        let ts =
                            res.data.head[this.formId].rows[0].values.ts.value;
                        this.ts = ts;
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
        },
        error: res => {
            this.props.setUrlParam({
                id: vbillNo,
                status: "browse"
            });
            //changed by zhanghjr,防止错误信息一闪即消
            // getCardData.call(this, this.cardUrl, vbillNo, true);
            setEditStatus.call(this, "browse");
            toast({
                color: "danger",
                content: res.message
            });
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
        this.state.json["36360PUBLIC-000012"],
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
    if (!id) {
        id = this.id;
    }
    props.setUrlParam({ status: "browse" });
    if (id) {
        props.form.cancel(this.formId);
        this.tabCode && this.props.cardTable.resetTableData(this.tabCode);
        getCardData.call(this, this.cardUrl, id);
        setEditStatus.call(this, "browse");
        let billNo = this.props.form.getFormItemsValue(this.formId, "vbillno")
            .value;
        this.billNo = billNo;
        //this.setState({ billNo }); //设置单据号
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
    if (this.primaryId != 'pk_repayintsticdmc' && this.primaryId != 'pk_financepayapply') {
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
    }
    props.button.setButtonDisabled(this.disabled_TabBtn, true);
    orgVersionView(this.props, "header");
    this.billNo = "";

    this.buttonVisible.call(this, props);


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
    checkEditRight.call(this, props, this.props.getUrlParam("id")).then((res) => {
        props.setUrlParam({ status: "edit" });
        props.resMetaAfterPkorgEdit();
        this.buttonVisible.call(this, props);
        getCardData.call(
            this,
            this.cardUrl,
            this.props.getUrlParam("id"),
            true,
            false
        );
        orgVersionView(props, "header");
        props.button.setButtonDisabled(["deleteRow"], true);
        props.button.setButtonDisabled(["addRow"], false);
        setSrcFinancepayEdit.call(this, props);
    });
}



/**
 * 设置来源上游单据的编辑性
 */
export function setSrcEdit(props) {
    let pk_srcbill = props.form.getFormItemsValue(this.formId, 'pk_srcbill');
    if (pk_srcbill && pk_srcbill.value) {
        //如果上游推单的 需要将下面字段设置成不可以编辑
        props.form.setFormItemsDisabled(this.formId, {
            pk_org: true,//组织
            pk_financorg: true,//借款单位
            applyno: true,//申请编号
            pk_currtype: true,//币种
            applymny: true,//申请金额
            begindate: true,//开始日期
            periodunit: true,//期间单位
            periodcount: true,//期间
            // loanperiod:true,//借贷期间
            enddate: true,//结束日期
            guaranteetype: true,//担保方式
            unitdebitaccount: true,//单位借款账号
            creditaccount: false//贷款账号
        });
    } else {
        props.form.setFormItemsDisabled(this.formId, {
            pk_org: true,//组织
            pk_financorg: false,//借款单位
            applyno: true,//申请编号
            pk_currtype: false,//币种
            applymny: true,//申请金额
            begindate: false,//开始日期
            periodunit: false,//期间单位
            periodcount: false,//期间
            loanperiod: false,//借贷期间
            enddate: false,//结束日期
            guaranteetype: false,//担保方式
            unitdebitaccount: false,//单位借款账号
            creditaccount: true//贷款账号
        });
        //贷款账户
        let creditaccount = props.form.getFormItemsValue(this.formId, "creditaccount"); //贷款账号
        if (creditaccount && creditaccount.value) {
            props.form.setFormItemsRequired(this.formId, {
                'creditaccount': true
            });
            props.form.setFormItemsDisabled(this.formId, {
                'creditaccount': false//贷款账户
            });
        }
        //内部贷款账户
        let innercreditaccount = props.form.getFormItemsValue(this.formId, "innercreditaccount"); //贷款账号
        if (innercreditaccount && innercreditaccount.value) {
            props.form.setFormItemsRequired(this.formId, {
                'innercreditaccount': true
            });
            props.form.setFormItemsDisabled(this.formId, {
                'innercreditaccount': false//贷款账户
            });
        }
    }

}
/**
 * 设置内贷放款的编辑性
 */
export function setSrcFinancepayEdit(props) {
    if (this.primaryId == "pk_innerloanpay") {
        //固定利率影响编辑性
        setEditByFixrate(props);
        //是否先付息，设置固定利率的编辑性
        let prepayinterest = props.form.getFormItemsValue(this.formId, 'prepayinterest');
        if (prepayinterest && prepayinterest.value) {
            props.form.setFormItemsDisabled(this.formId, {
                fixrate: true,
                accountinter:true
            });
        } else {
            props.form.setFormItemsDisabled(this.formId, {
                fixrate: false,
                accountinter:false
            });
        }
        //获取调整方案，设置调整日期的编辑性
        let adjratemethod = props.form.getFormItemsValue(this.formId, 'adjratemethod');
      
        if(adjratemethod&&adjratemethod.value){
        
            switch (adjratemethod.value) {
            case "SETTLEDATE":
                // 结息日
                props.form.setFormItemsDisabled(this.formId, {
                    adjbegdate: true,
                    adjperiodunit: true,
                    lastadjdate: true
                });

                break;
            case "RATESTARTDATE":
                // 利率起效日
                props.form.setFormItemsDisabled(this.formId, {
                    adjbegdate: true,
                    adjperiodunit: true,
                    lastadjdate: true
                });

                break;
            case "YEAR":
                // 年
                props.form.setFormItemsDisabled(this.formId, {
                    adjbegdate: true,
                    adjperiodunit: true,
                    lastadjdate: true
                });

                break;
            case "HALFYEAR":
                // 半年
                props.form.setFormItemsDisabled(this.formId, {
                    adjbegdate: true,
                    adjperiodunit: true,
                    lastadjdate: true
                });

                break;
            case "QUARTER":
                // 季
                props.form.setFormItemsDisabled(this.formId, {
                    adjbegdate: true,
                    adjperiodunit: true,
                    lastadjdate: true
                });

                break;
            case "MONTH":
                // 月
                props.form.setFormItemsDisabled(this.formId, {
                    adjbegdate: true,
                    lastadjdate: true
                });

                break;
            default:
                break;
        }
    }
    }

}


/**
 * 卡片联查凭证
 * @param {*} props  页面内置对象
 * @param {*} cardData 单据
 */
export function cardVoucher(props, cardData, isReceipt) {
    // 拼装凭证数据
    let voucherData;
    //判断是否为回单及其他特殊类型
    if (isReceipt) {
        voucherData = cardData.head.head.rows[0].values;
    } else {
        voucherData = cardData.head.header.rows[0].values;
    }
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
        url: "/nccloud/icdmc/common/loanlinkbill.do", //业务组自己写入口类
        data: voucherArr,
        success: res => {
            if (res.success) {
                let { success, data } = res;
                let srcCode = data.src;
                let { url, pklist, appcode, pagecode, srcAppCode, cachekey } = data;
                if ("_LinkVouchar2019" == srcCode) {
                    //走联查
                    if (res.data.des) {
                        //跳转到凭证界面
                        if (res.data.pklist) {
                            if (res.data.pklist.length == 1) {
                                //单笔联查
                                props.openTo(res.data.url, {
                                    status: "browse",
                                    appcode,
                                    pagecode,
                                    id: res.data.pklist[0],
                                    n: this.state.json["36360PUBLIC-000034"], //'联查凭证'
                                    pagekey: 'link',//去掉联查凭证页面中操作按钮
                                    backflag: "noback"
                                });
                                return;
                            } else {
                                //多笔联查
                                cacheTools.set(cachekey, pklist);
                                props.openTo(res.data.url, {
                                    status: "browse",
                                    appcode,
                                    pagecode,
                                    scene: appcode + srcCode,
                                    n: this.state.json["36360PUBLIC-000034"] //'联查凭证'
                                });
                                return;
                            }
                        }
                    } else {
                        //跳转到会计平台 这里的appcode是业务组的小应用编码
                        cacheTools.set(srcAppCode + srcCode, pklist);
                        //打开凭证节点
                        props.openTo(res.data.url, {
                            status: 'browse',
                            appcode,
                            pagecode,
                            scene: srcAppCode + srcCode,
                        });
                    }
                } else {
                    if (res.data.src && res.data.src == "_Preview2019") {
                        toast({
                            color: "warning",
                            content: this.state.json["36360PUBLIC-000045"]
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
                    n: this.state.json["36360PUBLIC-000034"] // '凭证预览' 凭证使用这个参数,会计平台不用
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
            this.billNo = this.props.form.getFormItemsValue(
                this.formId,
                "vbillno"
            ).value;
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
            content: this.state.json["36360PUBLIC-000038"]
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
            content: this.state.json["36360PUBLIC-000038"]
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
    let key = this.primaryId == "pk_innerloanpay" ? "pk_settledate" : "iadate";
    let autogenrepay = this.primaryId == "pk_innerloanpay" ? "autogenrepay" : null;
    let appcode = props.getSearchParam("c") || props.getUrlParam("c");
    let status = this.props.getUrlParam("status");
    if (value && value.values) {
        // 付息周期
        // let repay_intst_period =
        //     value.values.repay_intst_period &&
        //     value.values.repay_intst_period.value;
        // 还本周期
        // let repay_prcpl_period =
        //     value.values.repay_prcpl_period &&
        //     value.values.repay_prcpl_period.value;
        // 还本方式
        let repay_prcpl_method =
            value.values.repay_prcpl_method &&
            value.values.repay_prcpl_method.value;

        // 付息方式
        let repay_intst_method =
            value.values.repay_intst_method &&
            value.values.repay_intst_method.value;
        // 清空结息日
        if (repay_intst_method == "5") {
            props.form.setFormItemsDisabled(this.formId, {
                [key]: true
            });
            props.form.setFormItemsRequired(this.formId, {
                [key]: false
            });
            // 清空结息日
            props.form.setFormItemsValue(this.formId, {
                [key]: {
                    display: null,
                    value: null
                }
            });
            props.form.setFormItemsValue(this.formId, {
                repaytype: {
                    display: null,
                    value: "once"
                }
            });
            //如果是在放款单选择还款方式
            if (appcode == "36630BDLC") {
                props.button.setButtonVisible({
                    addRow: false
                });
                props.cardTable.tabKeyShowSwitch({
                    repayplan: {
                        show: true,
                        isCur: false,
                        isClear: true
                    }
                });
            }
            // 不规则还本
        } else if (repay_prcpl_method == "6") {
            props.form.setFormItemsValue(this.formId, {
                repaytype: {
                    display: null,
                    value: "unrule"
                }
            });
            props.button.setButtonVisible({
                addRow: true
            });
            props.cardTable.setColEditableByKey(
                this.tabCode,
                ["planrepaycode", "planrepaydate", "premny"],
                false
            );
            //分期还本不付息控制自动划账不可编辑
        } else if (repay_intst_method == "6" && autogenrepay) {
            props.form.setFormItemsDisabled(this.formId, {
                autogenrepay: true
            });
            props.form.setFormItemsDisabled(this.formId, {
                [key]: false
            });
            props.form.setFormItemsRequired(this.formId, {
                [key]: true
            });
            props.form.setFormItemsValue(this.formId, {
                repaytype: {
                    display: null,
                    value: null
                }
            });
        } else {
            if (autogenrepay) {
                props.form.setFormItemsDisabled(this.formId, {
                    autogenrepay: false
                });
            }
            props.form.setFormItemsDisabled(this.formId, {
                [key]: false
            });
            props.form.setFormItemsRequired(this.formId, {
                [key]: true
            });
            props.form.setFormItemsValue(this.formId, {
                repaytype: {
                    display: null,
                    value: null
                }
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
            repaytype: {
                display: null,
                value: null
            }
        });
    }
    //还款方式变了就要清空结息日
    props.form.setFormItemsValue(this.formId, {
        pk_settledate: {
            display: null,
            value: null
        }
    });
    if (status != "copy" && status != "edit") {
        props.form.setFormItemsValue(this.formId, {
            'iadate': {
                display: null,
                value: null
            }        
        });
    }
}
//调整方案控制调整日期
export function adjratemethodControl(props) {
    if (this.primaryId == "pk_innerloanpay") {
        let adjratemethod = props.form.getFormItemsValue(this.formId, "adjratemethod").value;
        switch (adjratemethod) {
            case "SETTLEDATE":
                // 结息日
                props.form.setFormItemsDisabled(this.formId, {
                    adjbegdate: true,
                    adjperiodunit: true,
                    lastadjdate: true
                });
                props.form.setFormItemsValue(this.formId, {
                    adjbegdate: { display: null, value: null },
                    adjperiodunit: { display: null, value: null }
                });
                break;
            case "RATESTARTDATE":
                // 利率起效日
                props.form.setFormItemsDisabled(this.formId, {
                    adjbegdate: true,
                    adjperiodunit: true,
                    lastadjdate: true
                });
                props.form.setFormItemsValue(this.formId, {
                    adjperiodunit: { display: null, value: 1 },
                    adjbegdate: { display: null, value: null },
                    adjperiodunit: { display: null, value: null }
                });
                break;
            case "YEAR":
                // 年
                props.form.setFormItemsDisabled(this.formId, {
                    adjbegdate: true,
                    adjperiodunit: true,
                    lastadjdate: true
                });
                props.form.setFormItemsValue(this.formId, {
                    adjperiodunit: { display: null, value: "12" },
                    adjbegdate: { display: null, value: null }
                });
                break;
            case "HALFYEAR":
                // 半年
                props.form.setFormItemsDisabled(this.formId, {
                    adjbegdate: true,
                    adjperiodunit: true,
                    lastadjdate: true
                });
                props.form.setFormItemsValue(this.formId, {
                    adjperiodunit: { display: null, value: "6" },
                    adjbegdate: { display: null, value: null }
                });
                break;
            case "QUARTER":
                // 季
                props.form.setFormItemsDisabled(this.formId, {
                    adjbegdate: true,
                    adjperiodunit: true,
                    lastadjdate: true
                });
                props.form.setFormItemsValue(this.formId, {
                    adjperiodunit: { display: null, value: "3" },
                    adjbegdate: { display: null, value: null }
                });
                break;
            case "MONTH":
                // 月
                props.form.setFormItemsDisabled(this.formId, {
                    adjbegdate: true,
                    lastadjdate: true
                });
                props.form.setFormItemsValue(this.formId, {
                    adjbegdate: { display: null, value: "12" },
                    adjbegdate: { display: null, value: null }
                });
                break;
            default:
                break;
        }
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
        this.primaryId == "pk_innerloanpay" ||
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
                this.primaryId == "pk_innerloanpay" ? "pk_settledate" : "iadate";
            this.props.form.setFormItemsRequired(this.formId, {
                [key]: false
            });
            this.props.form.setFormItemsDisabled(this.formId, {
                [key]: true
            });
        }
    }
    if (props.getUrlParam("status") == "change") {
        if (this.primaryId == "pk_innerloanpay") {
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
        if (this.primaryId == "pk_innerloanpay") {
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
    }
    //这里不能这么加这个东西，用的cardTable,传的是form，会报错的
    // else if (key.startsWith('vdef')){
    //     props.cardTable.setQueryCondition(this.formId, {
    //         [key]: () => {
    //             return {
    //                 pk_org: (props.form.getFormItemsValue(this.formId, 'pk_org') || {}).value
    //             };
    //         }
    //     });
    // } 
    else {
        return true;
    }
}
// 获取最新的汇率数据
const getNewCurrtype = data => {
    return new Promise((resolve, reject) => {
        ajax({
            url: "/nccloud/icdmc/common/operatecurrtrate.do",
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

/**
* 借款来源的翻译
* 
* 
* @param {*} props 页面内置对象
* @param {*} moduleId 区域ID
*  @param {*} value 交易对象值
*/
export function debittoLoanTranslet(props) {
    //借款来源
    let borrowmnysource = props.form.getFormItemsValue(this.formId, "borrowmnysource");
    if (borrowmnysource && borrowmnysource.value) {
        let val = borrowmnysource.value
        switch (val) {
            case '0':
                this.props.form.setFormItemsValue(this.formId, {
                    borrowmnysource: {
                        value: val,
                        display: '贷款放款'

                    }
                });
                break;
            case '1':
                this.props.form.setFormItemsValue(this.formId, {
                    borrowmnysource: {
                        value: val,
                        display: '契约发行'
                    }
                });
                break;
        }
    }
};

/**
 * 单据修改借转贷字段的编辑性控制
 * 
 * 
 * @param {*} props 页面内置对象
 * @param {*} moduleId 区域ID
 *  @param {*} value 交易对象值
 */
export function editDebittoLoan(props) {
    //获取是否为借助贷单据  
    let debittoloan = props.form.getFormItemsValue(this.formId, "debittoloan");

    if (debittoloan && debittoloan.value) {
        // props.form.setFormItemsDisabled(this.formId, {
        //     srcbillno: false
        // });
        props.form.setFormItemsDisabled(this.formId, {
            borrowmnysource: false
        });
        //借转贷必输项
        props.form.setFormItemsRequired(this.formId, {
            srcbillno: true,
            borrowmnysource: true
        });
        props.form.setFormItemsDisabled(this.formId, {
            pk_rate: true,
            floatscale: true,
            floatpoint: true,
            adjratemethod: true,
            effecttype: true,
            adjbegdate: true,
            lastadjdate: true,
            advancefloatscale: true,
            advancefloatpoint: true,
            extfloatpoint: true,
            extfloatscale: true,
            fixrate: true

        });

    }else{
        props.form.setFormItemsDisabled(this.formId, {
            borrowmnysource: true
        });
        //借转贷必输项
        props.form.setFormItemsRequired(this.formId, {
            srcbillno: false,
            borrowmnysource: false
        });


    }
	//放款申请新加  zhaoxbk  begin
	let pk_srcbilltypeid = props.form.getFormItemsValue(this.formId, 'pk_srcbilltypeid');
    if (pk_srcbilltypeid && pk_srcbilltypeid.value && pk_srcbilltypeid.value == '1001Z61000000000NJ8B') { //判断单据来源是内部放款申请
        props.initMetaByPkorg();
        props.form.setFormItemsDisabled(this.formId, {
            loandate: false,
            loanmny:false,
            pk_org:true
        });
    }
    // debittoLoanRequired(props, moduleId, value,false)
};


/**
 * 设置表头组织本币汇率得编辑性
 * @param {*} props 
 */
function processHeadOlcRateEditable(props, extParam) {
    if (extParam.hasOwnProperty('headOlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['headOlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(this.formId, {   olcrate: flag });
   }
   if (extParam.hasOwnProperty('headGlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['headGlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(this.formId, {   glcrate: flag });
   }
   if (extParam.hasOwnProperty('headGllcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['headGllcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(this.formId, {   gllcrate: flag });
   }
}


/*QB6Cta54YZYj18ukkNSw6s6w/5HHI50S1xG3XVdcs5/3IcD+ZCFqsh0TiFDHeGL+*/