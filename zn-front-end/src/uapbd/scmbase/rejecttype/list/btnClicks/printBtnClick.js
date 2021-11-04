//VqFTX17u5c5T6CGoj9nmVfFztSuFR/Z3npGo8+MIqjnxiTrq/pt+U5W4nAobjbvK
/*
 * @Author: yinliang 
 * @PageInfo: 质量不合格类型-打印
 * @Date: 2019-03-15 10:55:37 
 * @Last Modified by: yinliang
 * @Last Modified time: 2019-03-19 16:24:48
 */
import { print } from 'nc-lightapp-front';
import { AREA, URL, OTHER } from '../../constance';

/**
 * 这里的打印比较特殊，是打印全部树节点的数据
 * @param {*} props 
 */
export default function(props) {
	let allDatas = props.syncTree.getSyncTreeValue(AREA.tree);
	let pks = getAllPks.call(this, allDatas[0], []);
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print,
		{
			nodekey: null, //模板节点标识
			oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
		}
	);
}

/**
 * 获取所有的主键
 * @param {*} data 树所有的数据
 */
function getAllPks(data, pks = []) {
	if (data[OTHER.id]) {
		pks.push(data[OTHER.id]);
	}
	if (data && data.children && data.children.length > 0) {
		data.children.map((item) => {
			getAllPks(item, pks);
		});
	}
	return pks;
}

//VqFTX17u5c5T6CGoj9nmVfFztSuFR/Z3npGo8+MIqjnxiTrq/pt+U5W4nAobjbvK