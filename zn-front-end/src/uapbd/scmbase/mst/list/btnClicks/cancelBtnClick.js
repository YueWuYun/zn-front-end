//pr0tUH1dV1X/xaCwJNPKCEGlRN9WwwMZOE0ZTGF6IA/XTo0K5zjFVlRWOZwg1l2D
import { showWarningDialog } from '../../../pub/tool/messageUtil';
import { PAGEAREA, UISTATE } from '../constance';
import { viewController } from '../viewController';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
/**
 * 取消
 * @param {*} props 
 */
export default function(props) {
	showWarningDialog(getLangByResId(this, '4001MST-000001'), getLangByResId(this, '4001MST-000002'), {
		/* 国际化处理： 取消,确定要取消吗?*/
		beSureBtnClick: () => {
			props.editTable.cancelEdit(PAGEAREA.list);
			viewController.call(this, props, UISTATE.browse);
		}
	});
}

//pr0tUH1dV1X/xaCwJNPKCEGlRN9WwwMZOE0ZTGF6IA/XTo0K5zjFVlRWOZwg1l2D