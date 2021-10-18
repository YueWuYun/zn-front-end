/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/
import { createPage, ajax, base, toast,cardCache,promptBox } from 'nc-lightapp-front';
import { setPropCache, getPropCache, loadMultiLang, go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { constant, requesturl } from '../../config/config';
import  buttonVisible  from './buttonVisible';
let { NCPopconfirm, NCIcon } = base;

export default function bodyButtonClick(props, key, text, record, index) {
    let that = this;
    switch (key) {
		
		case 'edittablebtn'://修改
			this.addQueryCache();
			let extParam = { 'uiState': 'edit', btncode: 'edittablebtn', pagecode: constant.lpagecode };
			let data = { pk: record[constant.pkname].value, pageCode: constant.cpagecode, extParam };
			ajax({
				url: requesturl.editable,
				data: data,
				success: (res) => {
					if(res.data){
						go2CardCheck({
							props,
							url: requesturl.gotocardcheck,
							pk: record[constant.pkname].value,
							ts: record["ts"].value,
							checkTS: record["ts"].value ? true : false,
							fieldPK: constant.pkname,
							go2CardFunc: () => {
								props.pushTo('/card', {
									status: 'edit',
									id: record[constant.pkname].value,
									pagecode: constant.cpagecode
								})
							}
						})
					}
				}
			});
			break;

        case 'tallytablebtn'://记账
            tallyConfirm.call(that,props, record, index);
			break;

		case 'untallytablebtn'://取消记账
			unTallyConfirm.call(that,props, record, index);
			break;
        
    }
};


//记账
const tallyConfirm = function (props, record, index) {
	
	let pkMapTs = {};
	let pk = record[constant.pkname].value;
	let ts = record.ts.value;
	pkMapTs[pk] = ts;
	ajax({
		url: requesturl.tally,
		data: {
			pkMapTs,
			pageCode: constant.lpagecode,
			extParam: { btncode: 'tallytablebtn', pagecode: constant.lpagecode }
		},
		success: (res) => {
			toast({ color: 'success', content: this.state.json['36140RFD-000064'] });/* 国际化处理： 记账成功*/
			let updateDataArr = [{
				index: index,
				data: { values: res.data.head[constant.formcode1].rows[0].values }
				}];
			props.table.updateDataByIndexs(constant.ltablecode, updateDataArr);
			buttonVisible(this.props);
		}
	});
};


//取消记账
const unTallyConfirm = function (props, record, index) {
	
	let pkMapTs = {};
	let pk = record[constant.pkname].value;
	let ts = record.ts.value;
	pkMapTs[pk] = ts;
	ajax({
		url: requesturl.untally,
		data: {
			pkMapTs,
			pageCode: constant.lpagecode,
			extParam: { btncode: 'untallytablebtn', pagecode: constant.lpagecode }
		},
		success: (res) => {
			toast({ color: 'success', content: this.state.json['36140RFD-000065'] });/* 国际化处理： 取消记账成功*/
			let updateDataArr = [{
				index: index,
				data: { values: res.data.head[constant.formcode1].rows[0].values }
				}];
			props.table.updateDataByIndexs(constant.ltablecode, updateDataArr);
			buttonVisible(this.props);
		}
	});
};

 

/*zPpBovT29EyoCeGjE4sa1dhXTyJ8k10ysYxB48d3hLlHdMS6snGkr/SqOX/isAbX*/