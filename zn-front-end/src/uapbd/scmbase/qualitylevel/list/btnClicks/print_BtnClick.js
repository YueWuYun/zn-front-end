//9a1eTd5yO0nmu7639LcU5lg+/LDPaJUDgSjumAT6wPS/4TUr6W4Y+jPQvyBUnQ5N
/*
 * @Author: 刘奇 
 * @PageInfo: 打印按钮事件
 * @Date: 2018-04-19 10:38:05 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-01-10 13:40:13
 */
import { print } from 'nc-lightapp-front';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../pub/tool/messageUtil.js';
import { URL } from '../../constance';
export default function print_BtnClick(props, id) {
	let seldatas = this.props.editTable.getCheckedRows(this.headTableid).map((row) => {
		return row.data;
	});
	if (seldatas == null || seldatas.length == 0) {
		showWarningInfo(null, getLangByResId(this, '1014QUALITYLEVEL-000005')); /* 国际化处理： 错误,请选择要打印的档案！*/
		return;
	}
	let pks = [];
	seldatas.forEach((element) => {
		pks.push(element.values.pk_qualitylv.value);
	});
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print,
		{
			// funcode: AREA.printArea, //功能节点编码，即模板编码
			// nodekey: null, //模板节点标识
			oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
		}
	);
}

//9a1eTd5yO0nmu7639LcU5lg+/LDPaJUDgSjumAT6wPS/4TUr6W4Y+jPQvyBUnQ5N