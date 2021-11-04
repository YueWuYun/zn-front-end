import { ajax} from 'nc-lightapp-front';

/**
 * hanzhhm
 * 该类是对自由辅助属性的处理
 */

/**
 * 判断自由辅助属性是否可以编辑
 */
function VbfreeIsEnable(props,cmaterialid,key){
    let flag =true;
    if(cmaterialid){
        //首先判断缓存中是否存在，不存在再走后面
        let VbfreeIsEnable = this.Info.cmaterialidVbfreeMap.get(cmaterialid);
        if(VbfreeIsEnable){
            if(VbfreeIsEnable.indexOf(key) !=-1){
                flag =false;
            }
            return flag;
        }
        //只传一行数据
        ajax({
            url: '/nccloud/mapub/pub/vbfreeIsEnable.do',
            data: {
                cmaterialid:cmaterialid,
            },
            async: false,
            success: (res) => {
                let {data} = res;
                this.Info.cmaterialidVbfreeMap.set(cmaterialid,data);
                if(data && data.indexOf(key) !=-1){
                    flag =false;
                }
            }
        });
    }else{
        flag = false;
    }
    return flag;


}

function getVbfreeQueryCondition (props,params,key,record,pagecode,areacode){
    let config ={};
    config.itemKey = key;
    config.isDataPowerEnable='Y';
    config.pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null;
    let reftype_key = 'TreeRefActionExt';
    if (params.refType == 'grid' || params.refType == 'gridTree') {
        reftype_key = 'GridRefActionExt';
    }
    config.appcode = props.getSearchParam("c");
    config.pagecode = pagecode;
    config.areacode = areacode;
    config.data = JSON.stringify({ [areacode]: { areacode: areacode, rows: [ record ] } });
    config.defineField = key;
    config[reftype_key] = 'nccloud.web.mapub.pub.marasst.MarAsstDefaultRef';
    config['UsualGridRefActionExt'] = 'nccloud.web.mapub.pub.marasst.MarAsstDefaultRef';
    return config;
}



export {VbfreeIsEnable,getVbfreeQueryCondition}