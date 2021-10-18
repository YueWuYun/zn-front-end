/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url
} from '../../cons/constant.js';
const tableButtonClick = (props, key, text, record, index) => {
	let org_val = props.form.getFormItemsValue('head', 'pk_org').value;
	let org_display = props.form.getFormItemsValue('head', 'pk_org').display;
	switch (key) {
		// 表格操作按钮
		case 'insertline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: '请先填写财务组织！'
				});
				return;
			}
			this.props.cardTable.addRow(this.tableId);
			let rownum = props.cardTable.getNumberOfRows('paybilldetail_table');
			//表头赋值给标题
			let dataArr = [
				'pk_currtype',
				'pk_balatype',
				'note_type',
				'pk_tradetypeid',
				'pk_account',
				'pk_oppaccount',
				'objecttype',
				'local_rate',
				'pk_supplier'
			];
			let dataform = props.form.getFormItemsValue('head', dataArr);
			dataArr.forEach((val) => {
				let key = val;
				if (props.form.getFormItemsValue(this.formId, key)) {
					let value = props.form.getFormItemsValue(this.formId, key).value;
					let dly = props.form.getFormItemsValue(this.formId, key).display;
					if (value) {
						props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, key, {
							value: value,
							display: dly
						});
						if (key == 'local_rate') {
							//设置本币汇率的编辑性
							let isEdit = props.form.getFormItemsDisabled(this.formId, key);
							if (!isEdit) {
								props.cardTable.setEditableByIndex(this.tableId, rownum - 1, 'local_rate', true);
							}
						}
					}
				}
			});
			// props.cardTable.addRow('paybilldetail_table');
			// let rownum=this.props.cardTable.getNumberOfRows('paybilldetail_table');
			// //获取表头字段值
			// //获取form字段

			// let dataarr=['pk_currtype','pk_balatype','note_type','pk_tradetypeid','pk_account','pk_oppaccount','objecttype','local_rate','pk_supplier'];
			// let dataform=this.props.form.getFormItemsValue('head',dataarr);
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'pk_currtype', { value:dataform[0].value, display:dataform[0].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'pk_balatype', { value:dataform[1].value, display:dataform[1].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'note_type', { value:dataform[2].value, display:dataform[2].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'pk_tradetypeid', { value:dataform[3].value, display:dataform[3].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'pk_account', { value:dataform[4].value, display:dataform[4].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'pk_oppaccount', { value:dataform[5].value, display:dataform[5].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'objecttype', { value:dataform[6].value, display:dataform[6].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'local_rate', { value:dataform[7].value, display:dataform[7].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'pk_supplier', { value:dataform[8].value, display:dataform[8].display});
			break;
		case 'openedit':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: '请先填写财务组织！'
				});
				return;
			}
			props.cardTable.openModel('paybilldetail_table', 'edit', record, index);
			break;
		case 'copybody':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: '请先填写财务组织！'
				});
				return;
			}
			props.cardTable.pasteRow('paybilldetail_table', index);
			break;
		case 'deleteline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: '请先填写财务组织！'
				});
				return;
			}
			props.cardTable.delRowsByIndex('paybilldetail_table', index);
			break;
		default:
			console.log(key, index);
			break;
	}
};
export default tableButtonClick;

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/