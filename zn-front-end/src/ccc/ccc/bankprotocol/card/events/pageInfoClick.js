/*j07c8riwYnz20MYibuDbtLtYDzDh5/3TYE+7BUV7YYXXT2alYF9L1OVpli5DZfc3*/
import { ajax } from "nc-lightapp-front";
import { cardCache } from "nc-lightapp-front";
import { CONST_CARD } from "../../constant/constant";
import buttonVisible from "./buttonVisible";
let { getCacheById, updateCache } = cardCache;

export default function pageInfoClick(props, pk) {
  props.setUrlParam({
    status: "browse",
    id: pk,
  });
  let cardData = getCacheById(pk, CONST_CARD.CacheKey);
  if (cardData) {
    let { head, bodys } = cardData;
    if (head) {
      this.props.form.setAllFormValue({ [this.formId]: head[this.formId] });
      let billno = cardData.head[this.formId].rows[0].values.protocolcode.value;
      this.props.BillHeadInfo.setBillHeadInfoVisible({
        billCode: billno,
      });
    }
    if (bodys) {
      this.props.cardTable.setAllTabsData(cardData.bodys, this.tabOrder);
    } else {
      this.props.cardTable.setAllTabsData(null, this.tabOrder);
    }
    buttonVisible.call(this, this.props);
  } else {
    let data = {
      pk: pk,
      pageCode: this.pageId,
    };
    //得到数据渲染到页面
    ajax({
      url: "/nccloud/ccc/bankprotocol/querybypk.do",
      data: data,
      success: (res) => {
        if (res.data) {
          if (res.data.head) {
            this.props.form.setAllFormValue({
              [this.formId]: res.data.head[this.formId],
            });
            let billno =
              res.data.head[this.formId].rows[0].values.protocolcode.value;
            this.setState({ protocolcode: billno });
            this.props.BillHeadInfo.setBillHeadInfoVisible({
              billCode: billno,
            });
          }
          if (res.data.bodys) {
            this.props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
          } else {
            this.props.cardTable.setAllTabsData(null, this.tabOrder);
          }
          buttonVisible.call(this, this.props);
          //更新缓存
          updateCache(
            this.billPK,
            pk,
            res.data,
            this.formId,
            CONST_CARD.CacheKey
          );
        } else {
          this.props.form.setAllFormValue({ [this.formId]: null });
          this.props.cardTable.setAllTabsData(null, this.tabOrder);
        }
      },
    });
  }
}

/*j07c8riwYnz20MYibuDbtLtYDzDh5/3TYE+7BUV7YYXXT2alYF9L1OVpli5DZfc3*/