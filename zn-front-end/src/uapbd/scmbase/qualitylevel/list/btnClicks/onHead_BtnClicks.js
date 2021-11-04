//WiqyK3YZx/jgG2WIQF6XyLS9sJOf6BHWZr+xPfucaw06HlxkxUbD55wJ9AilKU2l
/*
 * @Author: 刘奇 
 * @PageInfo: 表头肩部按钮处理 
 * @Date: 2018-05-08 16:13:15 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-01-10 13:38:12
 */
import {
	add_BtnClick,
	batchDelete_BtnClick,
	cancel_BtnClick,
	save_BtnClick,
	search_BtnClick,
	print_BtnClick
} from './index.js';
import { BUTTON } from '../../constance';
export default function onHead_BtnClicks(props, key) {
	switch (key) {
		case BUTTON.add:
			add_BtnClick.call(this, props);
			break;
		case BUTTON.delete:
			batchDelete_BtnClick.call(this, props);
			break;
		case BUTTON.save:
			save_BtnClick.call(this, props);
			break;
		case BUTTON.cancel:
			cancel_BtnClick.call(this, props);
			break;
		case BUTTON.print:
			print_BtnClick.call(this, props);
			break;
		case BUTTON.refresh:
			search_BtnClick.call(this, props, 'refresh');
			break;
	}
}

//WiqyK3YZx/jgG2WIQF6XyLS9sJOf6BHWZr+xPfucaw06HlxkxUbD55wJ9AilKU2l