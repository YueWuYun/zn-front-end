//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
﻿import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast,high } from 'nc-lightapp-front';
let { NCButton } = base;
import Utils from '../../../../uap/public/utils'
import initTemplate from '../dataAuthority/list/events/initTemplate'
import OrgAndOrgTypeCompositeOnlyEnableDataNCTreeRef from '../../../refer/org/OrgAndOrgTypeCompositeOnlyEnableDataNCTreeRef'
const { Refer } = high;
const ReferLoader = Refer.ReferLoader
class UapbdDiscretDataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ref: {
                refpk:'',
                refname:'',
                refpk2:''
            },
            json:{},
            inlt:null,
            refpath:''
        }
    }
    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
            } else {
                console.log('未加载到多语资源');   // 未请求到多语资源的后续操作/* 国际化处理： 未加载到多语资源*/
            }
        }
        this.props.MultiInit.getMultiLang({ 'moduleId': 'dataPermission', 'domainName': 'uapbd', callback });
    }
    componentDidMount() {
        this.begTableData();
    }

    begTableData() {
        const { paramObj } = this.props;
        const  value  = this.props.value.val
        let param = {
            mdid: paramObj.mdid,
            pk_org: this.state.ref.refpk ? this.state.ref.refpk : ''
        }
        const that = this;
        ajax({
            loading: true,
            url: "/nccloud/uapbd/rbac/UapbdDiscretDataTablePermAction.do",
            data: param,
            success: function (res) {
                if (res.success) {
                    if (!res.data) {
                        that.props.editTable.setTableData('discret_table_type', { rows: [] });
                    } else {
                        //若refpk为空，说明是第一次打开，需要设置默认值
                        if (that.state.ref.refpk=='') {
                            that.setState({
                                ref: { refname: res.data.templetid, refpk: res.data.userjson,refpk2: res.data.userjson  },                               
                            })

                        }
                        that.setState({
                            refpath:res.data.pageid
                        })
                        that.props.editTable.setTableData('discret_table_type', res.data.tableRes);
                        if (value && value.querycondition && value.querycondition.extraParaVO && !Utils.isEmptyArr(value.querycondition.extraParaVO.selectedIndexRow)) {
                            let selectedIndexRow = value.querycondition.extraParaVO.selectedIndexRow;
                            that.waitTableData(selectedIndexRow);
                        }
                    }


                } else {
                    toast({ color: 'danger', content: res.message })
                }
            }
        });
    }

    waitTableData(selectedIndexRow) {
        let timer = null;
        let tableData = this.props.editTable.getAllData('discret_table_type');
        if (!Utils.isEmptyArr(tableData.rows)) {
            this.props.editTable.selectTableRows('discret_table_type', selectedIndexRow, true);
            clearInterval(timer);
            return;
        }
        timer = setInterval(() => {
            if (!Utils.isEmptyArr(tableData.rows)) {
                this.props.editTable.selectTableRows('discret_table_type', selectedIndexRow, true);
                console.log(555)
                clearInterval(timer);
                return;
            } else {
                this.waitTableData(selectedIndexRow);
            }
        }, 100)
    }

    ensureInfo() {//确定选中的table表格
        let selectedRowArr = this.props.editTable.getCheckedRows('discret_table_type');
        const ruleTableData = this.convertData(selectedRowArr);
        this.props.onEnsureInfoSave(ruleTableData);
    }

    convertData(selectedRowArr) {
        console.log('selectedRowArr', selectedRowArr)
        //组装json
        let rulejson = {
            "querytype": "tree",
            "querycondition": {
                "logic": "and",
                "conditions": [

                ],
                "extraParaVO": {
                    selectedIndexRow: []
                }
            }
        }
        let rule_dispaly = this.state.json['dataperm-000001']/* 国际化处理： 条件规则:*/
        let conditions = rulejson.querycondition.conditions;
        let selectedIndexRow = rulejson.querycondition.extraParaVO.selectedIndexRow;
        var reg4num = /[0-9]/;
        for (var index in selectedRowArr) {
            if (reg4num.test(index)) {
                let conditions_raw = {
                    "field": "",
                    "oprtype": "=",
                    "display": "",
                    "value": {
                        "firstvalue": "",
                        "secondvalue": ""
                    },
                    "extraParaVO": {
                        refcode: ''
                    }
                }
                selectedIndexRow.push(selectedRowArr[index].index);
                rule_dispaly = rule_dispaly + '【' + selectedRowArr[index].data.values.code.value + ' ' + selectedRowArr[index].data.values.name.value + '】,'
                var conditions_new = Object.assign({}, conditions_raw)
                let pk = selectedRowArr[index].data.values.pk.value;
                conditions_raw.field = selectedRowArr[index].data.values.field;
                conditions_raw.display = selectedRowArr[index].data.values.name.value;
                conditions_raw.value.firstvalue = selectedRowArr[index].data.values.pk.value;
                conditions_raw.extraParaVO.refcode = selectedRowArr[index].data.values.name.value;
                conditions.unshift(conditions_raw);
            }
        }
        //赋值给json
        let info = {
            value: rulejson,
            display: rule_dispaly,
        }
        return info;
    }

    cancelInfo(e) {//取消选中的table表格
        this.props.editTable.selectAllRows('discret_table_type');
        this.props.onCancelInfoSave(e);
    }
    createRefer=()=>{
        if(this.state.refpath!==''){
            return (<ReferLoader refcode={this.state.refpath} onChange={this.onOrgChange.bind(this)} value={this.state.ref}/>)
        }

    }
    //业务单元变更事件
    onOrgChange(value) {

        this.setState({
            ref: value
        }, () => {
            this.begTableData();

        });

    }
    render() {
        
        const { createEditTable } = this.props.editTable;
        return (
            <Fragment>
                <div className='orgChange-box' style={{ marginBottom: '5px', width: '220px' }}>
                 {this.createRefer()}
                </div>
                {createEditTable('discret_table_type', {
                    showCheck: true,
                    height: 420,
                    // selectedChange: selectedChangeFn,                // 选择框有变动的钩子函数
                    // params: 'test',                                  // 自定义传参
                })}
                <footer style={{ textAlign: 'right', paddingBottom: '6px' }}>
                    <NCButton colors="primary" onClick={this.ensureInfo.bind(this)}>{this.state.json['dataperm-000002']}</NCButton>{/* 国际化处理： 确定*/}
                    <NCButton colors="primary" onClick={this.cancelInfo.bind(this)}>{this.state.json['dataperm-000003']}</NCButton>{/* 国际化处理： 取消*/}
                </footer>
            </Fragment>
        )
    }
}

UapbdDiscretDataTable = createPage({
    initTemplate: initTemplate,
})(UapbdDiscretDataTable);

module.exports = UapbdDiscretDataTable;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65