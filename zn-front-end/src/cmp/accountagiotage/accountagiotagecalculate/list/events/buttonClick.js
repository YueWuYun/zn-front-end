/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, cacheTools, high, print, promptBox } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';

export default function buttonClick(props, id) {
	const billtype = constant.billtype;
	const appcode = constant.appcode;

	function searchdata() {
		let selectdata = props.table.getCheckedRows(constant.ltablecode);
		//数据校验
		if (selectdata.length == 0) {
			toast({
				color: 'warning',
				content: this.state.json['36070AA-000027'] /* 国际化处理： 请选择数据*/
			});
			return;
		}
		return selectdata;
	};

	switch (id) {
		case 'calculateBtn':// 计算损益
			this.onCalculation(props);
			break;

		case 'hisRecordBtn':// 损益记录
			this.openQueryForm();
			this.props.form.setFormStatus(constant.formcode, 'edit');

			// 用户单选
			let meta = this.props.meta.getMeta();
			meta[constant.formcode].items.find((e) => e.attrcode === 'user').isMultiSelectedEnabled = false;
			// meta[constant.formcode].items.find((e) => e.attrcode === 'bankAccount').showHistory = true;
			props.meta.setMeta(meta);

			// 初始化损益记录查询框
			this.initHistoryRecordForm();
			break;

		case 'confirmBtn':// 确认
			this.queryHisRecord(props);
			break;

		case 'cancelBtn':// 取消
			this.closeQueryForm();
			break;

		default:
			break;
	}
}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/