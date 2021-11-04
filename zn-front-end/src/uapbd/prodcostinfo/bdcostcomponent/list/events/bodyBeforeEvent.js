//U41ajtHAnBXc4J9azvHa6SkLGbPE4FR/anSdHpRnwoJmB/wkRuzi3jZ/RDt0NUZp

import { ajax, base , high,getBusinessInfo } from 'nc-lightapp-front';

/**
 * 表体编辑后事件
 * author kangjjd
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} index 
 * @param {*} record 
 */

export default function(props, moduleId, key,index, value, record){
    let flag = true; //用来控制单元格是否可操作
    let config ={
        isDataPowerEnable: 'Y',//使用权限
        AppCode: '',
        GridRefActionExt: "",
        TreeRefActionExt: "",
        itemKey:'',
        pk_org:"",
        pk_factorsystem:"",
    }
    let meta = props.meta.getMeta();
    props.meta.setMeta(meta);
    return flag; //默认单元格都可操作

}


//U41ajtHAnBXc4J9azvHa6SkLGbPE4FR/anSdHpRnwoJmB/wkRuzi3jZ/RDt0NUZp