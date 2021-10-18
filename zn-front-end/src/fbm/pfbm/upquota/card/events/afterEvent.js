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
                title: "修改财务组织",
                content: "确认修改财务组织, 这样会清空您录入的信息?",
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
	}

	cardEvent.creditAfterEvent.call(this, currentItem, {
		// creditBank: 'creditorg', //授信银行
		// creditCurrency: 'creditcurrency', //授信币种
		// creditOccupy: 'creditoccupy', //授信占用额度
		// creditOlcOccupy: 'oldcreditoccupy', //授信占用本币额度				
	}); //授信信息编辑后事件
	
}


/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/