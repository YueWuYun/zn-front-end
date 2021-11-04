//fUFN/X7NANorNSaeTJGReYpYJLYystmYOaUo2VCRis9S1b2eQAam9y77g1SFWZbyu+fvCAlce9AL
//F08eqn3NrA==
/*
 * @Author: qiaobb 
 * @PageInfo: 导出  
 * @Date: 2019-03-25 16:28:37 
 * @Last Modified by: qiaobb
 * @Last Modified time: 2019-07-09 10:21:44
 */

import { FIELD, URL, AREA } from '../../constance';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
export default function(props) {
	let meta = props.meta.getMeta();
	let titleAry = [];
	let pk = { code: 'pk_barcodeparse', value: getLangByResId(this, '4017BARCODEPARSE-000001') }; /* 国际化处理： 主键*/
	titleAry.push(pk);
	meta[AREA.tableArea].items.forEach((item) => {
		let excelcell = {};
		if (item.visible) {
			excelcell.code = item.attrcode;
			excelcell.value = item.label;
			titleAry.push(excelcell);
		}
	});
	let checkArr = props.editTable.getCheckedRows(AREA.tableArea);
	let head = [];
	if (checkArr && checkArr.length > 0) {
		checkArr.forEach((item) => {
			let listAry = [];
			let { values } = item.data;
			if (values) {
				for (let i = 0; i < titleAry.length; i++) {
					let excelcell = {};
					let codeValue = values[titleAry[i].code];

					excelcell.code = titleAry[i].code;
					if (codeValue == undefined) {
						excelcell.value = '';
					} else {
						if (Object.keys(codeValue).length === 0) {
							excelcell.value = '';
						} else {
							if (codeValue.value != undefined) {
								excelcell.value = codeValue.value;
							} else {
								excelcell.value = '';
							}
						}
					}
					listAry.push(excelcell);
				}
				head.push({ head: listAry });
			}
		});
	}
	this.setState(
		{
			// 获取卡片页面单据的主键，传到后台需要根据主键将数据查询出来然后导出
			selectedPKS: [ JSON.stringify(head) ]
		},
		() => {
			props.modal.show('exportFileModal');
		}
	);
}

//fUFN/X7NANorNSaeTJGReYpYJLYystmYOaUo2VCRis9S1b2eQAam9y77g1SFWZbyu+fvCAlce9AL
//F08eqn3NrA==