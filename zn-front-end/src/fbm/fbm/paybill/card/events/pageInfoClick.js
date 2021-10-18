/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/
import { cardCache } from "nc-lightapp-front";
import { doAjax } from "../../utils/commonUtil";
import { CARD_FORM_CODE,PRIMARY_ID, DATASOURCE, URL_LIST } from "./../../cons/constant";

export function pageInfoClick(props, pk) {
  if (!pk) {
    //如果刷新了浏览器，那么pk将不会存在，如果pk不存在，return
    return;
  }

  let cardData = cardCache.getCacheById(pk, DATASOURCE);
  props.setUrlParam({ status: "browse", id: pk }); //动态修改地址栏中的id的值

  // 有缓存用缓存的数据，没有缓存就重新查
  if (cardData) {
    props.form.setAllFormValue({
      [CARD_FORM_CODE]: cardData.head[CARD_FORM_CODE]
    });
    let vbillno = cardData.head[CARD_FORM_CODE].rows[0].values.vbillno.value;
    this.titleno = vbillno;
    this.toggleShow();
  } else {
    let data = {
      pk: pk
    };

    let callback = function(res) {
      if (res.data.card) {
        this.props.form.setAllFormValue({
          [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
        });
        cardCache.updateCache(
          PRIMARY_ID,
          pk,
          res.data.card,
          CARD_FORM_CODE,
          DATASOURCE
        );
        this.titleno =
          res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno.value;

        this.props.setUrlParam({ id: pk });
        this.toggleShow();
      } else {
        this.props.form.setAllFormValue({ [CARD_FORM_CODE]: { rows: [] } });
      }
    };

    doAjax.call(this, data, URL_LIST.CARD_QUERY, callback);
  }
}

/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/