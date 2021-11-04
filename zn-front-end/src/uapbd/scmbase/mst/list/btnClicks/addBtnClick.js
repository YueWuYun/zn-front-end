//0+wYoXiCVY9raZXOFEcDv1lMVv88dr9ea3KGHcl4YdMYGB2/opNnYnG4H/nArpon
import { PAGEAREA, UISTATE } from '../constance';
import { viewController } from '../viewController';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
/**
 * 新增
 * @param {*} props 
 */
export default function(props) {
	//增行的时候付组织默认值
	let pk_org = this.state.pk_org;
	if (pk_org) {
		props.editTable.addRow(PAGEAREA.list, undefined, true, {
			pk_org,
			enablestate: { display: getLangByResId(this, '4001MST-000000'), value: '2' } /* 国际化处理： 已启用*/
		});
	}
	viewController.call(this, props, UISTATE.edit);
}

//0+wYoXiCVY9raZXOFEcDv1lMVv88dr9ea3KGHcl4YdMYGB2/opNnYnG4H/nArpon