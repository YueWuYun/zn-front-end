/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import {
	ajax,
	toast,
	promptBox
} from 'nc-lightapp-front';
import {
	cardEvent
} from '../../../../public/container/index';
import {
	setHeadItemsDisabled
} from '../../../../public/container/page';
import { setHeadItemProp,setBodyItemProp } from '../../../../pub/utils/FBMAfterEditUtil.js';
export function afterEvent(props, moduleId, key, value, oldValue) {
	const eventDatas = this.props.createTabsAfterEventData(this.pageId, this.formId, this.tabOrder, moduleId, key, value); //编辑后事件整单数据
	let eventData = { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDatas) };
	const commonAfterEventArr = ['repprcact', 'olcrate', 'creditamount', 'glcrate', 'gllcrate']; //还本金额/本币汇率/释放授信额度
	if (key === 'pk_org') {
		this.props.resMetaAfterPkorgEdit();
		//this.props.button.setButtonDisabled(['addRow', 'delRow'], false);//恢复增行编辑性
		// buis 隐藏 pk_acceptor
		this.props.form.setFormItemsVisible(this.formId, {
			pk_acceptor: false
		});
		this.props.form.setFormItemsVisible(this.formId, {
			acceptunit: true
		});
		//承兑人开户行名
		this.props.form.setFormItemsVisible(this.formId, {
			signagrbank: false
		});
		this.props.form.setFormItemsVisible(this.formId, {
			pk_acceptorbank: true
		});
		this.props.form.setFormItemsValue(this.formId, {
			'pk_acceptor': {
				display: '',
				value: ''
			},
			'signagrbank': {
				display: '',
				value: ''
			},
		});
		//财务组织
		if (!oldValue || !oldValue.value) {
			//编辑后事件
			cardEvent.changeOrg.call(this, value, () => {

			}).then(() => {
				if (value.value) {
					cardEvent.getAfterEventData.call(this, eventData).then(res => {
						// props.form.setAllFormValue({
						// 	[this.formId]: res.data.head && res.data.head[this.formId]
						// });
						setAfterEditFormValue.call(this, this.props, res);
					});
				}
				props.button.setButtonDisabled(["addRow", "deleteRow"], true);
			});

		} else {
			promptBox({
				color: "warning",
				title: this.props.MutiInit.getIntl("36180BPB") && this.props.MutiInit.getIntl("36180BPB").get('36180BPB-000000'),/* 国际化处理： 修改财务组织*/
				content: this.props.MutiInit.getIntl("36180BPB") && this.props.MutiInit.getIntl("36180BPB").get('36180BPB-000001'),/* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/
				beSureBtnClick: cardEvent.changeOrg.call(this, value).then(() => {
					if (value.value) {
						cardEvent.getAfterEventData.call(this, eventData).then(res => {
							// props.form.setAllFormValue({
							// 	[this.formId]: res.data.head && res.data.head[this.formId]
							// });
							setAfterEditFormValue.call(this, this.props, res);
						})
					}
					props.button.setButtonDisabled(["addRow", "deleteRow"], true);

				}),
				cancelBtnClick: () => props.form.setFormItemsValue(moduleId, {
					pk_org: oldValue,
					pk_org_v: oldValue
				})
			});
		}
		// if (value.value !== oldValue.value) {
		// 	cardEvent.changeOrg.call(this, value).then(() => {
		// 		if (value.value) {
		// 			cardEvent.getAfterEventData.call(this, eventData).then(res => {
		// 				props.form.setAllFormValue({
		// 					[this.formId]: res.data.card.head && res.data.card.head[this.formId]
		// 				});
		// 			})
		// 		}
		// 	})
		// } 
	} else if (key === 'impawnmode') {
		props.cardTable.setTabData('guarantee', { rows: [] });
		//担保方式
		//保证金
		if (value.value !== oldValue.value) {
			this.props.button.setButtonDisabled(['addRow', 'delRow'], true);//恢复增行编辑性


			//票据池	根据担保方式决定 保证金和票据池的编辑性	
			if (value.value === 'BILLPOOL' ) {

				this.props.button.setButtonDisabled(['addRow', 'delRow'], true);//恢复增行编辑性 ，并且必输

				this.props.form.openArea('billpoolflag')
				this.props.form.setFormItemsDisabled(this.formId, {
					occucommoney: false,
					occusharemoney: false,
					olcoccucommoney: true,
					olcoccusharemoney: true,
				});
				this.props.form.setFormItemsRequired(this.formId, {
					//occucommoney: true,
					//occusharemoney: true,
				});
				this.props.form.setFormItemsValue(this.formId, {
					'initpoolflag': {
						display: '',
						value: true
					},
				});

				//props.cardTable.setTabData('guarantee', {rows: []});
			} else {
				
				if(value.value === 'CREDIT'){
					this.props.button.setButtonDisabled(['addRow', 'delRow'], true);
				}else{
					this.props.button.setButtonDisabled(['addRow', 'delRow'], false);//恢复增行编辑性
				}

				this.props.form.setFormItemsDisabled(this.formId, {
					occucommoney: true,
					occusharemoney: true,
					olcoccucommoney: true,
					olcoccusharemoney: true,
					initpoolflag: true,

				});
				this.props.form.setFormItemsRequired(this.formId, {
					initpoolflag: false,
					occucommoney: false,
					occusharemoney: false,
					olcoccucommoney: false,
					olcoccusharemoney: false,
				});
				//当担保方式为信用，保证时候，需要控制表体字段的必输
				this.props.form.setFormItemsValue(this.formId, {
					'initpoolflag': {
						display: '',
						value: ''
					},

					'occucommoney': {
						display: '',
						value: ''
					},
					'occusharemoney': {
						display: '',
						value: ''
					},
					'olcoccucommoney': {
						display: '',
						value: ''
					},
					'olcoccusharemoney': {
						display: '',
						value: ''
					}
				});

			}
		}


	} else if (key === 'ccno') {
		if (value.value !== oldValue.value && value.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				// this.props.form.setAllFormValue({
				// 	[this.formId]: res.data.head && res.data.head[this.formId]
				// });
				setAfterEditFormValue.call(this, this.props, res);
				this.props.form.setFormItemsDisabled(this.formId, {
					//pk_cccurrtype: false,
					pk_cctype: false,
					usedccamount: false,
					//olcccamount: false,

				});
			})
		} else {
			//如果授信协议清空的时候，清空其带出的值啊
			this.props.form.setFormItemsValue(this.formId, {

				'pk_cccurrtype': {
					display: '',
					value: ''
				},
				'pk_cctype': {
					display: '',
					value: ''
				},
				'usedccamount': {
					display: '',
					value: ''
				},
				'olcccamount': {
					display: '',
					value: ''
				}
			});
			this.props.form.setFormItemsDisabled(this.formId, {
				pk_cccurrtype: true,
				pk_cctype: true,
				usedccamount: true,
				olcccamount: true,

			});
		}
	} else if (key === 'pk_curr') {
		//币种
		if (value.value !== oldValue.value && value.value) {
			//setHeadItemsDisabled.call(this, 'olcrate');//币种为人民币时禁用组织本币汇率
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				// this.props.form.setAllFormValue({
				// 	[this.formId]: res.data.head && res.data.head[this.formId]
				// });
				setAfterEditFormValue.call(this, this.props, res);
				//this.props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
			});
		}

	}else if (key === 'paybilldate') {
		//付票日期
		if (value.value !== oldValue.value && value.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);
			});
		}

	} else if (key === 'glcrate' || key === 'gllcrate' || key === 'olcrate' || key === 'poundagemoney' || key === 'usedccamount' || key === 'money' || key === 'securitymoney' || key === 'securityrate'
		|| key === 'occucommoney' || key === 'occusharemoney' || key === 'invoicedate' ) {

		if (value.value !== oldValue.value ) {
			if (key === 'money' || key === 'poundagemoney' || key === 'occucommoney' || key === 'occusharemoney' || key === 'securitymoney') {
				if (value.value < 0) {
					toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180BPB") && this.props.MutiInit.getIntl("36180BPB").get('36180BPB-000002') });/* 国际化处理： 金额不能等于零*/
					return;
				}
			}
			if(key === 'securitymoney'){
				let securitymoney = value.value;
				let money = props.form.getFormItemsValue(this.formId, 'money') && props.form.getFormItemsValue(this.formId, 'money').value;
				if (Number(securitymoney) > Number(money)) {
					toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180BPB") && this.props.MutiInit.getIntl("36180BPB").get('36180BPB-000016') });/* 国际化处理： 保证金额已超过票据金额*/
				}
			}
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				// this.props.form.setAllFormValue({
				// 	[this.formId]: res.data.head && res.data.head[this.formId]
				// });
				// this.props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
				let notuse = res.data.card.userjson;
				if(notuse){
					toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180BPB") && this.props.MutiInit.getIntl("36180BPB").get('36180BPB-000018') });/* 国际化处理： 共享余额不足*/
				}
				setAfterEditFormValue.call(this, this.props, res);
			});
		}

	} else if (key === 'pk_paybank') {//出票人开户行  修改后，清空出票人账号

		if (value.value !== oldValue.value && value.value) {
			
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);
			});
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'pk_payacc': {
					display: '',
					value: ''
				},
			});
		}

	} else if (key === 'hidereceivebank') {//收款银行修改后，清空收款人账号

		if (value.value !== oldValue.value && value.value) {
			this.props.form.setFormItemsValue(this.formId, {
				'receivebank': {
					value: this.props.form.getFormItemsValue(this.formId, 'hidereceivebank').display == null ? this.props.form.getFormItemsValue(this.formId, 'hidereceivebank').value : this.props.form.getFormItemsValue(this.formId, 'hidereceivebank').display
				},
			}); 
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);
			});
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'hidereceivebankacc': {
					display: '',
					value: ''
				},
			});
		}

	} else if (key === 'receivebank') {//收款银行修改后，清空收款人账号

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

	}else if ( key === 'pk_payacc') {//收款银行账户修改后，清空收款人账号

		if (value.value !== oldValue.value  && value.value) {
			
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);
			}).then(() => {
				this.props.form.setFormItemsValue(this.formId, {
					'acceptorname': {
						value: this.props.form.getFormItemsValue(this.formId, 'pk_acceptor') && this.props.form.getFormItemsValue(this.formId, 'pk_acceptor').display
					},
				}); 
				this.props.form.setFormItemsValue(this.formId, {
					'signagrbankname': {
						value: this.props.form.getFormItemsValue(this.formId, 'signagrbank') && this.props.form.getFormItemsValue(this.formId, 'signagrbank').display
					},
				}); 
			});;
			
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'pk_paybank': {
					display: '',
					value: ''
				},
			});
		}

	}else if ( key === 'hidereceivebankacc' ) {//收款银行账户修改后，清空收款人账号

		if (value.value !== oldValue.value  && value.value) {
			this.props.form.setFormItemsValue(this.formId, {
				'receivebankacc': {
					value: this.props.form.getFormItemsValue(this.formId, 'hidereceivebankacc').display == ' '? this.props.form.getFormItemsValue(this.formId, 'hidereceivebankacc').value : this.props.form.getFormItemsValue(this.formId, 'hidereceivebankacc').display
				},
			}); 
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);
			});
		}else{
			this.props.form.setFormItemsValue(this.formId, {
				'hidereceivebank': {
					display: '',
					value: ''
				},
			});
		}

	} else if ( key === 'receivebankacc' ) {//收款银行账户修改后，清空收款人账号

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

	} else if ( key === 'hidereceiveunit' ) {//收款银行账户修改后，清空收款人账号

		if (value.value !== oldValue.value  && value.value) {
			this.props.form.setFormItemsValue(this.formId, {
				'receiveunit': {
					value: this.props.form.getFormItemsValue(this.formId, 'hidereceiveunit').display
				},
			}); 
			
		}else{
			
		}

	} else if ( key === 'receiveunit' ) {//收款银行账户修改后，清空收款人账号

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

	}   else if (key === 'issecurity') {//保证金 勾选的话  可编辑且必输

		if (value.value !== oldValue.value && value.value !== false) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				this.props.form.setFormItemsDisabled(this.formId, {
					securityaccount: false,
					securityrate: false,
					securitymoney: false,
					//olcsecuritymoney: false,
				});
				this.props.form.setFormItemsRequired(this.formId, {

					securityaccount: true,
					securityrate: true,
					securitymoney: true,
					//olcsecuritymoney: true,

				});
			});
		} else {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				this.props.form.setFormItemsDisabled(this.formId, {
					securityaccount: true,
					securityrate: true,
					securitymoney: true,
				//	olcsecuritymoney: true,
				});
				this.props.form.setFormItemsRequired(this.formId, {

					securityaccount: false,
					securityrate: false,
					securitymoney: false,
				//	olcsecuritymoney: false,

				});
				this.props.form.setFormItemsValue(this.formId, {


					'securityaccount': {
						display: '',
						value: ''
					},
					'securityrate': {
						display: '',
						value: ''
					},
					'securitymoney': {
						display: '',
						value: ''
					},
					'olcsecuritymoney': {
						display: '',
						value: ''
					}
				});
			});
		}

	} else if (key === 'fbmbillno') {
		if (value.value !== oldValue.value && value.value) {
			
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);
				let fbmbilltype = res.data.card.userjson;

				var fbmbillno = value.value;
				//根据票据编号判断票据类型，决定承兑人和承兑人开户行名 到底是显示 银行档案还是客商档案
				if (fbmbillno) {
					if (fbmbilltype === 'true') {
						//bank 隐藏  acceptunit
						//承兑人
						props.form.setFormItemsVisible(this.formId, {
							acceptunit: false
						});
						props.form.setFormItemsVisible(this.formId, {
							pk_acceptor: true
						});
						//承兑人开户行名
						props.form.setFormItemsVisible(this.formId, {
							signagrbank: true
						});
						props.form.setFormItemsVisible(this.formId, {
							pk_acceptorbank: false
						});
					} else {
						// buis 隐藏 pk_acceptor
						props.form.setFormItemsVisible(this.formId, {
							pk_acceptor: false
						});
						props.form.setFormItemsVisible(this.formId, {
							acceptunit: true
						});
						//承兑人开户行名
						props.form.setFormItemsVisible(this.formId, {
							signagrbank: false
						});
						props.form.setFormItemsVisible(this.formId, {
							pk_acceptorbank: true
						});
					}
				}

			});
		}
	} else if (key === 'fbmbilltype') {
		if (value.value !== oldValue.value && value.value) {
			var fbmbilltype = value.value;
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);
				let fbmbilltype = res.data.card.userjson;	
				//根据票据编号判断票据类型，决定承兑人和承兑人开户行名 到底是显示 银行档案还是客商档案 true 为银承				
					if (fbmbilltype === 'true') {
						//bank 隐藏  acceptunit
						//承兑人
						props.form.setFormItemsVisible(this.formId, {
							acceptunit: false
						});
						props.form.setFormItemsVisible(this.formId, {
							pk_acceptor: true
						});
						//承兑人开户行名
						props.form.setFormItemsVisible(this.formId, {
							signagrbank: true
						});
						props.form.setFormItemsVisible(this.formId, {
							pk_acceptorbank: false
						});
						props.form.setFormItemsValue(this.formId, {
							'acceptunit': {
								display: '',
								value: ''
							},
							'pk_acceptorbank': {
								display: '',
								value: ''
							},
						});
					} else {
						// buis 隐藏 pk_acceptor
						props.form.setFormItemsVisible(this.formId, {
							pk_acceptor: false
						});
						props.form.setFormItemsVisible(this.formId, {
							acceptunit: true
						});
						//承兑人开户行名
						props.form.setFormItemsVisible(this.formId, {
							signagrbank: false
						});
						props.form.setFormItemsVisible(this.formId, {
							pk_acceptorbank: true
						});
						props.form.setFormItemsValue(this.formId, {
							'pk_acceptor': {
								display: '',
								value: ''
							},
							'signagrbank': {
								display: '',
								value: ''
							},
						});
					}
				

			});
			

			
		}
	}else if (key === 'pk_acceptor') {
		this.props.form.setFormItemsValue(this.formId, {
			'acceptorname': {
				value: this.props.form.getFormItemsValue(this.formId, 'pk_acceptor') && this.props.form.getFormItemsValue(this.formId, 'pk_acceptor').display
			},
		}); 
	}else if ( key === 'acceptunit') {
		this.props.form.setFormItemsValue(this.formId, {
			'acceptorname': {
				value: this.props.form.getFormItemsValue(this.formId, 'acceptunit') && this.props.form.getFormItemsValue(this.formId, 'acceptunit').display
			},
		}); 
	}else if ( key === 'acceptaccount'  ) {
		this.props.form.setFormItemsValue(this.formId, {
			'acceptoraccount': {
				value: this.props.form.getFormItemsValue(this.formId, 'acceptaccount').value
			},
		}); 
	}else if ( key === 'acceptorbankaccount') {
		this.props.form.setFormItemsValue(this.formId, {
			'signagrbanknum': {
				value: this.props.form.getFormItemsValue(this.formId, 'acceptorbankaccount').display
			},
		}); 
	}else if ( key === 'signagrbank') {
		this.props.form.setFormItemsValue(this.formId, {
			'signagrbankname': {
				value: this.props.form.getFormItemsValue(this.formId, 'signagrbank') && this.props.form.getFormItemsValue(this.formId, 'signagrbank').display
			},
		}); 
	}else if ( key === 'pk_acceptorbank') {
		this.props.form.setFormItemsValue(this.formId, {
			'signagrbankname': {
				value: this.props.form.getFormItemsValue(this.formId, 'pk_acceptorbank') && this.props.form.getFormItemsValue(this.formId, 'pk_acceptorbank').display
			},
		}); 
	}

}
export function afterEventEdit(props, moduleId, key, value, async = false) {
	if (value.value) {
		if (key === 'pk_org') {
			props.initMetaByPkorg();
			props.form.EmptyAllFormValue(this.formId);
			props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
			props.button.setButtonDisabled(["addRow", "deleteRow"], true);
			props.form.setFormItemsValue(moduleId, {
				pk_org: value,
				pk_org_v: value
			})
			this.props.resMetaAfterPkorgEdit();
		}
	}
}

function setAfterEditFormValue(props, res) {
	let { success, data } = res;
	let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
	let { head, bodys } = card;
	props.form.setAllFormValue({ [this.formId]: head[this.formId] });
	props.cardTable.setAllTabsData(bodys, this.tabOrder);
	setHeadItemProp(props, this.formId, headItemProps);
	setBodyItemProp(props,this.tabCode,bodyItemProps,bodys);
}


/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/