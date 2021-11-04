//wzXrLLQizH4J3+wYgxi4e9zdXSxIrMJnDUMjbEtqGCsgrslEjS10mvV1qctCDyCJ
import React, {Component} from 'react';
import {createPage, base, ajax, toast} from 'nc-lightapp-front';

let {NCButton, NCModal} = base;
import OrgSelect from '../../../public/pubComponent/OrgSelect';

class AssignModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: {
                show: false,
                modalDropup: true,
                backdrop: true / false,//是否弹出遮罩层/点击遮罩层是否触发关闭事件
                size: 'xlg'

            },
            json: props.json
        }
    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.json).length !== 0) {
            this.setState({
                json: nextProps.json
            })
        }
    }

    show(flag) {
        this.props.config.isAssign = flag === 'assign' ? true : false;
        this.state.modal.show = true;
        this.setState(this.state, () => {
            this.orgSelect.reset()
        });
    }

    onsubmit() {
        let targetOrgIds = [];
        let custpks = [];
        if (this.props.config.pageFlag === 'card') {
            let formitem = this.props.form.getFormItemsValue(this.props.config.formId, 'pk_customer');
            formitem.value && custpks.push(formitem.value);
        } else if (this.props.config.pageFlag === 'list') {
            this.props.table.getCheckedRows(this.props.config.gridId).length !== 0 && this.props.table.getCheckedRows(this.props.config.gridId).map((r) => {
                custpks.push(r.data.values.pk_customer.value);
            });
        } else {
            return;
        }
        this.orgSelect.state.selectData.datas
        && this.orgSelect.state.selectData.datas.map((item) => {
            if (item.orgclazz !== 'orgtype') {
                targetOrgIds.push(item['id']);
            }
        });
        targetOrgIds.length === 0 ? toast({
            'color': 'danger',
            'content': this.state.json['10140CUST-000048']/* 国际化处理： 请选择目标组织！*/
        }) : ajax({
            url: '/nccloud/uapbd/customer/custAssign.do',
            data: {
                pkcustList: custpks,
                targetOrgIds: targetOrgIds,
                isAssign: this.props.config.isAssign,
                appcode: this.props.config.appcode
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data && data.hasOwnProperty('message') && data.message) {
                        if (data.hasOwnProperty('mesType') && data.mesType == '1') {
                            toast({'color': 'success', 'title': data.message});
                            if (this.props.config.pageFlag === 'list') {
                                this.props.loadGridData(this.props.getRequestParam(this.props));
                            } else {
                                this.loadFinaceInfoGridData(custpks[0]);
                                this.loadSaleInfoGridData(custpks[0]);
                                this.loadCreDitCtlInfoGridData(custpks[0]);
                            }
                            this.cancel();
                        } else {
                            toast({'color': 'success', 'title': data.message});
                        }

                    }
                }
            }
        });
    }

    cancel() {
        this.setState({
            modal: {
                show: false
            }
        });
    }

    loadSaleInfoGridData = (custpks) => {
        let editStatusBtns = ['subG5ModalSave', 'subG5ModalCancel'];
        let browseStatusBtns = ['subGrid5Edit', 'subGrid5Del', 'subGrid5Addr', 'subGrid5Ref', 'subGrid5Print'];
        this.props.loadSubGridData && this.props.loadSubGridData(
            'shoulder',
            this.props.config.subGrid5,
            this.props.config.custsaleForm,
            this.props.config.pagecode,
            'querySubFormOrGrid',
            editStatusBtns,
            browseStatusBtns,
            custpks
        );
    }
    loadFinaceInfoGridData = (custpks) => {
        let editStatusBtns = ['subG4ModalSave', 'subG4ModalCancel'];
        let browseStatusBtns = ['subGrid4Edit', 'subGrid4Del', 'subGrid4Ref', 'subGrid4Pri'];
        this.props.loadSubGridData && this.props.loadSubGridData(
            'shoulder',
            this.props.config.subGrid4,
            this.props.config.custfinanceForm,
            this.props.config.pagecode,
            'querySubFormOrGrid',
            editStatusBtns,
            browseStatusBtns,
            custpks
        )
    }
    loadCreDitCtlInfoGridData = (custpks) => {
        let editStatusBtns = ['subG6ModalSave', 'subG6ModalCancel'];
        let browseStatusBtns = ['subG6Edit', 'subG6Del', 'subG6Ref', 'subG6Pri'];
        this.props.loadSubGridData && this.props.loadSubGridData(
            'shoulder',
            this.props.config.subGrid6,
            this.props.config.creditctlForm,
            this.props.config.pagecode,
            'querySubFormOrGrid',
            editStatusBtns,
            browseStatusBtns,
            custpks
        )
    }

    render() {
        var modalCfg = {...this.state.modal}
        return (
            <NCModal size="xlg" {...modalCfg} onHide={this.cancel.bind(this)} fieldid={"customerdistrib"}>
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{this.props.config.isAssign ? this.state.json['10140CUST-000049'] : this.state.json['10140CUST-000050']}</NCModal.Title>{/* 国际化处理： 快速分配,快速取消分配*/}
                </NCModal.Header>
                <NCModal.Body>
                    <div><OrgSelect ref={(item) => this.orgSelect = item} {...{json: this.state.json, props: this.props}}/></div>
                </NCModal.Body>
                <NCModal.Footer>
                    <NCButton onClick={this.onsubmit.bind(this)}
                              fieldid={"editBtn"}>{this.props.config.isAssign ? this.state.json['10140CUST-000004Y'] : this.state.json['10140CUST-000004N']}</NCButton>{/* 国际化处理： 确定*/}
                    <NCButton onClick={this.cancel.bind(this)}
                              fieldid={"closeBtn"}>{this.state.json['10140CUST-000005']}</NCButton>{/* 国际化处理： 取消*/}
                </NCModal.Footer>
            </NCModal>
        );
    }
}

export default AssignModal;

//wzXrLLQizH4J3+wYgxi4e9zdXSxIrMJnDUMjbEtqGCsgrslEjS10mvV1qctCDyCJ