/**hanzhhm
 * 用于控制按钮
 * 按钮命名需要规范
 * 列表行必须是list_inner_area
 * 卡片行必须是card_inner_area
 */

//卡片界面空白可操作按钮
let cardTrueBtn=['Add','AddGroup'];

//列表界面未选中可操作按钮
let listTrueBtn=['Add','ImportData','ImportExportMenu','Refresh'];

/**
 * 
 * @param {*} that 
 * @param {*} data 表头区域数据
 * @param {*} id 当前按钮key
 * @param {*} type list 代表列表，card代表卡片
 */
let buttonVisible = function(that,data,id,type){
    let flag = true;
    let status = that.props.getUrlParam('status');
    if (!status) {
        status = 'browse'//默认status为browse
    }
    if(status == 'copy'){
        status == 'add'
    }
    if(!data ||!(data.pk_org ? data.pk_org.value : null)&& status == 'browse'){
        if(type == 'list'){
            if (listTrueBtn.indexOf(id) != -1) {
                return true;
            } else {
                return false;
            }
        }else{
            if (cardTrueBtn.indexOf(id) != -1) {
                return true;
            } else {
                return false;
            }      
        }
    }
    switch (id) {
        case 'Add'://新增
            if (status != 'browse') {
                flag = false;
            }
            break;
        case 'Edit'://修改
            if (status != 'browse') {
                flag = false;
            }
            break;
        case 'Copy'://复制
            if (status != 'browse') {
                flag = false;
            }
            break;
        case 'Delete'://删除
            if (status != 'browse') {
                flag = false;
            }
            break;
        case 'Refresh'://刷新
            if (status != 'browse') {
                flag = false;
            }
            break;
        case 'Save'://保存
            if (status == 'browse') {
                flag = false;
            }
            break;
        case 'Cancel'://取消
            if (status == 'browse') {
                flag = false;
            }
            break;
        case 'ImportData'://导入
            if (status != 'browse') {
                flag = false;
            }
            break;
        case 'ExportData'://导出
            if (status != 'browse') {
                flag = false;
            }
            break;
        case 'Print'://打印
            if (status != 'browse') {
                flag = false;
            }
            break;
        case 'Preview'://预览
            if (status != 'browse') {
                flag = false;
            }
            break;
        case 'Output'://输出
            if (status != 'browse') {
                flag = false;
            }
            break;
        case 'BillLinkQuery'://联查
            if (status != 'browse') {
                flag = false;
            }
            break;
            
        /**
         * 以下是肩部按钮
         */
        case 'AddLine'://增行
            if (status == 'browse' ) {
                flag = false;
            }
            break;
        case 'DelLine'://删除行
            if (status == 'browse' ) {
                flag = false;
            }
            break;
        case 'CopyLine'://复制行
            if (status == 'browse' ) {
                flag = false;
            }
            break;
        case 'PasteToEndLine'://粘行到末尾
                flag = false;
            break;
        case 'CancelLine'://肩部取消
                flag = false;
            break;
        default:
            break;    
    }
    return flag;

}


/**单据列表对按钮的控制 */
let onListButtonControl = function(that){
    let selectedData = that.props.table.getCheckedRows(that.tableId);
    if (selectedData.length == 1) {
        dealButtons(selectedData[0].data.values,that);
    } else if (selectedData.length > 1) {
        that.props.button.setButtonDisabled(that.Info.allButtonsKey, false);
    } else {
        dealButtons(null,that);
    }
}

let dealButtons = (record,that) => {
    let trueBtn = []; //可见的按钮
    let falseBtn = []; //不可见的按钮
    for (let i = 0; i < that.Info.allButtonsKey.length; i++) {
        let flag = buttonVisible(that, record, that.Info.allButtonsKey[i],'list');
        if (flag) {
            trueBtn.push(that.Info.allButtonsKey[i]);
        } else {
            falseBtn.push(that.Info.allButtonsKey[i]);
        }
    }
    that.props.button.setButtonDisabled(trueBtn, false);
    that.props.button.setButtonDisabled(falseBtn, true);
};



/**
 * 卡片点击行
 * 浏览态控制按钮状态,主要控制挂起，取消挂起和预收付按钮
 * 编辑态控制按钮状态
 */
let onSelectedCardBodyEditControl = function(that){
    let status = that.props.getUrlParam('status');
    if (!status) {
        status = 'browse';
    }
    if (status == 'browse') {//浏览态
       
    } else {//编辑态
        let head = that.props.createMasterChildData(that.pageId, that.formId, that.tableId)
            .head[that.formId];
        let cardhead = head.rows[0].values;
        let pk_org = cardhead.pk_org ? cardhead.pk_org.value : null;
        if (pk_org) {
            let selectedData = that.props.cardTable.getCheckedRows(that.tableId);
            if (selectedData.length > 0) {
                that.props.button.setButtonDisabled(['CopyLine', 'DelLine'], false);
            } else {
                that.props.button.setButtonDisabled(['CopyLine', 'DelLine'], true);
            }
        } else {
            //pk_org不存在的时候，不做行按钮的处理
        }
    }
}

/**
 * 
 * @param {*} status 当前表格状态
 * @param {*} buttonfalg 当前点击按钮之后改变的状态，用于判断显示那些按钮
 * @param {*} clickindex 当前点击的行
 * @param {*} index 行序号
 */
let cardBodyAndInnerButtonVisible = function (that, buttonfalg,clickindex,index) {
    let tableStatus = that.props.cardTable.getStatus(that.tableId);
    if(index == clickindex && tableStatus =='browse'){
        return ['Close_inner'];
    }else if (tableStatus == 'browse') {
        return ['Open_inner'];//浏览态只有弹窗编辑
    } else if (tableStatus == 'edit') {
        if (buttonfalg == true) {//true
            return ['OpenEdit_inner', 'Copy_inner', 'Insert_inner', 'Delete_inner']
        } else if (buttonfalg == false) {//false
            return ['Paste_inner']
        } else {
            return [];
        }
    } else {
        return [];
    }

}

/**初始化卡片行的控制，主要是增行等按钮的控制 */
let initCardBodyEditControl = function (props , pk_org){
    if(!pk_org){
        props.button.setButtonDisabled(['AddLine','CopyLine', 'DelLine'], true);
    }else{
        props.button.setButtonDisabled(['AddLine'], false);
        props.button.setButtonDisabled(['CopyLine', 'DelLine'], true);
    }
}

/**
 * 卡片表体行按钮的控制
 * @param {*} props 
 * @param {*} buttonfalg 
 */
let cardBodyControl = function (props, buttonfalg) {
    props.button.setButtonVisible(['PasteToEndLine', 'CancelLine'], !buttonfalg);
    props.button.setButtonVisible(['CopyLine', 'DelLine', 'AddLine'], buttonfalg);
}

//获取到所有的btn
//inBtn 传入的按钮
//outBtenKey 所有的不属于行按钮的key
let getButtonsKey = function (inBtn, outBtnKey) {
    for (let i = 0; i < inBtn.length; i++) {
        if (inBtn[i].area != 'list_inner_area' && inBtn[i].area != 'card_inner_area') {
            if (inBtn[i].children.length == 0) {
                outBtnKey.push(inBtn[i].key);
            } else {
                outBtnKey.push(inBtn[i].key);
                getButtonsKey(inBtn[i].children, outBtnKey);
            }
        }
    }
    return outBtnKey;
}

//获取所有的inner
let getInnerButtonkey = function (buttons) {
    let innerButtons = [];
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].area == 'list_inner_area' || buttons[i].area == 'card_inner_area') {
            innerButtons.push(buttons[i].key)
        }
    }
    return innerButtons;

}

export {getButtonsKey,getInnerButtonkey,initCardBodyEditControl,cardBodyControl,
    cardBodyAndInnerButtonVisible,onSelectedCardBodyEditControl,buttonVisible,onListButtonControl}