/*yY17CQWuPy5U3fvXlEmGMIoscfzPMsgzSLCuF1YV9L1vwtGG88+s/tT+ZZlOvm3w*/
import { ajax, toast } from 'nc-lightapp-front';
import{requesturl} from '../cons/requesturl';

export const calculateLink = function(props,type,appcode,pagecode,linkpath){
    let link_Data = props.table.getCheckedRows(this.tableId);
    // if (link_Data.length != 1) {
    //     toast({
    //         color: 'warning',
    //         content: this.state.json['36340FDIC-000000']/**国际化处理：请选择一条数据 */
    //     });
    //     return;
    // }

    //let pk_depostrate,pk_aiacrate,beg_date,end_datee,pk_depositreceipt;
    //link_Data.forEach((val) => {
    let    pk_depostrate = link_Data[0].data.values.pk_depostrate.value;
    let    pk_aiacrate = link_Data[0].data.values.pk_aiacrate.value;
        //pk_org = val.data.values.pk_org.value;
    let    pk_depositreceipt = link_Data[0].data.values.pk_depositreceipt.value;
    //});

    if(type&&type==='fixrate'){
        rateLink(props,pk_depostrate);
    }else if(type&&type==='currrate'){
        rateLink(props,pk_aiacrate);
    }else if(type&&type==='interlist'){
        interlistLink.call(this,props,pk_depositreceipt);
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
                    content: this.state.json['36340FDIC-000029']/**暂无数据 */
                });
            }else if(res.data=='1'){
                linkpath = '/ifac/ifacinterestdeal/centerinterestbill/main/#/card'
                props.openTo(linkpath, {
                    appcode: '36340FDIB',
                    pagecode: '36340FDIB_C01',
                    islinkquery: true,
                    pks:pk,
                    type:'intercard',
                });
            }else{
                linkpath = '/ifac/ifacinterestdeal/centerinterestbill/main/#/list'
                props.openTo(linkpath, {
                    appcode: '36340FDIB',
                    pagecode: '36340FDIB_L01',
                    islinkquery: true,
                    pks:pk,
                    type:'interlist'//,
                    //org:pk_org
                });
            }
        }
    })  
}

/*yY17CQWuPy5U3fvXlEmGMIoscfzPMsgzSLCuF1YV9L1vwtGG88+s/tT+ZZlOvm3w*/