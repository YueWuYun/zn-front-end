/**
 * @param {Object} newValue - 本次变化的字段的最新值
 * @param {Object} oldValue - 本次变化前字段的值的旧值
 * @param {Object} cardData -  卡片数据
 * 页签控制规则
 */
export default function tabsRule(newValue, oldValue, cardData) {
  return {
    contractexeinfo: {
      contractinfo: true, // 始终显示
      active: true,
      clear: false,
    },
    payinfo: {
      contractinfo: true, // 始终显示
      active: true,
      clear: false,
    },
    repayinfo: {
      contractinfo: true, // 始终显示
      active: true,
      clear: false,
    },
  };
}
