//T9SfypTPwlE3sKTtGfQcG93opHLrcXg9fMneSPFCFf8Lt+7z/VetLHHhMOn0cHPnRHiSFpnou8nu
//HYuvOrtBxw==
import {ajax} from 'nc-lightapp-front';

export default function (props, moduleId, key, value, changedrows, i, s, g) {
    let meta = props.meta.getMeta();

    switch (key) {
        case 'custprop':
            //如果选择内部客户 对应业务单元可编辑 必输
            props.form.setFormItemsDisabled(moduleId, { 'pk_financeorg': value.value != '1' });
            props.form.setFormItemsRequired(moduleId, { 'pk_financeorg': value.value == '1' });
            //如果选择内部部客户 散户不可编辑并且取消勾选
            props.form.setFormItemsDisabled(moduleId, { 'isfreecust': value.value == '1' });
            props.form.setFormItemsValue(moduleId,{'isfreecust':{value:false}});
            //清空对应业务单元
            props.form.setFormItemsValue(moduleId,{'pk_financeorg':{value:'',display:''}});
            break;

        case 'pk_org':
            //客户-业务单元节点 如果选择了所属业务单元 客户类型设置为外部客户 不可编辑
            value.value && ajax({
                url:'/nccloud/uapbd/customer/baseinfoAfterEdit.do',
                data:{
                    pk_org:value.value
                },
                success:(res)=>{
                    let {success,data} = res;
                    if(success){
                        if(data){
                            let {billcode,isEdit} = data;
                            props.form.setFormItemsValue(moduleId,{'code':{value:billcode,display:billcode}});
                            props.form.setFormItemsDisabled(moduleId,{'code':isEdit == 'diseditable'? true:false});
                        }
                        props.form.setFormItemsValue(moduleId,{'custprop':{value:'0',display:''}});
                        props.form.setFormItemsDisabled(moduleId,{'custprop':value.value? true:false});
                        //对应业务单元不可编辑
                        props.form.setFormItemsDisabled(moduleId,{'pk_financeorg':true});
                        props.form.setFormItemsRequired(moduleId, { 'pk_financeorg':false});
                        //清空对应业务单元
                        props.form.setFormItemsValue(moduleId,{'pk_financeorg':{value:'',display:''}});

                    }
                }
            });
            break;
    }
    props.meta.setMeta(meta);

}

//T9SfypTPwlE3sKTtGfQcG93opHLrcXg9fMneSPFCFf8Lt+7z/VetLHHhMOn0cHPnRHiSFpnou8nu
//HYuvOrtBxw==