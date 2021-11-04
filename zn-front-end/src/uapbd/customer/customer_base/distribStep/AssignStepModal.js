//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW
import React, {Component} from 'react';
import {base, ajax, toast} from 'nc-lightapp-front';

let {NCButton, NCModal, NCStep, NCSelect, NCCheckbox} = base;
const NCOption = NCSelect.NCOption;
import OptionSelect from '../../../public/pubComponent/OptionSelect';
import AssignFilter from '../../../public/pubComponent/AssignFilter';
import OrgSelect from '../../../public/pubComponent/OrgSelect';
import ResultGrid from '../../../public/pubComponent/ResultGrid';
import './index.less';


class AssignStepModal extends Component {
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
                stepCount: 4
            },
            custAssignStatus: 'ALL',
            show: false,
            showResultGrid: false,
            pk_customer: '',
            json: props.json
        }
        this.config = props.config;
        this.config.isAssign = true;
    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.json).length !== 0) {
            this.setState({
                json: nextProps.json
            })
        }
    }

    loadMainGridData = () => {
        this.props.config.pageFlag === 'list' && this.props.loadGridData(this.props.getRequestParam(this.props));
        this.props.config.pageFlag === 'card' && this.props.loadCardData(this.state.pk_customer[0]);
    }
    onsubmit = (contiFlag) => {
        let {current} = this.state.step;
        let {custassign, searchId_modal, NODE_TYPE, appcode} = this.config;
        let checkRows = this.props.table.getCheckedRows(custassign);
        let assignFlag = this.config.isAssign;
        let targetOrgIds = [];
        let CustPks;
        let searchVal = this.props.search.getAllSearchData(searchId_modal);
        let pageInfo = this.props.table.getTablePageInfo(custassign);
        // let orgDatas = this.orgSelect.state.selectData.datas;
        this.orgSelect.state.selectData.datas.map((obj) => {
            if (obj.orgclazz !== 'orgtype') {
                targetOrgIds.push(obj['id']);
            }
        });
        // if (orgDatas.length === 0) {
        //     toast({color: 'warning', title: this.state.json['10140CUST-000048']});/* 国际化处理： 请选择目标组织！*/
        //     return;
        // }
        if (!searchVal) {
            return;
        }
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
            queryAreaCode: searchId_modal,
            querycondition: searchVal,
            oid: this.props.meta.getMeta()[this.config.searchId_modal].oid,
            querytype: 'tree',
            appcode: appcode,
            userdefObj: {
                targets: targetOrgIds.join(),
                assignStatus: this.state.custAssignStatus
            }

        }
        if (current == 3) {
            CustPks = this.resultGrid.state.selectedPKs;
            if (CustPks.length === 0) {
                toast({
                    'color': 'info',
                    'title': assignFlag ? this.state.json['10140CUST-000051'] : this.state.json['10140CUST-000052']
                });
                /* 国际化处理： 请选择要分配的客户！,请选择要取消分配的客户！*/
                return;
            }
        }
        ajax({
            url: '/nccloud/uapbd/customer/custAssign.do',
            data: {
                pkcustList: CustPks,
                targetOrgIds: targetOrgIds,
                isAssign: assignFlag,
                appcode: appcode,
                qryparam: current == 2 ? qryparam : null
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data && data.hasOwnProperty('message') && data.message) {
                        if (data.hasOwnProperty('mesType') && data.mesType == '1') {
                            toast({'color': 'success', 'title': data.message});
                            if (!contiFlag) {
                                this.loadMainGridData();
                                this.finishAndContinue(contiFlag);
                            } else {
                                this.finishAndContinue(contiFlag);
                            }
                        } else {
                            toast({'color': 'info', 'title': data.message});
                        }

                    }
                }
            }
        });
    }
    finishAndContinue = (flag) => {
        this.config.isAssign = true;
        this.state.showResultGrid = false;
        this.state.show = flag;
        this.state.step.current = 0;
        this.setState(
            this.state);
    }
    continue = () => {
        this.config.isAssign = true;
        this.state.show = true;
        this.state.step.current = 0;
        this.setState(
            this.state);
    }
    oncheckAssignOrCancel = (flag) => {
        this.config.isAssign = flag === 'assign' ? true : false;
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
            requestUrl = '/nccloud/uapbd/customer/custAssignResult.do';
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
                        }
                        callback.call(this);
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
        let {isAssign, searchId_modal, custassign, NODE_TYPE} = this.config;
        let {current, stepCount} = this.state.step;
        let modalTitle = this.state.myModal.modalTitle;
        let orgDatas = this.orgSelect.state.selectData.datas;
        let targetOrgIds = [];
        if (dir < 0 && current > 0) { //prev step
            current -= 1;
        }
        if (dir > 0 && current <= stepCount - 1) { // next
            current += 1;
        }
        if (current === 1) {
            modalTitle = isAssign ? this.state.json['10140CUST-000053'] : this.state.json['10140CUST-000054'];
            /* 国际化处理： 选择分配目标组织,选择取消分配目标组织*/
            //点下一步到2的时候查询分配组织，如果是往前点 3->2 就不查询了 减少查询次数
            dir > 0 && this.orgSelect.reset();
        } else if (current === 2) {

            if (orgDatas.length === 0) {
                toast({color: 'warning', title: this.state.json['10140CUST-000048']});
                /* 国际化处理： 请选择目标组织！*/
                return;
            }
            modalTitle = this.state.json['10140CUST-000055'];
            /* 国际化处理： 过滤条件*/

        } else if (current === 3) {
            modalTitle = this.state.json['10140CUST-000056'];
            /* 国际化处理： 数据选择*/
            let searchVal = this.props.search.getAllSearchData(searchId_modal);
            let pageInfo = this.props.table.getTablePageInfo(custassign);

            if (!searchVal) {
                return;
            }
            orgDatas.map((obj) => {
                if (obj.orgclazz !== 'orgtype') {
                    targetOrgIds.push(obj['id']);
                }
            });
            let qryparam = {
                pageInfo: pageInfo,
                appcode: this.config.appcode,
                custcondition: {
                    conditions: [{
                        field: 'NODE_TYPE',
                        value: {
                            firstvalue: NODE_TYPE
                        },
                        oprtyp: ''
                    }]
                },
                queryAreaCode: searchId_modal,
                querycondition: searchVal,
                oid: this.props.meta.getMeta()[this.config.searchId_modal].oid,
                querytype: 'tree',
                userdefObj: {
                    targets: targetOrgIds.join(),
                    assignStatus: this.state.custAssignStatus
                }
            }
            this.state.showResultGrid = true;
            this.setState(this.state, () => {
                this.loadResutlGridData(qryparam, () => {

                });
            });

        } else {
            modalTitle = this.state.json['10140CUST-000006'];
            /* 国际化处理： 选择操作*/
        }
        this.state.step.current = current;
        this.state.myModal.modalTitle = modalTitle;
        this.setState(this.state);
    };
    show = (pk_customer) => {
        this.state.pk_customer = pk_customer;
        this.state.show = true;
        this.setState(this.state);
    }
    handleAssignStatus = (value) => {
        console.log(value);
        this.state.custAssignStatus = value;
        this.setState(this.state);
    }
    showResultGrid = (value) => {
        this.setState({
            showResultGrid: value
        });

    }

    render() {
        const config = this.state.myModal;
        return (
            <NCModal {...config} show={this.state.show} onHide={this.finishAndContinue.bind(this, false)}
                     fieldid={"customerastepssign"}>
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{this.state.myModal.modalTitle}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <NCStep.NCSteps {...this.state.step}>
                        <NCStep title={this.state.json['10140CUST-000011']}
                                description={this.state.json['10140CUST-000057']}/>{/* 国际化处理： 步骤1,选择分配或者取消分配操作*/}
                        <NCStep title={this.state.json['10140CUST-000012']}
                                description={this.state.json['10140CUST-000058']}/>{/* 国际化处理： 步骤2,选择目标组织*/}
                        <NCStep title={this.state.json['10140CUST-000013']}
                                description={this.state.json['10140CUST-000059']}/>{/* 国际化处理： 步骤3,输入过滤条件*/}
                        <NCStep title={this.state.json['10140CUST-000060']}
                                description={this.state.json['10140CUST-000061']}/>{/* 国际化处理： 步骤4,选择分配或者取消分配的数据*/}
                    </NCStep.NCSteps>
                    <div style={{height: '450px', display: this.state.step.current == 0 ? '' : 'none'}}><OptionSelect
                        oncheckAssignOrCancel={this.oncheckAssignOrCancel.bind(this)}
                        {...{json: this.state.json}}
                    /></div>
                    <div style={{height: '450px', display: this.state.step.current == 1 ? '' : 'none'}}><OrgSelect
                        ref={(item) => this.orgSelect = item}
                        {...{json: this.state.json, props: this.props}}
                    /></div>
                    <div style={{height: '450px', display: this.state.step.current == 2 ? '' : 'none'}}><AssignFilter
                        ref={(item) => this.assignFilter = item}{...{
                        pageprops: this.props,
                        modalSerchId: this.props.config.searchId_modal,
                        json: this.state.json
                    }}/></div>
                    <div style={{height: '450px', display: this.state.step.current == 3 ? '' : 'none'}}><ResultGrid
                        ref={(item) => this.resultGrid = item}{...{
                        pageprops: this.props,
                        gridId: this.config.custassign,
                        simpleOrEdit: 'simple',
                        loadResutlGridData: this.loadResutlGridData,
                        json: this.state.json
                    }}/></div>

                </NCModal.Body>
                <NCModal.Footer>
                    <div className="assignStepModal-NCSelect" style={{
                        display: this.state.step.current == this.state.step.stepCount - 2 ? '' : 'none',
                        float: 'left'
                    }}>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <h4 style={{
                                paddingTop: 8,
                                paddingRight: 8
                            }}>{this.state.json['10140CUST-000062']}</h4> {/*/* 国际化处理： 分配状态*/}
                            <NCSelect defaultValue="" style={{width: 200, marginRight: 6}}
                                      onChange={this.handleAssignStatus.bind(this)}
                                      fieldid={"assignState"}>
                                <NCOption value="All"></NCOption>
                                <NCOption
                                    value="ASSIGNED">{this.state.json['10140CUST-000063']}</NCOption>{/* 国际化处理： 已分配*/}
                                <NCOption
                                    value="UNASSIGNED">{this.state.json['10140CUST-000064']}</NCOption>{/* 国际化处理： 未分配*/}
                            </NCSelect>
                            <div style={{paddingLeft: 15}} className="assignStepModal-NCCheckbox">
                                <NCCheckbox colors="info" onChange={this.showResultGrid.bind(this)}
                                            checked={this.state.showResultGrid}>{this.state.json['10140CUST-000014']}</NCCheckbox>{/* 国际化处理： 是否显示查询结果*/}
                            </div>
                        </div>
                    </div>
                    <span style={{display: this.state.step.current == 0 ? 'none' : ''}}><NCButton
                        onClick={this.onStep.bind(this, -1)} fieldid={"btn1st"}>{this.state.json['10140CUST-000015']}</NCButton></span>{/* 国际化处理： 上一步*/}
                    <span
                        style={{display: (this.state.step.current == 2 && !this.state.showResultGrid) || this.state.step.current == 3 ? '' : 'none'}}><NCButton
                        onClick={this.onsubmit.bind(this, false)} fieldid={"btn2nd"}>{this.state.json['10140CUST-000016']}</NCButton></span>{/* 国际化处理： 完成*/}
                    <span
                        style={{display: (this.state.step.current == 2 && !this.state.showResultGrid) || this.state.step.current == 3 ? '' : 'none'}}><NCButton
                        onClick={this.onsubmit.bind(this, true)} fieldid={"btn3rd"}>{this.state.json['10140CUST-000017']}</NCButton></span>{/* 国际化处理： 完成并继续*/}
                    <span
                        style={{display: (this.state.step.current == 2 && !this.state.showResultGrid) || this.state.step.current == 3 ? 'none' : ''}}><NCButton
                        onClick={this.onStep.bind(this, 1)} fieldid={"btn4th"}>{this.state.json['10140CUST-000018']}</NCButton></span>{/* 国际化处理： 下一步*/}
                    <NCButton
                        onClick={this.finishAndContinue.bind(this, false)} fieldid={"btn5th"}>{this.state.json['10140CUST-000005']}</NCButton>{/* 国际化处理： 取消*/}
                </NCModal.Footer>
            </NCModal>
        );
    }
}

export default AssignStepModal;

//FsQ8hq0RssViIid5Y1QU5DF+uTniJu1yfHOVIfuvbnvScQtTBVYLeDUSc3ZODByW