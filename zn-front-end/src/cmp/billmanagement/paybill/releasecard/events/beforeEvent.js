/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/
import { ajax, toast } from 'nc-lightapp-front';

import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url,
	list_page_url,
	card_page_url
} from '../../cons/constant.js';

export default function beforeEvent(props, moduleId, key, value, data) {
	if (key === 'objecttype') {
	 let org=props.form.getFormItemsValue('head', 'pk_org').value;	
	 ajax({
		url: '/nccloud/cmp/pub/getpara.do',
		//参数返回类型type， int ,string,boolean
		//组织pk_org
		//参数编码paracode 
		data:{paracode:'CMP49',pk_org:org,type:'boolean'},
		success: function (res) {
			let { success, data } = res;
			if(res.data.CMP49){

				let meta = props.meta.getMeta();
				let item = meta['head'].items.find(e=>e.attrcode==='objecttype')
				  item.options=[{
					"display": this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000000'),/* 国际化处理： 客户*/
					"value": "0"
				},
				{
					"display": this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000001'),/* 国际化处理： 供应商*/
					"value": "1"
				},
				{
					"display": this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000002'),/* 国际化处理： 部门*/
					"value": "2"
				},
				{
					"display": this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000003'),/* 国际化处理： 人员*/
					"value": "3"
				},
				{
					"display": this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000004'),/* 国际化处理： 散户*/
					"value": "4"
				}
			]
			}
		}
	});
	}
	return true;
}


/*mgBVjmwkvoNAq04L4PpN6Wa9KyXZnGT3WOcrmUaUX2dcmxnO/FxD5XL7qdmEeutg*/