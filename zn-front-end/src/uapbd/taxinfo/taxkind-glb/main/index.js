//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 税种-全局
 * @author	zhoucx
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SingleTable,editTableBtn,tableid }  from '../../taxkind/main/Taskind.js';
import { createPage, ajax, base, toast,getMultiLang}  from 'nc-lightapp-front';
let { NCPopconfirm,NCModal,NCDropdown, NCIcon, NCMenu, NCButton } = base;
import  Utils from '../../../public/utils';


const urls = {
	save : '/nccloud/uapbd/taxkind/save.do',
	query : '/nccloud/uapbd/taxkind/querytaxkind.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};

/**
 * 单据模板
 * @param props
 */
const initTemplate = (props, callback)=>{
	props.createUIDom({
		pagecode : config.pagecode
		//appid : config.appid
  },
  
	(data)=>{
		let meta = data.template;
		meta = modifierMeta(props, meta)
		props.meta.setMeta(meta);
		data.button && props.button.setButtons(data.button);
		setTimeout(() =>{
			callback && callback();
		},0);
		props.button.setPopContent({'Delline':props.MutiInit.getIntl("10140TAXCB")&&props.MutiInit.getIntl("10140TAXCB").get('10140TAXCB-000000')});/* 国际化处理： 确认要删除该信息吗？*/
	});
}
var config = {
	title: '10140TAXCB-000001',/* 国际化处理： 税种-全局*/
	nodetype: 'glb',
	tableid : 'taxkind',  
	appid : '0001Z310000000000O24',  
	pagecode : '10140TAXCB_1014001',   
	pkorg : '',
	initTemplate: initTemplate
};

var Taxkind_Glb = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode: config.pagecode,
        bodycode: config.tableid
    },
  initTemplate: function(){},
    mutiLangCode: '10140TAXCB'
})(SingleTable);

//禁止选择
function disableSelect(viewData){
	setTimeout(()=>{
		viewData.rows.forEach((item, index, array)=>{
			//系统预置的税种不能修改
            if (item.values['issystemp'].value === '1') {
				editTableBtn.setCheckboxDisabled(tableid,index,false);
				editTableBtn.setEditableRowByIndex(tableid, index, false);
            } 
			//组织级页面，全局的税种也不能修改
			else if (this.config.nodetype === 'org' && item.values['pk_org'].value==='GLOBLE00000000000000' ) { 
				editTableBtn.setCheckboxDisabled(tableid,index,false);
				editTableBtn.setEditableRowByIndex(tableid, index, false);
			}
		});
	},100)
}
//对表格模板进行加工操作
function modifierMeta(props,meta) {
	meta[config.tableid].showindex=true;  //表格显示序号
	//添加表格操作列
	let event = {
		label: props.MutiInit.getIntl("10140TAXCB")&&props.MutiInit.getIntl("10140TAXCB").get('10140TAXCB-000002'),/* 国际化处理： 操作*/
		attrcode: 'opr',
		key: 'opr',
        fixed:'right',
		className:'table-opr',
		itemtype: 'customer',
		visible:true,
		render(text, record, index) {
			let tableStatus = props.editTable.getStatus(config.tableid);
			let btnArray = ['Delline'];
			
			//全局节点，系统预置的不能删除
			let isSys = record.values.issystemp.value; 
			if (isSys ==='1') {
				btnArray=[];
			}

			return props.button.createOprationButton(
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
			if(tableStatus=='browse'){	
				let delObj = {
					rowid: index,
					status: '3',
					values: /*{
						code: {
							display: props.MutiInit.getIntl("10140TAXCB")&&props.MutiInit.getIntl("10140TAXCB").get('10140TAXCB-000003'),/!* 国际化处理： 编码*!/
							value: record.values.code.value
						},
						name: {
							display: props.MutiInit.getIntl("10140TAXCB")&&props.MutiInit.getIntl("10140TAXCB").get('10140TAXCB-000004'),/!* 国际化处理： 名称*!/
							value: record.values.name.value
						},
						pk_org: {
							display: props.MutiInit.getIntl("10140TAXCB")&&props.MutiInit.getIntl("10140TAXCB").get('10140TAXCB-000005'),/!* 国际化处理： 组织*!/
							value: record.values.pk_org.value
						},																		
						ts: {
							display: props.MutiInit.getIntl("10140TAXCB")&&props.MutiInit.getIntl("10140TAXCB").get('10140TAXCB-000006'),/!* 国际化处理： 时间戳*!/
							value: record.values.ts.value
						},
						pk_taxkind: {
							display: props.MutiInit.getIntl("10140TAXCB")&&props.MutiInit.getIntl("10140TAXCB").get('10140TAXCB-000007'),/!* 国际化处理： 主键*!/
							value: record.values.pk_taxkind.value
						}
					}*/
                        Utils.clone(record.values)
				};
				let indexArr=[];
				indexArr.push(index);
				let data = {
					pageid: config.pagecode,
					//nodetype: config.nodetype,
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
							toast({title: props.MutiInit.getIntl("10140TAXCB")&&props.MutiInit.getIntl("10140TAXCB").get('10140TAXCB-000008'), color:'success'});/* 国际化处理： 删除成功！*/
							disableSelect(allD)
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
			
ReactDOM.render(<Taxkind_Glb {...{config:config}}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65