//QhnyH40BuRyQ8lRkFYF/oX7lBRKRcbeXNYbkiN2r5G5RU+78M+D3X/wYvVCQKZ1DSVOW8dTVuWEP
//CY6+8bxbRw==
import { LIST, LIST_BUTTON } from '../../constant';

/**
* @description: 卡片按钮可见性
*/
export function buttonVisibilityControl(props) {
    console.log("buttonVisibilityControl");
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    if(!status){
        status = 'browser'
    }
    let isBrowse = status !== 'edit';
    //单据状态
    // let busistatus = props.form.getFormItemsValue(CARD.form_id, 'busistatus') && props.form.getFormItemsValue(CARD.form_id, 'busistatus').value;

    let btnObj = {};
    //将要显示的按钮
    let showBtn = [];
    //禁用的按钮
    // let disabledBtn = [LIST.deleteRow];
    //编辑态显示按钮
    let editBtn = [LIST_BUTTON.Save,LIST_BUTTON.cancel,LIST_BUTTON.bodyDelete];
    //浏览态显示按钮
    let commonBtn = [LIST_BUTTON.create,LIST_BUTTON.vcard,LIST_BUTTON.refresh];//新增版本化，刷新
    //获得所有按钮编码（但此处不包括按钮组下的按钮）
    let buttons = props.button.getButtons().map(item => item.key);
    //(有重复的按钮编码，但无妨)
    let allBtns = [...buttons, ...editBtn,...commonBtn];
    if (!isBrowse) { //编辑态
        showBtn = editBtn;
    } else { //浏览态

            // switch (busistatus) {
            //             //     case '0':	//待提交
            //             //         showBtn = [CARD_BUTTON.create, CARD_BUTTON.update, CARD_BUTTON.delete, ...commonBtn];
            //             //         break;
            //             //     default:
            //             //         showBtn = [CARD_BUTTON.create, ...commonBtn];
            //             //         break;
            //             // }
            //showBtn = [LIST_BUTTON.vcard, LIST_BUTTON.bodyUpdate, LIST_BUTTON.bodyDelete,LIST_BUTTON.centergroup, ...commonBtn];
            showBtn = [
                LIST_BUTTON.create,
                LIST_BUTTON.Copy,
                LIST_BUTTON.vcard,
                LIST_BUTTON.refresh,
                LIST_BUTTON.bodyUpdate,
                LIST_BUTTON.bodyDelete,
                LIST_BUTTON.centergroup,
                LIST_BUTTON.factorgroup
            ] ;
    }
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }
    props.button.setButtonVisible(btnObj);
    // props.button.setButtonDisabled(disabledBtn, true);
    props.editTable.setStatus(LIST.table_id, status);
}

//QhnyH40BuRyQ8lRkFYF/oX7lBRKRcbeXNYbkiN2r5G5RU+78M+D3X/wYvVCQKZ1DSVOW8dTVuWEP
//CY6+8bxbRw==