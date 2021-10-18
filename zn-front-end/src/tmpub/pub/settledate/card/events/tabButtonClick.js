/*WCB3AJHqGDlPS44UabI4xT8xdYhqTHzYtiSwe+X6MlHtYclu7fs42PBQckHET7XM*/
import { toast, deepClone, promptBox } from 'nc-lightapp-front';
import { buttonVisible } from './buttonVisible';

/**
 * tab-table按钮点击
 * @param {*} props          页面内置对象
 * @param {*} key            注册按钮编码
 * @param {*} text           table组件三参数第一个
 * @param {*} record         table组件三参数第二个
 * @param {*} index          table组件三参数第三个  
 */
export function tabButtonClick(props, key, text, record, index) {
	let checkedRows = [];
	// 判断是否选中了数据===》删除行、复制行要使用
	if ([ 'deleteRow', 'copyRow' ].includes(key)) {
		checkedRows = props.cardTable.getCheckedRows(this.tableId);
		if (!checkedRows.length) {
			toast({ color: 'warning', content: this.state.json['36010ISDC-000016'] }); /* 国际化处理： 请选中行数据!*/
			return;
		}
	}
	// 获取===》粘贴行数据
	let selectArr = [];
	if ([ 'copyLastRow', 'copyThisRow' ].includes(key)) {
		checkedRows = props.cardTable.getCheckedRows(this.tableId);
		let selectRowCopy = deepClone(checkedRows);
		for (let item of selectRowCopy) {
			item.data.selected = false;
			selectArr.push(item.data);
		}
	}
	switch (key) {
		//行 新增
		case 'addRow':
			props.cardTable.addRow(this.tableId);
			break;
		//行 删除
		case 'deleteRow':
			delRows.call(this, checkedRows);
			break;
		//行 复制
		case 'copyRow':
			copyRow.call(this, props);
			break;
		//行 取消
		case 'cancel':
			cancelRows.call(this, props);
			break;
		//行 粘贴至末行
		case 'copyLastRow':
			index = props.cardTable.getNumberOfRows(this.tableId);
			copyResolve.call(this, props, this.tableId, selectArr, index);
			break;
		//粘贴至此
		case 'copyThisRow':
			copyResolve.call(this, props, this.tableId, selectArr, index);
			break;
		//复制
		case 'copy':
			props.cardTable.pasteRow(this.tableId, index);
			break;
		//插入
		case 'insert':
			props.cardTable.addRow(this.tableId, index + 1);
			break;
		//删除
		case 'delete':
			props.cardTable.delRowsByIndex(this.tableId, index);
			break;
		default:
			break;
	}
	props.cardTable.setStatus(this.tableId, 'edit');
}

/**
 * 删行
 * @param {*} props  页面内置对象
 */
function delRows(checkedRows) {
	checkedRows = checkedRows && checkedRows.map((item) => item.index);
	this.props.cardTable.delRowsByIndex(this.tableId, checkedRows);
}

/**
 * 复制
 * @param {*} props  页面内置对象
 */
function copyRow(props) {
	this.setState({ isPaste: true }, () => {
		buttonVisible.call(this, props);
	});
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
function cancelRows(props) {
	this.setState({ isPaste: false }, () => {
		buttonVisible.call(this, props);
	});
}

/**
 * 对复制行的数据进行粘贴处理
 * @param {*} props          页面内置对象
 * @param {*} tableId        当前选中table的code
 * @param {*} selectArr      选中的数据
 * @param {*} index          行下标  
 */
function copyResolve(props, tableId, selectArr, index) {
	props.cardTable.insertRowsAfterIndex(tableId, selectArr, index);
	props.cardTable.setValByKeyAndIndex(tableId, index, this.tablePrimaryId, { value: null });
	this.setState({ isPaste: false }, () => {
		buttonVisible.call(this, props);
		props.cardTable.setStatus(tableId, 'edit');
	});
}

/*WCB3AJHqGDlPS44UabI4xT8xdYhqTHzYtiSwe+X6MlHtYclu7fs42PBQckHET7XM*/