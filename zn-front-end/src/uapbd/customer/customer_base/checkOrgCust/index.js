//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import {ajax, base, toast, print, output} from 'nc-lightapp-front';
import {handlePageInfoChange} from './events/index';
import getAssignOrgdata from '../checkAssignOrg/function/getAssignOrgdata';
import Utils from '../../../public/utils/index';

const {queryToastFunc} = Utils;


export default class CheckOrgCust extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectOrg: {
                financeOrg: '',//财务组织
                saleOrg: '',//销售组织
                CreditCtrl: ''//信用控制域
            },
            json: props.json
        }
    }

    componentDidMount() {
        this.props.button.setButtonDisabled(['btnModalPrint', 'modalOutp'], true);
    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.json).length !== 0) {
            this.setState({
                json: nextProps.json
            })
        }
    }

    checkOrgbaseModalBtnClick = (props, id) => {

        let alldata = props.table.getAllTableData(props.config.customer_list_checkbyorg);
        let pageInfo = props.table.getTablePageInfo(props.config.customer_list_checkbyorg);
        let pks = [];
        switch (id) {
            case 'btnModalRefrensh':
                if(!!!props.search.getAllSearchData(this.props.config.searchId_modal_orgdoc)){
                    return ;
                }
                let paramdata = {
                    pageInfo: pageInfo,
                    custcondition: {
                        conditions: [{
                            field: 'NODE_TYPE',
                            value: {
                                firstvalue: props.config.NODE_TYPE
                            },
                            oprtype: ''
                        }, {
                            field: 'areacode',
                            value: {
                                firstvalue: props.config.customer_list_checkbyorg
                            },
                            oprtype: ''
                        }]

                    },
                    queryAreaCode: props.config.searchId_modal_orgdoc,
                    querycondition: props.search.getAllSearchData(this.props.config.searchId_modal_orgdoc),
                    oid: this.props.meta.getMeta()[this.props.config.searchId_modal_orgdoc].oid,
                    querytype: 'tree'
                };
                this.loadGridData(paramdata, () => {
                    toast({
                        color: 'success',
                        title: this.state.json['10140CUST-000066']/* 国际化处理： 刷新成功！*/
                    });
                });
                break;
            case'btnModalPrint':
                if (alldata.rows.length === 0) {
                    toast({'color': 'danger', 'title': this.state.json['10140CUST-000029']});
                    /* 国际化处理： 请查询打印数据！*/
                    return;
                }
                alldata.rows.forEach((item, index) => {
                    pks.push(item.values['pk_customer']['value']);
                });
                print(
                    'pdf',
                    '/nccloud/uapbd/customer/mainPrint.do',
                    {
                        funcode: '10140CUB',      //功能节点编码，即模板编码
                        nodekey: 'baselist',    //模板节点标识
                        oids: pks,
                        appcode: '10140CUB'
                    }
                );
                break;
            case'modalOutp':
                if (alldata.rows.length === 0) {
                    toast({'color': 'danger', 'title': this.state.json['10140CUST-000029']});
                    /* 国际化处理： 请查询打印数据！*/
                    return;
                }
                alldata.rows.forEach((item, index) => {
                    pks.push(item.values['pk_customer']['value']);
                });
                output({
                    url: '/nccloud/uapbd/customer/mainPrint.do',
                    data: {
                        funcode: '10140CUB',  //全局集团组织打印模板相同    //功能节点编码，即模板编码
                        outputType: 'output',
                        nodekey: 'baselist',
                        oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    }
                });
                break;
            default:
                break;
        }
    }
    //查看组织档案模态框查询区点击查询按钮点击事件
    onClickModalSearchBtn = (props, data) => {
        let pageInfo = props.table.getTablePageInfo(props.config.customer_list_checkbyorg);
        if (data === false) {
            //如果查询框没有输入数据
            return;
        }
        let paramdata = {
            pageInfo: pageInfo,
            custcondition: {
                conditions: [{
                    field: 'NODE_TYPE',
                    value: {
                        firstvalue: props.config.NODE_TYPE
                    },
                    oprtype: ''
                }, {
                    field: 'areacode',
                    value: {
                        firstvalue: props.config.customer_list_checkbyorg
                    },
                    oprtype: ''
                }]

            },
            queryAreaCode: props.config.searchId_modal_orgdoc,
            querycondition: data,
            oid: props.meta.getMeta()[props.config.searchId_modal_orgdoc].oid,
            querytype: 'tree'
        };
        this.loadGridData(paramdata, (param) => {
            queryToastFunc.call(this)(param)
        });
    }
    loadGridData = (paramData, callback) => {
        let _this = this;
        let requestParam, requestUrl;
        if (paramData instanceof Array) {
            requestParam = {
                pkcustList: paramData,
                areacode: _this.props.config.customer_list_checkbyorg,
                pagecode: _this.props.config.pagecode
            };
            requestUrl = '/nccloud/uapbd/customer/querycustomerbypage.do';
        } else {
            requestParam = paramData;
            requestUrl = '/nccloud/uapbd/customer/checkOrgBase.do'

        }
        ajax({
            url: requestUrl,
            data: requestParam,
            success: function (res) {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        _this.props.table.setAllTableData(_this.props.config.customer_list_checkbyorg, data[_this.props.config.customer_list_checkbyorg]);
                        callback && callback.call(this, data[_this.props.config.customer_list_checkbyorg]['allpks']);
                        _this.props.button.setButtonDisabled(['btnModalPrint', 'modalOutp'], false);
                    } else {
                        let nulldata = {
                            rows: []
                        }
                        _this.props.table.setAllTableData(_this.props.config.customer_list_checkbyorg, nulldata);
                        callback && callback.call(this, [])
                        _this.props.button.setButtonDisabled(['btnModalPrint', 'modalOutp'], true);
                    }
                    //每次查询都把下面的已分配组织表置空
                    _this.props.table.setAllTableData('assignOrgtable', {rows:[]});
                }
            }
        })
    }
    loadAssignOrgGrid = (props, moduleId, record, index, e) => {
        getAssignOrgdata.call(this, props, 'checkByOrg', record.pk_customer);
    }

    render() {
        let {button, search, table} = this.props;
        const {createButtonApp} = button;
        const {createSimpleTable} = table;
        const {NCCreateSearch} = search;
        return (
            <div className="nc-single-table">
                <div className='nc-singleTable-header-area'>
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area" style={{float: 'right'}}>
                        {createButtonApp({
                            area: 'modal-button-area',
                            onButtonClick: this.checkOrgbaseModalBtnClick,
                            popContainer: document.querySelector('.header-button-area')
                        })}
                    </div>
                </div>
                
                <div className="nc-singleTable-search-area">
                    {NCCreateSearch(this.props.config.searchId_modal_orgdoc, {
                        clickSearchBtn: this.onClickModalSearchBtn,
                        oid: this.props.meta.getMeta()[this.props.config.searchId_modal_orgdoc].oid,
                        showAdvBtn: true,
                    })}
                </div>
                {/* 列表区 */}
                <div className="nc-singleTable-table-area">
                    <div>
                        {createSimpleTable(this.props.config.customer_list_checkbyorg, {
                            onRowClick: this.loadAssignOrgGrid,
                            handlePageInfoChange: handlePageInfoChange.bind(this),
                            showIndex: true
                        })}
                    </div>
                    <div>
                        {createSimpleTable('assignOrgtable', {
                            showIndex: true
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65