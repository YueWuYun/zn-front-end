//5WDelIanR8BEnstFViPZJ422bqc28xJVomYiAEj+nJJTeejKVDEz0j4QfGmDxjFl
import React, {Component} from 'react';
import {base, ajax, toast, getBusinessInfo} from 'nc-lightapp-front';

let {NCButton, NCModal} = base;
import AttrSelect from '../../../public/pubComponent/AttrSelect';
//import './BatchEditModal.less'

/**
 * author zhenmx
 *
 */
class BatchEditModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: {
                show: false,
                modalDropup: true,
                size: 'xlg',
                backdrop: true / false //是否弹出遮罩层/点击遮罩层是否触发关闭事件
            },
            selectedPKs: [],
            json: props.json,
            tabs: [],
            selectRows: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.json).length !== 0) {
            this.setState({
                json: nextProps.json
            });
        }
    }

    show(selectRows) {
        ajax({
            url: '/nccloud/uapbd/custBatchEdit/tabRefer.do',
            data: {
                "pid": "",
                "keyword": "",
                "queryCondition": {
                    "pk_defdoclist": null,
                    "DataPowerOperationCode": "default",
                    "isDataPowerEnable": false,
                    "isShowUnit": false,
                    "mdid": 'e4f48eaf-5567-4383-a370-a59cb3e8a451'
                },
                "pageInfo": {
                    "pageSize": 50,
                    "pageIndex": -1
                }
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data && data.hasOwnProperty('rows')) {
                        this.state.selectRows = selectRows;
                        this.state.modal.show = true;
                        this.state.tabs = data.rows;
                        this.setState(this.state);
                    }
                }
            }
        })
    }

    onsubmit() {
        //校验是否选择批改属性
        let targetOrgIds = [];
        if (this.attrselect.state.selectedAttrs.length === 0) {
            toast({color: 'warning', title: this.state.json['10140CUST-000000']});
            /* 国际化处理： 请选择批改属性！*/
            return;
        }
        //校验是否选择组织
        if (this.attrselect.state.tabVal.refcode !== 'baseinfo' &&
            this.attrselect.orgSelect.state.selectData.datas.length === 0) {
            toast({color: 'warning', title: this.state.json['10140CUST-000001']});
            /* 国际化处理： 请选择组织批改！*/
            return;
        } else {
            this.attrselect.orgSelect.state.selectData.datas.map((item) => {
                targetOrgIds.push(item['id']);
            });
        }
        //校验表单必输
        if (!this.props.form.isCheckNow(this.attrselect.state.batchFormId)) {
            return;
        }
        //业务单元节点 批改数据为集团或者全局数据时只能批改除了基本信息以外的页签
        if (this.props.config.pageFlag == 'list') {
            this.state.selectRows.map((r) => {
                if (this.props.config.NODE_TYPE == 'ORG_NODE' && this.attrselect.state.tabVal.refcode == 'baseinfo') {
                    if (![getBusinessInfo().groupId, 'GLOBLE00000000000000'].includes(r.data.values.pk_org.value)) {
                        this.state.selectedPKs.push(r.data.values.pk_customer.value);
                    }
                } else {
                    this.state.selectedPKs.push(r.data.values.pk_customer.value);
                }
            });
        } else {
            this.state.selectedPKs = this.props.config.NODE_TYPE == 'ORG_NODE'
            && [getBusinessInfo().groupId, 'GLOBLE00000000000000'].includes(this.state.selectRows[1].value)
            && this.attrselect.state.tabVal.refcode == 'baseinfo' ? [] : [this.state.selectRows[0].value];
        }
        if (this.state.selectedPKs.length === 0) {
            toast({
                color: 'warning',
                content: this.state.json['10140CUST-000180']
            });
            return;
        }
        ajax({
            url: '/nccloud/uapbd/customer/batchEditCust.do',
            data: {
                selectedAttrs: this.attrselect.state.selectedAttrs,
                attr_valueMap: this.attrselect.state.attr_valueMap,
                selectedOrgs: targetOrgIds,
                selectedPKs: this.state.selectedPKs,
                appcode: this.props.config.appcode,
                currentTab: this.attrselect.state.tabVal.refcode
            },
            success: (res) => {
                let {success, data} = res;
                let {errorLogResult} = data;
                let {errorMessagegNum, errorLog} = errorLogResult;
                let {errormsgs} = errorLog;
                if (success) {
                    if (errorMessagegNum !== '0') {
                        toast({color: 'warning', content: errormsgs});
                    } else {
                        toast({color: 'success', title: this.state.json['10140CUST-000002']});
                        /* 国际化处理： 批改成功！*/
                        this.loadMainGridData();
                    }
                }
                this.cancel();
            }
        });
    }

    loadMainGridData = () => {
        this.props.config.pageFlag === 'list' && this.props.loadGridData(this.props.getRequestParam(this.props));
        this.props.config.pageFlag === 'card' && this.props.loadCardData(this.state.selectedPKs[0]);
    }

    cancel() {
        this.attrselect.state.orgtypeIds = '',
            this.attrselect.state.selectedAttrs = [];
        this.attrselect.state.attr_valueMap = [];
        this.state.selectedPKs = [];
        this.attrselect.orgSelect.state.selectData.data = [];
        this.state.modal.show = false;
        this.attrselect.setState(this.attrselect.state, () => {
            this.setState(this.state);
        })
    }

    render() {
        let modalCfg = {...this.state.modal}
        return (
            <NCModal {...modalCfg} onHide={this.cancel.bind(this)} fieldid={"customerassign"}
                     className='batchEdit'>
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{this.state.json['10140CUST-000003']}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <AttrSelect ref={(item => this.attrselect = item)} {...this.props}
                                {...{
                                    oprFlag: 'directEdit',
                                    tabs: this.state.tabs,
                                    json: this.state.json
                                }}/>
                </NCModal.Body>
                <NCModal.Footer>
                    <NCButton onClick={this.onsubmit.bind(this)}
                              fieldid={"assignBtn"}>{this.state.json['10140CUST-000004B']}</NCButton>
                    <NCButton onClick={this.cancel.bind(this)}
                              fieldid={"closeBtn"}>{this.state.json['10140CUST-000005']}</NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }
}

export default BatchEditModal;

//5WDelIanR8BEnstFViPZJ422bqc28xJVomYiAEj+nJJTeejKVDEz0j4QfGmDxjFl