//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;

let tableId = 'formatdocdata';


export default function (props) {
    let that = this;
    let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
        if(status){
            props.createUIDom(
                {
                    pagecode: '10140LFOR_LIST',//页面id
                    appcode: '10140LFOR'  // 应用编码
                },
                function (data) {
                    if (data) {
                        if (data.button) {
                            let button = data.button;
                            props.button.setButtons(button);
                        }
                        if (data.template) {
                            let meta = data.template;
                            // meta.formatdocdata.pagination = true;
							modifierMeta(props,meta,json);
                            props.meta.setMeta(meta);
                        }
                    }
                }
            )
        }

	}
	props.MultiInit.getMultiLang({ moduleId: 'xi-exsystem', domainName: 'uap', callback });
}

function modifierMeta(props, meta ,json) {
	// meta.searchArea.items.map((item,key)=>{
	// 	meta.searchArea.items.find((item) => item.attrcode == 'pk_org').queryCondition = () => {
	// 		return {
	// 			'TreeRefActionExt':'nccloud.web.rbac.authres.sqlbuilder.AuthResOrgPermSqlBuilder',
	// 			'DataPowerEnable':true
	// 		};
	// 	};
	// });
	let material_event = {
        //label: json['1880000025-000029'],/* 国际化处理： 操作*/
        label: '操作',
        itemtype: 'customer',
        attrcode: 'opr',
        width: '150px',
        visible: true,
        fixed: 'right',
        render: (text, record, index) => {
			let buttonAry = [ "edit_opr",'del_opr'];
			// if(record.showflag&&!record.showflag.value){
			// 	buttonAry.push('disrole');
			// }
			// if(record.islocked.value){
			// 	buttonAry.push('unLock');
			// }else{
			// 	buttonAry.push('lock');
			// }
			// if(record.enablestate.value=='3'){
			// 	buttonAry.push('enable');
			// }
			// if(record.enablestate.value=='2'){
			// 	buttonAry.push('disable');
			// }
            return props.button.createOprationButton(buttonAry, {
                area: "page_body",
                buttonLimit: 3,
                onButtonClick: (props, key) => tableButtonClick(props, key, text, record, index, json)
            });
        }
	};
	props.button.setPopContent('del', json['1880000025-000030']);/* 国际化处理： 确认删除?*/
	meta.formatdocdata.items.push(material_event);
	meta.formatdocdata.items.map((item, key)=>{
		if(item.attrcode=='code'){
			item.renderStatus='browse';
			item.render=(text, record, index) => {
				return (
					<a 
						style={{ textDecoration: 'underline', cursor: 'pointer' }}
						onClick={()=>{
							props.pushTo('/card', {
								status: 'browse',
								pk: record.pk_formatdoc.value,
							});
						}}
					>
						{record.code.value}
					</a>
				);
			}
		}
	})
    return meta;
}

function tableButtonClick(props, key, text, record, index, json) {
    let pk_formatdoc = record.pk_formatdoc.value;
	let data = {};
	switch (key) {
		case 'edit_opr':
				props.pushTo('/card', {
					status: 'edit',
					pk: pk_formatdoc
				});
			break;
		
		case 'del_opr':debugger;
				data = { pk_formatdoc:pk_formatdoc };
				ajax({
					url: '/nccloud/uapbd/formatdoc/formatdocDelete.do',
					data:data,
					success: function(res) {
						let { success, data } = res;
						if (success) {
						 	props.table.deleteTableRowsByIndex('formatdocdata', index);
							let {deleteCacheId} = props.table;
							deleteCacheId('formatdocdata',pk_formatdoc);
						 }
					}
				});
			break;
	}
}


//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX