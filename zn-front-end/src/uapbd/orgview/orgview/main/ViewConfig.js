//MMXagHCdbHEi82sKkhmny6QJhUzVGQnHXrZCwgEEohqPkc8fw/tLGisMXtYUnuiR

import React, { Component } from 'react';
import { ajax, base } from 'nc-lightapp-front';
let {NCSelect,NCRadio, NCCheckbox, Tabs } = base;
import {CompUtils}   from '../../../public/excomponents';
var createConfig = function(nodetype){
    var orgTypes = [{ //行政组织视图
        name: createConfig.lang['ORGVIEW-000013'],/* 国际化处理： 行政组织视图*/
        fieldName: 'orgtype0',
        typeno: 0,
        glb: false,
        grp: true,
        dataFieldname: 'orginfos',
        areaname: 'OrgViewOrgSubVO',
        orderglb: 10,
        ordergrp: 10,
        controlData:{
            deptCheck: true,  //包含部门
            virCheck: false,  //包含虚拟部门
            delCheck: false,   //撤销部门,
            isEnable: true
        },

        initControlData: function(controls){
            this.controlData = { //默认值
                deptCheck: true, 
                virCheck: false,  
                delCheck: false,
                isEnable: true
            };
        },

        handerOnVersionChange: function(version){
            var isLastVer = version == createConfig.lang['ORGVIEW-000000'];/* 国际化处理： 当前最新版本*/
            this.controlData.virCheck = isLastVer ? this.controlData.virCheck :false;
            this.controlData.deptCheck = !isLastVer;
            this.controlData.delCheck = isLastVer ? this.controlData.delCheck :false;
            this.controlData.isEnable = isLastVer
        },
        controlListFilter: function(datas){  //orgtype2=true 业务单元 orgtype3=true部门
            debugger;
            var me = this;
            return datas.filter( function(data) {
      
                if(!this.controlData.deptCheck){ //不包含部门
                    return ( data.values.orgtype2.value === true && data.values.orgtype3.value === false);
                }else{ //包含部门
                    var isorg = data.values.orgtype2.value === true && data.values.orgtype3.value === false;
                    var isdept  = data.values.orgtype2.value === false && data.values.orgtype3.value === true &&  data.values.isvirtualdept.value == false && data.values.iswithdrawdept.value == false;
                    var isvdept = data.values.orgtype2.value === false && data.values.orgtype3.value === true &&  data.values.isvirtualdept.value == true;
                    var isddept = data.values.orgtype2.value === false && data.values.orgtype3.value === true &&  data.values.iswithdrawdept.value == true;
                   // return isorg || isdept || isvdept ==  this.controlData.virCheck || isddept == this.controlData.delCheck ;
                    return isorg || isdept || (this.controlData.virCheck && isvdept)||  (this.controlData.delCheck && isddept) ;

                    // return (data.values.orgtype2.value === true && data.values.orgtype3.value === false) ||
                    //  (data.values.orgtype2.value === false && data.values.orgtype3.value === true && data.values.isvirtualdept.value ===  this.controlData.delCheck && data.values.iswithdrawdept.value ===  this.controlData.virCheck);
                }
            }, me);
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_orgunit', 'pk_fatherorg');
        },

        createControlComp: function(onCondChange){
            var onChange = (checkname) => { 
                return (value) => {
                    debugger;
                    this.controlData[checkname] = value;
                    if(checkname === 'deptCheck' && !value){
                        this.controlData['virCheck'] = value;
                        this.controlData['delCheck'] = value;
                    }
                    if((checkname === 'virCheck' || checkname === 'delCheck')  && value){
                        this.controlData['deptCheck'] = value;
                    }
                    setTimeout(() => {
                        onCondChange && onCondChange();
                    }, 0);
                   
                };
            };
            return (
                <div>
                    <span className="showOff">
                    <NCCheckbox size="lg" checked={this.controlData.deptCheck} disabled={!this.controlData.isEnable} onChange={onChange('deptCheck').bind(this) }>{createConfig.lang['ORGVIEW-000033']/* 国际化处理： 包含部门*/}</NCCheckbox>
                    </span>
                    {/*update by yufwm 2020-03-12*/}
                    {/*交换 包含虚拟部门  包含撤销部门  位置*/}
                    <span className="showOff" style={{marginLeft:'20px'}}>
                    <NCCheckbox size="lg" checked={this.controlData.virCheck} disabled={!this.controlData.isEnable} onChange={onChange('virCheck').bind(this)}>{createConfig.lang['ORGVIEW-000035']/* 国际化处理： 包含虚拟部门*/}</NCCheckbox>
                    </span>

                    <span className="showOff" style={{marginLeft:'20px'}}>
                    <NCCheckbox size="lg" checked={this.controlData.delCheck} disabled={!this.controlData.isEnable}  onChange={onChange('delCheck').bind(this) }>{createConfig.lang['ORGVIEW-000034']/* 国际化处理： 包含撤销部门*/}</NCCheckbox>
                     </span>
                </div>
              )
        }
    },{
        name: createConfig.lang['ORGVIEW-000014'],/* 国际化处理： 财务组织视图*/
        fieldName: 'orgtype1',
        typeno: 1,
        glb: false,
        grp: true,
        dataFieldname: 'orgviewfinancesub',
        areaname: 'orgviewfinancesub',
        controlData:{
            scopeValue: 'scope_org'  //维度值 默认scope_org
        },

        initControlData: function(controls){
            this.controlData.scopeValue = 'scope_org';
        },
        controlListFilter: function(datas){
            var me = this;
            return datas.filter( function(data) {
                if(me.controlData.scopeValue === 'scope_org'){ //显示财务组织维度
                    return data.values.isfromfiorg.value === true ;//&& data.values.isfinanceorg.value == true;
                }else{ //只显示账簿维度
                    return data.values.isfrombook.value === true ;
                }
                return true;
            });
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.scopeValue = value;
                
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (
                <NCRadio.NCRadioGroup selectedValue={this.controlData.scopeValue} onChange={onChange.bind(this) }>
                    <NCRadio value="scope_org" >{createConfig.lang['ORGVIEW-000036']/* 国际化处理： 按财务组织维度*/}</NCRadio>
                    <NCRadio value="scope_book" >{createConfig.lang['ORGVIEW-000037']/* 国际化处理： 按账簿维度*/}</NCRadio>
                </NCRadio.NCRadioGroup>
              )
        }
    },{ //销售组织视图
        name: createConfig.lang['ORGVIEW-000015'],/* 国际化处理： 销售组织视图*/
        fieldName: 'orgtype2',
        typeno: 2,
        glb: false,
        grp: true,
        orderglb: 20,
        ordergrp: 40,
        dataFieldname: 'basesubinfos',
        areaname: 'orgviewcreditregion',
        controlData:{
        },
        initControlData: function(controls){ // name code格式数组
        },
        controlListFilter:function(datas){
           return datas;
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            return '';
        }
      

    },{ //资金组织视图
        name: createConfig.lang['ORGVIEW-000016'],/* 国际化处理： 资金组织视图*/
        fieldName: 'orgtype4',
        typeno: 4,
        glb: true,
        grp: false,
        dataFieldname: 'basesubinfos',
        areaname: 'orgviewcreditregion',
        orderglb: 20,
        ordergrp: 20,
        initControlData: function(controls){ // name code格式数组
        },
        controlListFilter:function(datas){
           return datas;
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            return '';
        }
       
    },{ //成本域视图
        name: createConfig.lang['ORGVIEW-000017'],/* 国际化处理： 成本域视图*/
        fieldName: 'orgtype5',
        typeno: 5,
        glb: false,
        grp: true,
        dataFieldname: 'basesubinfos',
       // areaname: 'orgviewcreditregion',
       areaname: 'orgviewcostregionsub',
        orderglb: 20,
        ordergrp: 70,
        controlData:{
            scopes: [],
            curScope: undefined
        },
        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        }, 
        controlListFilter:function(datas = []){
           return datas.filter(data => {
                return data.values && data.values.pk_financeorg &&  data.values.pk_financeorg.value == this.controlData.curScope
           });
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.curScope = value;
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (
                <NCSelect placeholder={createConfig.lang['ORGVIEW-000017']} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>/* 国际化处理： 成本域视图*/
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    },{//信用控制域视图
        name: createConfig.lang['ORGVIEW-000018'],/* 国际化处理： 信用控制域视图*/
        fieldName: 'orgtype6',
        typeno: 6,
        glb: false,
        grp: true,
        dataFieldname: 'basesubinfos',
        areaname: 'orgviewcreditregion',
        orderglb: 20,
        ordergrp: 80,
        controlData:{
            scopes: [],
            curScope: undefined
        },
        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        }, 
        controlListFilter:function(datas = []){
           return datas.filter(data => {
                return data.values && data.values.pk_filterorg &&  data.values.pk_filterorg.value == this.controlData.curScope
           });
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.curScope = value;
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (
                <NCSelect placeholder={createConfig.lang['ORGVIEW-000018']} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>/* 国际化处理： 信用控制域视图*/
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    },{//分销补货体系
        name: createConfig.lang['ORGVIEW-000019'],/* 国际化处理： 分销补货体系*/
        fieldName: 'orgtype7',
        typeno: 7,
        glb: false,
        grp: true,
        orderglb: 20,
        ordergrp: 90,
        dataFieldname: 'basesubinfos',
        areaname: 'orgviewcreditregion',
        controlData:{
            scopes: [],
            curScope: undefined
        },
        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        }, 
        controlListFilter:function(datas = []){
           return datas.filter(data => {
                return data.values && data.values.pk_filterorg &&  data.values.pk_filterorg.value == this.controlData.curScope
           });
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.curScope = value;
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (
                <NCSelect placeholder={createConfig.lang['ORGVIEW-000019']} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>/* 国际化处理： 分销补货体系*/
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    },{//报表组织体系
        name: createConfig.lang['ORGVIEW-000020'],/* 国际化处理： 报表组织体系*/
        fieldName: 'orgtype8',
        typeno: 8,
        glb: true,
        grp: true,
        dataFieldname: 'reportsubinfos',
        areaname: 'orgviewreportsub',
        orderglb: 30,
        ordergrp: 60,
        controlData:{
            scopes: [],
            curScope: undefined
        },
        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        }, 
        controlListFilter:function(datas = []){
           return datas.filter(data => {
                return data.values && data.values.pk_rms &&  data.values.pk_rms.value == this.controlData.curScope
           });
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.curScope = value;
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (
                <NCSelect placeholder={createConfig.lang['ORGVIEW-000020']} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>/* 国际化处理： 报表组织体系*/
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    },{//利润中心结构图
        name: createConfig.lang['ORGVIEW-000021'],/* 国际化处理： 利润中心结构图*/
        fieldName: 'orgtype9',
        typeno: 9,
        glb: false,
        grp: true,
        orderglb: 20,
        ordergrp: 50,
        dataFieldname: 'liabilitysubinfos',
        areaname: 'orgviewliabilitysub',
        controlData:{
            scopes: [],
            curScope: undefined,
            bookchecked: true
        },

        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        },
        controlListFilter:function(datas){
            var me = this;
            return datas.filter( function(data) {
                
                if(me.controlData.bookchecked){
                    return data.values.pk_controlarea.value === this.controlData.curScope ;
                }else{
                    return (data.values.pk_controlarea.value === this.controlData.curScope) &&  (data.values.liatype.value  == 1 || data.values.liatype.value  == 0);
                }
            },me);
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onManagerScopeChange = (value) => {
                this.controlData.curScope = value;
                onCondChange && onCondChange();
            };
            var onBookChange = (value) => {
                this.controlData.bookchecked = value;
                onCondChange && onCondChange();
            };
            return (
                <span>
                    <NCSelect placeholder={createConfig.lang['ORGVIEW-000022']/* 国际化处理： 管控范围*/} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onManagerScopeChange.bind(this) }/>
                    <NCCheckbox  checked={this.controlData.bookchecked} onChange={onBookChange.bind(this)} >{createConfig.lang['ORGVIEW-000038']/* 国际化处理： 财务核算账簿*/}</NCCheckbox>
                </span>
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    },{//资金管理体系
        name: createConfig.lang['ORGVIEW-000023'],/* 国际化处理： 资金管理体系*/
        fieldName: 'orgtype10',
        typeno: 10,
        glb: true,
        grp: true,
        dataFieldname: 'basesubinfos',
        areaname: 'orgviewfundmana',
        orderglb: 40,
        ordergrp: 100,
        controlData:{
            scopes: [],
            curScope: undefined
        },
        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        }, 
        controlListFilter:function(datas = []){
           return datas.filter(data => {
                return data.values && data.values.pk_filterorg &&  data.values.pk_filterorg.value == this.controlData.curScope
           });
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.curScope = value;
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (
                <NCSelect placeholder={createConfig.lang['ORGVIEW-000023']/* 国际化处理： 资金管理体系*/} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    },{//库存统计体系
        name: createConfig.lang['ORGVIEW-000024'],/* 国际化处理： 库存统计体系*/
        fieldName: 'orgtype11',
        typeno: 11,
        glb: false,
        grp: true,
        dataFieldname: 'stockstatinfos',
        areaname: 'orgviewstockstatistic',
        orderglb: 40,
        ordergrp: 110,
        controlData:{
            scopes: [],
            curScope: undefined
        },
        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        }, 
        controlListFilter:function(datas = []){
           return datas.filter(data => {
                return data.values && data.values.pk_stockstatstru &&  data.values.pk_stockstatstru.value == this.controlData.curScope
           });
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.curScope = value;
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (
                <NCSelect placeholder={createConfig.lang['ORGVIEW-000024']/* 国际化处理： 库存统计体系*/} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    },{ //人力资源视图
        name: createConfig.lang['ORGVIEW-000025'],/* 国际化处理： 人力资源视图*/
        fieldName: 'orgtype12',
        typeno: 12,
        glb: false,
        grp: true,
        orderglb: 20,
        ordergrp: 20,
        dataFieldname: 'basesubinfos',
        areaname: 'orgviewcreditregion',
        controlData:{
        },
        initControlData: function(controls){ // name code格式数组
        }, 
        controlListFilter:function(datas){
           return datas;
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            return '';
        }
    },{ //预算组织体系
        name:  createConfig.lang['ORGVIEW-000026'],/* 国际化处理： 预算组织体系*/
        fieldName: 'orgtype13',
        typeno: 13,
        glb: true,
        grp: true,
        dataFieldname: 'basesubinfos',
        areaname: 'pk_orgview',
        orderglb: 50,
        ordergrp: 130,
        controlData:{
            scopes: [],
            curScope: undefined
        },
        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        }, 
        controlListFilter:function(datas = []){
           return datas.filter(data => {
                return data.values && data.values.pk_filterorg &&  data.values.pk_filterorg.value == this.controlData.curScope
           });
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.curScope = value;
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (
                <NCSelect placeholder={createConfig.lang['ORGVIEW-000026']/* 国际化处理： 预算组织体系*/} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    },{//采购组织体系
        name:  createConfig.lang['ORGVIEW-000027'],/* 国际化处理： 采购组织体系*/
        fieldName: 'orgtype14',
        typeno: 14,
        glb: false,
        grp: true, 
        dataFieldname: 'purplanstruinfos',
        areaname: 'pk_purplanstrusub',
        orderglb: 40,
        ordergrp: 120,
        controlData:{
            scopes: [],
            curScope: undefined
        },
        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        }, 
        controlListFilter:function(datas = []){
           return datas.filter(data => {
                return data.values && data.values.pk_pps &&  data.values.pk_pps.value == this.controlData.curScope
           });
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.curScope = value;
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (
                <NCSelect placeholder={createConfig.lang['ORGVIEW-000027']/* 国际化处理： 采购组织体系*/} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    },{//报表合并体系
        name:  createConfig.lang['ORGVIEW-000028'],/* 国际化处理： 报表合并体系*/
        fieldName: 'orgtype16',
        typeno: 16,
        glb: true,
        grp: true,
        orderglb: 60,
        ordergrp: 140,
        dataFieldname: 'rcssubinfos',
        areaname: 'pk_rcssub',
        controlData:{
            scopes: [],
            curScope: undefined
        },
        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        }, 
        controlListFilter:function(datas = []){
           return datas.filter(data => {
                return data.values && data.values.pk_rcs &&  data.values.pk_rcs.value == this.controlData.curScope
           });
        },
        converTreeData: function(datas){
            debugger;
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.curScope = value;
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (
                <NCSelect placeholder={createConfig.lang['ORGVIEW-000028']/* 国际化处理： 报表合并体系*/} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    },{//公司视图
        name: createConfig.lang['ORGVIEW-000029'],/* 国际化处理： 公司视图*/
        fieldName: 'orgtype17',
        typeno: 17,
        glb: true,
        grp: false,
        dataFieldname: 'basesubinfos',
        areaname: 'orgviewcreditregion',
        orderglb: 10,
        ordergrp: 10,
        controlData:{
        },
        initControlData: function(controls){ // name code格式数组
        },
        controlListFilter:function(datas){
           return datas;
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            return '';
        }
    },{//资产统计体系
        name:  createConfig.lang['ORGVIEW-000030'],/* 国际化处理： 资产统计体系*/
        fieldName: 'orgtype19',
        typeno: 19,
        glb: false,
        grp: true,
        orderglb: 40,
        ordergrp: 150,
        dataFieldname: 'asssubinfos',
        areaname: 'asssubinfos',
        controlData:{
            scopes: [],
            curScope: undefined
        },
        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        }, 
        controlListFilter:function(datas = []){
           return datas.filter(data => {
                return data.values && data.values.pk_assetstatstru &&  data.values.pk_assetstatstru.value == this.controlData.curScope
           });
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.curScope = value;
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (
                <NCSelect placeholder={createConfig.lang['ORGVIEW-000030']/* 国际化处理： 资产统计体系*/} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    },{//财务统计体系
        name:  createConfig.lang['ORGVIEW-000031'],/* 国际化处理： 财务统计体系*/
        fieldName: 'orgtype20',
        typeno: 20,
        glb: true,
        grp: true,
        dataFieldname: 'fsssubinfos',
        areaname: 'fsssubinfos',
        orderglb: 70,
        ordergrp: 160,
        controlData:{
            scopes: [],
            curScope: undefined
        },
        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        }, 
        controlListFilter:function(datas = []){
           return datas.filter(data => {
                
                return data.values && data.values.pk_financestatstru &&  data.values.pk_financestatstru.value == this.controlData.curScope
           });
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.curScope = value;
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (
                <NCSelect placeholder={createConfig.lang['ORGVIEW-000031']/* 国际化处理： 财务统计体系*/} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    },{//账簿合并体系
        name:  createConfig.lang['ORGVIEW-000032'],/* 国际化处理： 账簿合并体系*/
        fieldName: 'orgtype21',
        typeno: 21,
        glb: true,
        grp: true,
        dataFieldname: 'bcssubinfos',
        areaname: 'bcssubinfos',
        orderglb: 80,
        ordergrp: 170,
        controlData:{
            cbScopes: [],
            curCbScope: undefined
        },
        controlData:{
            scopes: [],
            curScope: undefined
        },
        initControlData: function(controls){ // name code格式数组
            this.controlData.scopes = controls.scope || [];
            var curScopeObj = controls.curscope || {};
            this.controlData.curScope = curScopeObj.value;
        }, 
        controlListFilter:function(datas = []){
           return datas.filter(data => {
                
                return data.values && data.values.pk_bcs &&  data.values.pk_bcs.value == this.controlData.curScope
           });
        },
        converTreeData: function(datas){
            return CompUtils.listDataToTreeData(datas, 'pk_org', 'pk_fatherorg');
        },
        createControlComp: function(onCondChange){
            var onChange = (value) => {
                this.controlData.curScope = value;
                //此处要设置数据过滤条件
                onCondChange && onCondChange();
            };
            return (

                /*update by yufwm 2020-03-12
                财务统计体系 修改为 账簿合并体系*/
                /*<NCSelect placeholder={createConfig.lang['ORGVIEW-000031']/!* 国际化处理： 财务统计体系*!/} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>*/
                <NCSelect placeholder={createConfig.lang['ORGVIEW-000032']/* 国际化处理： 账簿合并体系*/} data={this.controlData.scopes} value={this.controlData.curScope} onChange={onChange.bind(this) }/>
            );
        },
        addvParam: function(){
            debugger;
            var scopes = this.controlData.scopes || [],
                curScope = this.controlData.curScope || '';
            
            var codeScope = scopes.filter(ps => {
                return ps.value == curScope;
            });
            var code = codeScope.length == 1 ? codeScope[0].code : '';
            return {syscode: code}
        }
    }];
    orgTypes =  orgTypes.filter(type => {
        if( nodetype === 'glb')
            return type.glb == true;
        else
            return type.grp == true;
    });
    orgTypes = orgTypes.sort((a, b) => {
        return nodetype === 'glb' ? (a.orderglb - b.orderglb < 0 ? -1: 1) : (a.ordergrp - b.ordergrp < 0  ? -1: 1);
    });
    return orgTypes;
};


export default createConfig;

//MMXagHCdbHEi82sKkhmny6QJhUzVGQnHXrZCwgEEohqPkc8fw/tLGisMXtYUnuiR