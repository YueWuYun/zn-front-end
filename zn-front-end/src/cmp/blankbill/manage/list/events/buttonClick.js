/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {
	ajax,
	toast,
	print,
	getBusinessInfo,
	promptBox,
	output
} from 'nc-lightapp-front';
import refresh from './refresh.js';
import { BatchToast } from '../../../../public/CMPMessage';
import { commondata } from '../../../../public/utils/constant';
import { BBM_LY, BBM_LYCANCEL, BBM_BX, BBM_BXCANCEL, BBM_ZF, BBM_ZFCANCEL } from '../btnclick/btnclick';
const { BLANKBILL_LYCANCEL,BLANKBILL_BXCANCEL,BLANKBILL_ZFCANCEL } = commondata;
import { BBM_CONST, APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const {  } = BBM_CONST;
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE,CARD_FORMCODE2,CARD_FORMCODE3,
	PRINT_TEMPLATEID,PRINT_FUNCODE,PRINT_NODEKEY, BX_PAGECODE, ZF_PAGECODE,LY_PAGECODE } = APP_INFO;
const { PK_NAME,PK_ORG,VBILLNO,BILL_STATUS,TS, } = BILL_FIELD;
const {  BBMLYCANCEL,PRINT,LY_VALIDATE, BX_VALIDATE,ZF_VALIDATE } = REQUEST_URL;
const { LY_BTN,LY_GROUP,LYCANCEL_BTN,BX_BTN,BX_GROUP,BXCANCEL_BTN,ZF_BTN,ZF_GROUP,ZFCANCEL_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN,REFRESH_BTN } = BTN;

const businessInfo = getBusinessInfo();
export default function buttonClick(props, id) {
	const selectDatas = props.table.getCheckedRows(LIST_TABLECODE);
	function checkNoSelected() {
		//判断是否有选中行
		if (selectDatas == null || selectDatas.length == 0) {
			toast({ 
				color: 'warning', 
				content: this.state.json['36070BBM-000006']
			});/* 国际化处理： 请选择数据！*/
			return false;
		}
		return true;
	}

	//构建请求数据
	function dataBuild() {
		let pageid = LIST_PAGECODE;
		let pks = [];
		let pkMapTs = {};
		let pkMapVbillno = {};
		let pkMapRowIndex = {};
		let index = 0;
		let pk, ts, vbillno;

		while (index < selectDatas.length) {
			//获取行主键值
			pk =
				selectDatas[index] &&
				selectDatas[index].data &&
				selectDatas[index].data.values &&
				selectDatas[index].data.values[PK_NAME] &&
				selectDatas[index].data.values[PK_NAME].value;
			pks.push(pk);
			//获取行ts时间戳
			ts =
				selectDatas[index] &&
				selectDatas[index].data &&
				selectDatas[index].data.values &&
				selectDatas[index].data.values.ts &&
				selectDatas[index].data.values.ts.value;
			//单据编号
			vbillno =
				selectDatas[index] &&
				selectDatas[index].data &&
				selectDatas[index].data.values &&
				selectDatas[index].data.values[VBILLNO] &&
				selectDatas[index].data.values[VBILLNO].value;
			pkMapRowIndex[pk] = selectDatas[index].index;
			//判空
			if (pk && ts) {
				pkMapTs[pk] = ts;
			}
			if (pk && vbillno) {
				pkMapVbillno[pk] = vbillno;
			}
			index++;
		}
		let data = {
			pkMapRowIndex,
			pkMapTs,
			pkMapVbillno,
			pageid,
			pks,
		};
		return data;
	}

	switch (id) {
	
			// 报销
		case BX_BTN:
			//数据校验
			if (!checkNoSelected()) {
				return;
			}
			let bxdata = dataBuild();
			ajax({
				url: BX_VALIDATE,
				data: bxdata,
				success: (res) => {
					BBM_BX.call(this, props, bxdata.pks);
				}
			});
			this.emptychoicebox();
			break;

			// 取消报销
		case BXCANCEL_BTN:
			if (!checkNoSelected()) {
				return;
			}
			BBM_BXCANCEL.call(this, props, dataBuild());
			this.emptychoicebox();
			break;

		// 领用
		case LY_BTN:
			if (!checkNoSelected()) {
				return;
			}
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
			if (!checkNoSelected()) {
				return;
			}
			BBM_LYCANCEL.call(this, props, dataBuild());
			this.emptychoicebox();
			break;

			// 作废
		case ZF_BTN:
			if (!checkNoSelected()) {
				return;
			}
			let zfdata = dataBuild();
			ajax({
				url: ZF_VALIDATE,
				data: zfdata,
				success: (res) => {
					BBM_ZF.call(this, props, zfdata.pks);
				}
			});
			this.emptychoicebox();
			break;

			// 取消作废
		case ZFCANCEL_BTN:
			if (!checkNoSelected()) {
				return;
			}
			BBM_ZFCANCEL.call(this, props, dataBuild());
			this.emptychoicebox();
			break;

			// 打印
		case PRINT_BTN:
			if (!checkNoSelected()) {
				return;
			}
			let printData = dataBuild();
			print('pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				PRINT, {
					// billtype: billtype, //单据类型
					// funcode: printfuncode, //功能节点编码，即模板编码
					appcode: APPCODE, //appcode
					nodekey: PRINT_NODEKEY, //模板节点标识
					// printTemplateID: printtemplateid, //模板id
					oids: printData.pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;

			// 输出
		case OUTPUT_BTN:
			if (!checkNoSelected()) {
				return;
			}
			let putputData = dataBuild();
			output({
				url: PRINT,
				data: {
					nodekey: PRINT_NODEKEY,
					appcode: APPCODE,
					oids: putputData.pks,
					outputType: 'output'
				}
			});
			break;

			//刷新
		case REFRESH_BTN:
			// this.refreshHtml();
			refresh.call(this, props);
			break;
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/