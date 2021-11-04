//A9URRt7VRc+dY3w+Qtw0f9n0DC7qW9p1FytMLoa3o/i8ye8v9jDbUu2JUfu0ixxJ
import {ajax, toast} from 'nc-lightapp-front';
import netbankinftpUtil from './netbankinftpUtil';

export default function formAfterEvents(props, moduleId, key, value, changedrows, i, s, g) {

    let gridId = props.config.gridId;
    let pagecode = props.config.pagecode;
    let meta, item;
    let netqueryflagitemvalue = props.form.getFormItemsValue(moduleId, 'netqueryflag');

    switch (key) {

       case 'pk_org':
           value.value && ajax({
                url:'/nccloud/uapbd/bankacc/formafteredit.do',
                data: {
                    value: value.value,
                    key: key,
                    node_type:props.config.NODE_TYPE
                },
                success:(res)=>{
                    let{success,data} = res;
                    if(success){
                        if(data){
                            props.form.setFormItemsValue(moduleId, {'code': {value: data.billcode, display: data.billcode}});
                            props.cardTable.setValByKeyAndIndex(gridId, 0, 'code', {
                                value: data.billcode,
                                display: data.billcode
                            });
                            props.form.setFormItemsDisabled(moduleId, {
                                'code': data['userjson'] == 'diseditable' ? true : false
                            });
                        }
                    }
                }
            });
            break;
        case'accnum':
            //账号字段添加正则校验
            let accnum = value.value;
            if(value.value){
                let reg = /^[A-Za-z0-9@\-_￥$]+$/;
                if(!accnum.match(reg)){
                    props.form.setFormItemFocus(moduleId,'accnum');
                    return;
                }
            }
            !props.form.getFormItemsDisabled(moduleId,'code') && props.form.setFormItemsValue(moduleId, {'code': {value: value.value, display: value.value}});
            !props.form.getFormItemsDisabled(moduleId,'code') && props.cardTable.setValByKeyAndIndex(gridId, 0, 'code', {
                value: value.value,
                display: value.value
            });
            break;
        case'accname':
            let accname = props.form.getFormItemsValue(moduleId, 'accname');
            props.form.setFormItemsValue(moduleId, {'accname': accname});
            //朱三鹏，提的要求在录入户名的时候字表会生成对应的户名+币种+活期的子户名称；只要名称，后面的币种和活期不要
            let name = value.value ;//+ props.cardTable.getValByKeyAndIndex(gridId, 0, 'pk_currtype').display + props.cardTable.getValByKeyAndIndex(gridId, 0, 'acctype').display;
            props.cardTable.setValByKeyAndIndex(props.config.gridId, 0, 'name', {value: name, display: name});
            //TODO 多语文本暂时先这样赋值，等平台出接口。
            props.form.setFormItemsValue(moduleId, {'name': accname, 'name2': accname, 'name3': accname});
            break;
        case'pk_bankdoc':
            let pkBankdoc = props.form.getFormItemsValue(moduleId, 'pk_bankdoc');
            if(pkBankdoc && pkBankdoc.value){
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
                            let {form, UserJson} = data;
                            if (form) {
                                let meta = props.meta.getMeta();
                                netbankinftpUtil(meta['ebankinfo']['items'], form.userjson, false);
                                renderBankaccRef.call(this, props, moduleId, meta, UserJson, () => {
                                    this.setState({netbankinftp: form.userjson}, () => {
                                        // props.meta.setMeta(meta, () => {
                                        props.form.setFormItemsValue(moduleId, {
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
                                            'issigned': form[moduleId].rows[0].values.issigned,
                                            'netqueryflag': {display: '未开通', value: '0'}
                                        });
                                        props.form.setFormItemsDisabled(moduleId, {'pk_banktype': true});
                                    });
                                });
    
                            }
                        }
    
                    }
                });
            }else{
                this.setState({emptyPk_bankdocflag : true});
            }
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
                        //this.state.netbankinftp = data.userjson;
                        this.setState(
                            {
                                netbankinftp : data.userjson,
                                emptyPk_bankdocflag : false
                            }
                            , () => {
                            //  netqueryflagitemvalue && netqueryflagitemvalue == 0 || netbankinftpUtil(meta['ebankinfo']['items'], data.userjson);
                                props.form.setFormItemsValue(moduleId, {
                                    'pk_netbankinftp': data[moduleId].rows[0].values.pk_netbankinftp,
                                    'netqueryflag': {display: '未开通', value: '0'}
                                });
                        });
                    }
                }
            });
            break;
        case'pk_netbankinftp':
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
                    if (success) {
                        if (data) {
                            meta = props.meta.getMeta();
                            this.state.netbankinftp = data;
                            this.setState(this.state, () => {
                                //netqueryflagitemvalue && netqueryflagitemvalue == 0 || netbankinftpUtil(meta['ebankinfo']['items'], data.userjson);
                                props.meta.setMeta(meta, () => {
                                    // update by zhenm 20190529
                                    // 本来选择网银接口类别重置网银开通状态为未开通
                                    // 现在取消这段逻辑
                                    // props.form.setFormItemsValue(moduleId, {
                                    //     'netqueryflag': {display: '未开通', value: '0'}
                                    // });
                                    //update end
                                    netbankinftpUtil(meta['ebankinfo']['items'], this.state.netbankinftp, false);
                                })
                            });
                        }
                    }
                }
            });
            break;
        case'netqueryflag':
            meta = props.meta.getMeta();
            if (value.value !== '0') {
                //如果选择的不是未开通 设置网银模板
                netbankinftpUtil(meta['ebankinfo']['items'], this.state.netbankinftp, true);
            } else {
                //如果选择的是未开通 重置网银模板
                netbankinftpUtil(meta['ebankinfo']['items'], this.state.netbankinftp, false);
            }

            props.meta.setMeta(meta, () => {
            })
            break;
        case'financeorg':
            let financeorg = props.form.getFormItemsValue(moduleId, 'financeorg');
            props.form.setFormItemsValue(moduleId, {'controlorg': financeorg});
            break;
        case'controlorg':
            break;
        case'groupaccount':
            meta = props.meta.getMeta();
            item = meta[moduleId]['items'].find(item => item.attrcode === 'genebranprop');
            item.options = value.value ? [{display: this.state.json['10140BANKACC-000025'], value: '0'}, {display: this.state.json['10140BANKACC-000026'], value: '1'}]
                : [{display: this.state.json['10140BANKACC-000025'], value: '0'}, {display: this.state.json['10140BANKACC-000026'], value: '1'}, {display: this.state.json['10140BANKACC-000027'], value: '2'}];
            props.meta.setMeta(meta, () => {
                props.form.setFormItemsDisabled(moduleId, {'genebranprop': !value.value});
                props.form.setFormItemsValue(moduleId, {
                    'genebranprop': value.value ? {value: '0', display: '总账户'} : {
                        value: '2',
                        display: this.state.json['10140BANKACC-000027']
                    },
                    'corrgeneaccount': {
                        value: null,
                        display: null
                    }
                });
                if (!value.value) {
                    props.form.setFormItemsDisabled(moduleId, {'corrgeneaccount': true});
                    props.form.setFormItemsRequired(moduleId, {'corrgeneaccount': false});
                }

            });
            break;
        case'genebranprop':
            props.form.setFormItemsValue(moduleId, {'corrgeneaccount': {display: null, value: null}});
            props.form.setFormItemsDisabled(moduleId, {'corrgeneaccount': value.value === '1' ? false : true});
            props.form.setFormItemsRequired(moduleId, {'corrgeneaccount': value.value === '1' ? true : false});
            break;

        case'netqueryflag':
            meta = props.meta.getMeta();
            netqueryflagitemvalue && netqueryflagitemvalue == 0 || netbankinftpUtil(meta['ebankinfo']['items'], this.state.netbankinftp);
            props.meta.setMeta(meta, () => {
            });
            break;
        default:
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
        reg:flag == 'Y'? null: new RegExp('^[^\u4e00-\u9fa5]+$' ),
        errorMessage:flag =='Y'?null:this.state.json['10140CUST-000040'],
    }
    let accnameitem = meta[moduleId]['items'].find(item => item.attrcode == 'accnum');
    Object.assign(accnameitem, bankaccref);
    props.meta.setMeta(meta, () => {
        callback && callback();
    });

}
//A9URRt7VRc+dY3w+Qtw0f9n0DC7qW9p1FytMLoa3o/i8ye8v9jDbUu2JUfu0ixxJ