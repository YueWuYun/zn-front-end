/*cv6e9Z//nsNvqsrWbMcZRPFkCRzt0Z8ywQJPvOubDYrMYbFWUyw6JoCMyP3yRHBs*/
import { toast, ajax, cacheTools } from 'nc-lightapp-front';
import { VoucherDataConst } from '../cons/moduleConstant';
import { loadMultiLang } from './index'
/**
 * 联查工具
 * @author tangleic
 * @version 1.0
 */


/**
 * 制单打开小应用
 * @param {*} props 页面内置对象
 * @param {*} srcAppcode 小应用编码
 * @param {*} billId 单据ID
 * @param {*} tradeType  单据交易类型
 * 
 */
export const MakeBillApp = function (props, srcAppcode, billId, tradeType,tableName1,pkfieldName,pkvalues) {
	const base_url = '/nccloud/tmpub/pub/';
	let data = madeData(billId, tradeType);
	//cmp_zhanghjr_begin:结算报销单特殊制单
	if (srcAppcode && srcAppcode == '360704SM') {
		data = bzMadeData(billId, tradeType);
	}
	//cmp_zhanghjr_end
	//console.log(loadMultiLang(props, '3601-000005'));
	ajax({
		url: base_url + 'makebill.do',
		data: {
			appCode: VoucherDataConst.appcode,
			pageCode: VoucherDataConst.pagecode,
			extensParam: data,
			btncode:'makebillBtn',
			pk:billId,
			tableName:tableName1,
			pkfieldName:pkfieldName,
			pkvalues:pkvalues
		},
		success: (res) => {
			let { data } = res;
			if (!data) {
				return;
			}
			// let srccode = srcAppcode + '_MadeBill2019';
			// cacheTools.set(srcAppcode + '_MadeBill2019',data.pklist);
			let srccode = srcAppcode + res.data.cachekey;
			cacheTools.set(srcAppcode + res.data.cachekey, data.pklist);

			//跳转
			props.openTo(data.url, {
				status: 'edit',
				appcode: data.appcode,
				pagecode: data.pagecode,
				n: loadMultiLang(props, '3601-000005'),//'凭证生成'
				scene: srccode
			});
		}
	});
};
/**
 * 制单应用参数
 * @param {*} props 页面内置对象
 * @param {*} 
 * @param {*} 
 */
export const madeDatas = function (record, tradeName, pkName) {

	let obj = {};
	let key = null;
	record.forEach((item) => {
		key = item[tradeName].value;
		if (obj[key]) {
			obj[key].push(item[pkName].value);
		} else {
			obj[key] = [key, item[pkName].value]
		}

	});
	//console.log(Object.values(obj));
	return Object.values(obj);
};

/**
 * 制单应用参数
 * @param {*} props 页面内置对象
 * @param {*} 
 * @param {*} 
 */
export const madeData = function (billId, tradeType) {
	let makebillArr = [];
	let data = [];
	makebillArr.push(tradeType);
	makebillArr.push(billId);
	data.push(makebillArr);
	return data;
};
/**
 * 制单应用参数--->结算报销单
 * @param {*} props 页面内置对象
 * @param {*} 
 * @param {*} 
 */
export const bzMadeData = function (billId, tradeType) {
	let makebillArr = [];
	let data = [];
	makebillArr.push(tradeType);
	makebillArr.push(billId);
	if (tradeType && tradeType.startsWith('26')) {
		//报销单
		for (let n = 0; n <= 8; n++) {
			makebillArr.push(billId + '_' + n);
		}
	}
	data.push(makebillArr);
	return data;
};

/*cv6e9Z//nsNvqsrWbMcZRPFkCRzt0Z8ywQJPvOubDYrMYbFWUyw6JoCMyP3yRHBs*/