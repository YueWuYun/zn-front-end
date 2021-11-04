//EYRtkBrb7K7/x7D83c6Nj7pFAukYRWUIPEYbQ5vmaU4wAkJnZNJijD66qSP/UPRf
import React, {Component} from 'react';
import {config} from "../config/config";

const {gridId,searchId, pagecode,batchaddform,batchaddtable,batchAddFormPageCode,batchAddListPageCode,formId,funcode,listPrint,cardPrint,formEnable,formPeriod,ajaxurl}=config;

//参照处理
export const RefFilter={

    //卡片界面增加组织过滤条件
    filterFinanceOrg:function(props,formId){
        let meta = props.meta.getMeta();
        meta[formId].items.find((item) =>
            item.attrcode == 'pk_relorg'
        ).queryCondition = () => {
            return {
                TreeRefActionExt:'nccloud.web.org.accountingbook.action.OrgExtRef'
            };
        };

    },

    //增加账簿类型过滤条件
    setSetOfBookRefFilter:function(props,formId){
        let meta = props.meta.getMeta();
        meta[formId].items.find((item) =>
            item.attrcode == 'pk_setofbook'
        ).queryCondition = () => {
            return {
                GridRefActionExt:'nccloud.web.org.accountingbook.action.SetofbookExtRef'
            };
        };
    },
    //账簿类型编辑后增加参照过滤条件
    //batch 区分是卡片，批增还是，列表
    pageAfterEventFilter:function(props,cursetofbook,formId,batch=''){

        if(cursetofbook){
            //增加启动期间过滤
            this.setRefFilter(props,cursetofbook,formId,batch);

            //增加科目表参照过滤
            this.setAccChartPaneFilter(props,cursetofbook,formId,batch);

            //增加要素表参照过滤
            this.setFactorChartOrgPaneFilter(props,cursetofbook,formId);
        }
    },
    //根据账簿中的期间方案为所有启动期间增加过滤条件
    setRefFilter:function(props,cursetofbook,moduleId,batch=''){
        let meta = props.meta.getMeta();
        let pk_accperiodscheme = !!cursetofbook.values?cursetofbook.values.pk_accperiodscheme.value:'';

        for (var key in formPeriod){

            let moduleIdRep = ''
            if(moduleId==batchaddtable){
                moduleIdRep=batchaddtable;
            }else if(moduleId==batchaddform){
                moduleIdRep=key+batch;
            }else if(moduleId==formId){
                moduleIdRep=key;
            }else{
                return;
            }

            meta[moduleIdRep].items.find((item) =>
                item.attrcode == formPeriod[key]
            ).queryCondition = () => {
                return {
                    pk_accperiodscheme:pk_accperiodscheme,
                    isadj:'N'
                };
            };
        }
        props.meta.setMeta(meta);
    },

    //根据账簿增加科目表过滤条件
    setAccChartPaneFilter:function(props,cursetofbook,moduleId,batch=''){
        let meta = props.meta.getMeta();
        let moduleIdRep = '';

        if(moduleId==batchaddtable){
            moduleIdRep=batchaddtable;
        }else if(moduleId==batchaddform){
            moduleIdRep='account'+batch;
        }else if(moduleId==formId){
            moduleIdRep='account';
        }else{
            return;
        }

        let item = meta[moduleIdRep].items.find((item) =>
            item.attrcode == 'pk_curraccchart'
        );
        item.queryCondition = () => {
            if(JSON.stringify(cursetofbook)!='{}'){
                return {
                    pk_accsystem:cursetofbook.values.pk_accsystem.value,
                    TreeRefActionExt:'nccloud.web.org.accountingbook.action.AccChartExtRef'
                };
            }else{
                return {};
            }
        };
    },

    //为科目表增加集团过滤
    //适配原NC的逻辑，卡片界面编辑态里只要出现一次财务组织与账簿类型同时存在的情况就为科目表添加集团过滤
    setCurrchartFilter:function(props,currelorg,cursetofbook){
        if (JSON.stringify(currelorg) !='{}' && JSON.stringify(cursetofbook)!='{}'){
            let meta = props.meta.getMeta();
            meta['account'].items.map((item) => {
                if (item.attrcode == 'pk_curraccchart') {
                    item.isShowUnit = true;
                }
            });
        }
    },

    //根据账簿增加要素表过滤条件
    setFactorChartOrgPaneFilter:function (props,cursetofbook,formId){
        let meta = props.meta.getMeta();
        meta[formId].items.find((item) =>
            item.attrcode == 'pk_factorchart'
        ).queryCondition = () =>{
            if(JSON.stringify(cursetofbook)!='{}'&&JSON.stringify(cursetofbook.values.pk_checkelemsystem)!='{}'){
                return {
                    pk_factorsystem:cursetofbook.values.pk_checkelemsystem.value,
                    TreeRefActionExt:'nccloud.web.org.accountingbook.action.FactorChartExtRef'
                };
            }else{
                return {pk_factorsystem:'',TreeRefActionExt:'nccloud.web.org.accountingbook.action.FactorChartExtRef'};
            }
        };
    }

}

//工具
export const AccountUtils={
    //通过组织和账簿类型得到核算账簿编码和名称
    getCodeName:function(currelorg,cursetofbook){
        if (JSON.stringify(currelorg)!='{}'&&JSON.stringify(cursetofbook)!='{}') {
            let code = (currelorg.refcode==undefined?currelorg.nodeData.refcode:currelorg.refcode)+ '-' + cursetofbook.refcode;
            let name = currelorg.refname + '-' + cursetofbook.refname;
            code = code.substr(0,40);
            name = name.substr(0,200);
            return {name:{
                    'value': name,
                    'display': name
                },
                code:{
                    'display': code,
                    'value': code
                }};
        }
    }

}



//EYRtkBrb7K7/x7D83c6Nj7pFAukYRWUIPEYbQ5vmaU4wAkJnZNJijD66qSP/UPRf