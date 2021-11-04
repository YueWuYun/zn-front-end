//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {SingleTable} from '../../prodline/main/Prodline.js';
import { createPage, ajax, base, toast,getMultiLang,excelImportconfig}  from 'nc-lightapp-front';
let { NCPopconfirm,NCModal,NCDropdown, NCIcon, NCMenu, NCButton } = base;

import  Utils from '../../../public/utils';

const urls = {
	save : '/nccloud/uapbd/prodline/save.do',
	query : '/nccloud/uapbd/prodline/query.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};

//获取并初始化模板
const initTemplate = (props, callback,importRefresh)=>{
	props.createUIDom({
		pagecode : config.pagecode,
		//appid : config.appid
    },
  
	(data)=>{
		let meta = data.template;
		meta = modifierMeta(props, meta)
		props.meta.setMeta(meta);
		let excelimportconfig = excelImportconfig(props,'uapbd',props.config.billType,true,'',{appcode: props.config.funcode,pagecode: props.config.pagecode},
				()=>{//回调函数，导入后刷新页面
					importRefresh&&importRefresh();
				});
		props.button.setUploadConfig("import",excelimportconfig);
		data.button && props.button.setButtons(data.button);
		setTimeout(() =>{
			callback && callback();
		},0);
		props.button.setPopContent({'Delline':props.MutiInit.getIntl("10140PLB")&&props.MutiInit.getIntl("10140PLB").get('10140PLB-000000')});/* 国际化处理： 确认要删除该信息吗？*/
	});
}

var config = {
	title: '10140PLB-000001',/* 国际化处理： 产品线-全局*/
	nodetype: 'glb',//globe
	appid : '0001Z010000000000O3H',
	tableid : 'prodline',   
	funcode: '10140PLB',
	pagecode : '10140PLB_list',     
	billType:'prodline_glb',
	pkorg : '',
	initTemplate: initTemplate
};

var Prodline_Glb = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode: config.pagecode,
        bodycode: config.tableid
    },
	initTemplate: function(){},
    mutiLangCode: '10140PLB'
})(SingleTable);

//对表格模板进行加工操作
function modifierMeta(props,meta) {
	//表格显示序号
	meta[config.tableid].showindex=true;  
	//添加表格操作列
	let event = {
		label: props.MutiInit.getIntl("10140PLB")&&props.MutiInit.getIntl("10140PLB").get('10140PLB-000002'),/* 国际化处理： 操作*/
		attrcode: 'opr',
		key: 'opr',
        fixed:'right',
		className:'table-opr',
		itemtype: 'customer',
		visible:true,
		render(text, record, index) {
			let tableStatus = props.editTable.getStatus(config.tableid);
			let btnArray = ['Delline'];

			return  props.button.createOprationButton(
                btnArray,
                {
                    area: "table-opr-button",
                    buttonLimit: 3,
                    onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                }
			)	
		}
	};
	meta[config.tableid].items.push(event);
	return meta;
}

/**
 * 表体点击事件
 * @param props 
 * @param id 
 * @param text 
 * @param record 
 * @param index 
 */
function tableButtonClick(props, id, text, record, index){

    switch(id){
		case 'Delline':
			let tableStatus = props.editTable.getStatus(config.tableid);
			if(tableStatus == 'browse' || tableStatus == undefined){
				let delObj = {
					rowid: index,
					status: '3',
					values: /*{
						ts: {
							display: props.MutiInit.getIntl("10140PLB")&&props.MutiInit.getIntl("10140PLB").get('10140PLB-000003'),/!* 国际化处理： 时间戳*!/
							value: record.values.ts.value
						},
						pk_prodline: {
							display: props.MutiInit.getIntl("10140PLB")&&props.MutiInit.getIntl("10140PLB").get('10140PLB-000004'),/!* 国际化处理： 主键*!/
							value: record.values.pk_prodline.value
						}
					}*/
						Utils.clone(record.values)
				};
				let indexArr=[];
				indexArr.push(index);
				let data = {
					pageid: config.pagecode,
					nodetype: config.nodetype,
					model: {
						areaType: 'table',
						pageinfo: null,
						rows: [ delObj ]
					}
				};
                data.model.rows = Utils.convertGridEnablestateToSave(data.model.rows);
				ajax({
					url: urls['save'],
					data,
					success: function(res) {
						let { success, data } = res;
						if (success) {
							props.editTable.deleteTableRowsByIndex(config.tableid, indexArr);
							let allD = props.editTable.getAllData(config.tableid);
							Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
							props.editTable.setTableData(config.tableid,allD);	
							toast({title: props.MutiInit.getIntl("10140PLB")&&props.MutiInit.getIntl("10140PLB").get('10140PLB-000005'), color:'success'});/* 国际化处理： 删除成功！*/
						}
					}.bind(this)
				});				
			}
			else {
				props.editTable.deleteTableRowsByIndex(config.tableid, index);		
			}
			break;
			
        default:
            break;				
	}
}

ReactDOM.render(<Prodline_Glb {...{config:config}}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65