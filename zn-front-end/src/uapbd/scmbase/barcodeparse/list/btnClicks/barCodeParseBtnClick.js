//BOU8e2Amw4z6OzjXOmkJKEK+aByBad2UyYKSFL5L2R4Pm8Ef59WVLTIrvBVc0csMCpzaT6dW8YB6
//pm28cHSEEA==
/*
 * @Author: qiaobb 
 * @PageInfo: 条形码解析  
 * @Date: 2019-03-26 19:21:17 
 * @Last Modified by: qiaobb
 * @Last Modified time: 2019-07-09 10:21:30
 */

import { ajax } from 'nc-lightapp-front';
import { URL, AREA } from '../../constance';
import { onRow_BtnClick, calculateShowIndexUtil } from './index.js';
import { showErrorInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
export default function(props) {
	let data = props.editTable.getCheckedRows(AREA.tableArea);
	let pk_stock = (this.state.mainorg || {}).refpk;
	if (!pk_stock) {
		showErrorInfo(null, getLangByResId(this, '4017BARCODEPARSE-000000')); /* 国际化处理： 请先选择主组织*/
		return;
	}
	let vbarcode = [];
	let olddata = [];
	for (let i = 0; i < data.length; i++) {
		vbarcode.push(data[i].data.values.vbarcode.value);
		olddata.push({ index: data[i].index, vbarcode: data[i].data.values.vbarcode.value });
	}

	ajax({
		url: URL.parse,
		data: {
			pk_stock: pk_stock,
			vbarcode: vbarcode
		},
		success: (res) => {
			let updateData = [];
			let newdata = res.data.head.rows;
			newdata.forEach((row) => {
				for (let index = 0; index < olddata.length; index++) {
					const oldobj = olddata[index];
					if (oldobj.vbarcode == row.values.vbarcode.value) {
						updateData.push({
							index: oldobj.index,
							data: { values: row.values }
						});
					}
				}
			});
			props.editTable.updateDataByIndexs(AREA.tableArea, updateData);
		}
	});
}

//BOU8e2Amw4z6OzjXOmkJKEK+aByBad2UyYKSFL5L2R4Pm8Ef59WVLTIrvBVc0csMCpzaT6dW8YB6
//pm28cHSEEA==