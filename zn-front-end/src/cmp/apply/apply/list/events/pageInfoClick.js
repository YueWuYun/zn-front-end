/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
//引入常量定义
import { LIST_PAGE_INFO, URL_INFO } from '../../cons/constant';

export const pageInfoClick = function (props, config, pks) {
    if (pks == null || pks.length == 0) {
        return;
    }
    let pageInfo = props.table.getTablePageInfo(LIST_PAGE_INFO.TABLE_CODE);
    let data = {
        pks: pks,
        pageCode: LIST_PAGE_INFO.PAGE_CODE
    }
    let that = this;
    ajax({
        url: URL_INFO.LIST.PAGECHANGE,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                that.props.table.setAllTableData(LIST_PAGE_INFO.TABLE_CODE, res.data[LIST_PAGE_INFO.TABLE_CODE]);
            }
        }
    });
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/