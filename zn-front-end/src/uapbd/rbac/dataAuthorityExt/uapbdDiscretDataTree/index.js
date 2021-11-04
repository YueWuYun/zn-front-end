//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high } from 'nc-lightapp-front';
import Utils from '../../../../uap/public/utils'
import { isEmptyArr } from '../../../../uap/public/utils/emptyUtil';
import AccountBookTreeRef from '../../../refer/org/AccountBookTreeRef'
const { NCButton, NCTree, NCRadio, NCRow, NCCol } = base;
const { NCTreeNode } = NCTree;
const { NCRadioGroup } = NCRadio;
const { Refer } = high;
const ReferLoader = Refer.ReferLoader
class UapbdDiscretDataTree extends Component {
    constructor(props) {
        super(props);
        const selectedkeys = this.props.value.val.querycondition ? this.props.value.val.querycondition.selectedKeys : [];
        this.state = {
            treeData: [],
            selectedRadioValue: 'includeChild',
            frontSelectedKeys: selectedkeys,
            ref: {
                refpk: '',
                refname: '',
                refpk2: ''
            },
            rulejson: {
                querytype: "tree",
                querycondition: {
                    logic: "and",
                    conditions: [],
                    selectedKeys: []
                }
            },
            refpath: '',
            json: {},
            inlt: null

        }
    }
    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
            } else {
                console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
            }
        }
        this.props.MultiInit.getMultiLang({ 'moduleId': 'dataPermission', 'domainName': 'uapbd', callback });
    }
    componentDidMount() {
        this.begTreeData();
    }

    begTreeData() {//ajax请求树信息
        const { paramObj, value } = this.props;
        const refPk = this.state.ref.refpk;
        const that = this;
        ajax({
            loading: true,
            url: "/nccloud/uapbd/rbac/UapbdDiscretDataTreePermAction.do",
            data: { ...paramObj, pk_org: refPk },
            // pk_group
            success: function (res) {
                console.log('res', res);
                if (res.success) {
                    if (!res.data) {
                        that.setState({ treeData: [] });
                    } else {
                        //若refpk为空，说明是第一次打开，需要设置默认值
                        if (that.state.ref.refpk == '') {
                            that.setState({
                                ref: { refname: res.data.orgName, refpk: res.data.pk_org, refpk2: res.data.pk_org },
                            })

                        }
                        that.setState({ treeData: res.data.rows, refpath: res.data.refpath });
                    }
                    if (value.val && value.val.querycondition && value.val.querycondition.selectedKeys && !isEmptyArr(value.val.querycondition.selectedKeys)) {
                        const selectedKeys = value.val.querycondition.selectedKeys;
                        that.echoTreeData(selectedKeys);
                    }
                } else {
                    toast({ color: 'danger', content: res.message })
                }
            }
        });
    }

    echoTreeData(selectedKeys) {
        this.setState({
            frontSelectedKeys: selectedKeys
        })
    }

    checkTreeNode(selectedKeys) {//节点选中
        this.setState({
            frontSelectedKeys: selectedKeys.checked || selectedKeys
        })
    }

    ensureInfo() {
        let selectedKeys = [...this.state.frontSelectedKeys];
        const treeData = [...this.state.treeData];
        let selectedConditions = this.state.rulejson.querycondition.conditions;
        const loop = (data, keys, callback) => {
            data && data.map((item, index, arr) => {
                if (keys.includes(item.refpk)) {
                    const keyIndex = Utils.indexof(keys, item.refpk);
                    keys.splice(keyIndex, 1);
                    return callback(item, index, arr, keys, callback)
                }
                if (item.children && item.children.length) {
                    return loop(item.children, keys, callback)
                }
            })
        }
        loop(treeData, selectedKeys, (item, index, arr, keys, callback) => {
            selectedConditions.push({
                extraParaVO: {
                    refcode: item.refcode,
                    refname: item.refname,
                    refpk: item.refpk
                }
            })
            if (item.children && item.children.length) {
                return loop(item.children, keys, callback)
            }
        })
        this.state.rulejson.querycondition.selectedKeys = [...this.state.frontSelectedKeys];
        let finalTreeData = this.convertData();
        console.log('finalTreeData', JSON.stringify(finalTreeData));
        this.props.onEnsureInfoSave(finalTreeData);
    }

    convertData() {//转化treeData为特定对象
        const ruleDispaly = this.state.json['dataperm-000004'];/* 国际化处理： 条件规则:该规则为离散型规则,请编辑规则查看具体内容*/
        let info = {
            value: this.state.rulejson,
            display: ruleDispaly,
        }
        return info;
    }

    cancelInfo(e) {
        this.props.onCancelInfoSave(e);
    }

    handleChooseType(value) {//选中树节点是否包含子节点方式修改
        this.setState({
            selectedRadioValue: value
        })
    }
    createRefer = () => {
        if (this.state.refpath !== '') {
            return (<ReferLoader refcode={this.state.refpath} onChange={this.onOrgChange.bind(this)} value={this.state.ref} />)
        }

    }
    //业务单元变更事件
    onOrgChange(value) {

        this.setState({
            ref: value
        },()=>{
            this.begTreeData();
        });

    }
    render() {
        const loop = data => data.map((item) => {
            if (item.children && item.children.length) {
                return <NCTreeNode key={item.refpk} title={item.refcode + ' ' + item.refname}>{loop(item.children)}</NCTreeNode>;
            }
            return <NCTreeNode key={item.refpk} title={item.refcode + ' ' + item.refname} />;
        })

        return (
            <Fragment>
                {/* 参照 */}
                <div className='orgChange-box' style={{ marginBottom: '5px', width: '220px' }}>
                    {this.createRefer()}
                </div>
                <div style={{ minHeight: 300, maxHeight: 355, overflow: 'auto' }}>
                    <NCTree
                        checkable
                        checkStrictly={this.state.selectedRadioValue == 'onlySelf'}
                        defaultCheckedKeys={this.state.frontSelectedKeys}
                        onCheck={this.checkTreeNode.bind(this)}>
                        {loop(this.state.treeData)}
                    </NCTree>
                </div>
                <div style={{ display: 'flex', justifyContent: 'left' }}>
                    <div style={{ marginRight: 10 }}>{this.state.json['dataperm-000005']/* 国际化处理： 节点选中方式*/}</div>
                    <div style={{ display: 'inline-block' }}>
                        <NCRadioGroup name="containType"
                            selectedValue={this.state.selectedRadioValue}
                            onChange={this.handleChooseType.bind(this)}>
                            <NCRadio value="includeChild">{this.state.json['dataperm-000006']/* 国际化处理： 包含所有下级*/}</NCRadio>
                            <NCRadio value="onlySelf" >{this.state.json['dataperm-000007']/* 国际化处理： 仅自己*/}</NCRadio>
                        </NCRadioGroup>
                    </div>
                </div>
                {/* <NCRow>
                    <NCCol md={2}></NCCol>
                    <NCCol md={10}>
                        
                    </NCCol>
                </NCRow> */}
                <footer style={{ textAlign: 'right' }}>
                    <NCButton colors="primary" onClick={this.ensureInfo.bind(this)}>{this.state.json['dataperm-000002']/* 国际化处理： 确定*/}</NCButton>
                    <NCButton colors="primary" onClick={this.cancelInfo.bind(this)}>{this.state.json['dataperm-000003']/* 国际化处理： 取消*/}</NCButton>
                </footer>
            </Fragment>
        )
    }
}

UapbdDiscretDataTree = createPage({

})(UapbdDiscretDataTree);

module.exports = UapbdDiscretDataTree;



//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65