/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/
import { createPage, ajax, base, toast,cardCache,promptBox } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import {requesturl} from '../../cons/requesturl.js';
import  buttonUsability  from './buttonUsability';
import { setPropCache, getPropCache, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { pk_name,app_code, card_page_id, list_page_id, list_search_id, list_table_id, button_limit,dataSourceTam, card_from_id } from '../../cons/constant.js';
export default function bodyButtonClick(props, key, text, record, index) {

    let that = this;
    switch (key) {
		
		//冻结
		case 'frozenTableBtn':
			promptBox({				  
	          	color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
	          	title: that.state.json['36340FDLB-000068'],
				content: that.state.json['36340FDLB-000069'],
	         	beSureBtnClick: tallyConfirm.bind(that,props, record, index),
				cancelBtnClick: cancelEditBtnClick.bind(that, props, record, index)
	      	})
            // tallyConfirm.call(that,props, record, index);
			break;
		//解冻
		case 'defrozenTableBtn':
			unTallyConfirm.call(that,props, record, index);
			break;
        
    }
};




//取消
const cancelEditBtnClick = function (props, record, index) {
	// props.pushTo('/card', {
	// 	status: 'browse',
	// 	id: record[pk_name].value,
	// 	pagecode: card_page_id
	// })
};


//记账
const tallyConfirm = function (props, record, index) {
	
	let pkMapTs = {};
	let pk = record[pk_name].value;
	let ts = record.ts.value;
	pkMapTs[pk] = ts;
	ajax({
		url: requesturl.tally,
		data: {
			pkMapTs,
			pageCode: list_page_id
		},
		success: (res) => {
			// toast({ color: 'success', content: loadMultiLang(props, '36340FDLB--000064') });/* 国际化处理： 删除成功*/
			toast({ color: 'success', content: this.state.json['36340FDLB-000066'] });/* 国际化处理： 删除成功*/
			let updateDataArr = [{
				index: index,
				data: { values: res.data.head[card_from_id].rows[0].values }
				}];
			props.table.updateDataByIndexs(list_table_id, updateDataArr);
			buttonUsability.call(this, props, null);
		}
	});
};


//取消记账
const unTallyConfirm = function (props, record, index) {
	
	let pkMapTs = {};
	let pk = record[pk_name].value;
	let ts = record.ts.value;
	pkMapTs[pk] = ts;
	ajax({
		url: requesturl.untally,
		data: {
			pkMapTs,
			pageCode: list_page_id
		},
		success: (res) => {
			// toast({ color: 'success', content: loadMultiLang(props, '36340FDLB--000065') });/* 国际化处理： 删除成功*/
			toast({ color: 'success', content: this.state.json['36340FDLB-000067'] });/* 国际化处理： 删除成功*/
			let updateDataArr = [{
				index: index,
				data: { values: res.data.head[card_from_id].rows[0].values }
				}];
			props.table.updateDataByIndexs(list_table_id, updateDataArr);
			buttonUsability.call(this, props, null);
		}
	});
};

 

/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/