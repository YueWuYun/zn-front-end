/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/
import { LIST_TABLE_CODE, BTN_GROUP } from "./../../cons/constant";


export function buttonVisiable(props) {
    let selectdata = props.table.getCheckedRows(LIST_TABLE_CODE)

    if (!selectdata || selectdata.length == 0) {
		//没有选中
		props.button.setButtonDisabled([BTN_GROUP.PRINT, BTN_GROUP.PRINTGROUP, BTN_GROUP.OUTPUT], true);
	} else{
        props.button.setButtonDisabled([BTN_GROUP.PRINT, BTN_GROUP.PRINTGROUP, BTN_GROUP.OUTPUT], false);
    }

}


/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/