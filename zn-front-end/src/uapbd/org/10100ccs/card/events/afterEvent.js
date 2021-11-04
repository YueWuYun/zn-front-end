//OWmq6Ugo6jPE4W7xoi1UXj8PR512kyTS21rNeRW00hlQtkkV5JQfVNGNrH/0ar1a
/**
* @description: 表头编辑后事件
* @param: moduleId 区域编码
* @param: key 当前字段编码
*/
export function afterEvent(props, moduleId, key, value, oldValue) {
	if (key === 'pk_org'){
		props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
		props.button.setButtonDisabled('addRow', false);//恢复增行编辑性
	}
}

//OWmq6Ugo6jPE4W7xoi1UXj8PR512kyTS21rNeRW00hlQtkkV5JQfVNGNrH/0ar1a