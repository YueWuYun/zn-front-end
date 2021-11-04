//y7Y4hapZL2ylyLInkvpR4y+NxOQRbQ7lQwT3UIDdFpFmGYEAvZjzCyYJeqKcObU7
import { toast, print, output } from 'nc-lightapp-front';
/**
 * 打印输出
 * @param operaType 区分是打印还是输出 print or output
 * @param type 文件格式
 * @param url 打印地址
 * @param printNodekey 模板节点标识
 * @param pks 打印主键数组
 * @param funcode 小应用编码
 * @param printType 打印类型(Card or List) 
 * @param module 节点名称
 */
export function printTemp(operaType, type, url, printNodekey, pks, funcode, printType, module, scaleClazz) {
	if (!pks || pks.length === 0) {
		return false;
	}
	let printData = getPrintData(printNodekey, pks, operaType, funcode, printType, module, scaleClazz);
	if (!printData) {
		toast({ color: 'danger', content: '当前数据不存在' });
		return;
	}
	if(operaType === 'print') {
		print(
			type,  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
			url, //后台服务url
			printData
		)
	} else {
		output({
			url,
			data: printData
		});
	}

}
/**
 * 获取打印数据
 * @param {*} props 
 * @param {*} outputType
 * @param {*} printNodekey
 * @param {*} primaryKey
 */
function getPrintData(nodekey, pks, outputType = 'print', funcode = '', printType = 'Card', module, scaleClazz) {
	let printData = {
		nodekey: nodekey, // 模板节点标识, 暂时传null
		oids: pks, // 需要打印数据主键
		funcode: funcode, // 小应用编码
		outputType, // 输出类型
		userjson: JSON.stringify({printType, module, scaleClazz})
	};
	return printData;
}
//y7Y4hapZL2ylyLInkvpR4y+NxOQRbQ7lQwT3UIDdFpFmGYEAvZjzCyYJeqKcObU7