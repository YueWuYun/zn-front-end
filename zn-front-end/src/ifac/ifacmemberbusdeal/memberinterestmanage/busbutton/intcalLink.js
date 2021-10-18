/*yY17CQWuPy5U3fvXlEmGMIoscfzPMsgzSLCuF1YV9L1vwtGG88+s/tT+ZZlOvm3w*/
import { ajax, toast } from 'nc-lightapp-front';
import{requesturl} from '../cons/requesturl';

export const calculateLink = function(props,type,appcode,pagecode,linkpath){
    let link_Data = props.table.getCheckedRows(this.tableId);
    // if (link_Data.length != 1) {
    //     toast({
    //         color: 'warning',
    //         content: this.state.json['36340FDICC-000000']/**国际化处理：请选择一条数据 */
    //     });
    //     return;
    // }

    //let pk_depostrate,pk_aiacrate,beg_date,end_datee,pk_depositreceipt,depositcode;
    //link_Data.forEach((val) => {
    let    pk_depostrate = link_Data[0].data.values.pk_depostrate.value;
    let    pk_aiacrate = link_Data[0].data.values.pk_aiacrate.value;
    let    pk_depositreceipt = link_Data[0].data.values.pk_depositreceipt.value;
    let    depositcode = link_Data[0].data.values.pk_depositreceipt.value;
    //});

    if(type&&type==='fixrate'){
        rateLink(props,pk_depostrate);
    }else if(type&&type==='currrate'){
        rateLink(props,pk_aiacrate);
    }else if(type&&type==='interlist'){
        interlistLink.call(this,props,pk_depositreceipt);
    }else if(type&&type==='dereceipt'){
        depositCodeLink.call(this,props,depositcode);
    }
}

//利率联查
export const rateLink = function(props,pk_rateCode){
    ajax({
        url: requesturl.ratelink, 
        data: {
            pk: pk_rateCode
        },
        success: (res) => {
            let linkpath,appcode,pagecode;
            if(res.data.rateclass=='2'){
                linkpath = '/tmpub/pub/interestrate_global/main/#/card',
                appcode = '36010IRC',
                pagecode = '36010IRC_card'
            }else if(res.data.rateclass=='1'){
                linkpath = '/tmpub/pub/interestrate_group/main/#/card',
                appcode = '36010IRCG',
                pagecode = '36010IRCG_card'
            }else if(res.data.rateclass=='0'){
                linkpath = '/tmpub/pub/interestrate_org/main/#/card',
                appcode = '36010IRCO',
                pagecode = '36010IRCO_card'
            }
            props.openTo(linkpath, {
                appcode: appcode,
                pagecode: pagecode,
                status: 'browse',
                scene: "linksce",
                //islinkquery: true,
                id:pk_rateCode
            });
        }
    });
}

/**
 * 联查利息清单
 * @param {*} props 
 * @param {*} url 
 * @param {*} pk 
 * @param {*} pk_org 
 */
export const interlistLink = function(props,pk){
    let linkpath;
    ajax({
        url: requesturl.checklist, 
        data: {
             "pks": [pk]
            // ,"extParam":{
            //     'org':pk_org
            // }
        },
        success: (res) => {
            if(res.data=='0'){
                toast({
                    color: 'warning',
                    content: this.state.json['36340FDICC-000029']/**暂无数据 */
                });
            }else if(res.data=='1'){
                linkpath = '/ifac/ifacmemberbusquery/memberinterestbill/main/#/card'
                props.openTo(linkpath, {
                    appcode: '36341FNIBS',
                    pagecode: '36341FNIBS_C01',
                    islinkquery: true,
                    pks:pk,
                    type:'intercard',
                    scene:'linksce',
                });
            }else{
                linkpath = '/ifac/ifacmemberbusquery/memberinterestbill/main/#/list'
                props.openTo(linkpath, {
                    appcode: '36341FNIBS',
                    pagecode: '36341FNIBS_L01',
                    islinkquery: true,
                    pks:pk,
                    type:'interlist',//,
                    scene:'linksce'
                    //org:pk_org
                });
            }
        }
    })  
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
			content: this.state.json['36340FDIB-000009']//{/* 国际化处理： 未查询出符合条件的数据！*/}
		});
	} else {

        //ajax({
			// url:'/nccloud/ifac/fixredepositrcpt/linkreceipt.do',
			// data:depositcode,
			// success:(res)=>{
			// 	if (res.data.length == 0) {
			// 		toast({
			// 			color: 'warning',
			// 			content: this.state.json['36340RFDR-000047'] /* 国际化处理： 未查询出符合条件的数据！*/
			// 		});
			// 	}else{
					this.props.openTo('/ifac/ifacmemberbusquery/memberdepositreceipt/main/index.html#/card', 
					{
						srcFunCode:'36341FNIB',
						appcode: '36341FDLQ',
						pagecode: '36341FDLQ_C01',
						status: 'browse',
						islinkquery: true,
                        //id:res.data[0],
                        id:depositcode,
						scene: "linksce"
					});
				// //}
			//}
		//})



		// this.props.openTo('/ifac/ifactimedepositmange/depositreceipt/main/index.html#/card', 
		// {
		// 	srcFunCode:'36340RFDR',
		// 	appcode: '36340FDLB',
		// 	pagecode: '36340FDLB_C01',
		// 	status: 'browse',
		// 	islinkquery: true,
		// 	id:depositcode,
		// 	scene: "linksce"
		// });
	}
}

/*yY17CQWuPy5U3fvXlEmGMIoscfzPMsgzSLCuF1YV9L1vwtGG88+s/tT+ZZlOvm3w*/