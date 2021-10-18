/*MKhAr9efcx6R2yL0XZ82WtMCXr5LgR/tGTEuW7t1gmTMVNhaI9DfR+aSql2DsXNvTVCJk7WCZA29
VC/mXYQzpA==*/
import { ajax } from "nc-lightapp-front";
import { btn_Controller } from "../btnClicks";
import { REF21_CONST } from "../const";

export default function clickSerachBtn(props, queryInfo) {
  ajax({
    url: REF21_CONST.serachUrl,
    data: queryInfo,
    success: res => {
      let { success, data } = res;
      if (success) {
        if (data) {
          if (data.grid) {
            this.props.transferTable.setTransferTableValue(
              REF21_CONST.formId,
              REF21_CONST.tableId,
              data.grid[REF21_CONST.formId],
              REF21_CONST.pk_head,
              REF21_CONST.pk_body
            );
          } else {
            this.props.transferTable.setTransferTableValue(
              REF21_CONST.formId,
              REF21_CONST.tableId,
              [],
              REF21_CONST.pk_head,
              REF21_CONST.pk_body
            );
          }
        } else {
          this.props.transferTable.setTransferTableValue(
            REF21_CONST.formId,
            REF21_CONST.tableId,
            [],
            REF21_CONST.pk_head,
            REF21_CONST.pk_body
          );
        }
        btn_Controller.call(this, props);
      }
    }
  });
}

/*MKhAr9efcx6R2yL0XZ82WtMCXr5LgR/tGTEuW7t1gmTMVNhaI9DfR+aSql2DsXNvTVCJk7WCZA29
VC/mXYQzpA==*/