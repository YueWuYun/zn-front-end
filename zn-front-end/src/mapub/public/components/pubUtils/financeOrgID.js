import { ajax } from "nc-lightapp-front";

/**
 *获取财务组织ID
 * 
 * @author  songjqk
 * @param {*} pk_org  工厂主键值
 */
export default function financeOrgID(pk_org) {
    if(pk_org){
        let data = {
            pk_org : pk_org
        }
        ajax({
            url: '/nccloud/mapub/pub/cMGetFinanceorgByOrg.do',
            data: data,
            success: (res) => {
                let data=res.data;
                return data;
            }
        })
    } 
}