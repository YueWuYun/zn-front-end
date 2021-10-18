/*BJzpvOTxrU0V69KiBNXco+OqPRHxvvBNmJyzHgSWk/Bl7nCSmHw/MkSfVOFkLeZB*/
import { ajax, base, toast, cardCache } from 'nc-lightapp-front';


export function bobyButtonClick(that, props, key, text, record, index) {
    switch (key) {
        // 表格操修改
        case innerButton.open_browse:
            props.cardTable.toggleRowView(tableId, record);
            break;
        case innerButton.open_edit:
            props.cardTable.openModel(tableId, 'edit', record, index);
            break;
        case innerButton.Copy_inner://复制行
            copyInner(record, dataSource,that);
            
            break;
        case innerButton.Insert_inner://插入行
            
            break;
        case innerButton.Delete_inner://删行
            deleteInner(that, props, tableId, index);
           
            break;
        case innerButton.Paste_inner://粘贴至此
            pasteInner(that, props, dataSource, tableId, index)
            break;
        default:
            break;
    }
};

/*BJzpvOTxrU0V69KiBNXco+OqPRHxvvBNmJyzHgSWk/Bl7nCSmHw/MkSfVOFkLeZB*/