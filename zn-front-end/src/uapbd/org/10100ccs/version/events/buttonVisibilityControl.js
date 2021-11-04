//QhnyH40BuRyQ8lRkFYF/oX7lBRKRcbeXNYbkiN2r5G5RU+78M+D3X/wYvVCQKZ1DSVOW8dTVuWEP
//CY6+8bxbRw==
import { LIST, LIST_BUTTON ,CARD,CARD_BUTTON} from '../../constant';

/**
* @description: 卡片按钮可见性
*/
export function buttonVisibilityControl(props) {
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status !== 'edit';
    //单据状态
    // let busistatus = props.form.getFormItemsValue(CARD.form_id, 'busistatus') && props.form.getFormItemsValue(CARD.form_id, 'busistatus').value;

    let btnObj = {};
    //将要显示的按钮
    let showBtn = [];
    //禁用的按钮
    // let disabledBtn = [LIST.deleteRow];
    //编辑态显示按钮
    let editBtn = [CARD_BUTTON.saverow,CARD_BUTTON.cancel];
    //浏览态显示按钮
    let commonBtn = [CARD_BUTTON.addrow,CARD_BUTTON.delrow,CARD_BUTTON.updaterow];
    //获得所有按钮编码（但此处不包括按钮组下的按钮）
    let buttons = props.button.getButtons().map(item => item.key);
    //(有重复的按钮编码，但无妨)
    let allBtns = [...buttons, ...editBtn,...commonBtn];
    if (!isBrowse) { //编辑态

        showBtn = editBtn;

    } else { //浏览态
            showBtn = [LIST_BUTTON.vcard, LIST_BUTTON.bodyUpdate, LIST_BUTTON.bodyDelete,LIST_BUTTON.centergroup, ...commonBtn];
    }
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }
    props.button.setButtonVisible(btnObj);
    // props.button.setButtonDisabled(disabledBtn, true);
    props.editTable.setStatus(CARD.version_table, status);
}

//QhnyH40BuRyQ8lRkFYF/oX7lBRKRcbeXNYbkiN2r5G5RU+78M+D3X/wYvVCQKZ1DSVOW8dTVuWEP
//CY6+8bxbRw==