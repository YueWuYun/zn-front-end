/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { ajax, base, toast } from "nc-lightapp-front";
import { tabs } from "../../cons/constant.js";
import { showErrBtn } from "../../../../../tmpub/pub/util";


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
    let voucherflag =
        props.form.getFormItemsValue(this.formId, "voucherflag") &&
        props.form.getFormItemsValue(this.formId, "voucherflag").value;

    let isfirstpayintst = 
        props.form.getFormItemsValue(this.formId, "isfirstpayintst") &&
        props.form.getFormItemsValue(this.formId, "isfirstpayintst").value; //先付息
    let repaytointerest = 
        props.form.getFormItemsValue(this.formId, "repaytointerest") &&
        props.form.getFormItemsValue(this.formId, "repaytointerest").value; //利随本清

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
                        "refresh"
                    ];
                case "0": //未通过态
                    showBtn = [
                        "addGroup",
                        "commit",
                        "union",
                        "approveDetail",
                        "voucher",
                        "contract",
                        "financepay",
                        "repay",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
                    break;
                case "1": //通过态
                    if(voucherflag){ //制证
                        showBtn = [
                            "addGroup",
                            // "add_n",
                            // "unCommit",
                            "union",
                            "approveDetail",
                            "voucher",
                            "contract",
                            "financepay",
                            "repayIntstReceipt",
                            "repay",
                            "fundPlan",
                            "Attachment",
                            "print",
                            "printOut",
                            "refresh",
                            "unAccreditation"
                        ];
                    }else{
                        showBtn = [
                            "addGroup",
                            // "add_n",
                            "unCommit",
                            "union",
                            "approveDetail",
                            "voucher",
                            "contract",
                            "financepay",
                            "repayIntstReceipt",
                            "repay",
                            "fundPlan",
                            "Attachment",
                            "print",
                            "printOut",
                            "refresh",
                            "accreditation"
                        ];
                    }
                    
                    break;
                case "2": //进行中态
                    showBtn = [
                        // "add_n",
                        "union",
                        "approveDetail",
                        // "voucher",
                        "contract",
                        "financepay",
                        "repay",
                        "fundPlan",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
                    break;
                case "3": //提交态
                    showBtn = [
                        // "add_n",
                        "unCommit",
                        "union",
                        "approveDetail",
                        // "voucher",
                        "contract",
                        "financepay",
                        "repay",
                        "fundPlan",
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
    if(vbillstatus){
        if(vbillstatus == "1"){
            btnObj["addGroup"] = true;
            btnObj["edit"] = false;
            btnObj["delete"] = false;
            btnObj["repayIntstReceipt"] = true;
            if(voucherflag){
                btnObj["voucher"] = true;
            }else{
                btnObj["voucher"] = false;
            }
        }
        if(vbillstatus == "2"){
            btnObj["addGroup"] = true;
            btnObj["edit"] = false;
            btnObj["delete"] = false;
            btnObj["voucher"] = false;
            btnObj["repayIntstReceipt"] = false;
        }
        
        if(vbillstatus == "0" || vbillstatus == "3"){
            btnObj["voucher"] = false;
            btnObj["repayIntstReceipt"] = false;
        }
        
        
        if(vbillstatus == "-1"){
            btnObj["voucher"] = false;
            btnObj["repayIntstReceipt"] = false;
            if (!isBrowse){
                btnObj["addGroup"] = false;
            }else if(isfirstpayintst || repaytointerest){
                btnObj["addGroup"] = true;
                btnObj["edit"] = true;
                btnObj["delete"] = false;
            }else {
                btnObj["addGroup"] = true;
                btnObj["edit"] = true;
                btnObj["delete"] = true;
            }
        }
    }
    
    props.button.setButtonVisible(btnObj);
    props.cardTable.setStatus(this.tabCode, isBrowse ? "browse" : "edit");
    props.form.setFormStatus(this.formId, isBrowse ? "browse" : "edit");
    // if (!isBrowse && status !== "add") {
    //     props.button.setButtonDisabled(["deleteRow"], true);
    //     props.button.setButtonDisabled(["addRow"], false);
    // }
    //设置卡片头部状态
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn:
            isBrowse &&
            (this.props.getUrlParam("scene") !== "approvesce" && this.props.getUrlParam("scene") !== "linksce"), //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        // showBackBtn: isBrowse,
        showBillCode: this.billNo, //控制显示单据号：true为显示,false为隐藏 ---非必传
        billCode: this.billNo //修改单据号---非必传
    });
    //控制重试按钮显示情况
    showErrBtn(props, { 
        headBtnCode: 'card_head',
        headAreaCode: this.formId ,
       fieldPK: this.primaryId
     });
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/