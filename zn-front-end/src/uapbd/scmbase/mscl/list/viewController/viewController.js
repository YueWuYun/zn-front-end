//FhGt8mVXHBYBQ3wFaJJd7VfYIfHu6Ad+f0YVYScpli+rn9cXPhyX+/AGyq/BaKln
/*
* 页面状态控制器
 * @Author: zhngzh 
 * @Date: 2019-04-28 10:24:25 
 * @Last Modified by:   zhngzh 
 * @Last Modified time: 2019-04-28 10:24:25 
 */
import { UISTATE, PAGEAREA } from '../constance';
import buttonController from './buttonController';
export default function(props, status = UISTATE.browse) {
	if (status == UISTATE.browse) {
		props.editTable.setStatus(PAGEAREA.list, UISTATE.browse);
	} else {
		props.editTable.setStatus(PAGEAREA.list, UISTATE.edit);
	}
	//设置按钮显隐性
	buttonController.call(this, props, status);
}

//FhGt8mVXHBYBQ3wFaJJd7VfYIfHu6Ad+f0YVYScpli+rn9cXPhyX+/AGyq/BaKln