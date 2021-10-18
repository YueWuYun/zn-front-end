/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { BatchToast } from '../../../../public/CMPMessage';
import { BBM_LY, BBM_LYCANCEL, BBM_BX, BBM_BXCANCEL, BBM_ZF, BBM_ZFCANCEL } from '../btnclick/btnclick';
import { BBM_CONST, APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const {  } = BBM_CONST;
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE,CARD_FORMCODE2,CARD_FORMCODE3,
	PRINT_TEMPLATEID,PRINT_FUNCODE,PRINT_NODEKEY } = APP_INFO;
const { PK_NAME,PK_ORG,VBILLNO,BILL_STATUS,TS, } = BILL_FIELD;
const { LY_VALIDATE, BX_VALIDATE, ZF_VALIDATE } = REQUEST_URL;
const { LY_INNER_BTN,LYCANCEL_INNER_BTN,BX_INNSER_BTN,BXCANCEL_INNER_BTN,ZF_INNER_BTN,ZFCANCEL_INNER_BTN } = BTN;

export default function tableButtonClick(props, key, text, record, index) {
	//缓存相关
	let { deleteCacheId } = props.table;
		//构建请求数据
	function dataBuild() {
		let pageid = LIST_PAGECODE;
		let pkMapTs = {};
		let pkMapRowIndex = {};
		let pks = [];
		let pk = record[PK_NAME].value;
		pks.push(pk);
		pkMapRowIndex[pk] = index;
		pkMapTs[pk] = record[TS].value;

		let data = {
			pkMapRowIndex,
			pkMapTs,
			pageid,
			pks
		};
		return data;
	}
	switch (key) {
		// 领用
		case LY_INNER_BTN:
			let lydata = dataBuild();
			ajax({
				url: LY_VALIDATE,
				data: lydata,
				success: (res) => {
					BBM_LY.call(this, props, lydata);
				}
			});
			// BBM_LY.call(this, props, dataBuild());
			break;
			// 取消领用
		case LYCANCEL_INNER_BTN:
			BBM_LYCANCEL.call(this, props, dataBuild());
			break;
			// 报销
		case BX_INNSER_BTN:
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
		case BXCANCEL_INNER_BTN:
			BBM_BXCANCEL.call(this, props, dataBuild());
			break;
			// 作废
		case ZF_INNER_BTN:
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
		case ZFCANCEL_INNER_BTN:
			BBM_ZFCANCEL.call(this, props, dataBuild());
			break;
	}
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/