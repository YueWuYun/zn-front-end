//p7bROQGm5MUV3cPjY5sUADEzEpwROK2Odxvyq79lK2nGsy02ZHzevgmnF3KQ0xGedJMURmz7H0YM
//XIMiDoPW/A==
/*
 * @Author: 刘奇 
 * @PageInfo: 批量删除  
 * @Date: 2018-06-04 20:25:08 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-02-14 14:04:35
 */
import { ajax } from 'nc-lightapp-front';
import { URL } from '../../constance';
import { showSuccessInfo, showDeleteDialog, showWarningInfo } from '../../../pub/tool/messageUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { onRow_BtnClick, calculateShowIndexUtil } from './index.js';
export default function batchDelete_BtnClick(props) {
	let data = props.editTable.getCheckedRows(this.headTableid);
	if (data.length == 0) {
		showWarningInfo(null, getLangByResId(this, '1014QUALITYLEVEL-000001')); /* 国际化处理： 提示,请选择要删除的行！*/
		return;
	}
	showDeleteDialog({
		beSureBtnClick: beSureBtnClick.bind(this, props, data)
	});
}

function beSureBtnClick(props, data) {
	let this_ = this;
	let pks = new Array();
	let indexArr = new Array();
	let endIndex = 0;
	for (let i = 0; i < data.length; i++) {
		pks.push(data[i].data.values.pk_qualitylv.value);
		indexArr.push(data[i].index);
		if (i == data.length - 1) {
			endIndex = data[i].index;
		}
	}
	let olddata = props.editTable.getAllRows(this.headTableid);
	let newdata = olddata.filter((item) => {
		return item.status != 3;
	});
	let showIndex = calculateShowIndexUtil(newdata.length, indexArr.length, endIndex);
	ajax({
		url: URL.delete,
		data: {
			pks
		},
		success: (res) => {
			setTimeout(() => {
				props.editTable.deleteTableRowsByIndex(this_.headTableid, indexArr, false);
				let olddata = props.editTable.getAllRows(this_.headTableid);
				let newdata = olddata.filter((item) => {
					return item.status != 3;
				});
				newdata.forEach((item) => {
					if (item.status != 3) {
						item.status = 0;
					}
				});
				let newdatas = { rows: newdata };
				props.editTable.setTableData(this_.headTableid, newdatas);
				// 调用平台api过滤显示数据
				this.props.editTable.setFiltrateTableData(
					this_.headTableid,
					[ 'cqlgroupcode', 'cqlgroupname' ],
					this_.state.value
				);
				if (showIndex >= 0) {
					props.editTable.focusRowByIndex(this_.headTableid, showIndex);
					onRow_BtnClick.call(this_, props, null, null, showIndex);
				} else {
					props.editTable.setTableData(this_.bodyTableid, { rows: [] });
				}
				showSuccessInfo(getLangByResId(this_, '1014QUALITYLEVEL-000002')); /* 国际化处理： 删除成功*/
			}, 10);
		}
	});
}

//p7bROQGm5MUV3cPjY5sUADEzEpwROK2Odxvyq79lK2nGsy02ZHzevgmnF3KQ0xGedJMURmz7H0YM
//XIMiDoPW/A==