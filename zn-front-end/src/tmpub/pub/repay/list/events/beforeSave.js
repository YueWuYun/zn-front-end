/*TRqo9icSh/N3WRtpE9MGIUjzezi9x+epk3bkEGU3DvZW8KrVTJfrMC9lT2tvJCc2*/
/**
 * 保存前对传参进行处理
 * @param {*} sendData 传参
 */
import { toast } from "nc-lightapp-front";
export default function beforeSave(sendData) {
  let isFlag = true;
  // 周期负数校验
  sendData.model.rows.map(e => {
    let repay_prcpl_method = e.values.repay_prcpl_method.value; // 还本方式
    let repay_intst_method = e.values.repay_intst_method.value; // 付息方式
    let repay_prcpl_period = e.values.repay_prcpl_period.value; // 还本周期
    let repay_intst_period = e.values.repay_intst_period.value; // 付息周期
    if (
      repay_prcpl_method === "1" ||
      repay_prcpl_method === "2" ||
      repay_prcpl_method === "3" ||
      repay_prcpl_method === "4"
    ) {
      // 还本方式为按月/季度/半年/年时 还本周期为必输
      if (!repay_prcpl_period || repay_prcpl_period == 0) {
        // 如果还本周期为0或者不存在
        toast({
          color: "warning",
          content: this.state.json["36010RPM-000004"]
        }); /* 国际化处理： 还本周期不能为空或为0！ */
        isFlag = false;
      }
    }
    if (
      repay_intst_method === "1" ||
      repay_intst_method === "2" ||
      repay_intst_method === "3" ||
      repay_intst_method === "4"
    ) {
      // 付息方式为按月/季度/半年/年时 付息周期为必输
      if (!repay_intst_period || repay_intst_period == 0) {
        // 如果付息周期为0或者不存在
        toast({
          color: "warning",
          content: this.state.json["36010RPM-000005"]
        }); /* 国际化处理： 付息周期不能为空或为0！ */
        isFlag = false;
      }
    }
    if (Number(e.values.repay_intst_period.value) < 0) {
      toast({
        color: "warning",
        content: this.state.json["36010RPM-000002"]
      }); /* 国际化处理： 付息周期不能为负数！*/
      isFlag = false;
    }
    if (Number(e.values.repay_prcpl_period.value) < 0) {
      toast({
        color: "warning",
        content: this.state.json["36010RPM-000003"]
      }); /* 国际化处理： 还款周期不能为负数！*/
      isFlag = false;
    }
  });
  // 前台解决空格校验
  sendData.model.rows.map(e => {
    if (e.values.repay_intst_method.value === "5") {
      e.values.repay_intst_period.value = "-1";
    }
    if (e.values.repay_prcpl_method.value === "5") {
      e.values.repay_prcpl_period.value = "-1";
    }
  });
  return isFlag ? sendData : "no";
}

/*TRqo9icSh/N3WRtpE9MGIUjzezi9x+epk3bkEGU3DvZW8KrVTJfrMC9lT2tvJCc2*/