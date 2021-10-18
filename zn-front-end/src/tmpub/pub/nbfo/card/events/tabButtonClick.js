/*WCB3AJHqGDlPS44UabI4xT8xdYhqTHzYtiSwe+X6MlHtYclu7fs42PBQckHET7XM*/
import { toast, deepClone } from 'nc-lightapp-front';
import { buttonVisible } from './buttonVisible';
import { tabs } from '../../cons/constant.js';

/**
 * tab-table按钮点击
 * @param {*} props          页面内置对象
 * @param {*} key            注册按钮编码
 * @param {*} text           table组件三参数第一个
 * @param {*} record         table组件三参数第二个
 * @param {*} index          table组件三参数第三个  
 */
export function tabButtonClick(props, key, text, record, index) {
	let currTableId = props.cardTable.getCurTabKey();
	let checkedRows = [];
	// 判断是否选中了数据===》删除行、复制行要使用
	if ([ 'deleteRow', 'copyRow' ].includes(key)) {
		checkedRows = props.cardTable.getCheckedRows(currTableId);
		if (!checkedRows.length) {
			toast({ color: 'warning', content: '请选中行数据!' });
			return;
		}
	}

	switch (key) {
		//行 新增
		case 'addRow':
			props.cardTable.addRow(currTableId, 0);
			break;
		//行 删除
		case 'deleteRow':
			checkedRows = checkedRows && checkedRows.map((item) => item.index);
			this.setState({ checkedRows }, () => {
				props.modal.show('deleteRowModal');
			});
			break;
		//行 复制
		case 'copyRow':
			this.setState({ isPaste: true }, () => {
				buttonVisible.call(this, props);
			});
			break;
		//行 取消
		case 'cancel':
			this.setState({ isPaste: false }, () => {
				buttonVisible.call(this, props);
			});
			break;
		//行 粘贴至末行
		case 'copyLastLine':
			index = props.cardTable.getNumberOfRows(currTableId);
			copyResolve.call(this, props, currTableId, selectArr, index);
			break;
		//粘贴至此
		case 'copyAtLine':
			copyResolve.call(this, props, currTableId, selectArr, index);
			break;
		//复制
		case 'copy':
			props.cardTable.pasteRow(currTableId, index);
			break;
		//插入
		case 'insert':
			props.cardTable.addRow(currTableId);
			break;
		//删除
		case 'delete':
			props.cardTable.delRowsByIndex(currTableId, index);
			break;
		default:
			break;
	}
	// props.cardTable.setStatus(currTableId, 'edit');
}

/**
 * 对复制行的数据进行粘贴处理
 * @param {*} props          页面内置对象
 * @param {*} currTableId    当前选中tab-table的code
 * @param {*} selectArr      选中的数据
 * @param {*} index          行下标
 * 其中： tabs.tabId[currTableId]代表当前table的主键id的可以  
 */
function copyResolve(props, currTableId, selectArr, index) {
	props.cardTable.insertRowsAfterIndex(currTableId, selectArr, index);
	props.cardTable.setValByKeyAndIndex(currTableId, index, tabs.tabId[currTableId], { value: null });
	this.setState({ isPaste: false }, () => {
		buttonVisible.call(this, props);
		// props.cardTable.setStatus(currTableId, 'edit');
	});
}

/*WCB3AJHqGDlPS44UabI4xT8xdYhqTHzYtiSwe+X6MlHtYclu7fs42PBQckHET7XM*/