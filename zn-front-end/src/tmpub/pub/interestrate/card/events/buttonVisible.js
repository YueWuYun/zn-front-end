/*2+0Qf+roUlDHXBeA/o9JMGpngx6mRLzeeckBoa7ZnDExoDpVCBk7Msmh7CDdTbDQ*/
import { CARD } from "../../cons/constant.js";

export function buttonVisible(props) {
    let status = props.getUrlParam("status");
    let id = props.getUrlParam("id");
    let scene = props.getUrlParam("scene");
    let isBrowse = status === "browse";
    let buttons = props.button.getButtons().map(item => item.key);
    let enablestate =
        props.form.getFormItemsValue(CARD.form_id, "enablestate") &&
        props.form.getFormItemsValue(CARD.form_id, "enablestate").value;
    let btnObj = {};
    let showBtn = [];
    let allBtns = [...buttons, "Add", "Edit", "Delete"];
    let disabledBtn = ["addRow", "deleteRow"];
    let bodyData = props.cardTable.getAllTabsData(CARD.tab_code);
    let versionRows = bodyData && bodyData.alter && bodyData.alter.rows.length;
    if (scene !== "linksce") {
        if (!isBrowse) {
            //编辑态
            showBtn = ["Save", "Cancel", "addRow", "deleteRow", "expand"];
        } else {
            //浏览态
            if (!id) {
                // 新增浏览态
                showBtn = ["Add"];
            } else {
                // 单据浏览态
                showBtn = [
                    "Add",
                    "Edit",
                    "Delete",
                    "createVersion",
                    "deleteVersion",
                    "Print",
                    "Preview",
                    "Output",
                    "Refresh"
                ];
                if (enablestate == 2) {
                    //已启用
                    showBtn.push("Disable");
                } else {
                    //未启用、已停用
                    showBtn.push("Enable");
                }
                if (versionRows > 1) {
                    showBtn.splice(showBtn.indexOf("Edit"), 1);
                }
            }
        }
    } else {
        showBtn = ["Print", "Output"];
    }
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }
    props.button.setButtonVisible(btnObj);
    props.button.setButtonDisabled(disabledBtn, true);
    props.cardTable.setStatus(CARD.tab_code, status);
    props.form.setFormStatus(CARD.form_id, status);
}

/*2+0Qf+roUlDHXBeA/o9JMGpngx6mRLzeeckBoa7ZnDExoDpVCBk7Msmh7CDdTbDQ*/