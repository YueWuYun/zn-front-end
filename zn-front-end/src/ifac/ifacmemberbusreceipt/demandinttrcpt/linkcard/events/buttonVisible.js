/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { app_id, qcard_from_id, qcard_table_id, qcard_page_id } from '../../cons/constant.js';
const formId = qcard_from_id;
const pageId = qcard_page_id;
const tableId = qcard_table_id;

export const buttonVisible = function (props) {
    let status = props.getUrlParam('status');
    let flag = status === 'browse' ? false : true;

    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
    props.form.setFormStatus(formId, status);
	props.cardTable.setStatus(tableId, status);
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/