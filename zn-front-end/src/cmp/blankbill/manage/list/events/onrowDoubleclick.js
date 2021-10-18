/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/
import { PAGE_PATH } from '../../../../pub/cons/constant'
import {  BILL_FIELD,APP_INFO } from '../../cons/constant';
const { PK_NAME} = BILL_FIELD;
const { CARDPATH } = PAGE_PATH
/**
 * -表格双击事件
 * @param {*}  
 */

export default function onrowDoubleclick(record, index, props, e)  {
    this.props.pushTo(CARDPATH, {
        pagecode: APP_INFO.CARD__PAGECODE,
        status: 'browse',
		id: record[PK_NAME].value
    });
}
/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/