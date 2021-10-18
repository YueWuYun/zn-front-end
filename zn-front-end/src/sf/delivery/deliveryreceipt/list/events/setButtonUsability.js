/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/
import { grid_code } from '../../cons/constant.js';

export default function click(props) {
	//先把所有按钮都设置为不可编辑
	props.button.setButtonDisabled(['Bookkeeping', 'UnBookkeeping', 'File', 'PayInside',
		'Receivables', 'Voucher', 'Plan', 'Print', 'Output', 'ReturnBill', 'Print', 'Output','Official','Inofficial'], true);
	let selectdata;
	if (props.table) {
		selectdata = props.table.getCheckedRows(grid_code);
	}
	if (!selectdata || selectdata.length == 0) {
		//没有选中行，只能新增与刷新
		props.button.setButtonDisabled(['Refresh'], false);
	} else if (selectdata.length == 1) {
		// 选择一条数据按钮根据状态可用
		// 是否记账 
		let istally;
		// 是否制证 
		let isvoucher;
		//处理选择数据
		selectdata.forEach((val) => {
			istally = val.data.values.istally && val.data.values.istally.value;
			isvoucher = val.data.values.isvoucher && val.data.values.isvoucher.value;
		});
		//所有状态均可以 附件、联查 收付款户 预算、刷新、打印、输出
		props.button.setButtonDisabled(['File', 'PayInside', 'Receivables', 'Plan', 'Print', 'Output','Official','Inofficial'], false);
		if (istally) {//已记账 

			if (isvoucher) {//已制证
				//联查凭证
				props.button.setButtonDisabled(['Voucher'], false);

			} else {//未制证
				// 取消记账	
				props.button.setButtonDisabled(['UnBookkeeping'], false);
			}
		} else {//未记账
			//记账
			props.button.setButtonDisabled(['Bookkeeping'], false);
		}
	} else if(selectdata.length > 1){
		//所有状态均可以新增、联查计划、刷新、复制、打印
		props.button.setButtonDisabled(['Print', 'Output','Official','Inofficial'], false);
		let istallyArray = 0;
		let isvoucherArray = 0;
		let num ;
		for(num=0;num<selectdata.length;num++){
			if(selectdata[num].data.values.istally.value && !selectdata[num].data.values.isvoucher.value){
				istallyArray ++;
			}
			if(selectdata[num].data.values.isvoucher.value){
				isvoucherArray ++
			}
		}
		if (istallyArray > 0) {//说明有已经记账的数据
			//有制证的 也有只记账没有制证的
			if (istallyArray> isvoucherArray) {
				//取消记账
				props.button.setButtonDisabled(['UnBookkeeping'], false);
			}
		} else {//都没记账
			//只显示记账
			props.button.setButtonDisabled(['Bookkeeping'], false);
		}
	}
}

/*CcPhbMUwK6EgcIxdk8kv6+tYLuIwgbEunPjFcD/GfAi+4gguKyQ/+7n7Y0dVqqAL*/