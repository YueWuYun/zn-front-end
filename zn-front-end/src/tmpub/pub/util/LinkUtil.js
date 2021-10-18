/*YrJL5OrjjhJMWstC/fesK/ewpd7MAQ2J/7nfple5qy91U6D+3Ko8KT1VNmJWQz4z*/
import { toast, ajax, cacheTools } from 'nc-lightapp-front';
import { VoucherDataConst } from '../cons/moduleConstant';
import { SCENE } from '../cons/constant'
import { loadMultiLang } from "./index";
/**
 * 联查打开小应用
 * @param {*} props 页面内置对象
 * @param {*} billtypeortranstype 单据类型或交易类型
 * @param {*} urlExtParam 地址栏拓展属性
 */
export const linkApp = function (props, billTypeOrTransType, urlExtParam) {
	const base_url = '/nccloud/tmpub/pub/';
	ajax({
		url: base_url + 'qrylinkinfo.do',
		data: { billTypeOrTransType },
		success: (res) => {
			let { data } = res;
			if (!data) {
				return;
			}
			let { url, appCode, linkPageCode } = data;
			if (!urlExtParam || Object.keys(urlExtParam).length == 0) {
				urlExtParam = {};
			}
			//默认指定联查场景
			if (!urlExtParam['scene']) {
				urlExtParam['scene'] = SCENE.LINK;
			}
			//默认浏览态
			if (!urlExtParam['status']) {
				urlExtParam['status'] = 'browse';
			}
			urlExtParam['appcode'] = appCode;
			urlExtParam['pagecode'] = linkPageCode;
			//begin tm tangleic 地址平台会根据appcode和pagecode来获取，故无需指定小应用url
			// props.openTo(url, urlExtParam);
			props.openTo(null, urlExtParam);
			//end tangleic
		}
	});
}

/** 凭证信息 */
const VOUCHER_INFO = {
	/**联查凭证 */
	LINK_VOUCHER: '_LinkVouchar2019',
	/**凭证预览 */
	PREVIEW_VOUCHER: '_Preview2019'
}

/**
 * 联查凭证小应用
 * @param {*} props 页面内置对象
 * @param {*} billID 单据主键
 * @param {*} pk_group 集团
 * @param {*} pk_org 组织
 * @param {*} billOrTransType 单据类型或交易类型
 * @param {*} billNO 单据编号
 */
export const linkVoucherApp = function (props, billID, pk_group,
	pk_org, billOrTransType, billNO, exParam) {
	const base_url = '/nccloud/tmpub/pub/';
	let data = {
		pk_group, //集团主键
		pk_org, //组织主键
		relationID: billID, //单据主键
		pk_billtype: billOrTransType//单据类型或交易类型
	};
	//cmp_zhanghjr_begin:结算报销单特殊联查凭证
	if (exParam && exParam.freedef4) {
		//结算-报销单-联查凭证传参-结算pk
		data = {
			pk_group, //集团主键
			pk_org, //组织主键
			relationID: billID, //单据主键
			pk_billtype: billOrTransType,//单据类型或交易类型
			freedef4: exParam.freedef4//额外参数
		};
		//console.log('link_source_data:',data);
	}
	//cmp_zhanghjr_end
	ajax({
		url: base_url + 'qrylinkvoucherinfo.do',
		data,
		success: (res) => {
			let { success, data } = res;
			//判断是否有凭证数据
			if (!success || !data || !data.src || VOUCHER_INFO.LINK_VOUCHER != data.src || !data.pklist || data.pklist.length == 0) {
				toast({
					'color': 'warning',
					'content': loadMultiLang(props, '3601-000002') + billNO + loadMultiLang(props, '3601-000003')/* 国际化处理： 联查失败！原因是：不存在与单据号{0}关联的凭证！*/
				}); 
				return;
			}
			let srcCode = data.src;
			let { url, pklist, appcode, pagecode, srcAppCode, cachekey } = data;
			//走联查
			if (data.des) {//跳转到凭证界面
				//单笔
				if (pklist.length == 1) {
					props.openTo(url, {
						status: 'browse',
						appcode,
						pagecode,
						id: pklist[0],
						n: loadMultiLang(props, '3601-000004')/* 国际化处理： 联查凭证*/,
						pagekey: 'link',
						backflag: 'noback'
					});
				}
				//多笔
				else {
					//将主键信息存入缓存
					cacheTools.set(cachekey, pklist);
					props.openTo(res.data.url, {
						status: 'browse',
						appcode,
						pagecode,
						n: loadMultiLang(props, '3601-000004')/* 国际化处理： 联查凭证*/,
						scene: appcode + srcCode
					});
				}
			} else {//跳转到会计平台 这里的appcode是业务组的小应用编码 //majfd 添加逻辑，原缺失
				cacheTools.set(srcAppCode + srcCode, pklist);
				//打开凭证节点
				props.openTo(res.data.url, {
					status: 'browse',
					appcode,
					pagecode,
					scene: srcAppCode + srcCode,
				});
			}
		}
	});
};

/*YrJL5OrjjhJMWstC/fesK/ewpd7MAQ2J/7nfple5qy91U6D+3Ko8KT1VNmJWQz4z*/