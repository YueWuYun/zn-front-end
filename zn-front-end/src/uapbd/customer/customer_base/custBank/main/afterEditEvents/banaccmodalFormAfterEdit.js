//o3TrHV9AI2ZJoRbBqTbiArABwqSONXW3r5uzdpwjA0AazxGeocXONQp8NNEvG67iJR/EcoQ9UyjJ
//Bzxu/+D/Bg==
import {ajax,toast} from 'nc-lightapp-front';
export default function (props, moduleId, key, value, oldValue) {
    let pagecode = props.config.pagecode;
    switch (key) {
        case'accnum':
            //这段逻辑改为修改meta 的reg 和 errorMessage
            // let reg = /^[0-9]*$/;
            // if (!reg.test(value.value)) {
            //     toast({
            //         color: 'info',
            //         content: this.state.json['10140CUST-000040']/* 国际化处理： 只能输入数字！*/
            //     });
            //     props.form.setFormItemsValue(moduleId, {'accnum': {value: '', display: ''}});
            //     return;
            // }
            break;
        case'pk_bankdoc':
            ajax({
                url: '/nccloud/uapbd/bankacc/formafteredit.do',
                data: {
                    value: value.value,
                    key: key,
                    arreacode: moduleId,
                    pagecode: pagecode
                },
                success: (res) => {
                    let {success, data} = res;
                    if(success && data){
                        let {form,UserJson} = data;
                        if (form) {
                            let meta = props.meta.getMeta();
                            // custNetbankinftpUtil(meta['netbankinfo']['items'],data.userjson);
                            renderBankaccRef.call(this,props,moduleId,meta,UserJson,()=>{
                                props.form.setFormItemsValue(
                                    moduleId,
                                    {
                                        'pk_banktype': form[moduleId].rows[0].values.pk_banktype,
                                        'pk_netbankinftp': form[moduleId].rows[0].values.pk_netbankinftp,
                                        'combineaccnum': {
                                            display: form[moduleId].rows[0].values.combineaccnum.value,
                                            value: form[moduleId].rows[0].values.combineaccnum.value
                                        },//人行联行号
                                        'combineaccname': {
                                            display: form[moduleId].rows[0].values.combineaccname.value,
                                            value: form[moduleId].rows[0].values.combineaccname.value
                                        },//联行名称
                                        'combinenum': {
                                            display: form[moduleId].rows[0].values.combinenum.value,
                                            value: form[moduleId].rows[0].values.combinenum.value
                                        },
                                        'orgnumber': {
                                            display: form[moduleId].rows[0].values.orgnumber.value,
                                            value: form[moduleId].rows[0].values.orgnumber.value
                                        },
                                        'bankarea': {
                                            display: form[moduleId].rows[0].values.bankarea.value,
                                            value: form[moduleId].rows[0].values.bankarea.value
                                        },
                                        'province': {
                                            display: form[moduleId].rows[0].values.province.value,
                                            value: form[moduleId].rows[0].values.province.value
                                        },
                                        'city': {
                                            display: form[moduleId].rows[0].values.city.value,
                                            value: form[moduleId].rows[0].values.city.value
                                        },
                                        'customernumber': {
                                            display: form[moduleId].rows[0].values.customernumber.value,
                                            value: form[moduleId].rows[0].values.customernumber.value
                                        },
                                        'areacode': form[moduleId].rows[0].values.areacode,
                                        'issigned': form[moduleId].rows[0].values.issigned
                                    });
                                props.form.setFormItemsDisabled(moduleId, {'pk_banktype': true});
                            });
                        }
                    }
                }
            });
            break;
        case'pk_banktype':
            ajax({
                url: '/nccloud/uapbd/bankacc/formafteredit.do',
                data: {
                    value: value.value,
                    key: key,
                    arreacode: moduleId,
                    pagecode: pagecode
                },
                success: (res) => {
                    let {success, data} = res;
                    if (success && data) {
                            props.form.setFormItemsValue(moduleId, {
                                'pk_netbankinftp': data[moduleId].rows[0].values.pk_netbankinftp
                            });
                    }
                }
            });
            break;
    }
}
function renderBankaccRef(props, moduleId, meta, flag, callback) {
    let bankaccref = {
        refName: this.state.json['10140SUG-000213'],
        itemtype: flag == 'Y' ? 'refer' : 'input',
        refcode: 'uapbd/refer/customer/RefBankAccountComp/index',
        ibanFormId: 'generateIban',
        form: props.form,
        mainFormId: moduleId,
        pagecode: props.config.pagecode,
        json: this.state.json,
        onAfterSave: this.writebackIbanCode,
        queryCondition:{
            pk_bankdoc:this.props.form.getFormItemsValue(moduleId, 'pk_bankdoc').value,
            actionName:'loadBankDoc'
        },
        reg:flag == 'Y'? null: new RegExp('^[[a-zA-Z0-9\-]*$'),
        errorMessage:flag =='Y'?null:this.state.json['10140CUST-000040'],
    }
    let accnameitem = meta[moduleId]['items'].find(item => item.attrcode == 'accnum');
    Object.assign(accnameitem, bankaccref);
    props.meta.setMeta(meta, () => {
        callback && callback();
    });

}

//o3TrHV9AI2ZJoRbBqTbiArABwqSONXW3r5uzdpwjA0AazxGeocXONQp8NNEvG67iJR/EcoQ9UyjJ
//Bzxu/+D/Bg==