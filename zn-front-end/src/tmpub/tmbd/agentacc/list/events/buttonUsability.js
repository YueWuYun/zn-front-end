/*+82KJqjMRCIvmhqpjXmmkN1wwwryY7YkhVFPwVt1YoMafDz9Pei48NJ4kMmDw9II*/
// 引入常量
import { list_table_id } from "../../cons/constant";//配置的id和area信息

export default function buttonUsability(props, status) {

    let tableId = list_table_id;
	let selectData = props.table.getCheckedRows(tableId);
    let buttonArr = ['Print', 'PrintGroup', 'Output'];

    if (status === 'init' || selectData.length === 0) {
        buttonArr.push('Delete');
        props.button.setButtonDisabled(buttonArr, true);
    }
    else if (selectData.length === 1) {
        props.button.setButtonDisabled(['Delete'], true);
        if (selectData[0].data.values.billstatus.value == '0') {
            buttonArr.push('Delete');
        }
        props.button.setButtonDisabled(buttonArr, false);
    }
    else if (selectData.length > 1) {
        buttonArr.push('Delete');
        props.button.setButtonDisabled(buttonArr, false);
    }
}

/*+82KJqjMRCIvmhqpjXmmkN1wwwryY7YkhVFPwVt1YoMafDz9Pei48NJ4kMmDw9II*/