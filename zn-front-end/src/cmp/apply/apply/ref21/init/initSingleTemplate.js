/*rHj9g3bA/d+Zhwn3vodsgrXHis+YmUnwTzUP49oAvV/D5T55JTG75GzQjxMvwOLB*/
/*
 * @Author: wangceb 
 * @PageInfo: 初始化销售订单模板
 * @Date: 2018-04-19 10:32:11 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-07-18 22:34:43
 */
import { base, ajax } from 'nc-lightapp-front';
import { btn_Controller } from '../btnClicks';
import { REF21_CONST } from '../const';

export default function(props) {
	props.createUIDom(
		{
			pagecode: REF21_CONST.singleTableId, //卡片页面编码
			appcode: REF21_CONST.appcode //应用主键
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					props.meta.addMeta(meta);
				}
			}
		}
	);
}

/*rHj9g3bA/d+Zhwn3vodsgrXHis+YmUnwTzUP49oAvV/D5T55JTG75GzQjxMvwOLB*/