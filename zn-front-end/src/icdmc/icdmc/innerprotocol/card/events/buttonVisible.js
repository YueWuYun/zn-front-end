/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
/**
 * 内贷还本-卡片按钮显隐性控制
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
    let { isPaste } = this.state;
    let status = props.getUrlParam("status");
    let id = props.getUrlParam("id");
    if (!id) {
        id = this.cacheId;
    }
    let isBrowse = status === "browse";
    let buttons = props.button.getButtons();
    let vbillstatus =
        props.form.getFormItemsValue(this.formId, "vbillstatus") &&
        props.form.getFormItemsValue(this.formId, "vbillstatus").value;//审批状态
    let protocolstatus =
        props.form.getFormItemsValue(this.formId, "protocolstatus") &&
        props.form.getFormItemsValue(this.formId, "protocolstatus").value;//协议状态
    let versionorigin =
        props.form.getFormItemsValue(this.formId, "versionorigin") &&
        props.form.getFormItemsValue(this.formId, "versionorigin").value;//版本来源
    let isinherit =
        props.form.getFormItemsValue(this.formId, "isinherit") &&
        props.form.getFormItemsValue(this.formId, "isinherit").value;//被继承
    let versionno =
        props.form.getFormItemsValue(this.formId, "versionno") &&
        props.form.getFormItemsValue(this.formId, "versionno").value;//版本号
    let btnObj = {};
    let showBtn = [];
    if (!isBrowse) {
        //编辑态
        if (!isPaste) {
            //编辑态
            if (status == "change") {
                //变更
                showBtn = [
                    "saveGroup",
                    "cancel",
                    'tabsgroup',
                    "cela",
                    "insertRow",
                    "delRow"
                ];
                showBtn = showBtn.concat(["fold", "unfold"]);//展开收起
            } else {
                //没有点击表体肩部复制按钮
                showBtn = [
                    "saveGroup",
                    "cancel",
                    "addRow",
                    "deleteRow",
                    "cela",
                    "insertRow",
                    "delRow",
                    "tabsgroup",
                    "copyRow"
                ];
            }

        } else if (props.getUrlParam("pageType") == "version") {
            showBtn = [];
        } else {
            //点击了表体肩部复制按钮
            showBtn = [
                "saveGroup",
                "tabsgroup",
                "cancel",
                "cela",
                "copyLastLine",
                "copyAtLine",
                "cancelRow"
            ];
        }
    } else {
        //浏览态
        if (!id) {
            //无id:新增浏览态
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
                        "viewVersion",
                        "refresh"
                    ];
                    props.button.setMainButton(['commit'], true);//按钮高亮:提交
                    if(+versionno>1)
                    props.button.setButtonVisible(["delete"], false);
                    break;
                case "0": //未通过态
                    showBtn = [
                        "addGroup",
                        "commit",
                        "union",
                        "viewVersion",
                        "approveDetail",
                        "Attachment",
                        "print",
                        "access",
                        "printOut",
                        "refresh"
                    ];
                    break;
                case "1": //通过态
                    showBtn = [
                        "add_n",
                        "unCommit",
                        "union",
                        "viewVersion",
                        "approveDetail",
                        "access",
                        "access_n",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
                    break;
                case "2": //进行中态
                    showBtn = [
                        "add_n",
                        "union",
                        "viewVersion",
                        "approveDetail",
                        "access",
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
                        "viewVersion",
                        "approveDetail",
                        "access",
                        "Attachment",
                        "print",
                        "printOut",
                        "refresh"
                    ];
                    break;
                default:
                    break;
            }
            showBtn = showBtn.concat(["fold", "unfold"]);//展开收起
             //协议状态为在执行，已结束，已冻结不允许收回弃审
            if(protocolstatus =='EXECUTING'||protocolstatus =='FINISHED'||protocolstatus =='FROZEN'){
                let  index = showBtn.indexOf('unCommit');
                if(index>-1){
                    showBtn.splice(index, 1);
                }
            }
        }
    }
    // for循环的目的是拼接成{a: true, b: false, ...}, 来控制按钮的显隐性
    for (let item of buttons) {
        btnObj[item.key] = showBtn.includes(item.key);
    }
    props.button.setButtonVisible(btnObj);
    props.cardTable.setStatus(this.tabCode, isBrowse ? "browse" : "edit");
    props.form.setFormStatus(this.formId, isBrowse ? "browse" : "edit");
    //表体是否点击肩部复制按钮
    if (!isBrowse) {
        //非浏览态
        if (!isPaste) {
            //没有点击复制行
            props.button.setButtonVisible(["deleteRow", "addRow", "copyRow"], true);
            props.button.setButtonVisible(["cancelRow", "copyLastLine"], false);
            props.button.setButtonDisabled(["deleteRow", "addRow"], false);
            if (status == "change") {
                //变更不需要新增等按钮
                props.button.setButtonVisible(["addRow", "deleteRow", "copyRow", "copyLastLine", "cancelRow"], false);
            }
        } else {
            //点击复制行
            props.button.setButtonVisible(["deleteRow", "addRow", "copyRow"], false);
            props.button.setButtonVisible(["cancelRow", "copyLastLine"], true);
        }
    } else {
        //浏览态
        props.button.setButtonVisible(["addRow", "deleteRow", "copyRow", "copyLastLine", "cancelRow"], false);
        //变更按钮控制显示
        if (vbillstatus == '-1') {
            //审批状态是自由态不显示变更
            props.button.setButtonVisible(["change"], false);
        }
        //删除版本按钮控制显示
        //2004-需求变更：变更后的协议什么情况下都可以删除，后台判断下是否又被合同引用就行了。
        if (versionorigin && versionorigin == 'CHANGE') {
            props.button.setButtonVisible(["delete_version"], true);
        } else {
            props.button.setButtonVisible(["delete_version"], false);
        }
        //结束/取消结束/冻结/取消冻结按钮控制
        if (protocolstatus) {
            //1-先设置辅助功能里面显示按钮
            props.button.setButtonVisible([
                "termination",
                "unTermination",
                "frozen",
                "unFrozen",
                "change"], true);
            //2-分别控制辅助功能里面按钮不显示
            if (protocolstatus != 'EXECUTING') {
                props.button.setButtonVisible(["termination"], false);
                props.button.setButtonVisible(["frozen"], false);
                props.button.setButtonVisible(["change"], false);
            }
            if (vbillstatus != '1') {
                props.button.setButtonVisible(["termination"], false);
            }
            if (vbillstatus == '-1') {
                props.button.setButtonVisible(["frozen","change"], false);
            }
            if (protocolstatus != 'FINISHED' || isinherit) {
                props.button.setButtonVisible(["unTermination"], false);
            }
            if (protocolstatus != 'FROZEN') {
                props.button.setButtonVisible(["unFrozen"], false);
            }
        }
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
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/