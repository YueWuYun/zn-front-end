/*j07c8riwYnz20MYibuDbtLiMTbmJRKXK99nyLdxXvKzLOOIuKU82Hl4GjWhKqzIX*/
import { ajax } from 'nc-lightapp-front';
import { base_url, list_page_id, list_search_id, list_table_id } from '../../cons/constant.js';
import { setListButtonUseful } from '../../util/spegatherUtil';


export const pageInfoClick = function (props, config, pks) {
    if (pks == null || pks.length == 0) {
        return;
    }
    let pageInfo = props.table.getTablePageInfo(list_table_id);
    let data = {
        pks: pks,
        pageCode: list_page_id
    }
    let that = this;
    ajax({
        url: base_url + 'spegatherpagechange.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                that.props.table.setAllTableData(list_table_id, res.data[list_table_id]);
                //查询后设置刷新按钮可用
                setListButtonUseful.call(that);
                props.button.setButtonDisabled(['Refresh'], false);
            }
        }
    });
}
/*j07c8riwYnz20MYibuDbtLiMTbmJRKXK99nyLdxXvKzLOOIuKU82Hl4GjWhKqzIX*/