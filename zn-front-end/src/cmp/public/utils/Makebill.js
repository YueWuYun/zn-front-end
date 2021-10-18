/*cv6e9Z//nsNvqsrWbMcZRKKWforbjOcagQmHSk14UC0qwq0soDFTX3XKOh8ckj8e*/
import { toast, ajax ,cacheTools} from 'nc-lightapp-front';
import { VoucherDataConst } from '../cons/moduleConstant';
/**
 * 联查工具
 * @author tangleic
 * @version 1.0
 */



/**
 * 制单打开小应用
 * @param {*} props 页面内置对象
 * @param {*} classpath AGGVO类路径
 * @param {*} pk 主表主键
 */
export const MakeBillApp = function(props,srcAppcode,makebill) {
	const base_url = '/nccloud/tmpub/pub/';
	ajax({
		url: base_url + 'makebill.do',
		data: {
			appCode: VoucherDataConst.appcode,
			pageCode: VoucherDataConst.pagecode
		},
		success: (res) => {
			let { data } = res;
			if (!data) {
				return;
			}
			let { url, appCode, pageCode } = data;
			let srccode = srcAppcode + '_MadeBill';
		    cacheTools.set(srcAppcode + '_MadeBill', makebill);
			//跳转
			props.openTo(url, {
				status: 'browse',
				appcode: VoucherDataConst.appcode,
				pagecode: VoucherDataConst.pagecode,
				name: '制单制证',
				scene: srccode
			});
		}
	});
};

/*cv6e9Z//nsNvqsrWbMcZRKKWforbjOcagQmHSk14UC0qwq0soDFTX3XKOh8ckj8e*/