/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import refresh from './refresh.js';
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { EDIT_INNER_BTN, DELETE_INNER_BTN } = BTN;
const { LIST_PAGECODE, LIST_TABLECODE, SEARCH_CODE, CARD__PAGECODE } = APP_INFO;
const { QUERYCARD, DELETE } = REQUEST_URL;
const { PK_NAME, TS } = BILL_FIELD;
import  {go2Card}  from '../../util/goToCard.js';
export default function tableButtonClick(props, key, text, record, index) {
		//构建请求数据
	function dataBuild(record, index, pageid) {
		let pkMapTs = {};
		let pkMapRowIndex = {};
		let pks = [];
		let pk = record[PK_NAME].value;
		pks.push(pk);
		pkMapRowIndex[pk] = index;
		pkMapTs[pk] = record[TS].value;
		let data = {
			pkMapRowIndex,
			pkMapTs,
			pageid,
			pks
		};
		return data;
	}
	switch (key) {
			// 修改
		case EDIT_INNER_BTN:

		  go2Card(props,{ status: 'edit',id: record[PK_NAME].value,pagecode: CARD__PAGECODE,ts: record['ts'].value} ,{} );
		//	props.pushTo('/card', { status: 'edit', id: record[PK_NAME].value, pagecode: CARD__PAGECODE });
			break;
			// 删除
		case DELETE_INNER_BTN:
			let deldata = dataBuild(record, index, LIST_PAGECODE);
			ajax({
				url: DELETE,
				data: deldata,
				success: (res) => {
					let { data } = res.data;
					let errMsg = '';
					if (data && data.length > 0) {
						for (let operatorResult of data) {
							let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
							//成功
							if (state == 0) {
								//删除缓存数据
								props.table.deleteCacheId(LIST_TABLECODE, pk);
								//删除行
								props.table.deleteTableRowsByIndex(LIST_TABLECODE, rowIndex);
							} else if (state == 1) {
								//失败
								errMsg = errMsg + msg + '\n';
							}
						}
					}
					let { status, msg } = res.data;
					//全部成功
					if (status == 1) {
						toast({ color: 'success', content: msg });
					} else {
						toast({ color: 'danger', content: errMsg });
					}
				}
			});
			break;

		default:
			console.log(key, index);
			break;
	}
}


/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/