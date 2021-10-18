/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import React, { Component } from 'react';
import { base, high } from 'nc-lightapp-front';
const { PopRefer } = high.Refer, // 引入PopRefer类
    { NCRadio: Radio } = base,
    { NCRadioGroup: RadioGroup } = Radio;
class Ref extends PopRefer { // 继承PopRefer类
    constructor(props) {
        super(props);
        this.state = {
            ...this.state, // 继承state
            flag: '0' // 自定义扩展state
        };
    }

    // 复写原型方法
    getParam = (param = {}) => {
        let { queryCondition, pageSize, refType } = this.props,
            { keyword = '', pid = '', pageInfo = {} } = param;
        pageInfo = {
            pageSize: pageInfo.pageSize || pageSize,
            pageIndex: pageInfo.pageIndex || (refType === 'tree' ? -1 : 0)
        };
        let _param = {
            pid, // 对应的树节点
            keyword,
            queryCondition: queryCondition
                ? typeof queryCondition === 'function'
                    ? queryCondition()
                    : typeof queryCondition === 'object' ? queryCondition : {}
                : {},
            pageInfo
        };
        _param.queryCondition.pk_defdoclist = null;
        _param.queryCondition.DataPowerOperationCode = null;
        _param.queryCondition.isDataPowerEnable = true;
        _param.queryCondition.isShowOwnBank = 'N';
        _param.queryCondition.isIncludeCustSup = 'Y';
        _param.queryCondition.flag = this.state.flag; // 在参数中加上flag字段
        return _param;
    };
    // 复写原型方法：扩展界面内容
    renderPopoverLeftHeader = () => {
        return (
            <div>
                <RadioGroup name="accType" selectedValue={this.state.flag} onChange={this.handleRadioClick} style={{marginLeft:"20px",marginTop:"10px"}}>
                    <Radio value="0">银行档案</Radio>
                    <Radio value="1">非银行金融机构</Radio>
                </RadioGroup>
            </div>
        );
    };
    // radio选择事件
    handleRadioClick = (value) => {
    // 切换radio时应做的四件事：
    // 1. 改变state中flag的值
    // 2. 发起ajax请求
    // 3. 重绘左树
    // 4. 清空右表
        this.setState(
            {
                flag: value
            },
            () => {
                // 发起后台请求三部曲：
                let { queryTreeUrl, isCacheable, rootNode } = this.props;
                if(value === '0') {
                    this.props.queryTreeUrl = '/nccloud/uapbd/ref/BankDocDefaultTreeRef.do';
                    this.props.queryGridUrl = '/nccloud/uapbd/ref/bankacc/BankDocDefaultGridRef.do';
                } else {
                    this.props.queryTreeUrl = '/nccloud/tmpub/refer/nonbanktypetreeref.do';
                    this.props.queryGridUrl = '/nccloud/tmpub/refer/nonbankfininstitutiongridref.do';
                }
                
                // 1.调用getParam方法获取请求参数
                let param = this.getParam({
                        pid: 'root',
                        pageInfo: {
                            pageSize: 10,
                            pageIndex: -1
                        }
                    }),
                    // 2.调用hasCache方法，判断是否有缓存数据
                    cacheData = this.hasCache(queryTreeUrl, param);
                // 3.根据是否允许缓存以及是否有缓存数据，进入不同的分支
                if (isCacheable && cacheData) {
                    // 调用setTreeData设置树数据
                    this.setTreeData('treeData', rootNode, cacheData);
                } else {
                // 调用loadTreeData发起ajax请求，之后调用setTreeData设置树数据
                    this.loadTreeData(param).then((data) => {
                        this.setTreeData('treeData', rootNode, data);
                    });
                }
                //切换radio的时候，清空右表数据
                this.setState({
                    tableData: [
                    {
                        rows: [],
                        page: {
                            pageIndex: 0,
                            pageSize: this.props.pageSize,
                            totalPage: 1
                        }
                    }
                ]
                });
            }
        );
    };
}

export class RefofAccType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: {},
            flag: '',
        };
    }

    render() {
        return (
            <div>
                <Ref
                    placeholder={''}
                    refName={'金融机构'}
                    refCode={'tmpub.refer.tmbd.MergeInstGridRef'}
                    refType={'gridTree'}
                    queryTreeUrl={'/nccloud/uapbd/ref/BankDocDefaultTreeRef.do'}
                    queryGridUrl={'/nccloud/uapbd/ref/bankacc/BankDocDefaultGridRef.do'}
                    value={this.state.test}
                    rootNode={{refname:'机构',refpk:'root'}}
                    onChange={(val) => {
                        //console.log(val);
                        this.setState({
                            test: val
                        });
                    }}
                    columnConfig={[
                        {
                            name: [ '编码', '名称' ],
                            code: [ 'code', 'name' ]
                        }
                    ]}
                />
            </div>
        );
    }
}

export default function Test() {
    return <RefofAccType />;
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/