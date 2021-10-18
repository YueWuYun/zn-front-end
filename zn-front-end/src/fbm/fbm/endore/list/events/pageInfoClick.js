/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/
/**
 * 背书办理列表分页点击事件
 * @author：gaokung
 */
import { ajax } from "nc-lightapp-front";
import { URI, LIST } from "./../../cons/constant";
/**
 * 背书办理列表分页点击事件
 * @param {*} props
 * @param {*} config 表格中 配置信息
 * @param {*} pks 当前页所有主键
 */
export default function pageInfoClick(props, config, pks) {
    if (!pks || pks.length === 0) return;
    ajax({
        url: URI.endoreListPageQuery,
        data: { pks },
        success: ({ success, data: { grid } }) => {
            if (success) {
                if (grid) {
                    this.props.table.setAllTableData(
                        this.tableId,
                        grid[this.tableId]
                    );
                } else {
                    this.props.table.setAllTableData(this.tableId, {
                        rows: []
                    });
                }
            }
        }
    });
}

/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/