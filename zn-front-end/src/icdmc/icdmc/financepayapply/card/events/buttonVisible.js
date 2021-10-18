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
    let btnObj = {};
    let showBtn = [];
    if (!isBrowse) {
        //编辑态
        if (status == 'copy') {
            showBtn = [
                "saveGroup",
                "cancel"
            ];
        } else {
            showBtn = [
                "saveGroup",
                "cancel"
            ];
        }
    } else {
        //浏览态
        if (!vbillstatus) {
            //新增浏览态
            showBtn = ["add_n"];
            props.button.setMainButton(['add_n'], true);
        } else {
            //单据浏览态
            switch (vbillstatus) {
                case "-1": //自由态
                    showBtn = [
                        "addGroup",
                        "commit",
                        "union",
                        "approveDetail",
                        "contract",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
                    props.button.setMainButton(['commit'], true);
                    props.button.setMainButton(['add'], false);
                    break;
                case "0": //未通过态
                    showBtn = [
                        "addGroup",
                        "commit",
                        "union",
                        "approveDetail",
                        "contract",
                        // "financepay",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
                    props.button.setMainButton(['commit'], true);
                    props.button.setMainButton(['add'], false);
                    break;
                case "1": //通过态
                    if(busistatus == '2'){
                        showBtn = [
                            "addGroup",
                            "union",
                            "approveDetail",
                            "contract",
                            "financepay",
                            "Attachment",
                            "print",
                            "printOut",
                            "refresh"
                        
                        ];
                    }else{
                        showBtn = [
                            "addGroup",
                            "unCommit",
                            "union",
                            "approveDetail",
                            "contract",
                            "financepay",
                            "Attachment",
                            "print",
                            "printOut",
                            "refresh"
                        
                        ];
                        props.button.setMainButton(['unCommit'], true);
                        props.button.setMainButton(['add'], false);
                    }
                    
                    break;
                case "2": //进行中态
                    showBtn = [
                        // "add_n",
                        "union",
                        "approveDetail",
                        "contract",
                        // "financepay",
                        // "fundPlan",
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
                        "contract",
                        // "financepay",
                        // "fundPlan",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
                    props.button.setMainButton(['unCommit'], true);
                    props.button.setMainButton(['add'], false);
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
    if (status != 'copy'){
        if(vbillstatus){
            if(vbillstatus == "1"){
                btnObj["addGroup"] = true;
                btnObj["edit"] = false;
                btnObj["delete"] = false;
                btnObj["copy"] = true;
            }
            if(vbillstatus == "2"){
                btnObj["addGroup"] = true;
                btnObj["edit"] = false;
                btnObj["delete"] = false;
                btnObj["copy"] = true;
                btnObj["financepay"] = false;
            }
            if(vbillstatus == "-1"){
                if (!isBrowse){
                    btnObj["addGroup"] = false;
                }else {
                    btnObj["addGroup"] = true;
                    btnObj["edit"] = true;
                    btnObj["delete"] = true;
                    btnObj["copy"] = true;
                    btnObj["financepay"] = false;
                   
                }
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
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/