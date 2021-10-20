/*oDZ5SlCnghiouh5ddxkwSxlTYo1nGnfHivFlfcIgH4g3I48bK0yjX5DYDtaZ6hD/*/
import { cardCache } from "nc-lightapp-front";
import { buttonVisible } from "./buttonVisible";
import { resolveThreeType } from "./resolve";
import { resolveChange } from "./page";
import { resolveIscontrary } from "./afterEvent";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { tabs } from "../../cons/constant.js";
let { getCacheById, getDefData } = cardCache;

export default function(props) {
  let id = props.getUrlParam("id");
  let isAdd = props.getUrlParam("status") === "add";
  if (id && !isAdd) {
    let cardData = getCacheById(id, this.dataSource);
    let status = props.getUrlParam("status");
    if (cardData) {
      //有缓存且不是刷新按钮
      if (status === "change") {
        resolveChange.call(this);
      } else if (status === "edit") {
        resolveThreeType.call(
          this,
          props,
          cardData.head && cardData.head[this.formId]
        );
      }
      let ts = cardData.head[this.formId].rows[0].values.ts.value;
      this.idTs = { id, ts };
      resolveContractinfo.call(this, props, cardData);
      props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
      // 取显示页签的key值集合
      let tabDefData = getDefData(this.tabCache, this.dataSource);
      let tabKeys = tabDefData.get(id) || [];
      let keys = tabKeys.length ? tabKeys : tabs.tabShow;
      props.cardTable.setAllTabsData(
        cardData.bodys,
        this.tabOrder,
        afterSetData.bind(this, props, keys),
        keys
      );
      orgVersionView(props, this.formId); //组织版本视图
      buttonVisible.call(this, props);
      return;
    }
  }
}

export function resolveContractinfo(props, data) {
  if (data.bodys && data.bodys.contractinfo) {
    let contracttype = "",
      iscontrary = "";
    if (data.head && data.head[this.formId]) {
      contracttype = data.head[this.formId].rows[0].values.contracttype.value; //合同类型
      iscontrary = data.head[this.formId].rows[0].values.iscontrary.value; //是否需要反担保
    }
    resolveIscontrary.call(this, props, contracttype === "1" && iscontrary);
  }
}

export function afterSetData(props, keys) {
  if (!keys.length) {
    return;
  }
  let key = keys.includes(this.tabCode) ? this.tabCode : keys[0];
  props.cardTable.setCurrTabKey(key);
}

/*oDZ5SlCnghiouh5ddxkwSxlTYo1nGnfHivFlfcIgH4g3I48bK0yjX5DYDtaZ6hD/*/