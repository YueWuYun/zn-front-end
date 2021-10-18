/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/
import { createPage, ajax, base, toast,cardCache,promptBox } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import {requesturl} from '../../cons/requesturl.js';
import { setPropCache, getPropCache, loadMultiLang,go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { pk_name,app_code, card_page_id, list_page_id, list_search_id, list_table_id, gotocardcheck,dataSourceTam } from '../../cons/constant.js';
export default function bodyButtonClick(props, key, text, record, index) {

    let that = this;
    switch (key) {
        case 'EditTableBtn':
			this.addQueryCache();
			let extParam;
			extParam = { 'uiState': 'edit' };
			let data = { pk: record[pk_name].value, pageCode: card_page_id,extParam };
			
			ajax({
				url: requesturl.edit,
				data: data,
				success: (res) => {
					promptBox({
			          	color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			          	title: that.state.json['36340AIAC-000027'],// 弹框表头信息/* 国际化处理： 确认修改*/
						content: that.state.json['36340AIAC-000062'],//this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 计息对象未计息，修改有可能导致积数调整失效，是否继续?*/
			         	beSureBtnClick: beSureEditBtnClick.bind(that, props, record, index),
						cancelBtnClick: cancelEditBtnClick.bind(that, props, record, index)
			      	})
					
				}
			});
            break;
        case 'DeleteTableBtn':
            delConfirm(props, record, index);
            break;
            
        
    }
};


//确认
const beSureEditBtnClick = function (props, record, index) {
	go2CardCheck({
		props,
		url: gotocardcheck,
		pk: record[pk_name].value,
		ts: record["ts"].value,
		checkTS: record["ts"].value ? true : false,
		fieldPK: pk_name,
		go2CardFunc: () => {
			props.pushTo('/card', {
				status: 'edit',
				id: record[pk_name].value,
				pagecode: card_page_id
			})
		}
	})
	
};

//取消
const cancelEditBtnClick = function (props, record, index) {
	go2CardCheck({
		props,
		url: gotocardcheck,
		pk: record[pk_name].value,
		ts: record["ts"].value,
		checkTS: record["ts"].value ? true : false,
		fieldPK: pk_name,
		go2CardFunc: () => {
			props.pushTo('/card', {
				status: 'browse',
				id: record[pk_name].value,
				pagecode: card_page_id
			})
		}
	})
	
};


//删除确认
const delConfirm = function (props, record, index) {
	let pkMapTs = {};
	let pk = record[pk_name].value;
	let ts = record.ts.value;
	pkMapTs[pk] = ts;
	ajax({
		url: requesturl.delete,
		data: {
			pkMapTs,
			pageCode: list_page_id
		},
		success: () => {
			//删除表格数据
			props.table.deleteTableRowsByIndex(list_table_id, index);
			//删除列表缓存
			props.table.deleteCacheId(list_table_id, pk);
			toast({ color: 'success', content: loadMultiLang(props, '36340AIAC-000017') });/* 国际化处理： 删除成功*/
		}
	});
};

 

/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/