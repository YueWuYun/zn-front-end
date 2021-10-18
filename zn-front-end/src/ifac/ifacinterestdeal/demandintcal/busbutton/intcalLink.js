/*yY17CQWuPy5U3fvXlEmGMIoscfzPMsgzSLCuF1YV9L1vwtGG88+s/tT+ZZlOvm3w*/
import { ajax, toast } from 'nc-lightapp-front';
import{requesturl} from '../cons/requesturl';

export const calculateLink = function(props,type,appcode,pagecode,linkpath){
    let link_Data = props.table.getCheckedRows(this.tableId);
    if (link_Data.length != 1) {
        toast({
            color: 'warning',
            content: this.state.json['36340CDIC-000000']/**国际化处理：请选择一条数据 */
        });
        return;
    }

    let pk_rateCode,pk,pk_intobj,pk_org,settlemode,pk_intobjv,beg_date,end_date,pk_accinfo,intmode;
    link_Data.forEach((val) => {
        pk_rateCode = val.data.values.ratecode.value;
        settlemode = val.data.values.settlemode.value;
        pk_accinfo = val.data.values.pk_intaccinfo.value;
        pk_intobjv = val.data.values.pk_intobj.value;
        beg_date = val.data.values.lastsettledate.value;
        end_date = val.data.values.nextsettledate.value;
        if(settlemode==='0'){
            pk_intobj = val.data.values.pk_intaccinfo.value;
        }else{
            pk_intobj = val.data.values.pk_intobj.value;
        }  
        pk_org = val.data.values.pk_org.value;
        intmode = val.data.values.settlemode.value;
    });

    if(type&&type==='rate'){
        rateLink(props,pk_rateCode);
    }else if(type&&type==='interlist'){
        interlistLink.call(this,props,pk_intobj,pk_org);
    }else if(type&&type==='amount'){
        amountLink(props,beg_date,end_date,pk_intobj,pk_accinfo,intmode);
    }else if(type&&type==='interestobj'){
        intObjLink(props,pk_intobjv);
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
export const interlistLink = function(props,pk,pk_org){
    let linkpath;
    ajax({
        url: requesturl.checklist, 
        data: {
            "pks": [pk],
            "extParam":{
                'org':pk_org
            }
        },
        success: (res) => {

            if(res.data=='0'){
                toast({
                    color: 'warning',
                    content: this.state.json['36340CDIC-000029']/**暂无数据 */
                });
            }else if(res.data=='1'){
                linkpath = '/ifac/ifacinterestdeal/demandintlist/main/#/card'
                props.openTo(linkpath, {
                    appcode: '36340CDIB',
                    pagecode: '36340CDIB_C01',
                    islinkquery: true,
                    pks:pk,
                    type:'intercard',
                });
            }else{
                linkpath = '/ifac/ifacinterestdeal/demandintlist/main/#/list'
                props.openTo(linkpath, {
                    appcode: '36340CDIB',
                    pagecode: '36340CDIB_L01',
                    islinkquery: true,
                    pks:pk,
                    type:'interlist',
                    org:pk_org
                });
            }
        }
    })

    
}

/**
 * 联查积数
 * @param {*} props 
 * @param {*} url 
 * @param {*} pk 
 * @param {*} pk_org 
 */
export const amountLink = function(props,beg_date,end_date,pk_intobj,pk_accinfo,intmode){
  
    let linkpath = '/ifac/ifacinterestdeal/adjustamount/main/#/card'
    props.openTo(linkpath, {
        appcode: '36340BAA',
        pagecode: '36340BAA_C01',
        islinkquery: true,
        beg_date:beg_date,
        end_date:end_date,
        pk_intobj:pk_intobj,
        pk_accinfo:pk_accinfo,
        intmode:intmode
    });
}

export const intObjLink = function(props,pk_intobj){
    let linkpath = '/ifac/ifacdemanddepositset/interestobj/main/#/card'
    props.openTo(linkpath, {
        appcode: '36340AIAC',
        pagecode: '36340AIAC_C01',
        islinkquery: true,
        status: 'browse',
        id:pk_intobj,
        source:'link'
    });
}

/*yY17CQWuPy5U3fvXlEmGMIoscfzPMsgzSLCuF1YV9L1vwtGG88+s/tT+ZZlOvm3w*/