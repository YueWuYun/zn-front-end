//xf5CN4pqv6JCps4gdTEKU2qEujLN+BRh1DtcvETQMWK+gVGIl/AiKmdYeJJ9JHJh
import {cardCache} from "nc-lightapp-front";
let {setDefData, getDefData } = cardCache;

export default function modifierAssistant(props,data){
    let meta = props.meta.getMeta();
    //重置辅助属性显示，将辅助属性设置为不显示
    resetMarasst(meta);
    if(!data || data.length === 0){
        meta['formrelation'].materialstock=['stock_base','stock_check','stock_atp','stock_realusableamount'];//,'stock_audit'
        meta['formrelation'].materialplan=['plan_base'];//,'plan_audit'
        meta['formrelation'].materialprod=['prod_base','producecost'];//,'prod_audit'
        return;
    }else{
        meta['formrelation'].materialstock=['stock_base','stock_freeasst','stock_check','stock_atp','stock_realusableamount'];//,'stock_audit'
        meta['formrelation'].materialplan=['plan_base','plan_marasst'];//,'plan_audit'
        meta['formrelation'].materialprod=['prod_base','producecost','costvalutasst'];//,'prod_audit'
    }
    data.forEach(element => {
        let _cache_MarAssistant = getDefData('_cache_MarAssistant',props.config.datasource);
        if(element.code !== '1'){
            if(_cache_MarAssistant && _cache_MarAssistant[element.pk_userdefitem]){
                //设置利润中心信息的子表中的辅助属性显示
                if(meta['materialpfcsub']){
                    meta['materialpfcsub'].items.forEach((item,index) => {
                        if(item.attrcode === ('marasst'+element.code)){
                            meta['materialpfcsub'].items[index].visible=true;
                            meta['materialpfcsub'].items[index].label=_cache_MarAssistant[element.pk_userdefitem].showname;
                        }
                    });
                }
                //设置库存信息表单中的辅助属性显示
                if(meta['stock_freeasst']){
                    meta['stock_freeasst'].items.forEach((item,index) => {
                        if(item.attrcode === ('fixasst'+element.code)||item.attrcode === ('freeasst'+(element.code-5))){
                            meta['stock_freeasst'].items[index].visible=true;
                            meta['stock_freeasst'].items[index].label=_cache_MarAssistant[element.pk_userdefitem].showname;
                        }
                    });
                }
                //设置计划信息表单中的辅助属性显示
                if(meta['plan_marasst']){
                    meta['plan_marasst'].items.forEach((item,index) => {
                        if(item.attrcode === ('marasst'+element.code)){
                            meta['plan_marasst'].items[index].visible=true;
                            meta['plan_marasst'].items[index].label=_cache_MarAssistant[element.pk_userdefitem].showname;
                        }
                    });
                }
                //设置生成信息表单中的辅助属性显示
                if(meta['costvalutasst']){
                    meta['costvalutasst'].items.forEach((item,index) => {
                        if(item.attrcode === ('costvalutasst'+element.code)){
                            meta['costvalutasst'].items[index].visible=true;
                            meta['costvalutasst'].items[index].label=_cache_MarAssistant[element.pk_userdefitem].showname;
                        }
                    });
                }
                //设置成本信息子表中的辅助核算属性
                if(meta['materialcostmode']){
                    meta['materialcostmode'].items.forEach((item,index) => {
                        if(item.attrcode === ('marasst'+element.code)){
                            meta['materialcostmode'].items[index].visible=true;
                            meta['materialcostmode'].items[index].label=_cache_MarAssistant[element.pk_userdefitem].showname+(props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000091')/* 国际化处理： 核算*/);
                        }
                    });
                }
                //设置利润中心成本信息子表中的辅助核算属性 没有marasst100
                if(meta['profitcostlist']){
                    meta['profitcostlist'].items.forEach((item,index) => {
                        if(item.attrcode === ('marasst'+element.code)){
                            meta['profitcostlist'].items[index].visible=true;
                            meta['profitcostlist'].items[index].label=_cache_MarAssistant[element.pk_userdefitem].showname+(props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000091')/* 国际化处理： 核算*/);
                        }
                    });
                }
            }
        }else{
            //设置计划信息表单中的辅助属性显示marasst1
            if(_cache_MarAssistant && _cache_MarAssistant[element.pk_userdefitem]){
                if(meta['plan_marasst']){
                    meta['plan_marasst'].items.forEach((item,index) => {
                        if(item.attrcode === ('marasst1')){
                            meta['plan_marasst'].items[index].visible=true;
                            meta['plan_marasst'].items[index].label=_cache_MarAssistant[element.pk_userdefitem].showname;
                        }
                    });
                }
            }
        }
        
    });
    props.meta.setMeta(meta);
}

/**
 * 设置辅助属性不显示，将各页签中的辅助属性设置为都不显示
 * @param {*} meta 
 */
function resetMarasst(meta){
    //设置2-15的辅助属性为不显示
    for(let i=2;i<16;i++){
        //利润中心子表中的辅助属性
        if(meta['materialpfcsub']){
            meta['materialpfcsub'].items.forEach((item,index)=>{
                if(item.attrcode === 'marasst100' || item.attrcode === ('marasst'+i)){
                    meta['materialpfcsub'].items[index].visible=false;
                }
            });
        }
        
        //库存信息表单中的辅助属性
        if(meta['stock_freeasst']){
            meta['stock_freeasst'].items.forEach((item,index) => {
                if(item.attrcode === 'fixasst100' || item.attrcode === ('fixasst'+i)){
                    meta['stock_freeasst'].items[index].visible=false;
                }
            });
        }
        
        //计划信息中表单中的辅助属性（包含有marasst1）
        if(meta['plan_marasst']){
            meta['plan_marasst'].items.forEach((item,index) => {
                if(item.attrcode === 'marasst1' || item.attrcode === 'marasst100' || item.attrcode === ('marasst'+i)){
                    meta['plan_marasst'].items[index].visible=false;
                }
            });
        }
        
        //生产信息表单中的辅助属性
        if(meta['costvalutasst']){
            meta['costvalutasst'].items.forEach((item,index) => {
                if(item.attrcode === 'costvalutasst100' || item.attrcode === ('costvalutasst'+i)){
                    meta['costvalutasst'].items[index].visible=false;
                }
            });
        }
        
        //成本信息子表中的辅助核算
        if(meta['materialcostmode']){ 
            meta['materialcostmode'].items.forEach((item,index) => {
                if(item.attrcode === 'marasst100' || item.attrcode === ('marasst'+i)){
                    meta['materialcostmode'].items[index].visible=false;
                }
            });
        }
        
        //利润中心成本子表中的辅助核算   没有marasst100
        if(meta['profitcostlist']){
            meta['profitcostlist'].items.forEach((item,index) => {
                if(item.attrcode === ('marasst'+i)){
                    meta['profitcostlist'].items[index].visible=false;
                }
            });
        }
    }
}
//xf5CN4pqv6JCps4gdTEKU2qEujLN+BRh1DtcvETQMWK+gVGIl/AiKmdYeJJ9JHJh