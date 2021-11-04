//QNde+07VgUTpSo0I3NzUFUuB53GEfpJZ5q9xZvyoMyEYAjR5SGuMEZ6W2N6VIVc/
import React, {Component} from 'react';
import {createPage, ajax, base, toast, print} from 'nc-lightapp-front';
import AccSystemGridRef from '../../../../uapbd/refer/fiacc/AccSystemGridRef/index.js';
import Accctrlruleform from "./accctrlruleform";
import './index.less';
import {setTimeout} from 'timers';

const {NCStep, NCPopconfirm, NCIcon, NCTabs, NCCheckbox, NCSelect, NCButton, NCModal, NCTable, NCFormControl, NCRow, NCCol, NCInput, NCAffix, NCBackBtn, NCDiv} = base;
const NCOption = NCSelect.NCOption;

/**
 * 科目体系结构查询
 */
class List extends Component {
    constructor (props) {
        super(props);

        this.config = Object.assign({
            systreeId: 'accsysqrytree',
            systreeTitle: props.config.json['10140ACCSB-000005']/* 国际化处理： 科目体系结构*/
        }, props.config);

        this.url = {
            queryChartsAndRulesTreeAction: '/nccloud/uapbd/accsystem/QueryChartsAndRulesTreeAction.do',//科目体系结构树查询
            accSysQryPinrtAction: '/nccloud/uapbd/accsystem/AccSysQryPinrtAction.do', //科目体系结构树打印
            accountListTreeAction: '/nccloud/uapbd/accsystem/AccountListTreeAction.do', //右树表查询
            accsysCharQryAction: '/nccloud/uapbd/accsystem/AccsysCharQryAction.do', //科目表详细查询
            accsysRuleQryAction: '/nccloud/uapbd/accsystem/AccsysRuleQryAction.do', //科目控制规则详细查询
            listVersionAction: '/nccloud/uapbd/account/ListVersionAction.do',//科目表版本列表查询
            accoutCardQuery: '/nccloud/uapbd/accsystem/AccoutCardQuery.do',//会计科目卡片查询
        };

        this.areaIds = {
            formAccount: 'formAccount',//会计科目
            account_vouchertype: 'account_vouchertype',//凭证必输项设置
            account_accass: 'account_accass',
            account_crlmd: 'account_crlmd'
        };

        //树表state
        let loopNode = (nodes, handler) => {
            nodes.forEach(node => {
                handler && handler(node, node.children || []);
                loopNode(node.children || [], handler);
            });
        };

        let listPanel = {
            datas: [],
            listtree: {
                columns: [],
                expandedRowKeys: [],
                selectedRecord: undefined,
                rowClassName: record => {
                    return this.state.listPanel.listtree.selectedRecord && record.id == this.state.listPanel.listtree.selectedRecord.id ? 'nctable-selected-row' : ''
                },
                onRowClick: (record, index, event) => {
                    this.state.listPanel.listtree.selectedRecord = record;
                },
                rowKey: (record, index) => {
                    return record.id;
                },
                onExpand: (expanded, record) => {
                    this.state.listPanel.listtree.expandedRowKeys.push(record.id);
                    this.setState(this.state);
                },
                scroll: {x: true, y: 600}
            },
            numberbtn: {
                btns: [],
                expandedRowKeys: [],
                renderNumberBtn: () => {
                    var {btns, expandedRowKeys} = this.state.listPanel.numberbtn,
                        filterNodeKeyByNumber = (nodeNumber) => {
                            var keys = [],
                                hander = (node, children) => {
                                    node.nodeData.laynumber <= nodeNumber && keys.push(node.id)
                                };
                            loopNode(this.state.listPanel.datas, hander);
                            return keys;
                        };

                    return btns.map(btn => {
                        var onclick = () => {
                            var keys = filterNodeKeyByNumber(btn.index),
                                expandedRowKeys = [...expandedRowKeys, ...keys];
                            this.state.listPanel.numberbtn.expandedRowKeys = expandedRowKeys;
                            this.setState(this.state);
                        }
                        return <a className='ordernum' onClick={onclick}>[{btn.index}]</a>
                    });
                }
            },
            classbtn: {
                curBtn: undefined,
                btns: [],
                filterData: (datas) => {
                    var {listtree, numberbtn, classbtn} = this.state.listPanel;
                    if (!classbtn.curBtn || !classbtn.curBtn.value)
                        return datas;
                    return datas.filter(data => {
                        return data.nodeData.pk_acctype.value == classbtn.curBtn.value
                    });
                }
            },
            setDatas: (datas) => {
                var {listtree, numberbtn, classbtn} = this.state.listPanel,
                    createNumberBtns = (nodes) => { //获取树节点层级号数组
                        var maxlaynumber = 1, i, btns = [],
                            hander = (node, children) => {
                                var nodenumber = parseInt(node.nodeData.laynumber);
                                maxlaynumber = nodenumber <= maxlaynumber ? maxlaynumber : nodenumber;
                            };
                        loopNode(nodes, hander);
                        for (i = 0; i <= maxlaynumber; i++) {
                            btns.push({
                                index: i,
                                expand: false
                            });
                        }
                        return btns;
                    },
                    createClassBtns = (nodes) => {
                        var classNames = [], classkeys = [],
                            hander = (node, children) => {
                                var type = node.nodeData.pk_acctype;
                                if (classkeys.indexOf(type.value) == -1) {
                                    classNames.push(type);
                                    classkeys.push(type.value);
                                }
                            };
                        loopNode(nodes, hander);
                        classNames.push({display: this.props.config.json['10140ACCSB-000006']});
                        /* 国际化处理： 全部*/
                        return classNames;
                    };
                numberbtn.btns = createNumberBtns(datas);
                classbtn.btns = createClassBtns(datas);
                listtree.selectedRecord = undefined;
                numberbtn.expandedRowKeys = [];
                this.state.listPanel.datas = datas;
            }
        };

        let refChartVersion = {
            datas: [],
            fieldid: 'refChartVersion',
            placeholder: this.props.config.json['10140ACCSB-000007'], /* 国际化处理： 科目表生效日期*/
            value: '',
            showClear:false,
            onChange: (value) => {
                this.state.refChartVersion.value = value;
                this.setState(this.state, () => {
                    this.loadAccount();
                });
            },
            renderOption: function () {
                return this.datas.map(data => {
                    return <NCOption value={data.pk_accchart}>{data.beginperiod}</NCOption>
                });
            }
        };

        this.state = {
            ...this.props,
            accSystem: {},//科目体系参照选中值
            effectDateOption: [{key: '', value: ''}],//科目表生效日期下拉option
            selectedTreeNode: {},//选中树节点
            listPanel: listPanel,
            isSelChar: false,  //是否选中科目表
            refChartVersion: refChartVersion, //科目表生效日期
            editOrgName: '',//维护组织
            showCard: false,
            selRecordId: '',  //选中记录id
            json: props.config.json,  //多语
            inlt: props.config.inlt
        }

        this.emptyTree = this.emptyTree.bind(this);
        this.state.listPanel.listtree.columns = this.createTreeCols(this.props.meta.getMeta());
    }

    /**
     * 点击table编码或卡片翻页
     * @param record  当前记录
     * @param index   当前记录下标
     */
    onClickLinkCode = (record, index) => {
        this.state.curIndex = index;
        this.state.isFirst = index == 0 ? true : false;
        this.state.isEnd = index == this.state.allpks.length - 1 ? true : false;
        this.state.selRecordId = record.id;
        this.setState(this.state, () => {
            this.routerToCard();
        });
    };

    /**
     * 清空树节点数据
     */
    emptyTree () {
        let data = [];
        //同步树  加载全部数据
        this.props.syncTree.setSyncTreeData(this.config.systreeId, data);
    }

    createTreeCols (template) {
        var treeCols = template.listAccount.items || [],
            numberCol;
        treeCols = treeCols.filter(item => item.visible);
        treeCols = treeCols.map(item => {
            return {
                item: item,
                key: item.attrcode,
                width: 170,
                //  title: item.label,
                title: (<div fieldid={item.attrcode}>{item.label}</div>),
                render: (text, record, index) => {
                    if (item.attrcode == 'code')
                        return  <div fieldid='code'>
                                <a href='javascript:void(0)'
                                  onClick={this.onClickLinkCode.bind(this, record, index)}>{record.nodeData[item.attrcode] ? (record.nodeData[item.attrcode].value || '') : ''}</a>
                                </div>

                    if (item.itemtype === 'switch') {
                        if (item.attrcode === 'quantitycheck') {//如果是辅助核算，那么这个是否打选中有record记录中的unit.value === null是否为空来判断，因为这个是必输项modifide by liusenc 20180810
                            return <div fieldid={item.attrcode}>
                                   {record.nodeData['unit'].value === null ? this.props.config.json['10140ACCSB-000008'] : this.props.config.json['10140ACCSB-000009']}
                                    {/* 国际化处理： 是,否*/}
                                   </div>
                        }
                        return 
                                <div fieldid={item.attrcode}>
                                 {(record.nodeData[item.attrcode] === undefined ? false : record.nodeData[item.attrcode].value) ? this.props.config.json['10140ACCSB-000008'] : this.props.config.json['10140ACCSB-000009']}
                                 { /* 国际化处理： 是,否*/}
                                </div>
                    }
                    else if (item.itemtype === 'refer' || item.itemtype === 'select')
                        return <div fieldid={item.attrcode}>
                              {record.nodeData[item.attrcode]&&record.nodeData[item.attrcode].display  ? record.nodeData[item.attrcode].display : <span >&nbsp;</span>}
                              </div>
                    else
                return   <div fieldid={item.attrcode}>
                         {record.nodeData[item.attrcode]&&record.nodeData[item.attrcode].value  ? record.nodeData[item.attrcode].value : <span >&nbsp;</span>}
                         </div>
                }
            }
        });
        numberCol = {
            key: 'keyno',
            width: 180,
            title: '',
            render: (text, record, index) => {
                return '';//  index + 1;
            }
        };
        treeCols.unshift(numberCol);
        return treeCols;
    }

    componentDidMount () {
        let accSystem = {};
        if (this.props.config['pk_accsystem']) {
            accSystem = {
                refpk: this.props.config['pk_accsystem'],
                refname: this.props.config['name_accsystem']
            }
        }
        this.setState(
            {accSystem: accSystem},
            () => {
                this.loadTree();
            }
        );
    }

    onButtonClick (props, id) {
        if (id === 'print') {
            this.print();
        } else if (id === 'franmeworkRefresh') {
            this.loadAccount(() => {
                toast({color: 'success', title: this.props.config.json['10140ACCSB-000004']});
                /* 国际化处理： 刷新成功！*/
            });
        } else if (id === 'back') {
            this.setState({showCard: false});
        } else if (id === 'fRefresh') {
            this.routerToCard(() => {
                toast({color: 'success', title: this.props.config.json['10140ACCSB-000004']});
                /* 国际化处理： 刷新成功！*/
            });
        }
    }

    //打印
    print () {
        let pks = [this.state.accSystem['refpk']];
        let param = {
            funcode: '10140ACCSB',
            nodekey: 'accsysqryprint',  //模板节点标识
            oids: pks
        };
        print(
            'pdf',
            this.url.accSysQryPinrtAction,
            param
        );
    }

    loadTree () {
        ajax({
            url: this.url.queryChartsAndRulesTreeAction,
            data: {pk_accsystem: this.state.accSystem['refpk']},
            success: (result) => {
                if (result.success) {
                    if (!result.data || result.data.length == 0) {
                        this.props.button.setButtonDisabled(['print'], true);
                    } else {
                        this.props.button.setButtonDisabled(['print'], false);
                    }
                    //自定义根节点
                    let root = {
                        "isleaf": false,
                        "key": "~",
                        "title": this.config.systreeTitle,
                        "id": "~",
                        "innercode": "~",
                        "pid": "",
                        "refname": this.config.systreeTitle,
                        "refpk": "~"
                    };
                    let data = [Object.assign({...root}, {children: result.data})];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.systreeId, this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.systreeId, root.refpk);

                    this.clear();
                }
            }
        });
    }

    /**
     * 处理树数据
     */
    dealTreeData (data) {
        let deleteDataChildrenProp = function (node) {
            let icon = node['nodeData'] ? node['nodeData']['isChar'] ? <NCIcon type="uf-table"/> :
                <NCIcon type="uf-symlist"/> : <NCIcon type="uf-folderopen-o"/>;
            node.beforeName = <span>{icon}&nbsp;</span>
            if (!node.children || node.children.length == 0) {
                delete node.children;
            }
            else {
                node.isLeaf = false;
                node.children.forEach((e) => {
                    deleteDataChildrenProp(e);
                });
            }
        };
        data.forEach((e) => {
            e.iconBox = {
                editIcon: false,
                addIcon: false,
                delIcon: false
            };
            deleteDataChildrenProp(e);
        });
        return data;
    }

    onSelectTree (refpk) {
        let selectedTreeNode = this.props.syncTree.getSyncTreeValue(this.config.systreeId, refpk);

        if (selectedTreeNode == null || !selectedTreeNode['nodeData'] || !selectedTreeNode['nodeData']['isChar']) {
            this.setState({isSelChar: false, selectedTreeNode: selectedTreeNode});
            this.clear();
            this.loadAccount();
            return;
        }

        this.setState(
            {isSelChar: true, selectedTreeNode: selectedTreeNode},
            () => {
                this.loadDatarefChartVersion(data => {
                        var lastData = this.fillDatarefChartVersion(data);
                        if (lastData) {
                            this.state.refChartVersion.value = lastData.pk_accchart;
                            this.setState(this.state, () => {
                                this.loadAccount();
                            });
                        }
                    }
                );
            });
    }

    loadDatarefChartVersion (callback) {//加载科目版本日期
        ajax({
            loading: true,
            url: this.url['listVersionAction'],
            data: {'pk_accchart': this.state.selectedTreeNode['refpk'] ? this.state.selectedTreeNode['refpk'] : ''},
            success: (res) => callback && callback(res.data || [])
        });
    }

    fillDatarefChartVersion (datas = []) {
        this.state.refChartVersion.datas = datas;
        //根据查询到科目表的所有版本信息，过滤出最新的值，返回给调用者
        let retChart = undefined;
        if (datas.length > 0) {
            datas.forEach((ele) => {
                if (ele.endperiod === '9999-99-99') {
                    retChart = ele;
                }
            })
        }
        return retChart;
    }

    /**
     * 获取树节点所有pk
     * @param datas
     * @returns {*}
     */
    getAllPks (datas) {
        if (!datas || datas.length == 0)
            return [];
        let allPks = new Array();
        let getTreeId = (data) => {
            data.forEach((item) => {
                allPks.push(item.refpk);
                item.children && item.children.length > 0 && getTreeId(item.children);
            });
        }
        getTreeId(datas);
        return allPks;
    }

    loadAccount (callback) {//加载右侧会计科目数据
        let selectedTreeNode = this.state.selectedTreeNode;
        //若未选中左树，则不查询  或 未选择科目体系
        if (Object.keys(selectedTreeNode).length == 0 || !this.state.refChartVersion.value) {
            callback && callback();
            return;
        }
        let paramData = {
            pk_accchart: this.state.refChartVersion.value || '',
            gbo: selectedTreeNode['nodeData']['gbo'],
            pk_org: selectedTreeNode['nodeData']['pk_org'],
            pk_group: selectedTreeNode['nodeData']['pk_group']
        };
        if (!this.state.isSelChar) {
            paramData = {
                pk_accctrlrule: selectedTreeNode['nodeData']['pk_accctrlrule'],
                pk_accchart: selectedTreeNode['nodeData']['pk_accchart'],
                pk_accsystem: selectedTreeNode['nodeData']['pk_accsystem']
            }
        }
        ajax({
            url: this.url['accountListTreeAction'],
            data: paramData,
            success: (res) => {

                let {success, data} = res;
                if (success) {
                    this.state.listPanel.setDatas((data && data['treeData']) ? data['treeData'] : []);
                    if (this.state.isSelChar) {
                        this.state.editOrgName = (data && data['editOrgName']) ? data['editOrgName'] : '';
                    }
                    //用于卡片翻页
                    let allpk = this.getAllPks(data['treeData']);
                    this.state.allpks = allpk;
                    this.setState(this.state, () => {
                        callback && callback();
                    });

                }
            }
        });
    }

    //清空 维护组织 科目表生效日期 及表格数据
    clear () {
        this.state.listPanel.setDatas([]);
        this.state.listPanel.numberbtn.btns = [];
        this.state.editOrgName = '';
        this.state.refChartVersion.datas = [];
        this.state.refChartVersion.value = '';
        this.setState(this.state);
    }

    routerToCard (callback) { //一个主键不能确定一条数据！！！！！！！
        let paramData = {
            pk_account: this.state.selRecordId, //会计科目基本信息主键
            pk_chart: this.state.refChartVersion.value //科目表生效日期主键
        };

        if (!paramData.pk_account || !paramData.pk_chart) {
            callback && callback();
        }

        if (!this.state.isSelChar) {
            paramData['pk_chart'] = this.state.selectedTreeNode['nodeData']['pk_accchart'];
        }
        ajax({
            url: this.url['accoutCardQuery'],
            data: paramData,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                        this.props.dealFormulamsg(
                            res.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                "formAccount": "form",
                                "account_accass": "cardTable",
                                "account_crlmd": "cardTable"
                            }
                        );
                    }
                    if (data) {
                        //会计科目
                        this.props.form.EmptyAllFormValue(this.areaIds.formAccount);
                        this.props.form.setAllFormValue({[this.areaIds.formAccount]: data[this.areaIds.formAccount][this.areaIds.formAccount]});

                        let cardTableData = {};
                        //辅助核算
                        this.setCardtable(cardTableData, data, this.areaIds.account_accass);

                        this.props.cardTable.setMulTablesData(cardTableData);

                        this.setState({showCard: true});

                        callback && callback();
                    }
                }
            }
        });
    }

    setCardtable (cardTableData, data, areaStr) {
        data[areaStr] && data[areaStr][areaStr]
            ? cardTableData[areaStr] = data[areaStr][areaStr]
            : cardTableData[areaStr] = {rows: []};
    }

    doubleClick () {

    }

    //科目体系变化事件
    onAccSystemChange (value) {
        this.setState(
            {accSystem: value},
            () => {
                this.loadTree();
            }
        );
    }

    //科目表生效日期变化事件
    handleChange (value) {
        //
    }

    //查看科目表或者控制规则点击事件
    onClick () {
        const {form, button, cardTable} = this.props;
        const {createForm} = form;//创建表单，需要引入这个
        const {createCardTable} = cardTable;
        const {createButtonApp} = button;

        const selectedTreeNode = this.props.syncTree.getSelectNode(this.config.systreeId);
        if (selectedTreeNode == null || !selectedTreeNode['nodeData']) {
            this.props['nodeData'] = '';
            return;
        } else {
            let paramData = selectedTreeNode['nodeData']['isChar'] ?
                {pk_accchart: selectedTreeNode['refpk']} : {pk_accctrlrule: selectedTreeNode['refpk']};
            ajax({
                url: selectedTreeNode['nodeData']['isChar'] ? this.url['accsysCharQryAction'] : this.url['accsysRuleQryAction'],
                data: paramData,
                success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                    let {success, data} = res;
                    if (success) {
                        this.props['nodeData'] = data;
                        this.props['nodeData']['isChar'] = selectedTreeNode['nodeData']['isChar'];
                        this.props.modal.show('cmodal', {
                            title: selectedTreeNode['nodeData']['isChar'] ? this.props.config.json['10140ACCSB-000010'] : this.props.config.json['10140ACCSB-000011'], /* 国际化处理： 科目表,科目控制规则*/
                            noFooter: true,
                            userControl: true,
                            content: <Accctrlruleform config={{}} {...this.props}
                                                      ref={(Accctrlruleform) => this.Accctrlruleform = Accctrlruleform}/>,
                            cancelBtnClick: () => {
                                this.props.modal.close('cmodal');
                            }, //取消按钮事件回调

                        });
                    }
                },
                error: (res) => {
                    toast({color: 'danger', content: res.message});
                }
            })
        }
    }

    /**
     * 卡片翻页处理（因平台只支持simpletable。故需手动实现处理）
     * */
    handleCardPagination (key) {
        let record = {};
        let index = 0;
        switch (key) {
            case 'firstItem':
                index = 0;
                break;
            case 'prevItem':
                index = this.state.curIndex - 1;
                break;
            case 'nextItem':
                index = this.state.curIndex + 1;
                break;
            default:
                index = this.state.allpks.length - 1;
                break;
        }
        record.id = this.state.allpks[index];
        this.onClickLinkCode.call(this, record, index);
    }

    render () {
        const {syncTree, form, button, modal, table, DragWidthCom, cardTable} = this.props;
        const {createSyncTree} = syncTree;//创建同步树 需要引入这个
        const {createForm} = form;//创建表单，需要引入这个
        const {createCardTable} = cardTable;
        const {createButtonApp} = button;
        const {createModal} = modal;  //模态框
        var {listPanel, refChartVersion} = this.state;
        var {listtree, numberbtn, classbtn} = listPanel;

        let mainpage =
            <div style={!this.state.showCard ? {display: 'block', marginTop: -10} : {display: 'none'}}>
                <NCDiv areaCode={NCDiv.config.SEARCH} className="search_params nc-theme-area-split-bc">
                    {/* 模态框 */}
                    {createModal('cmodal', {noFooter: false})}
                    <div className="search-item">
                        <div className='refcontainer'>
                            {AccSystemGridRef({
                                fieldid: 'accSystem',
                                refName: this.props.config.json['10140ACCSB-000012'], /* 国际化处理： 科目体系*/
                                placeholder: this.props.config.json['10140ACCSB-000012'], /* 国际化处理： 科目体系*/
                                onChange: this.onAccSystemChange.bind(this),
                                value: this.state.accSystem
                            })}
                        </div>
                    </div>
						
                    <div className="search-item search_params_des nc-theme-common-font-c">
                        {this.props.config.json['10140ACCSB-000014'] /* 国际化处理： 维护组织*/}：
                        <span className='nc-theme-title-font-c'>{this.state.editOrgName}</span>
                    </div>
                    <div className="search-item search_params_des nc-theme-common-font-c">
                        <p>{this.props.config.json['10140ACCSB-000007'] /* 国际化处理： 科目表生效日期*/}：</p>
                        <div>
                            <NCSelect
                                style={{width: 150}}
                                {...refChartVersion}
                                // className='descSelect'
                            >
                                {refChartVersion.renderOption()}
                            </NCSelect>	
                        </div>						
                    </div>
                    <div className="header-button-area">								
                        {createButtonApp({
                            area: 'frameworkCard',
                            onButtonClick: this.onButtonClick.bind(this)
                        })}
                    </div>
				</NCDiv>
                {/* 树卡区域 */}
                <div className="tree-table">
                    <DragWidthCom
                        //左树区域
                        leftDom={
                            <div className="tree-area" style={{position: 'relative', height: 400, overflow: 'auto'}}>
                                <div style={{position: 'absolute', top: 5, right: 10, zIndex: 2,cursor:'pointer'}}
                                     title={this.props.config.json['10140ACCSB-000013']}/* 国际化处理： 详细信息*/
                                     onClick={this.onClick.bind(this)}>
                                    <NCIcon type="uf-listsearch"/>
                                </div>
                                <div style={{zIndex: 1}}>
                                    {createSyncTree({
                                        treeId: this.config.systreeId,
                                        needEdit: false, //不启用编辑
                                        showLine: true, //显示连线
                                        needSearch: false, //是否需要搜索框
                                        onSelectEve: this.onSelectTree.bind(this),//选择
                                        showModal: false
                                    })}
                                </div>
                            </div>}
                        // 右卡片区域
                        rightDom={
                            <div>
                                <div className="table-area">
                                    <div className="" style={{position: 'relative'}}>
                                        <NCDiv areaCode={NCDiv.config.TABS} className='order'>{numberbtn.renderNumberBtn()}</NCDiv>
                                        <NCDiv fieldid="cn_accsys" areaCode={NCDiv.config.TableCom} style={{width: '100%'}} className='structuralcard'>
                                            <NCTable className='table-tit'
                                                     {...listPanel.listtree}
                                                     data={classbtn.filterData(listPanel.datas)}
                                                     expandedRowKeys={[...numberbtn.expandedRowKeys, ...listtree.expandedRowKeys]}>
                                            </NCTable>
                                        </NCDiv>
                                    </div>
                                </div>
                            </div>}
                        // 默认左侧区域宽度，px/百分百
                        defLeftWid='25%'
                    />
                </div>
            </div>;
        let cardpage =
            <div style={{display: this.state.showCard ? 'block' : 'none'}} id='nc-bill-card'>
                <div className="nc-bill-card">
                    <NCAffix>
                        <div className='nc-bill-header-area' style={{position: 'relative'}}>
                            <div className='header-title-search-area'>
                                <NCBackBtn
                                    className='title-search-detail'
                                    filedid="back"
                                    onClick={this.onButtonClick.bind(this, this.props, 'back')}
                                />
                                {/* <h2 className='title-search-detail'>会计科目详情</h2> */}
                            </div>
                            {/* <div style={{position: 'absolute', right: 130,top:12}}>
                                {createButtonApp({
                                    area: 'accsysCardRefresh',//按钮注册中的按钮区域  fRefresh
                                    onButtonClick: this.onButtonClick.bind(this)
                                })}
                            </div> */}
                            <div className={`show cardPagination-lightapp-component`}
                                 style={{position: 'absolute', right: 0,top:12}}>
                                <NCButton
                                    disabled={this.state.isFirst ? true : false}
                                    filedid="firstitem"
                                    className={`${this.state.isFirst ? 'disable' : ''} first-item cardPaginationBtn`}
                                    onClick={this.handleCardPagination.bind(this, 'firstItem')}
                                >
                                    <span className='icon iconfont icon-shangyiye'/>
                                </NCButton>
                                <NCButton
                                    disabled={this.state.isFirst ? true : false}
                                    filedid="preitem"
                                    className={`${this.state.isFirst ? 'disable' : ''} item cardPaginationBtn`}
                                    onClick={this.handleCardPagination.bind(this, 'prevItem')}
                                >
                                    <span className='icon iconfont icon-jiantouzuo'/>
                                </NCButton>
                                <NCButton
                                    disabled={this.state.isEnd ? true : false}
                                    filedid="nextitem"
                                    className={`${this.state.isEnd ? 'disable' : ''} item cardPaginationBtn`}
                                    onClick={this.handleCardPagination.bind(this, 'nextItem')}
                                >
                                    <span className='icon iconfont icon-jiantouyou'/>
                                </NCButton>
                                <NCButton
                                    disabled={this.state.isEnd ? true : false}
                                    filedid="finalitem"
                                    className={`${this.state.isEnd ? 'disable' : ''} last-item cardPaginationBtn`}
                                    onClick={this.handleCardPagination.bind(this, 'finalItem')}
                                >
                                    <span className='icon iconfont icon-xiayiye'/>
                                </NCButton>
                            </div>
                        </div>
                    </NCAffix>
                    <div className="nc-bill-form-area">
                        {createForm(this.areaIds.formAccount, {})}
                    </div>
                    <div className="nc-bill-table-area">
                        {createCardTable(this.areaIds.account_accass, {
                            showIndex: true,
                            tableHead: () => {
                                return '';
                            }
                        })}
                    </div>
                    <div className="nc-bill-table-area">
                        {createCardTable(this.areaIds.account_crlmd, {
                            showIndex: true,
                            tableHead: () => {
                                return '';
                            }
                        })}
                    </div>
                </div>
            </div>;
        return (
            <div className='cn_accsysqrytree'>
                {mainpage}
                {cardpage}
            </div>
        );
    }
}

export default List;

//QNde+07VgUTpSo0I3NzUFUuB53GEfpJZ5q9xZvyoMyEYAjR5SGuMEZ6W2N6VIVc/