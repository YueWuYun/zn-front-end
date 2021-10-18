/*WCB3AJHqGDlPS44UabI4xT8xdYhqTHzYtiSwe+X6MlHtYclu7fs42PBQckHET7XM*/
import { ajax, toast } from 'nc-lightapp-front';
import { javaUrl, baseReqUrl } from '../../cons/constant.js';
import { bodySelectedEvent } from './bodySelectedEvent.js';

/**
 * tab-table按钮点击
 * @param {*} props          页面内置对象
 * @param {*} key            注册按钮编码
 * @param {*} text           table组件三参数第一个
 * @param {*} record         table组件三参数第二个
 * @param {*} index          table组件三参数第三个  
 */
export function tabButtonClick(props, key, text, record, index) {
	let checkedRows = props.cardTable.getCheckedRows(this.tableId);
	switch (key) {
		//行 新增
		case 'addrow_i':
			props.cardTable.addRow(this.tableId);
			break;
		//行 删除
		case 'deleterow_i':
			delRow.call(this, props, checkedRows);
			break;
		//行 设为默认
		case 'Endefault_i':
			setDefault.call(this, props, checkedRows);
			break;
	}
}

// 设为默认
function setDefault(props, checkedRows) {
	let cardData = this.props.createExtCardData(this.pageId, this.formId, [ this.tableId ]);
	cardData.bodys.subacc.rows = [];
	cardData.bodys.subacc.rows[0] = checkedRows[0].data;
	ajax({
		url: `${baseReqUrl}${javaUrl.accDefault}.do`,
		data: cardData,
		success: (res) => {
			if (res.success) {
				props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
				props.cardTable.setTableData(this.tableId, res.data.bodys[this.tableId]);
				bodySelectedEvent.call(this);
				toast({ color: 'success', content: this.state.json['36010NBFO-000014'] }); /* 国际化处理： 设置成功!*/
			}
		}
	});
}

// 删行
function delRow(props, checkedRows) {
	checkedRows = checkedRows && checkedRows.map((item) => item.index);
	props.cardTable.delRowsByIndex(this.tableId, checkedRows);
	bodySelectedEvent.call(this);
}

/*WCB3AJHqGDlPS44UabI4xT8xdYhqTHzYtiSwe+X6MlHtYclu7fs42PBQckHET7XM*/