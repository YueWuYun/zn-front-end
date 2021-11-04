//DmR57rzXMxNiyqM2pakwj8kHl8hMfgofl74tyedocwixTKUZfo+98VpQWV8bVVN4
import React, {Component} from 'react';
import {
    createPage,
    ajax,
    base,
    toast,
    cardCache,
    high,
    promptBox
} from 'nc-lightapp-front';
import createUIDom from '../../../public/utils/BDCreateUIDom';

import {initTemplate, buttonClick, onClickSearchBtn} from './events';
import Utils from '../../../public/utils'
import Orgunitversion from '../../orgunit/version';
import './index.less'
import '../../../public/uapbdstyle/uapbd_style_common.less'
//解决IE11小应用打开报错的问题
document.documentElement.focus();
let {setDefData, getDefData} = cardCache;
const {NCCheckbox} = base;
//const {Item} = NCMenu;
const {NCUploader, PrintOutput} = high; // 从 高阶组件引入NCUploader。

let ajaxurl = {
    queryPage: '/nccloud/uapbd/org/querypage.do'
}

class Orgunittable extends Component {
    constructor(props) {
        super(props);
        // let queryInfo = this.props.search.getQueryInfo(props.config.searchId) let OID
        // = queryInfo.oid
        this.state = {
            showlogoUploader: false,
            showUploader: false,
            json: {},
            inlt: null,
            showOffDisable: true,
            checked: false, //判断 显示停用按钮是否选中
            pks: [],
            oid: '0001Z010000000005YAD',
            searchValue: '',
            checkValue: 'false'
        }
        this.config = props.config;
        this.onrefresh = this
            .onrefresh
            .bind(this);
        this.defaultloaddata = this
            .defaultloaddata
            .bind(this);
        this.dealTreeData = this
            .dealTreeData
            .bind(this);
    }

    componentDidUpdate() {
        let urlstatus = this
            .props
            .getUrlParam('status')
        //组织主管
        let orgmanagerstatus = this
            .props
            .editTable
            .getStatus('orgmanager');
        //业务期间
        let orgmoduleperiodstatus = this
            .props
            .editTable
            .getStatus('orgmoduleperiod');
        //内部客商
        let innercustsuppstatus = this
            .props
            .form
            .getFormStatus('innercustsupp');
        //维护vat
        let orgvatfunclet = this
            .props
            .editTable
            .getStatus('orgvatfunclet');

        if ((orgmanagerstatus == undefined || orgmanagerstatus == 'browse') && (orgmoduleperiodstatus == undefined || orgmoduleperiodstatus == 'browse') && (innercustsuppstatus == undefined || innercustsuppstatus == 'browse') && (orgvatfunclet == undefined || orgvatfunclet == 'browse')) {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => { //编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                // intemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处，
                // 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.setState({json, inlt}) // 保存json和inlt到页面state中并刷新页面
                this.props.config.josn = this.state.json;
                initTemplate(this.props, this.defaultloaddata);
            } else {
                console.log('未加载到多语资源') // 未请求到多语资源的后续操作
            }

        }
        this
            .props
            .MultiInit
            .getMultiLang({moduleId: '10100ORG', domainName: 'uapbd', callback})

        //initTemplate(this.props);

    }
    componentDidMount() {
        // initTemplate(this.props,this.onrefresh) this.onrefresh(); let checkflag =
        // cacheTools.get('checkflag'); let searchVal = cacheTools.get('searchVal'); if(
        // typeof (searchVal) =='undefined' || !searchVal){     let conditions = [];
        // conditions.push({display:'启用状态',field:'enablestate',oprtype:'=',value:{firstv
        // alue:'2',secondvalue:null}});     searchVal = {conditions}; } if( typeof
        // (searchVal) !=='undefined'&&searchVal&&searchVal.conditions){     //
        // this.props.search.setSearchValue(this.config.searchId,searchVal.conditions);
        //    //let pageInfo =this.props.table.getTablePageInfo(this.config.gridId);
        // //如果没有勾选显示停用，查询条件里面的enablestate = '2' 只显示启用     if(!checkflag){
        // searchVal.conditions.push({display:'启用状态',field:'enablestate',oprtype:'=',valu
        // e:{firstvalue:'2',secondvalue:null}});     }     let paramdata2 = {
        // conditions:searchVal.conditions,         pagecode:this.config.pagecode,
        //   pageInfo:{},         queryAreaCode:this.config.searchId,
        // oprtype:'and',         queryType:'simple',         oid:this.config.oid     };
        //     this.loadGridData(paramdata2) }

    }

    defaultloaddata() {
        //默认不加载数据
        this
            .props
            .treeTableManyCol
            .initTreeTableData(this.props.config.gridId, [], 'refpk');
        let searchVal = getDefData('orgunit_searchVal', this.config.datasource);
        if (typeof(searchVal) !== 'undefined' && searchVal && searchVal.conditions) {
            this.onrefresh();
        }
    }

    onrefresh() {

        let checkflag = getDefData('orgunit_checkflag', this.config.datasource); //cacheTools.get('orgunit_checkflag');
        let searchVal = getDefData('orgunit_searchVal', this.config.datasource); //cacheTools.get('orgunit_searchVal');
        // let listdata = getDefData('orgunit_listdata',
        // this.config.datasource);//cacheTools.get('orgunit_searchVal'); let changeflag
        // = getDefData('orgunit_changelistdataflag',
        // this.config.datasource);//cacheTools.get('orgunit_searchVal'); if(changeflag
        // != undefined && !changeflag){     let datas =
        // this.props.treeTableManyCol.createNewData(listdata.orglist.rows);
        // //cacheTools.set('orgunit_allpkorg',allpkorg);     //根据树状表的数据构造树表
        // Utils.convertGridEnablestate(listdata.orglist.rows,"enablestate");
        // this.props.treeTableManyCol.initTreeTableData(this.props.config.gridId,datas,'
        // refpk',true);     //加载完数据之后，默认把根节点那一层展开     //控制按钮（没选中行按钮不可用）
        // setTimeout(() =>{         this.toggleShow();
        // this.props.treeTableManyCol.openRow(this.props.config.gridId, datas[0].key );
        //     },0);     return ; } let pk_group= this.props.getUrlParam('pk_group');
        let conditions = [];
        let custcondition = {};
        if (typeof(searchVal) == 'undefined' || !searchVal) {

            conditions.push({
                display: this.state.json['10100ORG-000090'],
                field: 'enablestate',
                oprtype: '=',
                value: {
                    firstvalue: '2',
                    secondvalue: null
                }
            });/* 国际化处理： 启用状态*/
            searchVal = {
                conditions,
                logic: 'and'
            };
        }

        if (typeof(searchVal) !== 'undefined' && searchVal && searchVal.conditions) {

            // this.props.search.setSearchValue(this.config.searchId,searchVal.conditions);
            // let pageInfo =this.props.table.getTablePageInfo(this.config.gridId);
            // 如果没有勾选显示停用，查询条件里面的enablestate = '2' 只显示启用
            if (!checkflag) {
                conditions.push({
                    display: this.state.json['10100ORG-000090'],
                    field: 'enablestate',
                    oprtype: '=',
                    value: {
                        firstvalue: '2',
                        secondvalue: null
                    }
                });/* 国际化处理： 启用状态*/
                custcondition = {
                    conditions,
                    logic: 'and'
                };
            }

            let paramData2 = {
                querycondition: searchVal,
                // custcondition:{     conditions:[{         field:'pk_group',         value:{
                //           firstvalue:null         },         oprtype:'='     }] },
                custcondition: custcondition,
                pagecode: this.config.pagecode,
                queryAreaCode: this.config.searchId,
                pageInfo: {},
                querytype: 'tree',
                oid: getDefData('orgunit_searchoid', this.config.datasource) //cacheTools.get('orgunit_searchoid')
            };
            this
                .props
                .treeTableManyCol
                .initTreeTableData(this.props.config.gridId, [], 'refpk');
            //加载数据
            this.loadGridData(paramData2);
        }
    }

    dealTreeData(data) {
        let pks = [];
        let deleteDataChildrenProp = function (node) {
            pks.push(node.values.pk_org.value);
            node.iconBox = {
                delIcon: true,
                editIcon: true,
                addIcon: true
            }
            if (!node.children || node.children.length == 0) {
                delete node.children;
            } else {
                node.isLeaf = false;
                node
                    .children
                    .forEach((e) => {
                        deleteDataChildrenProp(e);
                    });
            }
        };
        data.forEach((e) => {
            e.iconBox = {
                delIcon: true,
                editIcon: true,
                addIcon: true
            }
            deleteDataChildrenProp(e);
        });
        return pks;
    }

    //加载列表数据
    loadGridData = (paramData) => {
        let that = this;
        ajax({
            url: ajaxurl.queryPage,
            data: paramData,
            success: function (res) {
                if (res.success) {
                    if (res.data) {
                        //后台返回的是表格的数据  需要构造成树状表的数据
                        let datas = that
                            .props
                            .treeTableManyCol
                            .createNewData(res.data.orglist.rows);
                        //为了打印，传所有主键值
                        let allnewpks = that.dealTreeData(datas);

                        //let allpkorg = res.data.orglist.allpks;
                        setDefData('orgunit_allpkorg', that.config.datasource, allnewpks);
                        that
                            .props
                            .ViewModel
                            .setData(that.config.datasource, {
                                simpleTable: {
                                    allpks: allnewpks
                                }
                            });
                        // 将数据缓存起来，下次如果界面数据没有修改，刷新的时候，直接从缓存里面读取数据
                        // setDefData('orgunit_changelistdataflag',that.config.datasource,false);
                        // setDefData('orgunit_listdata',that.config.datasource,res.data);
                        // cacheTools.set('orgunit_allpkorg',allpkorg); 根据树状表的数据构造树表
                        Utils.convertGridEnablestate(res.data.orglist.rows, "enablestate");
                        that
                            .props
                            .treeTableManyCol
                            .initTreeTableData(that.props.config.gridId, datas, 'refpk');
                        //加载完数据之后，默认把根节点那一层展开 控制按钮（没选中行按钮不可用）
                        setTimeout(() => {
                            that.toggleShow();
                            that
                                .props
                                .treeTableManyCol
                                .openRow(that.props.config.gridId, datas[0].key);
                        }, 0);
                        if ('refresh' != getDefData('orgunit_btnopr', that.props.config.datasource)) {
                            toast({
                                content: that.state.json['10100ORG-000094'] + allnewpks.length + that.state.json['10100ORG-000095'],
                                color: 'success'
                            });/* 国际化处理： 查询成功，共,条*/
                        }
                    } else {
                        toast({content: that.state.json['10100ORG-000096'], color: 'warning'});/* 国际化处理： 未查询出符合条件的数据！*/
                        that
                            .props
                            .treeTableManyCol
                            .emptyAllData(that.props.config.gridId);
                    }

                }
            }
        })
    }

    checkboxChange(record, index, e) {
        var btns1 = [
                'enable',
                'disable',
                'version',
                'auxiliary',
                'printpage',
                'back',
                'delete',
                'orgunitreldept',
                'setorgroot'
            ],
            btns2 = [
                'orgmoduleperiod',
                'createinnercustsupp',
                'logomanage',
                'editVAT',
                'orgmanager',
                'attachconfig',
                'print',
                'export'
            ],
            btns3 = ['financeorgversion', 'liabilitycenterversion', 'hrorgversion', 'adminorgversion'];
        let allData = this
            .props
            .treeTableManyCol
            .getSelectedRow(this.config.gridId);
        if (!record.checked) {
            this
                .props
                .button
                .setButtonDisabled([
                    ...btns1,
                    ...btns2
                ], false);
            //勾选数据的时候，当且仅当勾选一条数据的时候，才判断是否可以使用，其他情况都设置为不可以使用
            if (allData && allData.length == 1) {
                let adminroot = getDefData('haveadminrootorgunit', this.props.config.datasource);
                setDefData('orgunit_pk_accperiodscheme',this.props.config.datasource,allData[0].values.pk_accperiodscheme.value);
                if (!adminroot.haveroot) {
                    this
                        .props
                        .button
                        .setButtonDisabled(['setadminorgroot'], true);
                } else {
                    if (record.key == adminroot.pk) {
                        //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
                        this
                            .props
                            .button
                            .setButtonDisabled(['setadminorgroot'], true);
                    } else {
                        this
                            .props
                            .button
                            .setButtonDisabled(['setadminorgroot'], false);
                    }

                }

                let corproot = getDefData('havecorprootorgunit', this.props.config.datasource);
                if (!corproot.haveroot) {
                    this
                        .props
                        .button
                        .setButtonDisabled(['setcorproot'], true);
                } else {
                    if (record.key == corproot.pk) {
                        this
                            .props
                            .button
                            .setButtonDisabled(['setcorproot'], true);
                    } else {
                        this
                            .props
                            .button
                            .setButtonDisabled(['setcorproot'], false);
                    }

                }

                let orgroot = getDefData('haverootorgunit', this.props.config.datasource);

                if (!orgroot.haveroot) {
                    this
                        .props
                        .button
                        .setButtonDisabled(['setorgroot'], true);
                } else {
                    if (record.key == orgroot.pk) {
                        //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
                        this
                            .props
                            .button
                            .setButtonDisabled(['setorgroot'], true);
                    } else {
                        this
                            .props
                            .button
                            .setButtonDisabled(['setorgroot'], false);
                    }

                }
            } else {
                this
                    .props
                    .button
                    .setButtonDisabled(['setcorproot'], true);
                this
                    .props
                    .button
                    .setButtonDisabled(['setadminorgroot'], true);
                this
                    .props
                    .button
                    .setButtonDisabled(['setorgroot'], true);
            }
        }
        if (record.checked) {
            //关闭的时候，需要根据剩下的数据去判断
            if (!allData || allData.length === 0) {
                this
                    .props
                    .button
                    .setButtonDisabled([
                        ...btns1,
                        ...btns2
                    ], true);
            }
            //勾选数据的时候，当且仅当勾选一条数据的时候，才判断是否可以使用，其他情况都设置为不可以使用
            if (allData && allData.length == 1) {
                let adminroot = getDefData('haveadminrootorgunit', this.props.config.datasource);
                setDefData('orgunit_pk_accperiodscheme',this.props.config.datasource,allData[0].values.pk_accperiodscheme.value);
                if (!adminroot.haveroot) {
                    this
                        .props
                        .button
                        .setButtonDisabled(['setadminorgroot'], true);
                } else {
                    if (allData[0].key == adminroot.pk) {
                        //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
                        this
                            .props
                            .button
                            .setButtonDisabled(['setadminorgroot'], true);
                    } else {
                        this
                            .props
                            .button
                            .setButtonDisabled(['setadminorgroot'], false);
                    }

                }

                let corproot = getDefData('havecorprootorgunit', this.props.config.datasource);
                if (!corproot.haveroot) {
                    this
                        .props
                        .button
                        .setButtonDisabled(['setcorproot'], true);
                } else {
                    if (allData[0].key == corproot.pk) {
                        this
                            .props
                            .button
                            .setButtonDisabled(['setcorproot'], true);
                    } else {
                        this
                            .props
                            .button
                            .setButtonDisabled(['setcorproot'], false);
                    }

                }

                let orgroot = getDefData('haverootorgunit', this.props.config.datasource);

                if (!orgroot.haveroot) {
                    this
                        .props
                        .button
                        .setButtonDisabled(['setorgroot'], true);
                } else {
                    if (allData[0].key == orgroot.pk) {
                        //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
                        this
                            .props
                            .button
                            .setButtonDisabled(['setorgroot'], true);
                    } else {
                        this
                            .props
                            .button
                            .setButtonDisabled(['setorgroot'], false);
                    }

                }
            } else {
                this
                    .props
                    .button
                    .setButtonDisabled(['setcorproot'], true);
                this
                    .props
                    .button
                    .setButtonDisabled(['setadminorgroot'], true);
                this
                    .props
                    .button
                    .setButtonDisabled(['setorgroot'], true);
            }
            //this.props.button.setButtonDisabled([...btns1, ...btns2, ...btns3],false);
        }

    }

    //切换页面状态--设置按钮显示和业务状态
    toggleShow() {
        let allData = this
            .props
            .treeTableManyCol
            .getSelectedRow(this.config.gridId);

        var btns1 = [
                'enable',
                'disable',
                'version',
                'auxiliary',
                'printpage',
                'back',
                'delete',
                'orgunitreldept'
            ],
            btns2 = [
                'orgmoduleperiod',
                'createinnercustsupp',
                'logomanage',
                'editVAT',
                'orgmanager',
                'attachconfig',
                'print',
                'export'
            ],
            btns3 = ['financeorgversion', 'liabilitycenterversion', 'hrorgversion', 'adminorgversion'];
        if (!allData || allData.length === 0) {
            this
                .props
                .button
                .setButtonDisabled([
                    ...btns1,
                    ...btns2
                ], true);
            // this.props.button.setButtonDisabled(['orgmoduleperiod','createinnercustsupp',
            // 'logomanage','editVAT','orgmanager','attachconfig'],true);
            // this.props.button.setButtonDisabled(['print','export','version','financeorgver
            // sion','liabilitycenterversion','hrorgversion','adminorgversion'],true);
            return;
        } else {
            this
                .props
                .button
                .setButtonDisabled([
                    ...btns1,
                    ...btns2
                ], false);
            // this.props.button.setButtonDisabled(['enable','disable','version','auxiliary'
            // ,'printpage','setroot','setadminorgroot','setcorproot','back','delete','more']
            // ,false);
            // this.props.button.setButtonDisabled(['orgmoduleperiod','createinnercustsupp','
            // logomanage','editVAT','orgmanager','attachconfig'],false);
            // this.props.button.setButtonDisabled(['print','export','version','financeorgver
            // sion','liabilitycenterversion','hrorgversion','adminorgversion'],false);
        }
        // let selectNode = this.props.syncTree.getSelectNode(leftTree);
        // if(selectNode){//更新停用启用按钮     if('root' === selectNode.id){
        // this.props.button.setButtonDisabled(['Copy','Enable','Disable','Version','Impo
        // rt','AddVirtual','SortManage'],true);     }else{
        // this.props.button.setButtonDisabled(['Copy','Enable','Disable','Version','Impo
        // rt','AddVirtual','SortManage','AddStatMemb'],false);     }     let
        // enablestate = selectNode.nodeData.enablestate;     if(enablestate
        // ==='2'){//启用状态         // this.props.button.setButtonsVisible({         //
        //  btnDisable:true,         //     btnEnable:false,         // });
        // this.props.button.setButtonVisible(['Enable'],false);
        // this.props.button.setButtonVisible(['Disable'],true);     }else{         //
        // this.props.button.setButtonsVisible({         //     btnDisable:false,
        //  //     btnEnable:true,         // });
        // this.props.button.setButtonVisible(['Enable'],true);
        // this.props.button.setButtonVisible(['Disable'],false);     } }
    }

    //显示停用按钮点击事件
    onCheckShowDisable(checked) {
        let that = this;
        this.setState({
            checked: !this.state.checked
        }, () => {
            // let pageInfo
            // =this.props.treeTableManyCol.getTablePageInfo(this.config.gridId);
            let searchData = this
                .props
                .search
                .getAllSearchData(this.props.config.searchId);
            let custcondition = {};
            let conditions = [];
            this.state.showOffDisable = !this.state.showOffDisable
            let showDisable = this.state.showOffDisable;
            setDefData('orgunit_checkflag', this.config.datasource, showDisable);
            //cacheTools.set('orgunit_checkflag',showDisable);
            if (!searchData) {
                //如果查询区必输项没有输入，直接return
                return;
            }

            //如果没有勾选显示停用，查询条件里面的enablestate = '2'只显示启用
            if (typeof(searchData) !== 'undefined' && searchData && searchData.conditions) {
                if (showDisable) {
                    conditions.push({
                        display: that.state.json['10100ORG-000090'],
                        field: 'enablestate',
                        oprtype: '=',
                        value: {
                            firstvalue: '2',
                            secondvalue: null
                        }
                    });/* 国际化处理： 启用状态*/
                    custcondition = {
                        conditions,
                        logic: 'and'
                    };
                }
                let paramData = {
                    querycondition: searchData,
                    // custcondition:{     conditions:[{         field:'pk_group',         value:{
                    //           firstvalue:null         },         oprtype:'='     }] },
                    custcondition: custcondition,
                    pagecode: this.config.pagecode,
                    queryAreaCode: this.config.searchId,
                    pageInfo: {},
                    querytype: 'tree',
                    oid: getDefData('orgunit_searchoid', this.config.datasource) //cacheTools.get('orgunit_searchoid')
                };
                //为不显示提示语言
                setDefData('orgunit_btnopr',this.props.config.datasource,'refresh');
                this.loadGridData(paramData);
            } else {
                return;
            }
            setDefData('orgunit_searchVal', this.config.datasource, searchData);
            //cacheTools.set('orgunit_searchVal',searchData);
        });

    }

    //------------------------------------------------------------------------------
    //---------------------------- 版本化
    onSaveVersion = () => {
        let formdata = this
            .props
            .form
            .getAllFormValue('org_v_head');
        let that = this;
        ajax({
            url: '/nccloud/uapbd/org/saveorgversion.do',
            data: formdata,
            success: (res) => {
                if (res.success) {
                    // 版本化之后刷新界面 修改了界面数据，需要重新加载数据
                    // setDefData('orgunit_changelistdataflag',that.config.datasource,true);
                    // setDefData('orgunit_needquerydata',that.config.datasource,true);
                    setDefData('orgunit_btnopr',this.props.config.datasource,'refresh');
                    that.onrefresh();
                    toast({title: that.state.json['10100ORG-000042'], color: 'success'});/* 国际化处理： 版本化成功！*/
                }
            }
        })
    }

    //财务组织版本化
    onSaveFinanceVersion = () => {
        let that = this;
        //版本化的时候确认版本的是哪一个1：财务组织体系版本化 2：利润中心体系版本化 3：人力资源组织体系版本化4：行政组织体系版本化
        let type = getDefData('orgunit_versiontype', that.config.datasource); //cacheTools.get('orgunit_versiontype');
        let modalid = getDefData('orgunit_modalid', that.config.datasource); //cacheTools.get('orgunit_modalid');
        let form = this
            .props
            .form
            .getAllFormValue('financeorg_v');

        ajax({
            url: '/nccloud/uapbd/org/savefinanceversion.do',
            data: {
                form,
                type: type
            },
            success: (res) => {
                if (res.success) {
                    // 版本化之后刷新界面 修改了界面数据，需要重新加载数据
                    // setDefData('orgunit_changelistdataflag',that.config.datasource,true);
                    // setDefData('orgunit_needquerydata',that.config.datasource,true);
                    setDefData('orgunit_btnopr',that.props.config.datasource,'refresh');
                    that.onrefresh();
                    if (1 == type) {
                        toast({title: that.state.json['10100ORG-000043'], color: 'success'});/* 国际化处理： 财务组织版本化成功！*/
                    }
                    if (2 == type) {
                        toast({title: that.state.json['10100ORG-000044'], color: 'success'});/* 国际化处理： 利润中心体系版本化成功！*/
                    }
                    if (3 == type) {
                        toast({title: that.state.json['10100ORG-000045'], color: 'success'});/* 国际化处理： 人力资源组织体系版本化成功！*/
                    }
                    if (4 == type) {
                        toast({title: that.state.json['10100ORG-000046'], color: 'success'});/* 国际化处理： 行政组织体系版本化成功！*/
                    }
                    that
                        .props
                        .modal
                        .close(modalid);
                }
            }
        })
    }

    orgManageButtonState(props, status) {
        //let status = props.getUrlParam('status'); 按钮的显示状态
        if (status === 'orgmanageadd' || status === 'orgmanageedit') {
            props
                .button
                .setButtonVisible([
                    'orgmanagesave', 'orgmanagecancel'
                ], true);
            props
                .button
                .setButtonVisible([
                    'orgmanageadd', 'orgmanageedit', 'orgmanagerefresh', 'orgmanagedel'
                ], false);
        } else {
            props
                .button
                .setButtonVisible([
                    'orgmanagesave', 'orgmanagecancel'
                ], false);
            props
                .button
                .setButtonVisible([
                    'orgmanageadd', 'orgmanageedit', 'orgmanagerefresh', 'orgmanagedel'
                ], true);
        }
    }

    //组织主管按钮点击事件
    onOrgManageButtonClick(props, id) {
        let that = this;
        let selectMember = that
            .props
            .treeTableManyCol
            .getSelectedRow(that.props.config.gridId);
        //选中多行的时候，默认以第一个为当前选中行
        let pk_org = selectMember[0].values.pk_org.value
        switch (id) {
            case 'orgmanageadd':
                let num = props
                    .editTable
                    .getNumberOfRows('orgmanager'); //获取列表总行数
                props
                    .editTable
                    .addRow('orgmanager', num, true);
                props
                    .editTable
                    .setStatus('orgmanager', 'edit');
                that.orgManageButtonState(props, 'orgmanageadd');
                // this.props.editTable.setValByKeyAndIndex(tableid, num, 'dataoriginflag',
                // {value: '0'});//设置数据来源
                break;

            case 'orgmanagedel':
                let selectedData = props
                    .editTable
                    .getCheckedRows('orgmanager');
                if (selectedData.length == 0) {
                    toast({content: that.state.json['10100ORG-000049'], color: 'warning'});/* 国际化处理： 请选择要删除的数据！*/
                    return
                }
                let indexArr = [];
                selectedData.forEach((val) => {
                    indexArr.push(val.index);
                });
                promptBox({
                    color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10100ORG-000099'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    hasCloseBtn:false,
                    content: this.state.json['10100ORG-000009'],
                    /* 国际化处理： 确定要删除所选数据吗？*/
                    beSureBtnClick: () => {
                        props
                            .editTable
                            .deleteTableRowsByIndex('orgmanager', indexArr);

                        //过滤无效行
                        this
                            .props
                            .editTable
                            .filterEmptyRows('orgmanager', ['cuserid']);
                        var tableData = this
                            .props
                            .editTable
                            .getChangedRows('orgmanager'); //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
                        if (!tableData || tableData.length === 0) 
                            return;
                        
                        tableData.map((obj) => {
                            obj.values.pk_org.value = pk_org;
                        })

                        var data = {
                            pageid: '10100ORG_orgmanager',
                            model: {
                                areaType: "table",
                                pageinfo: null,
                                rows: []
                            }
                        };
                        data.model.rows = tableData;
                        ajax({
                            url: '/nccloud/uapbd/org/orgmanagesavequery.do',
                            data: data,
                            success: (res) => {
                                if (res.success) {
                                    //保存完设置为浏览态
                                    if (res.data) {
                                        props
                                            .editTable
                                            .setTableData('orgmanager', res.data.orgmanager);
                                    } else {
                                        props
                                            .editTable
                                            .setTableData('orgmanager', {rows: []});
                                    }
                                    that.orgManageButtonState(props, 'orgmanagedel');
                                    toast({title: that.state.json['10100ORG-000010'], color: 'success'});/* 国际化处理： 删除成功！*/
                                }
                            }
                        });
                    }
                })
                

                break;
            case 'orgmanageedit':
                props
                    .editTable
                    .setStatus('orgmanager', 'edit');
                that.orgManageButtonState(props, 'orgmanageedit');
                // this.props.editTable.setValByKeyAndIndex(tableid, num, 'dataoriginflag',
                // {value: '0'});//设置数据来源
                break;
            case 'orgmanagesave':
                that.onSaveOrgManager();
                // this.props.editTable.setValByKeyAndIndex(tableid, num, 'dataoriginflag',
                // {value: '0'});//设置数据来源
                break;
            case 'orgmanagecancel':
                promptBox({
                    color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: that.state.json['10100ORG-000100'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    content: that.state.json['10100ORG-000002'],
                    /* 国际化处理： 您确定要取消吗？*/
                    beSureBtnClick: () => {
                        ajax({
                            url: '/nccloud/uapbd/org/orgmanagerquery.do',
                            data: {
                                pk_org: getDefData('orgunit_pk_org', that.config.datasource)
                            },
                            success: (res) => {
                                if (res.success) {              
                                    if (res.data) {
                                        props
                                            .editTable
                                            .setTableData('orgmanager', res.data.orgmanager);
                                    }
                                    props
                                        .editTable
                                        .cancelEdit('orgmanager');
                                    this.orgManageButtonState(props, 'orgmanagerefresh');
                                    //props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                                }
                            }
                        });
                        //保存完设置为浏览态
                        props
                            .editTable
                            .setStatus('orgmanager', 'browse');
                    }
                });break;
            case 'orgmanagerefresh':
                ajax({
                    url: '/nccloud/uapbd/org/orgmanagerquery.do',
                    data: {
                        pk_org: pk_org
                    },
                    success: (res) => {
                        if (res.success) {
                        
                            if (res.data) {
                                props
                                    .editTable
                                    .setTableData('orgmanager', res.data.orgmanager);
                                    
                            }
                            toast({title:that.state.json['10100ORG-000041'],color:"success"});/* 国际化处理： 刷新成功！*/
                            this.orgManageButtonState(props, 'orgmanagerefresh');
                            this.props.button.setButtonDisabled(['orgmanagedel'], true);
                            //props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                        }
                    }
                });
                //保存完设置为浏览态
                props
                    .editTable
                    .setStatus('orgmanager', 'browse');
                //props.editTable.setStatus('orgmanager','edit');
                break;
        }
    }

    onTableModelAfterEdit(props, moduleId, key, value, changedrows, record, index) {

        if (value.refpk) {
            ajax({
                url: '/nccloud/uapbd/org/userquery.do',
                data: {
                    cuserid: value.refpk
                },
                success: (res) => {
                    if (res.success) {
                    
                        if (res.data) {
                            if (undefined != res.data.orgmanager.rows[0].values['username']) {
                                props
                                    .editTable
                                    .setValByKeyAndIndex('orgmanager', record, 'username', {value: res.data.orgmanager.rows[0].values.username.value});
                            }
                            if (undefined != res.data.orgmanager.rows[0].values['psncode']) {
                                props
                                    .editTable
                                    .setValByKeyAndIndex('orgmanager', record, 'psncode', {value: res.data.orgmanager.rows[0].values.psncode.value});
                            }
                            if (undefined != res.data.orgmanager.rows[0].values['psnname']) {
                                props
                                    .editTable
                                    .setValByKeyAndIndex('orgmanager', record, 'psnname', {value: res.data.orgmanager.rows[0].values.psnname.value});
                            }
                        }
                    }
                }
            });
        }
    }

    onSaveOrgManager() {
        //let tabledata = this.props.editTable.getAllData('orgmanager');
        let selectMember = this
            .props
            .treeTableManyCol
            .getSelectedRow(this.props.config.gridId);
        let pk_org = selectMember[0].values.pk_org.value
        let that = this;
        this
            .props
            .editTable
            .filterEmptyRows('orgmanager', ['cuserid']);
        let tableData = this
            .props
            .editTable
            .getChangedRows('orgmanager'); //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
        tableData.map((obj) => {
            obj.values.pk_org.value = pk_org;
        })
        if (!tableData || tableData.length === 0) {
            //保存完设置为浏览态
            that
                .props
                .editTable
                .setStatus('orgmanager', 'browse');
            that.orgManageButtonState(that.props, 'orgmanagesave');
            toast({title: that.state.json['10100ORG-000047'], color: 'success'});/* 国际化处理： 保存成功！*/
            return;
        }
        let data = {
            pageid: '10100ORG_orgmanager',
            model: {
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        data.model.rows = tableData;
        ajax({
            url: '/nccloud/uapbd/org/orgmanagesavequery.do',
            data: data,
            success: (res) => {
                if (res.success) {
                
                    //保存完设置为浏览态
                    if (res.data) {
                        that
                            .props
                            .editTable
                            .setTableData('orgmanager', res.data.orgmanager);
                    } else {
                        that
                            .props
                            .editTable
                            .setTableData('orgmanager', {rows: []});
                    }
                    that
                        .props
                        .editTable
                        .setStatus('orgmanager', 'browse');
                    that.orgManageButtonState(that.props, 'orgmanagesave');
                    toast({title: that.state.json['10100ORG-000047'], color: 'success'});/* 国际化处理： 保存成功！*/
                }
            }
        });
    }

    //业务期间按钮事件
    onOrgPeirodButtonClick(props, id) {
        let tableData = this
            .props
            .editTable
            .getAllData('orgmoduleperiod'); //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输

        let changetableData = props
            .editTable
            .getChangedRows('orgmoduleperiod');

        let rownum = props
            .editTable
            .getNumberOfRows('orgmoduleperiod'); //获取列表总行数

        let that = this;

        let flag = 0;

        let data = {};

        switch (id) {
            case 'periodsave':
                if (!changetableData || changetableData.length === 0) 
                    return
                data = {
                    pageid: '10100ORG_orgmoduleperiod',
                    model: {
                        areaType: "table",
                        pageinfo: null,
                        rows: []
                    }
                };
                data.model.rows = changetableData;
                ajax({
                    url: '/nccloud/uapbd/org/saveperiod.do', data: data, //{data:data,opera:'year'},
                    success: (res) => {
                        if (res.success) {
                            ajax({
                                url: '/nccloud/uapbd/org/orgmoduleperiod.do',
                                data: {
                                    pk_org: getDefData('orgunit_pk_org', props.config.datasource)
                                },
                                success: (res) => {
                                    if (res.success) {
                                        if (res.data) {
                                            props
                                                .editTable
                                                .setTableData('orgmoduleperiod', res.data.orgmoduleperiod);
                                        } else {
                                            props
                                                .editTable
                                                .setTableData('orgmoduleperiod', {rows: []});
                                        }
                                        props
                                            .editTable
                                            .setStatus('orgmoduleperiod', 'edit');
                                    }
                                }
                            });
                            toast({color: 'success', title: that.state.json['10100ORG-000048']});/* 国际化处理： 设置成功！*/
                        }
                    }
                });
                break;

            case 'batchempty':
                while (flag != rownum) {
                    props
                        .editTable
                        .setValByKeyAndIndex('orgmoduleperiod', flag, 'pk_accperiod', {
                            value: '',
                            display: ''
                        });
                    flag = flag + 1;
                }
                break;
            case 'batchsetbeginyear':

                if (!tableData || tableData.length === 0) 
                    return
                data = {
                    pageid: 'beginyear',
                    model: {
                        areaType: "table",
                        pageinfo: null,
                        rows: []
                    }
                };
                data.model.rows = tableData.rows;
                ajax({
                    url: '/nccloud/uapbd/org/batchsetyearperiod.do', data: data, //{data:data,opera:'year'},
                    success: (res) => {
                        if (res.success) {
                            if (res.data) {
                                while (flag != rownum) {
                                    if (res.data[flag] != null) {
                                        props
                                            .editTable
                                            .setValByKeyAndIndex('orgmoduleperiod', flag, 'pk_accperiod', {
                                                value: res.data[flag],
                                                display: res.data[flag]
                                            });
                                    }
                                    flag = flag + 1;
                                }
                            }
                        }
                    }
                });

                props
                    .editTable
                    .setStatus('orgmoduleperiod', 'edit');
                break;
            case 'batchcurrentyear':
                if (!tableData || tableData.length === 0) 
                    return
                data = {
                    pageid: 'currentyear',
                    model: {
                        areaType: "table",
                        pageinfo: null,
                        rows: []
                    }
                };
                data.model.rows = tableData.rows;
                ajax({
                    url: '/nccloud/uapbd/org/batchsetyearperiod.do', data: data, //{data:data,opera:'year'},
                    success: (res) => {
                        if (res.success) {
                            if (res.data) {
                                while (flag != rownum) {
                                    if (res.data[flag] != null) {
                                        props
                                            .editTable
                                            .setValByKeyAndIndex('orgmoduleperiod', flag, 'pk_accperiod', {
                                                value: res.data[flag],
                                                display: res.data[flag]
                                            });
                                    }
                                    flag = flag + 1;
                                }
                            }
                        }
                    }
                });
                props
                    .editTable
                    .setStatus('orgmoduleperiod', 'edit');
                break;
        }
    }

    onPeriodBeforeEvent(props, moduleId, item, index, value, record) {
        // 业务期初期间，银行授信管理、银行存款管理、银行贷款管理、担保管理、
        // 信用证管理、商业汇票、资金调度、内部存款管理、内部贷款管理、票据集中管理、资金结算这几个模块对应的会计期间是日期，不是会计参照
        let meta = this
            .props
            .meta
            .getMeta();
        let moudleidnum = record.values.moduleid.value;
        let arr = [
            '4510',
            '4530',
            '4532',
            '3613',
            '3614',
            '3615',
            '3616',
            '3617',
            '3618',
            '3632',
            '3634',
            '3635',
            '3637'
        ]
        var index = arr.indexOf(moudleidnum);
        if (index >= 0) {
            // 找到对应项，也可以用forEach循环、for循环等
            meta[moduleId]
                .items
                .find(e => e.attrcode === 'pk_accperiod')
                .itemtype = 'datetimepicker';
            meta[moduleId]
                .items
                .find(e => e.attrcode === 'pk_accperiod')
                .refcode = null;
            // 重要！下面那行一定要写
            props.renderItem('table', moduleId, 'pk_accperiod', null) // 前三个参数，根据模板json填对应值，moduleId是区域id
            props
                .meta
                .setMeta(meta)
        } else {
        
            ajax({
                url: '/nccloud/uapbd/org/setaccperiodscheme.do',
                data: {
                    pk_orgtype: record.values.pk_orgtype.display,
                    pk_org: record.values.pk_org.value,
                    moudleid: moudleidnum
                },
                success: (res) => {
                    if (res.success) {
                        
                        if (res.data) {
                            item.queryCondition = function () {
                                return {"pk_accperiodscheme": res.data}
                            }
                        }
                    }
                }
            });
        }
        //编辑前事件必须范围true，不然不可以使用
        return true;
    }

    onSaveOrgPeriod() {
        let tableData = this
            .props
            .editTable
            .getAllData('orgmoduleperiod'); //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
        let changetableData = props
            .editTable
            .getChangedRows('orgmoduleperiod');
        let that = this;
        if (!changetableData || changetableData.length === 0) 
            return
        data = {
            pageid: '10100ORG_orgmoduleperiod',
            model: {
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        data.model.rows = changetableData.rows;
        ajax({
            url: '/nccloud/uapbd/org/saveperiod.do', data: data, //{data:data,opera:'year'},
            success: (res) => {
                if (res.success) {
                    toast({color: 'success', title: that.state.json['10100ORG-000048']});/* 国际化处理： 设置成功！*/
                }
            }
        });
    }

    onSaveOrgInnercust() {
    
        let that = this;
        let memberFlag = this
            .props
            .form
            .isCheckNow('innercustsupp');
        if (!memberFlag) {
            that
                .props
                .modal
                .show('innercustsupp');
            return;
        }

        let selectMember = this
            .props
            .treeTableManyCol
            .getSelectedRow(this.props.config.gridId);
        let countryzone = selectMember[0].values.countryzone.value;
        let pk_unitorg = selectMember[0].values.pk_org.value;

        let pk_org = this
            .props
            .form
            .getFormItemsValue('innercustsupp', 'pk_org')
            .value;
        let code = this
            .props
            .form
            .getFormItemsValue('innercustsupp', 'code')
            .value;
        let custname = this
            .props
            .form
            .getFormItemsValue('innercustsupp', 'custname')
            .value;
        let custshortname = this
            .props
            .form
            .getFormItemsValue('innercustsupp', 'custshortname')
            .value;
        let pk_custclass = this
            .props
            .form
            .getFormItemsValue('innercustsupp', 'pk_custclass')
            .value;
        let pk_supplierclass = this
            .props
            .form
            .getFormItemsValue('innercustsupp', 'pk_supplierclass')
            .value;
        ajax({
            url: '/nccloud/uapbd/org/saveinnercust.do',
            data: {
                pk_org: pk_org,
                countryzone: countryzone,
                code: code,
                custname: custname,
                custshortname: custshortname,
                pk_custclass: pk_custclass,
                pk_supplierclass: pk_supplierclass,
                pk_unitorg: pk_unitorg,
                pk_orgarr:getDefData('orgunit_pk_orgarr',that.props.config.datasource)
            }, //{data:data,opera:'year'},
            success: (res) => {
                if (res.success) {
                    that
                        .props
                        .modal
                        .close('innercustsupp');
                    that.props.form.setFormStatus('innercustsupp','browse');
                    toast({color: 'success', title: that.state.json['10100ORG-000047']});/* 国际化处理： 保存成功！*/
                }
            }
        });

    }

    VATbuttonToggleShow(props, status) {
        //let status = props.getUrlParam('status'); 按钮的显示状态
        if (status === 'vatadd' || status === 'vatedit') {
            props
                .button
                .setButtonVisible([
                    'vatadd', 'vatlinedel', 'vatsave', 'vatcancel'
                ], true);
            props
                .button
                .setButtonVisible([
                    'vatedit', 'vatdel','vatrefresh'
                ], false);
        } else {
            props
                .button
                .setButtonVisible([
                    'vatadd', 'vatdel', 'vatedit','vatrefresh'
                ], true);
            props
                .button
                .setButtonVisible([
                    'vatsave', 'vatcancel', 'vatlinedel'
                ], false);
        }
    }

    onOrgVATButtonClick(props, id) {
        //过滤界面上的无效数据
        props
            .editTable
            .filterEmptyRows('orgvatfunclet', ['pk_country']);
        let that = this;
        //获取改变的数据
        let selectedData = props
            .editTable
            .getCheckedRows('orgvatfunclet');
        let pk_org = props
            .treeTableManyCol
            .getSelectedRow(props.config.gridId)[0]
            .values
            .pk_org
            .value;

        let tableData = this
            .props
            .editTable
            .getAllData('orgvatfunclet'); //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输

        let rownum = props
            .editTable
            .getNumberOfRows('orgvatfunclet'); //获取列表总行数

        let data = {};
        switch (id) {
            case 'vatadd':
                props
                    .editTable
                    .addRow('orgvatfunclet', rownum, true);
                props
                    .editTable
                    .setStatus('orgvatfunclet', 'edit');
                that.VATbuttonToggleShow(props, 'vatadd');
                // this.props.editTable.setValByKeyAndIndex(tableid, num, 'dataoriginflag',
                // {value: '0'});//设置数据来源
                that
                    .props
                    .button
                    .setButtonDisabled([
                        'vatdel', 'vatlinedel'
                    ], true);
                that
                    .props
                    .button
                    .setMainButton('vatsave', true);
                that
                    .props
                    .button
                    .setMainButton('vatadd', false);
                break;

            case 'vatdel':
                if (selectedData.length == 0) {
                    toast({content: that.state.json['10100ORG-000049'], color: 'warning'});/* 国际化处理： 请选择要删除的数据！*/
                    return
                }

                promptBox({
                    color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: that.state.json['10100ORG-000001'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    hasCloseBtn:false,
                    content: that.state.json['10100ORG-000050'],
                    /* 国际化处理： 您确定要删除吗？*/
                    beSureBtnClick: () => {
                        let indexArr1 = [];
                        selectedData.forEach((val) => {
                            indexArr1.push(val.index);
                        });

                        //界面上删除数据
                        props
                            .editTable
                            .deleteTableRowsByIndex('orgvatfunclet', indexArr1);
                        //获取界面上修改过的数据
                        var changetableData = props
                            .editTable
                            .getChangedRows('orgvatfunclet');

                        data = {
                            pageid: pk_org,
                            model: {
                                areaType: "table",
                                pageinfo: null,
                                rows: []
                            }
                        };
                        data.model.rows = changetableData;
                        ajax({
                            url: '/nccloud/uapbd/org/vatesave.do', data: data, //{data:data,opera:'year'},
                            success: (res) => {
                                if (res.success) {
                                    this.VATbuttonToggleShow(props, 'vatdel');
                                    toast({color: 'success', title: that.state.json['10100ORG-000010']});/* 国际化处理： 删除成功！*/
                                    that
                                    .props
                                    .button
                                    .setButtonDisabled([
                                        'vatdel','vatlinedel'
                                    ], true);
                                }
                                //props.modal.close('orgvatfunclet');
                            }
                        });
                    }
                });break;
            case 'vatlinedel':
                if (selectedData.length == 0) {
                    toast({content: that.state.json['10100ORG-000049'], color: 'warning'});/* 国际化处理： 请选择要删除的数据！*/
                    return
                }
                let indexArr = [];
                selectedData.forEach((val) => {
                    indexArr.push(val.index);
                });
                that.VATbuttonToggleShow(props, 'vatedit');
                props
                    .editTable
                    .deleteTableRowsByIndex('orgvatfunclet', indexArr);
                that
                    .props
                    .button
                    .setButtonDisabled([
                        'vatdel','vatlinedel'
                    ], true);
                break;
            case 'vatedit':
                props
                    .editTable
                    .setStatus('orgvatfunclet', 'edit');
                that.VATbuttonToggleShow(props, 'vatedit');
                props
                    .button
                    .setButtonDisabled(['vatlinedel'], true);
                // this.props.editTable.setValByKeyAndIndex(tableid, num, 'dataoriginflag',
                // {value: '0'});//设置数据来源
                break;
            case 'vatcancel':
                promptBox({
                    color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: that.state.json['10100ORG-000001'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    hasCloseBtn:false,
                    content: that.state.json['10100ORG-000002'],
                    /* 国际化处理： 您确定要取消吗？*/
                    beSureBtnClick: () => {
                        props
                            .editTable
                            .cancelEdit('orgvatfunclet');
                        props
                            .editTable
                            .setStatus('orgvatfunclet', 'browse');
                        that.VATbuttonToggleShow(props, 'vatcancel');
                        that
                            .props
                            .button
                            .setMainButton('vatsave', false);
                        that
                            .props
                            .button
                            .setMainButton('vatadd', true);
                    }
                });break;
            case 'vatrefresh':
                ajax({
                    url :'/nccloud/uapbd/org/vatquery.do',
                    data:{pk_org: pk_org},
                    success : (res) => {
                        if(res.success){
                            //props.modal.show('orgvatfunclet',{title:this.state.json['10100ORG-000060']});
                            if(res.data){
                                props.editTable.setTableData('orgvatfunclet',res.data.orgvatfunclet);
                            }else{
                                props.editTable.setTableData('orgvatfunclet',{rows: []});
                            }
                            props.editTable.setStatus('orgvatfunclet','browse');
                            props.button.setButtonDisabled(['vatdel'],true);
                            props.button.setButtonVisible(['vatadd','vatdel','vatedit','vatrefresh'],true);
                            props.button.setButtonVisible(['vatsave','vatcancel','vatlinedel'],false);
                            toast({title:that.state.json['10100ORG-000041'],color:"success"});/* 国际化处理： 刷新成功！*/
                        }
                    }
                });break;
            case 'vatsave':
                this.onSaveOrgVAT();
                this
                    .props
                    .button
                    .setMainButton('vatsave', false);
                this
                    .props
                    .button
                    .setMainButton('vatadd', true);
                // if(!tableData || tableData.length === 0) return data = {     pageid:pk_org,
                //   model : {         areaType: "table",         pageinfo: null,         rows:
                // []     } }; data.model.rows = tableData.rows; ajax({     url
                // :'/nccloud/uapbd/org/vatesave.do',     data:data,//{data:data,opera:'year'},
                //    success : (res) => {         if(res.success){             toast({ color:
                // 'success', content: '设置成功！' });         }
                // props.modal.close('orgvatfunclet');     } });
                // this.VATbuttonToggleShow(props,'vatsave');
                break;
        }

    }

    onVATTableModelAfterEdit(props, moduleId, key, value, changedrows, record, index) {
        ajax({
            url: '/nccloud/uapbd/org/vatedit.do',
            data: {
                countrycode: value.refpk
            },
            success: (res) => {
                if (res.success) {
                    
                    if (res.data) {
                        this
                            .props
                            .editTable
                            .setValByKeyAndIndex('orgvatfunclet', record, 'countrycode', {
                                value: res.data,
                                display: res.data
                            })
                    }
                }
            }
        });
        //编辑前事件必须范围true，不然不可以使用
        return true;
    }
    //保存维护vat
    onSaveOrgVAT() {
        //去除空行
        this
            .props
            .editTable
            .filterEmptyRows('orgvatfunclet', ['pk_country']);
        let changedRows = this
            .props
            .editTable
            .getChangedRows('orgvatfunclet', false);
        let that = this;
        if (changedRows && !this.props.editTable.checkRequired('orgvatfunclet', changedRows)) 
            return;
        
        // if(!this.props.editTable.checkRequired('orgvatfunclet',changedRows)) return;
        let selectMember = this
            .props
            .treeTableManyCol
            .getSelectedRow(this.props.config.gridId);
        let pk_org = selectMember[0].values.pk_org.value
        // let tableData = this.props.editTable.getAllData('orgvatfunclet');
        // if(!tableData || tableData.length === 0) return

        let data = {
            pageid: pk_org,
            model: {
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        data.model.rows = changedRows;
        ajax({
            url: '/nccloud/uapbd/org/vatesave.do', data: data, //{data:data,opera:'year'},
            success: (res) => {
                if (res.success) {
                    this.VATbuttonToggleShow(this.props, 'vatsave');
                    this
                        .props
                        .editTable
                        .setStatus('orgvatfunclet', 'browse');
                    toast({color: 'success', title: that.state.json['10100ORG-000047']});/* 国际化处理： 保存成功！*/
                }
                //this.props.modal.close('orgvatfunclet');
            }
        });

    }

    onMouseEnterSortTreeEve(key) {
        let obj = {
            delIcon: false,
            editIcon: false,
            addIcon: false
        };
        this
            .props
            .syncTree
            .hideIcon('orgunittree', key, obj)
    }

    //选择左树加载右表数据 控制启用停用按钮
    onSelectEve(data, item, isChange) {
    
        let that = this;
        if (isChange) {
            //加载成员树表
            let that = this;
            ajax({
                url: '/nccloud/uapbd/org/querydept.do',
                data: {
                    pk_org: data
                },
                success: function (res) {
                    if (res.success) {
                        if (res.data) {
                            //后台返回的是表格的数据  需要构造成树状表的数据
                            let datas = that
                                .props
                                .treeTableManyCol
                                .createNewData(res.data.orgdept.rows);
                            //that.props.treeTableManyCol.EmptyAllFormValue(rightTreeTable); 根据树状表的数据构造树表

                            that
                                .props
                                .treeTableManyCol
                                .initTreeTableData('orgdept', datas, 'refpk', true);
                        } else {

                            that
                                .props
                                .treeTableManyCol
                                .emptyAllData('orgdept');
                        }

                    }
                },
                error: (result) => {
                    toast({content: result.message, title: that.state.json['10100ORG-000051'], color: 'warning'});/* 国际化处理： 警告*/
                }
            });
        }
    }

    /**
     * 设置业务单元根节点
     * @param data
     * @returns {*}
     */
    onSetUnitOrgRoot() {
        let selectMember = this
            .props
            .treeTableManyCol
            .getSelectedRow(this.props.config.gridId);
        let pk_org = selectMember[0].values.pk_org.value
        let that = this;
        let type = 'orgroot';
        ajax({
            url: '/nccloud/uapbd/org/setroot.do',
            data: {
                pk_org: pk_org,
                type: type
            },
            success: (res) => {
                if (res.success) {
                    // 修改了界面数据，需要重新加载数据
                    // setDefData('orgunit_changelistdataflag',this.config.datasource,true);
                    // setDefData('orgunit_needquerydata',this.config.datasource,true);
                    that.onrefresh();
                    that
                        .props
                        .modal
                        .close('setorgroot');
                    toast({color: 'success', title: that.state.json['10100ORG-000048']});/* 国际化处理： 设置成功！*/
                }
            },
            error: (result) => {
                toast({content: result.message, title: that.state.json['10100ORG-000051'], color: 'warning'});/* 国际化处理： 警告*/
            }
        });
    }

    /**
     * 设置行政组织根节点
     * @param data
     * @returns {*}
     */
    onSetAdminOrgRoot() {
        let selectMember = this
            .props
            .treeTableManyCol
            .getSelectedRow(this.props.config.gridId);
        let pk_org = selectMember[0].values.pk_org.value
        let type = 'adminroot';
        let that = this;

        ajax({
            url: '/nccloud/uapbd/org/setroot.do',
            data: {
                pk_org: pk_org,
                type: type
            },
            success: (res) => {
                if (res.success) {
                    //更改完需要把数据重新加载一遍
                    that
                        .props
                        .modal
                        .close('setadminorgroot');
                    toast({color: 'success', title: that.state.json['10100ORG-000048']});/* 国际化处理： 设置成功！*/
                }
            },
            error: (result) => {
                toast({content: result.message, title: that.state.json['10100ORG-000051'], color: 'warning'});/* 国际化处理： 警告*/
            }
        });
    }

    /**
     * 设置法人公司根节点
     * @param data
     * @returns {*}
     */
    onSetCorpRoot() {
        let that = this;
        let selectMember = that
            .props
            .treeTableManyCol
            .getSelectedRow(that.props.config.gridId);
        let pk_org = selectMember[0].values.pk_org.value
        let type = 'corproot';

        ajax({
            url: '/nccloud/uapbd/org/setroot.do',
            data: {
                pk_org: pk_org,
                type: type
            },
            success: (res) => {
                if (res.success) {
                    toast({color: 'success', title: that.state.json['10100ORG-000048']});/* 国际化处理： 设置成功！*/
                    that
                        .props
                        .modal
                        .close('setcorproot');
                }
            },
            error: (result) => {
                toast({content: result.message, title: that.state.json['10100ORG-000051'], color: 'warning'});/* 国际化处理： 警告*/
            }
        });
    }

    onHideUploader() {
        this.setState({showlogoUploader: false, showUploader: false})
    }

    beforeUpload(billId, fullPath, file, fileList) {
        // 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
        let that = this;
        if (fileList.length > 0) {
            toast({content: that.state.json['10100ORG-000052'], color: 'warning'});/* 国际化处理： logo只允许上传一张图片，请先删除原图片！*/
            return false;
        }
        let isJPG = false;
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
            isJPG = true;
        }

        if (!isJPG) {
            toast({content: that.state.json['10100ORG-000053'], color: 'warning'});/* 国际化处理： 只支持jpg,png格式图片！*/
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            toast({content: that.state.json['10100ORG-000054'], color: 'warning'});/* 国际化处理： 上传大小小于2M！*/
        }
        return isJPG && isLt2M;
        // 备注： return false 不执行上传  return true 执行上传
    }

    afterInnercustEvent(props, moduleId, key, value, oldValue) {
        let meta = props
            .meta
            .getMeta();
        meta['innercustsupp']
            .items
            .map((obj) => {
                if (obj.attrcode == 'pk_org') {
                    //需要根据管控模式判断客商和供应商有没有对应的节点
                    ajax({
                        url: '/nccloud/uapbd/org/checknodeoperapower.do',
                        data: {
                            pk_org: value.value
                        },
                        success: (res) => {
                            if (res.success) {
                                //过滤客户基本分类
                                if (res.data) {
                                    toast({content: res.data, color: 'warning'});
                                }
                                meta['innercustsupp']
                                    .items
                                    .find((item) => item.attrcode == 'pk_custclass')
                                    .queryCondition = () => {
                                    return {pk_org: value.value}
                                }
                                //过滤供应商档案
                                meta['innercustsupp']
                                    .items
                                    .find((item) => item.attrcode == 'pk_supplierclass')
                                    .queryCondition = () => {
                                    return {pk_org: value.value}
                                }
                            }
                        }
                    });

                }
            })
        props
            .meta
            .setMeta(meta);
    }

    onRowDoubleClick(record, props) {

        let config = {
            pk_vid: record.pk_vid.value,
            pk_org: record.pk_org.value,
            pagecode: '10100ORG_orgcardversion',
            pageTitle:this.state.json['10100ORG-000104'],
            appcode: '10100ORG',
            appid: '0001Z010000000001NOH',
            type: 'version',

            subGrid: 'org_v',
            subGrid1: 'corp_v',
            subGrid2: 'hrorg_v',
            subGrid3: 'financeorgcard_v',
            subGrid4: 'fundorg_v',
            subGrid5: 'purchaseorg_v',
            subGrid6: 'salesorg_v',
            subGrid61: 'saleorgrelation_v',
            subGrid7: 'stockorg_v',
            subGrid71: 'stocktrafficrelation_v',
            subGrid72: 'stockqccenterrelation_v',
            subGrid73: 'stockorgrelation_v',
            subGrid74: 'stockassetrelation_v',
            subGrid8: 'trafficorg_v',
            subGrid9: 'qccenter_v',
            subGrid10: 'assetorg_v',
            subGrid101: 'assetorgmaintainrelation_v',
            subGrid11: 'maintainorg_v',
            subGrid111: 'maintainstockrelation_v',
            subGrid12: 'liabilitycenter_v',
            subGrid13: 'itemorg_v',
            subGrid131: 'itemstockrelation_v',
            subGrid14: 'planbudget_v',
            subGrid15: 'adminorg_v',
            subGrid16: 'factory_v',
            subGrid17: 'plancenter_v'
        };

        this
            .props
            .modal
            .show('orgversion', {
                content: <Orgunitversion {...{config:config}}/>,
                userControl: false //自己控制什么时候关闭窗口
                //beSureBtnClick:this.onSetUnitOrgRoot.bind(this)
            })
    }

    //行操作双击事件
    ncOnRowDoubleClick(record, index, event) {
        let pk_org = record.values['pk_org'].value;
        setDefData('orgunit_needquerydata_' + pk_org, this.props.config.datasource, false);
        setDefData('orgunit_pk_org', this.props.config.datasource, pk_org);
        setDefData('orgunit_code', this.props.config.datasource, record.values['code'].value);
        setDefData('orgunit_name', this.props.config.datasource, record.values['name'].value);
        setDefData('orgunit_shortname', this.props.config.datasource, record.values['shortname'].value);
        setDefData('orgunit_btnopr', this.props.config.datasource, 'linkedline');
        setDefData('orgunit_pk_accperiodscheme',this.props.config.datasource,record.values['pk_accperiodscheme'].value);
        this
            .props
            .pushTo('/card', {
                status: 'browse',
                pagecode: this.props.config.cardpagecode,
                appcode: this.props.config.appcode,
                pk_org: pk_org //列表卡片传参
            });
    }

    render() {
        //if(!this.state.inlt)return '';
        let {
            cardTable,
            form,
            button,
            modal,
            cardPagination,
            table,
            editTable,
            search,
            DragWidthCom,
            syncTree,
            treeTableManyCol
        } = this.props;
        const {createCardPagination} = cardPagination;
        let buttons = this
            .props
            .button
            .getButtons();
        let {createForm} = form;
        let {createCardTable} = cardTable;
        let {createButtonApp} = button;
        let {createModal} = modal;
        let {createSimpleTable} = table;
        let {createSyncTree} = syncTree;
        let {treeTableCol} = treeTableManyCol;
        let {NCCreateSearch} = search;
        let {createEditTable} = editTable;
        console.log(getDefData('orgunit_pk_org', this.config.datasource));
        return (
            
            <div className="nc-single-table">
                {createModal('distrib')}
                {createModal('delModal')}
                {createModal('confirmModal')}
                {/* 头部 header */}
                <div className="nc-bill-header-area">
                    {/* 标题 title */}
                    <div className="header-title-search-area">
                        <div className="header orgunit-header">
                            <h2 className="title">{this.state.json['10100ORG-000098']}</h2>
                            <span className="showOff">
                                <NCCheckbox
                                    onChange={this
                                    .onCheckShowDisable
                                    .bind(this)}
                                    checked={this.state.checked}>{this.state.json['10100ORG-000097']/* 国际化处理： 显示停用*/}</NCCheckbox>
                            </span>
                            {/* 按钮区  btn-group */}
                            <div className="header-button-area" style={{position:'absolute',right:'20px',top:'10px'}}>
                                {createButtonApp({
                                    area: 'header-button-area',
                                    buttonLimit: 5,
                                    onButtonClick: buttonClick.bind(this),
                                    popContainer: document.querySelector('.header-button-area')
                                })}
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="nc-singleTable-search-area">
                   {NCCreateSearch(this.props.config.searchId, {
                        clickSearchBtn: onClickSearchBtn.bind(this),
                        oid: getDefData('orgunit_searchoid', this.config.datasource) //cacheTools.get('orgunit_searchoid')
                    })}
                </div>
                {/* 列表区 */}
                <div className="nc-singleTable-table-area">
                    <div className="treeTableCol">
                        <div className="version-head biaoge">
                            {treeTableCol(this.props.config.gridId, {
                                async: false, //数据同步加载为false,异步加载为true
                                showCheckBox: true,
                                checkboxChange: this
                                    .checkboxChange
                                    .bind(this), //新增勾选onChange事件
                                checkedType: 'checkbox',
                                ncOnRowDoubleClick: this
                                    .ncOnRowDoubleClick
                                    .bind(this),
                                defaultExpandAll: true, //初始化展开所有节点  ，默认参数为false,不展开
                                scrollConfig: {
                                    x: '130%',
                                    y: '400px'
                                }
                            })}
                        </div>
                    </div>

                </div>
                {createModal('org_v', {
                    title: this.state.json['10100ORG-000056'],
                    /* 国际化处理： 版本化*/
                    content: function () {
                        return (
                            <div>
                                <div>
                                    {createForm('org_v_head')}
                                    <div
                                        className="nc-singleTable-table-area"
                                        style={{
                                        marginTop: '10px'
                                    }}>
                                        {createSimpleTable('org_v', {
                                            onRowDoubleClick: this
                                                .onRowDoubleClick
                                                .bind(this),
                                            showIndex: true
                                        })}</div>
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl: false, //自己控制什么时候关闭窗口
                    noFooter: false, //是否需要底部按钮,默认true
                    beSureBtnClick: this
                        .onSaveVersion
                        .bind(this)
                })}
                {createModal('financeorg_v', {
                    content: function () {
                        return (
                            <div>
                                <div>
                                    {createForm('financeorg_v')}
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    //className:'senior',
                    userControl: false, //自己控制什么时候关闭窗口
                    noFooter: false, //是否需要底部按钮,默认true
                    beSureBtnClick: this
                        .onSaveFinanceVersion
                        .bind(this)
                })}
                {createModal('orgmanager', {
                    title: this.state.json['10100ORG-000057'],
                    /* 国际化处理： 组织主管*/
                    className: 'zuzhi',
                    content: function () {
                        return (
                            <div>
                                <div
                                    style={{
                                    height: 45,
                                    marginTop: -15
                                }}>
                                    <div
                                        style={{
                                        position: 'relative',
                                        height: '100%'
                                    }}>
                                        <div className='orgmanager-button-parent'>
                                            {createButtonApp({
                                                area: 'orgmanager-button-area',
                                                buttonLimit: 5,
                                                onButtonClick: this
                                                    .onOrgManageButtonClick
                                                    .bind(this),
                                                popContainer: document.querySelector('.orgmanager-button-area')
                                            })}
                                        </div>
                                        <span className='orgmanager-button-text'>
                                            {this.state.json['10100ORG-000088']}:{getDefData('orgunit_name', this.config.datasource)/* 国际化处理： 所属组织*/}
                                        </span>
                                    </div>
                                </div>

                                {createEditTable('orgmanager', {
                                    // onCloseModel:this.onCloseTableModel.bind(this),
                                    // tableModelConfirm:this.onModelConfirm.bind(this),
                                    onAfterEvent: this
                                        .onTableModelAfterEdit
                                        .bind(this),
                                    //statusChange: this.gridStatusChange.bind(this),
                                    onSelected: () => {
                                        let data = this
                                            .props
                                            .editTable
                                            .getCheckedRows('orgmanager');
                                        if (data.length > 0) {
                                            this
                                                .props
                                                .button
                                                .setButtonDisabled(['orgmanagedel'], false);
                                        } else {
                                            this
                                                .props
                                                .button
                                                .setButtonDisabled(['orgmanagedel'], true);
                                        }
                                    },
                                    onSelectedAll: () => {
                                        let data = this
                                            .props
                                            .editTable
                                            .getCheckedRows('orgmanager');
                                        if (data.length > 0) {
                                            this
                                                .props
                                                .button
                                                .setButtonDisabled(['orgmanagedel'], false);
                                        } else {
                                            this
                                                .props
                                                .button
                                                .setButtonDisabled(['orgmanagedel'], true);
                                        }
                                    },
                                    //selectedChange:this.gridBeChecked.bind(this),
                                    showCheck: true,
                                    showIndex: true
                                })}

                            </div>
                        )
                    }.bind(this)(),
                    userControl: true, //自己控制什么时候关闭窗口
                    noFooter: true, //是否需要底部按钮,默认true
                    cancelBtnClick: () => { //无法控制是否关闭模态框
                        promptBox({
                            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.state.json['10100ORG-000100'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.state.json['10100ORG-000002'],
                            /* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () => {
                                this
                                    .props
                                    .modal
                                    .close('orgmanager');
                                this
                                    .props
                                    .editTable
                                    .setStatus('orgmanager', 'browse');
                            }
                        })
                        // this.props.modal.show('warning',{     beSureBtnClick:()=>{
                        // this.props.modal.close('orgvatfunclet');
                        // this.props.modal.close('warning');     } });
                    }
                    //beSureBtnClick:this.onSaveOrgManager.bind(this)
                })}
                {createModal('orgmoduleperiod', {
                    title: this.state.json['10100ORG-000058'],
                    /* 国际化处理： 批量设置业务期初期间*/
                    className: 'piliang',
                    content: function () {
                        return (
                            <div>
                                <div
                                    style={{
                                    height: 45,
                                    marginTop: -10
                                }}>
                                    <div
                                        style={{
                                        position: 'relative',
                                        height: '100%'
                                    }}>
                                        <div
                                            style={{
                                            position: 'absolute',
                                            height: '100%',
                                            right: 0,
                                            top: 5
                                        }}>
                                            {createButtonApp({
                                                area: 'period-button-area',
                                                buttonLimit: 5,
                                                onButtonClick: this
                                                    .onOrgPeirodButtonClick
                                                    .bind(this),
                                                popContainer: document.querySelector('.period-button-area')
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {createEditTable('orgmoduleperiod', {
                                    // onCloseModel:this.onCloseTableModel.bind(this),
                                    // tableModelConfirm:this.onModelConfirm.bind(this),
                                    // onAfterEvent:this.onTableModelAfterEdit.bind(this), statusChange:
                                    // this.gridStatusChange.bind(this),
                                    // selectedChange:this.gridBeChecked.bind(this), showCheck:true,
                                    onBeforeEvent: this
                                        .onPeriodBeforeEvent
                                        .bind(this),
                                    showIndex: true
                                })}
                            </div>
                        )
                    }.bind(this)(),
                    userControl: true, //自己控制什么时候关闭窗口
                    noFooter: true, //是否需要底部按钮,默认true
                    cancelBtnClick: () => { //无法控制是否关闭模态框
                        promptBox({
                            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.state.json['10100ORG-000100'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.state.json['10100ORG-000002'],
                            /* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () => {
                                this
                                    .props
                                    .modal
                                    .close('orgmoduleperiod');
                                this
                                    .props
                                    .editTable
                                    .setStatus('orgmoduleperiod', 'browse');
                            }
                        })
                        // this.props.modal.show('warning',{     beSureBtnClick:()=>{
                        // this.props.modal.close('orgvatfunclet');
                        // this.props.modal.close('warning');     } });
                    },
                    beSureBtnClick: this
                        .onSaveOrgPeriod
                        .bind(this)
                })}
                {createModal('innercustsupp', {
                    title: this.state.json['10100ORG-000059'],
                    /* 国际化处理： 生成内部客商*/
                    content: function () {
                        return (
                            <div>
                                <div>
                                    {createForm('innercustsupp', {
                                        setVisibleByForm:true,
                                        onAfterEvent: this
                                            .afterInnercustEvent
                                            .bind(this)
                                    })}
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl: true, //自己控制什么时候关闭窗口
                    className: 'combine',
                    noFooter: false, //是否需要底部按钮,默认true
                    cancelBtnClick: () => { //无法控制是否关闭模态框
                        promptBox({
                            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.state.json['10100ORG-000100'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.state.json['10100ORG-000002'],
                            /* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () => {
                                this
                                    .props
                                    .modal
                                    .close('innercustsupp');
                                this
                                    .props
                                    .form
                                    .setFormStatus('innercustsupp', 'browse');
                            }
                        })
                        // this.props.modal.show('warning',{     beSureBtnClick:()=>{
                        // this.props.modal.close('orgvatfunclet');
                        // this.props.modal.close('warning');     } });
                    },
                    beSureBtnClick: this
                        .onSaveOrgInnercust
                        .bind(this)
                })}
                {createModal('orgvatfunclet', {
                    title: this.state.json['10100ORG-000060'],
                    /* 国际化处理： VAT维护*/
                    content: function () {
                        return (
                            <div>
                                <div
                                    style={{
                                    height: 45,
                                    marginTop: -10
                                }}>
                                    <div
                                        style={{
                                        position: 'relative',
                                        height: '100%'
                                    }}>
                                        <div
                                            style={{
                                            position: 'absolute',
                                            height: '100%',
                                            right: 0,
                                            top: 5
                                        }}>
                                            {createButtonApp({
                                                area: 'vat-button-area',
                                                buttonLimit: 5,
                                                onButtonClick: this
                                                    .onOrgVATButtonClick
                                                    .bind(this),
                                                popContainer: document.querySelector('.vat-button-area')
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {createEditTable('orgvatfunclet', {
                                    //onBeforeEvent:this.onPeriodBeforeEvent.bind(this),
                                    onAfterEvent: this
                                        .onVATTableModelAfterEdit
                                        .bind(this),
                                    onSelected: () => {
                                        let checkdata = this
                                            .props
                                            .editTable
                                            .getCheckedRows('orgvatfunclet');
                                        if (checkdata.length > 0) {
                                            this
                                                .props
                                                .button
                                                .setButtonDisabled(['vatdel'], false);
                                            this
                                                .props
                                                .button
                                                .setButtonDisabled(['vatlinedel'], false);
                                        } else {
                                            this
                                                .props
                                                .button
                                                .setButtonDisabled(['vatdel'], true);
                                            this
                                                .props
                                                .button
                                                .setButtonDisabled(['vatlinedel'], true);
                                        }
                                    },
                                    onSelectedAll: () => {
                                        let checkdata = this
                                            .props
                                            .editTable
                                            .getCheckedRows('orgvatfunclet');
                                        if (checkdata.length > 0) {
                                            this
                                                .props
                                                .button
                                                .setButtonDisabled(['vatdel'], false);
                                            this
                                                .props
                                                .button
                                                .setButtonDisabled(['vatlinedel'], false);
                                        } else {
                                            this
                                                .props
                                                .button
                                                .setButtonDisabled(['vatdel'], true);
                                            this
                                                .props
                                                .button
                                                .setButtonDisabled(['vatlinedel'], true);
                                        }
                                    },
                                    showIndex: true,
                                    showCheck: true,
                                    isAddRow:true
                                })}
                            </div>
                        )
                    }.bind(this)(),
                    userControl: true, //自己控制什么时候关闭窗口
                    beSureBtnClick: this
                        .onSaveOrgVAT
                        .bind(this),
                    noFooter: true, //是否需要底部按钮,默认true
                    cancelBtnClick: () => { //无法控制是否关闭模态框
                        promptBox({
                            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.state.json['10100ORG-000100'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.state.json['10100ORG-000002'],
                            /* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () => {
                                this
                                    .props
                                    .modal
                                    .close('orgvatfunclet');
                                this
                                    .props
                                    .editTable
                                    .setStatus('orgvatfunclet', 'browse');
                            }
                        })
                        // this.props.modal.show('warning',{     beSureBtnClick:()=>{
                        // this.props.modal.close('orgvatfunclet');
                        // this.props.modal.close('warning');     } });
                    }
                })}

                {createModal('orgdept', {
                    title: this.state.json['10100ORG-000061'],
                    /* 国际化处理： 业务单元关联部门*/
                    className: '',
                    content: function () {
                        return (
                            <div className="tree-table">
                                <DragWidthCom //业务单元树
                                    leftDom= { <div className="tree-area-dept"> {createSyncTree({ treeId:'orgunittree', showLine:true, // clickEditIconEveclickEditIconEve: this.onEditSys.bind(this), //编辑点击 回调 //clickDelIconEve: this.onDeleteSysEve.bind(this), // 删除点击 回调 // clickAddIconEve: this.onAdd.bind(this), //新增点击 回调 
                                    onSelectEve: this.onSelectEve.bind(this), //选择节点回调方法 
                                    defaultExpandAll:true, //初始化展开所有节点 ，默认参数为false,不展开 
                                    onMouseEnterEve:this.onMouseEnterSortTreeEve.bind(this),//鼠标滑过节点事件
                                     showModal:false })} </div> } //部门---树状表
                                    rightDom= { 
                                        <div className="treeTableCol"> 
                                            <div className="version-head"> 
                                                { treeTableCol( 'orgdept',{ async:false, //数据同步加载为false,异步加载为true //showCheckBox:true, //checkedType:'radio', 
                                                                    defaultExpandAll:true, //初始化展开所有节点 ，默认参数为false,不展开 
                                                                    } ) } 
                                            </div> 
                                                                </div> } 
                                        defLeftWid='30%' // 默认左侧区域宽度，px/百分百 
                                />
                            </div>
                        )
                    }.bind(this)(),
                    userControl: false, //自己控制什么时候关闭窗口
                    //beSureBtnClick:this.onSaveOrgVAT.bind(this)
                })}
                {
                    this.state.showUploader &&
                    <NCUploader
                    // billId={cacheTools.get('pk_org')}
                    billId = {
                        'uapbd/null/' + getDefData('orgunit_pk_org', this.config.datasource)
                    }
                    //billNo={'001'} target={target}
                    placement = {
                        'bottom_right'
                    }
                    multiple = {
                        true
                    }
                    onHide = {
                        this.onHideUploader.bind(this)
                    }
                    //beforeUpload={this.beforeUpload}
                    />}

                    {this.state.showlogoUploader &&<NCUploader
                    // billId={cacheTools.get('pk_org')}
                    billId = {
                        'logo/' + getDefData('orgunit_pk_org', this.config.datasource)
                    }
                    //billNo={'001'} target={target}
                    placement = {
                        'bottom_right'
                    }
                    multiple = {
                        false
                    }
                    beforeUpload = {
                        this
                            .beforeUpload
                            .bind(this)
                    }
                    onHide = {
                        this
                            .onHideUploader
                            .bind(this)
                    }
                    //onHide={this.onHideUploader}
                    />
                }

                {createModal('setorgroot', {
                    title: this.state.json['10100ORG-000027'],
                    /* 国际化处理： 提示*/
                    content: this.state.json['10100ORG-000028'],
                    /* 国际化处理： 您确定要设置成根业务单元吗？*/
                    userControl: false, //自己控制什么时候关闭窗口
                    noFooter: false, //是否需要底部按钮,默认true
                    beSureBtnClick: this
                        .onSetUnitOrgRoot
                        .bind(this)
                })}
                {createModal('setadminorgroot', {
                    title: this.state.json['10100ORG-000027'],
                    /* 国际化处理： 提示*/
                    content: this.state.json['10100ORG-000030'],
                    /* 国际化处理： 您确定要设置成根行政组织吗？*/
                    userControl: false, //自己控制什么时候关闭窗口
                    noFooter: false, //是否需要底部按钮,默认true
                    beSureBtnClick: this
                        .onSetAdminOrgRoot
                        .bind(this)
                })}
                {createModal('setcorproot', {
                    title: this.state.json['10100ORG-000027'],
                    /* 国际化处理： 提示*/
                    content: this.state.json['10100ORG-000029'],
                    /* 国际化处理： 您确定要设置成根公司吗？*/
                    userControl: false, //自己控制什么时候关闭窗口
                    noFooter: false, //是否需要底部按钮,默认true
                    beSureBtnClick: this
                        .onSetCorpRoot
                        .bind(this)
                })}
                {<PrintOutput ref='printOutput' url='/nccloud/uapbd/org/print.do' data={{
                    funcode: '10100ORG', //功能节点编码，即模板编码 nodekey:'listPrint', //模板节点标识 oids: this.state.pks, //或['1001A41000000000A9LR','1001A410000000009JDD'] 单据pk oids含有多个元素时为批量打印, outputType: "output" }} //callback={this.onSubmit
                }}></PrintOutput>}
                <div className='orgversion-table'>
                    {createModal('orgversion', {
                        noFooter: false, //是否需要底部按钮,默认true
                    })}
                </div>
                {createModal('delete')}
                {createModal('confirm')}
                {createModal('warning', {
                    title: this.state.json['10100ORG-000062'],
                    /* 国际化处理： 关闭提醒*/
                    content: this.state.json['10100ORG-000063'],
                    /* 国际化处理： 是否确定要关闭？*/
                })}
            </div>
        )
    }
}



let OrgunittablePage = createPage({
    mutiLangCode: '10100ORG'
})(Orgunittable);

export default OrgunittablePage;

//DmR57rzXMxNiyqM2pakwj8kHl8hMfgofl74tyedocwixTKUZfo+98VpQWV8bVVN4