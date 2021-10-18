/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoywsRIzCJJLvkpzPFbHfvs+q*/
import {
	constant,button
} from '../../config/config';
import { BBM_CONST, APP_INFO,BILL_FIELD,REQUEST_URL,BTN,DISABLE_BTN } from '../../cons/constant';
const {  } = BBM_CONST;
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE,CARD_FORMCODE2,CARD_FORMCODE3,
	PRINT_TEMPLATEID,PRINT_FUNCODE,PRINT_NODEKEY } = APP_INFO;
const { PK_NAME,PK_ORG,VBILLNO,BILL_STATUS,TS, } = BILL_FIELD;
const {  QUERY,QUERYBYIDS,QUERYCARD,BBMBX,BBMBXCANCEL,BBMLY,BBMLYCANCEL,BBMZF,BBMZFCANCEL,PRINT } = REQUEST_URL;
const { LY_BTN,LY_GROUP,LYCANCEL_BTN,BX_BTN,BX_GROUP,BXCANCEL_BTN,
	ZF_BTN,ZF_GROUP,ZFCANCEL_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN,REFRESH_BTN } = BTN;
const { REFRESH, BILLSTATUS0, BILLSTATUS1, BILLSTATUS2, BILLSTATUS3 }  = DISABLE_BTN;

export default function clickBtn(props) {
	
	let selectdata = props.table.getCheckedRows(LIST_TABLECODE);
	if (!selectdata || selectdata.length == 0) {
		props.button.setButtonDisabled(REFRESH, true);
	} else if (selectdata.length == 1) {
		// 选择一条数据按钮根据状态可用
		let billstatus
		//处理选择数据
		selectdata.forEach((val) => {
			billstatus = val.data.values[BILL_STATUS].value;
		});
		if (billstatus == '0'|| billstatus == '') {
			// 保存态
			props.button.setButtonDisabled(BILLSTATUS0, false);
		} else if (billstatus == 1) {
			//待审批
			props.button.setButtonDisabled(BILLSTATUS1, false);
		} else if (billstatus == 2) {
			// 待结算
			props.button.setButtonDisabled(BILLSTATUS2, false);

		} else if (billstatus == 3) {
			// 已完毕
			props.button.setButtonDisabled(BILLSTATUS3, false);
		}
	} else {
		let tabCode = this.state.tabInfo;
		if(tabCode == 0){
			//待提交
			props.button.setButtonDisabled(BILLSTATUS0, false);
		}
		if (tabCode == 1) {
			// 审批中
			props.button.setButtonDisabled(BILLSTATUS1, false);
		} else if (tabCode == 2) {
			//待结算
			props.button.setButtonDisabled(BILLSTATUS2, false);
		} else if (tabCode == 3) {
			// 全部
			props.button.setButtonDisabled(BILLSTATUS3, false);
		}
	}
}

/*CcPhbMUwK6EgcIxdk8kv63s4lD0vxLUk6iWCYetBoywsRIzCJJLvkpzPFbHfvs+q*/