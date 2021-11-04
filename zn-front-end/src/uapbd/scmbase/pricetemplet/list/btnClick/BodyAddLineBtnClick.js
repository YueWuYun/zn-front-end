//rjqTpwXoEZQmKjO66Vi+lsvLODym9Ntv/eJPWg91twNNM4IPzOOftna6nRhf6GGdqOXuYNheEtaN
//ux33wNWZHw==
/*
 * @Author: zhaopym 
 * @Date: 2019-03-15 14:26:41 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-03-19 16:22:04
 */
import { AREA } from '../../constants';

function bodyAddLine(props) {
	let { editTable } = props;
	let { addRow, getNumberOfRows } = editTable;
	let lastIndex = getNumberOfRows(AREA.table_body);
	addRow(AREA.table_body, lastIndex, true);
}
export { bodyAddLine };

//rjqTpwXoEZQmKjO66Vi+lsvLODym9Ntv/eJPWg91twNNM4IPzOOftna6nRhf6GGdqOXuYNheEtaN
//ux33wNWZHw==