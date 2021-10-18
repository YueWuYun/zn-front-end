/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';

//损益记录查询框财务组织改变，需要更新查询框中的年份、期间、币种
export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {

	if (key === 'pkOrg' && moduleId === constant.formcode) {
		let pkOrg;
		let pkOrgDisplay;
		if(this.props.form.getFormItemsValue(constant.formcode, "pkOrg")){
			pkOrg = this.props.form.getFormItemsValue(constant.formcode, "pkOrg").value;
			pkOrgDisplay = this.props.form.getFormItemsValue(constant.formcode, "pkOrg").display;
		}
		this.props.form.setFormItemsValue(constant.formcode, { pkOrg: { value: pkOrg ,display: pkOrgDisplay}});
		
		let data={
			pkOrg: pkOrg,
			pageCode: constant.lpagecode
		};
		if(pkOrg != ""){
			ajax({
				url: requesturl.defaultquery,
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						let meta = this.props.meta.getMeta();

						if(data.head != null){
							// 年份
							let yearArr = data.head[constant.ltablecode].rows[0].values.yearArr.value;
							let yearArrItem = meta[constant.formcode].items.find(e => e.attrcode === 'year');
							yearArrItem.options = [];
							for (let item of yearArr) {
								yearArrItem.options.push({
									display: item,
									value: item
								});
							}

							// 期间
							let periodArr = data.head[constant.ltablecode].rows[0].values.periodArr.value;
							let periodArrItem = meta[constant.formcode].items.find(e => e.attrcode === 'period');
							periodArrItem.options = [];
							for (let itemperiod of periodArr) {
								periodArrItem.options.push({
									display: itemperiod,
									value: itemperiod
								});
							}
						}
	
						// 币种
						if(data.body != null){
							let bzArr = data.body[constant.ltablecode].rows;		
							let bzItem = meta[constant.formcode].items.find(e => e.attrcode === 'bz');
							bzItem.options = [];
							for (let bzVal of bzArr) {
								bzItem.options.push({
									display: bzVal.values.bzName.value,
									value: bzVal.values.bzPk.value
								});
							}
						}
						
						this.props.meta.setMeta(meta);
	
						let selectedYear = data.head[constant.ltablecode].rows[0].values.selectedYear.value;// 年份默认值
						let selectedPeriod = data.head[constant.ltablecode].rows[0].values.selectedPeriod.value;// 期间默认值
						this.props.form.setFormItemsValue(constant.formcode, { year:   { value: selectedYear, display: selectedYear } });
						this.props.form.setFormItemsValue(constant.formcode, { period: { value: selectedPeriod, display: selectedPeriod } });
						//tm begin lidyu 修改全部多语 20200412
						// this.props.form.setFormItemsValue(constant.formcode, { bz: { value: null, display : '全部' } });
						this.props.form.setFormItemsValue(constant.formcode, { bz: { value: null, display : this.state.json['36070AA-000071'] } })
						//end lidyu 2020412
						
					}
				}
			});
		}
		
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/