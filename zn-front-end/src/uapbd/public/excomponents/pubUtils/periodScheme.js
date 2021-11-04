//sHbQu6bEksRCifyiVdPHKEW4CGcfPwu3uOfNyt0YLYP9niibZw+DQBZW84/ykx6p
import { ajax } from "nc-lightapp-front";

/**
 *获取会计期间方案
 * 
 * @author  songjqk
 * @param {*} pk_org  工厂主键值
 */
export default function periodScheme(props, pk_org) {
    let pk_accperiodscheme;
    if(pk_org){
        let data = {
            pk_org : pk_org
        }
        ajax({
            url: '/nccloud/mapub/pub/cMGetAccperiodschemeByOrg.do',
            async:false,//同步
            data: data,
            success: (res) => {
                pk_accperiodscheme=res.data;
            },
            error: (res) => {
                //错误信息吃掉
            }
        })
        
    } 
    return pk_accperiodscheme;
}
//sHbQu6bEksRCifyiVdPHKEW4CGcfPwu3uOfNyt0YLYP9niibZw+DQBZW84/ykx6p