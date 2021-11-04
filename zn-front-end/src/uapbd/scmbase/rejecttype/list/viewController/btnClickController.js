//h84Q5eMmSJsRENxS4eEsJqYDhV4WXUROqI7hF7MVJG6U7zL0nJ8/Mi3sG4vfoZcf
/*
 * @Author: yinliang 
 * @PageInfo: 按钮分派
 * @Date: 2019-03-15 10:53:37 
 * @Last Modified by: yinliang
 * @Last Modified time: 2019-03-19 18:26:24
 */

import { saveBtnClick, canelBtnClick, refreshBtnClick, printBtnClick, relationBtnClick } from '../btnClicks';
import { BUTTONID } from '../../constance';
export default function buttonClick(props, key) {
	switch (key) {
		case BUTTONID.Save:
			// 保存动作
			saveBtnClick.call(this, props);
			break;
		case BUTTONID.Cancel:
			// 取消动作
			canelBtnClick.call(this, props);
			break;
		case BUTTONID.Refresh:
			// 刷新动作
			refreshBtnClick.call(this);
			break;
		case BUTTONID.Print:
			// 打印动作
			printBtnClick.call(this, props);
			break;
		case BUTTONID.Relation:
			// 关联动作
			relationBtnClick.call(this, props);
			break;
	}
}

//h84Q5eMmSJsRENxS4eEsJqYDhV4WXUROqI7hF7MVJG6U7zL0nJ8/Mi3sG4vfoZcf