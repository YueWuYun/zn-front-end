/*cFuzLff+Qmbwd+PXzFerL95J5XHQDWQ/o9FpMrqCs0oIm88B61iwj2HUOmMaN0GM*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
/**
 * [结账]-[完成结账]
 * @param {*} props 
 * @param {*} status 
 */
export const settleConfirm = function () {

	let settleAData = this.props.table.getCheckedRows(this.tableId);
	if (settleAData.length != 1) {
		toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000000') });/* 国际化处理： 请选择单条数据，进行结账处理!*/
		return;
	}
	// //选中行index
	// let index = settleAData[0].index;
	// props.table.setValByKeyAndIndex(tableid, index, 'sel_flag', { value:'true' })
	//选中数据设置相应字段为sel_flag=true;
	//请求vo参数
	let findAccMonth = null;//会计期间年月
	let findPkorg = null;//所选组织
	let AccYear = null;//会计年
	let AccMonth = null;//会计月
	let findAccMonthEnd = null;//会计期间开始时间
	let findAccMonthFirst = null;//会计期间结束时间
	let findAccMonthArea = null;//会计期间
	let findMonthAreastype = null;//期间状态
	// let sel_flag = true;//选择即为true
	let stype_flag = null;
	let settleVo = [];//请求数据
	
	let allData = this.props.table.getAllTableData(this.tableId).rows;//获取全部数据

	for (let val of allData) {

		findAccMonth = val.values.findAccMonth.value;
		findPkorg = val.values.pk_org.value;
		AccYear = val.values.AccYear.value;
		AccMonth = val.values.AccMonth.value;
		findAccMonthFirst = val.values.findAccMonthFirst.value;
		findAccMonthEnd = val.values.findAccMonthEnd.value;
		findAccMonthArea = val.values.findAccMonthArea.value;
		findMonthAreastype = val.values.findMonthAreastype.value;
		stype_flag = val.values.stype_flag.value;
		if (val.selected && val.selected == true) {
			// sel_flag = true;//选中行数
			//自定义请求数据vo
			let t_data = {
				'findAccMonth': findAccMonth,
				'pk_org': findPkorg,
				'pageid': this.pageId,
				'AccYear': AccYear,
				'AccMonth': AccMonth,
				'findAccMonthFirst': findAccMonthFirst,
				'findAccMonthEnd': findAccMonthEnd,
				'findAccMonthArea': findAccMonthArea,
				'findMonthAreastype': findMonthAreastype,
				'sel_flag': true,
				'stype_flag': stype_flag
			};
			
			settleVo.push(t_data);

			break;//跳出循环不进行加入数组

		} else {

			//自定义请求数据vo
			let data = {
				'findAccMonth': findAccMonth,
				'pk_org': findPkorg,
				'pageid': this.pageId,
				'AccYear': AccYear,
				'AccMonth': AccMonth,
				'findAccMonthFirst': findAccMonthFirst,
				'findAccMonthEnd': findAccMonthEnd,
				'findAccMonthArea': findAccMonthArea,
				'findMonthAreastype': findMonthAreastype,
				'sel_flag': false,
				'stype_flag': stype_flag
			};
			
			settleVo.push(data);
		}
	};

	ajax({
		url: '/nccloud/cmp/settleaccount/settleonreckoningover.do',
		data: {
			'settlevo': settleVo
		},
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (res.data.isAction) {
					//成功了也要增加提示
					let messageArr = [];
					if (res.data.tranData1) {
						messageArr = res.data.tranData1;
					}
					toast(
						{   duration: 'infinity', // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
							title: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000002'),/* 国际化处理： 操作成功*/
							color: 'success',
							content: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000003'),/* 国际化处理： 结账成功*/
							groupOperation: true,
							TextArr: [this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000004'), this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000005'), this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000006')],/* 国际化处理： 展开,收起,关闭*/
							groupOperationMsg: messageArr
						}
					);
					this.refresh();
				} else {
					//失败信息
					let mesArr = res.data.tranData1;//返回信息
					let errrorArr = [];
					if (mesArr) {
						errrorArr = mesArr
					}
					toast(
						{
							// duration: 'infinity',  //不支持这种方式了设置显示时间了
							color: 'danger',//普通提示：帮助(蓝)、预警(黄)、成功(绿)提示3000ms后自动隐藏，错误(红)需要手动隐藏；错误(红)提示5000ms后向右滑出，并且最小化；
							title: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000007'),/* 国际化处理： 操作失败*/
							groupOperation: true,
							TextArr: [this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000004'), this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000005'), this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000006')],/* 国际化处理： 展开,收起,关闭*/
							content: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000008'),/* 国际化处理： 请注意！存在月末检查不合格单据*/
							groupOperationMsg: errrorArr
						}
					);
					this.refresh();
				}

			}
		}
	});
	
	
};

/*cFuzLff+Qmbwd+PXzFerL95J5XHQDWQ/o9FpMrqCs0oIm88B61iwj2HUOmMaN0GM*/