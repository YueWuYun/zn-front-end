//jyYYwARQnxh7vK5TIEle+tLIwHCx9QNByBcNTNvdNoeXVhGscxzwvQS6QuSG5fi8sD/ZT/wvw27v
//USu6yw+48Q==
/*
 * @Author: 刘奇 
 * @PageInfo: 表体行按钮处理
 * @Date: 2018-05-30 13:39:44 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2018-05-30 13:42:42
 */

import { deleteRow_BtnClick } from './index.js';
import { BUTTON } from '../../constance';
export default function onBodyInner_BtnClick(props, key, record, index) {
	switch (key) {
		case BUTTON.deleteLine:
			deleteRow_BtnClick.call(this, props, index);
			break;
	}
}

//jyYYwARQnxh7vK5TIEle+tLIwHCx9QNByBcNTNvdNoeXVhGscxzwvQS6QuSG5fi8sD/ZT/wvw27v
//USu6yw+48Q==