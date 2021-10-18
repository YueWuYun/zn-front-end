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
    let list = props.getUrlParam("list");
    if(!id) {
        id=this.id;
    }
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
    //记账标记
    let agentbankmgt =
        props.form.getFormItemsValue(this.formId, "agentbankmgt") &&
        props.form.getFormItemsValue(this.formId, "agentbankmgt").value;
    let btnObj = {};
    let showBtn = [];
    if (!isBrowse) {
        //编辑态
        if (status == "change") {
            showBtn = [
                "addRow",
                "deleteRow",
                "saveGroup",
                "cancel",
                "cela",
                "insertRow",
                "delRow",
                "toAllocation"
            ];
        } else if (props.getUrlParam("pageType") == "version") {
            showBtn = [];
        } else {
            if (props.getUrlParam("status") == "extension") {
                showBtn = ["saveGroup_n", "cancel", "cela"];
            } else {
                showBtn = [
                    "saveGroup",
                    "cancel",
                    "addRow",
                    "deleteRow",
                    "cela",
                    "insertRow",
                    "delRow",
                    "toAllocation"
                ];
            }
        }
    } else {
      
        
        //浏览态
        if (!vbillstatus) {
            //新增浏览态
            showBtn = ["add_n"];
            props.button.setMainButton(['add_n'], true);
        } else {
       
            props.button.setMainButton(['add_n'], false);
            props.button.setMainButton(['add'], false);
            //单据浏览态
            switch (vbillstatus) {
                case "-1": //自由态
                    if (+versionno > 1) {
                        showBtn = [
                            "add_n",
                            "commit",
                            "Attachment",
                            "union",
                            "print",
                            "printOut",
                            "refresh",
                            "viewVersion",
                            "toAllocation"
                        ];
                    } else {
                        showBtn = [
                            "addGroup",
                            "commit",
                            "Attachment",
                            "union",
                            "print",
                            "printOut",
                            "refresh",
                            "toAllocation"
                        ];
                    }
                    props.button.setMainButton(['commit'], true);
                    break;
                case "0": //未通过态
                    showBtn = [
                        "addGroup",
                        "commit",
                        "union",
                        "approveDetail",
                        "fundPlan",
                        "voucher",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh",
                        "credit",
                        "toAllocation"
                    ];
                    if (+versionno > 1) {
                        showBtn = showBtn.concat(["viewVersion"]);
                    }
                    props.button.setMainButton(['commit'], true);
                    break;
                case "1": //通过态
                    showBtn = [
                        "add_n",
                        "union",
                        "approveDetail",
                        "fundPlan",
                        "voucher",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh",
                        "credit",
                        "financepayReceipt",
                        "toAllocation"
                    ];
                    if (busistatus == 1) {
                        showBtn = showBtn.concat(["termination", "change"]);
                    } else if (busistatus == 4) {
                        showBtn = showBtn.concat(["unTermination"]);
                    }
                    if(agentbankmgt) {
                        showBtn = showBtn.concat(["UnBookkeeping"]);
                    }else {
                        showBtn = showBtn.concat(["unCommit","Bookkeeping"]);
                        props.button.setMainButton(['Bookkeeping'], true);
                    }
                    if (+versionno > 1) {
                        showBtn = showBtn.concat([
                            "viewVersion",
                            "delete_version",
                            "toAllocation"
                        ]);
                    }
                    // 展期
                    if (busistatus !== "0" && busistatus !== "4") {
                        showBtn = showBtn.concat(["extension"]);
                    }
                    break;
                case "2": //进行中态
                    showBtn = [
                        "add_n",
                        "union",
                        "approveDetail",
                        "fundPlan",
                        "voucher",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh",
                        "credit",
                        "toAllocation"
                    ];
                    if (+versionno > 1) {
                        showBtn = showBtn.concat(["viewVersion"]);
                    }
                    break;
                case "3": //提交态
                    showBtn = [
                        "add_n",
                        "unCommit",
                        "union",
                        "approveDetail",
                        "fundPlan",
                        "voucher",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh",
                        "credit",
                        "toAllocation"
                    ];
                    if (+versionno > 1) {
                        showBtn = showBtn.concat(["viewVersion"]);
                    }
                    break;
                default:
                    break;
            }
              //控制重试按钮显示情况
            showErrBtn(props, { 
              headBtnCode: 'head',
              headAreaCode: this.formId ,
              fieldPK: this.primaryId 
           }); 
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
    //设置卡片头部状态
    if(this.props.getUrlParam("list") === "list"){
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn:true,
            showBillCode: this.billNo, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: this.billNo //修改单据号---非必传
        });
    }else if(this.props.getUrlParam("scene") === "approvesce" || this.props.getUrlParam("scene") === "linksce"){
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn:false,
            showBillCode: this.billNo, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: this.billNo //修改单据号---非必传
        });
    }else{
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn:
                isBrowse &&
                this.props.getUrlParam("scene") !== ("approvesce" && "linksce"), //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: this.billNo, //控制显示单据号：true为显示,false为隐藏 ---非必传
            billCode: this.billNo //修改单据号---非必传
        });
    }
	 //控制重试按钮显示情况
	showErrBtn(props, { 
	  headBtnCode: 'head',
	  headAreaCode: this.formId ,
	  fieldPK: this.primaryId 
   }); 
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/