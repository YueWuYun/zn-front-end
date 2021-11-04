//kmMeNHXPpdljPj98yiqeQdKlz3xdyvJpl3AGIOS31WSgypzUaa2eii52arHt4qo0
/*
 * @Author: yinliang 
 * @PageInfo: 按钮状态控制
 * @Date: 2019-03-04 18:13:48 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2020-03-06 10:48:33
 */
import { UISTATE, BUTTONID, AREA, OTHER } from '../../constance';

/**
* 表头按钮状态设置
* 1、设置界面状态
* 2、设置按钮的显示隐藏
* @param {*} props
*/

function setButtonStatus(props, status) {
	// 1、设置页面状态
	setUIState.call(this, props, status);
	// 2、设置按钮的显示隐藏
	setCardButtonVisiable.call(this, props);
	// 3、设置按钮可用性
	setBtnDisabled.call(this, props);
}

/**
 * 设置form的状态
 * @param {*} props 
 * @param {*} status 
 */
function setUIState(props, status) {
	/**
     * form动作，清空form数据，并改变其状态为新增态
     */
	let { EmptyAllFormValue, setFormStatus } = props.form;
	if (status == UISTATE.add) {
		EmptyAllFormValue(AREA.head);
	}
	/**
	 * 控制树的编辑性
	 * setNodeDisable(id, disable, pk)
	 * id:组件id 
	 * disable:是否可用（boolean） false：可用； true: 不可用； 
	 * pk: 节点pk (非必输)。若有，设置某个节点是否可用；若无，设置所有节点是否可用
	 */
	props.syncTree.setNodeDisable(AREA.tree, status != UISTATE.browse ? true : false);

	setFormStatus(AREA.head, status);
}

/**
 * 设置显示的按钮
 * @param {*} props 
 */
function setCardButtonVisiable(props) {
	// let browseBtns = [ BUTTONID.Relation, BUTTONID.Print, BUTTONID.Refresh ];
	// let editBtns = [ BUTTONID.Save, BUTTONID.Cancel ];
	let flag = props.form.getFormStatus(AREA.head) == UISTATE.browse ? true : false;

	// props.button.setButtonVisible(browseBtns, flag);
	// props.button.setButtonVisible(editBtns, !flag);

	let btns = {
		[BUTTONID.Relation]: flag,
		[BUTTONID.Print]: flag,
		[BUTTONID.Refresh]: flag,
		[BUTTONID.Save]: !flag,
		[BUTTONID.Cancel]: !flag
	};
	props.button.setButtonVisible(btns);
}

/**
 * 控制打印按钮和关联按钮的可用性
 * @param {*} props 
 */
function setBtnDisabled(props) {
	let treeVals = this.props.syncTree.getSyncTreeValue(AREA.tree); // 当删除树节点之后，如果没有数据，要置灰关联和打印按钮
	let datasLength = treeVals[0].children ? treeVals[0].children.length > 0 : false;
	let id = props.syncTree.getSelectNode(AREA.tree);
	if (id && datasLength) {
		let refpk = id.refpk;
		let btns = { [BUTTONID.Relation]: refpk == OTHER.rootId, [BUTTONID.Print]: refpk == OTHER.rootId };
		props.button.setButtonDisabled(btns);
	} else {
		props.button.setButtonDisabled({ [BUTTONID.Relation]: !datasLength, [BUTTONID.Print]: !datasLength });
	}
}
export default { setButtonStatus, setUIState };

//kmMeNHXPpdljPj98yiqeQdKlz3xdyvJpl3AGIOS31WSgypzUaa2eii52arHt4qo0