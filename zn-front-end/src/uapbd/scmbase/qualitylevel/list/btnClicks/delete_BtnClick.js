//09MFRu7iSOlVV+xuGkFYf+Kxon5twdX+wzZcn4qLSWNjW4HRye5rD44Ez2CCXu4d
/*
 * @Author: 刘奇 
 * @PageInfo: 表头行删除按钮  
 * @Date: 2018-06-04 16:58:28 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-02-14 14:04:05
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, STATUS } from '../../constance';
import { showSuccessInfo } from '../../../pub/tool/messageUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { btnVisible_BtnClick, onRow_BtnClick, calculateShowIndexUtil } from './index.js';
export default function delete_BtnClick(props, index) {
	//获得当前行pk传入后台删除
	let pks = new Array();
	if (props.editTable.getStatus(AREA.headTableArea) === STATUS.edit) {
		props.editTable.deleteTableRowsByIndex(AREA.headTableArea, index);
		return;
	} else {
		if (index != undefined) {
			let pk = props.editTable.getValByKeyAndIndex(AREA.headTableArea, index, 'pk_qualitylv').value;
			pks.push(pk);
		} else {
			let data = props.editTable.getCheckedRows(AREA.headTableArea);
			if (data.length == 0) return;
			for (let i = 0; i < data.length; i++) {
				pks.push(data[i].data.values.pk_qualitylv.value);
			}
		}
	}
	let olddata = props.editTable.getAllRows(this.headTableid);
	let newdata = olddata.filter((item) => {
		return item.status != 3;
	});
	let showIndex = calculateShowIndexUtil(newdata.length, 1, index);
	ajax({
		url: URL.delete,
		data: {
			pks
		},
		success: (res) => {
			setTimeout(() => {
				props.editTable.deleteTableRowsByIndex(AREA.headTableArea, index, false);
				let olddata = props.editTable.getAllRows(AREA.headTableArea);
				let newdata = olddata.filter((item) => {
					return item.status != 3;
				});
				newdata.forEach((item) => {
					if (item.status != 3) {
						item.status = 0;
					}
				});
				let newdatas = { rows: newdata };
				props.editTable.setTableData(AREA.headTableArea, newdatas);
				// 调用平台api过滤显示数据
				this.props.editTable.setFiltrateTableData(
					this.headTableid,
					[ 'cqlgroupcode', 'cqlgroupname' ],
					this.state.value
				);
				btnVisible_BtnClick.call(this, props);
				if (showIndex >= 0) {
					props.editTable.focusRowByIndex(AREA.headTableArea, showIndex);
					onRow_BtnClick.call(this, this.props, null, null, showIndex);
				} else {
					props.editTable.setTableData(AREA.bodyTableArea, { rows: [] });
				}
				showSuccessInfo(getLangByResId(this, '1014QUALITYLEVEL-000002')); /* 国际化处理： 删除成功*/
			}, 0);
		}
	});
}

//09MFRu7iSOlVV+xuGkFYf+Kxon5twdX+wzZcn4qLSWNjW4HRye5rD44Ez2CCXu4d