//3tDL4iYB0kkMcM4Spu6BK2pWM4mQKPYx77PRPXzjIHkKfYYoGHvjIWVgxb0cKr8yDkP9Ov2+Cx5K
//1wvDzY9/Mg==
/**
 * 表头编辑前
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} item 
 * @param {*} index 
 * @param {*} value 
 * @param {*} record 
 */
export default function(props, moduleId, item, index, value, record) {
	//如果不是编辑当前行编辑不了
	if (index != this.updateIndex) {
		return false;
	} else {
		return true;
	}
}

//3tDL4iYB0kkMcM4Spu6BK2pWM4mQKPYx77PRPXzjIHkKfYYoGHvjIWVgxb0cKr8yDkP9Ov2+Cx5K
//1wvDzY9/Mg==