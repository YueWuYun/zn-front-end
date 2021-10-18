/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { base, ajax, promptBox } from 'nc-lightapp-front';

import { cardEvent } from '../../../../public/container/index';
import { setHeadItemsDisabled } from '../../../../public/container/page';
export function afterEvent(props, moduleId, key, value, oldValue) {
	console.log(key, value, oldValue);
	let currentItem = { props, moduleId, key, value, oldValue };
	let eventData = this.props.createHeadAfterEventData(this.pageId, this.formId, '', moduleId, key, value);
	if (key === 'pk_org') { //财务组织
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
						let olcrate = props.form.getFormItemsValue(this.formId, 'olcrate') && props.form.getFormItemsValue(this.formId, 'olcrate').value;
						let glcrate = props.form.getFormItemsValue(this.formId, 'glcrate') && props.form.getFormItemsValue(this.formId, 'glcrate').value;
						let gllcrate = props.form.getFormItemsValue(this.formId, 'gllcrate') && props.form.getFormItemsValue(this.formId, 'gllcrate').value;
						if(Number(olcrate) === 1){
                            props.form.setFormItemsDisabled(this.formId, {
                                olcrate: true
                            });
                        }else{
                            props.form.setFormItemsDisabled(this.formId, {
                                olcrate: false
                            });
                        }
                        if(Number(glcrate) === 1){
                            props.form.setFormItemsDisabled(this.formId, {
                                glcrate: true
                            });
                        }else{
                            props.form.setFormItemsDisabled(this.formId, {
                                glcrate: false
                            });
                        }
                        if(Number(gllcrate) === 1){
                            props.form.setFormItemsDisabled(this.formId, {
                                gllcrate: true
                            });
                        }else{
                            props.form.setFormItemsDisabled(this.formId, {
                                gllcrate: false
                            });
                        }
					});
				}
			})
		} else {
			promptBox({
				color: "warning",
				title: this.props.MutiInit.getIntl("36180BRB") && this.props.MutiInit.getIntl("36180BRB").get('36180BRB-000000'),/* 国际化处理： 修改财务组织*/
				content: this.props.MutiInit.getIntl("36180BRB") && this.props.MutiInit.getIntl("36180BRB").get('36180BRB-000001'),/* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/
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
	} else if (key === 'signagrbank') { //承兑人
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			}).then(() => {
				props.form.setFormItemsValue(this.formId, {
					'acceptorname': {
						value: props.form.getFormItemsValue(this.formId, 'signagrbank').value
					}
				});
			});
		}
	} else if (key === 'pk_signagrbank') { //承兑人
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			}).then(() => {
				props.form.setFormItemsValue(this.formId, {
					'acceptorname': {
						value: props.form.getFormItemsValue(this.formId, 'pk_signagrbank').display == ' ' ? props.form.getFormItemsValue(this.formId, 'pk_signagrbank').value : props.form.getFormItemsValue(this.formId, 'pk_signagrbank').display
					}
				});
			});
		}
	} else if (key === 'hidepayunit') { //出票人
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			}).then(() => {
				props.form.setFormItemsValue(this.formId, {
					'payunit': {
						value: props.form.getFormItemsValue(this.formId, 'hidepayunit').display == ' ' ? props.form.getFormItemsValue(this.formId, 'hidepayunit').value : props.form.getFormItemsValue(this.formId, 'hidepayunit').display
					}
				});
			});
		}
	} else if (key === 'hidepaybank') { //出票人开户行
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			}).then(() => {
				props.form.setFormItemsValue(this.formId, {
					'paybank': {
						value: props.form.getFormItemsValue(this.formId, 'hidepaybank').display == ' ' ? props.form.getFormItemsValue(this.formId, 'hidepaybank').value : props.form.getFormItemsValue(this.formId, 'hidepaybank').display
					}
				});
			});
		}
	} else if (key === 'hidereceiveunit') { //收款人
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			}).then(() => {
				props.form.setFormItemsValue(this.formId, {
					'receiveunit': {
						value: props.form.getFormItemsValue(this.formId, 'hidereceiveunit').display == ' ' ? props.form.getFormItemsValue(this.formId, 'hidereceiveunit').value : props.form.getFormItemsValue(this.formId, 'hidereceiveunit').display
					}
				});
			});
		}
	} else if (key === 'hidereceivebank') { //收款人开户行
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			}).then(() => {
				props.form.setFormItemsValue(this.formId, {
					'receivebank': {
						value: props.form.getFormItemsValue(this.formId, 'hidereceivebank').display == ' ' ? props.form.getFormItemsValue(this.formId, 'hidereceivebank').value : props.form.getFormItemsValue(this.formId, 'hidereceivebank').display
					}
				});
			});
		}
	} else if (key === 'acceptorbankaccount') { //承兑人开户行号
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			}).then(() => {
				props.form.setFormItemsValue(this.formId, {
					'signagrbanknum': {
						value: props.form.getFormItemsValue(this.formId, 'acceptorbankaccount').display == ' ' ? props.form.getFormItemsValue(this.formId, 'acceptorbankaccount').value : props.form.getFormItemsValue(this.formId, 'acceptorbankaccount').display
					}
				});
			});
		}
	} else if (key === 'acceptorbank') { //承兑人开户行名
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			}).then(() => {
				props.form.setFormItemsValue(this.formId, {
					'signagrbankname': {
						value: props.form.getFormItemsValue(this.formId, 'acceptorbank').display == ' ' ? props.form.getFormItemsValue(this.formId, 'acceptorbank').value : props.form.getFormItemsValue(this.formId, 'acceptorbank').display
					}
				});
			});
		}
	} else if (key === 'pk_acceptorbank') { //承兑人开户行名
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			}).then(() => {
				props.form.setFormItemsValue(this.formId, {
					'signagrbankname': {
						value: props.form.getFormItemsValue(this.formId, 'pk_acceptorbank').display
					}
				});
			});
		}
	} else if (key === 'pk_curr') { //币种
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
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
	} else if (key === 'olcrate') { //组织本币汇率
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			});
		}
	} else if (key === 'glcrate') { //集团本币汇率
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			});
		}
	} else if (key === 'gllcrate') { //全局本币汇率
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			});
		}
	} else if (key === 'money') { //票据金额
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			});
		}
	} else if (key === 'fbmbilltype') { //票据类型
		let fbmbilltype = props.form.getFormItemsValue(this.formId, 'fbmbilltype').value;
		if (fbmbilltype == this.pknotetype_bank || fbmbilltype == this.pknotetype_ebank) {
			props.form.setFormItemsVisible(this.formId, {
				pk_signagrbank: false,
				pk_acceptorbank: false,
				signagrbank: true,
				acceptorbank: true
			});
			props.form.setFormItemsValue(this.formId, {
				'pk_acceptorbank': { value: null },
				'pk_signagrbank': { value: null }
			});
		} else {
			props.form.setFormItemsVisible(this.formId, {
				signagrbank: false,
				acceptorbank: false,
				pk_signagrbank: true,
				pk_acceptorbank: true
			});
			props.form.setFormItemsValue(this.formId, {
				'signagrbank': { value: null },
				'acceptorbank': { value: null }
			});
		}
		if (fbmbilltype == "") {
			props.form.setFormItemsValue(this.formId, {
				'acceptoraccount': { value: null }
			});
		}
	} else if (key === 'fbmbillno') { //票据编号
		if (value.value !== oldValue.value && value.value !== '') {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				this.props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
				this.props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
			});
			var fbmbillno = value.value;
			var bankCode = null;
			if (fbmbillno.length == 30) {
				bankCode = fbmbillno.substring(0, 1);
			} else if (fbmbillno.length == 16) {
				bankCode = fbmbillno.substring(6, 7);
			}
			if (bankCode === '1' || bankCode === '5') {
				props.form.setFormItemsVisible(this.formId, {
					pk_signagrbank: false,
					pk_acceptorbank: false,
					signagrbank: true,
					acceptorbank: true
				});
			} else if (bankCode === '2' || bankCode === '6') {
				props.form.setFormItemsVisible(this.formId, {
					signagrbank: false,
					acceptorbank: false,
					pk_signagrbank: true,
					pk_acceptorbank: true
				});
			}
		}
	} else if (key === 'olcrate') { //组织本币汇率
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			});
		}
	} else if (key === 'invoicedate') { //出票日期
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			});
		}
	} else if (key === 'gatherdate') { //收票日期
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			});
		}
	} else if (key === 'hidepaybankacc') { //出票人账号
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			}).then(() => {
				props.form.setFormItemsValue(this.formId, {
					'paybankacc': {
						value: props.form.getFormItemsValue(this.formId, 'hidepaybankacc').display == ' ' ? props.form.getFormItemsValue(this.formId, 'hidepaybankacc').value : props.form.getFormItemsValue(this.formId, 'hidepaybankacc').display
					}
				});
				//设置带出的承兑信息
				let fbmbilltype = props.form.getFormItemsValue(this.formId, 'fbmbilltype').value;
				if (fbmbilltype == this.pknotetype_bank || fbmbilltype == this.pknotetype_ebank) {//银行承兑

					props.form.setFormItemsValue(this.formId, {
						//承兑人
						'acceptorname': {
							value: props.form.getFormItemsValue(this.formId, 'signagrbank').display
						},
						//承兑人开户行名
						'signagrbankname': {
							value: props.form.getFormItemsValue(this.formId, 'acceptorbank').display == ' ' ? props.form.getFormItemsValue(this.formId, 'acceptorbank').value : props.form.getFormItemsValue(this.formId, 'acceptorbank').display
						}
					});

				} else {//其他
					props.form.setFormItemsValue(this.formId, {
						//承兑人
						'acceptorname': {
							value: props.form.getFormItemsValue(this.formId, 'pk_signagrbank').display == ' ' ? props.form.getFormItemsValue(this.formId, 'pk_signagrbank').value : props.form.getFormItemsValue(this.formId, 'pk_signagrbank').display
						},
						//承兑人开户行名
						'signagrbankname': {
							value: props.form.getFormItemsValue(this.formId, 'pk_acceptorbank').display
						}
					});
				}

			});
		}
	} else if (key === 'hidereceivebankacc') { //收款银行账户
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			}).then(() => {
				props.form.setFormItemsValue(this.formId, {
					'receivebankacc': {
						value: props.form.getFormItemsValue(this.formId, 'hidereceivebankacc').display == ' ' ? props.form.getFormItemsValue(this.formId, 'hidereceivebankacc').value : props.form.getFormItemsValue(this.formId, 'hidereceivebankacc').display
					}
				});
			});
		}
	} else if (key === 'paybillunit') { //付票单位
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.head && res.data.head[this.formId]
				});
			}).then(() => {
				props.form.setFormItemsValue(this.formId, {
					'hidepaybillunit': {
						value: props.form.getFormItemsValue(this.formId, 'paybillunit').display == ' ' ? props.form.getFormItemsValue(this.formId, 'paybillunit').value : props.form.getFormItemsValue(this.formId, 'paybillunit').display
					}
				});
			});
		}
	} else if (key === 'payunit') {//出票人(文本)
		if (value.value !== oldValue.value  && value.value) {
			if(value.value !== value.display){
				this.props.form.setFormItemsValue(this.formId, {
					'hidepayunit': {
						value: this.props.form.getFormItemsValue(this.formId, 'payunit').value
				},
				}); 
			}else{
				this.props.form.setFormItemsValue(this.formId, {
					'hidepayunit': {
						display: '',
						value: '~'
					},
				});
			}
			this.props.form.setFormItemsValue(this.formId, {
				'payunit': {
					value: this.props.form.getFormItemsValue(this.formId, 'payunit').display,
					display: this.props.form.getFormItemsValue(this.formId, 'payunit').display
			},
			});
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'hidepayunit': {
					display: '',
					value: ''
				},
			});
		}
	} else if (key === 'receiveunit') {//收款人(文本)
		if (value.value !== oldValue.value  && value.value) {
			if(value.value !== value.display){
				this.props.form.setFormItemsValue(this.formId, {
					'hidereceiveunit': {
						value: this.props.form.getFormItemsValue(this.formId, 'receiveunit').value
				},
				}); 
			}else{
				this.props.form.setFormItemsValue(this.formId, {
					'hidereceiveunit': {
						display: '',
						value: '~'
					},
				});
			}
			this.props.form.setFormItemsValue(this.formId, {
				'receiveunit': {
					value: this.props.form.getFormItemsValue(this.formId, 'receiveunit').display,
					display: this.props.form.getFormItemsValue(this.formId, 'receiveunit').display
			},
			});
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'hidereceiveunit': {
					display: '',
					value: ''
				},
			});
		}
	} else if (key === 'paybankacc') {//出票人账户(文本)
		if (value.value !== oldValue.value  && value.value) {
			if(value.value !== value.display){
				this.props.form.setFormItemsValue(this.formId, {
					'hidepaybankacc': {
						value: this.props.form.getFormItemsValue(this.formId, 'paybankacc').value
					},
				}); 
				this.props.form.setFormItemsValue(this.formId, {
					'paybank': {
						value: value.values.bankdoc_name.value,
						display:  value.values.bankdoc_name.value,
					},
					
				}); 
			}else{
				this.props.form.setFormItemsValue(this.formId, {
					'hidepaybankacc': {
						display: '',
						value: '~'
					},
				}); 
			}
			this.props.form.setFormItemsValue(this.formId, {
				'paybankacc': {
					value: this.props.form.getFormItemsValue(this.formId, 'paybankacc').display,
					display: this.props.form.getFormItemsValue(this.formId, 'paybankacc').display,
				},
				
			}); 
			
			// cardEvent.getAfterEventData.call(this, eventData).then(res => {
			// 	setAfterEditFormValue.call(this, this.props, res);
			// });
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'paybank': {
					display: '',
					value: ''
				},
				'hidepaybankacc': {
					display: '',
					value: ''
				},
				
			});
			
		}
	} else if (key === 'receivebankacc') {//收款人账户(文本)
		if (value.value !== oldValue.value  && value.value) {
			if(value.value !== value.display){
				this.props.form.setFormItemsValue(this.formId, {
					'hidereceivebankacc': {
						value: this.props.form.getFormItemsValue(this.formId, 'receivebankacc').value
					},
				}); 
				this.props.form.setFormItemsValue(this.formId, {
					'receivebank': {
						value: value.values.bankdoc_name.value,
						display:  value.values.bankdoc_name.value,
					},
					
				}); 
			}else{
				this.props.form.setFormItemsValue(this.formId, {
					'hidereceivebankacc': {
						display: '',
						value: '~'
					},
				}); 
			}
			this.props.form.setFormItemsValue(this.formId, {
				'receivebankacc': {
					value: this.props.form.getFormItemsValue(this.formId, 'receivebankacc').display,
					display: this.props.form.getFormItemsValue(this.formId, 'receivebankacc').display,
				},
				
			}); 
			
			// cardEvent.getAfterEventData.call(this, eventData).then(res => {
			// 	setAfterEditFormValue.call(this, this.props, res);
			// });
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'receivebank': {
					display: '',
					value: ''
				},
				'hidereceivebankacc': {
					display: '',
					value: ''
				},
				
			});
			
		}
	} else if (key === 'paybank') {//出票人开户银行(文本)
		if (value.value !== oldValue.value && value.value) {
			if(value.value !== value.display){
				this.props.form.setFormItemsValue(this.formId, {
					'hidepaybank': {
						value: this.props.form.getFormItemsValue(this.formId, 'paybank').value
					},
				}); 
			}else{
				this.props.form.setFormItemsValue(this.formId, {
					'hidepaybank': {
						display: '',
						value: '~'
					},
				}); 
			}
			this.props.form.setFormItemsValue(this.formId, {
				'paybank': {
					value: this.props.form.getFormItemsValue(this.formId, 'paybank').display,
					display: this.props.form.getFormItemsValue(this.formId, 'paybank').display
				},
			}); 
			// cardEvent.getAfterEventData.call(this, eventData).then(res => {
			// 	setAfterEditFormValue.call(this, this.props, res);
			// });
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'paybankacc': {
					display: '',
					value: ''
				},
				'hidepaybank': {
					display: '',
					value: ''
				},
			});
		}
	} else if (key === 'receivebank') {//收款人开户银行(文本)
		if (value.value !== oldValue.value && value.value) {
			if(value.value !== value.display){
				this.props.form.setFormItemsValue(this.formId, {
					'hidereceivebank': {
						value: this.props.form.getFormItemsValue(this.formId, 'receivebank').value
					},
				}); 
			}else{
				this.props.form.setFormItemsValue(this.formId, {
					'hidereceivebank': {
						display: '',
						value: '~'
					},
				}); 
			}
			this.props.form.setFormItemsValue(this.formId, {
				'receivebank': {
					value: this.props.form.getFormItemsValue(this.formId, 'receivebank').display,
					display: this.props.form.getFormItemsValue(this.formId, 'receivebank').display
				},
			}); 
			// cardEvent.getAfterEventData.call(this, eventData).then(res => {
			// 	setAfterEditFormValue.call(this, this.props, res);
			// });
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'receivebankacc': {
					display: '',
					value: ''
				},
				'hidereceivebank': {
					display: '',
					value: ''
				},
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