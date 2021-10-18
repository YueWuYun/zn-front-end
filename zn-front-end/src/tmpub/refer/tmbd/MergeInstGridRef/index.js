/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import React, { Component } from 'react';
import { base, high } from 'nc-lightapp-front';
const { PopRefer,MultiLangWrapper } = high.Refer, // 引入PopRefer类
    { NCRadio: Radio } = base,
    { NCRadioGroup: RadioGroup } = Radio;
class Ref extends PopRefer { // 继承PopRefer类
    constructor(props) {
        super(props);
        this.state = {
            ...this.state, // 继承state
            flag: '0'
        };
    }

    // 复写原型方法：点击参照三个点的事件
	show = () => {
		let { disabled, isTreelazyLoad, idKey } = this.props,
			{ selectedValues, selectedKeys, expandedKeys, includeChildren } = this.state;
		if (disabled) {
			return false;
		}
		!this.hasOwnProperty('prevOverFlow') && (this.prevOverFlow = document.body.style.overflow);
		document.body.style.overflow = 'hidden';
		//缓存旧数据，做取消用
		let { refType, rootNode, pageSize } = this.props,
			{ tableData } = this.state,
			param;

		// 先查常用，常用没有的话再查全部
		this.checkUsual(() => {
			// 没常用，查全部
			if (refType === 'grid') {
				param = this.__getParam({
					pageInfo: tableData[0].page
				});
				// isSearch && (param.keyword = searchVal);
				this.loadAndSetTableData(param);
			} else {
				param = this.__getParam({
					pid: isTreelazyLoad ? rootNode[idKey] : '',
					pageInfo: {
						pageSize,
						pageIndex: -1
					}
				});
				// isTreeSearch && (param.keyword = treeSearchVal);
				this.loadAndSetTreeData(param, rootNode, expandedKeys);
				if (refType === 'gridTree') {
					tableData[0].rows = [];
					selectedKeys = [];
				}
				this.setState({
					tableData,
                    selectedKeys: [],
                    flag: rootNode.refname === this.props.multiLang['refer-0047'] ? '0' : '1'
					// expandedKeys: [ rootNode[idKey] ]
				});
			}
			this.setState({
				activeKey: '2'
			});
		});

		this.runWithChildren = !!this.state.runWithChildren;
		this.setState({
			isShow: true,
			isFirstShow: false,
			dropDownShow: false,
			isSelectedShow: false,
			searchVal: '',
			treeSearchVal: '',
			selectedShow: false,
			max: false,
			isMultiSelectMode: [ ...selectedValues.keys() ].length <= 1 && !includeChildren ? false : true
		});
	};

    // 复写获取ajax传参方法
    getParam = (param = {}) => {
        let { queryCondition, pageSize, refType } = this.props,
            { keyword = '', pid = '', pageInfo = {} } = param;
        pageInfo = {
            pageSize: pageInfo.pageSize || pageSize,
            pageIndex: pageInfo.pageIndex || (refType === 'tree' ? -1 : 0)
        };
        let _param = {
            pid,
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
        _param.queryCondition.flag = this.state.flag;
        return _param;
    };

    // 复写原型方法：扩展界面内容
    renderPopoverLeftHeader = () => {
        return (
            <div>
                <RadioGroup name="accType" selectedValue={this.state.flag} onChange={this.handleRadioClick} style={{marginLeft:"20px",marginTop:"10px"}}>
                    <Radio value="0">{this.props.multiLang['refer-0047']}</Radio>
                    <Radio value="1">{this.props.multiLang['refer-0028']}</Radio>
                </RadioGroup>
            </div>
        );
    };

    // radio选择事件
    handleRadioClick = (value) => {
        this.setState(
            {
                flag: value
            },
            () => {
                let { queryTreeUrl, isCacheable, rootNode } = this.props;
                if(value === '0') {
                    this.props.queryTreeUrl = '/nccloud/uapbd/ref/BankDocDefaultTreeRef.do';
                    this.props.queryGridUrl = '/nccloud/uapbd/ref/BankDocDefaultGridRef.do';
                    this.props.rootNode= {refname: this.props.multiLang['refer-0046'], refpk:'root'};
                } else {
                    this.props.queryTreeUrl = '/nccloud/tmpub/refer/nonbanktypetreeref.do';
                    this.props.queryGridUrl = '/nccloud/tmpub/refer/nonbankfininstitutiongridref.do';
                    this.props.rootNode= {refname: this.props.multiLang['refer-0028'], refpk:'root'};
                }
                
                let param = this.getParam({
                        pid: 'root',
                        pageInfo: {
                            pageSize: 10,
                            pageIndex: -1
                        }
                    }),
                    cacheData = this.hasCache(queryTreeUrl, param); // 缓存
                if (isCacheable && cacheData) {
                    this.setTreeData('treeData', rootNode, cacheData);
                } else {
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
const Warrper = MultiLangWrapper(Ref);
export class RefofAccType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refValue: {},
            flag: '0'
        };
    }
    render() {
        return (
            <div style={{width: '100%'}}>
                <Warrper
                    {...this.props}
                    multiLang={{domainName: 'tmpub',
                    currentLocales: 'zh-CN',
                    moduleId: 'tmpubRefer'}}
                    refName = {'refer-0046'}
                    refCode = {'tmpub.refer.tmbd.MergeInstGridRef'}
                    refType = {'gridTree'}
                    queryTreeUrl = {'/nccloud/uapbd/ref/BankDocDefaultTreeRef.do'}
                    queryGridUrl = {'/nccloud/uapbd/ref/BankDocDefaultGridRef.do'}
                    rootNode = {{refname: 'refer-0047', refpk:'root'}}
                    columnConfig = {[
                        {
                            name: [ 'refer-0005', 'refer-0010' ],
                            code: [ 'code', 'name' ]
                        }
                    ]}
                    flag = {this.state.flag}
                />
            </div>
        );
    }
}

export default function(props) {
    return <RefofAccType {...props}/>;
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/