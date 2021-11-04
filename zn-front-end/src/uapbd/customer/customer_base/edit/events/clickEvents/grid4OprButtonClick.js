//MPZw782ktoDMnYfqsLBCwMgfYP2fA6/lLvp/5NDF1B9l7hTE3lbQIIOLgJHZeVjnuKEc2cj+scbx
//ROrSBP6fCg==
import {ajax, base, toast} from 'nc-lightapp-front';
import{loadSubGridData} from '../../events/commonfunc/index';
const ajaxurl = {
    'subgridaction': '/nccloud/uapbd/custsubinfo/subGridAction.do',
    'subgridDel': '/nccloud/uapbd/custsubinfo/deletesublistinfo.do',
    'subFormDel': '/nccloud/uapbd/custsubinfo/deletesubcardinfo.do'
};
/**
 *客户财务信息操作列按钮事件
 * @param record
 * @param index
 * @param props
 * @param key
 */
export default function (record, index, props, key) {
    let reqData;
    let url;
    let meta = props.meta.getMeta();
    let incomeGridItem, respdeptitem, resppersonitem;
    let formItemArr = props.form.getFormItemsValue(props.config.formId, ['pk_customer']);
    let editStatusBtns, browseStatusBtns;
    switch (key) {
        // 表格操作按钮
        case'subGrid4Edit':
            editStatusBtns = ['subG4ModalSave', 'subG4ModalCancel'];
            browseStatusBtns = ['subGrid4Edit', 'subGrid4Del', 'subGrid4Ref', 'subGrid4Pri'];
            //财务信息专管业务员参照
            resppersonitem =
                meta['custfinancecard_1']['items'].find(item => item['attrcode'] === 'pk_resppsn1');
            if (!!resppersonitem) {
                resppersonitem.queryCondition = () => {
                    return {
                        //busifuncode: 'sa',
                        pk_org: record.values.pk_org.value
                    }
                }
            }
            //财务信息专管部门参照
            respdeptitem =
                meta['custfinancecard_1']['items'].find(item => item['attrcode'] === 'pk_respdept1');
            if (!!respdeptitem) {
                respdeptitem.queryCondition = () => {
                    return {
                        pk_org: record.values.pk_org.value,
                        pk_group: record.values.pk_group.value,
                        TreeRefActionExt: 'nccloud.web.uapbd.supplier.suprefcondition.action.RespDeptNCTreeRefSqlBuilder',
                    }
                }
            }
            //收款协议参照
            incomeGridItem =
                meta['custfinancecard_1']['items'].find(item => item['attrcode'] === 'pk_payterm');
            if (!!incomeGridItem) {
                incomeGridItem.queryCondition = () => {
                    return {
                        pk_org: record.values.pk_org.value,
                    }
                }
            }
            loadSubGridData()(
                props,
                'modal',
                props.config.subGrid4,
                props.config.custfinanceForm,
                props.config.pagecode,
                'querySubFormOrGrid',
                editStatusBtns,
                browseStatusBtns,
                record.values.pk_custfinance.value, () => {
                    //肩部修改
                    props.form.setFormStatus(props.config.custfinanceForm, 'edit');
                    //设置按钮显示隐藏
                    props.button.setButtonVisible(browseStatusBtns, false);
                    props.button.setButtonVisible(editStatusBtns, true);
                    props.modal.show('custFinanceModal');
                }
            );
            props.meta.setMeta(meta, () => {
            });
            break;
        case'subGrid4Del':
            //删除
            editStatusBtns = ['subG4ModalSave', 'subG4ModalCancel'];
            browseStatusBtns = ['subGrid4Edit', 'subGrid4Del', 'subGrid4Ref', 'subGrid4Pri'];
            //操作列按钮删除
            reqData = {
                pageid: props.config.pagecode,
                model: {
                    areacode: props.config.subGrid4,
                    rows: [record]
                }
            }
            url = ajaxurl.subgridDel;
            ajax({
                url: url,
                data: reqData,
                success: (res) => {
                    let {success, data} = res;
                    if (success) {
                        if (data) {
                            if (data.hasOwnProperty('message') && data.message) {
                                toast({'color': 'warning', 'title': data.message});
                            } else {
                                toast({'color': 'success', 'title':props.config.json['10140CUST-000046']});
                                /* 国际化处理： 操作成功！*/
                                props.modal.close('custFinanceModal');
                                loadSubGridData()(
                                    props,
                                    'shoulder',
                                    props.config.subGrid4,
                                    props.config.custfinanceForm,
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

//MPZw782ktoDMnYfqsLBCwMgfYP2fA6/lLvp/5NDF1B9l7hTE3lbQIIOLgJHZeVjnuKEc2cj+scbx
//ROrSBP6fCg==