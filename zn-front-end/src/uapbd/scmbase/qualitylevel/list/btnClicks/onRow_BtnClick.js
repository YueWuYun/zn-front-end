//q8JmqX4zMpy0knXi3mYlriUhIrygcbtkuPUAG1VMnhMwt3pclEoz/Tzqsd/FNakz
/*
 * @Author: 刘奇 
 * @PageInfo: 选择表头行时查询对应表体数据  
 * @Date: 2018-06-06 20:07:17 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2018-11-16 09:38:21
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, STATUS, URL } from '../../constance';
export default function onRow_BtnClick(props, moduleId, record, index) {
	if (props.editTable.getStatus(AREA.headTableArea) === STATUS.edit) {
		props.editTable.focusRowByIndex(AREA.headTableArea, this.selectIndex);
		return;
	}
	setTimeout(() => {
		let pk = null;
		if (record != null) {
			pk = record.values.pk_qualitylv.value;
		} else {
			// let olddata = props.editTable.getAllRows(AREA.headTableArea);
			// let newdata = olddata.filter((item) => {
			// 	return item.status != 3;
			// });
			let newdata = props.editTable.getVisibleRows(AREA.headTableArea, false, true);
			pk = newdata[index].values.pk_qualitylv.value;
		}
		ajax({
			url: URL.queryBody,
			data: pk,
			success: (res) => {
				if (res.data === undefined || res.data.body === undefined) {
					props.editTable.setTableData(AREA.bodyTableArea, { rows: [] });
				} else {
					props.editTable.setTableData(AREA.bodyTableArea, res.data.body[AREA.bodyTableArea]);
				}
			}
		});
	}, 10);
}

//q8JmqX4zMpy0knXi3mYlriUhIrygcbtkuPUAG1VMnhMwt3pclEoz/Tzqsd/FNakz