/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax } from 'nc-lightapp-front';
import * as CONSTANTS from '../constants';
let { tableId, searchId, formId, pagecode, appid, formId_01, formId_02, oid } = CONSTANTS;
export default function afterEvent(props, moduleId, key, value, changedrows, i, s, g) {
	if (key === 'busitype') {
		props.form.setFormItemsValue(moduleId, { jylx: { value: i.refcode } });
	}
}
/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/