/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import refresh from './refresh.js';
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
	switch (key) {
		case 'editline':
			props.linkTo('../card/index.html', {
				status: 'edit',
				id: record.pk_paybill.value
			});
			break;
		case 'comline':
			let comdata = {
				pks: [ record.pk_paybill.value ],
				pageid: '36070PBR_D5_list'
			};
			ajax({
				url: '/nccloud/cmp/paybills/commit.do',
				data: comdata,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: '提交成功' });
						refresh(props);
					}
				}
			});
			break;
		case 'uncomline':
			let uncomdata = {
				pks: [ record.pk_paybill.value ],
				pageid: '36070PBR_D5_list'
			};
			ajax({
				url: '/nccloud//cmp/paybills/uncommit.do',
				data: uncomdata,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: '收回成功' });
						refresh(props);
					}
				}
			});
			break;
		case 'makebillline':
			let billdata = {
				pks: [ record.pk_paybill.value ],
				ts: record.ts.value
			};
			ajax({
				url: '/nccloud/cmp/paybills/makebill.do',
				data: billdata,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: '删除成功' });
						// NCMessage.create({ content: '删除成功', color: 'success', position: 'top' });
						//props.table.deleteTableRowsByIndex(tableid, indexArr); //直接删除table中的行列
						//refreshHtml(props);
					}
				}
			});
			break;
		case 'delline':
			props.modal.show('reverse', {
				content: '确认删除？',
				//点击确定按钮事件
				beSureBtnClick: () => {
					beSureBtnClickDelete(props, record);
				}
			});
			break;
			break;
		default:
			console.log(key, index);
			break;
	}
};
//删除确认
function beSureBtnClickDelete(props, record, action) {
	let deldata = {
		pks: [ record.pk_paybill.value ],
		ts: record.ts.value
	};
	ajax({
		url: '/nccloud/cmp/billmanagement/delete.do',
		data: deldata,
		success: function(res) {
			let { success, data } = res;
			if (success) {
				toast({ color: 'success', content: '删除成功' });
				// NCMessage.create({ content: '删除成功', color: 'success', position: 'top' });
				//props.table.deleteTableRowsByIndex(tableid, indexArr); //直接删除table中的行列
				refresh(props);
			}
		}
	});
}

export default tableButtonClick;

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/