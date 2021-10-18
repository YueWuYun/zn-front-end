/*sfNYjniBpROe6lptounUqwHP3qhHm+nexdfCE7ZuvSKpeEvbPqefNeO3OV1lllpk*/
import { toast } from "nc-lightapp-front";

/**
 * 展开行
 * @param {*} operate DELETE,COMMIT，UNCOMMIT
 * @param {*} state 操作状态 0：全部失败 2部分失败 1：全部成功
 * @param {*} successIndex 成功行号 []
 * @param {*} failIndex  失败行号  []
 * @param {*} Message  错误信息   []
 * @param {*} content 提示内容,可以自己定义 不定义则方法固定生成
 */
export const BatchToast = function(
  op,
  status,
  total,
  successIndex,
  failIndex,
  message,
  content,
  props
) {
  let operate = "";
   let mutiInit = props.MutiInit.getIntl("36180PBR_APPR");
  if (op === "DELETE") {
    operate = mutiInit && mutiInit.get('36180PBR_APPR-000004');/* 国际化处理： 删除*/
  } else if (op === "BACK") {
    operate = mutiInit && mutiInit.get('36180PBR_APPR-000041');/* 国际化处理： 退回*/
  } else if (op === "pay") {
    operate = mutiInit && mutiInit.get('36180PBR_APPR-000042');/* 国际化处理： 支付*/
  } else if (op === "unpay") {
    operate = mutiInit && mutiInit.get('36180PBR_APPR-000043');/* 国际化处理： 取消支付*/
  } else if (op === "commit") {
    operate = mutiInit && mutiInit.get('36180PBR_APPR-000044');/* 国际化处理： 提交*/
  } else if (op === "uncommit") {
    operate = mutiInit && mutiInit.get('36180PBR_APPR-000045');/* 国际化处理： 收回*/
  } else if (op === "disable") {
    operate = mutiInit && mutiInit.get('36180PBR_APPR-000046');/* 国际化处理： 作废*/
  } else if (op === "canceldisable") {
    operate = mutiInit && mutiInit.get('36180PBR_APPR-000047');/* 国际化处理： 取消作废*/
  } else if (op === "sendcmd") {
    operate = mutiInit && mutiInit.get('36180PBR_APPR-000048');/* 国际化处理： 发送指令*/
  } else if (op === "withdrawcmd") {
    operate = mutiInit && mutiInit.get('36180PBR_APPR-000049');/* 国际化处理： 撤销指令*/
  }
  let title = operate + mutiInit && mutiInit.get('36180PBR_APPR-000050');/* 国际化处理： 完毕*/
  let color = "success";

  if (status == 0) {
    title = title + mutiInit && mutiInit.get('36180PBR_APPR-000051');/* 国际化处理： 全部失败*/
    color = "danger";
  } else if (status == 1) {
    title = title + mutiInit && mutiInit.get('36180PBR_APPR-000052');/* 国际化处理： 全部成功*/
    color = "success";
  } else if (status == 2) {
    title = title + mutiInit && mutiInit.get('36180PBR_APPR-000053');/* 国际化处理： 部分失败*/
    color = "warning";
  }
  if (!content) {
    content =
      mutiInit && mutiInit.get('36180PBR_APPR-000054') +/* 国际化处理： 共*/
      operate +
      total +
      mutiInit && mutiInit.get('36180PBR_APPR-000055') +/* 国际化处理： 条*/
      "," +
      mutiInit && mutiInit.get('36180PBR_APPR-000056') +/* 国际化处理： 成功*/
      successIndex +
      mutiInit && mutiInit.get('36180PBR_APPR-000055') +/* 国际化处理： 条*/
      "," +
      mutiInit && mutiInit.get('36180PBR_APPR-000057') +/* 国际化处理： 失败*/
      failIndex +
      mutiInit && mutiInit.get('36180PBR_APPR-000055');/* 国际化处理： 条*/
  }

  if (status == 1) {
    toast({
      duration: 6, // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
      color: color, // 提示类别，默认是 "success",非必输
      title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
      content: content, // 提示内容，批量操作要输入,非必输
      groupOperation: true //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
    });
  } else {
    toast({
      duration: "infinity", // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
      color: color, // 提示类别，默认是 "success",非必输
      title: title, // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
      content: content, // 提示内容，批量操作要输入,非必输
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: [
        // 提示框文字按钮，有内容展开收起和批量操作必输3个值
        // (第一个值是展按钮未展开时，第二个值是展开按钮展开时，第三个值是关闭);

        mutiInit && mutiInit.get('36180PBR_APPR-000058'),/* 国际化处理： 展开*/
        mutiInit && mutiInit.get('36180PBR_APPR-000059'),/* 国际化处理： 收起*/
        mutiInit && mutiInit.get('36180PBR_APPR-000060')/* 国际化处理： 我知道了*/
      ],
      //  没有需要展开内容的输入2个值，点击两个按钮都是关闭
      groupOperationMsg: message //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  }
};

/*sfNYjniBpROe6lptounUqwHP3qhHm+nexdfCE7ZuvSKpeEvbPqefNeO3OV1lllpk*/