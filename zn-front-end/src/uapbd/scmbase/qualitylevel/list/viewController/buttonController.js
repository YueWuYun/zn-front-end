//kmMeNHXPpdljPj98yiqeQdKlz3xdyvJpl3AGIOS31WSgypzUaa2eii52arHt4qo0
/*
 * @Author: 刘奇 
 * @PageInfo:界面状态-按钮控制
 * @Date: 2018-12-25 15:40:52 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-01-10 15:17:22
 */
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { AREA, STATUS, BUTTON } from '../../constance';
function buttonControl() {
	// 1、设置页面状态
	setUIState.call(this); // 2、按钮状态控制
	setButtonState.call(this); // 3、主按钮设置
	setMainButton.call(this); // 4、返回按钮控件状态控制
	setHeadInfoState.call(this); // 5、卡片分页器状态控制
	setCardPaginationState.call(this);
}
function setUIState() {}

function setButtonState() {
	this.props.button.hideButtonsByAreas([ BUTTON.list_head, BUTTON.list_body ]);
	//行删除弹出窗
	this.props.button.setPopContent(
		BUTTON.delete,
		getLangByResId(this, '1014QUALITYLEVEL-000003')
	); /* 国际化处理： 确认要删除该信息吗？*/
	//----------------表头肩部按钮----------------
	let headStatus = this.props.editTable.getStatus(AREA.headTableArea);
	let headFlag = headStatus === STATUS.edit ? false : true;
	//浏览态显示：新增、修改、删除、打印、刷新
	this.props.button.setButtonVisible(
		[ BUTTON.edit, BUTTON.add, BUTTON.delete, BUTTON.print, BUTTON.refresh ],
		headFlag
	);
	this.props.button.setButtonVisible([ BUTTON.save, BUTTON.cancel ], !headFlag);
	//选中行后设置删除和打印按钮的可用
	let selectHeadLength = this.props.editTable.getCheckedRows(AREA.headTableArea).length;
	let selHeadFlag = selectHeadLength > 0 ? false : true;
	this.props.button.setDisabled({
		[BUTTON.delete]: selHeadFlag,
		[BUTTON.print]: selHeadFlag
	});

	//----------------表头操作列、查询区编辑性、复选框----------------
	if (headFlag) {
		//浏览态显示操作列、查询可以编辑、表头可以多选
		this.state.searchDisable = false;
		this.state.headShowCheck = true;
		this.props.editTable.showColByKey(AREA.headTableArea, 'opr');
	} else {
		this.state.searchDisable = true;
		this.state.headShowCheck = false;
		this.props.editTable.hideColByKey(AREA.headTableArea, 'opr');
	}
	//----------------表体肩部按钮----------------
	let bodyStatus = this.props.editTable.getStatus(AREA.bodyTableArea);
	let bodyFlag = bodyStatus === STATUS.edit ? false : true;
	//编辑态显示增行、删行
	this.props.button.setButtonVisible([ BUTTON.addLine, BUTTON.deleteLine ], !bodyFlag);
	//----------------表体操作列、复选框----------------
	if (bodyFlag) {
		this.state.bodyShowCheck = false;
		this.props.editTable.hideColByKey(AREA.bodyTableArea, 'opr');
	} else {
		this.state.bodyShowCheck = true;
		this.props.editTable.showColByKey(AREA.bodyTableArea, 'opr');
	}

	let selectBodyLength = this.props.editTable.getCheckedRows(this.bodyTableid).length;
	let selBodyFlag = selectBodyLength > 0 ? false : true;
	this.props.button.setDisabled({
		[BUTTON.deleteLine]: selBodyFlag
	});
}

function setMainButton() {}

function setHeadInfoState() {}

function setCardPaginationState() {}

export { buttonControl };

//kmMeNHXPpdljPj98yiqeQdKlz3xdyvJpl3AGIOS31WSgypzUaa2eii52arHt4qo0