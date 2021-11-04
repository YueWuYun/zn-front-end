//A0WHkF1rDHKr9EsX9uzHE2b+GUcIyhlHcwZqYVCsEsP6CCXMaCoH7UytA+FonCys
/*
* @Author: yinliang 
* @PageInfo: 质量不合格类型 表单编辑后事件
* @Date: 2019-03-12 09:29:37 
 * @Last Modified by: yinliang
 * @Last Modified time: 2019-06-26 10:16:37
*/
import { FIELD, UISTATE } from '../../constance';

/**
 * 表头编辑后事件
 * @param {*} props 组件的props
 * @param {*} moduleId 操作区域的id
 * @param {*} key 操作的字段
 * @param {*} value 编辑后，操作字段的值，主键
 * @param {*} before 编辑前，操作字段操作前的值（对象）
 * @param {*} after 编辑后，操作字段操作前的值（对象）
 */
export default function(props, moduleId, key, value, before, after) {
	/**
	 * 如果修改了“上级检验项目”，需要更新树结构
	 * 需要更新树结构时，需要将参数changePIDFlag置为true，保存完成之后置为false
	 */
	let formStatus = props.form.getFormStatus(moduleId);
	if (key == FIELD.code || key == FIELD.name || key == FIELD.pid) {
		if (formStatus == UISTATE.edit && value && before && value.value != before.value) {
			this.changePIDFlag = true;
		}
	}
}

//A0WHkF1rDHKr9EsX9uzHE2b+GUcIyhlHcwZqYVCsEsP6CCXMaCoH7UytA+FonCys