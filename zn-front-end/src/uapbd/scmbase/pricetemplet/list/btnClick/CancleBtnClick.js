//d9DEZIM+2GS/74wDACtdTRBE2A1RI9CLgZxp4vM4aM5cKj1GMKCTuHEURztmD6Q6
/*
 * @Author: zhaopym 
 * @Date: 2019-03-13 09:43:31 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-10 13:37:52
 */
import { AREA, STATUS } from '../../constants';
import { togglePageStatus } from '../../viewController';
import { showWarningDialog } from '../util/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

/**
 * 取消编辑，返回浏览态
 * @param {*} props 
 */
function cancel(props) {
	showWarningDialog(getLangByResId(this, '4004PRICETEMPLET-000001'), getLangByResId(this, '4004PRICETEMPLET-000002'), {/* 国际化处理： 取消,确定要取消吗？*/
		beSureBtnClick: () => {
			let { editTable } = props;
			let { cancelEdit } = editTable;
			cancelEdit(AREA.table_head);
			cancelEdit(AREA.table_body);
			togglePageStatus.call(this, props, STATUS.browse);
		}
	});
}
export { cancel };

//d9DEZIM+2GS/74wDACtdTRBE2A1RI9CLgZxp4vM4aM5cKj1GMKCTuHEURztmD6Q6