/*cFuzLff+Qmbwd+PXzFerL95J5XHQDWQ/o9FpMrqCs0oIm88B61iwj2HUOmMaN0GM*/
import { createPage, ajax, base, high, toast, cardCache, deepClone } from 'nc-lightapp-front';
import { BatchToast } from '../MessageUtil/BatchToast';
/**
 * [集中结账]-结账
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const settleConfirm = function () {

	//所选数据----->全部处理传到后台
	let settleAData = this.props.table.getCheckedRows(this.tableId);
	if (settleAData.length == 0) {
		toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FSA") && this.props.MutiInit.getIntl("36070FSA").get('36070FSA-000000') });/* 国际化处理： 请选择数据，进行结账处理!*/
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
	let sel_flag = true;//选择即为true
	let stype_flag = null;
	let findPkorgname = null;//组织名称
	let findPkorgcode = null;//组织编码
	let settleVo = [];//请求数据
	let orgs = [];//请求数据中的财务组织集合
	for (let val of settleAData) {

		findAccMonth = val.data.values.findAccMonth.value;
		findPkorg = val.data.values.pk_org.value;
		findPkorgname = val.data.values.pk_orgname.value;
		findPkorgcode = val.data.values.pk_orgcode.value;
		AccYear = val.data.values.AccYear.value;
		AccMonth = val.data.values.AccMonth.value;
		findAccMonthFirst = val.data.values.findAccMonthFirst.value;
		findAccMonthEnd = val.data.values.findAccMonthEnd.value;
		findAccMonthArea = val.data.values.findAccMonthArea.value;
		findMonthAreastype = val.data.values.findMonthAreastype.value;
		stype_flag = val.data.values.stype_flag.value;

		//自定义请求数据vo
		let data = {
			'findAccMonth': findAccMonth,
			'pk_org': findPkorg,
			'pk_orgname': findPkorgname,
			'pk_orgcode': findPkorgcode,
			'pageid': this.pageId,
			'AccYear': AccYear,
			'AccMonth': AccMonth,
			'findAccMonthFirst': findAccMonthFirst,
			'findAccMonthEnd': findAccMonthEnd,
			'findAccMonthArea': findAccMonthArea,
			'findMonthAreastype': findMonthAreastype,
			'sel_flag': true,
			'stype_flag': stype_flag
		}
		settleVo.push(data);
		orgs.push(findPkorg);
	}

	ajax({
		url: '/nccloud/cmp/focussettleaccount/onreckoningover.do',
		data: {
			'settlevo': settleVo,
			'orgs': orgs
		},
		success: (res) => {
			let { success, data } = res;
			debugger
			if (success) {
				let messagArr = [];//提示信息
				let rows = data[this.tableId].rows;
				//结果统计数
				let successIndex = 0;//成功条数
				let failIndex = 0;//失败条数

				if (rows && rows.length > 0) {

					rows.forEach((val) => {
						let eMessageArr = [];//每行数据数组结果
						let errorMsgArr = val.values.errorMessageArr.value;//失败错误多条语句
						let isDoSuccess = val.values.isDoSuccess.value;//结账成功或者失败false/true
						let orgname = val.values.pk_orgname.value;//结账业务单元
						let orgcode = val.values.pk_orgcode.value;//结账业务单元code
						/**
						 * [结账失败]
						 */
						if (!isDoSuccess && errorMsgArr && errorMsgArr.length > 0) {

							eMessageArr.push('【' + orgname + ' ' + orgcode + '】' + (this.props.MutiInit.getIntl("36070FSA") && this.props.MutiInit.getIntl("36070FSA").get('36070FSA-000023')));//1-1:组织标题头部国际化处理'操作失败,原因>>'
							//结账失败
							if (Array.isArray(errorMsgArr)) {
								//数组
								errorMsgArr.forEach((val) => {
									eMessageArr.push('~' + val);//1-2:失败原因
								});
							} else {
								//字符串
								eMessageArr.push('~' + errorMsgArr);//1-3:失败原因
							}

						} else {
							/**
							 * [结账成功]
							 */
							eMessageArr.push('【' + orgname + ' ' + orgcode + '】' + (this.props.MutiInit.getIntl("36070FSA") && this.props.MutiInit.getIntl("36070FSA").get('36070FSA-000038')));//1-1:组织标题头部，国际化处理：'操作成功,原因>>'
							//结账成功
							if (errorMsgArr && errorMsgArr.length > 0) {
								//检查不控制
								if (Array.isArray(errorMsgArr)) {
									//数组
									errorMsgArr.forEach((val) => {
										eMessageArr.push('~' + val);//1-2:失败原因
									});
								} else {
									//字符串
									eMessageArr.push('~' + errorMsgArr);//1-3:失败原因
								}
							}
							successIndex = successIndex + 1;//成功条数
						}
						/**
						 * 汇总错误和成功信息
						 */
						if (eMessageArr.length > 0) {
							eMessageArr.forEach((val) => {
								messagArr.push(val);
							});
						}
					});
				}
				failIndex = rows.length - successIndex;//失败条数
				BatchToast.call(this, (this.props.MutiInit.getIntl("36070FSA") && this.props.MutiInit.getIntl("36070FSA").get('36070FSA-000025')), rows.length, successIndex, failIndex, messagArr, null);
				// this.refresh();
			}
		}
	});

}

/*cFuzLff+Qmbwd+PXzFerL95J5XHQDWQ/o9FpMrqCs0oIm88B61iwj2HUOmMaN0GM*/