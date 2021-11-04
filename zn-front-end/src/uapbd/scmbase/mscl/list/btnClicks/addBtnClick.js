//0+wYoXiCVY9raZXOFEcDv1lMVv88dr9ea3KGHcl4YdMYGB2/opNnYnG4H/nArpon
/*
 * @Author: zhngzh 
 * @Date: 2019-05-14 11:26:03 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-07-10 13:28:29
 */
import { PAGEAREA, UISTATE } from '../constance';
import { viewController } from '../viewController';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function(props) {
	//增行的时候付组织默认值
	let pk_org = this.state.pk_org;
	if (pk_org) {
		props.editTable.addRow(PAGEAREA.list, undefined, true, {
			pk_org,
			enablestate: { display: getLangByResId(this, '4001MSCL-000000'), value: '2' } /* 国际化处理： 已启用*/
		});
	}
	viewController.call(this, props, UISTATE.edit);
}

//0+wYoXiCVY9raZXOFEcDv1lMVv88dr9ea3KGHcl4YdMYGB2/opNnYnG4H/nArpon