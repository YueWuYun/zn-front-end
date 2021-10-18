/*yY17CQWuPy5U3fvXlEmGMIoscfzPMsgzSLCuF1YV9L1vwtGG88+s/tT+ZZlOvm3w*/
import { ajax, toast,cacheTools } from 'nc-lightapp-front';
import {requesturl} from '../cons/requesturl.js';

export const calculateLink = function(props,type,appcode,pagecode,linkpath){
    let link_Data = props.table.getCheckedRows(this.tableId);
    // if (link_Data.length != 1) {
    //     toast({
    //         color: 'warning',
    //         content: this.state.json['36341FDIBS-000000']/**国际化处理：请选择一提数据 */
    //     });
    //     return;
    // }

    //let depositcode,pk_sourcebill,bill_type;
    //link_Data.forEach((val) => {
	let		depositcode = link_Data[0].data.values.depositcode.value;
	let		pk_sourcebill = link_Data[0].data.values.pk_sourcebill.value;
	let		bill_type = link_Data[0].data.values.bill_type.value;
    //});
	if(type&&type==='dereceipt'){
        depositCodeLink.call(this,props,depositcode);
    }else if(type&&type==='linkbill'){
		linkbill.call(this,props,pk_sourcebill,bill_type);
	}
}

/**
 * 联查存单
 * @param {*} props 
 * @param {*} pk_intobj 
 */
export const depositCodeLink = function(props,depositcode){
	if(!depositcode){
		toast({
			color: 'warning',
			content: this.state.json['36341FDIBS-000009']//{/* 国际化处理： 未查询出符合条件的数据！*/}
		});
	} else {
		this.props.openTo('/ifac/ifactimedepositmange/depositreceipt/main/index.html#/card', 
		{
			srcFunCode:'36340RFDR',
			appcode: '36340FDLB',
			pagecode: '36340FDLB_C01',
			status: 'browse',
			islinkquery: true,
			id:depositcode,
			scene: "linksce"
		});
	}
}

export const linkbill = function(props,pk_sourcebill,bill_type){
	if(!pk_sourcebill){
		toast({
			color: 'warning',
			content: this.state.json['36341FDIBS-000009']//{/* 国际化处理： 未查询出符合条件的数据！*/}
		});
	} else {

		let url,appCode,pageCode;
		if(bill_type&&bill_type=='36L1'){
			url = '/ifac/ifactimedepositmange/depositprocess/main/index.html#/card';
			appCode = '36340FDR'; 
			pageCode = '36340FDR_C01'
		}else if(bill_type&&bill_type=='36L2'){
			url = '/ifac/ifactimedepositmanage/fixeddatewithdraw/main/index.html#/card';
			appCode = '36340FDW'; 
			pageCode = '36340FDW_C01'
		}else if(bill_type&&bill_type=='36LH'){
			url = '/ifac/ifacfixredeposit/fixredeposit/main/index.html#/card';
			appCode = '36340RFD'; 
			pageCode = '36340RFD_C01'
		}else if(bill_type&&bill_type=='36LS'){
			url = '/ifac/ifactimedepositmange/initialdepositreceipt/main/index.html#/card';
			appCode = '36340FDLI'; 
			pageCode = '36340FDLI_C01'
		}else{
			toast({
				color: 'warning',
				content: '不存在单据类型为【'+bill_type+'】的被联查单据'
			});
			return;
		}
		this.props.openTo(url, 
		{	srcFunCode:'36340RFDR',
			appcode: appCode,
			pagecode: pageCode,
			status: 'browse',
			islinkquery: true,
			id:pk_sourcebill,
			scene: "linksce"
		});
	}
}


/*yY17CQWuPy5U3fvXlEmGMIoscfzPMsgzSLCuF1YV9L1vwtGG88+s/tT+ZZlOvm3w*/