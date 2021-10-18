/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import NCTabs from "../../../../tmpub/pub/util/NCTabs";
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
    if (multiLangData) {
        toastFun();
    } else {
        // getMultiLang({ moduleId: "3636PUBLIC", domainName: "icdmc", callback });
        // getMultiLang({ moduleId:{ 
		// 	[ 'tmpub']:['3601'],
		// 	['icdmc']: ['3636PUBLIC', '3636']
        //    } , callback });
        this.props.MultiInit.getMultiLang({
            moduleId: ["36340FDLI", "3636PUBLIC"],
            domainName: "icdmc",
            callback
        });
    }
    let callback = (json, status, intl) => {
        multiLangData = json;
        toastFun();
    };
    let toastFun = () => {
        if (Msg) {
            toast({ color: "success", content: Msg });
            return;
        }
        let { status, msg } = res.data;
        let content;
        let total = res.data.total;
        let successNum = res.data.successNum;
        let failNum = res.data.failNum;
        content =
            multiLangData["3636PUBLIC-000001"] +
            opername +
            total +
            multiLangData["3636PUBLIC-000002"]; /* 国际化处理： 共,条，*/
        content =
            content +
            multiLangData["3636PUBLIC-000003"] +
            successNum +
            multiLangData["3636PUBLIC-000004"]; /* 国际化处理： 成功,条 ,*/
        content =
            content +
            multiLangData["3636PUBLIC-000005"] +
            failNum +
            multiLangData["3636PUBLIC-000006"]; /* 国际化处理： 失败,条*/
        let errMsgArr = res.data.errormessages;
        if (status == 0) {
            //全部成功
            toast({
                color: "success",
                title: opername + msg,
                content: content,
                TextArr: [
                    multiLangData["3636PUBLIC-000007"],
                    multiLangData["3636PUBLIC-000008"],
                    multiLangData["3636PUBLIC-000009"]
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
                    multiLangData["3636PUBLIC-000007"],
                    multiLangData["3636PUBLIC-000008"],
                    multiLangData["3636PUBLIC-000009"]
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
                    multiLangData["3636PUBLIC-000007"],
                    multiLangData["3636PUBLIC-000008"],
                    multiLangData["3636PUBLIC-000009"]
                ] /* 国际化处理： 展开,收起,关闭*/,
                groupOperation: true,
                groupOperationMsg: errMsgArr
            });
        }
    };
}

export { NCTabs };

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/