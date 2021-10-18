/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/
// 引入常量
import { list_table_id } from "../../cons/constant";//配置的id和area信息

export default function buttonUsability(props, status) {

	let selectData = props.table.getCheckedRows(list_table_id);

    if (status === 'init' || selectData.length === 0) {
        props.button.setButtonDisabled(['Delete', 'Sign'], true);
    }
    else if (selectData.length === 1) {
        props.button.setButtonDisabled(['Delete', 'Sign'], false);
    }
    else if (selectData.length > 1) {
        props.button.setButtonDisabled(['Delete', 'Sign'], true);
    }
}

/*+82KJqjMRCIvmhqpjXmmkKkDdhNWoDZHLgCU73FN8AnbigMzT5sDB4TOfOIfnfLt*/