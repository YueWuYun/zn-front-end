//bC6PlMPj1z4dd3YE5o/v0mS6cvOQ9zKoeBGG5fJ/Q42WaPxQavvB60qpGPLEvs5J
import React, {Component} from 'react';
import {base, ajax, toast} from 'nc-lightapp-front';

let {NCButton, NCModal, NCStep, NCCheckbox} = base;
import AssignFilter from '../../../public/pubComponent/AssignFilter';
import ResultGrid from '../../../public/pubComponent/ResultGrid';
import AttrSelect from '../../../public/pubComponent/AttrSelect';
import './BatchEditStepModal.less'

/**
 *
 */
class BatchEditStepModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myModal: {
                modalDropup: true,
                size: 'xlg',
                backdrop: true / false,//是否弹出遮罩层/点击遮罩层是否触发关闭事件
                modalTitle: this.props.json['10140CUST-000006']/* 国际化处理： 选择操作*/
            },
            step: {
                current: 0,
                stepCount: 3
            },
            show: false,
            showResultGrid: false,
            pk_customer: '',
            json: props.json,
            x: '',
            tabs: []
        }
        this.config = props.config;
    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.json).length !== 0) {
            this.setState({
                json: nextProps.json
            });
        }
    }

    onsubmit = (contiFlag) => {
        let {current} = this.state.step;
        let {selectedAttrs, attr_valueMap} = this.attrselect.state;
        let {selectedPKs} = this.resultgrid.state;
        let {custassign, searchId_modal_batchEdit, NODE_TYPE, appcode} = this.props.config;
        let targetOrgIds = [];
        let searchVal = this.props.search.getAllSearchData(searchId_modal_batchEdit);
        let pageInfo = this.props.table.getTablePageInfo(custassign);
        if (!searchVal) {
            return;
        }
        this.attrselect.orgSelect.state.selectData.datas.map((item) => {
            targetOrgIds.push(item['id']);
        });
        let qryparam = {
            pageInfo: pageInfo,
            custcondition: {
                conditions: [{
                    field: 'NODE_TYPE',
                    value: {
                        firstvalue: NODE_TYPE
                    },
                    oprtyp: ''
                }]

            },
            queryAreaCode: searchId_modal_batchEdit,
            querycondition: searchVal,
            oid: this.props.meta.getMeta()[this.props.config.searchId_modal_batchEdit].oid,
            querytype: 'tree',
            appcode: appcode,
            userdefObj: {
                areacode: custassign,
                targetOrgIds: targetOrgIds.join(',')
            }
        }

        if (current == 2) {
            if (selectedPKs.length == 0) {
                toast({color: 'warning', title: this.state.json['10140CUST-000007']});
                /* 国际化处理： 请选择要批改属性的客户!*/
                return;
            }
        }
        ajax({
            url: '/nccloud/uapbd/customer/batchEditCust.do',
            data: {
                selectedAttrs: selectedAttrs,
                attr_valueMap: attr_valueMap,
                selectedOrgs: targetOrgIds,
                selectedPKs: selectedPKs,
                appcode: appcode,
                currentTab: this.attrselect.state.tabVal.refcode,
                qtfv: current === 1 ? qryparam : null
            },
            success:
                (res) => {
                    let {success, data} = res;
                    let {errorLogResult} = data;
                    let {errorMessagegNum, errorLog,errorMsgs} = errorLogResult;
                    if (success) {
                        if (errorMessagegNum != '0') {
                            let errmsgs ='';
                            errorMsgs.forEach(item=>{
                                errmsgs += `${item.errormsg}\n `;
                            });
                            toast({color: 'danger', title: errmsgs});
                        } else {
                            toast({color: 'success', title: this.state.json['10140CUST-000002']});
                            /* 国际化处理： 批改成功！*/
                            if (!contiFlag) {
                                this.loadGridData();
                                this.finishAndContinue(contiFlag);
                            } else {
                                this.finishAndContinue(contiFlag);
                            }

                        }
                    }

                }
        })
        ;
    }

    loadGridData = () => {
        this.props.config.pageFlag === 'list' && this.props.loadGridData(this.props.getRequestParam(this.props));
        this.props.config.pageFlag === 'card' && this.props.loadCardData(this.state.pk_customer[0]);
    }
    finishAndContinue = (flag) => {
        this.state.showResultGrid = false;
        this.state.show = flag;
        this.state.step.current = 0;
        this.attrselect.state.selectedAttrs = [];
        this.attrselect.state.attr_valueMap = [];
        this.attrselect.state.propVal = [];
        this.resultgrid.selectedPKs = [];
        this.attrselect.orgSelect.state.selectData.data = [];
        this.setState(this.state, () => {
            this.attrselect.resetFormItem();
        });
    }
    loadResutlGridData = (qryparam, callback) => {
        let {custassign, appcode, pagecode} = this.props.config;
        let requestUrl, requestParam;
        if (qryparam instanceof Array) {
            requestUrl = '/nccloud/uapbd/customer/querycustomerbypage.do';
            requestParam = {
                pkcustList: qryparam,
                appcode: appcode,
                areacode: custassign,
                pagecode: pagecode
            }
        } else {
            requestUrl = '/nccloud/uapbd/customer/querycustomer.do';
            requestParam = qryparam;
        }
        ajax({
            url: requestUrl,
            data: requestParam,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        if (data.hasOwnProperty(custassign)) {
                            this.props.table.setAllTableData(custassign, data[custassign]);
                            callback.call(this);
                        }
                    } else {
                        this.props.table.setAllTableData(custassign, {
                            rows: []
                        });
                    }
                }
            }
        });

    }
    onStep = (dir) => {
        let {custassign} = this.props.config;
        let current = this.state.step.current;
        let stepCount = this.state.step.stepCount;
        let modalTitle = this.state.myModal.modalTitle;
        if (dir < 0 && current > 0) { //prev step
            current -= 1;
        }
        if (dir > 0 && current <= stepCount - 1) { // next
            current += 1;
        }
        if (current === 1) {
            modalTitle = this.state.json['10140CUST-000008'];
            /* 国际化处理： 设置过滤条件*/
            //校验是否选择批改属性
            if (this.attrselect.state.selectedAttrs.length === 0) {
                toast({color: 'warning', title: this.state.json['10140CUST-000000']});
                /* 国际化处理： 请选择批改属性！*/
                return;
            }
            //业务单元节点 基本信息批改校验是否选择组织
            if (this.props.config.NODE_TYPE === 'ORG_NODE' &&
                this.attrselect.orgSelect.state.selectData.datas.length === 0) {
                toast({color: 'warning', title: this.state.json['10140CUST-000001']});
                /* 国际化处理： 请选择组织批改！*/
                return;
            }
            //非业务单元节点 基本信息批改不需要选择组织
            if (this.props.config.NODE_TYPE !== 'ORG_NODE' && this.attrselect.state.tabVal.refcode !== 'baseinfo' &&
                this.attrselect.orgSelect.state.selectData.datas.length === 0) {
                toast({color: 'warning', title: this.state.json['10140CUST-000001']});
                /* 国际化处理： 请选择组织批改！*/
                return;
            }
            //校验表单必输
            if (!this.props.form.isCheckNow(this.attrselect.state.batchFormId)) {
                return;
            }
        } else if (current === 2) {
            modalTitle = this.state.json['10140CUST-000009'];
            /* 国际化处理： 选择批改数据*/
            let searchVal = this.props.search.getAllSearchData(this.props.config.searchId_modal_batchEdit);
            let pageInfo = this.props.table.getTablePageInfo(this.props.config.custassign);
            if (!searchVal) {
                return;
            }
            let targetOrgIds = [];
            this.attrselect.orgSelect.state.selectData.datas.map((item) => {
                targetOrgIds.push(item['id']);
            });
            let qryparam = {
                pageInfo: pageInfo,
                appcode: this.config.appcode,
                custcondition: {
                    conditions: [{
                        field: 'NODE_TYPE',
                        value: {
                            firstvalue: this.config.NODE_TYPE
                        },
                        oprtyp: ''
                    }]

                },
                queryAreaCode: this.config.searchId_modal_batchEdit,
                querycondition: searchVal,
                oid: this.props.meta.getMeta()[this.props.config.searchId_modal_batchEdit].oid,
                querytype: 'tree',
                userdefObj: {
                    areacode: custassign,
                    targetOrgIds: targetOrgIds.join(',')
                }
            }
            this.state.showResultGrid = true;
            this.setState(this.state, () => {
                this.loadResutlGridData(qryparam, () => {

                });
            });

        } else {
            modalTitle = this.state.json['10140CUST-000010'];
            /* 国际化处理： 选择批改属性并设置值*/

        }
        this.state.step.current = current;
        this.state.myModal.modalTitle = modalTitle;
        this.setState(this.state);
    };
    show = (pk_customer) => {
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
                        this.state.tabs = data.rows;
                        this.state.pk_customer = pk_customer;
                        this.state.show = true;
                        this.setState(this.state);
                    }
                }
            }
        });
    }
    showResultGrid = (value) => {
        this.setState({showResultGrid: value});
    }

    render() {
        const config = this.state.myModal;
        return (
            <NCModal {...config} show={this.state.show} onHide={this.finishAndContinue.bind(this, false)}
                     fieldid={"customerstep"}>
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{this.state.myModal.modalTitle}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <NCStep.NCSteps {...this.state.step} style={{marginBottom: '10px'}}>
                        <NCStep title={this.state.json['10140CUST-000011']}
                                description={this.state.json['10140CUST-000010']}/>
                        <NCStep title={this.state.json['10140CUST-000012']}
                                description={this.state.json['10140CUST-000008']}/>
                        <NCStep title={this.state.json['10140CUST-000013']}
                                description={this.state.json['10140CUST-000009']}/>
                    </NCStep.NCSteps>
                    <div style={{height: '450px', display: this.state.step.current == 0 ? '' : 'none'}}>
                        <AttrSelect
                            ref={(item => this.attrselect = item)} {...this.props} {...{
                            oprFlag: 'stepEdit',
                            tabs: this.state.tabs,
                            json: this.state.json
                        }}/>
                    </div>
                    <div className='nc-singleTable-search-area-assign-self-style'
                         style={{height: '450px', display: this.state.step.current == 1 ? '' : 'none'}}>
                        <AssignFilter
                            ref={(item => this.assigfilter = item)} {...{
                            pageprops: this.props,
                            modalSerchId: this.props.config.searchId_modal_batchEdit,
                            json: this.state.json
                        }}/>
                    </div>
                    <div style={{height: '450px', display: this.state.step.current == 2 ? '' : 'none'}}>
                        <ResultGrid
                            ref={(item => this.resultgrid = item)} {...{
                            pageprops: this.props,
                            gridId: this.config.custassign,
                            simpleOrEdit: 'simple',
                            loadResutlGridData: this.loadResutlGridData,
                            json: this.state.json
                        }}/>
                    </div>
                </NCModal.Body>
                <NCModal.Footer>
                    <div style={{
                        display: this.state.step.current == this.state.step.stepCount - 2 ? '' : 'none',
                        float: 'left'
                    }}>
                        <NCCheckbox colors="info" onChange={this.showResultGrid.bind(this)}
                                    checked={this.state.showResultGrid}>{this.state.json['10140CUST-000014']}</NCCheckbox>{/* 国际化处理： 是否显示查询结果*/}
                    </div>
                    <span style={{display: this.state.step.current == 0 ? 'none' : ''}}><NCButton
                        onClick={this.onStep.bind(this, -1)}
                        fieldid={"btnOne"}>{this.state.json['10140CUST-000015']}</NCButton></span>{/* 国际化处理： 上一步*/}
                    <span
                        style={{display: (this.state.step.current == 1 && !this.state.showResultGrid) || this.state.step.current === 2 ? '' : 'none'}}><NCButton
                        onClick={this.onsubmit.bind(this, false)}
                        fieldid={"btnTwo"}>{this.state.json['10140CUST-000016']}</NCButton></span>{/* 国际化处理： 完成*/}
                    <span
                        style={{display: (this.state.step.current == 1 && !this.state.showResultGrid) || this.state.step.current === 2 ? '' : 'none'}}><NCButton
                        onClick={this.onsubmit.bind(this, true)}
                        fieldid={"btn3rd"}>{this.state.json['10140CUST-000017']}</NCButton></span>{/* 国际化处理： 完成并继续*/}
                    <span
                        style={{display: (this.state.step.current == 1 && !this.state.showResultGrid) || this.state.step.current === 2 ? 'none' : ''}}><NCButton
                        onClick={this.onStep.bind(this, 1)}
                        fieldid={"btn4th"}>{this.state.json['10140CUST-000018']}</NCButton></span>{/* 国际化处理： 下一步*/}
                    <NCButton
                        onClick={this.finishAndContinue.bind(this, false)}
                        fieldid={"btn5th"}>{this.state.json['10140CUST-000005']}</NCButton>{/* 国际化处理： 取消*/}
                </NCModal.Footer>
            </NCModal>
        );
    }
}

export default BatchEditStepModal;

//bC6PlMPj1z4dd3YE5o/v0mS6cvOQ9zKoeBGG5fJ/Q42WaPxQavvB60qpGPLEvs5J