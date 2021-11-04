//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { ajax,base,getBusinessInfo,toast,promptBox,excelImportconfig } from 'nc-lightapp-front';
import Utils from '../../../../public/utils';
const { NCPopconfirm, NCIcon, NCModal } = base;

export default function (props) { 
	let excelimportconfig=excelImportconfig(props,"riaam","org_accbook",true,"",{"appcode":"101001CB","pagecode":"10120USRM_card"})
	let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
		if (status) {
			props.createUIDom(
				{
					pagecode: '101001CB_accbook',//页面id
					// appcode: '10120USRM',
				},
				function (data) {
					if (data) {
						if (data.button) {
							let button = data.button;
							// button.push({
							// 	"id": "0001A41000000006G7XX",
							// 	"type": "general_btn",
							// 	"key": "mobileapprove",
							// 	"title": "移动升级按钮勿动",
							// 	"area": "page_header",
							// 	"parentCode": "print1",
							// 	"children": []
							// });
							props.button.setButtons(button);
							props.button.setUploadConfig('import', excelimportconfig)
						}
						if (data.template) {				
							let meta = data.template;
							meta.accbooklist.pagination = true;
							modifierMeta(props,meta,json);
							props.meta.setMeta(meta);
						}
					}
				}
			)
		} else {
			console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
		}
	}
	props.MultiInit.getMultiLang({moduleId: 'user-001',domainName: 'uap',callback});
}

function modifierMeta(props, meta ,json) {
	meta.accbook_search.items.map((item,key)=>{
		meta.accbook_search.items.find((item) => item.attrcode == 'pk_relorg').queryCondition = () => {
			return {
				'TreeRefActionExt':'nccloud.web.rbac.authres.sqlbuilder.AuthResOrgPermSqlBuilder',
				'DataPowerEnable':true
			};
		};
	});
	let material_event = {
        label: json['1880000025-000029'],/* 国际化处理： 操作*/
        itemtype: 'customer',
        attrcode: 'opr',
        width: '150px',
        visible: true,
        fixed: 'right',
        render: (text, record, index) => {
			let buttonAry = [ "edit", "copy", "resetuserpsw",'del'];
			if(record.showflag&&!record.showflag.value){
				buttonAry.push('disrole');
			}
			if(record.islocked.value){
				buttonAry.push('unLock');
			}else{
				buttonAry.push('lock');
			}
			if(record.enablestate.value=='3'){
				buttonAry.push('enable');
			}
			if(record.enablestate.value=='2'){
				buttonAry.push('disable');
			}
            return props.button.createOprationButton(buttonAry, {
                area: "page_body",
                buttonLimit: 3,
                onButtonClick: (props, key) => tableButtonClick(props, key, text, record, index, json)
            });
        }
	};
// 	props.button.setPopContent('del', json['1880000025-000030']);/* 国际化处理： 确认删除?*/
// 	meta.user.items.push(material_event);
// 	meta.user.items.map((item, key)=>{
// 		if(item.attrcode=='user_code'){
// 			item.renderStatus='browse';
// 			item.render=(text, record, index) => {
// 				return (
// 					<a 
// 						style={{ textDecoration: 'underline', cursor: 'pointer' }}
// 						onClick={()=>{
// 							props.pushTo('/card', {
// 								status: 'browse',
// 								pagecode: '10120USRM_card',
// 								id: record.cuserid.value,
// 							});
// 						}}
// 					>
// 						{record.user_code.value}
// 					</a>
// 				);
// 			}
// 		}
// 	})
    return meta;
}

function tableButtonClick(props, key, text, record, index, json) {
	let businessInfo = getBusinessInfo();
	let cur_pk_group = businessInfo.groupId;
	let cuserid = record.cuserid.value;
	let user_name = record.user_name.value;
	let pk_group = record.pk_group.value;
	let data = {};
	switch (key) {
		case 'edit':
			if(cur_pk_group!=pk_group){
				toast({content:json['1880000025-000000'],color:'warning'});/* 国际化处理： 共享用户，不可被修改*/
			}else{
				props.pushTo('/card', {
					status: 'edit',
					pagecode: '10120USRM_card',
					id: cuserid,
				});
			}
			break;
		case 'accAdd':
			
			break;
	}
}
//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX