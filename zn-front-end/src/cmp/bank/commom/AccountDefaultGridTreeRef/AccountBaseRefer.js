/*2Oyzk7HRBoz2TmvbH0WDT5Sx6cN7owkOurG6aFo1uPhhNcApbXagS5wbrdnJd+7E*/
import { Component } from 'react';
import ReactDOM from 'react-dom';
import AccountAdvFilter from './AccountAdvFilter';
import ReferForm from './AccountReferForm';
import AccountReferTree from './AccountReferTree';
import AccAssItemTable from '../../../../../src/uapbd/public/excomponents/Table';
import Utils, { BaseUtils } from "../../../../../src/uapbd/public/utils/index";
import { base, high, ajax } from 'nc-lightapp-front';
import PropTypes from 'prop-types';
const { NCCheckbox: Checkbox, NCPopover: Popover, NCLoading: Loading, NCCollapse, NCButton, NCTable, NCMenu: Menu, NCDiv } = base;
const { NCSubMenu: SubMenu, Item } = Menu;
const { PopRefer, MultiLangWrapper } = high.Refer;
import './index.less';
class AccountBaseRefer extends PopRefer {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            accexpandedKeys: ['root'],
            dropDownShow: false, //搜索和历史记录下拉是否显示
            isAccountShow: false, //参照下拉和弹窗是否显示
            loading: false, //loading是否显示
            isShowUsual: false,
            formIds: ['account'],//表单的id
            formData: {},//表单的数据
            treeData: {},//树的数据
            allTreeData: null,
            treeId: 'referTree',//树的id
            isHighFilterShow: false,
            showModal: false,
            acccodeRule: null,//编码规则
            codeLength: 0,
            accAssItemTableData: [],
            accData: [],
            pk_accsystem: null,//科目体系主键
            originData: null,
            hasData: true,
            treeSearchVal: null,
            multiMode: false,
            maxLayNumber: 0,
            curParam: {},
            accassMeta: () => {
                return {
                    code: "10140ACCAB_accassitem",
                    name: this.props.multiLang['refer-001027'],/* 国际化处理： 辅助核算项目*/
                    pageid: "10140ACCAB_accassitem",
                    accassitem: {
                        items: [{
                            itemtype: "input",
                            col: "4",
                            label: this.props.multiLang['refer-001028'],/* 国际化处理： 序号*/
                            maxlength: "10",
                            title: this.props.multiLang['refer-001028'],/* 国际化处理： 序号*/
                            dataIndex: 'id',
                            width: "25%",
                            visible: true,
                            disabled: true,
                            attrcode: "id",
                            key: '1'
                        }, {
                            itemtype: "input",
                            col: "4",
                            visible: true,
                            label: this.props.multiLang['refer-001000'],/* 国际化处理： 辅助核算项编码*/
                            title: this.props.multiLang['refer-001000'],/* 国际化处理： 辅助核算项编码*/
                            dataIndex: 'code',
                            width: "25%",
                            maxlength: "40",
                            attrcode: "code",
                            key: '2'
                        }, {
                            itemtype: "input",
                            col: "4",
                            visible: true,
                            label: this.props.multiLang['refer-001001'],/* 国际化处理： 辅助核算项名称*/
                            title: this.props.multiLang['refer-001001'],/* 国际化处理： 辅助核算项名称*/
                            dataIndex: 'name',
                            width: "25%",
                            maxlength: "100",
                            disabled: false,
                            attrcode: "name",
                            key: '3'
                        }, {
                            itemtype: "input",
                            col: "4",
                            visible: true,
                            label: this.props.multiLang['refer-001029'],/* 国际化处理： 余额方向控制*/
                            title: this.props.multiLang['refer-001029'],/* 国际化处理： 余额方向控制*/
                            dataIndex: 'isbalancecontrol',
                            width: "25%",
                            maxlength: "100",
                            attrcode: "isbalancecontrol",
                            key: '4'
                        }],
                        moduletype: "table",
                        code: "accassitem",
                        name: this.props.multiLang['refer-001027']/* 国际化处理： 辅助核算项目*/
                    }
                }
            }
        };

        Object.assign(this.hotKeyElement, { selectAll: Symbol('selectAll'), more: Symbol('more') });
        this.gridTree = new Map([
            this.hotKeyElement.referPopWindow,
            this.hotKeyElement.referTree,
            this.hotKeyElement.treeSearchInput, // 一定有
            this.hotKeyElement.showDisabledData, // 可能没有
            this.hotKeyElement.selectAll,
            this.hotKeyElement.more
        ].filter((e) => e).map((e, i) => [e, i]));
    }
    /**
     * 复写 参数获得方法
     * @returns {{isQuickSearch: boolean}}
     */
    getParam = () => {
        return {
            isQuickSearch: !this.state.isShow,//快速检索时传的参数
            isAccountRefer: this.props.isAccountRefer,//区分全局或集团级 和 组织级
            onlyLeafCanSelect: this.props.onlyLeafCanSelect || false,
        };
    }
    // 复写原型方法：点击参照三个点的事件
    show = () => {
        let { disabled, isTreelazyLoad, idKey, refType, rootNode, isAccountRefer, pageSize } = this.props;
        if (disabled) { return false; }
        !this.hasOwnProperty('prevOverFlow') && (this.prevOverFlow = document.body.style.overflow);
        this.setState({ isShow: true, isFirstShow: false, dropDownShow: false, includeChildren: false, isTreeSearch: false, formData: {} }, () => {
            document.body.style.overflow = 'hidden';
            let param = this.__getParam({ pid: isTreelazyLoad ? rootNode[idKey] : '', pageInfo: { pageSize, pageIndex: -1 } });
            param.isAccountRefer = isAccountRefer;
            //加载并设置树数据
            this.loadAndSetTreeData(param, rootNode, this.state.accexpandedKeys, () => {
                this.AccAssItemTable.clearTableData();
                let keys = [...this.state.selectedValues.keys()] || [];
                let needExpandedKeys = [].concat(['root'], this.getNeedExpandKeys(keys));//this.state.accexpandedKeys.concat(this.getNeedExpandKeys(keys));
                this.setState({
                    treeSearchVal: null,
                    accexpandedKeys: needExpandedKeys,
                    cacheExpandedKeys: needExpandedKeys,
                    multiMode: keys.length > 1,
                    selectedKeys: this.props.isMultiSelectedEnabled ? [] : [...this.state.selectedValues.keys()],
                    checkedKeys: this.props.isMultiSelectedEnabled ? [...this.state.selectedValues.keys()] : []
                }, () => {
                    this.getMaxLayNumber();
                    this.focusFlag = false;
                    this.popWindow && !this.popWindow.contains(document.activeElement) && this.popWindow.focus();
                    // this.TreeComp && this.TreeComp.FormControl && this.TreeComp.FormControl.querySelector('input').focus();
                });
            });
        });
    };
    /**
     * 加载并设置树数据
     * @param param
     * @param rootNode
     * @param expandedKeys
     */
    loadAndSetTreeData = (param, rootNode, expandedKeys, callback) => {
        let { idKey, isCacheable, queryTreeUrl, isAccountRefer } = this.props, { isTreeSearch } = this.state, cacheData;
        param = Object.assign(this.__getParam(param), { isAccountRefer: isAccountRefer });
        cacheData = this.hasCache(queryTreeUrl, param);
        !(isCacheable && cacheData) ? this.loadTreeData(param).then((data) => {//后台请求
            this.setTreeData('treeData', rootNode, data, (res) => { callback && callback(); });
        }) : this.setTreeData('treeData', rootNode, cacheData, (res) => { callback && callback(); });
    }
    getResultData = (data, keys) => {
        let result = new Map();
        const loop = (data, keys) => {
            (data || []).forEach(item => {
                if (keys.includes(item.refpk)) {
                    let clone = JSON.parse(JSON.stringify(item));
                    delete clone.children;
                    result.set(item.refpk, clone);
                }
                if (item.children && item.children.length > 0) {
                    loop(item.children, keys);
                }
            })
        }
        loop((data && data.length > 0) ? data : this.state.treeData, keys);
        return result;
    }
    /**
     * 点击确定按钮
     */
    onReferSureClick = () => {
        setTimeout(() => {
            this.state.selectedValues.size != 0 && this.setState({ treeSearchVal: null }, () => {
                this.props.isMultiSelectedEnabled ? this.multiSelect() : this.singleSelect(this.getSelections()[0]);
                this.handlePopoverBlur();
            })
        }, 5);
    }
    // 弹出框中树的搜索事件
    popSearchTree = (keyword, callback) => {
        // tree走这个方法
        let { rootNode, idKey } = this.props;
        this.state.isTreeSearch = !!keyword;
        // 左树右表时：取消树节点的选中状态
        this.loadAndSetTreeData({ pageInfo: { pageIndex: -1 }, keyword }, rootNode, [rootNode[idKey]], () => {
            this.AccAssItemTable.clearTableData();
            this.setState({
                isTreeSearch: this.state.isTreeSearch
            }, callback);
        }
        );
    };
    //请求列表数据
    loadTableData = async (param) => {
        if (param.pageInfo) {
            param.pageInfo = Object.assign(param.pageInfo, { pageIndex: -1 });
        }
        return await new Promise((resolve) => {
            this.setState({ loading: true }, () => {
                let { tableData, currentLevel, referVal } = this.state;
                let { queryGridUrl, queryCondition, isCacheable } = this.props;
                ajax({
                    url: queryGridUrl, data: param, loading: false,
                    success: (res) => {
                        res.success && this.setState({ loading: false }, () => {
                            if (res.data.rows) {
                                let tableData = res.data.rows.hasOwnProperty('treeData') ? res.data.rows.treeData : res.data.rows;
                                res.data.rows = (tableData || []).map((e) => {
                                    let { nodeData, ...others } = e;
                                    e = Object.assign(e, nodeData);
                                    e.nodeData = e.nodeData || { ...others };
                                    return e;
                                });
                                isCacheable && this.setCacheData(queryGridUrl, param, res.data);
                                resolve(res.data);
                            }
                        });
                    },
                    error: (e) => { this.setState({ loading: false }); }
                });
            }
            );
        });
    };
    //请求树数据
    loadTreeData = async (param) => {
        return await new Promise((resolve) => {
            this.setState({ loading: true }, () => {
                let { currentLevel, referVal } = this.state;
                let { queryTreeUrl, queryCondition, isCacheable } = this.props;
                ajax({
                    url: queryTreeUrl, data: param, loading: false,
                    success: (res) => {
                        res.success && this.setState({ loading: false }, () => {
                            isCacheable && this.setCacheData(queryTreeUrl, param, res.data);
                            let selfParam = { ...param, isSelf: true };
                            isCacheable && res.data.rows && this.setCacheData(queryTreeUrl, selfParam, res.data.rows.treeData);
                            this.setState({ originParam: selfParam }, () => { resolve(res.data); });
                        });
                    },
                    error: (e) => { this.setState({ loading: false }, () => { this.cleanData(); }); }
                });
            }
            );
        });
    };
    setExpandedKeys = (expandedKeys, callback) => { this.setState({ accexpandedKeys: expandedKeys }, callback) }
    setMultiMode = (bool, callback) => { this.setState({ multiMode: bool }, callback) }
    /*******************************************
     * 复写原型方法：渲染内容区左侧 树组件
     *******************************************/
    renderPopoverLeft = () => {
        //树相关的监听
        let listener = {
            onTreeNodeSelect: this.onSelectTreeNodeLoadTreeData.bind(this),
            disabledCheck: this.disabledTreeNodeCheck.bind(this),
            onTreeNodeChecked: this.onCheckedTreeNodeLoadTreeData.bind(this),
            onTreeNodeDblClick: this.onTreeNodeDblClick.bind(this),
            popSearchTree: this.popSearchTree,
            setExpandedKeys: this.setExpandedKeys,
            setMultiMode: this.setMultiMode,
            setTreeSearchVal: (value, callback) => { this.setState({ treeSearchVal: value }, callback); }
        }
        let config = {
            treeId: this.state.treeId,
            allTreeData: this.state.allTreeData,
            expandedKeys: this.state.accexpandedKeys || [],
            actExpandKeys: this.state.accexpandedKeys,
            selectedKeys: this.state.selectedKeys,
            checkedKeys: this.state.checkedKeys,
            multiMode: this.state.multiMode || [...this.state.selectedValues.keys()].length > 1,
            refName: this.props.refName,
            treeSearchVal: this.state.treeSearchVal,
            cacheExpandedKeys: this.state.cacheExpandedKeys,
            onlyLeafCanSelect: this.props.onlyLeafCanSelect || false,//只能选择子节点
            isMultiSelectedEnabled: this.props.isMultiSelectedEnabled,
            tabIndex: this.getTabIndex(this.hotKeyElement.referTree),
            onTreeNodeKeyDown: () => { return this.resetHotKeyLoop.bind(this, this.hotKeyElement.referTree) },
            treeSearchInputTabIndex: this.getTabIndex(this.hotKeyElement.treeSearchInput),
            onTreeSearchKeyDown: () => { return this.resetHotKeyLoop.bind(this, this.hotKeyElement.treeSearchInput) }
        }
        //渲染自定义树组件
        return <AccountReferTree  {...config} multiLang={this.props.multiLang} listener={listener} ref={(treeComp) => { this.TreeComp = treeComp; }} />;
    };
    /*******************************************
     * 复写原型方法：渲染弹出层右侧
     *******************************************/
    renderPopoverRight = () => {
        return (
            <div style={{ height: "100%" }} >
                <div style={{ width: '100%', height: '30px', 'border-bottom': '1px solid #DEDEDE', lineHeight: '30px' }}>
                    {this.renderPopoverSearchArea()}
                </div>
                <ReferForm formData={this.state.formData} multiLang={this.props.multiLang} />
                <div className='ncc-hr-table' style={{ borderTop: '1px solid #DEDEDE' }}>
                    <AccAssItemTable
                        columns={this.state.accassMeta().accassitem.items}
                        scroll={{ y: 200, x: false }}
                        useFixedHeader={true}
                        bodyStyle={{ width: '100%', height: '100%' }}
                        style={{ height: '50%', width: '100%' }}
                        ref={(AccAssItemTable) => { this.AccAssItemTable = AccAssItemTable; }} />
                </div>
            </div>
        );
    };
    /*******************************************
     *  复写原型方法：渲染显示停用组件
     * @returns {*}
     *******************************************/
    renderPopoverPageArea = () => {
        return null;
    };
    // 复写原型方法：渲染弹出层搜索区域
    renderPopoverSearchArea = () => {
        let me = this;
        let { searchVal, searchSetting, columnConfig, treeData, treeSearchVal, selectedKeys, activeKey } = this.state;
        let { name: names, code: codes, checked = {} } = columnConfig[0];
        const {
            refType,
            allowSearchConfig,
            allowColumnConfig,
            isMultiSelectedEnabled,
            rootNode,
            isTreelazyLoad,
            isShowDisabledData,
            onlyLeafCanSelect,
            isShowUsual,
            refName
        } = this.props;
        return [
            // 显示停用
            isShowDisabledData && (
                <span className='isCheckbox' style={{ marginLeft: 10 }}>
                    <Checkbox
                        style={{ marginLeft: 10 }}
                        checked={this.state.isShowDisabledData}
                        onChange={this.onCheckBoxChange.bind(this)}
                        tabIndex={this.getTabIndex(this.hotKeyElement.showDisabledData)}
                        onKeyDown={this.resetHotKeyLoop.bind(this, this.hotKeyElement.showDisabledData)}
                    >
                        {this.props.multiLang['refer-001030']/* 国际化处理： 显示停用*/}
                    </Checkbox>
                </span>
            ),
            isMultiSelectedEnabled && (
                <span className='isCheckbox' style={{ marginLeft: 10 }}>
                    <Checkbox
                        style={{ marginLeft: 10 }}
                        checked={this.state.includeChildren}
                        disabled={!this.state.hasData}
                        tabIndex={this.getTabIndex(this.hotKeyElement.selectAll)}
                        onKeyDown={this.resetHotKeyLoop.bind(this, this.hotKeyElement.selectAll)}
                        onClick={() => {
                            let selectNodes = new Map(); let expandKeys = new Array();
                            me.setState({
                                includeChildren: !me.state.includeChildren
                            }, () => {
                                this.state.selectedValues.clear();
                                const loop = (datas) => {
                                    (datas || []).filter(data => {
                                        expandKeys.push(data.refpk);
                                        if (!data.disableCheckbox) {
                                            let clone = JSON.parse(JSON.stringify(data));
                                            delete clone.children;
                                            selectNodes.set(clone.refpk, clone);
                                        }
                                        if (data.children && data.children.length > 0) {
                                            loop(data.children);
                                        }
                                    })
                                }
                                me.state.includeChildren && loop(this.state.treeData);
                                me.setState({
                                    selectedValues: me.state.includeChildren ? selectNodes : new Map(),
                                    checkedKeys: me.state.includeChildren ? [...selectNodes.keys()] : [],
                                    accexpandedKeys: me.state.includeChildren ? [...expandKeys, 'root'] : ['root'],
                                    multiMode: me.state.includeChildren ? [...selectNodes.keys()].length > 1 : false
                                });
                            });
                        }}
                    >
                        {this.props.multiLang['refer-001031']/* 国际化处理： 全选*/}
                    </Checkbox>
                </span>
            ),
            // 树形参照的更多按钮
            !isTreelazyLoad && this.state.treeData && Array.isArray(this.state.treeData) && this.getMoreButtonDOM(),
            // 搜索区域扩展区
            this.renderPopoverSearchExtendArea(),
            // 设为常用
            isShowUsual && (
                <Button className="set-to-usual" onClick={this.usualAction.bind(this, 'save')}>
                    {this.props.multiLang['refer-001032']/* 国际化处理： 设为常用*/}
                </Button>
            ),
            // 列设置
            allowColumnConfig &&
            Array.isArray(names) &&
            names.length > 3 &&
            this.getColumnConfigDOM()
        ];
    };
    // 获取更多按钮的DOM    
    getMoreButtonDOM = () => {
        let { treeData } = this.state;
        const { isMultiSelectedEnabled, rootNode, idKey } = this.props;
        let group = {};
        treeData.forEach((e) => {
            group[e.pid] ? group[e.pid].push(e) : (group[e.pid] = [e]);
        });
        const menu = (
            <Menu
                ref={dom => {
                    this.moreButtonMenu = ReactDOM.findDOMNode(dom);
                }}
                vertical
                keyboard
                onClick={({ item, key, keyPath }) => {
                    this.state.hasData && this.setState({ isMoreButtonShow: false }, () => {
                        this.moreButton && this.moreButton.focus();
                        switch (key) {
                            case 'expandAll':
                            case 'unExpandAll':
                                this.setState({ isMoreButtonShow: false, accexpandedKeys: key == 'expandAll' ? this.getAllTreeId() : ['root'] });
                                break;
                            default:
                                if (key && key.startsWith('expand') && key != 'expandAll') {
                                    let level = key.charAt(key.length - 1);
                                    this.setState({ isMoreButtonShow: false, accexpandedKeys: ['root'].concat(this.getAllTreeId(level)) });
                                } else {
                                    let level = key.charAt(key.length - 1);
                                    let checkedKeys = this.getAllTreeId(level, true);
                                    let nodes = this.getTreeNodes(checkedKeys);
                                    let selectedValues = new Map();
                                    (nodes || []).forEach(node => {
                                        let clone = JSON.parse(JSON.stringify(node)); delete clone.children;
                                        selectedValues.set(clone.refpk, clone);
                                    })
                                    this.setState({ isMoreButtonShow: false, checkedKeys: checkedKeys, selectedValues: selectedValues, accexpandedKeys: this.getNeedExpandKeys([...selectedValues.keys()]) });
                                }
                                break;
                        }
                    });
                }}>
                <Item fieldid="expandAll" key="expandAll">{this.props.multiLang['refer-001033']/* 国际化处理： 全部展开*/}</Item>
                <Item fieldid="unExpandAll" key="unExpandAll">{this.props.multiLang['refer-001034']/* 国际化处理： 全部收起*/}</Item>
                <SubMenu fieldid={this.props.multiLang['refer-001014']} key="3" title={this.props.multiLang['refer-001014']/* 国际化处理： 级次展开*/}>{this.getMenuItem()}</SubMenu>
                {isMultiSelectedEnabled && (<SubMenu key="4" title={this.props.multiLang['refer-001015']/* 国际化处理： 级次选择*/}>{this.getMenuItem(true)}</SubMenu>)}
            </Menu>
        );
        return (
            <Popover
                className="popover-in-refer more"
                trigger={'click'}
                placement={'bottom'}
                content={menu}
                show={this.state.isMoreButtonShow}
                fieldid="more"
            >
                <span
                    className="more-button ncc-hr-font-size"
                    style={{ 'margin-left': '10px', display: 'inline-block', font: 'inherit' }}
                    tabIndex={this.getTabIndex(this.hotKeyElement.more)}
                    onKeyDown={this.resetHotKeyLoop.bind(this, this.hotKeyElement.more)}
                    onClick={() => {
                        this.state.hasData &&
                            this.setState({
                                isMoreButtonShow: true
                            });
                    }}
                    ref={(dom) => { this.moreButton = dom; }}
                >
                    {this.props.multiLang['refer-001035']/* 国际化处理： 更多*/}
                </span>
            </Popover>
        );
    };
    getMaxLayNumber = () => {
        let max = 0;
        const getMaxNumber = (datas) => {
            (datas || []).forEach(data => {
                if (data) {
                    if (data.nodeData && data.nodeData.laynumber && data.nodeData.laynumber > max) {
                        max = Number.parseInt(data.nodeData.laynumber);
                    }
                    if (data.children) {
                        getMaxNumber(data.children);
                    }
                }
            })
        }
        getMaxNumber(this.treeDataAdaptor());
        this.setState({ maxLayNumber: max });
    }
    /**
     * 获取树操作菜单
     * @param flag
     * @returns {any[]}
     */
    getMenuItem = (flag) => {
        // let arr = this.state.acccodeRule && this.state.acccodeRule.split("/");
        let maxlayNumber = this.state.maxLayNumber;
        let { multiLang } = this.props;
        /**********************************
         * 使用前判断 是否是数组或者数组是否是空
         **********************************/
        if (!maxlayNumber) { return; }
        let res = new Array();
        for (let i = 1; i <= maxlayNumber; i++) {
            res.push(<Item key={`select${i}`}>{flag ? multiLang['refer-001036'] : multiLang['refer-001038']}{i}{multiLang['refer-001037']/* 国际化处理： 选择,级*/}</Item>)
        }

        // let res = flag?arr.map((item,index)=>{
        //     let curIndex = index+1;
        //     return <Item key={`select${index+1}`}>{this.props.multiLang['refer-001036']}{curIndex}{this.props.multiLang['refer-001037']/* 国际化处理： 选择,级*/}</Item>
        // }):arr.map((item,index)=>{
        //     let curIndex = index+1;
        //     return <Item key={`expand${index+1}`}>{this.props.multiLang['refer-001038']}{curIndex}{this.props.multiLang['refer-001037']/* 国际化处理： 展开,级*/}</Item>
        // });
        return res;
    }
    /**
     * 获取所有树节点ID
     * @param level 指定展开第几层
     * @param isSelect  多选标识
     *
     */
    getAllTreeId = (level, isSelect) => {
        let { treeData } = this.state;
        let allTreeId = new Array();
        let onlyLeaf = this.props.onlyLeafCanSelect;
        const getTreeId = (data) => {
            data.forEach((item) => {
                if (level) {
                    if (isSelect) {
                        if (item.nodeData && item.nodeData.laynumber && item.nodeData.laynumber == level) {
                            if (!onlyLeaf ||
                                (onlyLeaf && (!item.children || (item.children && item.children.length == 0)))
                            ) {
                                allTreeId.push(item.refpk);
                                if (!this.state.selectedValues.has(item.refpk)) {
                                    // item.refcode = item.nodeData.refcode;
                                    // item.refname = item.name.split(" ")[1];
                                    this.state.selectedValues.set(item.refpk, item);
                                }
                            }
                        }
                    } else {
                        if (!item.nodeData || !item.nodeData.laynumber || (item.nodeData.laynumber && item.nodeData.laynumber < level)) {
                            allTreeId.push(item.refpk);
                        }
                    }
                } else {
                    if (isSelect) {
                        if (!onlyLeaf || (onlyLeaf && (!item.children || (item.children && item.children.length == 0)))) {
                            //有nodeData 并且有层级标识，才加到已选中
                            if (item.nodeData && item.nodeData.laynumber) {
                                allTreeId.push(item.refpk);
                                if (!this.state.selectedValues.has(item.refpk)) {
                                    // item.refcode = item.nodeData.refcode;
                                    // item.refname = item.name.split(" ")[1];
                                    this.state.selectedValues.set(item.refpk, item);
                                }
                            }
                        }
                    } else {
                        allTreeId.push(item.refpk);
                    }
                }
                if (item.children && item.children.length > 0)
                    getTreeId(item.children);
            })
            this.setState(this.state);
        }
        getTreeId(treeData);
        return allTreeId;
    }

    renderPopoverSearchExtendArea = () => {
        let { isShowHighFilter } = this.props;

        //保留参数 以防财务强行要求加出设置操作
        return (
            isShowHighFilter ?
                <span className="ncc-hr-refer-searcharea" style={{ width: '50px' }}>
                    <span
                        title={this.props.multiLang['refer-001016']/* 国际化处理： 高级*/}
                        className="ncc-hr-font-size"
                        style={{ 'margin-left': '10px', 'color': '#474d54', fontFamily: 'uf' }}
                        onClick={this.showHighFilterModal}
                    >{this.props.multiLang['refer-001016']/* 国际化处理： 高级*/}</span>
                    {this.createHighFilterModal()}
                </span> : <span />
        )
    }
    // 复写原型方法：渲染弹出层底部
    renderPopoverBottom = () => {
        let { selectedShow, tableData, isShow } = this.state, selectColumns = [];
        const { isMultiSelectedEnabled } = this.props;
        selectColumns.push({
            // 操作
            title: this.state.jsonInsideRefer['containers-refer-0025'],
            key: 'operate',
            width: 100,
            render: (text, row, index) => {
                return (
                    <span className="refer-del" onClick={this.onSelectedRowClick.bind(null, row, index)}>
                        {/* 移除 */}
                        {this.state.jsonInsideRefer['containers-refer-0026']}
                    </span>
                );
            }
        });
        selectColumns.unshift(...this.getCommonColumns());
        let height = isShow ? ((this.popover || {}).clientHeight || 0) - 85 : 0; // header + footer = 85
        return [
            isMultiSelectedEnabled && (
                <div className="refer-selected" key="1">
                    <NCButton fieldid="seled" onClick={() => { this.setState({ selectedShow: !selectedShow }); }}>
                        {this.props.multiLang['refer-001040']/* 国际化处理： 已选*/}<span>{this.getSelections().length}</span>
                    </NCButton>
                    <NCCollapse in={selectedShow} className="refer-collapse">
                        <div>
                            <div className="refer-collapse-header">
                                <div fieldid="test" className="refer-title" key="1">
                                    {this.props.multiLang['refer-001041']/* 国际化处理： 查看已选*/}
                                </div>
                                <div className="refer-close" key="3">
                                    <span onClick={() => { this.setState({ checkedKeys: [], selectedValues: new Map() }); }}>
                                        {this.props.multiLang['refer-001042']/* 国际化处理： 清空*/}
                                    </span>
                                    <span onClick={() => { this.setState({ selectedShow: false }); }}>
                                        {this.props.multiLang['refer-001043']/* 国际化处理： 收起*/}
                                    </span>
                                </div>
                            </div>
                            <div className="refer-table" style={{ height, padding: '15px 20px 0', boxSizing: 'border-box' }}>
                                <NCTable
                                    lazyload={false}
                                    style={{ cursor: 'initial' }}
                                    rowKey="refpk"
                                    columns={selectColumns}
                                    scroll={{ x: true, y: height - 50 }}
                                    data={this.getSelections()}
                                />
                            </div>
                        </div>
                    </NCCollapse>
                </div>
            ),
            <div className="refer-bottom-extend" key="2" />,
            <NCDiv areaCode={NCDiv.config.BOTTOM}>
            <div className="buttons" key="3">
                <NCButton fieldid="sure" style={{ backgroundColor: '#E14C46', color: '#fff' }} disabled={!this.state.hasData}
                    onClick={this.onReferSureClick}>
                    {this.props.multiLang['refer-001010']/* 国际化处理： 确定*/}
                </NCButton>
                <NCButton fieldid="cancel" style={{ backgroundColor: '#eee', color: '#666', marginLeft: '9px' }}
                    onClick={this.cancel}>
                    {this.props.multiLang['refer-001011']/* 国际化处理： 取消*/}
                </NCButton>
            </div>
            </NCDiv>
        ];
    }
    // 已选择页签中的删除事件
    onSelectedRowClick = (row, index) => {
        this.state.selectedValues.delete(row.refpk);
        this.setState({ checkedKeys: [...this.state.selectedValues.keys()] });
    };
    /********************************************
     * 设置树数据
     * @param target
     * @param parentNode
     * @param data
     * @param cb
     ********************************************/
    setTreeData = (target, parentNode, data, cb) => {
        /**************设置自定义树数据**************************/
        //判断是根节点
        parentNode['key'] = parentNode.refpk == 'root' ? parentNode.refpk : '~';
        if (data && data.hasOwnProperty("rows")) {
            //返回数据不为空
            let { treeData } = data.rows;
            let allTreeData = [Object.assign(parentNode, { children: treeData })];
            var codeArray = new Array();
            if (data.rows.hasOwnProperty("codeRule")) {
                codeArray = this.split.call(this, data.rows.codeRule, true);
            }
            if (data.rows.hasOwnProperty('accountType') && data.rows.accountType.length > 0) {
                this.state.pk_accsystem = data.rows.accountType[0].pk_accsystem;
            }
            this.setState({
                treeData: data.rows.treeData,
                allTreeData: this.disabledTreeNodeCheck(allTreeData),
                codeLength: codeArray.length,
                acccodeRule: data.rows.hasOwnProperty("codeRule") ? data.rows.codeRule : null,
                accData: data.rows.hasOwnProperty("account") ? data.rows.account : [],
                hasData: true
            }, () => { cb && cb({ rows: data.rows.account }); });
        } else {
            //返回数据为空
            this.setState({ treeData: [], hasData: false }, () => { this.cleanData(); });
        }
    };
    /**
     * 清空数据
     *   后台抛错 or 返回数据是空
     */
    cleanData = () => {
        this.AccAssItemTable.clearTableData();
        this.setState({ treeData: [] });
    }
    checkedDefaultValues = () => {
        let keys = new Array();
        if (this.state.selectedValues) {
            for (let [key, value] of this.state.selectedValues) {
                keys.push(value.refpk);
            }
        }
        this.setState({ checkedKeys: keys });
    }
    /***
     * 切割字符串
     * @param codeRule
     * @param trans2Int true/false  true 转换成int类型数组返回
     * @returns {*}
     */
    split = (codeRule, trans2Int) => {
        if (!codeRule) { return new Error(this.props.multiLang['refer-001019']); }/* 国际化处理： 编码规则不存在！*/
        if (codeRule.indexOf("/") == -1) { return [trans2Int ? parseInt(codeRule) : codeRule]; }
        var array = codeRule.split("/"); var result = new Array();
        return trans2Int ? array.map(code => { return parseInt(code) }) : array;
    }
    /***
     * 获得各级科目信息编码的长度
     * @param codeArray
     * @returns {*}
     */
    getCodeLengthArray = (codeArray) => {
        if (!codeArray) { return new Error(this.props.multiLang['refer-001019']); }/* 国际化处理： 编码规则不存在！*/
        var codeLengthArray = new Array();
        for (var i = 0; i < codeArray.length; i++) {
            if (i == 0) {
                codeLengthArray.push(codeArray[i]);
            } else {
                let length = parseInt(codeLengthArray[i - 1]) + parseInt(codeArray[i]);
                codeLengthArray.push(length);
            }
        }
        return codeLengthArray;
    }
    /*************************************************
     * 创建高级选择模态框
     * @returns {*}
     *************************************************/
    createHighFilterModal() {
        let { isHighFilterShow } = this.state;
        let config = {
            closeHighFilter: this.closeHighFilter,
            onAfterHighFilterCloseOk: this.onAfterHighFilterCloseOk,
            multiLang: this.props.multiLang,
            codeLength: this.state.codeLength,
            pk_accsystem: this.state.pk_accsystem
        }
        return isHighFilterShow && <AccountAdvFilter {...config} />
    }
    /*************************************************
     * 高级选择框关闭事件
     *************************************************/
    closeHighFilter = () => { this.setState({ isHighFilterShow: false }); }
    /**************************************************
     * 高级操作  弹出modal过滤会计科目
     * @param event
     **************************************************/
    showHighFilterModal = (event) => { this.state.hasData && this.setState({ isHighFilterShow: true, isMoreButtonShow: false, showModal: true }); }
    /**
     * 树节点双击事件
     * @param checkedKeys
     * @param node
     * @param event
     */
    onTreeNodeDblClick(checkedKeys, e) {
        let { nodeData, eventKey } = e.node.props; let { isMultiSelectedEnabled } = this.props;
        if (e.node.props.disableCheckbox) { return; }
        let clone = JSON.parse(JSON.stringify(nodeData));
        delete clone.children;
        clone = { ...clone, nodeData: clone };
        if (clone && !clone.refname.startsWith(clone.refcode)) { clone.refname = clone.name = clone.refcode + ' ' + clone.refname; }
        if (isMultiSelectedEnabled) {
            this.state.selectedValues.set(eventKey, clone);
        } else {
            this.state.selectedValues = new Map().set(eventKey, clone);
        }
        this.setState(this.state, () => {
            isMultiSelectedEnabled ? this.multiSelect() : this.singleSelect(this.getSelections()[0]);
            this.handlePopoverBlur();
            this.onHotKeyClose();
        })
    }
    /**************************************
     * 检查选中节点是否是根或者第一级子目录
     * @param data
     * @returns {boolean}
     **************************************/
    checkIsRootOrFirstSub = (data) => { return data.pid == 'root' || data.refpk == 'root' || data.pid == '~' || data.refpk == '~'; }
    /***************************************************
     * 树节点选中节点事件
     * @param node
     ***************************************************/
    onSelectTreeNodeLoadTreeData = (selectedKeys, callback, obj, checkedKeys) => {
        if (!selectedKeys || selectedKeys.length == 0) { return; }
        let selectNode = { node: obj.node.props, isLeaf: !(obj.node.props.children && obj.node.props.children.length > 0) }
        if (!selectNode || !selectNode.node) { return; }
        let selectedMap = this.getResultData(this.state.treeData, this.props.isMultiSelectedEnabled ? checkedKeys : (this.props.onlyLeafCanSelect ? (selectNode.isLeaf ? selectedKeys : []) : selectedKeys));
        if (!this.checkIsRootOrFirstSub(selectNode.node)) {//不是根和第一级子节点
            this.state.selectedKeys = [selectNode.node.refpk];
            if (this.props.isMultiSelectedEnabled) {//多选->多选模式
                this.state.checkedKeys = this.state.multiMode ? [...selectedMap.keys()] : [selectNode.node.refpk];
            }
            let result = this.state.multiMode ? this.state.selectedValues : selectedMap;
            // this.state.selectedValues = result;
            this.setState(this.state, () => {
                this.loadDetailWhenSelectOrCheckedTreeNode(obj, selectedMap, () => { });
            })
        }
    }
    /***************************************************************
     * 加载右侧详细信息
     * @param item 选中 或 勾选 的树数据对象
     * @param selectedValues 结果集
     * @param callback 回调
     ***************************************************************/
    loadDetailWhenSelectOrCheckedTreeNode = (item, selectedValues, callback) => {
        let config = {
            requestParam: {
                refpk: item.node.props.refpk,
                queryCondition: typeof (this.props.queryCondition) === 'function' ? this.props.queryCondition() : this.props.queryCondition,
                isLoadDetailInfo: true,
                isShowDisabledData: this.state.isShowDisabledData,
                isAccountRefer: this.props.isAccountRefer
            },
            url: this.props.queryTreeUrl,
        };
        (item.event == 'checked' && !item.checked) ? this.setState({ formData: null }, () => { callback && callback(); this.AccAssItemTable.clearTableData(); }) :
            this.setState({ loading: true }, () => {
                ajax({
                    url: config.url,
                    data: config.requestParam,
                    success: (res) => {
                        if (res.success) {
                            let { account, accAssItems } = res.data.rows;
                            this.state.formData = account;
                            this.AccAssItemTable.loadData(this.transTableData(accAssItems));
                            this.state.loading = false;
                        }
                        this.state.selectedValues = selectedValues;
                        this.setState(this.state, callback);
                    },
                    error: (e) => { this.setState({ loading: false }) }
                });
            })
    }
    /***************************************************************
     * 转换表格数据
     * @param data
     ***************************************************************/
    transTableData = (data) => {
        let tableData = new Array();
        if (data && data.length > 0) {
            data.forEach((item) => {
                let record = new Object();
                record.name = item.name;
                record.code = item.code;
                record.pk_accassitem = item.pk_accassitem;
                record.id = item.id;
                record.pk_accass = item.pk_accass;
                record.isbalancecontrol = item.isbalancecontrol;
                tableData.push(record);
            })
        }
        return tableData;
    }
    /***************************************************
     * 树节点复选框勾选事件
     * @param nodes
     ***************************************************/
    onCheckedTreeNodeLoadTreeData(checkedKeys, obj) {
        if (!checkedKeys || checkedKeys.length == 0) {
            this.setState({ selectedValues: new Map(), checkedKeys: checkedKeys, selectedKeys: [] }, () => {
                this.AccAssItemTable.clearTableData();//清右边
            });
            return;
        }
        let resultMap = this.getResultData(this.state.treeData, checkedKeys);
        //,selectedValues:resultMap
        this.setState({ selectedKeys: [obj.node.props.eventKey], checkedKeys: [...resultMap.keys()] }, () => {
            this.loadDetailWhenSelectOrCheckedTreeNode(obj, resultMap, () => { });
        })
    }
    /************************
     * 是否显示节点的复选框
     * @param data
     * @returns {*}
     ************************/
    disabledTreeNodeCheck = (data) => {
        const loop = (items) => {
            return items.map((item) => {
                //是否显示复选框 （根、分类、以及只允许末级选中&&包含子节点的节点）
                Object.assign(item, { disableCheckbox: (item.refpk == 'root' || item.pid == 'root' || item.pid == '~' || (this.props.onlyLeafCanSelect && item.hasOwnProperty('children') && item.children.length > 0)) });
                item && item.hasOwnProperty('children') && item.children.length > 0 && loop(item.children);
                return item;
            })
        }
        data && data.length > 0 && loop(data);
        return data;
    }
    /**************************************************
     * 显示停用改变选中状态时触发事件
     **************************************************/
    onCheckBoxChange() {
        this.setState({ isShowDisabledData: !this.state.isShowDisabledData }, () => {
            let param = this.__getParam({ pid: '', pageInfo: { pageSize: 10, pageIndex: -1 } });
            param['isShowDisabledData'] = this.state.isShowDisabledData;
            this.loadTreeData.call(this, param).then((data) => {
                this.setTreeData('treeData', this.props.rootNode, data, () => {
                    this.setState({ accexpandedKeys: [this.props.rootNode.refpk] });
                });
            });
        });
    }
    /**************************************************
     * 高级选择模态框确认关闭事件
     * @param condition
     **************************************************/
    onAfterHighFilterCloseOk = (condition) => {
        //未选择条件，不触发过滤动作
        if (!condition) { return; }
        /***************************************
         * @param curAccType  高级选择 选定的科目类型 Object
         * @param curAccAssItemArr 高级选择 选定的辅助核算项目 Array
         * @param accRange 高级选择 选定的科目级次
         * @param level 高级选择 选定的级次范围
         ***************************************/
        let { curAccType, curAccAssItemArr, accRange, level } = condition;
        let { isMultiSelectedEnabled } = this.props;
        ((!curAccAssItemArr || curAccAssItemArr.length == 0) && accRange == '3' && isMultiSelectedEnabled) ?
            this.specialAdvFilter(curAccType, this.closeHighFilter) : this.commonAdvFilter(condition, this.closeHighFilter)
    }
    specialAdvFilter = (accType, callback) => {
        let { selectedValues, checkedKeys, accexpandedKeys } = this.state;
        let { isMultiSelectedEnabled } = this.props; let treeData;
        const getLeaf = (datas, returnArr = new Array()) => {
            (datas || []).forEach(data => {
                if (data.children && data.children.length > 0) {
                    getLeaf(data.children, returnArr);
                } else {
                    let clone = JSON.parse(JSON.stringify(data));
                    delete clone.children; returnArr.push(clone);
                }
            })
        }
        const getScope = (datas, keys = [], arrs = new Array()) => {
            (datas || []).forEach(data => {
                if (data) {
                    keys.indexOf(data.refpk) > -1 && arrs.push(data);
                    data.children && data.children.length > 0 && getScope(data.children, keys, arrs);
                }
            })
        }
        treeData = this.getNeedFilterTreeData(accType ? accType.refpk : null);
        if ([...selectedValues.keys()].length > 0) {
            let scopes = new Array(); getScope(treeData, [...selectedValues.keys()], scopes);
            treeData = scopes && scopes.length > 0 ? scopes : treeData;
        }
        let arr = new Array(); getLeaf(treeData, arr);
        (arr || []).forEach(data => { !selectedValues.has(data.refpk) && selectedValues.set(data.refpk, data); })
        this.state.checkedKeys = [...selectedValues.keys()];
        this.state.accexpandedKeys = [].concat(this.getNeedExpandKeys([...selectedValues.keys()]), accexpandedKeys || []);
        this.setState(this.state, callback);
    }

    commonAdvFilter = (condition, callback) => {
        let { curAccType, curAccAssItemArr, accRange, level } = condition;
        let { isMultiSelectedEnabled } = this.props;
        /***************************************
         * 获得辅助核算项目的pk数组
         * @param curAccAssItemArr
         * @returns {any[]}
         ***************************************/
        const getAccAssItemPks = (curAccAssItemArr) => {
            let pks = new Array();
            if (!curAccAssItemArr || curAccAssItemArr.length == 0) { return pks; }
            curAccAssItemArr.forEach((accAssItem) => { pks.push(accAssItem.refpk); })
            return pks;
        }
        //辅助核算项目pk数组
        let accAssItemPks = getAccAssItemPks(curAccAssItemArr);
        //未选择辅助核算项目 也不触发过滤
        if (!accAssItemPks || accAssItemPks.length == 0) { callback && callback(); return; }
        /***************************************
         * 拼接参数对象
         ***************************************/
        let requestParam = {
            pk_accassitems: accAssItemPks,//辅助核算项目pk数组
            pk_acctype: curAccType ? curAccType.refpk : null,//科目类型主键
            isHightFilter: true,//高级过滤标志
            queryCondition: typeof (this.props.queryCondition) === 'function' ? this.props.queryCondition() : this.props.queryCondition,//参照查询条件
            isAccountRefer: this.props.isAccountRefer
        };
        this.setState({ loading: true }, () => {
            ajax({
                url: this.props.queryTreeUrl,
                data: requestParam,
                loading: false,
                success: (res) => {
                    this.setState({ loading: false }, () => {
                        //选中匹配条件的树节点
                        res.success && this.selectMatchCondtionTreeNode(res.data.rows.account, accRange, level, isMultiSelectedEnabled, this.state.acccodeRule, curAccType ? curAccType.refpk : null, callback);
                    });
                }
            })
        }
        );
    }
    treeDataAdaptor = () => {
        let { treeData } = this.state;
        if (treeData && treeData.length == 1 && treeData[0].refpk == 'root') {
            return treeData[0].children;
        }
        return treeData;
    }
    /*******************************************
     * 获得需要过滤的树数据
     *******************************************/
    getNeedFilterTreeData = (pk_acctype) => {
        let treeData = new Array();
        let adaptorData = this.treeDataAdaptor() || this.state.treeData;
        if (!!pk_acctype) {
            treeData.push(adaptorData.find(accType => { return accType.refpk == pk_acctype }));
        } else {
            treeData = adaptorData;
        }
        return treeData;
    }
    /**************************************************
     * 选中符合条件的树节点
     * @param data
     * @param accRange
     * @param level
     * @param isMultiSelectedEnabled
     * @param callback 回调
     **************************************************/
    selectMatchCondtionTreeNode = (data, accRange, level, isMultiSelectedEnabled, codeRule, pk_acctype, callback) => {
        //判断结果集是否为空
        if (BaseUtils.arrayIsEmpty(data)) { callback && callback(); return; }
        //切割编码 -> 得到编码数组[4,2,2,2,2]
        let codeRuleArray = this.split(codeRule, true);
        //获得各级节点编码的长度  [4,6,8,10,12]
        let codeLengthArray = this.getCodeLengthArray(codeRuleArray);
        //获得需要过滤的树数据
        let treeData = this.getNeedFilterTreeData(pk_acctype);
        let selectedValue = null, selectedValues = new Map();
        switch (accRange) {
            case '1'://范围
                let treeArrayData = this.tree2Array(treeData);
                /*****************************************
                 * 两个下拉框 值相等
                 *      过滤当前科目类型下含有该辅助核算项目的并且科目编码等于对应的编码长度的科目
                 * 两个下拉框 值不等
                 *      过滤当前科目类型下含有该辅助核算项目的并且科目编码长度介于对应的编码长度之间的科目
                 * @type {*[]}
                 *****************************************/
                var result = treeArrayData.filter((item) => {
                    for (let i = 0; i < data.length; i++) {
                        var da = data[i];
                        let pk = da.pk_accasoa;
                        let code = da.code;
                        if (item.refpk != pk) {
                            continue;
                        }
                        let begin = level[0] - 1;
                        let end = level[1] - 1;
                        if ((level[0] == level[1] && code.length == codeLengthArray[parseInt(begin)] && !item.disableCheckbox)) {
                            return true;
                        } else if ((level[0] != level[1] && (code.length >= codeLengthArray[parseInt(begin)] && code.length <= codeLengthArray[parseInt(end)]) && !item.disableCheckbox)) {
                            return true;
                        }
                        return false;
                    }
                });
                if (!BaseUtils.arrayIsEmpty(result)) {
                    if (isMultiSelectedEnabled) {
                        selectedValue = result;
                        //多选情况的多选模式，需要把已经选中的追加到高级过滤结果中
                        selectedValue = selectedValue.concat(this.getTreeNodes([...this.state.selectedValues.keys()]));
                        (selectedValue || []).forEach(node => {
                            if (this.props.onlyLeafCanSelect) {
                                if (!node.children || node.children.length == 0) {
                                    let clone = JSON.parse(JSON.stringify(node));
                                    delete clone.children;
                                    selectedValues.set(node.refpk, clone);
                                }
                            } else {
                                let clone = JSON.parse(JSON.stringify(node));
                                delete clone.children;
                                selectedValues.set(node.refpk, clone);
                            }
                        })
                        this.setState({
                            accexpandedKeys: this.getNeedExpandKeys([...selectedValues.keys()]),
                            checkedKeys: [...this.state.checkedKeys, ...selectedValues.keys()],
                            selectedValues: selectedValues,
                            multiMode: [...this.state.checkedKeys, ...selectedValues.keys()].length > 1,
                            isHighFilterShow: false
                        })
                    } else {
                        //单选
                        const loop = (nodes) => { return nodes.find(node => { if (node.children && node.children.length > 0) { loop(node.children); } else { return true; } }) }
                        let selectedValue = this.props.onlyLeafCanSelect ? loop(result) : result[0];
                        let clone = Utils.clone(selectedValue);
                        delete clone.children;
                        let keys = [selectedValue.refpk];
                        this.state.selectedValues = new Map().set(clone.refpk, clone);
                        this.setState({
                            accexpandedKeys: this.state.accexpandedKeys.concat(this.getNeedExpandKeys([clone.refpk])),
                            selectedKeys: [selectedValue.refpk],
                            multiMode: false,
                            selectedValues: new Map().set(clone.refpk, clone),
                            isHighFilterShow: false
                        }, () => {
                            //加载详细信息
                            this.onSelectTreeNodeLoadTreeData([clone.refpk], () => { }, { event: 'select', node: { props: clone }, selected: true });
                        });
                    }
                }
                break;
            case '2'://包含下级
                /*****************************************
                 * 当前科目类型下包含辅助预算项目的并且编码长度大于或等于第一级编码长度的所有科目
                 * @type {*[]}
                 *****************************************/
                const loopData = (treeNodes) => {
                    let result = [];
                    treeNodes.map((item) => {
                        for (let i = 0; i < data.length; i++) {
                            var da = data[i];
                            let pk = da.pk_accasoa;
                            let code = da.code;
                            if (item.refpk != pk) {
                                continue;
                            }
                            if (code.length >= codeLengthArray[0] && item.hasOwnProperty('children') && item.children.length > 0) {//&& item.hasOwnProperty('children') && item.children.length>0
                                result = result.concat(this.tree2Array([item]));
                                return;
                            }
                        }
                    });
                    return result;
                }
                let accountDatas = new Array();
                treeData.filter(typeData => {
                    if (typeData.hasOwnProperty('children') && typeData.children.length > 0) {
                        accountDatas = accountDatas.concat(typeData.children);
                    }
                })
                let result = loopData(accountDatas);
                if (!BaseUtils.arrayIsEmpty(result)) {
                    if (isMultiSelectedEnabled) {
                        //多选情况的多选模式，需要把已经选中的追加到高级过滤结果中
                        selectedValue = result.concat(this.getTreeNodes([...this.state.selectedValues.keys()]));
                        (selectedValue || []).forEach(node => {
                            if (this.props.onlyLeafCanSelect) {
                                if (!node.children || node.children.length == 0) {
                                    let clone = Utils.clone(node);
                                    delete clone.children;
                                    selectedValues.set(node.refpk, clone);
                                }
                            } else {
                                let clone = Utils.clone(node);
                                delete clone.children;
                                selectedValues.set(node.refpk, clone);
                            }
                        })
                        this.setState({
                            accexpandedKeys: this.getNeedExpandKeys([...selectedValues.keys()]),
                            checkedKeys: [...this.state.checkedKeys, ...selectedValues.keys()],
                            selectedValues: selectedValues,
                            multiMode: [...this.state.checkedKeys, ...selectedValues.keys()].length > 1,
                            isHighFilterShow: false
                        });
                    } else {
                        //单选
                        const loop = (nodes) => { return nodes.find(node => { if (node.children && node.children.length > 0) { loop(node.children); } else { return true; } }) }
                        let selectedValue = this.props.onlyLeafCanSelect ? loop(result) : result[0];
                        let clone = Utils.clone(selectedValue); delete clone.children;
                        this.setState({
                            accexpandedKeys: this.state.accexpandedKeys.concat(this.getNeedExpandKeys([clone.refpk])),
                            selectedValues: new Map().set(clone.refpk, clone),
                            selectedKeys: [clone.refpk],
                            multiMode: false,
                            isHighFilterShow: false
                        }, () => {
                            this.onSelectTreeNodeLoadTreeData([clone.refpk], () => {
                            }, { event: 'select', node: { props: clone }, selected: true });
                        })
                    }
                }
                break;
            case '3'://只显示末级
                this.onlyShowLeaf(isMultiSelectedEnabled, treeData, data, this.state.multiMode);
                break;
        }
    }
    tree2Array = (data, list = []) => {
        data.forEach((e) => {
            let { children, ...others } = e;
            list.push(e);
            if (children && children.length > 0) {
                this.tree2Array(e.children, list);
            }
        });
        return list;
    }
    /**
     * 获得叶子节点数组
     * @param accDatas
     * @returns {*}
     */
    getLeafData = (accDatas, list = []) => {
        accDatas.filter(accData => {
            if (!accData.hasOwnProperty('children') || accData.children.length == 0) {
                //末级数据;
                list.push(accData);
            } else {
                this.getLeafData(accData.children, list);
            }
        })
        return list;
    }
    /***************************************
     * 只显示末级
     * @param isMultiSelectedEnabled
     * @param treeData
     * @param data :filterData
     ***************************************/
    onlyShowLeaf = (isMultiSelectedEnabled, treeData, data, multiMode, callback) => {
        let leafDatas = new Array();//叶子节点数组
        treeData.forEach((typeData) => {
            if (typeData.hasOwnProperty('children') && typeData.children.length > 0) {
                leafDatas = leafDatas.concat(this.getLeafData(typeData.children));
            }
        })
        let leafDataMap = new Map();//末级数据map
        //所有叶子节点的map
        if (leafDatas && leafDatas.length > 0) {
            leafDatas.forEach(leafData => {
                leafDataMap.set(leafData.refpk, leafData);
            })
        }
        //结果数组 和 给李艺轩参照用的结果map
        let result = new Array(), resultValues = new Map();
        isMultiSelectedEnabled ? data.forEach(d => {
            let leaf = leafDataMap.get(d.refpk);
            if (leaf) {
                result.push(leaf);
                resultValues.set(leaf.refpk, leaf);
            }
        }) : data.find(d => {
            let leaf = leafDataMap.get(d.refpk);
            if (leaf) {
                result.push(leaf)
                resultValues.set(leaf.refpk, leaf);
                return true;
            }
        })
        let hasSelects = isMultiSelectedEnabled ? this.getTreeNodes([...this.state.selectedValues.keys()]) : [];
        (hasSelects || []).forEach(node => {
            resultValues.set(node.refpk, node);
        })
        if (!result || result.length == 0) { return; }
        let expandKeys = this.getNeedExpandKeys([...resultValues.keys()]);
        this.setState({ accexpandedKeys: expandKeys, isHighFilterShow: false, selectedValues: resultValues }, () => {
            isMultiSelectedEnabled ?
                this.setState({ checkedKeys: [...resultValues.keys()], multiMode: [...resultValues.keys()].length > 1 }) :
                this.onSelectTreeNodeLoadTreeData([result[0].refpk], () => {
                    this.setState({ selectedKeys: [result[0].refpk], multiMode: false });
                }, { event: 'select', node: { props: result[0] }, selected: true });
        });
    }
    /***************************************
     * 获得需要展开的树节点pk
     ***************************************/
    getNeedExpandKeys = (keys = []) => {
        let needExpandedKeys = new Array();
        const loop = (datas, pdata) => {
            let parentExpand = false;
            datas.forEach(data => {
                var expand = loop(data.children || [], data);
                if (expand || data && keys.includes(data.refpk)) {
                    parentExpand = true;
                }
            });
            parentExpand && needExpandedKeys.push(pdata.refpk);
            return parentExpand;
        }
        let parentExpand = loop(this.state.treeData, this.props.rootNode);
        return needExpandedKeys;
    }
    getTreeNodes = (keys, deleteChildren = true) => {
        let result = new Array();
        const loop = (datas) => {
            datas.forEach(data => {
                let clone = JSON.parse(JSON.stringify(data));
                if (deleteChildren) { delete clone.children; }
                keys.includes(data.refpk) && result.push(clone);
                if (data.children && data.children.length > 0) {
                    loop(data.children);
                }
            })
        }
        loop(this.state.treeData);
        return result;
    }
    onRowDoubleClick = (record, selectRowIndex, event) => {
        let { isMultiSelectedEnabled } = this.props;
        let checkedNodes = this.getTreeNodes(isMultiSelectedEnabled ? this.state.checkedKeys : this.state.selectedKeys);
        let selectedValues = new Map();
        checkedNodes.forEach(node => { selectedValue.set(node.refpk, node); });
        this.setState({ selectedValues: selectedValues }, () => {
            isMultiSelectedEnabled ? this.multiSelect() : this.singleSelect(this.getSelections()[0]);
            this.handlePopoverBlur();
        })
    }
    getHotKeyMap = () => { return this.gridTree; }
}
const WapperAccountRefer = MultiLangWrapper(AccountBaseRefer);
export default WapperAccountRefer;


/*2Oyzk7HRBoz2TmvbH0WDT5Sx6cN7owkOurG6aFo1uPhhNcApbXagS5wbrdnJd+7E*/