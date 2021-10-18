/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax, base, toast ,deepClone} from 'nc-lightapp-front';
import { PAYBILL_CONST } from '../../cons/constant.js';
import { addline} from '../events/addLine';
import { saveMultiLangRes,loadMultiLang } from '../../../../../tmpub/pub/util';

//const tableButtonClick = (props, key, text, record, index) => {
	export default function (props, key, text, record, index){
	let org_val = props.form.getFormItemsValue('head', 'pk_org').value;
	let org_display = props.form.getFormItemsValue('head', 'pk_org').display;
	switch (key) {
		// 表格操作按钮
		case 'insertline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: loadMultiLang(this.props, '36070PBR-000006')
				});
				return;
			}

			if (this.checkSettleInfo()) {
				return;
			}
			this.props.cardTable.addRow(this.tableId);
			let rownum = this.props.cardTable.getNumberOfRows('paybilldetail_table');
			let dataArr = ['pk_currtype','pk_balatype','note_type','pk_tradetypeid','pk_account','pk_oppaccount','objecttype',
			   'local_rate','group_rate','global_rate','pk_supplier','mon_account','accountname','pk_customer', 'pk_busiman', 'accountopenbank', 'accountcode',
			   'pk_accountname'];
			addline(this.props, dataArr,rownum-1);
		   break;
			break;
		case 'openedit':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content:  loadMultiLang(this.props, '36070PBR-000006')/* 国际化处理： 请先填写财务组织！*/
				});
				return;
			};

		    //record.values.local_rate.value = record.values.local_rate.display;
			props.cardTable.openModel('paybilldetail_table', 'edit', record, index);
			break;
			case 'openbrowse':
              if(!record.data.values['pk_account'].display)  {
				record.data.values['pk_account'] = {
			   	display: record.data.values['pk_account'].value
				};
			};
			props.cardTable.toggleRowView('paybilldetail_table', record);
			this.setState({ openflag: false });
			break;
			case 'closebrowse':

			props.cardTable.toggleRowView('paybilldetail_table', record);
			this.setState({ openflag: true });
			break;
		case 'copybody':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content:  loadMultiLang(this.props, '36070PBR-000006')/* 国际化处理： 请先填写财务组织！*/
					
				});
				return;
			}
			if(this.checkSettleInfo()){
				return ;
			}
			props.cardTable.pasteRow('paybilldetail_table', index);
			props.cardTable.setValByKeyAndIndex('paybilldetail_table', index, 'pk_paybill_detail', { value: null});
			break;
		case 'deleteline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: loadMultiLang(this.props, '36070PBR-000006')/* 国际化处理： 请先填写财务组织！*/
				
				});
				return;
			}
			if (this.checkSettleInfo()) {
				return;
			}
			props.cardTable.delRowsByIndex('paybilldetail_table', index);
			break;
			case 'CopyAtLine':
			let selectRows = props.cardTable.getCheckedRows(PAYBILL_CONST.card_table_id);
			if (selectRows == null || selectRows.length == 0) {
				toast({
					'color': 'warning',
					'content':  loadMultiLang(this.props, '36070PBR-000015')/* 国际化处理： 请先填写财务组织！*/
				});
				return false;
			}
			let selectIndexs = [];
			let newRecord;
			for (let selectData of selectRows) {
				newRecord = JSON.parse(JSON.stringify(selectData));
				newRecord.data.selected = false;
				newRecord.data.values['pk_paybill_detail'] = {
					value: null,
					display: null,
					scale: '-1'
				};
				newRecord.data.values['billdetail_no'] = {
					value: null,
					display: null
				};

				newRecord.data.values['pseudocolumn'] = {
					value: null,
					display: null
				};
				selectIndexs.push(newRecord.data);
			}
			 if(index!=0&&!index){
				index = props.cardTable.getNumberOfRows(PAYBILL_CONST.card_table_id, false);
			}		
			//TODO 等待平台批量复制的API
			props.cardTable.insertRowsAfterIndex(PAYBILL_CONST.card_table_id, selectIndexs, index);
			this.setState({ pasteflag: false }, () => { this.toggleShow() });	
			break;
		default:
			console.log(key, index);
			break;
	}
};
//export default tableButtonClick;

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/