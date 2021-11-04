///kNW3ngNRfuGGVS5kRTa1k7yY/mlU1wulZsoz5jMKzGY2jchKE4Lz93eP0v9DS8xmRUui3cLTObT
//Qno4w6A0TQ==
/*
 * @Author: 刘奇 
 * @PageInfo: 批量删除表体行  
 * @Date: 2018-05-24 19:22:33 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2018-06-06 14:05:45
 */
export default function batchDeleteRow_BtnClick(props) {
	let data = props.editTable.getCheckedRows(this.bodyTableid);
	if (data.length == 0) return;
	let indexArr = new Array();
	for (let i = 0; i < data.length; i++) {
		indexArr.push(data[i].index);
	}
	props.editTable.deleteTableRowsByIndex(this.bodyTableid, indexArr);
}

///kNW3ngNRfuGGVS5kRTa1k7yY/mlU1wulZsoz5jMKzGY2jchKE4Lz93eP0v9DS8xmRUui3cLTObT
//Qno4w6A0TQ==