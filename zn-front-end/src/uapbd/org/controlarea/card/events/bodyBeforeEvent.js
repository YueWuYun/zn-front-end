//U41ajtHAnBXc4J9azvHa6SkLGbPE4FR/anSdHpRnwoJmB/wkRuzi3jZ/RDt0NUZp


import {VbfreeIsEnable,getVbfreeQueryCondition} from '../../../../../mapub/public/components/pubUtils/dealVbfree';
/**
 * 表体编辑后事件,编辑前事件的控制,注意每个节点的编辑前事件是不同的，自行删除多语的逻辑
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} index 
 * @param {*} record 
 */
//需要过滤的字段
export default function(props, moduleId, key, value, index, record,type){
    let flag = true; //用来控制单元格是否可操作
    let config ={
        isDataPowerEnable: 'Y',//使用权限
        AppCode: '',
        GridRefActionExt: "",
        TreeRefActionExt: "",
        itemKey:'',
        // pk_org:"",
    }
    if(type =='model'){
       moduleId = this.tableId_Edit
    }
    // console.log('1111111111',props.cardTable.getValByKeyAndIndex(moduleId,index, 'pk_setofbook.pk_accsystem'),props.cardTable.getAllData(moduleId),record)
    let meta = props.meta.getMeta();
    meta[moduleId].items.map((item) => {
        let attrcode = item.attrcode;
        if (attrcode == key) {
            switch (attrcode) {
                case 'pk_accchart':
                    // item.refcode = '/uapbd/refer/fiacc/AccountModelWithSystemGridRef/index'
                    item.queryCondition = (p) => {
                        config.itemKey = key;
                        config.isDataPowerEnable='Y';
                        config.pk_accsystem= record.values['pk_setofbook.pk_accsystem.pk_accsystem'].value || '',
                        config.pagecode='38200CA_card',
                        config.appcode='38200CA',
                        config.AppCode='38200CA',
                        config.nodetype='glb',
                        config.TreeRefActionExt='nccloud.web.uapbd.account.action.RefCondAccChart'
                        return config;
                    }
                    break;
                case 'pk_factorchart':  
                    item.refcode = '/uapbd/refer/fiacc/FactorChartTreeRef/index'
                    item.queryCondition = (p) => {
                        config.itemKey = key;
                        config.isDataPowerEnable='Y';
                        config.pk_factorsystem = record.values["pk_setofbook.pk_checkelemsystem.pk_elementsystem"] ? record.values["pk_setofbook.pk_checkelemsystem.pk_elementsystem"].value : null;
                        return config;
                    }
                    break;

                case 'pk_setofbook':
                    break;
            }
        }
    
    })
    props.meta.setMeta(meta);
    return flag; //默认单元格都可操作

}
//U41ajtHAnBXc4J9azvHa6SkLGbPE4FR/anSdHpRnwoJmB/wkRuzi3jZ/RDt0NUZp