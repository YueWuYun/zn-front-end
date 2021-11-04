//4Mw8Hpy3yDlwoptT4GQitDHd5qq+I97o/75g2BaXxhZLFxLhXeeC+Gpm9JQVGAm3
/*
 * @Author: 刘奇 
 * @PageInfo: 表体肩部按钮处理 
 * @Date: 2018-05-08 16:13:15 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-01-10 13:37:34
 */
import { addRow_BtnClick, batchDeleteRow_BtnClick } from './index.js';
import { BUTTON } from '../../constance';
export default function onBody_BtnClicks(props, key) {
	switch (key) {
		case BUTTON.addLine:
			addRow_BtnClick.call(this, props);
			break;
		case BUTTON.deleteLine:
			batchDeleteRow_BtnClick.call(this, props);
			break;
	}
}

//4Mw8Hpy3yDlwoptT4GQitDHd5qq+I97o/75g2BaXxhZLFxLhXeeC+Gpm9JQVGAm3