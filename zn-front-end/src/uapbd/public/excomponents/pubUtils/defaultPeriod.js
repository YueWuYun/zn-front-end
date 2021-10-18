import { ajax } from "nc-lightapp-front";

/**
 * 设置默认的会计期间
 * 
 * @author  xiejhk
 * @param {*} searchId  查询模板
 * @param {*} that   调用页面传递this，主要用于多语处理
 */
export default function defaultPeriod(props, searchId,that) {
    let cperiod0 = props.search.getSearchValByField(searchId, 'cperiod');
    let pk_org = props.search.getSearchValByField(searchId, 'pk_org');
    if(cperiod0 && cperiod0.value && cperiod0.value.firstvalue && cperiod0.value.firstvalue.length > 0){
        //已有会计期间，不再处理
    }else{
        if(pk_org && pk_org.value && pk_org.value.firstvalue && pk_org.value.firstvalue.length > 0){
            let datas = {
                pk_org : pk_org.value.firstvalue
            }
            ajax({
                url: '/nccloud/cm/cmpub/getAccperiodByDate.do',
                async:false,//同步
                data: datas,
                method: 'post',
                success: (res) => {
                    if(res.data && res.data != null){
                        let cperiodValue = res.data.yearmth;
                        let cperiodName = that.state.json['cmcommon-000001'];
                        props.search.setSearchValByField(searchId, 'cperiod', { value: cperiodValue, display: cperiodName });
                        props.search.setSearchValByField(searchId, 'cperiod', { value: cperiodValue, display: cperiodName },'normal');
                        props.search.setSearchValByField(searchId, 'cperiod', { value: cperiodValue, display: cperiodName },'super');
                    }
                },
                error: (res) =>{
                    //未启用主账簿等不进行抛错
                }
            });
       }
    }
    




    
}