//qWNFZPKLBwQhyupqlt1oLBGLprJoTtn0N1vzJtcOt534/0B7y1P97cyCdhV3glI0
/**
 * 组织关系公共代码
 * @author	yinshb
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,cacheTools,promptBox,createPageIcon } from 'nc-lightapp-front';
import  Utils from '../../public/utils';
import Transfer from '../../public/excomponents/Transfer';
import { Table } from '../../public/excomponents';
import './common.less';
const {NCStep,NCRadio,NCDiv} = base;
const NCSteps = NCStep.NCSteps;
const tableid = 'orgrelation';
var pagecode = '10100ORFF_orgrelation';
var urls = {
    save : '/nccloud/uapbd/org/OrgRelationSave.do',
    query : '/nccloud/uapbd/org/OrgRelationQuery.do',
    updateAttr : '/nccloud/uapbd/org/OrgRelationUpdateAttr.do',
    LoadOrgTree : '/nccloud/uapbd/org/LoadOrgTreeForRelation.do',
    batchAddSave : '/nccloud/uapbd/org/batchAddSave.do',
    queryTemp : '/nccloud/uapbd/org/OrgRelationTypeQuery.do',
    OrgRelationEnable : '/nccloud/uapbd/org/OrgRelationEnable.do',
    OrgRelationDisable : '/nccloud/uapbd/org/OrgRelationDisable.do',
    judgeOrgType : '/nccloud/uapbd/org/judgeOrgType.do'
};
let keys = ['pk_relationtype','enablestate','sourceentity','targetentity'];  //过来空行时，忽略的字段




class OrgRelation extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.config = props.config;
        this.state = {
            searchValue: '',
            searchDisable: false,				//简单搜索框是否禁用	true：禁用		false：可用
            showOffDisable: false,			//显示停用复选框是否禁用	true：禁用		false：可用
            isShowOff: false,				//列表是否显示停用数据
            currentStep: 0,
            oprType: '0',
            batchAddData: {}
        }
        pagecode = this.config.pagecode;
        //this.props.meta.setMeta(this.config.templateMeta);
    }

    componentWillUpdate() {
        if (this.props.editTable.getStatus(tableid) === 'edit') {
            window.onbeforeunload = () => {
                return this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000000')
                /* 国际化处理： 页面还没有保存，确定离开页面？*/
            }
        } else {
            window.onbeforeunload = null;
        }
    }

    componentDidMount() {
        this.getData(false, (data, props) => {
            if (data.model == undefined) return;
            data.model.rows.forEach(function (item, index) {
                if (item.values["attr_ISRECEIVE00000000000"] == undefined) {
                    props.editTable.setEditableRowKeyByIndex(tableid, index, 'attr_RECEIVEDEFAULT000000', false)
                } else {
                    props.editTable.setEditableRowKeyByIndex(tableid, index, 'attr_RECEIVEDEFAULT000000', true)
                }

                if (item.values["attr_ISSEND00000000000000"] == undefined) {
                    props.editTable.setEditableRowKeyByIndex(tableid, index, 'attr_SENDDEFAULT000000000', false)
                } else {
                    props.editTable.setEditableRowKeyByIndex(tableid, index, 'attr_SENDDEFAULT000000000', true)
                }
            });
        });
    }

    //请求列表数据
    getData = (showOff, callback) => {
        //let showOff = this.state.isShowOff;
        //如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
        ajax({
            url: urls['query'],
            data: {
                "pageid": pagecode,
                "showSealDataFlag": showOff,
                "OrgRelationTypeID": this.config.OrgRelationTypeID
            },
            success: (res) => {
                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    props.dealFormulamsg(
                        res.formulamsg,  //参数一：返回的公式对象
                        {                //参数二：界面使用的表格类型
                            [tableid]: "editTable",
                        }
                    );
                }

                let {success, data} = res;
                if (success && data && data.model) {
                    Utils.convertGridEnablestate(data.model.rows);
                    data.model.rows.forEach(function (item, index) {
                        if (item.values['attrs'] && item.values['attrs'].value) {
                            item.values['attrs'].value.forEach(element => {
                                data.model.rows[index].values['attr_' + element.pk_associateattr] = {value: true};
                            });
                        }
                    });
                    cacheTools.set(this.config.cacheId, data.model);
                    this.props.editTable.setTableData(tableid, data.model);
                    if (data.model.rows.length > 0) {
                        this.props.button.setDisabled({
                            Edit: false
                        });
                    } else {
                        this.props.button.setDisabled({
                            Edit: true
                        });
                    }
                } else {
                    let d = {
                        areacode: 'orgrelation', rows: []
                    }
                    cacheTools.set(this.config.cacheId, d);
                    this.props.editTable.setTableData(tableid, d);
                    this.props.button.setDisabled({
                        Edit: true
                    });
                }
                callback && callback(data, this.props);
            }
        });
    };

    //表格编辑后事件
    onAfterEvent = (props, moduleId, key, changerows, value, index, data) => {
        //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
        if (this.config.OrgRelationTypeID === 'PURSTOCKCONSIGN00000') { //采购业务委托关系
            if (key === 'sourcer' && value.length === 1 && (!data.values['default1'] || !data.values['default1'].value)) {
                ajax({
                    url: urls['judgeOrgType'],
                    data: {pk_org: value[0].newvalue.value, pk_orgtype: 'FINANCEORGTYPE000000'},
                    success: (res) => {
                        if (res && res.data && res.data.result) {
                            this.props.editTable.setValByKeyAndIndex(tableid, index, 'default1', {
                                value: changerows[0].refpk,
                                display: changerows[0].refname
                            });
                            if (!data.values['default2'] || !data.values['default2'].value) {
                                this.props.editTable.setValByKeyAndIndex(tableid, index, 'default2', {
                                    value: changerows[0].refpk,
                                    display: changerows[0].refname
                                });
                            }
                        }
                    }
                })
            } else if (key === 'default1') {
                if (!data.values['default2'] || !data.values['default2'].value) {
                    this.props.editTable.setValByKeyAndIndex(tableid, index, 'default2', {
                        value: changerows.refpk,
                        display: changerows.refname
                    });
                }
            }
        } else if (this.config.OrgRelationTypeID === 'SALESTOCKCONSIGN0000') {//销售业务委托关系
            if (key === 'target' && value.length === 1 && (!data.values['default1'] || !data.values['default1'].value)) {
                ajax({
                    url: urls['judgeOrgType'],
                    data: {pk_org: value[0].newvalue.value, pk_orgtype: 'FINANCEORGTYPE000000'},
                    success: (res) => {
                        if (res && res.data && res.data.result) {
                            this.props.editTable.setValByKeyAndIndex(tableid, index, 'default1', {
                                value: changerows.refpk,
                                display: changerows.refname
                            });
                            if (!data.values['default2'] || !data.values['default2'].value) {
                                this.props.editTable.setValByKeyAndIndex(tableid, index, 'default2', {
                                    value: changerows.refpk,
                                    display: changerows.refname
                                });
                            }
                        }
                    }
                });
            } else if (key === 'default1') {
                if (!data.values['default2'] || !data.values['default2'].value) {
                    this.props.editTable.setValByKeyAndIndex(tableid, index, 'default2', {
                        value: changerows.refpk,
                        display: changerows.refname
                    });
                }
            }
        } else if (this.config.OrgRelationTypeID === 'FUNDORGUNITCONSIGN00') {//资金管理代理关系

        } else if (this.config.OrgRelationTypeID === 'SHIPPERASSETCONSIGN0') {//货主委托关系
            if (key === 'sourcer' && value.length === 1) {
                ajax({
                    url: urls['judgeOrgType'],
                    data: {pk_org: value[0].newvalue.value, pk_orgtype: 'ASSETORGTYPE00000000'},
                    success: (res) => {
                        if (res && res.data && res.data.result) {
                            this.props.editTable.setValByKeyAndIndex(tableid, index, 'target', {
                                value: changerows[0].refpk,
                                display: changerows[0].refname
                            });
                        }
                    }
                });
                ajax({
                    url: urls['judgeOrgType'],
                    data: {pk_org: value[0].newvalue.value, pk_orgtype: 'FINANCEORGTYPE000000'},
                    success: (res) => {
                        if (res && res.data && res.data.result) {
                            this.props.editTable.setValByKeyAndIndex(tableid, index, 'default1', {
                                value: changerows[0].refpk,
                                display: changerows[0].refname
                            });
                        }
                    }
                });
            }
        } else if (this.config.OrgRelationTypeID === 'USERASSETCONSIGN0000') {//使用权业务委托关系
            if (key === 'sourcer' && value.length === 1) {
                ajax({
                    url: urls['judgeOrgType'],
                    data: {pk_org: value[0].newvalue.value, pk_orgtype: 'ASSETORGTYPE00000000'},
                    success: (res) => {
                        if (res && res.data && res.data.result) {
                            this.props.editTable.setValByKeyAndIndex(tableid, index, 'target', {
                                value: changerows[0].refpk,
                                display: changerows[0].refname
                            });
                        }
                    }
                });
            }
        }else if(this.config.OrgRelationTypeID === 'ITEMSTOCKCONSIGN0000'){
            if (key === 'isdefault' && index >= 0) {
                var reqdata = {
                    OrgRelationTypeID: this.config.OrgRelationTypeID,
                    pageid: pagecode,
                    model: {
                        areaType: "table",
                        areacode: tableid,
                        pageinfo: null,
                        rows: []
                    }
                }//data
                var allrows = this.props.editTable.getAllRows(tableid);
                var indexrow = allrows[index];
                if (indexrow.rowid === data.rowid) {
                    indexrow.values.isdefault.value = data.values.isdefault.value;
                    indexrow.status = data.status;
                    reqdata.model.rows = Utils.convertGridEnablestateToSave([indexrow]);
                }
                let updateIsDefault = () => {
                    ajax({
                        url: urls['save'],
                        data: reqdata,
                        success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                            if (res.success) {
                                if (res.data && res.data.returnMsg) {
                                    promptBox({
                                        color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                        title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000010'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                                        content: res.data.returnMsg,             // 提示内容,非必输
                                        noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                        noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                                        beSureBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000011'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 是*/
                                        cancelBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000012'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 否*/
                                        beSureBtnClick: this.beSureSave
                                    });
                                } else {
                                    if (res.data) {
                                        this.getData(this.state.isShowOff, () => {
                                            //提示信息
                                            toast({
                                                title: this.props.MutiInit.getIntl("orgrelation"),
                                                color: 'success'
                                            });
                                            /* 国际化处理： 修改成功*/
                                        });
                                    }
                                }
                            }
                        },
                        error: (res) => {
                            //出错时自动调整回原先值
                            this.props.editTable.setValByKeyAndIndex(tableid, index, 'isdefault', {value: !data.values['isdefault'].value});
                            toast({
                                color: 'danger',
                                content: res.message,
                                title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000003')
                            });
                            /* 国际化处理： 出错啦！*/
                        }
                    });//ajax
                }
                updateIsDefault();
                //this.props.validateToSave(reqdata,updateIsDefault,{[tableid]:'table'},'grid');
            } else if (key === 'sourcer') {
                if (value.length > 1) {//一次选择多个维修组织值
                    let itemvalues = data.values['sourcer'].value.split(',');
                    let itemdisplays = data.values['sourcer'].display.split(',');
                    this.props.editTable.setValByKeyAndIndex(tableid, index, 'sourcer', {
                        value: itemvalues[0],
                        display: itemdisplays[0]
                    });
                    this.props.editTable.filterEmptyRows(tableid, keys.concat(this.config.dynColumn));
                    for (let i = 1; i < itemvalues.length; i++) {
                        let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
                        this.props.editTable.addRow(tableid, num, true);
                        this.config.setRowDefaultValue(props, num);
                        this.props.editTable.setValByKeyAndIndex(tableid, num, 'sourcer', {
                            value: itemvalues[i],
                            display: itemdisplays[i]
                        });
                        this.props.editTable.setEditableRowKeyByIndex(tableid, num, 'entity1', false);
                        this.props.editTable.setValByKeyAndIndex(tableid, num, 'entity1', {value: null, display: null});
                    }
                }
            } else if (key === 'target') {

                if (value.length === 0) { //length为0设置entity1内容不可用
                    this.props.editTable.setEditableByKey(tableid, data.rowid, 'entity1', false);
                    this.props.editTable.setValByKeyAndIndex(tableid, index, 'entity1', {value: null, display: null});
                } else if (value.length === 1) {//设置entity1不可用
                    if (value[0].oldvalue !== value[0].newvalue) {
                        this.props.editTable.setValByKeyAndIndex(tableid, index, 'entity1', {
                            value: null,
                            display: null
                        });
                    }
                    if (value[0].newvalue.value) {
                        this.props.editTable.setEditableByKey(tableid, data.rowid, 'entity1', true);
                    } else {
                        this.props.editTable.setEditableByKey(tableid, data.rowid, 'entity1', false);
                    }
                }
            }else if (key === 'entity1') {
                if (!data.values['entity1'] || !data.values['entity1'].value) {
                    this.props.editTable.setValByKeyAndIndex(tableid, index, 'entity1', {
                        value: changerows.refpk,
                        display: changerows.refname
                    });
                }
            }else if (key === 'entity2') {
                if (!data.values['entity2'] || !data.values['entity2'].value) {
                    this.props.editTable.setValByKeyAndIndex(tableid, index, 'entity2', {
                        value: changerows.refpk,
                        display: changerows.refname
                    });
                }
            }
        } 
        else if (this.config.OrgRelationTypeID === 'MAINTAINSTOCKCONSIGN') {//维修库存业务委托关系
            if (key === 'isdefault' && index >= 0) {

                var reqdata = {
                    OrgRelationTypeID: this.config.OrgRelationTypeID,
                    pageid: pagecode,
                    model: {
                        areaType: "table",
                        areacode: tableid,
                        pageinfo: null,
                        rows: []
                    }
                }//data

                var allrows = this.props.editTable.getAllRows(tableid);
                var indexrow = allrows[index];
                if (indexrow.rowid === data.rowid) {
                    indexrow.values.isdefault.value = data.values.isdefault.value;
                    indexrow.status = data.status;
                    reqdata.model.rows = Utils.convertGridEnablestateToSave([indexrow]);
                }
                // var changerow=Utils.convertGridEnablestateToSave([data]);
                // changerow && (reqdata.model.rows=changerow);
                let updateIsDefault = () => {
                    ajax({
                        url: urls['save'],
                        data: reqdata,
                        success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                            if (res.success) {
                                if (res.data && res.data.returnMsg) {
                                    promptBox({
                                        color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                        title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000010'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                                        content: res.data.returnMsg,             // 提示内容,非必输
                                        noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                        noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                                        beSureBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000011'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 是*/
                                        cancelBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000012'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 否*/
                                        beSureBtnClick: this.beSureSave
                                    });
                                } else {
                                    if (res.data) {
                                        this.getData(this.state.isShowOff, () => {
                                            //提示信息
                                            toast({
                                                title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000081'),
                                                color: 'success'
                                            });
                                            /* 国际化处理： 修改成功*/
                                        });
                                    }
                                }
                            }
                        },
                        error: (res) => {
                            //出错时自动调整回原先值
                            this.props.editTable.setValByKeyAndIndex(tableid, index, 'isdefault', {value: !data.values['isdefault'].value});
                            toast({
                                color: 'danger',
                                content: res.message,
                                title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000003')
                            });
                            /* 国际化处理： 出错啦！*/
                        }
                    });//ajax
                }
                updateIsDefault();
                //this.props.validateToSave(reqdata,updateIsDefault,{[tableid]:'table'},'grid');
            } else if (key === 'sourcer') {
                if (value.length > 1) {//一次选择多个维修组织值
                    let itemvalues = data.values['sourcer'].value.split(',');
                    let itemdisplays = data.values['sourcer'].display.split(',');
                    this.props.editTable.setValByKeyAndIndex(tableid, index, 'sourcer', {
                        value: itemvalues[0],
                        display: itemdisplays[0]
                    });
                    this.props.editTable.filterEmptyRows(tableid, keys.concat(this.config.dynColumn));
                    for (let i = 1; i < itemvalues.length; i++) {
                        let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
                        this.props.editTable.addRow(tableid, num, true);
                        this.config.setRowDefaultValue(props, num);
                        this.props.editTable.setValByKeyAndIndex(tableid, num, 'sourcer', {
                            value: itemvalues[i],
                            display: itemdisplays[i]
                        });
                        this.props.editTable.setEditableRowKeyByIndex(tableid, num, 'entity1', false);
                        this.props.editTable.setValByKeyAndIndex(tableid, num, 'entity1', {value: null, display: null});
                    }
                }
            } else if (key === 'target') {

                if (value.length === 0) { //length为0设置entity1内容不可用
                    this.props.editTable.setEditableByKey(tableid, data.rowid, 'entity1', false);
                    this.props.editTable.setValByKeyAndIndex(tableid, index, 'entity1', {value: null, display: null});
                } else if (value.length === 1) {//设置entity1不可用
                    if (value[0].oldvalue !== value[0].newvalue) {
                        this.props.editTable.setValByKeyAndIndex(tableid, index, 'entity1', {
                            value: null,
                            display: null
                        });
                    }
                    if (value[0].newvalue.value) {
                        this.props.editTable.setEditableByKey(tableid, data.rowid, 'entity1', true);
                    } else {
                        this.props.editTable.setEditableByKey(tableid, data.rowid, 'entity1', false);
                    }
                }
            }

        }else{
        }
        if (key === 'enablestate') {
            let stateUrl = '';
            if (value[0].newvalue.value) {//启用
                stateUrl = urls['OrgRelationEnable'];
            } else {//停用
                stateUrl = urls['OrgRelationDisable'];
            }
            let reqData = [];
            reqData.push(data);
            Utils.convertGridEnablestate(reqData);
            let changDdata = {
                OrgRelationTypeID: this.config.OrgRelationTypeID,
                pageid: pagecode,
                model: {
                    areaType: 'table',
                    pageinfo: null,
                    rows: reqData
                }
            };
            ajax({
                url: stateUrl,
                data: changDdata,
                success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                    let {success, data} = res;
                    if (success) {
                        //操作成功，更新页面当前行数据
                        let allD = this.props.editTable.getAllData(tableid);
                        Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                        Utils.convertGridEnablestate(data.model.rows);
                        data.model.rows.forEach(function (item, index) {
                            if (item.values['attrs'] && item.values['attrs'].value) {
                                item.values['attrs'].value.forEach(element => {
                                    data.model.rows[index].values['attr_' + element.pk_associateattr] = {value: true};
                                });
                            }
                        });
                        Utils.filterResult(allD, data.model.rows);//将保存后返回的数据重新放置到页面
                        this.props.editTable.setTableData(tableid, allD);
                        console.log(data.model.rows[0].values);
                        this.getData(this.state.isShowOff);
                        if (data.model.rows[0].values["enablestate"].value == true) {
                            toast({
                                title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000064'),
                                color: 'success'
                            });
                            /* 国际化处理： 启用成功*/
                        } else {
                            toast({
                                title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000065'),
                                color: 'success'
                            });
                            /* 国际化处理： 停用成功*/
                        }
                        //toast({title:this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000001'),color:'success'});/* 国际化处理： 操作成功*/

                    }
                },
                error: (res) => {
                    //出错时自动调整回原先值
                    this.props.editTable.setValByKeyAndIndex(tableid, index, 'enablestate', {value: !data.values['enablestate'].value});
                    toast({
                        color: 'danger',
                        content: res.message,
                        title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000003')
                    });
                    /* 国际化处理： 出错啦！*/
                }

            });
        } else if (key === 'sourcer' && this.props.config.OrgRelationTypeID !== 'MAINTAINSTOCKCONSIGN') {//维修库存业务委托关系entity1需要根据target进行判断
            if (value.length > 1) {
                let itemvalues = data.values['sourcer'].value.split(',');
                let itemdisplays = data.values['sourcer'].display.split(',');
                this.props.editTable.filterEmptyRows(tableid, keys.concat(this.config.dynColumn));
                this.props.editTable.setValByKeyAndIndex(tableid, index, 'sourcer', {
                    value: itemvalues[0],
                    display: itemdisplays[0]
                });
                for (let i = 1; i < itemvalues.length; i++) {
                    let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
                    this.props.editTable.addRow(tableid, num, true);
                    this.config.setRowDefaultValue(props, num);
                    this.props.editTable.setValByKeyAndIndex(tableid, num, 'sourcer', {
                        value: itemvalues[i],
                        display: itemdisplays[i]
                    });
                }
                if (this.props.config.OrgRelationTypeID === 'ASSETSTOCKCONSIGN000' || this.props.config.OrgRelationTypeID === 'PURSTOCKCONSIGN00000' || this.props.config.OrgRelationTypeID === 'QCSTOCKCONSIGN000000'
                    || this.props.config.OrgRelationTypeID === 'INSTOCKCONSIGN000000' || this.props.config.OrgRelationTypeID === 'OUTSTOCKCONSIGN00000') {//资产库存业务委托关系   采购业务委托关系QCSTOCKCONSIGN000000
                    this.props.editTable.setEditableByKey(tableid, data.rowid, 'entity1', true);
                    if (value[0].oldvalue !== itemvalues[0]) {
                        this.props.editTable.setValByKeyAndIndex(tableid, index, 'entity1', {
                            value: null,
                            display: null
                        });
                    }
                }
            } else if (value.length === 0) {
                this.props.editTable.setEditableByKey(tableid, data.rowid, 'entity1', false);
                this.props.editTable.setValByKeyAndIndex(tableid, index, 'entity1', {value: null, display: null});
            } else if (value.length === 1) {
                if (value[0].oldvalue !== value[0].newvalue) {
                    this.props.editTable.setValByKeyAndIndex(tableid, index, 'entity1', {value: null, display: null});
                }
                if (value[0].newvalue.value) {
                    this.props.editTable.setEditableByKey(tableid, data.rowid, 'entity1', true);
                } else {
                    this.props.editTable.setEditableByKey(tableid, data.rowid, 'entity1', false);
                }
            }
        } else {
            var element = this.config.dynColumn.filter(element => element === key);
            if (element.length != 1) return;
            let req = {
                OrgRelationTypeID: this.config.OrgRelationTypeID,
                pageid: pagecode,
                attr_name: element[0],
                pk_relation: data.values['pk_relation'].value,
                attr_value: data.values[element].value
            };
            let rowid = data.rowid;

            var success = (res) => {
                let {success, data} = res;
                if (!success) return;
                if (!data || !data[tableid]) {
                    toast({
                        content: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000002'),
                        color: 'danger',
                        title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000003')
                    });
                    /* 国际化处理： 操作失败,出错啦！*/
                    return;
                }
                //操作成功，更新页面当前行数据
                let allD = this.props.editTable.getAllData(tableid);
                Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                data[tableid].rows[0].rowid = rowid;
                Utils.convertGridEnablestate(data[tableid].rows);
                data[tableid].rows.forEach(function (item, index) {
                    if (item.values['attrs'] && item.values['attrs'].value) {
                        item.values['attrs'].value.forEach(element => {
                            data[tableid].rows[index].values['attr_' + element.pk_associateattr] = {value: true};
                        });
                    }
                });
                Utils.filterResult(allD, data[tableid].rows);//将保存后返回的数据重新放置到页面
                this.props.editTable.setTableData(tableid, allD);
                toast({
                    title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000001'),
                    color: 'success'
                });
                /* 国际化处理： 操作成功*/
                setTimeout(() => {
                    this.getData(this.state.isShowOff, (data, props) => {
                        if (data.model == undefined) return;
                        data.model.rows.forEach(function (item, index) {
                            if (item.values["attr_ISRECEIVE00000000000"] == undefined) {
                                props.editTable.setEditableRowKeyByIndex(tableid, index, 'attr_RECEIVEDEFAULT000000', false)
                            } else {
                                props.editTable.setEditableRowKeyByIndex(tableid, index, 'attr_RECEIVEDEFAULT000000', true)
                            }

                            if (item.values["attr_ISSEND00000000000000"] == undefined) {
                                props.editTable.setEditableRowKeyByIndex(tableid, index, 'attr_SENDDEFAULT000000000', false)
                            } else {
                                props.editTable.setEditableRowKeyByIndex(tableid, index, 'attr_SENDDEFAULT000000000', true)
                            }
                        });
                    });
                });

            };
            var error = (res) => {
                this.props.editTable.setValByKeyAndIndex(tableid, index, element, {value: !data.values[element].value});
                toast({
                    color: 'danger',
                    content: res.message,
                    title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000003')
                });
                /* 国际化处理： 出错啦！*/
            };
            ajax({
                url: urls['updateAttr'],
                data: req,
                success: success,
                error: error
            });
        }
    }

    //更新按钮状态
    updateButtonStatus = () => {

        //此处控制按钮的隐藏显示及启用状态
        let tableData = this.props.editTable.getCheckedRows(tableid);
        let length = tableData.length;//获取列表页选择数据的行数
        if (length === 0) {//未选择数据
            this.props.button.setDisabled({
                Delete: true
            });
        } else if (length === 1) {//选择一行数据
            this.props.button.setDisabled({
                Delete: false
            });
        } else {//选择多行数据
            this.props.button.setDisabled({
                Delete: false
            });
        }
        if (this.props.editTable.getStatus(tableid) === 'edit') {//编辑状态
            this.props.button.setPopContent('DeleteOpr', '');
            this.props.button.setButtonsVisible({
                Add: true,
                Edit: false,
                Save: true,
                Cancel: true,
                Delete: true,
                BatchAdd: false,
                Refresh: false
            });
            this.props.button.setMainButton({
                'Add': false
            });
            this.setState({
                searchDisable: true,
                showOffDisable: true
            });
        } else {//浏览态
            this.props.button.setPopContent('DeleteOpr', this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000004'));
            /* 国际化处理： 确认删除？*/
            this.props.button.setButtonsVisible({
                Add: true,
                Edit: true,
                Delete: true,
                Save: false,
                Cancel: false,
                BatchAdd: true,
                Refresh: true
            });
            this.props.button.setMainButton({
                'Add': true
            });
            if (this.props.editTable.getAllRows(tableid, true).length > 0) {
                this.props.button.setDisabled({
                    Edit: false
                });
            } else {
                this.props.button.setDisabled({
                    Edit: true
                });
            }
            this.setState({
                searchDisable: false,
                showOffDisable: false
            });
        }
    }

    //显示停用数据
    showOffChange(value) {
        this.setState({
            isShowOff: value
        }, this.getData(value));

    }

    addRowCallback = () => {
        let num = this.props.editTable.getNumberOfRows(tableid);
        this.config.setRowDefaultValue(this.props, num - 1);
        if (this.props.config.OrgRelationTypeID === 'ASSETSTOCKCONSIGN000' || this.props.config.OrgRelationTypeID === 'PURSTOCKCONSIGN00000'
            || this.props.config.OrgRelationTypeID === 'INSTOCKCONSIGN000000' || this.props.config.OrgRelationTypeID === 'OUTSTOCKCONSIGN00000' || this.props.config.OrgRelationTypeID === 'QCSTOCKCONSIGN000000') {
            this.props.editTable.setEditableRowKeyByIndex(tableid, num - 1, 'entity1', false);
        }
    }

    //刷新提示
    refreshSuccess() {
        toast({
            title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000084'),
            color: 'success'
        });
    }

    //按钮点击事件
    onButtonClick(props, id) {
        switch (id) {
            case 'Add':
                let tablestatus = this.props.editTable.getStatus(tableid);
                if (tablestatus !== 'edit') {
                    let allData4Add = this.props.editTable.getAllData(tableid);
                    Utils.convertGridEnablestateToSave(allData4Add.rows);
                    this.props.editTable.setTableData(tableid, allData4Add);
                }
                let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
                this.props.editTable.addRow(tableid, num, true);
                this.config.setRowDefaultValue(props, num);
                if (this.props.config.OrgRelationTypeID === 'ASSETSTOCKCONSIGN000' || this.props.config.OrgRelationTypeID === 'PURSTOCKCONSIGN00000'
                    || this.props.config.OrgRelationTypeID === 'INSTOCKCONSIGN000000' || this.props.config.OrgRelationTypeID === 'OUTSTOCKCONSIGN00000'
                    || this.props.config.OrgRelationTypeID === 'MAINTAINSTOCKCONSIGN' || this.props.config.OrgRelationTypeID === 'QCSTOCKCONSIGN000000'
                    //|| this.props.config.OrgRelationTypeID === 'ITEMSTOCKCONSIGN0000') {
                ){
                    this.props.editTable.setEditableRowKeyByIndex(tableid, num, 'entity1', false);
                }
                break;
            case 'Edit':
                this.props.editTable.setStatus(tableid, 'edit');
                let allData4Edit = this.props.editTable.getAllData(tableid);
                Utils.convertGridEnablestateToSave(allData4Edit.rows);
                this.props.editTable.setTableData(tableid, allData4Edit);
                break;
            case 'Cancel':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000005'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
                    content: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000006'),             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    beSureBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000007'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                    cancelBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000008'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                    beSureBtnClick: () => {
                        this.props.editTable.cancelEdit(tableid, () => {
                            this.updateButtonStatus;
                            let allData4Cancel = this.props.editTable.getAllData(tableid);
                            Utils.convertGridEnablestateToShow(allData4Cancel.rows);
                            this.props.editTable.setTableData(tableid, allData4Cancel);
                        });
                    }
                });
                break;
            case 'Save':
                setTimeout(() => {
                    this.props.editTable.filterEmptyRows(tableid, keys.concat(this.config.dynColumn));
                    let allTableRows = this.props.editTable.getAllRows(tableid, true);
                    if (!this.props.editTable.checkRequired(tableid, allTableRows)) {
                        return;
                    }
                    let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
                    if (!tableData || tableData.length === 0) {
                        //bug fix: NCCLOUD-162863 修改直接保存后，再进行删除操作报错
                         let allData4Save = this.props.editTable.getAllData(tableid);
                        Utils.convertGridEnablestateToShow(allData4Save.rows);
                        this.props.editTable.setTableData(tableid, allData4Save);
                        this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
                        toast({
                            title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000009'),
                            color: 'success'
                        });
                        /* 国际化处理： 保存成功*/
                        return;
                    }
                    let data = {
                        OrgRelationTypeID: this.config.OrgRelationTypeID,
                        pageid: pagecode,
                        model: {
                            areaType: "table",
                            areacode: tableid,
                            pageinfo: null,
                            rows: []
                        }
                    };
                    //Utils.convertGridEnablestate(tableData);
                    let allData4Save = this.props.editTable.getAllData(tableid);
                    //保存的时候应该传修改的行
                    Utils.convertGridEnablestateToSave(tableData)
                    data.model.rows = tableData;
                    let saveFunction = () => {
                        ajax({
                            url: urls['save'],
                            data,
                            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                let {success, data} = res;
                                if (success) {
                                    if (res.data && res.data.returnMsg) {
                                        promptBox({
                                            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                            title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000010'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                                            content: res.data.returnMsg,             // 提示内容,非必输
                                            noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                            noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                                            beSureBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000011'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 是*/
                                            cancelBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000012'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 否*/
                                            beSureBtnClick: this.beSureSave
                                        });
                                    } else {
                                        this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
                                        if (data) {
                                            let allD = this.props.editTable.getAllData(tableid);
                                            Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                                            data.model.rows.forEach(function (item, index) {
                                                if (item.values['attrs'] && item.values['attrs'].value) {
                                                    item.values['attrs'].value.forEach(element => {
                                                        data.model.rows[index].values['attr_' + element.pk_associateattr] = {value: true};
                                                    });
                                                }
                                            });
                                            //Utils.filterResult(allD,Utils.convertGridEnablestate(data.model.rows));//将保存后返回的数据重新放置到页面 Utils.convertGridEnablestate(data.model.rows);
                                            Utils.filterResult(allD, data.model.rows);
                                            Utils.convertGridEnablestateToShow(allD.rows);
                                            cacheTools.set(this.config.cacheId, allD);
                                            this.props.editTable.setTableData(tableid, allD);
                                            toast({
                                                title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000009'),
                                                color: 'success'
                                            });
                                            /* 国际化处理： 保存成功*/
                                        }
                                    }
                                }
                            }
                        });
                    }
                    this.props.validateToSave(data, saveFunction, {[tableid]: 'table'}, 'grid');
                }, 0);
                break;
            case "Delete":
                let selectedData = this.props.editTable.getCheckedRows(tableid);
                if (selectedData.length == 0) {
                    toast({
                        content: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000013'),
                        color: 'warning'
                    });
                    /* 国际化处理： 请选择要删除的数据*/
                    return
                }
                if (this.props.editTable.getStatus(tableid) === 'edit') {//编辑状态
                    let indexArr = [];
                    selectedData.forEach((val) => {
                        indexArr.push(val.index);
                    });
                    this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
                } else {
                    promptBox({
                        color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000014'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
                        content: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000015'),             // 提示内容,非必输/* 国际化处理： 您确认删除所选数据？*/
                        noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                        noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                        beSureBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000007'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
                        cancelBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000008'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
                        beSureBtnClick: this.onDelForBrowse
                    });
                }
                break;
            case "BatchAdd":
                this.props.modal.show('stepModal');
                this.updatestepModalButtonStatus(0);
                ajax({
                    url: urls['LoadOrgTree'],
                    data: {},
                    success: (res) => {
                        let {data} = res;
                        this.state.batchAddData['firstStepData'] = data && data.orgVOs ? data.orgVOs : [];
                        this.state.batchAddData['secondStepData'] = data && data.financeOrgVOs ? data.financeOrgVOs : [];
                        this.state.currentStep = 0;
                        this.state.oprType = '0';
                        this.setState(this.state, () => {
                            this.FirstTransfer.reset(this.state.batchAddData.firstStepData);
                            this.FirstTransfer.setRootTitle(this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000016'));
                            /* 国际化处理： 业务单元*/
                            this.FirstTransfer.setMoveType('0');
                        });
                    }
                });
                break;
            case "Refresh":
                this.getData(this.state.isShowOff, this.refreshSuccess.bind(this));
                break;
            case "Prev":
                let current = this.state.currentStep - 1;
                if (current < 0) current = 0;
                this.setState({
                    currentStep: current
                });
                this.updatestepModalButtonStatus(current);
                break;
            case "Next":
                if (this.state.currentStep === 0) {
                    let firstData = this.FirstTransfer.getData();
                    if (!(firstData && firstData.length > 0)) {
                        toast({
                            color: 'warning',
                            content: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000017')
                        });
                        /* 国际化处理： 请选择业务单元!*/
                        return;
                    } else {
                        this.state.batchAddData.firstData = firstData;
                        this.setState(this.state);
                    }
                } else if (this.state.currentStep === 1) {
                    let secondData = this.SecondTransfer.getData();
                    if (!(secondData && secondData.length > 0)) {
                        toast({
                            color: 'warning',
                            content: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000018')
                        });
                        /* 国际化处理： 请选择财务组织!*/
                        return;
                    } else {
                        this.state.batchAddData.secondData = secondData;
                        this.setState(this.state);
                    }
                }
                current = this.state.currentStep + 1;
                if (current > 2) current = 2;
                this.setState({
                    currentStep: current
                }, () => {
                    if (current === 1) {
                        this.SecondTransfer.setMoveType(this.state.oprType);
                        this.SecondTransfer.setRootTitle(this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000019'));
                        /* 国际化处理： 财务组织*/
                        this.SecondTransfer.reset(this.state.batchAddData.secondStepData);
                    }
                });
                this.updatestepModalButtonStatus(current);
                if (current == 2) {
                    let stepTablData = [];
                    let orgData = [];
                    let financeData = [];
                    this.convertToTable(this.state.batchAddData.firstData, orgData);
                    this.convertToTable(this.state.batchAddData.secondData, financeData);
                    orgData.forEach((item, index) => {
                        financeData.forEach((it, i) => {
                            let row = {
                                pk_org: item.id,
                                org_name: item.name,
                                pk_financeorg: it.id,
                                financeorg_name: it.name,
                                key: String(new Date().getTime()).slice(-5) + Math.random().toString(12) + index + i
                            }
                            stepTablData.push(row);
                        });
                    });
                    setTimeout(() => {
                        this.stepTable.loadData(stepTablData);
                    }, 2);
                }
                break;
            case "Finish":
                if (!this.stepTable.getCheckedRecords() || this.stepTable.getCheckedRecords().length === 0) {
                    toast({
                        content: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000020'),
                        color: 'warning'
                    });
                    /* 国际化处理： 请选择数据*/
                    return
                }
                let stepModalSaveDdata = {
                    OrgRelationTypeID: this.config.OrgRelationTypeID,
                    pageid: pagecode,
                    model: {
                        areaType: "table",
                        pageinfo: null,
                        rows: []
                    }
                };
                let stepModalSaverows = [];
                this.stepTable.getCheckedRecords().forEach((item, index) => {
                    //将选择数据组织为对象数组传递给后台保存
                    let r = {
                        status: '2',
                        rowid: item.getData().key,
                        values: {
                            pk_relationtype: {value: this.config.OrgRelationTypeID},
                            enablestate: {value: '2'},
                            sourceentity: {value: this.config.relationType.associaterules[0].sourceentity},
                            targetentity: {value: this.config.relationType.associaterules[0].targetentity},
                            sourcer: {value: item.getData().pk_org},
                            target: {value: item.getData().pk_financeorg}
                        }
                    }
                    stepModalSaverows.push(r);
                });
                stepModalSaveDdata.model.rows = stepModalSaverows;
                ajax({
                    url: urls['batchAddSave'],
                    data: stepModalSaveDdata,
                    success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                        let {success, data} = res;
                        if (success) {
                            if (res.data && res.data.returnMsg) {
                                this.props.modal.show('savemodal', {
                                    content: res.data.returnMsg,
                                    leftBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000011'), /* 国际化处理： 是*/
                                    rightBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000012'), /* 国际化处理： 否*/
                                    beSureBtnClick: this.beSureBatchSave
                                });
                            } else {
                                let allD = this.props.editTable.getAllData(tableid);
                                let rows = [];
                                if (!allD.rows) {
                                    rows = Utils.convertGridEnablestate(data.model.rows);
                                } else {
                                    rows = allD.rows.concat(Utils.convertGridEnablestate(data.model.rows));
                                }
                                allD.rows = rows;
                                cacheTools.set(this.config.cacheId, allD);
                                this.props.editTable.setTableData(tableid, allD);
                                this.props.modal.close('stepModal');
                                toast({
                                    title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000021'),
                                    color: 'success'
                                });
                                /* 国际化处理： 新增成功*/
                            }
                        }
                    }
                });
                break;
            case "CancelStep":
                this.props.modal.close('stepModal');
                break;
        }

    }

    /**
     * 确认批量保存
     */
    beSureBatchSave = () => {
        if (!this.stepTable.getCheckedRecords() || this.stepTable.getCheckedRecords().length === 0) {
            toast({
                content: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000020'),
                color: 'warning'
            });
            /* 国际化处理： 请选择数据*/
            return
        }
        let stepModalSaveDdata = {
            OrgRelationTypeID: this.config.OrgRelationTypeID,
            pageid: pagecode,
            isBeSureSave: true,
            model: {
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        let stepModalSaverows = [];
        this.stepTable.getCheckedRecords().forEach((item, index) => {
            //将选择数据组织为对象数组传递给后台保存
            let r = {
                status: '2',
                rowid: item.getData().key,
                values: {
                    pk_relationtype: {value: this.config.OrgRelationTypeID},
                    enablestate: {value: '2'},
                    sourceentity: {value: this.config.relationType.associaterules[0].sourceentity},
                    targetentity: {value: this.config.relationType.associaterules[0].targetentity},
                    sourcer: {value: item.getData().pk_org},
                    target: {value: item.getData().pk_financeorg}
                }
            }
            stepModalSaverows.push(r);
        });
        stepModalSaveDdata.model.rows = stepModalSaverows;
        ajax({
            url: urls['batchAddSave'],
            data: stepModalSaveDdata,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    let allD = this.props.editTable.getAllData(tableid);
                    let rows = [];
                    if (!allD.rows) {
                        rows = Utils.convertGridEnablestate(data.model.rows);
                    } else {
                        rows = allD.rows.concat(Utils.convertGridEnablestate(data.model.rows));
                    }
                    allD.rows = rows;
                    cacheTools.set(this.config.cacheId, allD);
                    this.props.editTable.setTableData(tableid, allD);
                    this.props.modal.close('stepModal');
                    toast({
                        title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000021'),
                        color: 'success'
                    });
                    /* 国际化处理： 新增成功*/
                }
            }
        });
    }

    /**
     * 确认保存
     */
    beSureSave = () => {
        this.props.editTable.filterEmptyRows(tableid, keys.concat(this.config.dynColumn));
        let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
        if (!tableData || tableData.length === 0) return
        let data = {
            OrgRelationTypeID: this.config.OrgRelationTypeID,
            pageid: pagecode,
            isBeSureSave: true,
            model: {
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        //Utils.convertGridEnablestate(tableData);
        data.model.rows = tableData;
        ajax({
            url: urls['save'],
            data,
            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                let {success, data} = res;
                if (success) {
                    this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
                    if (data) {
                        let allD = this.props.editTable.getAllData(tableid);
                        Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                        data.model.rows.forEach(function (item, index) {
                            if (item.values['attrs'] && item.values['attrs'].value) {
                                item.values['attrs'].value.forEach(element => {
                                    data.model.rows[index].values['attr_' + element.pk_associateattr] = {value: true};
                                });
                            }
                        });
                        //Utils.filterResult(allD,Utils.convertGridEnablestate(data.model.rows));//将保存后返回的数据重新放置到页面
                        Utils.filterResult(allD, data.model.rows);
                        Utils.convertGridEnablestateToShow(allD.rows);
                        cacheTools.set(this.config.cacheId, allD);
                        this.props.editTable.setTableData(tableid, allD);
                        toast({
                            title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000009'),
                            color: 'success'
                        });
                        /* 国际化处理： 保存成功*/
                    }
                }
            }
        });
    }

    updatestepModalButtonStatus = (current) => {
        if (current === 0) {
            this.props.button.setDisabled({
                Prev: true,
                Next: false,
                Finish: true,
                CancelStep: false
            });
        } else if (current === 1) {
            this.props.button.setDisabled({
                Prev: false,
                Next: false,
                Finish: true,
                CancelStep: false
            });
        } else {
            this.props.button.setDisabled({
                Prev: false,
                Next: true,
                Finish: false,
                CancelStep: false
            });
        }

    }

    /**
     * 组织批量新增委托关系模态框中的分步内容
     */
    getSteps() {
        let {button} = this.props;
        let {createButtonApp} = button;
        const steps = [{
            title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000022')/* 国际化处理： 选择业务单元*/
        }, {
            title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000023')/* 国际化处理： 选择财务组织*/
        }, {
            title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000024')/* 国际化处理： 数据确认*/
        }];
        let lang = {
            leftTreeName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000062')/* 国际化处理： 待选择数据*/,
            rightTreeName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000063')/* 国际化处理： 已选择数据*/,
            rootName: ''
        }
        return (
            <div>
                <NCSteps current={this.state.currentStep}>
                    {steps.map(item => <NCStep key={item.title} title={item.title}/>)}
                </NCSteps>
                <div id="org_transfer" className="steps-content"
                     style={{display: this.state.currentStep === 0 ? '' : 'none'}}>
                    <Transfer ref={(item) => {
                        this.FirstTransfer = item
                    }} showSearch={true} lang={lang}/>
                </div>
                <div id="FinanceOrg_transfer" className="steps-content"
                     style={{display: this.state.currentStep === 1 ? '' : 'none'}}>
                    <Transfer ref={(item) => {
                        this.SecondTransfer = item
                    }} showSearch={true} lang={lang}/>
                </div>
                {this.state.currentStep === 2 && this.getLastContent()}
                {this.state.currentStep != 2 && <div className="steps-radio">
                    <NCRadio.NCRadioGroup
                        name="oprType"
                        selectedValue={this.state.oprType}
                        onChange={this.handleOprTypeChange.bind(this)}>
                        <NCRadio
                            value="0">{this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000030')/* 国际化处理： 包含所有下级*/}</NCRadio>
                        <NCRadio
                            value="1">{this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000031')/* 国际化处理： 仅自己*/}</NCRadio>
                        <NCRadio
                            value="2">{this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000032')/* 国际化处理： 仅直接下级*/}</NCRadio>
                        <NCRadio
                            value="3">{this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000033')/* 国际化处理： 仅末级*/}</NCRadio>
                    </NCRadio.NCRadioGroup>
                </div>}
            </div>
        );
    }

    /**
     * 切换树节点移动方式
     */
    handleOprTypeChange(value) {
        this.setState({
            oprType: value
        });
        this.FirstTransfer.setMoveType(value);
        if (this.state.currentStep > 0) {
            this.SecondTransfer.setMoveType(value);
        }
    }


    /**
     * 将树数据转换为表数据，提供给第三步生成表格数据使用
     */
    convertToTable = (orgTree, data) => {
        orgTree.forEach((item, index) => {
            data.push(item);
            if (item.children && item.children.length > 0) {
                this.convertToTable(item.children, data);
            }
        });
    }

    /**
     * 获取分步中的第三步的页面内容
     */
    getLastContent = () => {

        let tableConfig = {
            columns: [
                {
                    key: 'org_name',
                    dataIndex: 'org_name',
                    title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000016')/* 国际化处理： 业务单元*/
                },
                {
                    key: 'financeorg_name',
                    dataIndex: 'financeorg_name',
                    title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000019')/* 国际化处理： 财务组织*/
                }
            ],
            useFixedHeader: true,
            scroll: {x: true, y: 400},
            checkedModel: {}
        };
        return (
            <div className="steps-content-table orgrelation_steps_content_table_table_init">
                <Table
                    {...tableConfig}
                    ref={(table) => this.stepTable = table}/>
            </div>
        );
    }

    //表头简单筛选
    onSearch(value) {
        this.setState({searchValue: value});
        let allData = Utils.clone(cacheTools.get(this.config.cacheId) ? cacheTools.get(this.config.cacheId) : {});
        if (value.trim() === '') {
            this.getData(this.state.isShowOff);
        } else {
            let rows = Array.of();
            for (var row of allData.rows) {
                if ((row.values['sourcer'].display && row.values['sourcer'].display.indexOf(value) > -1)
                    || (row.values['target'].display && row.values['target'].display.indexOf(value) > -1)) {
                    rows.push(row);
                }
            }
            allData.rows = rows;
        }
        this.props.editTable.setTableData(tableid, allData);
    }

    //浏览态确认删除事件
    onDelForBrowse = () => {
        let selectedData = this.props.editTable.getCheckedRows(tableid);
        let indexArr = [];
        let dataArr = [];
        selectedData.forEach((val) => {
            let delObj = {
                status: '3',
                rowid: val.data.rowid,
                values: val.data.values
            };
            dataArr.push(delObj);
            indexArr.push(val.index);
        });
        Utils.convertGridEnablestate(dataArr);
        let data = {
            OrgRelationTypeID: this.config.OrgRelationTypeID,
            pageid: pagecode,
            model: {
                areaType: 'table',
                pageinfo: null,
                rows: dataArr
            }
        };
        ajax({
            url: urls['save'],
            data,
            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                let {success, data} = res;
                if (success) {
                    this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
                    let allD = this.props.editTable.getAllData(tableid);
                    Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                    cacheTools.set(this.config.cacheId, allD);
                    this.props.editTable.setTableData(tableid, allD);
                    toast({
                        title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000025'),
                        color: 'success'
                    });
                    /* 国际化处理： 删除成功*/
                }
            }
        });
    }

    render() {
        let {table, button, search, editTable, modal, BillHeadInfo} = this.props;
        let {createEditTable} = editTable;
        let {NCCreateSearch} = search;
        let {createButtonApp} = button;
        let {NCFormControl, NCCheckbox} = base;
        let {createModal} = modal;
        const {createBillHeadInfo} = BillHeadInfo;
        return (
            <div className="nc-single-table">
                {/* 标题 title */}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">
                    <div className="header-title-search-area" >
                        {/* {createPageIcon()}
						<h2 className="title-search-detail">{this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get(this.config.title)}</h2> */}
                        {createBillHeadInfo({
                            // title:this.config.title,
                            title:this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get(this.config.title),
                            // this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get(this.config.title)/* 国际化处理： 标题*/,
                            initShowBackBtn: false
                        })}
                        {/* 简单查询 */}
                        <div className="title-search-detail">
                            <NCFormControl
                                placeholder={this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000026')/* 国际化处理： 请输入筛选条件*/}
                                value={this.state.searchValue}
                                onChange={this.onSearch.bind(this)}
                                type="search"
                                disabled={this.state.searchDisable}
                            />
                        </div>
                        {/* 显示停用数据 */}
                        {this.config.isShowOffEnable ? (
                            <div className="title-search-detail">
								<span className="showwOff">
									<NCCheckbox
                                        checked={this.state.isShowOff}
                                        onChange={this.showOffChange.bind(this)}
                                        disabled={this.state.showOffDisable}
                                    >{this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000034')/* 国际化处理： 显示停用*/}</NCCheckbox>
								</span>
                            </div>
                        ) : ('')}
                    </div>
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'list_head',
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')

                        })}
                    </div>
                </NCDiv>
                {/* 列表区 */}
                <div className='nc-singleTable-table-area'>
                    {createEditTable(tableid, {//列表区
                        //onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件
                        onAfterEvent: this.onAfterEvent,                  // 控件的编辑后事件
                        useFixedHeader: true,
                        //onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
                        //onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
                        selectedChange: this.updateButtonStatus,                // 选择框有变动的钩子函数
                        statusChange: () => {
                            setTimeout(() => {
                                this.updateButtonStatus();
                            }, 0)
                        },					//表格状态监听
                        showIndex:true,				//显示序号
                        showCheck:true,			//显示复选框
                        isAddRow:true,
                        addRowCallback: this.addRowCallback,
                        //params: 'test',                                  // 自定义传参
                        adaptionHeight:true
                    })}
                </div>
                {/* 删除前确认模态框 */}
                {createModal('modal', {
                    title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000014'),										//标题/* 国际化处理： 确认删除*/
                    content: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000027'),							//内容/* 国际化处理： 确认删除所选数据？*/
                    beSureBtnClick: this.onDelForBrowse.bind(this),		//确定按钮事件回调
                    //cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
                    leftBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000007'),   								//左侧按钮名称/* 国际化处理： 确定*/
                    rightBtnName: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000008')   								//右侧按钮名称/* 国际化处理： 取消*/
                })}

                {/* 批量新增委托关系模块框 */}
                {createModal('stepModal', {
                    title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000028'),										//标题/* 国际化处理： 批量新增委托关系*/
                    content: this.getSteps.bind(this)(),							//内容
                    noFooter: false,
                    showCustomBtns: true,
                    customBtns: <div className="steps-action">
                        {createButtonApp({
                            area: 'modal_area',
                            buttonLimit: 4,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.steps-action')

                        })}
                    </div>
                })}

                {createModal('savemodal', {
                    title: this.props.MutiInit.getIntl("orgrelation") && this.props.MutiInit.getIntl("orgrelation").get('orgrelation-000029'),										//标题/* 国际化处理： 询问信息*/
                    content: ''							//内容
                })}

            </div>
        );
    }
}


export default function (config) {

    ajax({
        url: urls['queryTemp'],
        data: {
            OrgRelationTypeID: config.OrgRelationTypeID		//pagecode,在生成的json模板获取
        },
        success: function (res) {
            config.relationType = res.data;
            let Relation = createPage({
                billinfo: {
                    billtype: 'grid',
                    pagecode: config.pagecode,
                    bodycode: tableid
                },
                initTemplate: config.initTemplate,
                mutiLangCode: 'orgrelation'
            })(OrgRelation);
            ReactDOM.render(<Relation {...{config: config}}/>, document.querySelector('#app'));
        }
    });
}
	

//qWNFZPKLBwQhyupqlt1oLBGLprJoTtn0N1vzJtcOt534/0B7y1P97cyCdhV3glI0