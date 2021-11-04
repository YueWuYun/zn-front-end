//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: zhaopym 
 * @Date: 2019-03-14 16:26:45 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-22 14:28:24
 */
import { add } from './AddBtnClick';
import { edit } from './EditBtnClick';
import { save } from './SaveBtnClick';
import { deleteData } from './DeleteBtnClick';
import { cancel } from './CancleBtnClick';
import { BUTTON } from '../../constants';
import { innerLineDel } from './InnerDeleteBtnClick';
import { bodyAddLine } from './BodyAddLineBtnClick';
import { bodyDeleteLine } from './BodyDeleteLineBtnClick';
import { refresh } from './RefreshBtnClick';

function buttonClick(props, key, text, record, index) {
	switch (key) {
		case BUTTON.Add:
			add.call(this, props, key, text, record, index);
			break;
		case BUTTON.Edit_inline_head:
			edit.call(this, props, key, text, record, index);
			break;
		case BUTTON.Save:
			save.call(this, props);
			break;
		case BUTTON.Delete:
			deleteData.call(this, props);
			break;
		case BUTTON.Refresh:
			refresh.call(this, props);
			break;
		case BUTTON.Delete_inline_head:
			innerLineDel.call(this, props, key, text, record, index);
			break;
		case BUTTON.AddLine_inline_body:
			bodyAddLine.call(this, props);
			break;
		case BUTTON.DeleteLine_inline_body:
			bodyDeleteLine.call(this, props, key, text, record, index);
			break;
		case BUTTON.Cancel:
			cancel.call(this, props);
			break;

		default:
			break;
	}
}
export { buttonClick };

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65