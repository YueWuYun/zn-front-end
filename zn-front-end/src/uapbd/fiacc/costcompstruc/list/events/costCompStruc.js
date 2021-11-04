//zdV8mkf1vUmJpoF5iaTXhC79mmkDQVFYN80FsoBl1SiYeuhII87iiLSnMCPoTcYD
import { ajax, cacheTools, cardCache, toast, promptBox, print, output } from 'nc-lightapp-front';
import { searchId, tableId, dataSource, pkname, billtype, funcode, nodekey } from '../constants';
/**
 * 消耗单列表公共方法提取
 */


//刷新按钮
export const refreshFun = function (that, props) {
	let { setDefData, getDefData } = cardCache;
	let queryInfo = getDefData(searchId, dataSource);//获取缓存查询条件
	if (queryInfo) {//缓存中存在查询条件
		let pageInfo = props.table.getTablePageInfo(tableId);
		queryInfo.pageInfo=pageInfo
		let data = {
			pagecode: props.getSearchParam('p'), //页面id
			queryInfo: queryInfo
		};
		ajax({
			url: '/nccloud/uapbd/costcompstruc/querylist.do',
			data: data,
			success: function (res) {
				let { success, data } = res;
				if (data) {
					props.table.setAllTableData(tableId, res.data[tableId]);
				} else {
					props.table.setAllTableData(tableId, { rows: [] });
				}
				//页面新数据放入缓存中
				setDefData(tableId, dataSource, data);
				toast({ title: that.state.json['10140CCSC-000013'], color: 'success' });/* 国际化处理： 刷新成功*/
			}
		});
	} else {
		toast({ color: 'success', title: that.state.json['10140CCSC-000013'] }); /* 国际化处理： 刷新成功*/
	}
	return;
}
/**
 * 批量删除
 * @param {*} props 
 */
export const batchDelRow = function (that, props) {
	let checkedData = props.table.getCheckedRows(tableId);
	let delArr = [];//删除数据集合
	checkedData.forEach((val) => {
		delArr.push({
			pk_bill: val.data.values[pkname].value,
			ts: val.data.values.ts.value,
			index: val.index,
			pageId: props.getSearchParam('p'), //页面id
		});
	});
	if (delArr.length == 0) {
		toast({ content: `${that.state.json['10140CCSC-000011']}`, color: 'warning' });/* 国际化处理： 请先选中需要删除的数据*/
		return;
	}
	promptBox({
		color: 'warning',
		title: that.state.json['10140CCSC-000004'],
		content: that.state.json['10140CCSC-000012'],/* 国际化处理： 确定要删除所选数据吗?*/
		beSureBtnClick: function () {
			ajax({
				url: '/nccloud/uapbd/costcompstruc/delete.do',
				data: delArr,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							if (data.message) {
								toast({
									duration: 'infinity',
									color: data.PopupWindowStyle,
									content: data.message,
								})
							}
							if (data.successIndexs) {
								//删除当前行数据
								props.table.deleteTableRowsByIndex(tableId, data.successIndexs);
							}
							if (data.successPKs) {
								//删除缓存数据
								props.table.deleteCacheId(tableId, data.successPKs);
							}
							that.onSelected();//控制按钮
						}
					}
				}
			});
		}
	});
};
/**
 * 打印
 */
export const onPrint = function (that, props) {
	let rows = props.table.getCheckedRows(tableId);
	let index1 = [];
	rows.forEach((ele, index) => {
		let pk = ele.data.values[pkname];
		index1.push(pk.value);
	});
	if (index1.length == 0) {
		toast({ content: `${that.state.json['10140CCSC-000023']}，${that.state.json['10140CCSC-000024']}！`, color: 'warning' });/* 国际化处理： 未选中任何行,不允许操作打印*/
		return;
	}
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		'/nccloud/uapbd/costcompstruc/print.do', //后台服务url
		{
			billtype: billtype, //单据类型
			funcode: funcode, //功能节点编码，即模板编码
			nodekey: nodekey, //模板节点标识
			oids: index1, // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
			// userjson: billtype //单据类型,billtype不是必需字段，后台没有设置接收字段，以userjson代替
		}
	);
};
/**
  * 打印输出
  */
export const onOutput = function (that, props) {
	let rows = props.table.getCheckedRows(tableId);
	let index1 = [];
	rows.forEach((ele, index) => {
		let pk = ele.data.values[pkname];
		index1.push(pk.value);
	});
	if (index1.length == 0) {
		toast({ content: `${that.state.json['10140CCSC-000023']}，${that.state.json['10140CCSC-000025']}！`, color: 'warning' });/* 国际化处理： 未选中任何行,不允许操作打印输出*/
		return;
	} // 在你想要触发的事件里面调用output方法，必须传的参数有data， 选择传的参数有url（要打印调用的后台接口），callback（打印后的回调函数）
	output({
		url: '/nccloud/uapbd/costcompstruc/printoutput.do',
		data: {
			outputType: 'output', //输出类型
			funcode: funcode, //功能节点编码，即模板编码
			nodekey: nodekey, //模板节点标识
			oids: index1 // 功能节点的数据主键 oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
		},
	});
};

/**
* 列表导出
*/
export const exportlFun = function (that, props) {
	if(that.state.forceRender){
		that.setState({forceRender: false})
	 }
	let ExportcheckedData = props.table.getCheckedRows(tableId);
	if (ExportcheckedData.length == 0) {
		toast({ color: 'warning', content: that.state.json['10140CCSC-000029'] });/* 国际化处理： 请选中至少一行数据!*/
		return;
	}
	let pk_bills = [];
	ExportcheckedData.forEach((val) => {
		pk_bills.push(val.data.values[pkname].value);
	});
	that.Info.selectedPKS = pk_bills;//传递主键数组,之前nc需要导出的加主键
	that.props.modal.show('exportFileModal');//不需要导出的只执行这行代码
};
//单据追溯
export const openBillTrack = function(that,props){
    let index1 = [];
    let pk;
	let rows = props.table.getCheckedRows(tableId);
	rows.forEach((ele, index) => {
		pk = ele.data.values[pkname];
		index1.push(pk.value);
		});
		if(index1.length == 0){
			toast({ content: `${that.state.json['10140CCSC-000029']}！`, color: 'warning' });/* 国际化处理：  请选中至少一行数据!*/
			return; 
		}
		if(index1.length>1){
			toast({ content: `${that.state.json['10140CCSC-000030']}！`, color: 'warning' });/* 国际化处理： 联查不能多选*/
			return; 
	}
	that.setState({
        trackshow: true,
        checkId:pk.value
    })     
}
//zdV8mkf1vUmJpoF5iaTXhC79mmkDQVFYN80FsoBl1SiYeuhII87iiLSnMCPoTcYD