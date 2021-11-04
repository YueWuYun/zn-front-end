//C5mdktI5smkR+I9vkCF8gGJktM0VY8En+lm+dVKZBZ6kEONYnzJnHvReVrTYWB4M
/*
 * @Author: 刘奇 
 * @PageInfo: 删除选中行  
 * @Date: 2018-05-24 19:22:33 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2018-06-05 19:42:09
 */
import { AREA } from '../../constance';

export default function deleteRow_BtnClick(props, index) {
	props.editTable.deleteTableRowsByIndex(AREA.bodyTableArea, index);
}

//C5mdktI5smkR+I9vkCF8gGJktM0VY8En+lm+dVKZBZ6kEONYnzJnHvReVrTYWB4M