//W77IPBcUM9wkqtfjxdXzvpPBQI/HS1aXo/2KsvB9b/3Y+KWjPD/LxXOEqP7LVDFm
/*
 * @PageInfo:  供应链快捷键工具类
 * @Author: guozhq 
 * @Date: 2019-01-25 10:30:45 
 * @Last Modified by: guozhq
 * @Last Modified time: 2019-01-25 10:44:28
 */

/**
  * 列表态操作列不需要快捷键的按钮 
  * 例：
  * props.button.createOprationButton({
  *     ...其它
  *     ignoreHotkeyCode:getListDisableHotKeyBtn()
  * })
  */
function getListDisableHotKeyBtn() {
	return [ 'Commit', 'Delete' ]; /** 目前是仅有提交和删除 */
}

/**
 * 卡片态表格肩部不需要快捷键的按钮
 * 例：
 * props.button.createButtonApp({
 *      ...其它
 *      ignoreHotkeyCode:getCardDisableHotKeyBtn()
 * })
 */
function getCardDisableHotKeyBtn() {
	return [ 'DeleteLine' ]; /** 目前是仅有删除行 */
}

export { getListDisableHotKeyBtn, getCardDisableHotKeyBtn };

//W77IPBcUM9wkqtfjxdXzvpPBQI/HS1aXo/2KsvB9b/3Y+KWjPD/LxXOEqP7LVDFm