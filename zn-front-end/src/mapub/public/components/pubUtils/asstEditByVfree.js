import { ajax} from 'nc-lightapp-front';

/**
 * lishhk
 * 该类是根据生产信息页签对自由辅助属性的处理
 */

/**
 * 判断自由辅助属性是否可以编辑
 */
function asstEditByVfree(props,cmaterialid,key,pk_org){
    let flag =true;
    if(cmaterialid){
        //首先判断缓存中是否存在，不存在再走后面
        let VbfreeIsEnable = this.Info.cmaterialidVfreeMap.get(cmaterialid);
        if(VbfreeIsEnable){
            if(VbfreeIsEnable.indexOf(key) <0){
                flag =false;
            }
            return flag;
        }
        //只传一行数据
        ajax({
            url: '/nccloud/mapub/pub/asstEditByVfreeAction.do',
            data: {
                cmaterialid:cmaterialid,
                pk_org:pk_org
            },
            async: false,
            success: (res) => {
                let {data} = res;
                this.Info.cmaterialidVfreeMap.set(cmaterialid,data);
                if(data && data.indexOf(key) <0){
                    flag =false;
                }
            }
        });
    }else{
        flag = false;
    }
    return flag;


}


export {asstEditByVfree}