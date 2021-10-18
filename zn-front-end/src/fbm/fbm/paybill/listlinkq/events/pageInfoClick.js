/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/
import { ajax } from "nc-lightapp-front";
import { LIST_TABLE_CODE, URL_LIST } from "./../../cons/constant";

export function pageInfoClick(props, config, pks) {
  if (!pks || pks.length == 0) {
    return;
  }
  let data = {
    pks: pks
  };
  ajax({
    url: URL_LIST.PAGE_QUERY,
    data: data,
    success: function(res) {
      let { success, data } = res;
      if (success) {
        if (data.grid) {
          props.table.setAllTableData(
            LIST_TABLE_CODE,
            data.grid[LIST_TABLE_CODE]
          );
        } else {
          props.table.setAllTableData(LIST_TABLE_CODE, { rows: [] });
        }
      }
      // that.onSelected();
    }
  });
}

/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/