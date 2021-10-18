/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { bodyButtonClick } from "./bodyButtonClick";
import { listButtonVisible } from "./buttonVisible";
import { createPage, ajax, base, toast,excelImportconfig } from 'nc-lightapp-front';
import { list } from '../../cons/constant';

/** 
* 整表编辑页面initTemplate
* @author dongyue7
*/

export default function (props) {
	let _appcode = props.getSearchParam("c") || props.getUrlParam("c");
	let excelimportconfig = excelImportconfig(props, "fbm", '36HO',true,"",{"appcode":_appcode,"pagecode":list.pageCode});
	props.createUIDom(
		{
			pagecode: list.pageCode,//页面code
			appcode: _appcode
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);	
					this.searchOid = meta.search.oid;				
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					listButtonVisible.call(this, props);
					props.button.setUploadConfig("Import", excelimportconfig);
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	if (meta[this.tableId].items) {
		meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
			if (item.attrcode == 'fbmbilltype') {
				item.visible = true;
				item.queryCondition = () => {
					return {
						GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
					};
				};
			}
			return item;
		});
	}

	meta[this.tableId].items.push({
		itemtype: 'customer',
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000016'),/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		itemtype:'customer',
		render: (text, record, index) => {
			let buttonAry = ["DelLine"];	
				
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => bodyButtonClick.call(this, props, key, record)
			});
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/