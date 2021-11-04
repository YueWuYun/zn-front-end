//S711ix0fKkc2jN9PA0cU687wjjY+JT5n0GXrM8ZLzpESnXmxKPHhtr6Jx0HP2TylAEZYJBKSyJXZ
//jqkVXLE9YA==
/*
 * @Author: 刘奇 
 * @PageInfo: 表头行按钮处理
 * @Date: 2018-05-30 13:39:44 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-01-10 13:38:30
 */

import { BUTTON } from '../../constance';
import { edit_BtnClick, delete_BtnClick } from './index.js';
export default function onHeadInner_BtnClick(props, key, record, index, e) {
	switch (key) {
		case BUTTON.delete:
			delete_BtnClick.call(this, props, index);
			break;
		case BUTTON.edit:
			edit_BtnClick.call(this, props, index);
			break;
	}
}

//S711ix0fKkc2jN9PA0cU687wjjY+JT5n0GXrM8ZLzpESnXmxKPHhtr6Jx0HP2TylAEZYJBKSyJXZ
//jqkVXLE9YA==