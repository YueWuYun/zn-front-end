//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { base, promptBox, ajax, toast } from 'nc-lightapp-front'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Transfer from '../../../public/excomponents/ScaTransfer';
import AccChartTreeRef from '../../../../uapbd/refer/fiacc/AccChartTreeRef';//科目表参照
import FactorChartTreeRef from '../../../../uapbd/refer/fiacc/FactorChartTreeRef';//要素表参照
import CostTypeGridRef from '../../../../uapbd/refer/fiacc/CostTypeGridRef';//费用类型参照
import './index.less'
let { NCButton, NCModal, NCStep, NCRadio, NCTable, NCSelect, NCCheckbox, NCFormControl } = base;
const NCOption = NCSelect.NCOption;
let ajaxUrl = {
    steptwo: '/nccloud/uapbd/factor/newAccImportStepTwoAction.do',
    onOKurl: '/nccloud/uapbd/factor/newAccImportSaveAction.do',
    movecheck: '/nccloud/uapbd/factor/newAccImportLToRCheckAction.do',
    getTransferTree: '/nccloud/uapbd/factor/newAccImportLoadTreeAction.do'
}

class NewAccImportModal extends Component {
    constructor(props) {
        super(props)
        this.config = {}
        this.state = {
            json: this.props.json,
            myModal: {
                modalDropup: true,
                size: 'lg',
                backdrop: true / false,//是否弹出遮罩层/点击遮罩层是否触发关闭事件
            },
            step: { //步骤
                current: 0,
                stepCount: 2   //控制步骤数
            },
            oprType: '1',  //穿梭树节点移动方式，默认仅自己
            accChart: {},
            bookTransfer: {},
            allTreeData: [],//数表全部数据
            rightTreeData: [],//右移数据
            selectval: '0',//单选默认值
            factorChart: {},
            table: {
                main: this,
                rowKey: 'id',
                scroll: { y: 390, x: false },
                columns: []
            },
            tableDatas: [],
            optionDatas: [],
            lettable: [],//第二步左侧表格数据
            rightsel: [],//第二步右侧下拉数据
            iscanselect: false,
            facselectval: '',
            factortype: [0, 0, 0],//要素类型
            liabilityattr: [0, -1, -1],//会计属性
            combinedetail: false,//合并明细
            workfactor: false,//作业要素
            expenseclass:null,//费用习性
            feetype:null,//成本费用类型
            costfeetype:null,//项目成本费用类型
            incomeexpenses:null,//收支属性
            costTypeGridRef: {},
        }
    }
    //第一步切换到第二步效验事件
    firsttosecond(props) {
        if (!(this.state.factorChart && this.state.factorChart.refpk)) {
            toast({ color: 'warning', content: this.state.json['10140ETB-000070'] })//"没有选择要素表"
            return false;
        }
        if (!(this.state.accChart && this.state.accChart.refpk)) {
            toast({ color: 'warning', content: this.state.json['10140ETB-000071'] })//"没有选择科目表"
            return false;
        }
        let righttreedata = this.state.bookTransfer.getData();
        if (!(righttreedata && righttreedata.length > 0)) {
            toast({ color: 'warning', content: this.state.json['10140ETB-000077'] })//"科目表并未向要素表中导入数据！"
            return false;
        }
        return true;
    }
    //接收到新的props更新state
    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.json).length !== 0) {
            this.setState({
                json: nextProps.json
            });
        }
        if (nextProps.conf) {
            let step = this.state.step
            step.stepCount = 2;
            this.config = {};
            this.setState({
                step: step
            })
        }
    }
    //点击取消按钮关闭模态框
    modalCancelClick() {
        promptBox({
            color: 'warning',
            title: this.state.json['10140ETB-000020'], //确认取消
            content: this.state.json['10140ETB-000021'], //是否确定要取消
            beSureBtnClick: () => {
                let step = this.state.step
                step.current = 0;
                this.setState({
                    step: step
                }, () => {
                    this.props.hideModal(false)
                })

            }
        })
    }
    //步骤切换
    onStep(offset) {
        let step = this.state.step
        if (offset > 0) {
            if (this.firsttosecond(this.props)) {
                step.current = step.current + offset
                this.setState({
                    step: step,
                    rightTreeData: this.state.bookTransfer.getData(),
                    facselectval: this.state.optionDatas[0] ? this.state.optionDatas[0].pk_elementtype : ''
                }, () => {
                    this.seconddatas();
                })
            }
        } else {
            step.current = step.current + offset;
            this.setState({
                step: step
            }, () => {
                this.state.bookTransfer.reset(this.state.allTreeData);
                this.state.rightTreeData.forEach(node => {
                    this.state.bookTransfer.state.treeWapper.moveRight(node.key);
                });
            })
        }
    }

    //渲染步骤条
    renderSteps() {
        return <NCStep.NCSteps {...this.state.step} style={{ marginBottom: '10px' }}>
            <NCStep title={this.state.json['10140ETB-000056']}
            />
            {/* description={this.state.json['10140ETB-000056']/*选择会计科目  */}
            <NCStep title={this.state.json['10140ETB-000057']}
            />
        </NCStep.NCSteps>
    }

    //-----------------起始页面方法------------------------
    //组建树数据结构
    buildTree = (data, id, pid) => {
        if (!data || data.length == 0) {
            return data;
        }
        var treeList = data.slice(0);
        var afun = function (ys, json) {
            var len = json.length;
            while (len > 0) {
                len--;
                let oo = json[len];
                if (ys[id] == oo[pid]) {
                    ys.children = ys.children || [];
                    ys.children.push(oo);
                    json.splice(len, 1);
                }
            }
        };
        data.forEach(function (value) {
            afun(value, treeList);
        });
        return treeList;
    };

    //加载穿梭树左树数据
    loadTreeData(pk_accchart) {
        ajax({
            url: ajaxUrl.getTransferTree,
            data: { pk_accchart: pk_accchart },
            success: (res) => {
                if (res.data) {
                    this.state.allTreeData = this.buildTree(res.data, 'key', 'pid');
                    setTimeout(() => {
                        this.state.bookTransfer.setRootTitle(this.state.json['10140ETB-000063'])
                        this.state.bookTransfer.reset(this.state.allTreeData)
                    }, 0)
                } else {
                    setTimeout(() => {
                        this.state.bookTransfer.reset([])
                    }, 0)
                }
            }
        })


    }
    //来源科目表变动事件
    onNewAccChange(e) {
        this.setState({
            accChart: e
        }, () => {
            this.loadTreeData(e.refpk);
        });
    }
    oncostType(e) {
        this.setState({
            costTypeGridRef: e
        });
    }
    
    //目的要素表变动事件
    onFacChange(e) {
        this.setState({
            factorChart: e
        });
    }
    //右移编辑前事件   
    onBeforeEvent(transferkey, lefgttdata, rightdata, selectdatas) {
        //右侧移回左侧，不进行效验,修改移动规则，包含子级
        if (transferkey.indexOf("2l") != -1) {
            this.state.bookTransfer.setMoveType('0')
            return true;
        } else {
            //右移时，移动规则为包含父级
            this.state.bookTransfer.setMoveType('4')
            // this.state.bookTransfer.state.moveType.incParent = true;
            // this.state.bookTransfer.state.moveType.incChild = false;
            // this.state.bookTransfer.state.moveType.incSelf = true;
            // this.state.bookTransfer.state.moveType.isAllChild = false;
            // this.state.bookTransfer.state.moveType.isOnlyLeaf = false;
            // this.state.bookTransfer.setState(this.state.bookTransfer.state);
        }
        //效验左侧数据是否可以移到右侧
        if (!(this.state.factorChart && this.state.factorChart.refpk)) {
            toast({ color: 'warning', content: this.state.json['10140ETB-000070'] })//"没有选择要素表"
            return false;
        }
        if (!(this.state.accChart && this.state.accChart.refpk)) {
            toast({ color: 'warning', content: this.state.json['10140ETB-000071'] })//"没有选择科目表"
            return false;
        }
        if (transferkey.indexOf("all_") == -1 && (!selectdatas || selectdatas.length == 0)) {
            // toast({ color: 'warning', content: "操作有误，左侧树数据没有选中" })
            return false;
        }
        let canmove = false;
        if (transferkey.indexOf("l2r") != -1) {
            let keys = selectdatas;
            if (transferkey.indexOf("all_") != -1) {
                keys = [];
                lefgttdata.forEach((leftd) => {
                    keys.push(leftd.key);
                });
            }
            ajax({
                url: ajaxUrl.movecheck,
                async: false,//同步
                data: {
                    pk_accchart: this.state.accChart.refpk,
                    pk_facchart: this.state.factorChart.refpk,
                    ltorkeys: keys
                },
                success: (res) => {
                    canmove = res.data;
                }
            })
        }
        return canmove;
    }
    //-----------------------起始页面方法结束-------------------------------


    //渲染起始页
    renderAccImportStart() {
        let divcss1 = {
            width: '50%', float: "left"
        }
        let divcss2 = {
            width: '20%', float: "left"
        }
        let divcss3 = {
            width: '70%', float: "left"
        }
        return (
            <div style={{ height: '450px' }}>
                {/* 科目表 */}
                <div style={divcss1}>
                    <div style={divcss2}>
                        <span>
                            {this.state.json["10140ETB-000075"]}
                        </span>
                    </div>
                    <div style={divcss3}>
                        {AccChartTreeRef({      //参照-科目表
                            value: this.state.accChart,
                            queryCondition: () => {
                                return {
                                    TreeRefActionExt: 'nccloud.web.uapbd.factor.action.RefCondAccChart'
                                };
                            },
                            onChange: (val) => {
                                this.onNewAccChange(val);
                            }
                        })}
                    </div>
                </div>
                {/* 要素表 */}
                <div style={divcss1}>
                    <div style={divcss2}>
                        <span>
                            {this.state.json["10140ETB-000076"]}
                        </span>
                    </div>
                    <div style={divcss3}>
                        {FactorChartTreeRef({      //参照-要素表
                            value: this.state.factorChart,
                            queryCondition: () => {
                                return {
                                    AppCode: this.props.config.appcode,
                                    pkOrg: this.props.unitTreeRef.value ? this.props.unitTreeRef.value.refpk : '',
                                    TreeRefActionExt: 'nccloud.web.uapbd.factor.util.FactorChartTreeRefExt'
                                };
                            },
                            onChange: (val) => {
                                this.onFacChange(val);
                            }
                        })}
                    </div>
                </div>
                <Transfer
                    ref={(item) => {
                        if (item) {
                            this.state.bookTransfer = item
                        }
                    }}
                    onBeforeEvent={this.onBeforeEvent.bind(this)}
                    showSearch={true}
                    lang={
                        {
                            leftTreeName: this.state.json === undefined ? "" : this.state.json['10140ETB-000068']/* 国际化处理： 待选科目*/,
                            rightTreeName:
                                this.state.json === undefined ? "" : this.state.json['10140ETB-000069']/* 国际化处理： 已选科目*/

                        }
                    }
                />
            </div>
        )
    }

    //----------------------第二页方法------------------------------
    //加载第二步页面数据
    seconddatas() {
        ajax({
            url: ajaxUrl.steptwo,
            async: false,//同步
            data: {
                pk_accchart: this.state.accChart.refpk,
                pk_facchart: this.state.factorChart.refpk
            },
            success: (res) => {
                if (res.data) {
                    this.setState({
                        optionDatas: res.data.fac,
                        tableDatas: res.data.acc
                    }, () => {
                        this.state.tableDatas.forEach((da) => {
                            this.state.lettable.push('');
                            this.state.rightsel.push('');
                        });
                    });
                }
            }
        })

    }
    //确定按钮事件
    onOK(flag) {
        let accvoids = [];
        if (this.state.rightTreeData && this.state.rightTreeData.length > 0) {
            this.state.rightTreeData.forEach((rda) => {
                accvoids.push(rda.id);
            });
        }
        //变动map型数据，在前台不便于组装，直接返回数据到后台进行重新组装
        let edittabledatas = {
            transferkey: !this.state.iscanselect ? null : this.state.facselectval,
            transfername: !this.state.iscanselect ? null : this.state.facselectval,
            tableorcombo: false,
            lefttabledata: !this.state.iscanselect ? this.state.lettable : null,
            rightselectdata: !this.state.iscanselect ? this.state.rightsel : null,
            combinedetail: this.state.combinedetail,
            workfactor: this.state.workfactor,
            factypevos: this.state.optionDatas,
            factortype: this.state.factortype,
            acctypevos: this.state.tableDatas,
            liabilityattr: this.state.liabilityattr,
            pk_accchart: this.state.accChart.refpk,
            pk_factorchart: this.state.factorChart.refpk,
            expenseclass:this.state.expenseclass,//费用习性
            feetype:this.state.feetype,//成本费用类型
            costfeetype:this.state.costfeetype,//项目成本费用类型
            incomeexpenses:this.state.incomeexpenses,//收支属性
            costTypeGridRef: this.state.costTypeGridRef?this.state.costTypeGridRef.refpk:null,
            accvos: accvoids
        }
        ajax({
            url: ajaxUrl.onOKurl,
            data: edittabledatas,
            success: (res) => {
                let step = this.state.step
                step.current = 0;
                if (flag && flag == 'end') {
                    this.props.hideModal(false);
                }
                this.setState({
                    step: step
                }, () => {
                    this.state.bookTransfer.reset(this.state.allTreeData);
                    this.state.rightTreeData.forEach(node => {
                        this.state.bookTransfer.state.treeWapper.moveRight(node.key);
                    });
                    this.props.refresh();
                });
            }
        })
    }
    //单选编辑后事件
    handleOprTypeChange(value) {
        if (value && value == "0") {
            this.setState({
                iscanselect: false,
                selectval: value
            });
        } else {
            this.setState({
                iscanselect: true,
                selectval: value
            });
        }

    }
    //要素类型名称变化事件
    onaccselectChange(text, record, index, val) {
        if (this && this.state) {
            if (this.state.lettable[index] == '') {
                this.state.lettable[index] = record.pk_acctype;
            }
            this.state.rightsel[index] = val;
        }
    }

    //要素类型变化事件
    onfacselectChange(val) {
        this.setState({
            facselectval: val
        });

    }
    //要素类型区域下拉编辑后事件
    onfactypeselectChange1(val) {
        this.setState({
            factortype: [val, this.state.factortype[1], this.state.factortype[2]]
        });
    }
    onfactypeselectChange2(val) {
        this.setState({
            factortype: [this.state.factortype[0], val, this.state.factortype[2]]
        });
    }
    onfactypeselectChange3(val) {
        this.setState({
            factortype: [this.state.factortype[0], this.state.factortype[1], val]
        });
    }
    //利润中心会计属性区域下拉编辑后事件
    onresaselectChange1(val) {
        this.setState({
            liabilityattr: [val, this.state.liabilityattr[1], this.state.liabilityattr[2]]
        });
    }
    onresaselectChange2(val) {
        this.setState({
            liabilityattr: [this.state.liabilityattr[0], val, this.state.liabilityattr[2]]
        });
    }
    onresaselectChange3(val) {
        this.setState({
            liabilityattr: [this.state.liabilityattr[0], this.state.liabilityattr[1], val]
        });
    }
    //新开发赋值
    expenseclassChange(val) {
        this.setState({
            expenseclass: val
        });
    }
    feetypeChange(val) {
        this.setState({
            feetype: val
        });
    }
    costfeetypeChange(val) {
        this.setState({
            costfeetype: val
        });
    }
    incomeexpensesChange(val) {
        this.setState({
            incomeexpenses: val
        });
    }

    //多选框区域
    //作业要素
    onShowDisable1(val) {
        this.setState({
            workfactor: val
        });
    }
    //合并明细
    onShowDisable2(val) {
        this.setState({
            combinedetail: val
        });
    }
    //----------------------第二页方法结束-----------------------
    //渲染第二页
    renderSecondTabs() {
        let _this = this;
        let columns = [{
            title: this.state.json['10140ETB-000101'],//'序号'
            dataIndex: 'index',
            width: '10%',
            key: "index",
            render(text, record, index) {
                return (
                    <span>
                        {index + 1}
                    </span>
                );
            }
        }, {
            title: this.state.json['10140ETB-000078'],//'科目类型名称'
            dataIndex: 'name',
            width: '40%'
        }, {
            title: this.state.json['10140ETB-000079'],//'要素类型名称'
            dataIndex: "eletypename",
            key: "opr",
            width: '40%',
            fixed: "right",
            itemtype: 'customer',
            className: 'table-opr',
            render(text, record, index) {
                return (
                    <div>
                        <NCSelect
                            fieldid={'accselect' + index}
                            defaultValue={''}
                            disabled={_this.state.iscanselect}
                            onChange={_this.onaccselectChange.bind(_this, text, record, index)}
                        >
                            {_this.state.optionDatas && _this.state.optionDatas.map((item, index) => {
                                return <NCOption fieldid={`accoption${index}`} value={item.pk_elementtype} key={index}>{item.eletypename}</NCOption>
                            })}
                        </NCSelect>

                    </div>
                )
            }
        }];
        let facdefaultValue = this.state.optionDatas[0] ? this.state.optionDatas[0].pk_elementtype : '';
        let factypeoptions = [{
            display: this.state.json['10140ETB-000078'],//'同科目'
            value: 0
        }, {
            display: this.state.json['10140ETB-000041'],//'是'
            value: 1
        }, {
            display: this.state.json['10140ETB-000042'],//'否'
            value: 2
        }];
        let chargetypeoption = [{
            display: '',
            value: 0
        }, {
            display: this.state.json['10140ETB-000081'],//'材料费'
            value: 1
        }, {
            display: this.state.json['10140ETB-000082'],//'人工费'
            value: 2
        }, {
            display: this.state.json['10140ETB-000083'],//'制造费用'
            value: 3
        }, {
            display: this.state.json['10140ETB-000084'],//'辅助费'
            value: 4
        }, {
            display: this.state.json['10140ETB-000085'],//'外包费'
            value: 5
        }, {
            display: this.state.json['10140ETB-000086'],//'管理费用'
            value: 6
        },{
            display: '其他',//'管理费用'
            value: 7
        }];
        let costfeetypeoption = [{
            display: '',
            value: 0
        }, {
            display: this.state.json['10140ETB-000081'],//'材料费'
            value: 1
        }, {
            display: this.state.json['10140ETB-000082'],//'人工费'
            value: 2
        }, {
            display: '间接费',//'制造费用'
            value: 3
        }, {
            display: this.state.json['10140ETB-000085'],//'外包费'
            value: 4
        }, {
            display: '预提费',//'外包费'
            value: 5
        }, {
            display: '待摊费',//'管理费用'
            value: 6
        },{
            display: '机械费',//'管理费用'
            value: 7
        },{
            display: this.state.json['10140ETB-000084'],//'辅助费'
            value: 8
        },];
        let chargetaxoption = [{
            display: this.state.json['10140ETB-000087'],//'固定'
            value: 0
        }, {
            display: this.state.json['10140ETB-000088'],//'变动'
            value: 1
        }];
        //收支属性下拉
        let comeexpensesoption = [{
            display: null,
            value: null
        }, {
            display: '收入',//'固定'
            value: 1
        }, {
            display: '支出',//'变动'
            value: 2
        }];
        let cmfacoption = [{
            display: '',
            value: -1
        }, {
            display: this.state.json['10140ETB-000089'],//'初级'
            value: 0
        }, {
            display: this.state.json['10140ETB-000090'],//'次级'
            value: 1
        }];
        let divcss1 = {
            width: '60%'
        }
        let divcss2 = {
            width: '33%', float: "left", textAlign: 'left', lineHeight: '30px', margin: '0,10px,0,10px'
        }
        let divcss3 = {
            width: '60%', float: "right"
        }
        let divcss4 = {
            width: '20%', float: "left"
        }
        let divcss5 = {
            width: '33%', float: "left"
        }
        let spancss1 = {
            margin: '10px'
        }
        return (
            <div style={{ height: '450px' }} >
                <div className="container">
                    <div style={divcss2}>
                        <span style={spancss1}>{this.state.json['10140ETB-000097']}</span>{/**'费用习性'*/}
                        <div style={divcss3}>
                            <NCSelect
                                fieldid='resaselect2'
                                defaultValue={''}
                                value={this.state.expenseclass}
                                onChange={this.expenseclassChange.bind(this)}
                            >
                                {chargetaxoption && chargetaxoption.map((item, index) => {
                                    return <NCOption fieldid={`resaoption2${index}`} value={item.value} key={index}>{item.display}</NCOption>
                                })}
                            </NCSelect>
                        </div>
                    </div>
                    <div style={divcss2}>
                        <span style={spancss1}>{this.state.json['10140ETB-000096']}</span>{/**'费用类型'*/}
                        <div style={divcss3}>
                            {CostTypeGridRef({      //参照-费用类型
                                value: this.state.costTypeGridRef,
                                queryCondition: () => {
                                    return {
                                        // TreeRefActionExt: 'nccloud.web.uapbd.factor.action.RefCondAccChart'
                                    };
                                },
                                onChange: (val) => {
                                    this.oncostType(val);
                                }
                            })}
                        </div>
                    </div>
                </div>

                <div  className="line_conainer">
                    <div>
                        <span>{'成本要素属性'}</span>{/**'要素类型' */}
                    </div>

                    <div className='child_container'>
                        <div style={divcss2}>
                            <span style={spancss1}>{'成本费用类型'}</span>
                            <div style={divcss3}>
                                <NCSelect
                                    fieldid='resaselect1'
                                    defaultValue={''}
                                    value={this.state.feetype}
                                    onChange={this.feetypeChange.bind(this)}
                                >
                                    {chargetypeoption && chargetypeoption.map((item, index) => {
                                        return <NCOption fieldid={`resaoption1${index}`} value={item.value} key={index}>{item.display}</NCOption>
                                    })}
                                </NCSelect>
                            </div>
                        </div>
                        <div style={divcss4}>
                            <NCCheckbox
                                fieldid='resaceckbox1'
                                onChange={this.onShowDisable1.bind(this)}
                                checked={this.state.workfactor}>
                                {this.state.json['10140ETB-000099']}{/* 国际化处理： 作业要素*/}
                            </NCCheckbox>
                        </div>
                        <div style={divcss4}>
                            <NCCheckbox
                                fieldid='resaceckbox2'
                                onChange={this.onShowDisable2.bind(this)}
                                checked={this.state.combinedetail}>
                                {this.state.json['10140ETB-000100']}{/* 国际化处理： 合并明细*/}
                            </NCCheckbox>
                        </div>
                    </div>
                </div>


                <div  className="line_conainer">
                    <div>
                        <span>{'项目成本要素属性'}</span>{/**'利润中心会计属性'*/}
                    </div>
                    <div className='child_container'>
                        <span style={spancss1}>{'项目成本费用类型'}</span>
                        <div style={divcss5}>
                            <NCSelect
                                fieldid='resaselect1'
                                defaultValue={''}
                                value={this.state.costfeetype}
                                onChange={this.costfeetypeChange.bind(this)}
                            >
                                {costfeetypeoption && costfeetypeoption.map((item, index) => {
                                    return <NCOption fieldid={`resaoption1${index}`} value={item.value} key={index}>{item.display}</NCOption>
                                })}
                            </NCSelect>
                        </div>
                        <span style={spancss1}>{'收支属性'}</span>
                        <div style={divcss5}>
                            <NCSelect
                                fieldid='resaselect2'
                                defaultValue={''}
                                value={this.state.incomeexpenses}
                                onChange={this.incomeexpensesChange.bind(this)}
                            >
                                {comeexpensesoption && comeexpensesoption.map((item, index) => {
                                    return <NCOption fieldid={`resaoption1${index}`} value={item.value} key={index}>{item.display}</NCOption>
                                })}
                            </NCSelect>
                        </div>
                    </div>
                    <div style={{ height: '10%' }} ></div>
                </div>

            </div>
        )
    }
    //按钮控制
    buttoncontro() {
        if (this.state.step.current == 1) {
            return (
                <span><NCButton
                    onClick={this.onOK.bind(this, 'continue')}
                    fieldid={"btn5th"}>{this.state.json['10140ETB-000074']}</NCButton></span>
            )
        } else {
            return (
                <span><NCButton
                    onClick={this.onStep.bind(this, 1)}
                    fieldid={"btnTwo"}>{this.state.json['10140ETB-000059']}</NCButton></span>
            )
        }



    }
    render() {
        return (
            <NCModal {...this.state.myModal} show={this.props.conf.show} onHide={this.modalCancelClick.bind(this)}
                fieldid={"newAccImportstep"}>
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{this.state.json['10140ETB-000057'] /*  设置属性*/}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    {this.renderSteps()}
                    {this.state.step.current == 0 && this.renderAccImportStart()}
                    {this.state.step.current == 1 && this.renderSecondTabs()}
                </NCModal.Body>
                <NCModal.Footer>
                    <span><NCButton
                        disabled={this.state.step.current == 0}
                        onClick={this.onStep.bind(this, -1)}
                        fieldid={"btnOne"}>{this.state.json['10140ETB-000058']}</NCButton></span>{/* 国际化处理： 上一步*/}
                    {
                        this.buttoncontro()
                    }
                    <span><NCButton
                        disabled={this.state.step.current == 0}
                        onClick={this.onOK.bind(this, 'end')}
                        fieldid={"btn3rd"}>{this.state.json['10140ETB-000060']}</NCButton></span>{/* 国际化处理： 完成*/}
                    <span><NCButton
                        onClick={this.modalCancelClick.bind(this)}
                        fieldid={"btn4th"}>{this.state.json['10140ETB-000061']}</NCButton></span>{/* 国际化处理： 取消*/}
                </NCModal.Footer>
            </NCModal>
        )
    }
}

export default NewAccImportModal
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65