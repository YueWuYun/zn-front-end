//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: qiaobb 
 * @PageInfo: 按钮事件  
 * @Date: 2018-05-30 09:36:23 
 * @Last Modified by: qiaobb
 * @Last Modified time: 2019-03-28 18:04:39
 */

import { BUTTONID } from '../../constance';
import addLineBtnClick from './addLineBtnClick';
import deleteLineBtnClick from './deleteLineBtnClick';
import barCodeParseBtnClick from './barCodeParseBtnClick';
import exportExcelBtnClick from './exportExcelBtnClick';
import importExcelBtnClick from './importExcelBtnClick';
function btnClick(props, buttonid, text, record, index) {
	switch (buttonid) {
		case BUTTONID.add:
			addLineBtnClick.call(this, props);
			break;
		case BUTTONID.delete:
			deleteLineBtnClick.call(this, props, record, index);
			break;
		case BUTTONID.parsebarcode:
			barCodeParseBtnClick.call(this, props);
			break;
		case BUTTONID.import:
			importExcelBtnClick.call(this, props);
			break;
		case BUTTONID.export:
			exportExcelBtnClick.call(this, props);
			break;
	}
}

export { btnClick };

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65