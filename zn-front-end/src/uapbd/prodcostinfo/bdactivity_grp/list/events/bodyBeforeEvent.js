//U41ajtHAnBXc4J9azvHa6SkLGbPE4FR/anSdHpRnwoJmB/wkRuzi3jZ/RDt0NUZp

import { ajax, base , high,getBusinessInfo } from 'nc-lightapp-front';

/**
 * 表体编辑后事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} index 
 * @param {*} record 
 */
//需要过滤的字段
let filterFields = ['pk_factorchart','pk_materialdocview','vmaterialpricesource'];
export default function(props, moduleId, key,index, value, record){
    let flag = true; //用来控制单元格是否可操作
    if(filterFields.indexOf(key.attrcode)==-1){
        return flag;
    }
    let config ={
        isDataPowerEnable: 'Y',//使用权限
        AppCode: '',
        GridRefActionExt: "",
        TreeRefActionExt: "",
        itemKey:'',
        pk_org:"",
        pk_factorsystem:"",
        isLiacenter:""
    }
    let meta = props.meta.getMeta();
    meta[moduleId].items.map((item) => {
        let attrcode = item.attrcode;
        if (attrcode == key.attrcode) {
            switch (attrcode) {
                // case 'pk_factorchart'://核算要素表
                //     item.queryCondition = (p) => {
                //         config.pk_org = getBusinessInfo().groupId
                //         config.pk_factorsystem = record.values.pk_elementsystem ? record.values.pk_elementsystem.value : '~';
                //         if(!config.pk_factorsystem){
                //             config.pk_factorsystem ="~"
                //         }
                //         return config;
                //     }
                //     break;
                // case 'pk_materialdocview'://要素与物料对照表
                //     item.queryCondition = (p) => {
                //         //config.desdocid = '37e3adca-e0a0-4dff-82ea-63b335cf5515'
                //         config.pk_org = getBusinessInfo().groupId
                //         config.isLiacenter='Y'
                //         config.pk_elementsystem = record.values.pk_elementsystem ? record.values.pk_elementsystem.value : null;
                //         config.GridRefActionExt = 'nccloud.web.mapub.costtype.handler.DocViewBeforeSqlBuilder';
                //         return config;
                //     }
                //     break;

                // case 'vmaterialpricesource'://材料价格来源
                //     //首先获取模态框中的值
                //     let dataSource = [];
                //     ajax({
                //         url: '/nccloud/mapub/costtype/getcosttypematerialpricedata.do',
                //         data: {pk_org: ""},//获取form表单中的pk_org,集团节点为空,
                //         async:false,
                //         success: (res) => {
                //             if (res.data) {
                //                 dataSource = res.data;
                //             }
                //         }
                //     });
                //     //display: "手工录入,下层卷积"  value: "1,8"                
                //     this.Info.targetKeys = value.value;
                //     this.Info.dataSource = dataSource;
                //     break;
                
                default:
                    
                    break;
            }
        }
    
    })
    props.meta.setMeta(meta);
    return flag; //默认单元格都可操作

}


//U41ajtHAnBXc4J9azvHa6SkLGbPE4FR/anSdHpRnwoJmB/wkRuzi3jZ/RDt0NUZp