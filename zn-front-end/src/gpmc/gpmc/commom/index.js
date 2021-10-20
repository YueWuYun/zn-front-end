/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
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
    let { status, msg } = res.data;
    let content = null;
    let total = res.data.total;
    let successNum = res.data.successNum;
    let failNum = res.data.failNum;
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
        content =
            multiLangData["commom-000000"] +
            opername +
            total +
            multiLangData["commom-000001"]; /* 国际化处理： 共,条，*/
        content =
            content +
            multiLangData["commom-000002"] +
            successNum +
            multiLangData["commom-000003"]; /* 国际化处理： 成功,条 ,*/
        content =
            content +
            multiLangData["commom-000004"] +
            failNum +
            multiLangData["commom-000005"]; /* 国际化处理： 失败,条*/
        let errMsgArr = res.data.errormessages;
        if (status == 0) {
            //全部成功
            toast({
                color: "success",
                title: opername + msg,
                content: content,
                TextArr: [
                    multiLangData["commom-000006"],
                    multiLangData["commom-000007"],
                    multiLangData["commom-000008"]
                ] /* 国际化处理： 展开,收起,关闭*/,
                groupOperation: true
            });
        } else if (status == 1) {
            //全部失败
            toast({
                duration: "infinity",
                color: "danger",
                title: opername + msg,
                content: content,
                TextArr: [
                    multiLangData["commom-000006"],
                    multiLangData["commom-000007"],
                    multiLangData["commom-000008"]
                ] /* 国际化处理： 展开,收起,关闭*/,
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
                TextArr: [
                    multiLangData["commom-000006"],
                    multiLangData["commom-000007"],
                    multiLangData["commom-000008"]
                ] /* 国际化处理： 展开,收起,关闭*/,
                groupOperation: true,
                groupOperationMsg: errMsgArr
            });
        }
    };
}

export { NCTabs };

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/