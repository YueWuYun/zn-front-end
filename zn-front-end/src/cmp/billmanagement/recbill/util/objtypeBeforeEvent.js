/*g9Nv+b8Ag90BpuqAfss0w6ZsNJOgmnF7sFLcb7Cd75H4XJ2IrwhKfyEb79fyBLis*/

import { ajax } from 'nc-lightapp-front';
/**
 * [收款结算]-[对象交易类别：散户控制(通过org来进行过滤散户)]-[form编辑前控制]
 * @param {*} props  
 * @param {*} key  参数值
 * @param {*} mouldeId  数据空间formid或者tableid
 */
export const objBeforeCustomerForm = function (props, mouldeId, key) {
    let value = props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null;
    if (value && mouldeId && key == 'objecttype') {
        ajax({
            url: '/nccloud/cmp/pub/getpara.do',
            //参数返回类型type， int ,string,boolean
            //组织pk_org
            //参数编码paracode 
            data: { paracode: 'CMP48', pk_org: value, type: 'boolean' },
            success: (res) => {
                let { success, data } = res;
                if (res.data.CMP48) {
                    let meta = props.meta.getMeta();
                    let item = meta[mouldeId].items.find(e => e.attrcode === 'objecttype')
                    item.options = [
                        {
                            "display": " ", /* 清空*/
                            "value": " "
                        },
                        {
                            "display": this.state.json['36070-000027'], /* 国际化处理： 客户*/
                            "value": "0"
                        },
                        {
                            "display": this.state.json['36070-000028'], /* 国际化处理： 供应商*/
                            "value": "1"
                        },
                        {
                            "display": this.state.json['36070-000029'], /* 国际化处理： 部门*/
                            "value": "2"
                        },
                        {
                            "display": this.state.json['36070-000030'], /* 国际化处理： 人员*/
                            "value": "3"
                        },
                        {
                            "display": this.state.json['36070-000031'], /* 国际化处理： 散户*/
                            "value": "4"
                        }
                    ]
                    props.renderItem('form', this.formId, 'objecttype', null);
                    props.meta.setMeta(meta);
                } else {
                    let meta = props.meta.getMeta();
                    let item = meta[mouldeId].items.find(e => e.attrcode === 'objecttype')
                    item.options = [
                        {
                            "display": " ", /* 清空*/
                            "value": " "
                        },
                        {
                            "display": this.state.json['36070-000027'], /* 国际化处理： 客户*/
                            "value": "0"
                        },
                        {
                            "display": this.state.json['36070-000028'], /* 国际化处理： 供应商*/
                            "value": "1"
                        },
                        {
                            "display": this.state.json['36070-000029'], /* 国际化处理： 部门*/
                            "value": "2"
                        },
                        {
                            "display": this.state.json['36070-000030'], /* 国际化处理： 人员*/
                            "value": "3"
                        }
                    ]
                    props.renderItem('form', this.formId, 'objecttype', null);
                    props.meta.setMeta(meta);
                }

            }
        });
    }

}

/**
 * [收款结算]-[交易类别：散户控制(通过org来进行过滤散户)]-[table编辑前控制]
 * @param {*} props  
 * @param {*} key  参数值
 * @param {*} mouldeId  数据空间formid或者tableid
 */
export const objBeforeCustomerTable = function (props, mouldeId, key) {

    let value = props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null;
    if (value && mouldeId && key == 'objecttype') {
        ajax({
            url: '/nccloud/cmp/pub/getpara.do',
            //参数返回类型type， int ,string,boolean
            //组织pk_org
            //参数编码paracode 
            data: { paracode: 'CMP48', pk_org: value, type: 'boolean' },
            success: (res) => {
                let { success, data } = res;
                if (res.data.CMP48) {
                    let meta = props.meta.getMeta();
                    let item = meta[mouldeId].items.find(e => e.attrcode === 'objecttype');
                    let childernTable_item = meta[this.childform].items.find(e => e.attrcode === 'objecttype');//侧拉编辑处理
                    item.options = [
                        {
                            "display": " ", /* 清空*/
                            "value": " "
                        },
                        {
                            "display": this.state.json['36070-000027'], /* 国际化处理： 客户*/
                            "value": "0"
                        },
                        {
                            "display": this.state.json['36070-000028'], /* 国际化处理： 供应商*/
                            "value": "1"
                        },
                        {
                            "display": this.state.json['36070-000029'], /* 国际化处理： 部门*/
                            "value": "2"
                        },
                        {
                            "display": this.state.json['36070-000030'], /* 国际化处理： 人员*/
                            "value": "3"
                        },
                        {
                            "display": this.state.json['36070-000031'], /* 国际化处理： 散户*/
                            "value": "4"
                        }
                    ]
                    childernTable_item.options = [
                        {
                            "display": " ", /* 清空*/
                            "value": " "
                        },
                        {
                            "display": this.state.json['36070-000027'], /* 国际化处理： 客户*/
                            "value": "0"
                        },
                        {
                            "display": this.state.json['36070-000028'], /* 国际化处理： 供应商*/
                            "value": "1"
                        },
                        {
                            "display": this.state.json['36070-000029'], /* 国际化处理： 部门*/
                            "value": "2"
                        },
                        {
                            "display": this.state.json['36070-000030'], /* 国际化处理： 人员*/
                            "value": "3"
                        },
                        {
                            "display": this.state.json['36070-000031'], /* 国际化处理： 散户*/
                            "value": "4"
                        }
                    ]
                    props.renderItem('table', this.tableId, 'objecttype', null);
                    props.renderItem('form', this.childform, 'objecttype', null);//侧拉框处理
                    props.meta.setMeta(meta);
                } else {
                    let meta = props.meta.getMeta();
                    let item = meta[mouldeId].items.find(e => e.attrcode === 'objecttype')
                    let childernTable_item = meta[this.childform].items.find(e => e.attrcode === 'objecttype');//侧拉编辑处理
                    item.options = [
                        {
                            "display": " ", /* 清空*/
                            "value": " "
                        },
                        {
                            "display": this.state.json['36070-000027'], /* 国际化处理： 客户*/
                            "value": "0"
                        },
                        {
                            "display": this.state.json['36070-000028'], /* 国际化处理： 供应商*/
                            "value": "1"
                        },
                        {
                            "display": this.state.json['36070-000029'], /* 国际化处理： 部门*/
                            "value": "2"
                        },
                        {
                            "display": this.state.json['36070-000030'], /* 国际化处理： 人员*/
                            "value": "3"
                        }
                    ]
                    childernTable_item.options = [
                        {
                            "display": " ", /* 清空*/
                            "value": " "
                        },
                        {
                            "display": this.state.json['36070-000027'], /* 国际化处理： 客户*/
                            "value": "0"
                        },
                        {
                            "display": this.state.json['36070-000028'], /* 国际化处理： 供应商*/
                            "value": "1"
                        },
                        {
                            "display": this.state.json['36070-000029'], /* 国际化处理： 部门*/
                            "value": "2"
                        },
                        {
                            "display": this.state.json['36070-000030'], /* 国际化处理： 人员*/
                            "value": "3"
                        }
                    ]
                    props.renderItem('table', this.tableId, 'objecttype', null);
                    props.renderItem('form', this.childform, 'objecttype', null);//侧拉框处理
                    props.meta.setMeta(meta);
                }

            }
        });
    }

}
/*g9Nv+b8Ag90BpuqAfss0w6ZsNJOgmnF7sFLcb7Cd75H4XJ2IrwhKfyEb79fyBLis*/