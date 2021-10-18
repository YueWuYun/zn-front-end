/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/
import { card_table_id
} from '../../cons/constant.js';

export default function clickBtn(props) {
	let selectdata = props.table.getCheckedRows(card_table_id);
	let status = props.getUrlParam('status');
	if (!selectdata || selectdata.length == 0) {
		props.button.setButtonDisabled([   
			// 删除行 复制行
			'delline', 'copyline',
		], true);
	} else if (selectdata.length == 1) {
		if (status === 'decide' || status === 'browse'){
			props.button.setButtonDisabled([   
				// 删除行 复制行
				'delline', 'copyline',
			], true);
		}else{
			props.button.setButtonDisabled([   
				// 删除行 复制行
				'delline', 'copyline',
			], false);
		}
	} else {
		if (status === 'decide' || status === 'browse'){
			props.button.setButtonDisabled([   
				// 删除行 复制行
				'delline', 'copyline',
			], true);
		}else{
			props.button.setButtonDisabled([   
				// 删除行 复制行
				'delline', 'copyline',
			], false);
		}
	}
}

/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/