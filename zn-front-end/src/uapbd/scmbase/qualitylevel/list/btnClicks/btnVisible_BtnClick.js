//bB53KRU8ox1E47nlbAdrUvSzeNvChgloQc12YEAkgHJputeF26pWQLvxG2AiQDkMG4Pqr1hHSxpF
//5K3mfueGxw==
/*
 * @Author: 刘奇 
 * @PageInfo: 根据页面状态控制界面一些控件的属性，包括按钮、操作列、复选框
 * @Date: 2018-06-06 14:30:27 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2018-09-20 16:53:41
 */
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { AREA, STATUS, BUTTON } from '../../constance';
export default function btnVisible_BtnClick(props) {
	props.button.hideButtonsByAreas([ BUTTON.list_head, BUTTON.list_body ]);
	//行删除弹出窗
	props.button.setPopContent(BUTTON.delete, getLangByResId(this, '1014QUALITYLEVEL-000003')); /* 国际化处理： 确认要删除该信息吗？*/
	//----------------表头肩部按钮----------------
	let headStatus = props.editTable.getStatus(AREA.headTableArea);
	let headFlag = headStatus === STATUS.edit ? false : true;
	//浏览态显示：新增、修改、删除、打印、刷新
	props.button.setButtonVisible([ BUTTON.edit, BUTTON.add, BUTTON.delete, BUTTON.print, BUTTON.refresh ], headFlag);
	props.button.setButtonVisible([ BUTTON.save, BUTTON.cancel ], !headFlag);
	//选中行后设置删除和打印按钮的可用
	let selectLength = props.editTable.getCheckedRows(AREA.headTableArea).length;
	let flag = selectLength > 0 ? false : true;
	props.button.setDisabled({
		[BUTTON.delete]: flag,
		[BUTTON.print]: flag
	});
	//----------------表头操作列、查询区编辑性、复选框----------------
	if (headFlag) {
		//浏览态显示操作列、查询可以编辑、表头可以多选
		this.state.searchDisable = false;
		this.state.headShowCheck = true;
		props.editTable.showColByKey(AREA.headTableArea, 'opr');
	} else {
		this.state.searchDisable = true;
		this.state.headShowCheck = false;
		props.editTable.hideColByKey(AREA.headTableArea, 'opr');
	}
	//----------------表体肩部按钮----------------
	let bodyStatus = props.editTable.getStatus(AREA.bodyTableArea);
	let bodyFlag = bodyStatus === STATUS.edit ? false : true;
	//编辑态显示增行、删行
	props.button.setButtonVisible([ BUTTON.addLine, BUTTON.deleteLine ], !bodyFlag);
	//----------------表体操作列、复选框----------------
	if (bodyFlag) {
		this.state.bodyShowCheck = false;
		props.editTable.hideColByKey(AREA.bodyTableArea, 'opr');
	} else {
		this.state.bodyShowCheck = true;
		props.editTable.showColByKey(AREA.bodyTableArea, 'opr');
	}
}

//bB53KRU8ox1E47nlbAdrUvSzeNvChgloQc12YEAkgHJputeF26pWQLvxG2AiQDkMG4Pqr1hHSxpF
//5K3mfueGxw==