/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/

import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util";
import { excelImportconfig,cardCache } from 'nc-lightapp-front';
import { LIST_LINK_PAGE,APPCODE,LIST_TABLE_CODE,LIST_SEARCH_CODE,CARD_LINK_PAGE,LIST_INNERBTN,LIST_INNERAREA,DATASOURCE,BILL_TYPE } from "../../cons/const";
import { bobyButtonClick } from "./index";
let { setDefData } =  cardCache


export function initTemplate(props){
	let appcode = this.props.getUrlParam("c")||this.props.getSearchParam("c");
	let that = this;
	let excelimportconfig = excelImportconfig(props, 'fbm', BILL_TYPE, true, '', {
		appcode: appcode,
		pagecode: CARD_LINK_PAGE
	});
    props.createUIDom(
        {
            pagecode:LIST_LINK_PAGE,
            appcode:appcode
        },
        (data)=>{
            if (data) {
				if(!data.template[LIST_TABLE_CODE]){
					return;
                }
                let lineButton = [];
				if (data.button) {
					props.button.setButtons(data.button);
					// props.button.setUploadConfig("Import", excelimportconfig);
					props.button.setPopContent('InnerDelete',this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000019') );/* 国际化处理： 确定要删除吗?*/
					// 导入
					props.button.setUploadConfig('Import', excelimportconfig);
				}
				if (data.template) {	
					let meta = data.template;
					//高级查询区域加载默认业务单元
					// setDefOrg2AdvanceSrchArea(props, LIST_SEARCH_CODE, data);
					meta = modifierMeta.call(that, props, meta, lineButton);
					// modifierSearchMetas(searchId, props, meta, billType, data.context.paramMap ? data.context.paramMap.transtype : null, that);
					props.meta.setMeta(meta);
					//列表查询区域加载默认业务单元
					// setDefOrg2ListSrchArea(props, LIST_SEARCH_CODE, data);
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
	let appcode = this.props.getUrlParam("c")||this.props.getSearchParam("c");
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
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo("/cardlinkq",{
								status: "browse",
								id: record.pk_accept && record.pk_accept.value,
								pagecode: CARD_LINK_PAGE,
							});
						}}
					>
						{record.vbillno && record.vbillno.value}
					</a>
				);
			};
		}
		return item;
	});
	//添加操作列
	meta[LIST_TABLE_CODE].items.push({
		label: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000023'),/* 国际化处理： 操作*/
		itemtype: 'customer',
		attrcode: 'opr',
		width: 200,
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			console.log(record.vbillstatus, 99)
			let buttonAry = [];
			let status = record.vbillstatus && record.vbillstatus.value
			let isVoucher = record.voucher && record.voucher.value
			let isInit = record.initflag && record.initflag.value
			// 自由态
			if (status == '-1') {
				buttonAry = [LIST_INNERBTN.INNEREDIT, LIST_INNERBTN.INNERDELETE, LIST_INNERBTN.INNERCOMMIT];
			}
			// 审批通过
			else if(status == '1' || status == "2" || status == "3"){
				if (status == '1' && isVoucher == false)
					if (isInit == 'Y')
						buttonAry = [LIST_INNERBTN.INNERUNCOMMIT];
					else
						buttonAry = [LIST_INNERBTN.INNERUNCOMMIT,LIST_INNERBTN.INNERVOUCHER];
				else if (status == '1' && isVoucher == true)
					buttonAry = [LIST_INNERBTN.INNERCANCELVOUCHER];
				else
					buttonAry = [LIST_INNERBTN.INNERUNCOMMIT];
			}
			return props.button.createOprationButton(buttonAry, {
				area: LIST_INNERAREA,
				buttonLimit: 3,
				onButtonClick: (props, key) => bobyButtonClick.call(that, props, key, text, record, index)
			});
		}

	});
	return meta;
}
/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/