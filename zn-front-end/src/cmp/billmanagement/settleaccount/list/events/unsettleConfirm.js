/*sG3rnjk7cVOgs02d7GEja7RUt8upOSPnISS5JVR9PXvZREsq1tZH/z39Oxzi2gKq*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
/**
 * [结账]-[取消结账]
 * @param {*} props 
 * @param {*} status 
 */
export const unsettleConfirm = function () {

		let unSettleAccountData = this.props.table.getCheckedRows(this.tableId);
		if (unSettleAccountData.length != 1) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000001') });/* 国际化处理： 请选择单条数据，进行取消结账处理!*/
			return;
		}

		//请求参数
		let un_findAccMonth = null;//会计期间年月
		let un_findPkorg = null;//所选组织
		let un_AccYear = null;//会计年
		let un_AccMonth = null;//会计月
		let un_findAccMonthEnd = null;//会计期间开始时间
		let un_findAccMonthFirst = null;//会计期间结束时间
		let un_findAccMonthArea = null;//会计期间
		let un_findMonthAreastype = null;//期间状态
		let un_sel_flag = true;//选择即为true
		let un_stype_flag = null;//期间状态标识
		let un_settleVo = [];//请求数据
		let un_allData = this.props.table.getAllTableData(this.tableId).rows;//获取全部数据

		for (let val of un_allData) {

			un_findAccMonth = val.values.findAccMonth.value;
			un_findPkorg = val.values.pk_org.value;
			un_AccYear = val.values.AccYear.value;
			un_AccMonth = val.values.AccMonth.value;
			un_findAccMonthFirst = val.values.findAccMonthFirst.value;
			un_findAccMonthEnd = val.values.findAccMonthEnd.value;
			un_findAccMonthArea = val.values.findAccMonthArea.value;
			un_findMonthAreastype = val.values.findMonthAreastype.value;
			un_stype_flag = val.values.stype_flag.value;

			if (val.selected && val.selected == true) {
				// sel_flag = true;//选中行数
				//自定义请求数据vo
				let un_t_data = {
					'findAccMonth': un_findAccMonth,
					'pk_org': un_findPkorg,
					'pageid': this.pageId,
					'AccYear': un_AccYear,
					'AccMonth': un_AccMonth,
					'findAccMonthFirst': un_findAccMonthFirst,
					'findAccMonthEnd': un_findAccMonthEnd,
					'findAccMonthArea': un_findAccMonthArea,
					'findMonthAreastype': un_findMonthAreastype,
					'sel_flag': true,
					'stype_flag': un_stype_flag
				};
				un_settleVo.push(un_t_data);
				break;//跳出循环不进行加入数组

			} else {

				//自定义请求数据vo
				let un_data = {
					'findAccMonth': un_findAccMonth,
					'pk_org': un_findPkorg,
					'pageid': this.pageId,
					'AccYear': un_AccYear,
					'AccMonth': un_AccMonth,
					'findAccMonthFirst': un_findAccMonthFirst,
					'findAccMonthEnd': un_findAccMonthEnd,
					'findAccMonthArea': un_findAccMonthArea,
					'findMonthAreastype': un_findMonthAreastype,
					'sel_flag': false,
					'stype_flag': un_stype_flag
				};
				un_settleVo.push(un_data);
			}
		};

		ajax({
			url: '/nccloud/cmp/settleaccount/settleoncancelreckoning.do',
			data: {
				'settlevo': un_settleVo
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					toast(
						{
							color: 'success',
							content: this.props.MutiInit.getIntl("36070SA") && this.props.MutiInit.getIntl("36070SA").get('36070SA-000009')
						});/* 国际化处理： 取消结账成功!*/
						this.refresh();
				}
			}
		});
};

/*sG3rnjk7cVOgs02d7GEja7RUt8upOSPnISS5JVR9PXvZREsq1tZH/z39Oxzi2gKq*/