/*2+0Qf+roUlDHXBeA/o9JMGpngx6mRLzeeckBoa7ZnDExoDpVCBk7Msmh7CDdTbDQ*/
import { ajax, base, toast } from "nc-lightapp-front";

/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
    let { isPaste } = this.state;
    let status = props.getUrlParam("status");
    let scene = this.props.getUrlParam("scene");
    let id = props.getUrlParam("id");
    let isBrowse = status === "browse";
    let buttons = props.button.getButtons();
    let enablestate =
        props.form.getFormItemsValue(this.formId, "enablestate") &&
        props.form.getFormItemsValue(this.formId, "enablestate").value;
    let btnObj = {};
    let showBtn = ["Print", "Output"];
    if (scene !== "linksce") {
        if (!isBrowse) {
            //编辑态
            if (!isPaste) {
                showBtn = [
                    "Button_Group",
                    "Save",
                    "Cancel",
                    // "Table_Group",
                    "copy",
                    "insert",
                    "delete"
                ];
            } else {
                showBtn = [
                    "Button_Group",
                    "Save",
                    "Cancel",
                    "cancel",
                    "copyLastRow",
                    "copyThisRow"
                ];
            }
        } else {
            //浏览态
            if (!id) {
                //新增浏览态
                showBtn = ["Add_addBrowse"];
            } else {
                //单据浏览态
                switch (enablestate) {
                    case "0": //启用
                        showBtn = [
                            "AddGroup",
                            "Add",
                            "Edit",
                            "Delete",
                            "Stop",
                            "Refresh",
                            ...showBtn
                        ];
                        break;
                    case "1": //停用
                        showBtn = [
                            "AddGroup",
                            "Add",
                            "Edit",
                            "Delete",
                            "Start",
                            "Refresh",
                            ...showBtn
                        ];
                        break;
                }
            }
        }
    }
    for (let item of buttons) {
        btnObj[item.key] = showBtn.includes(item.key);
    }

    props.button.setButtonVisible(btnObj);
    props.form.setFormStatus(this.formId, isBrowse ? "browse" : "edit");
    props.cardTable.setStatus(this.tableId, isBrowse ? "browse" : "edit");
}

/*2+0Qf+roUlDHXBeA/o9JMGpngx6mRLzeeckBoa7ZnDExoDpVCBk7Msmh7CDdTbDQ*/