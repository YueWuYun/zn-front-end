/*QB6Cta54YZYj18ukkNSw6s6w/5HHI50S1xG3XVdcs5/3IcD+ZCFqsh0TiFDHeGL+*/
import { ajax, toast } from "nc-lightapp-front";
/**
 * 获取编辑前事件接口
 */
export function getBeforeEventCurrtype(props, key) {
  //  组织本币汇率、集团本币汇率、全局本币汇率
  const currType = ["olcrate", "glcrate", "gllcrate"];
  if (currType.includes(key)) {
    let pk_org = props.form.getFormItemsValue(this.formId, "pk_org").value; //财务组织
    let pk_currtype = props.form.getFormItemsValue(this.formId, "pk_currtype")
      .value; //源币
    let rateType = "";
    if (key === "olcrate") {
      rateType = "rate";
    } else if (key === "glcrate") {
      rateType = "grouprate";
    } else if (key === "gllcrate") {
      rateType = "globalrate";
    }
    const CurrtypeData = {
      pk_org: pk_org,
      pk_currtype: pk_currtype,
      ratekey: rateType,
    };
    let editTable = getNewCurrtype(CurrtypeData).then((res) => {
      if (res.data) {
        return true;
      } else {
        return false;
      }
    });
    return editTable;
  } else {
    return true;
  }
}
// 获取最新的汇率数据
const getNewCurrtype = (data) => {
  return new Promise((resolve, reject) => {
    ajax({
      url: "/nccloud/gpmc/guacontract/currtype.do",
      async: false,
      data,
      success: (res) => {
        resolve(res);
      },
      error: (res) => {
        toast({ color: "danger", content: res.message });
        reject(res);
      },
    });
  });
};
/**
 * 按钮整理不包含按钮组
 * @param {*} buttons 全部按钮集合
 */
export const handleBtnData = (buttons) => {
  let btnsArray = [];
  const handleFunc = (btns) => {
    btns.map((item) => {
      if (item.type != "buttongroup") {
        btnsArray.push(item.key);
      }
      if (item.children && item.children.length > 0) {
        handleFunc(item.children);
      }
    });
  };
  handleFunc(buttons);
  return btnsArray;
};

export function getSimplaFormData(props, pageId, formId) {
  // 获取整单数据
  let data = props.createExtCardData(pageId, formId);
  return {
    model: data.head[formId],
    pageid: data.pageid,
  };
}

/*QB6Cta54YZYj18ukkNSw6s6w/5HHI50S1xG3XVdcs5/3IcD+ZCFqsh0TiFDHeGL+*/