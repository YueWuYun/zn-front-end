/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
/**
 * @file 联查预算执行情况
 * @author wangzeqi(wangzqf@yonyou.com)
 */
import React, { Component } from 'react'
import { base, toast, ajax } from 'nc-lightapp-front'
const { NCModal, NCButton, NCTable } = base
import './index.less'
const columns2 = [
    {
        title: this.state.json['36320AA-000035'],/* 国际化处理： 主体*/
        dataIndex: "main",
        key: "main",
    },
    {
        title: this.state.json['36320AA-000036'],/* 国际化处理： 系统*/
        dataIndex: "sys_name",
        key: "sys_name",
    },
    {
        title: this.state.json['36320AA-000037'],/* 国际化处理： 单据类型*/
        dataIndex: "bill_type",
        key: "bill_type"
    },
    {
        title: this.state.json['36320AA-000038'],/* 国际化处理： 基本档案*/
        dataIndex: "basic_file",
        key: "basic_file"
    },
    {
        title: this.state.json['36320AA-000039'],/* 国际化处理： 执行数*/
        dataIndex: "u_data",
        key: "u_data"
    },
    {
        title: this.state.json['36320AA-000040'],/* 国际化处理： 预占数*/
        dataIndex: "pre_data",
        key: "pre_data"
    }
];
export default class Inspection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 步骤
            step: 1,
            // 选中行的值
            selectValue: undefined,
            // 选中行唯一标识 
            selectedRowId: "",
            // 第二个dialog数据
            formData: [],
            iframeShow: false,
            iframeUrl: ''
        };
        // 事件绑定this
        this.nextStep = this.nextStep.bind(this);
        this.affirm = this.affirm.bind(this);
        this.getData = this.getData.bind(this);
        this.cancelDialog = this.cancelDialog.bind(this);
        this.closeIframe = this.closeIframe.bind(this);
    }
    // 设置默认属性
    static defaultProps = {
        id: '',
        // 组件展示状态
        show: false,
        // 组件初始数据源
        sourceData: null,
        // 组件容器class类
        className: '',
        // 取消回调函数
        cancel: () => {
            console.warn(this.state.json['36320AA-000041']);/* 国际化处理： 没有设置取消回调函数*/
        },
        // 确认回调函数
        affirm: () => {
            console.warn(this.state.json['36320AA-000042']);/* 国际化处理： 没有设置确认回调函数*/
        }
    }
    componentDidMount() { }
    componentWillReceiveProps(nextProps) {
        this.setState({
            step: 1,
            selectValue: undefined,
            formData: []
        })
    }
    /**
     * 获取第二个dialog数据
     * @param  {object}  param  [请求数据]
     */
    getData(param) {
        ajax({
            url: '/nccloud/tbb/ctrl/query.do',
            data: param,
            success: (res) => {
                let { success } = res;
                if (success) {
                    if (res.data) {
                        let { data } = res;
                        this.setState({
                            formData: data,
                            step: 2
                        })
                    } else {
                        this.setState({
                            formData: [],
                            step: 2
                        })
                    }
                }
            }
        });
    }
    /**
     * 超链接点击事件
     * @param  {object}  info  [超链接点击传参]
     */
    nextStep(info) {
        let name;
        if (info.target === 'm_readydata') {
            name = 'pfind';
        } else if (info.target === 'm_rundata') {
            name = 'ufind';
        } else {
            console.warn(this.state.json['36320AA-000043'])/* 国际化处理： 点击类型错误*/
        }
        let param = {
            [name]: info.record[name]
        }
        this.getData(param);
    }
    /**
     * 联查确认事件
     */
    affirm() {
        if (this.state.selectValue === undefined) {
            toast({
                'color': 'warning',
                'content': `${this.state.json['36320AA-000044']}`/* 国际化处理： 请选择数据*/
            })
            return;
        } else if (this.state.selectValue.click === false) {
            // toast({
            //     'color': 'warning',
            //     'content': `请选择数据`
            // })
            return;
        } else {
            if (this.state.selectValue.isWindow) {
                //begin tm tangleic 20200308 安全扫描修改 采用平台公共的页面调整打开打开方式
                // window.open(`${this.state.selectValue.url}#pk_ntbparadimvo=${this.state.selectValue.pk_ntbparadimvo}`);      
                let url = this.state.selectValue.url;
                let pk_ntbparadimvo=this.state.selectValue.pk_ntbparadimvo;
                this.props.openTo(url, {
                    pk_ntbparadimvo
                });
                //end tm tangleic
            } else {
                this.setState({
                    iframeShow: true,
                    iframeUrl: `${this.state.selectValue.url}#pk_ntbparadimvo=${this.state.selectValue.pk_ntbparadimvo}`
                })
            }

        }
        // this.props.affirm(this.state.selectValue);
    }
    /**
     * 初始化第二个dialog数据
     * @param  {array}  sourceData  [后端返回表格数据]
     */
    initTemplate(sourceData) {
        let _this = this;
        for (let item of sourceData) {
            if (item.dataIndex === 'm_readydata' || item.dataIndex === 'm_rundata') {
                item.render = (text, record, index) => {
                    return (
                        <span className={'inspection-hyperlinks'} onClick={(() => { _this.nextStep({ target: item.dataIndex, record }) })}>
                            {record[item.dataIndex]}
                        </span>
                    )
                }
            }
        }
    }
    cancelDialog() {
        this.setState({
            formData: [],
            selectValue: undefined,
            step: 1,
            iframeShow: false
        })
    }
    closeIframe(){
        this.setState({
            iframeShow: false
        })
    }
    // 联查执行
    render() {
        // 对初始数据源做兼容处理
        if (this.props.sourceData) {
            var { tableName, tableData } = this.props.sourceData;
            this.initTemplate(tableName);
            var columns = tableName;
            var data = tableData;
        } else {
            var columns = [];
            var data = [];
        }
        let content = (() => {
            if (this.state.step === 1) {
                return (
                    <NCModal
                        id={`${this.props.id}InspectionStep1`}
                        key="inspectionStep1"
                        show={this.props.show}
                        size={'xlg'} onHide={() => { }}
                        className={`inspection ${this.props.className}`}
                    >
                        <NCModal.Header>
                            <NCModal.Title>this.state.json['36320AA-000045']/* 国际化处理： 预算执行情况*/
                                <span onClick={this.props.cancel}>x</span>
                            </NCModal.Title>
                        </NCModal.Header>

                        <NCModal.Body>
                            <NCTable
                                columns={columns}
                                data={data}
                                scroll={{ x: true, y: 500 }}
                            />

                        </NCModal.Body>
                        <NCModal.Footer>
                            <NCButton className="button-undefined u-button-border" onClick={this.props.cancel}>this.state.json['36320AA-000002']</NCButton>/* 国际化处理： 取消*/
                        </NCModal.Footer>
                    </NCModal>
                )
            } else {
                return (
                    <NCModal
                        id={`${this.props.id}InspectionStep2`}
                        key="inspectionStep2"
                        show={this.props.show}
                        size={'xlg'}
                        onHide={() => { }}
                        className={`inspection ${this.props.className}`}
                    >
                        <NCModal.Header>
                            <NCModal.Title>this.state.json['36320AA-000046']/* 国际化处理： 联查执行*/
                                <span onClick={this.cancelDialog}>x</span>
                            </NCModal.Title>
                        </NCModal.Header>

                        <NCModal.Body>
                            <NCTable
                                rowClassName={(record) => {
                                    if (this.state.selectedRowId === record.key) {
                                        return 'inspection-selected';
                                    } else {
                                        return '';
                                    }
                                }}
                                onRowClick={(record) => {
                                    this.setState({
                                        selectValue: record,
                                        selectedRowId: record.key
                                    });
                                }}
                                scroll={{ x: true, y: 500 }}
                                columns={columns2} data={this.state.formData} />
                        </NCModal.Body>

                        <NCModal.Footer>
                            <NCButton className="button-primary" onClick={this.affirm}>this.state.json['36320AA-000047']</NCButton>/* 国际化处理： 联查*/
                            <NCButton className="button-undefined u-button-border" onClick={this.cancelDialog}>this.state.json['36320AA-000002']</NCButton>/* 国际化处理： 取消*/
                        </NCModal.Footer>

                    </NCModal>
                )
            }
        })()
        return (
            <div className={ this.props.show && this.state.iframeShow ? '':'inspection-hide'}>
                {content} 
                <div class="inspection-iframe">
                    <div class="inspection-iframe-header">
                        <span onClick={this.closeIframe}>x</span>
                    </div>
                    <div class="inspection-iframe-body">
                        <iframe src={ this.state.iframeUrl }
                                scrolling="true"
                                height="600"
                                width="100%"
                        />
                    </div>

                </div>
            </div>
        );
    }

}

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/