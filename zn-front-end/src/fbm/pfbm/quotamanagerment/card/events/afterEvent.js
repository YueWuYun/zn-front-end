/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { base, ajax, promptBox } from 'nc-lightapp-front';

import { cardEvent } from '../../../../public/container/index';
import { setHeadItemsDisabled } from '../../../../public/container/page';
export function afterEvent(props, moduleId, key, value, oldValue) {
	console.log(key, value, oldValue);
	let currentItem = { props, moduleId, key, value, oldValue };
	let eventData = this.props.createHeadAfterEventData(this.pageId, this.formId, '', moduleId, key, value);
	if(key === 'pk_org'){ //财务组织
		 if (!oldValue || !oldValue.value) {
			cardEvent.changeOrg.call(this, value).then(() => {
				if (value.value) {
					cardEvent.getAfterEventData.call(this, eventData).then(res => {
						props.form.setAllFormValue({
							[this.formId]: res.data.head && res.data.head[this.formId]
						});
					}).then(() => {
						props.form.setFormItemsValue(this.formId, {
							'keepunitname': {
								value: props.form.getFormItemsValue(this.formId, 'pk_org').display
							}
						}); 	
					});
				}
			})
		} else {
            promptBox({
                color: "warning",
                title: this.props.MutiInit.getIntl("36185515") && this.props.MutiInit.getIntl("36185515").get('36185515-000000'),/* 国际化处理： 修改财务组织*/
                content: this.props.MutiInit.getIntl("36185515") && this.props.MutiInit.getIntl("36185515").get('36185515-000001'),/* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/
                beSureBtnClick: cardEvent.changeOrg.call(this, value).then(() => {
                    if (value.value) {
                        cardEvent.getAfterEventData.call(this, eventData).then(res => {
                            props.form.setAllFormValue({
                                [this.formId]: res.data.head && res.data.head[this.formId]
                            });
                        }).then(() => {
						props.form.setFormItemsValue(this.formId, {
							'keepunitname': {
								value: props.form.getFormItemsValue(this.formId, 'pk_org').display
							}
						}); 	
					});
                    }
                }),
                cancelBtnClick: () => props.form.setFormItemsValue(moduleId, {
                    pk_org: oldValue,
                    pk_org_v: oldValue
                })
            });
        }
	}else if (key === 'pk_curr'){ //币种
		if(value.value !== oldValue.value){
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
				let pk_olccurr = res.data.userjson;
				let pk_curr = props.form.getFormItemsValue(moduleId, 'pk_curr');
				if (pk_olccurr == pk_curr.value) {
					props.form.setFormItemsDisabled(moduleId, { 'olcrate': true });
				}else{
					props.form.setFormItemsDisabled(moduleId, { 'olcrate': false });
				}
			});
		}
	}else if (key === 'downquota'){ //组织本币汇率
		if(value.value !== oldValue.value){
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			});
		}
	}else if (key === 'olcrate' || key === 'glcrate' || key === 'gllcrate'){ //组织本币汇率
		if(value.value !== oldValue.value){
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			});
		}
	}
	cardEvent.creditAfterEvent.call(this, currentItem, {
		// creditBank: 'creditorg', //授信银行
		// creditCurrency: 'creditcurrency', //授信币种
		// creditOccupy: 'creditoccupy', //授信占用额度
		// creditOlcOccupy: 'oldcreditoccupy', //授信占用本币额度				
	}); //授信信息编辑后事件
	
}


/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/