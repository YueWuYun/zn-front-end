/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax,cardCache } from 'nc-lightapp-front';
import { buttonVisible } from './buttonVisible';
let { getCacheById, updateCache } = cardCache;
import { BBM_CONST, APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const {  } = BBM_CONST;
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE,CARD_FORMCODE2,CARD_FORMCODE3,
	PRINT_TEMPLATEID,PRINT_FUNCODE,PRINT_NODEKEY } = APP_INFO;
const { PK_NAME,PK_ORG,VBILLNO,BILL_STATUS,TS, } = BILL_FIELD;
const {  QUERY,QUERYBYIDS,QUERYCARD,BBMBX,BBMBXCANCEL,BBMLY,BBMLYCANCEL,BBMZF,BBMZFCANCEL,PRINT } = REQUEST_URL;
const { LY_BTN,LY_GROUP,LYCANCEL_BTN,BX_BTN,BX_GROUP,BXCANCEL_BTN,ZF_BTN,ZF_GROUP,ZFCANCEL_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN,REFRESH_BTN } = BTN;

export default function(props, pks) {
	// 后台还没更新，暂不可用
	let data = {
		pk: pks,
		pageCode: CARD__PAGECODE
	};
	let cardData = getCacheById(pks, this.cacheDataSource);
	if(cardData){
		this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
		let billstatus = cardData.head[this.formId][BILL_STATUS].value;
		buttonVisible(props,billstatus);
	}else{
		ajax({
			url: QUERYCARD,
			data: data,
			success: (res) => {
				if (res) {
					if (res.data) {
						this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
						let billno = res.data[this.formId].rows[0].values[VBILLNO].value;
						let id = res.data[this.formId].rows[0].values[PK_NAME].value;
						let billstatus = res.data[this.formId].rows[0].values[BILL_STATUS].value;
						this.props.BillHeadInfo.setBillHeadInfoVisible({
							// showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
							showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
							billCode: billno  //修改单据号---非必传
						});
						//动态修改地址栏中的id的值
						props.setUrlParam(pks);
						// 更改按钮
						buttonVisible(props,billstatus);
						updateCache(this.pkname, id, this.formId, this.cacheDataSource);
					}
				} else {
					this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
				}
			}
		});
	}
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/