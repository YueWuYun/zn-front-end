/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {
	ajax,
	base,
	toast,
	print,
	promptBox,
	output
} from 'nc-lightapp-front';
import {
	constant,
	requesturl,
	btn
} from '../../config/config';
import {
	commondata
} from '../../../../public/utils/constant';
const { BLANKBILL_LYCANCEL,BLANKBILL_BXCANCEL,BLANKBILL_ZFCANCEL } = commondata;
import { BatchToast } from '../../../../public/CMPMessage';
import { BBM_LY, BBM_LYCANCEL, BBM_BX, BBM_BXCANCEL, BBM_ZF, BBM_ZFCANCEL } from '../btnclick/btnclick';
import { BBM_CONST, APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const { BBM_CACHEKEY } = BBM_CONST;
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE,CARD_FORMCODE2,CARD_FORMCODE3,
	PRINT_TEMPLATEID,PRINT_FUNCODE,PRINT_NODEKEY,BX_PAGECODE } = APP_INFO;
const { PK_NAME,PK_ORG,VBILLNO,BILL_STATUS,TS, } = BILL_FIELD;
const {  QUERY,QUERYBYIDS,QUERYCARD,BBMBX,BBMBXCANCEL,BBMLY,BBMLYCANCEL,BBMZF,BBMZFCANCEL,PRINT,LY_VALIDATE, BX_VALIDATE,ZF_VALIDATE  } = REQUEST_URL;
const { LY_BTN,LY_GROUP,LYCANCEL_BTN,BX_BTN,BX_GROUP,BXCANCEL_BTN,ZF_BTN,ZF_GROUP,ZFCANCEL_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN,REFRESH_BTN } = BTN;

export default function (props, id) {
	let status = props.getUrlParam('status');
	let pk = props.form.getFormItemsValue(CARD_FORMCODE, PK_NAME).value;
	let ts = props.form.getFormItemsValue(CARD_FORMCODE, TS).value;
		//构建请求数据
	function dataBuild() {
		let pks = [];
		let pkMapTs = {};
		pkMapTs[pk] = ts;
		pks.push(pk);
		let data = {
			pkMapTs: pkMapTs,
			ts: ts,
			pageid: CARD__PAGECODE,
			pk: pk,
			pks: pks
		};
		return data;
	}
	function getpks(){
		let pks = [];
		pks.push(pk);
		return pks;
	}
	switch (id) {
			// 报销
		case BX_BTN:
			let bxdata = dataBuild();
			ajax({
				url: BX_VALIDATE,
				data: bxdata,
				success: (res) => {
					BBM_BX.call(this, props, bxdata.pks);
				}
			});
			break;
		// 取消报销
	case BXCANCEL_BTN:
		ajax({
			url: BBMBXCANCEL,
			data: dataBuild(),
			success: (res) => {
				let { success, data } = res;
				if (success) {
					toast({
						color: 'success',
						content: this.state.json['36070BBM-000010']
					}); /* 国际化处理： 取消报销成功*/
					this.buttonAfter(data.head);
				}
			}
		});
		
		break;

	// 领用
	case LY_BTN:
		let lydata = dataBuild();
		ajax({
			url: LY_VALIDATE,
			data: lydata,
			success: (res) => {
				BBM_LY.call(this, props, lydata);
			}
		});
		break;
	// 取消领用
	case LYCANCEL_BTN:
		ajax({
			url: BBMLYCANCEL,
			data: dataBuild(),
			success: (res) => {
				let { success, data } = res;
				if (success) {
					toast({
						color: 'success',
						content: this.state.json['36070BBM-000009'] 
					}); /* 国际化处理： 取消领用成功*/
					this.buttonAfter(data.head);
				}
			}
		});
		break;

		// 作废
	case ZF_BTN:
		let zfdata = dataBuild();
		ajax({
			url: ZF_VALIDATE,
			data: zfdata,
			success: (res) => {
				BBM_ZF.call(this, props, zfdata.pks);
			}
		});
		break;

		// 取消作废
	case ZFCANCEL_BTN:
		ajax({
			url: BBMZFCANCEL,
			data: dataBuild(),
			success: (res) => {
				let { success, data } = res;
				if (success) {
					toast({
						color: 'success',
						content: this.state.json['36070BBM-000011'] 
					}); /* 国际化处理： 取消作废成功*/
					this.buttonAfter(data.head);
				}
			}
		});
		break;
			// 打印
	case PRINT_BTN:
		print('pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
			PRINT, 
			{
				// billtype: billtype, //单据类型
				// funcode: printfuncode, //功能节点编码，即模板编码
				appcode: APPCODE, //appcode
				nodekey: PRINT_NODEKEY, //模板节点标识
				// printTemplateID: printtemplateid, //模板id
				oids: [this.props.form.getFormItemsValue(this.formId, PK_NAME).value]
			}
		);
		break;
			// 输出
	case OUTPUT_BTN:
		output({
			url: PRINT,
			data: {
				nodekey: PRINT_NODEKEY,
				appcode: APPCODE,
				oids: [this.props.form.getFormItemsValue(this.formId, PK_NAME).value],
				outputType: 'output'
			}
		});
		break;
		// 刷新
	case REFRESH_BTN:
		this.refreshrender();
		break;
	default:
		break;
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/