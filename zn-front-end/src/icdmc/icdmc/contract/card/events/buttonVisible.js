/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { ajax, base, toast } from "nc-lightapp-front";
import { tabs } from "../../cons/constant.js";

/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
    let { isPaste } = this.state;
    let status = props.getUrlParam("status");
    let id = props.getUrlParam("id");
    let isBrowse = status === "browse";
    let buttons = props.button.getButtons();
    let vbillstatus =
        props.form.getFormItemsValue(this.formId, "vbillstatus") &&
        props.form.getFormItemsValue(this.formId, "vbillstatus").value;
    let busistatus =
        props.form.getFormItemsValue(this.formId, "busistatus") &&
        props.form.getFormItemsValue(this.formId, "busistatus").value;
    let versionno =
        props.form.getFormItemsValue(this.formId, "versionno") &&
        props.form.getFormItemsValue(this.formId, "versionno").value;
    let ishasApprove =
        props.form.getFormItemsValue(this.formId, "ispayplan") &&
        props.form.getFormItemsValue(this.formId, "ispayplan").value;//Y 有审批流 N 无审批流
    let btnObj = {};
    let showBtn = [];
    props.button.setMainButton('add',true);
    props.button.setMainButton('add_n',false);
    if (!isBrowse) {
        //编辑态
        if (status == "change") {
            showBtn = [
                "saveGroup",
                "cancel",
                // "addRow",
                // "deleteRow",
                'tabsgroup',
                "cela",
                "insertRow",
                "delRow"
            ];
        } else if (props.getUrlParam("pageType") == "version") {
            showBtn = [];
        } else {
            showBtn = [
                "saveGroup",
                "cancel",
               // "addRow",
                // "deleteRow",
                'tabsgroup',
                "cela",
                "insertRow",
                "delRow"
            ];
        }
    } else {
        //浏览态
        if (!id) {
            //新增浏览态
            showBtn = ["add_n"];
            props.button.setMainButton('add_n',true);
        } else {
            //单据浏览态
            switch (vbillstatus) {
                case "-1": //自由态
                    // if (+versionno > 1) {
                    //     showBtn = [
                    //         "edit_n",
                    //         "add_n",
                    //         "viewVersion",
                    //         "commit",
                    //         "back",
                    //         "Attachment",
                    //         "print",
                    //         "printOut",
                    //         "refresh",
                    //         "back",
                    //         "union"                            
                    //     ];
                    // } else {
                    //     showBtn = [
                    //         "addGroup",
                    //         "commit",
                    //         "Attachment",
                    //         "print",
                    //         "printOut",
                    //         "refresh",
                    //         "back",
                    //         "union"
                    //     ];
                    // }
                    showBtn = [
                        "addGroup",
                        "commit",
                        "union",
                        "approveDetail",
                        "apply",
                        "viewVersion",
                        "guarantee",
                        "credit",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh",
                        "back"
                    ];
                    if (+versionno > 1) {
                        showBtn = showBtn.concat(["viewVersion"]);
                    }
                    props.button.setButtonVisible(["edit","delete"],true);
                    props.button.setMainButton('add',false);
                    break;
                case "0": //未通过态
                    showBtn = [
                        "addGroup",
                        "commit",
                        "union",
                        "approveDetail",
                        "apply",
                        "viewVersion",
                        "guarantee",
                        "credit",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh",
                        "back"
                    ];
                    if (+versionno > 1) {
                        showBtn = showBtn.concat(["viewVersion"]);
                    }
                    break;
                case "1": //通过态
                    showBtn = [
                        "addGroup",
                        "union",
                        "approveDetail",
                        "viewVersion",
                        "guarantee",
                        "credit",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
                    if(busistatus == 2){
                        //有审批流
                        if(ishasApprove){
                            showBtn = showBtn.concat(["change","viewVersion","delete_version","termination"]);
                        }else{
                        //无审批流
                            showBtn = showBtn.concat(["unCommit","change","viewVersion","delete_version","termination"]);
                        }
                    }
                    if (busistatus == 1) {
                        //在执行
                        showBtn = showBtn.concat(["termination", "change","viewVersion","delete_version"]);
                    } else if (busistatus == 4) {
                        //终止
                        showBtn = showBtn.concat(["unTermination"]);
                    } else if (busistatus == 0){
                        //已结束
                        showBtn = showBtn.concat(["viewVersion_n"]);
                    }
                    if (+versionno > 1) {
                        showBtn = showBtn.concat(["viewVersion","delete_version"]);
                    }
                    props.button.setButtonVisible(["edit","delete"],false);
                    break;
                case "2": //进行中态
                    showBtn = [
                        "addGroup",
                        "union",
                        "approveDetail",
                        "apply",
                        "viewVersion",
                        "guarantee",
                        "credit",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
                    if (+versionno > 1) {
                        showBtn = showBtn.concat(["viewVersion"]);
                    }
                    props.button.setButtonVisible(["edit","delete"],false);
                    break;
                case "3": //提交态
                    showBtn = [
                        "addGroup",
                        "unCommit",
                        "union",
                        "approveDetail",
                        "apply",
                        "viewVersion",
                        "guarantee",
                        "credit",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
                    if (+versionno > 1) {
                        showBtn = showBtn.concat(["viewVersion"]);
                    }
                    props.button.setButtonVisible(["edit","delete"],false);
                    break;
                default:
                    break;
            }
            showBtn = showBtn.concat(["fold", "unfold"]);
        }
    }
    // for循环的目的是拼接成{a: true, b: false, ...}, 来控制按钮的显隐性
    for (let item of buttons) {
        btnObj[item.key] = showBtn.includes(item.key);
    }
    props.button.setButtonVisible(btnObj);
    props.cardTable.setStatus(this.tabCode, isBrowse ? "browse" : "edit");
    props.form.setFormStatus(this.formId, isBrowse ? "browse" : "edit");
    if (!isBrowse && status !== "add") {
        props.button.setButtonDisabled(["deleteRow"], true);
        props.button.setButtonDisabled(["addRow"], false);
    }

    // begin_2020-03-05需求变更，单据状态为未执行的，不能变更_zhengweih
    if (vbillstatus == 1 && busistatus == 1) {// 审批通过，在执行
        props.button.setButtonDisabled(["change"], false);
    } else {
        props.button.setButtonDisabled(["change"], true);
    }
    // end_2020-03-05需求变更，单据状态为未执行的，不能变更_zhengweih

    //设置卡片头部状态
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn:
            isBrowse ||
            this.props.getUrlParam("scene") !== ("approvesce" && "linksce"), //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: this.billNo, //控制显示单据号：true为显示,false为隐藏 ---非必传
        billCode: this.billNo //修改单据号---非必传
    });
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/