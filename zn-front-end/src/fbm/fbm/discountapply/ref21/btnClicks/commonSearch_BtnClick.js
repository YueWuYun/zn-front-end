/*MKhAr9efcx6R2yL0XZ82WtMCXr5LgR/tGTEuW7t1gmTMVNhaI9DfR+aSql2DsXNvTVCJk7WCZA29
VC/mXYQzpA==*/
import { ajax, toast } from 'nc-lightapp-front';
import { btn_Controller } from "../btnClicks";
import { REF21_CONST } from "../const";

export default function clickSerachBtn(props, queryInfo) {
  ajax({
    url: REF21_CONST.serachUrl,
    data: queryInfo,
    success: res => {
      let { success, data } = res;
      if (success) {
        let multiLang = this.props.MutiInit.getIntl("36180DA");
        if (data) {
          if (data.grid) {
            /* 国际化处理： 查询成功!*/
            toast({ color: 'success', content: multiLang && multiLang.get('36180DA-000017') });
            this.props.transferTable.setTransferTableValue(
              REF21_CONST.formId,
              REF21_CONST.tableId,
              data.grid[REF21_CONST.formId],
              REF21_CONST.pk_head,
              REF21_CONST.pk_body
            );
          } else {
            /* 国际化处理： 未查询出数据*/
            toast({ color: 'warning', content: multiLang && multiLang.get('36180DA-000018') });
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