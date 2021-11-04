//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import Utils from '../../../../uap/public/utils'
import { isEmptyArr } from '../../../../uap/public/utils/emptyUtil';
import AccountBookTreeRef from '../../../refer/org/AccountBookTreeRef'
const { NCButton, NCTree, NCRadio, NCRow, NCCol } = base;
const {NCTreeNode} = NCTree;
const {NCRadioGroup} = NCRadio;

class AccountContent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            selectedRadioValue: 'includeChild',
            frontSelectedKeys: [],
            ref: '',
            rulejson: {
                querytype:"tree",
                querycondition:{
                    logic:"and",
                    conditions:[],
                    selectedKeys: []
                }
            },
            json:{},
            inlt:null

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
        const {paramObj, ruleJson} = this.props;
        const  refPk  = this.state.ref.refpk;
        const that = this;
        ajax({
            loading: true,
            url: "/nccloud/uapbd/rbac/AccountDataPermAction.do",
            data: {...paramObj, pk_accountbook: refPk},
            // pk_group
            success: function (res) {
                console.log('res', res);
                if (res.success) {
                    if(!res.data){
                        that.setState({treeData: []});
                    }else{
                        that.setState({treeData: res.data.rows});
                    }
                    if(ruleJson && ruleJson.querycondition && ruleJson.querycondition.selectedKeys && !isEmptyArr(ruleJson.querycondition.selectedKeys)) {
                        const selectedKeys = ruleJson.querycondition.selectedKeys;
                        that.echoTreeData(selectedKeys);
                    }
                } else {
                    toast({ color: 'danger',content: res.message })
                }
            }
        });
    }

    echoTreeData(selectedKeys) {
        this.setState({
            frontSelectedKeys: selectedKeys
        }, () => {
            this.render();
        })
    }

    checkTreeNode(selectedKeys) {//节点选中
        this.setState({
            frontSelectedKeys: selectedKeys.checked || selectedKeys
        }, () => {
            this.render();
        })
    }

    ensureInfo() {
        let selectedKeys = [...this.state.frontSelectedKeys];
        const treeData = [...this.state.treeData];
        let selectedConditions = this.state.rulejson.querycondition.conditions;
        const loop = (data, keys, callback) => {
            data && data.map( (item, index, arr) => {
                if(keys.includes(item.refpk)) {
                    const keyIndex = Utils.indexof(keys, item.refpk);
                    keys.splice(keyIndex, 1);
                    return callback(item, index, arr, keys, callback)
                }
                if(item.children && item.children.length) {
                    return loop(item.children, keys, callback)
                }
            })
        } 
        loop(treeData, selectedKeys, (item, index, arr, keys, callback) => {
            selectedConditions.push({
                extraParaVO: {
                    refcode:item.refcode,
                    refname: item.refname,
                    refpk: item.refpk
                }
            })
            if(item.children && item.children.length) {
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
        }, () => {
            this.render();
        }) 
    }

    render() {
        const loop = data => data.map( (item) => {
            if (item.children && item.children.length) {
                return <NCTreeNode key={item.refpk} title={item.pid=='root'?item.refname:item.refcode+' '+item.refname}>{loop(item.children)}</NCTreeNode>;
            }
            return <NCTreeNode key={item.refpk} title={item.pid=='root'?item.refname:item.refcode+' '+item.refname} />;
        })

        return (
            <Fragment>
                {/* 参照 */}
                <div style={{width: 220}}> 
                    <AccountBookTreeRef
                        value={this.state.ref}
                        onChange={(value) => {
                            this.setState({
                                ref: value
                            }, () => {
                                this.begTreeData();
                            });
                        }}
                        isMultiSelectedEnabled={false}
                    />
                </div>
                <div style={{minHeight: 300,maxHeight: 355,overflow: 'auto'}}>
                    {Utils.isEmptyArr(this.state.frontSelectedKeys) ? <NCTree
                        checkable
                        checkStrictly={this.state.selectedRadioValue == 'onlySelf'}
                        onCheck={this.checkTreeNode.bind(this)}>
                            {loop(this.state.treeData)}
                    </NCTree> : <NCTree
                        checkable
                        checkStrictly={this.state.selectedRadioValue == 'onlySelf'}
                        defaultCheckedKeys={this.state.frontSelectedKeys}
                        checkedKeys={this.state.frontSelectedKeys}
                        onCheck={this.checkTreeNode.bind(this)}>
                            {loop(this.state.treeData)}
                    </NCTree>}
                </div>
                <div style={{display: 'flex',justifyContent: 'left'}}>
                    <div style={{marginRight: 10}}>{this.state.json['dataperm-000005']/* 国际化处理： 节点选中方式*/}</div>
                    <div style={{display: 'inline-block'}}>
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
                <footer style={{textAlign: 'right'}}>
                    <NCButton colors="primary" onClick={this.ensureInfo.bind(this)}>{this.state.json['dataperm-000002']/* 国际化处理： 确定*/}</NCButton>
                    <NCButton colors="primary" onClick={this.cancelInfo.bind(this)}>{this.state.json['dataperm-000003']/* 国际化处理： 取消*/}</NCButton>
                </footer>
            </Fragment>
        )
    }
}

AccountContent = createPage({
    
})(AccountContent);

module.exports = AccountContent;



//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65