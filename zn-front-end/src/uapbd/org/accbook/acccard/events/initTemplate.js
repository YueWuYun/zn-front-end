//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { ajax } from 'nc-lightapp-front';
export default function (props) {
	let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
		 if (status) {
			props.createUIDom(
				{
					pagecode: '101001CB_accbookcard',//页面id
					// appcode:'10120USRM'
				},
				function (data) {
					if (data) {
						if (data.template) {
							let meta = data.template;
							// meta.accountingbookcard.items.forEach(item => {
							// 	item.attrcode == 'pwdlevelcode' && (item.options = pwdlevelcodeReplaceData);
							// 	item.attrcode == 'secondverify' && (item.options = secondverifyReplaceData);
							// 	item.attrcode == 'identityverifycode' && (item.options = firverifyReplaceData);
							// });
							let id = props.getUrlParam('id');
							let accdata = { pk: id, pageid: '101001CB_accbookcard' ,bookproperties :'1'};
							ajax({
								url:  '/nccloud/uapbd/accbook/queryBypk.do',
								data: accdata,
								success: (res) => {
									if (res.data) {
										if(res.data.form.accountingbookcard){ 
											props.form.setAllFormValue({ ["accountingbookcard"]: res.data.form.accountingbookcard});
											let enable = res.data.form.accountingbookcard.rows[0].values.enablestate.value;
											if(status == 'edit'){
												props.form.setFormItemsDisabled('accountingbookcard',{'pk_relorg':true})
												props.form.setFormItemsDisabled('accountingbookcard',{'pk_exratescheme':enable==2,'pk_setofbook':enable==2})
											}
											//state.pk_checkelemsystem = res.data['pk_checkelemsystem'];
										}
										//updateCache("pk_accountingbook",id,res.data.form,'liabilitybook_card','uapbd.org.accbook.acccache');

									} else {
										props.form.EmptyAllFormValue("accountingbookcard");
									}
									//callback&&callback();
									//toggleShow(status);
								
								}
							});
							modifierMeta(props, meta);
							props.meta.setMeta(meta);
							props.form.setFormStatus('accountingbookcard', props.getUrlParam('status'));

						}
						if (data.button) {
							let button = data.button;
							props.button.setButtons(button);
							setButtonStatus(props);
						}
					};
				}
			)
		} else {
			console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
		}
	}
	props.MultiInit.getMultiLang({ moduleId: 'rbac-roletemplet', domainName: 'uap', callback });
}

function modifierMeta(props, meta) {
	// meta.user.items.map((item, key) => {
	// 	meta.user.items.find((item) => item.attrcode == 'pk_org').queryCondition = () => {
	// 		return {
	// 			'TreeRefActionExt': 'nccloud.web.rbac.authres.sqlbuilder.AuthResOrgPermSqlBuilder',
	// 			'DataPowerEnable': true
	// 		};
	// 	};
	// 	meta.user.items.find(
	// 		(item) => item.attrcode == 'pk_base_doc' && item.refcode == 'uapbd/refer/psninfo/PsndocTreeGridRef/index'
	// 	) != undefined && (meta.user.items.find(
	// 		(item) => item.attrcode == 'pk_base_doc' && item.refcode == 'uapbd/refer/psninfo/PsndocTreeGridRef/index'
	// 	).isShowUnit = true);
	// });
}

function setButtonStatus(props) {
	if (props.form.getFormStatus('user') !== 'browse') {
		props.button.setButtonVisible({
			print_third: false
		})
	}
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX