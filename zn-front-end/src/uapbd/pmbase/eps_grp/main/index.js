//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Eps from '../../eps_base/main/';
import { createPage,ajax} from 'nc-lightapp-front';
/**
 * 企业项目结构（EPS）- 集团
 */
/**
 *  后面还要考虑 多语 的情况
 * @type {{nodeTitle: string, pageCode: string, nodeType: string}}
 */
let config = {
    title:'项目基本分类-集团',
    pageCode:'10140EPSG_form',
    nodeType:'GROUP_NODE',
    formId:'head',
    treeId:'epsTree',
    appcode:'10140EPSG',
    refresh:'uapbd/pmbase/eps_grp/main/index.html',
};
var createUIDomParam = function(pagecode, appcode){
    var param  = {
        pagecode:pagecode
    };
    return window.location.href.startsWith('http://localhost:3006') ? {...param, appcode: appcode} : param;
};
/**
 * 单据模板
 * @param props
 */
const initTemplate = (props)=>{
    /**
     * 页面初始设置button状态
     * @param props
     */
    const initButtonStatus=(props)=>{
        //设置保存按钮不显示
        props.button.setButtonVisible('Save',false);
        //设置取消按钮不显示
        props.button.setButtonVisible('Cancel',false);
        //设置保存新增按钮不显示
        props.button.setButtonVisible('SaveAdd',false);
    }

    props.createUIDom(
        { ...createUIDomParam(config.pagecode, config.appcode)},
        (data)=>{
            if(data.template){
                props.meta.setMeta(data.template);
                setFormEnableStateProp(props);
            }
            if (data.button) {
                props.button.setButtons(data.button);
                
                initButtonStatus(props);

            }
        }
    );


}
const setFormEnableStateProp = (props)=>{
    //获得元数据
    let meta = props.meta.getMeta();
    //判断元数据中有我的表单元数据
    if(Object.prototype.toString.call(meta).slice(8, -1) === 'Object' && meta.hasOwnProperty(config.formId)){
        //获得表单元数据
        let formMeta = props.meta.getMeta()[config.formId];
        //判断表单元数据有属性
        if(formMeta.hasOwnProperty("items")){
            //获得属性
            let items = formMeta.items;
            if(Object.prototype.toString.call(items).slice(8, -1) === 'Array'){
                items.map((item)=>{
                    //查找enablestate属性
                    if(item.hasOwnProperty("attrcode") && item.attrcode == 'enablestate'){
                        //设置enablestate属性不可用
                        props.form.setFormItemsDisabled(config.formId,{enablestate:true});
                    }
                });
            }
        }
    }
}
var Eps_Grp = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: '10140EPSG_form',
        headcode: 'head'
    },
    initTemplate: initTemplate,
})(Eps);
/**
 * 渲染页面
 */
ReactDOM.render(<Eps_Grp {...{config:config}}/>, document.querySelector('#app'));









//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65