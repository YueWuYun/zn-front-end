/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/
import NCTabs from "../../../tmpub/pub/util/NCTabs";
import { toast, getMultiLang } from "nc-lightapp-front";
let multiLangData = null;
/**
 * 按钮操作
 * @param {*} res       	返回数据
 * @param {*} opername    	批量操作提示语
 * @param {*} Msg    	    toast弹框显示内容
 * @param {*} lang          多语配置项
 */
export function promptMessage(res, opername, Msg, lang = {}) {
  if (Msg) {
    toast({ color: "success", content: Msg });
    return;
  }
  if (multiLangData) {
    toastFun();
  } else {
    getMultiLang({ moduleId: "common", domainName: "gpmc", callback });
  }
  let callback = (json, status, intl) => {
    multiLangData = json;
    toastFun();
  };
  let toastFun = () => {
    let { status, msg } = res.data;
    let content;
    let total = res.data.total;
    let successNum = res.data.successNum;
    let failNum = res.data.failNum;
    content = "共" + opername + total + "条，";
    content = content + "成功" + successNum + "条 ,";
    content = content + "失败" + failNum + "条";
    let errMsgArr = res.data.errormessages;
    if (status == 0) {
      //全部成功
      toast({
        color: "success",
        title: opername + msg,
        content: content,
        TextArr: ["展开", "收起", "关闭"],
        groupOperation: true
      });
    } else if (status == 1) {
      //全部失败
      toast({
        duration: "infinity",
        color: "danger",
        title: opername + msg,
        content: content,
        TextArr: ["展开", "收起", "关闭"],
        groupOperation: true,
        groupOperationMsg: errMsgArr
      });
    } else if (status == 2) {
      //部分成功
      toast({
        duration: "infinity",
        color: "warning",
        title: opername + msg,
        content: content,
        TextArr: ["展开", "收起", "关闭"],
        groupOperation: true,
        groupOperationMsg: errMsgArr
      });
    }
  };
}

export { NCTabs };

/*FKr3Cfgvm0eLe7TWBcS/H3Q48Rr2R5F/79K6bsV+a3iTz3/mvZyloUo2Ax8qLkH7*/