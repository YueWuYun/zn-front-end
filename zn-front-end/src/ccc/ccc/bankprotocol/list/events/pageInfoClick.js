/*j07c8riwYnz20MYibuDbtLtYDzDh5/3TYE+7BUV7YYXXT2alYF9L1OVpli5DZfc3*/
import { ajax } from 'nc-lightapp-front';
import { ACTION_URL } from '../../constant/constant.js';

export default function(props, config, pks) {
	if (pks == null || pks.length == 0) {
		return;
	}
	let pageInfo = props.table.getTablePageInfo(this.tableId);
	let data = {
		pks: pks,
		pageCode: this.pageId
	};
	let that = this;
	ajax({
		url: ACTION_URL.PAGEQUERY,
		data: data,
		success: function(res) {
			props.table.setAllTableData(that.tableId, res.data.grid[that.tableId]);
		}
	});
}

/*j07c8riwYnz20MYibuDbtLtYDzDh5/3TYE+7BUV7YYXXT2alYF9L1OVpli5DZfc3*/