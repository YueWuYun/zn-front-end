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
        pk_org:"",
    }
    if(type =='model'){
       moduleId = this.tableId_Edit
    }
    let meta = props.meta.getMeta();
    meta[moduleId].items.map((item) => {
        let attrcode = item.attrcode;
        if (attrcode == key) {
            switch (attrcode) {
                case 'cmaterialid'://物料版本--根据财务组织过滤
                    item.queryCondition = (p) => {
                        config.itemKey = key;
                        config.isDataPowerEnable='Y';
                        config.pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null;
                        return config;
                    }
                    break;
                case 'nnum':
                case 'nprice':  
                    // 物料或计量单位为空时，不能输入数量和价格
                    let cmaterialid = record.values.cmaterialid ? record.values.cmaterialid.value : null;
                    let cmeasdocid = record.values.cmeasdocid ? record.values.cmeasdocid.value : null;
                    if(!cmaterialid && !cmeasdocid){
                        flag =false;
                    }
                    break;
                //14个自由辅助属性
                case 'cprojectid'://项目
                case 'cvendorid'://供应商
                case 'cproductorid'://生成厂商
                case 'ccustomerid'://客户
                case 'vbfree1':
                case 'vbfree2':
                case 'vbfree3':
                case 'vbfree4':
                case 'vbfree5':
                case 'vbfree6':
                case 'vbfree7':
                case 'vbfree8':
                case 'vbfree9':
                case 'vbfree10':
                    flag = VbfreeIsEnable.call(this,this.props,record.values.cmaterialid.value,key);
                    item.queryCondition = (params) => {
                        let config= getVbfreeQueryCondition.call(this,this.props,params,key,record,this.pageId,this.tableId)
                        return config;
                    }
                    break;
                default:
                    item.queryCondition = (p) => {
                        config.itemKey = key;
                        config.isDataPowerEnable='Y';
                        config.pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null;
                        return config;
                    }
                    break;
            }
        }
    
    })
    props.meta.setMeta(meta);
    return flag; //默认单元格都可操作

}
//U41ajtHAnBXc4J9azvHa6SkLGbPE4FR/anSdHpRnwoJmB/wkRuzi3jZ/RDt0NUZp