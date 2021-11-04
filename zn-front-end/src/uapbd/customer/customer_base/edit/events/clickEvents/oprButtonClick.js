//th5dUYlCtRcSwcP0dc6xh54/6jI/CTRN4kAYLVg1EqKEcNw43Ht5fJ0FvDE7JJn/
import {ajax, base, toast} from 'nc-lightapp-front';
/**
 *客户联系人，国家税类操作列按钮事件
 * @param record
 * @param index
 * @param props
 * @param key
 */
export default function (record, index, props, key) {
    let recordVal = record.values;
    let gridId2 = props.config.subGrid2;
    let gridId3 = props.config.subGrid3
    let formId = props.config.linkman;
    switch (key) {
        // 表格操作按钮
        case'sub2oprExtend':
            let pk_linkman = recordVal.pk_linkman.value;
            ajax({
                url: '/nccloud/uapbd/custsubinfo/queryLinkman.do',
                data: {
                    queryCondition: {
                        pk_linkman: pk_linkman,
                        pagecode: props.config.pagecode,
                        areacode: props.config.linkman
                    }
                },
                success: (res) => {
                    let {success, data} = res;
                    if (success) {
                        if (data) {
                            props.form.setAllFormValue({
                                [formId]: data[formId]
                            });
                        } else {
                            props.form.EmptyAllFormValue(formId);
                        }
                    }
                }

            });
            props.form.setFormStatus(formId, props.form.getFormStatus(props.config.formId));
            props.modal.show('linkmanModal', {
                beSureBtnClick: () => {

                    if (props.form.getFormStatus(formId) === 'browse') {
                        return;
                    }
                    let lmdata = props.form.getAllFormValue(formId);
                    lmdata.areacode = formId;
                    ajax({
                        url: '/nccloud/uapbd/custsubinfo/saveLinkman.do',
                        data: {
                            'pageid': props.config.pagecode,
                            'gridModel': lmdata
                        },
                        success: (res) => {
                            let {success, data} = res;
                            if (success) {
                                if (data) {
                                    //联系人修改成功 更新列表数据
                                    let returnvalues = {
                                        'pk_customer': {
                                            value: recordVal.pk_customer.value
                                        },
                                        'pk_custlinkman': {
                                            value: recordVal['pk_custlinkman'] && recordVal['pk_custlinkman']['value']
                                        },
                                        'pk_linkman': {
                                            value: data[formId].rows[0].values['pk_linkman'].value,
                                            display: data[formId].rows[0].values['name'].value
                                        },
                                        'pk_linkman.sex': data[formId].rows[0].values.sex,
                                        'pk_linkman.vjob': {
                                            value: data[formId].rows[0].values['vjob']['value'],
                                            display: data[formId].rows[0].values['vjob']['value']
                                        },
                                        'pk_linkman.phone': {
                                            value: data[formId].rows[0].values['phone']['value'],
                                            display: data[formId].rows[0].values['phone']['value']
                                        },
                                        'pk_linkman.cell': {
                                            value: data[formId].rows[0].values['cell']['value'],
                                            display: data[formId].rows[0].values['cell']['value']
                                        }

                                    }
                                    record.valuse = Object.assign(record.values, returnvalues)
                                    props.cardTable.updateDataByIndexs(gridId2, [{
                                        index: index,
                                        data: record
                                    }]);
                                }
                            }
                        }
                    });

                },
                cancelBtnClick: () => {
                }
            })
            break;
        case'sub2oprDelete':
            props.cardTable.delRowsByIndex(gridId2, index);
            break;
        case'sub3oprExtend':
            props.cardTable.openModel(gridId3, props.cardTable.getStatus(gridId3) === 'edit' ? 'edit' : 'add', record, index);
            break;
        case'sub3oprDelete':
            props.cardTable.delRowsByIndex(gridId3, index);
            break;
        default:
            console.log(key, index);
            break;
    }
}

//th5dUYlCtRcSwcP0dc6xh54/6jI/CTRN4kAYLVg1EqKEcNw43Ht5fJ0FvDE7JJn/