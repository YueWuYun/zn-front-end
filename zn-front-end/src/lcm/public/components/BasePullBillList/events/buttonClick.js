//列表头部按钮操作
import { list } from "../../../container";

/**
 * 列表表头按钮点击事件
 * @param {Object} props - 平台传入的props对象 父组件传入参数集合对象
 * @param {String} key -- 按钮编码key
 */
export function buttonClick(props, key) {
  switch (key) {
    // 刷新
    case "Refresh":
      list.getPullListData.call(
        this,
        this.state.baseMultiLangData[
          "3617PUB-000021"
        ] /* 国际化处理： 刷新成功 */,
        false
      );
      break;
    default:
      break;
  }
}
