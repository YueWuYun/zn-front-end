/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax,cardCache } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { buttonVisible } from './buttonVisible';
let { getCacheById, updateCache } = cardCache;
export default function(props, pks) {
	// 后台还没更新，暂不可用
	let data = {
		pk: pks,
		pageCode: constant.cpagecode
	};
	let cardData = getCacheById(pks, this.cacheDataSource);

	if(cardData){
		this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId] });
		let billno = cardData[this.formId].rows[0].values.billno.value;
		let id = cardData[this.formId].rows[0].values.pk_cashdeposit.value;
		let billstatus = cardData[this.formId].rows[0].values.billstatus.value;
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			// showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: billno
		});
		//动态修改地址栏中的id的值
		props.setUrlParam(pks);
		// 更改按钮
		buttonVisible(props,billstatus);
		updateCache(this.pkname, id, this.formId, this.cacheDataSource);
	}else{
		ajax({
			url: requesturl.querycard,
			data: data,
			success: (res) => {
				if (res) {
					if (res.data) {
						this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
						let billno = res.data[this.formId].rows[0].values.billno.value;
						let id = res.data[this.formId].rows[0].values.pk_cashdeposit.value;
						let billstatus = res.data[this.formId].rows[0].values.billstatus.value;
						this.props.BillHeadInfo.setBillHeadInfoVisible({
							// showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
							showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
							billCode: billno
						});
						//动态修改地址栏中的id的值
						props.setUrlParam(pks);
						// 更改按钮
						buttonVisible(props,billstatus);
						updateCache(this.pkname, id, this.formId, this.cacheDataSource);
					}
				} else {
					this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
				}
			}
		});
	}
	
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/