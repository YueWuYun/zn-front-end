/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { bodyButtonClick } from './bodyButtonClick';
import { createPage, ajax, base, toast, cardCache,excelImportconfig} from 'nc-lightapp-front';
import { list, card, appCode, btnLimit, javaUrl, baseReqUrl } from '../../cons/constant.js';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea, go2CardCheck } from '../../../../../tmpub/pub/util/index';
import { COMMON_BTN,BTN_AREA } from '../../cons/constant';
import { buttonDisabled } from './ButtonClick';
const { EDIT_INNER_BTN, DELETE_INNER_BTN, CONFIRM_INNER_BTN, UNCONFIRM_INNER_BTN } = COMMON_BTN;

export default function (props) {
	let excelimportconfig = excelImportconfig(props, "ifac", '36E8',true,"",
	{"appcode":appCode,"pagecode":card.pageCode});
	props.createUIDom(
		{
			pagecode: this.pageId,//页面code
			appcode: appCode
		},
		(data) => {console.log(data, 'data')
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta)
					setDefOrg2AdvanceSrchArea(props, this.searchId, data);
					props.meta.setMeta(meta);
					setDefOrg2ListSrchArea(props, this.searchId, data);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent(DELETE_INNER_BTN, this.state.json['36140FDLI-000004']);/* 国际化处理： 确定要删除吗？*/
					props.button.setUploadConfig("ImportData", excelimportconfig);
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	meta[this.searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	// meta[this.searchId].items.find((e) => e.attrcode === 'pk_org').queryCondition = {
	// 	funcode: props.getSearchParam('c'),//appcode获取
	// 	TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
	// };
	//查询区域参照过滤
	meta[this.searchId].items.map((item) => {
		item.isShowDisabledData = true;
		//资金组织参照过滤
		if (item.attrcode == 'pk_org') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					funcode: appCode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				}
			}
		}
	});
	meta[this.tableId].pagination = true;
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		//item.width = 150;
		if (item.attrcode == 'depositcode') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ color: '#007ace', cursor: 'pointer',overflow:'hidden','text-overflow':'ellipsis' }}
						onClick={() => {
							go2CardCheck({
								url: `${baseReqUrl}${javaUrl.check2card}.do`,
								pk: record[this.primaryId].value,
								ts: record.ts.value,
								checkTS: record.ts.value ? true : false,
								fieldPK: 'pk_fixdepostopening',
								checkSaga: false,
								go2CardFunc: () =>{
									props.pushTo("/card", {
										status: "browse",
										id: record[this.primaryId].value,
										pagecode: card.pageCode
									});
								}
							})
						}}
					>
						{record && record.depositcode && record.depositcode.value}
					</a>
				);
			};
		}
		return item;
	});
	
	//添加操作列
	meta[this.tableId].items.push({
		attrcode: 'opr',
		label: this.state.json['36140FDLI-000019'],/* 国际化处理： 操作*/
		width: 250,
		fixed: 'right',
		className: "table-opr",
		itemtype:'customer',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [];
            let vbillstatus = record.vbillstatus && record.vbillstatus.value;
            let billstate = record.billstate && record.billstate.value;
            switch (billstate) {
                case "1": //待确认
                    buttonAry = [ EDIT_INNER_BTN, DELETE_INNER_BTN, CONFIRM_INNER_BTN ];
                    break;
                case "2": //已确认
                    buttonAry = [UNCONFIRM_INNER_BTN];
                    break;
                default:
                    break;
            }
			
			return props.button.createOprationButton(buttonAry, {
				area: list.bodyCode,
				buttonLimit: btnLimit,
				onButtonClick: (props, key) => bodyButtonClick.call( this,props, key, record, index)
			});
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/