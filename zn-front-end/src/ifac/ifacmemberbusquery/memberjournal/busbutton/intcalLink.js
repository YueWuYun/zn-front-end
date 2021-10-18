/*yY17CQWuPy5U3fvXlEmGMIoscfzPMsgzSLCuF1YV9L1vwtGG88+s/tT+ZZlOvm3w*/
import { ajax, toast } from 'nc-lightapp-front';
import{requesturl} from '../cons/requesturl';

export const calculateLink = function(props,type,appcode,pagecode,linkpath){
    let link_Data = props.table.getCheckedRows(this.tableId);
    // if (link_Data.length != 1) {
    //     toast({
    //         color: 'warning',
    //         content: this.state.json['36341FNIB-000000']/**国际化处理：请选择一条数据 */
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
		if(!depositcode){
		   toast({color:"warning",content:'存单为空，不能联查'}) 
		   return;
	    }
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
			content: this.state.json['36341FNIB-000009']//{/* 国际化处理： 未查询出符合条件的数据！*/}
		});
	} else {
		ajax({
			url:'/nccloud/ifac/fixdepositreceipt/linkquery.do',
			data:{
				pk:depositcode
			},
			success:(res)=>{
				let id = res.data[0].parent.pk_depositreceipt;

				this.props.openTo('/ifac/ifacmemberbusquery/memberdepositreceipt/main/index.html#/card', 
				{
					srcFunCode:'36341FNIB',
					appcode: '36341FDLQ',
					pagecode: '36341FDLQ_C01',
					status: 'browse',
					islinkquery: true,
					id:id,
					scene: "linksce"
				});
			}
		})
		
	}
}

export const linkbill = function(props,pk_sourcebill,bill_type){
	if(!pk_sourcebill){
		toast({
			color: 'warning',
			content: this.state.json['36341FNIB-000009']//{/* 国际化处理： 未查询出符合条件的数据！*/}
		});
	} else {

		let url,appCode,pageCode;
		if(bill_type&&bill_type=='36LJ'){
			url = '/ifac/ifacmemberbusreceipt/fixdepositreceipt/main/index.html#/card';
			appCode = '36340FDSR'; 
			pageCode = '36340FDSR_C01'
		}else if(bill_type&&bill_type=='36LK'){
			url = '/ifac/ifacmemberbusreceipt/fixeddatewithdrawreceipt/main/index.html#/card';
			appCode = '36340NDSR'; 
			pageCode = '36340NDSR_C01'
		}else if(bill_type&&bill_type=='36LM'){
			url = '/ifac/ifacfixredepositrcpt/fixredepositrcpt/main/index.html#/card';
			appCode = '36340RFDR'; 
			pageCode = '36340RFDR_C01'
		}else{
			toast({
				color: 'warning',
				content: '不存在单据类型为【'+bill_type+'】的被联查单据'//{/* 国际化处理： 未查询出符合条件的数据！*/}
			});
			return;
		}
		this.props.openTo(url, 
		{	srcFunCode:'36341FNIB',
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