//90M3JO9LN/wu8UUle6B0EVHw/d07aRl1a3yKLSP3+y6MXQPgYyPV+HeH9TkSEcLw
/*
 * @Author: zhaopym 
 * @Date: 2019-03-19 16:22:39 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-10 13:38:20
 */
import { togglePageStatus } from '../../viewController';
import { STATUS, AREA, PAGECODE } from '../../constants';
import { ajax } from 'nc-lightapp-front';
import { getBillGridData } from '../common';
import { updateEditTableRows } from '../util';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { setBodyData2Cache } from '../common';
import { showSuccessInfo } from '../util/messageUtil';

function save(props) {
	//保存数据
	let saveData = getBillGridData.call(this, props, PAGECODE, AREA.table_head, AREA.table_body, 'editTable');
	if (!saveData) {
		return;
	}
	props.validateToSave(
		saveData,
		() => {
			ajax({
				url: this.saveAction,
				method: 'post',
				data: saveData,
				success: (res) => {
					console.log(res);
					if (res.success) {
						if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
							props.dealFormulamsg(res.formulamsg);
						}
						let data = res.data[0];
						let headUpdateRows = data.head.table_head.rows;
						let bodyUpdateRows = data.body.table_body.rows;
						updateEditTableRows(props, AREA.table_head, headUpdateRows);
						updateEditTableRows(props, AREA.table_body, bodyUpdateRows);
						setBodyData2Cache(bodyUpdateRows);
						togglePageStatus.call(this, props, STATUS.browse);
						showSuccessInfo(getLangByResId(this, '4004PRICETEMPLET-000006'));/* 国际化处理： 保存成功*/
					}
				}
			});
		},
		null,
		'billGrid'
	);
}

export { save };

//90M3JO9LN/wu8UUle6B0EVHw/d07aRl1a3yKLSP3+y6MXQPgYyPV+HeH9TkSEcLw