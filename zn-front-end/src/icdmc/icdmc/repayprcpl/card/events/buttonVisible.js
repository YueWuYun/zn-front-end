/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/

import { showErrBtn } from "../../../../../tmpub/pub/util";
/**
 * 内贷还本-卡片按钮显隐性控制
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
    let { isPaste } = this.state;
    let status = props.getUrlParam("status");
    let id = props.getUrlParam("id");
    if(!id){
        id = this.cacheId;
    }
    let isBrowse = status === "browse";
    let buttons = props.button.getButtons();
    let vbillstatus =
        props.form.getFormItemsValue(this.formId, "vbillstatus") &&
        props.form.getFormItemsValue(this.formId, "vbillstatus").value;//审批状态
    let voucherflag =
        props.form.getFormItemsValue(this.formId, "voucherflag") &&
        props.form.getFormItemsValue(this.formId, "voucherflag").value;//是否制证
    let btnObj = {};
    let showBtn = [];
    if (!isBrowse) {
        //编辑态
        if (!isPaste) {
            showBtn = [
                "saveGroup",
                "cancel",
                "addRow",
                "deleteRow",
                "cela",
                "insertRow",
                "delRow"
            ];
        } else {
            showBtn = [
                "saveGroup",
                "cancel",
                "cela",
                "addRow",
                "deleteRow",
                "copyLastLine",
                "copyAtLine"
            ];
        }
    } else {
        //浏览态
        if (!vbillstatus) {
            //新增浏览态
            showBtn = ["add_n"];
            props.button.setMainButton(['add_n'], true);//按钮高亮
        } else {
            //单据浏览态
            switch (vbillstatus) {
                case "-1": //自由态
                    showBtn = [
                        "addGroup",
                        "commit",
                        "Attachment",
                        "print",
                        "printOut",
                        "union",
                        "contract",
                        "financepay",
                        "fundPlan",
                        "refresh"
                    ];
                    props.button.setMainButton(['commit'], true);//按钮高亮:提交
                    break;
                case "0": //未通过态
                    showBtn = [
                        "addGroup",
                        "commit",
                        "union",
                        "contract",
                        "financepay",
                        "voucher",
                        "approveDetail",
                        "fundPlan",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
                    break;
                case "1": //通过态
                    showBtn = [
                        "add_n",
                        "unCommit",
                        "union",
                        "contract",
                        "financepay",
                        "voucher",
                        "approveDetail",
                        "fundPlan",
                        "Attachment",
                        "print",
                        "printOut",
                        "repayPrcplReceipt",
                        "elecsignformalPrint",
                        "elecsigninformalPrint",
                        "refresh"
                    ];
                    showBtn = voucherflag ? showBtn.concat(["UnBookkeeping"]) : showBtn.concat(["Bookkeeping"]);
                    break;
                case "2": //进行中态
                    showBtn = [
                        "add_n",
                        "union",
                        "contract",
                        "financepay",
                        "voucher",
                        "approveDetail",
                        "fundPlan",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
                    break;
                case "3": //提交态
                    showBtn = [
                        "add_n",
                        "unCommit",
                        "union",
                        "contract",
                        "financepay",
                        "voucher",
                        "approveDetail",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
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
    //联查按钮下拉按钮显示
    if (isBrowse){
        if(vbillstatus == "-1"){//自由
            btnObj["voucher"] = false;
            btnObj["contract"] = true;
            btnObj["financepay"] = true;
            btnObj["approveDetail"] = false;
            btnObj["fundPlan"] = true;
            btnObj["repayPrcplReceipt"] = false;
            btnObj["loanAccountBalance"] = true;
        }else if(vbillstatus == "0"){//未通过
            btnObj["voucher"] = true;
            btnObj["contract"] = true;
            btnObj["financepay"] = true;
            btnObj["approveDetail"] = true;
            btnObj["fundPlan"] = true;
            btnObj["repayPrcplReceipt"] = false;
            btnObj["loanAccountBalance"] = true;
        }else if(vbillstatus == "1"||vbillstatus == "2"||vbillstatus == "3"){//通过
            btnObj["voucher"] = true;
            btnObj["contract"] = true;
            btnObj["financepay"] = true;
            btnObj["approveDetail"] = true;
            btnObj["fundPlan"] = true;
            btnObj["repayPrcplReceipt"] = true;
            btnObj["loanAccountBalance"] = true;
        }
    }
    props.button.setButtonVisible(btnObj);
    props.cardTable.setStatus(this.tabCode, isBrowse ? "browse" : "edit");
    props.form.setFormStatus(this.formId, isBrowse ? "browse" : "edit");
    if (!isBrowse && status !== "add") {
        props.button.setButtonDisabled(["deleteRow"], true);
        props.button.setButtonDisabled(["addRow"], false);
    }
    //console.log('被联查的场景:', this.props.getUrlParam("scene"));
    let scene_link = this.props.getUrlParam("scene");
    //设置卡片头部状态
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn:
            isBrowse &&
            (scene_link !== "approvesce" && scene_link !== "linksce"), //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: this.billNo, //控制显示单据号：true为显示,false为隐藏 ---非必传
        billCode: this.billNo //修改单据号---非必传
    });

//控制重试按钮显示情况
showErrBtn(props, { 
    headBtnCode: 'head',
    headAreaCode: this.formId ,
   fieldPK: this.primaryId
 }); 


}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/