/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//应收票据退票——表头编辑后事件
import {
	ajax,
	toast,
	promptBox
} from 'nc-lightapp-front';
import {
	cardEvent
} from '../../../../public/container/index';
export function afterEvent(props, moduleId, key, value, oldValue) {
	const eventData = this.props.createTabsAfterEventData(this.pageId, this.formId, this.tabOrder, moduleId, key, value); //编辑后事件整单数据
	if (key === 'pk_org') {
		this.props.resMetaAfterPkorgEdit();
		this.props.button.setButtonDisabled(['addRow', 'delRow'], false);//恢复增行编辑性
		//财务组织
		if (!oldValue || !oldValue.value) {
			//编辑后事件
			cardEvent.changeOrg.call(this, value, () => {

			}).then(() => {
				if (value.value) {
					cardEvent.getAfterEventData.call(this, eventData).then(res => {
						props.form.setAllFormValue({
							[this.formId]: res.data.head && res.data.head[this.formId]
						});
						let olcrate = props.form.getFormItemsValue(this.formId, 'olcrate') && props.form.getFormItemsValue(this.formId, 'olcrate').value;
						let glcrate = props.form.getFormItemsValue(this.formId, 'glcrate') && props.form.getFormItemsValue(this.formId, 'glcrate').value;
						let gllcrate = props.form.getFormItemsValue(this.formId, 'gllcrate') && props.form.getFormItemsValue(this.formId, 'gllcrate').value;
						if (Number(olcrate) === 1) {
							props.form.setFormItemsDisabled(this.formId, {
								olcrate: true
							});
						} else {
							props.form.setFormItemsDisabled(this.formId, {
								olcrate: false
							});
						}
						if (Number(glcrate) === 1) {
							props.form.setFormItemsDisabled(this.formId, {
								glcrate: true
							});
						} else {
							props.form.setFormItemsDisabled(this.formId, {
								glcrate: false
							});
						}
						if (Number(gllcrate) === 1) {
							props.form.setFormItemsDisabled(this.formId, {
								gllcrate: true
							});
						} else {
							props.form.setFormItemsDisabled(this.formId, {
								gllcrate: false
							});
						}
					});
					cardEvent.setBodyAfterEventData.call(this, eventData).then(res => {
						props.cardTable.addRow(this.tabCode, undefined, {}, true);
					});
				}
			});
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
							//props.cardTable.addRow(this.tabCode, undefined, {}, true);
						})
						cardEvent.setBodyAfterEventData.call(this, eventData).then(res => {
							props.cardTable.addRow(this.tabCode, undefined, {}, true);
						});
					}
				}),
				cancelBtnClick: () => props.form.setFormItemsValue(moduleId, {
					pk_org: oldValue,
					pk_org_v: oldValue
				})
			});
		}
	} else if (key === 'pk_curr') { //币种
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
				props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
				let setEditable = res.data.userjson;
				if (setEditable.indexOf("olcrate") > -1) {
					props.form.setFormItemsDisabled(moduleId, { olcrate: false });
				} else {
					props.form.setFormItemsDisabled(moduleId, { olcrate: true });
				}
				if (setEditable.indexOf("glcrate") > -1) {
					props.form.setFormItemsDisabled(moduleId, { glcrate: false });
				} else {
					props.form.setFormItemsDisabled(moduleId, { glcrate: true });
				}
				if (setEditable.indexOf("gllcrate") > -1) {
					props.form.setFormItemsDisabled(moduleId, { gllcrate: false });
				} else {
					props.form.setFormItemsDisabled(moduleId, { gllcrate: true });
				}
			});
		}
	} else if (key === 'money') { //汇总金额
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			});
		}
	} else if (key === 'olcrate' || key === 'glcrate' || key === 'gllcrate') { //组织本币汇率
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			});
		}
	} else if (key === 'dreturndate') { //退票日期
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			});
		}
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/