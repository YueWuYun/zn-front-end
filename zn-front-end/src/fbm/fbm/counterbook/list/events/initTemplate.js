/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { LIST_PAGE_CODE,LIST_SEARCH_CODE, LIST_TABLE_CODE,APP_CODE,LINK_CARD_PAGE_CODE,DATASOURCE, CARD_PAGE_CODE, BILL_TYPE} from "./../../cons/constant"
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util";
import { bobyButtonClick } from "./bobyButtonClick";
import { excelImportconfig,cardCache } from 'nc-lightapp-front';
let { setDefData } =  cardCache


export function initTemplate(props){
	let that = this;
	let excelimportconfig = excelImportconfig(props, "fbm", BILL_TYPE,true,"",{"appcode":APP_CODE,"pagecode":LIST_PAGE_CODE});
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
    props.createUIDom(
        {
			pagecode:LIST_PAGE_CODE,
			appcode: appcode,//注册按钮的id
        },
        (data) =>  {
			if (data) {
				if(!data.template[LIST_TABLE_CODE]){
					return;
				}
				let lineButton = [];
				if (data.button) {
					props.button.setButtons(data.button);
					props.button.setUploadConfig("Import", excelimportconfig);
				}
				if (data.template) {	
					let meta = data.template;
					//高级查询区域加载默认业务单元
					setDefOrg2AdvanceSrchArea(props, LIST_SEARCH_CODE, data);
					meta = modifierMeta.call(that, props, meta, lineButton);
					// modifierSearchMetas(searchId, props, meta, billType, data.context.paramMap ? data.context.paramMap.transtype : null, that);
					props.meta.setMeta(meta);
					//列表查询区域加载默认业务单元
					setDefOrg2ListSrchArea(props, LIST_SEARCH_CODE, data);
				}

				if (data.context) {
					//context信息中包含小应用的一些信息，可根据此信息进行特殊处理
				}
				
			}
		} 
    )
}

function modifierMeta(props, meta, lineButton) {
	let that = this;
	let appcode = props.getUrlParam("c")||this.props.getSearchParam("c");
	meta[LIST_SEARCH_CODE].items.map(item => {
		if (item.attrcode === 'pk_org') { //财务组织过滤
			item.isMultiSelectedEnabled = true; //财务组织多选
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
	});
	meta[LIST_TABLE_CODE].items = meta[LIST_TABLE_CODE].items.map((item, key) => {
		if (item.attrcode == 'fbmbillno') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo("/card",{
								status: "browse",
								id: record.pk_register && record.pk_register.value,
								pagecode: CARD_PAGE_CODE,
							});
						}}
					>
						{record.fbmbillno && record.fbmbillno.value}
					</a>
				);
			};
		}
		return item;
	});
	// //添加操作列
	// meta[LIST_TABLE_CODE].items.push({
	// 	label: this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000002'),/* 国际化处理： 操作*/
	// 	itemtype: 'customer',
	// 	attrcode: 'opr',
	// 	width: 200,
	// 	visible: true,
	// 	fixed: 'right',
	// 	render: (text, record, index) => {
	// 		let buttonAry = lineButton ? lineButton : [];
	// 		let trueBtn = [];
	// 		for (let i = 0; i < buttonAry.length; i++) {
	// 			let flag = buttonVisible('browse', record, buttonAry[i]);
	// 			if (flag) {
	// 				trueBtn.push(buttonAry[i]);
	// 			}
	// 		};
	// 		return props.button.createOprationButton(trueBtn, {
	// 			area: "list_inner",
	// 			buttonLimit: 3,
	// 			onButtonClick: (props, key) => bobyButtonClick.call(that, props, key, text, record, index)
	// 		});
	// 	}

	// });
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/