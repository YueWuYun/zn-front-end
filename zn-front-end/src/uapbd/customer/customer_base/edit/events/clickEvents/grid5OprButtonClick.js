//AxTy4raCp210nJVx4AxAHr4WVzbbhNehBpNdir2E/GngbZ3YMkBlvyMVhllsopTZz8c3t5FtDvBn
//1XGC7+lS4w==
import {ajax, base, toast} from 'nc-lightapp-front';
import{loadSubGridData} from '../../events/commonfunc/index';
import CustAddress from '../../../custAddress/index';
const ajaxurl = {
    'subgridaction': '/nccloud/uapbd/custsubinfo/subGridAction.do',
    'subgridDel': '/nccloud/uapbd/custsubinfo/deletesublistinfo.do',
    'subFormDel': '/nccloud/uapbd/custsubinfo/deletesubcardinfo.do'
};
/**
 *客户销售信息操作列按钮事件
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
        case'subGrid5Edit':
            editStatusBtns = ['subG5ModalSave', 'subG5ModalCancel'];
            browseStatusBtns = ['subGrid5Edit', 'subGrid5Del', 'subGrid5Addr', 'subGrid5Ref', 'subGrid5Print'];
            //销售信息专管业务员参照
            resppersonitem =
                meta['custsalecard_1']['items'].find(item => item['attrcode'] === 'respperson');
            if (!!resppersonitem) {
                resppersonitem.queryCondition = () => {
                    return {
                        busifuncode: 'sa',
                        pk_org: record.values.pk_org.value
                    }
                }
            }
            //销售信息专管部门参照
            respdeptitem =
                meta['custsalecard_1']['items'].find(item => item['attrcode'] === 'respdept');
            if (!!respdeptitem) {
                respdeptitem.queryCondition = () => {
                    return {
                        pk_org: record.values.pk_org.value,
                        pk_group: record.values.pk_group.value,
                        TreeRefActionExt: 'nccloud.web.uapbd.supplier.suprefcondition.action.RespDeptNCTreeRefSqlBuilder',
                    }
                }
            }
            //销售信息客户销售分类参照
            let saleclassitem = meta['custsalecard_1']['items'].find(item => item['attrcode'] === 'pk_custsaleclass');
            if (!!saleclassitem) {
                saleclassitem.queryCondition = () => {
                    return {
                        pk_org: record.values.pk_org.value
                    }
                }
            }
            //交易类型参照
            let ordertypedefaultitems =
                meta['custsalecard_1']['items'].find(item => item['attrcode'] === 'ordertypedefault');
            if (!!ordertypedefaultitems) {
                ordertypedefaultitems.queryCondition = () => {
                    return {
                        GridRefActionExt: 'nccloud.web.uapbd.customer.baseinfo.extendRef.TransactionTypeExtendsRef',
                    }
                }
            }
            //付款客户，开票客户，收货客户 添加参照过滤条件
            meta['custsalecard_1']['items'].map((obj) => {
                if (obj.attrcode === 'billingcust' || obj.attrcode === 'issuecust' || obj.attrcode === 'pk_paycust') {
                    obj.queryCondition = () => {
                        return {
                            pk_org: record.values.pk_org.value,
                        }
                    }
                }
            })
            //收款协议参照
            incomeGridItem =
                meta['custsalecard_1']['items'].find(item => item['attrcode'] === 'paytermdefault');
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
                props.config.subGrid5,
                props.config.custsaleForm,
                props.config.pagecode,
                'querySubFormOrGrid',
                editStatusBtns,
                browseStatusBtns,
                record.values.pk_custsale.value, () => {
                    props.form.setFormStatus(props.config.custsaleForm, 'edit');
                    //设置按钮显示隐藏
                    props.button.setButtonVisible(browseStatusBtns, false);
                    props.button.setButtonVisible(editStatusBtns, true);
                    props.modal.show('custSaleModal');
                }
            );
            props.meta.setMeta(meta, () => {
            });
            break;
        case 'subGrid5Addr':
            //地址簿
            props.modal.show('custAddress',{
                content:
                    <CustAddress {...props} {...{
                        currentCustPk: formItemArr[0].value,
                        json: props.config.json,
                        pk_saleorg :record.values.pk_org.value,
                        actionName:'subGrid5Addr'
                    }}/>,
            });
            //地址簿
            break;
        case'subGrid5Del':
            editStatusBtns = ['subG5ModalSave', 'subG5ModalCancel'];
            browseStatusBtns = ['subGrid5Edit', 'subGrid5Del', 'subGrid5Addr', 'subGrid5Ref', 'subGrid5Print'];
            //操作列按钮删除
            reqData = {
                pageid: props.config.pagecode,
                model: {
                    areacode: props.config.subGrid5,
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
                                /* 国际化处理： */
                                props.modal.close('custSaleModal');
                                loadSubGridData()(
                                    props,
                                    'shoulder',
                                    props.config.subGrid5,
                                    props.config.custsaleForm,
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

//AxTy4raCp210nJVx4AxAHr4WVzbbhNehBpNdir2E/GngbZ3YMkBlvyMVhllsopTZz8c3t5FtDvBn
//1XGC7+lS4w==