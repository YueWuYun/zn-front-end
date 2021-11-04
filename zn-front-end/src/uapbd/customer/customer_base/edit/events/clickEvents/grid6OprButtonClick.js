//sxJeFv1h6iDp8Kd7tPerXAZASEJEgd4eoUId5EjHqudTrXhxWyq4E7D5HmoeWWs+TdcVoDcsGroE
//NY59D+MZOQ==
import {ajax, base, toast} from 'nc-lightapp-front';
import{loadSubGridData} from '../../events/commonfunc/index';
const ajaxurl = {
    'subgridaction': '/nccloud/uapbd/custsubinfo/subGridAction.do',
    'subgridDel': '/nccloud/uapbd/custsubinfo/deletesublistinfo.do',
    'subFormDel': '/nccloud/uapbd/custsubinfo/deletesubcardinfo.do'
};
/**
 *客户信用控制操作列按钮事件
 * @param record
 * @param index
 * @param props
 * @param key
 */
export default function (record, index, props, key) {
    let reqData;
    let url;
    let formItemArr = props.form.getFormItemsValue(props.config.formId, ['pk_customer','pk_org']);
    let editStatusBtns, browseStatusBtns;
    switch (key) {
        // 表格操作按钮
        case'subG6Edit':
            editStatusBtns = ['subG6ModalSave','subG6ModalCancel'];
            browseStatusBtns=['subG6Edit','subG6Del','subG6Ref','subG6Pri'];
            //修改
            loadSubGridData()(
                props,
                'modal',
                props.config.subGrid6,
                props.config.creditctlForm,
                props.config.pagecode,
                'querySubFormOrGrid',
                editStatusBtns,
                browseStatusBtns,
                record.values.pk_custcreditctl.value,()=>{
                    //rlg 信用控制域所属组织翻译不出来 现在特殊处理
                    props.form.setFormItemsValue(props.config.creditctlForm,{'pk_customer.pk_org':formItemArr[1]});
                    props.form.setFormStatus(props.config.creditctlForm, 'edit');
                    //设置按钮显示隐藏
                    props.button.setButtonVisible(browseStatusBtns, false);
                    props.button.setButtonVisible(editStatusBtns, true);
                    let pk_customer_main =  props.form.getFormItemsValue(props.config.formId,'pk_customer_main');
                    props.form.setFormItemsDisabled(props.config.creditctlForm,{'creditcontrol':pk_customer_main.value?false:true,'acclimitcontrol':pk_customer_main.value?false:true});
                    props.modal.show('custCreditctlModal');
                }
            );
            break;
        case'subG6Del':
            editStatusBtns = ['subG6ModalSave','subG6ModalCancel'];
            browseStatusBtns=['subG6Edit','subG6Del','subG6Ref','subG6Pri'];
            //删除
            //肩部按钮删除
            reqData = {
                pageid:props.config.pagecode,
                model:{
                    areacode:props.config.subGrid6,
                    rows:[record]
                }
            }
            url = ajaxurl.subgridDel;
            ajax({
                url:url,
                data:reqData,
                success:(res)=>{
                    let{success,data} =res;
                    if(success){
                        if(data){
                            if(data.hasOwnProperty('message')&&data.message){
                                toast({'color':'warning','title':data.message});
                            }else{
                                toast({'color':'success','title':props.config.json['10140CUST-000046']});/* 国际化处理： 操作成功！*/
                                props.modal.close('custCreditctlModal');
                                loadSubGridData()(
                                    props,
                                    'shoulder',
                                    props.config.subGrid6,
                                    props.config.creditctlForm,
                                    props.config.pagecode,
                                    'querySubFormOrGrid',
                                    editStatusBtns,
                                    browseStatusBtns,
                                    formItemArr[0].value
                                );
                            }
                        }
                    }
                }
            });
            break;
        default:
            console.log(key, index);
            break;
    }
}

//sxJeFv1h6iDp8Kd7tPerXAZASEJEgd4eoUId5EjHqudTrXhxWyq4E7D5HmoeWWs+TdcVoDcsGroE
//NY59D+MZOQ==