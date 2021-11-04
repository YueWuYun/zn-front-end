//FhGt8mVXHBYBQ3wFaJJd7VfYIfHu6Ad+f0YVYScpli+rn9cXPhyX+/AGyq/BaKln
/*
 * 页面状态控制 
 * @Author: yangls7 
 * @Date: 2019-06-04 14:06:13 
 * @Last Modified by: yangls7 
 * @Last Modified time: 2019-06-04 14:06:13 
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