//U99vYLa/YOtMXhHkPeXLDwUqpIqch36wPA6KV3yJOKFGISP9xEf/c6jZytcKpaYt
export default function (props, moduleId, key, value,oldValue) {
    let meta,keyitem,formitemvalues;
        this.setState({
            linkmanIsBeEdit :moduleId === this.config.linkman
        },()=>{
            switch (key){

                case'pk_resppsn1':
                    props.form.setFormItemsValue(moduleId ,{'pk_respdept1':{value:value.value?value.values.pk_dept.value:'',display:value.value?value.values.deptname.value:''}});
                    break;
                case'respperson':
                    props.form.setFormItemsValue(moduleId ,{'respdept':{value:value.value?value.values.pk_dept.value:'',display:value.value?value.values.deptname.value:''}});
                    break;
                case'pk_respdept1':

                    formitemvalues = props.form.getFormItemsValue(props.config.custfinanceForm, ['pk_org', 'pk_group']);
                    meta  = props.meta.getMeta();
                    keyitem =
                        meta['custfinancecard_1']['items']
                            .find((item) => item['attrcode'] === 'pk_resppsn1');
                    keyitem.queryCondition = ()=>{
                        return {
                            pk_dept:value.value,
                            pk_org: formitemvalues[0].value
                        }
                    }
                    props.meta.setMeta(meta,()=>{
                        props.form.setFormItemsValue(moduleId,{
                            'pk_resppsn1':{
                                display:'',
                                value:''
                            }
                        })
                    });
                    break;
                case'respdept':
                    formitemvalues = props.form.getFormItemsValue(props.config.custsaleForm, ['pk_org', 'pk_group']);
                    meta  = props.meta.getMeta();
                    keyitem =
                        meta['custsalecard_1']['items']
                            .find((item) => item['attrcode'] === 'respperson');
                    keyitem.queryCondition = ()=>{
                        return {
                            busifuncode: 'sa',
                            pk_org: formitemvalues[0].value,
                            pk_dept:value.value
                        }
                    }
                    props.meta.setMeta(meta,()=>{
                        props.form.setFormItemsValue(moduleId,{
                            'respperson':{
                                display:'',
                                value:''
                            }
                        })
                    });
                    break;
                default:
                    break;
            }
        });
}

//U99vYLa/YOtMXhHkPeXLDwUqpIqch36wPA6KV3yJOKFGISP9xEf/c6jZytcKpaYt