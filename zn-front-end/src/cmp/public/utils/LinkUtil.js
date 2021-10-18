/*YrJL5OrjjhJMWstC/fesK+dPDxkKZ20f/mSFGqfmpXbvWbF9uh8RUXcXataBW0kq*/
import { toast, ajax, cacheTools } from 'nc-lightapp-front';
import { VoucherDataConst } from '../cons/moduleConstant';
/**
 * 联查工具
 * @author tangleic
 * @version 1.0
 */

/**
 * 联查打开小应用
 * @param {*} props 页面内置对象
 * @param {*} billtypeortranstype 单据类型或交易类型
 * @param {*} pkArr 单据主键数组
 * @param {*} urlExtParam 地址栏拓展属性
 */
export const linkApp = function (props, billTypeOrTransType, pks, urlExtParam) {
	const base_url = '/nccloud/tmpub/pub/';
	ajax({
		url: base_url + 'qrylinkinfo.do',
		data: { billTypeOrTransType, pks },
		success: (res) => {
			let { data } = res;
			if (!data) {
				return;
			}
			let { url, pks, appCode, linkPageCode } = data;
			if (!urlExtParam || Object.keys(urlExtParam).length == 0) {
				urlExtParam = {};
			}
			urlExtParam['appcode'] = appCode;
			urlExtParam['pagecode'] = linkPageCode;
			urlExtParam['ids'] = pks;
			//begin tm tangleic 地址平台会根据appcode和pagecode来获取，故无需指定小应用url
			// props.openTo(url, urlExtParam);
			props.openTo(null, urlExtParam);
			//end tangleic 
		}
	});
};

/**
 * 联查凭证打开小应用
 * @param {*} props 页面内置对象
 * @param {*} classpath AGGVO类路径
 * @param {*} pk 主表主键
 * @param {*} srcAppcode 单据appid yangxd添加参数
 * @param {*} bill_type 单据类型字段名称 yangxd添加参数
 * @param {*} bill_no 单据编号字段名称 yangxd添加参数
 */
export const linkVoucherApp = function (props, pk, classpath, srcAppcode, bill_type, bill_no) {
	const base_url = '/nccloud/tmpub/pub/';
	ajax({
		url: base_url + 'qrylinkvoucherinfo.do',
		data: {
			appCode: VoucherDataConst.appcode,
			pageCode: VoucherDataConst.pagecode,
			pk,
			classPath: classpath,
			bill_type: bill_type,
			bill_no: bill_no
		},
		success: (res) => {
			let { data } = res;
			if (!data) {
				return;
			}
			let { url, pk, relationID, pk_billtype, appCode, pageCode, pk_org, pk_group } = data;
			let voucherArr = [];
			//处理选择数据
			let voucher = {
				pk_billtype,
				pk_group,
				pk_org,
				relationID
			};
			voucherArr.push(voucher);
			let srccode = pk_billtype + '_LinkVouchar';
			if (srcAppcode) {
				srccode = srcAppcode + '_LinkVouchar';
			}
			cacheTools.set(srccode, voucherArr);
			//跳转
			props.openTo(url, {
				status: 'browse',
				appcode: VoucherDataConst.appcode,
				pagecode: VoucherDataConst.pagecode,
				name: '联查凭证',
				scene: srccode
			});
		}
	});
};

/*YrJL5OrjjhJMWstC/fesK+dPDxkKZ20f/mSFGqfmpXbvWbF9uh8RUXcXataBW0kq*/