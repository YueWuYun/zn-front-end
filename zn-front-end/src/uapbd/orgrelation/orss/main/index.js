//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 销售业务委托关系
 * @author  yinshb
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,cacheTools } from 'nc-lightapp-front';
import OrgRelation from '../../common/common';
import  Utils from '../../../public/utils';
let { NCPopconfirm } = base;
var tableid = 'orgrelation';
var urls = {
	save : '/nccloud/uapbd/org/OrgRelationSave.do',
	query : '/nccloud/uapbd/org/OrgRelationQuery.do',
	updateAttr : '/nccloud/uapbd/org/OrgRelationUpdateAttr.do',
	queryTemp : '/nccloud/uapbd/org/OrgRelationTypeQuery.do'
};
var config = {
  title: 'orgrelation-000060',//'销售业务委托关系',
  OrgRelationTypeID: 'SALESTOCKCONSIGN0000',
  appCode : '10100ORSS',
  pagecode : '10100ORSS_list',
  appid : '0001Z010000000000HZN',
  cacheId : 'orgrelation_orss',
  isShowOffEnable : true,
  dynColumn : [],
  initTemplate : initTemplate,
  setRowDefaultValue : function(props,num){
	props.editTable.setValByKeyAndIndex(tableid, num, 'pk_relationtype', {value: config.OrgRelationTypeID });
	props.editTable.setValByKeyAndIndex(tableid, num, 'enablestate', {value: 2 });
	props.editTable.setValByKeyAndIndex(tableid, num, 'sourceentity', {value: config.relationType.associaterules[0].sourceentity });
	props.editTable.setValByKeyAndIndex(tableid, num, 'targetentity', {value: config.relationType.associaterules[0].targetentity });
	config.dynColumn.forEach(e => {
		props.editTable.setValByKeyAndIndex(tableid, num, e, {value: true });
	});
  }
};

OrgRelation(config);

function initTemplate(props){
	props.createUIDom({
		pagecode : config.pagecode
	},
	(data)=>{
		data.button && props.button.setButtons(data.button);
		props.button.setButtonsVisible({
			Add: true,
			Edit: true,
			Delete: true,
			Save: false,
			Cancel: false,
			BatchAdd:true,
			Refresh:true
		});
		props.button.setDisabled({
			Delete: true
		});
		props.button.setPopContent('DeleteOpr',props.MutiInit.getIntl("orgrelation") && props.MutiInit.getIntl("orgrelation").get('orgrelation-000004')/* 国际化处理： 确认删除？*/);
		let meta = data.template;
		meta = modifierMeta(props, meta)
		props.meta.setMeta(meta);
		
	});
}

//对表格模板进行加工操作
function modifierMeta(props,meta) {
	handleMeta(meta);
	meta[tableid].items.forEach((e,i) =>{
		if(e.attrcode === 'sourcer'){
			Object.assign(meta[tableid].items[i], {
				label: props.MutiInit.getIntl("orgrelation") && props.MutiInit.getIntl("orgrelation").get('orgrelation-000050')/* 国际化处理： 销售组织*/,
				attrcode: 'sourcer',
				itemtype: 'refer',
				visible:true,
				refcode: 'uapbd/refer/org/SaleOrgAllTreeRef/index.js',
				isMultiSelectedEnabled : true,
				required:true,
				queryCondition:{
					AppCode : config.appCode,
                    TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
				}
			})
		}else if(e.attrcode === 'target'){
			Object.assign(meta[tableid].items[i], {
				label: props.MutiInit.getIntl("orgrelation") && props.MutiInit.getIntl("orgrelation").get('orgrelation-000036')/* 国际化处理： 库存组织*/,
				attrcode: 'target',
				itemtype: 'refer',
				visible:true,
				refcode: 'uapbd/refer/org/StockOrgAllGridRef/index.js',
				required:true
			})
		}else if(e.attrcode === 'entity1'){//产品线
			Object.assign(meta[tableid].items[i], {
				label: props.MutiInit.getIntl("orgrelation") && props.MutiInit.getIntl("orgrelation").get('orgrelation-000051')/* 国际化处理： 产品线*/,
				attrcode: 'entity1',
				itemtype: 'refer',
				visible:true,
				refcode: 'uapbd/refer/prodline/ProdLineDefaultGridRef/index.js'
			})
		}else if(e.attrcode === 'default1'){//结算财务组织
			Object.assign(meta[tableid].items[i], {
				label: props.MutiInit.getIntl("orgrelation") && props.MutiInit.getIntl("orgrelation").get('orgrelation-000047')/* 国际化处理： 结算财务组织*/,
				attrcode: 'default1',
				itemtype: 'refer',
				visible:true,
				refcode: 'uapbd/refer/org/FinanceOrgAllDataTreeRef/index.js',
				required:true
			})
		}else if(e.attrcode === 'default2'){//应收组织
			Object.assign(meta[tableid].items[i], {
				label: props.MutiInit.getIntl("orgrelation") && props.MutiInit.getIntl("orgrelation").get('orgrelation-000052')/* 国际化处理： 应收组织*/,
				attrcode: 'default2',
				itemtype: 'refer',
				visible:true,
				refcode: 'uapbd/refer/org/FinanceOrgAllDataTreeRef/index.js',
				required:true
			})
		}else if(e.attrcode === 'default3'){//利润中心
			Object.assign(meta[tableid].items[i], {
				label: props.MutiInit.getIntl("orgrelation") && props.MutiInit.getIntl("orgrelation").get('orgrelation-000049')/* 国际化处理： 利润中心*/,
				attrcode: 'default3',
				itemtype: 'refer',
				visible:true,
				refcode: 'uapbd/refer/org/LiabilityCenterOrgAllTreeRef/index.js'
			})
		}else if(e.attrcode === 'isdefault'){
			meta[tableid].items[i].visible = true;
		}
	});
	return addOprToMeta(props,meta);
}

function handleMeta(meta){
	if(config.relationType.associateattrs){  //处理业务属性
		config.relationType.associateattrs.forEach(element => {
			let item = {
				label: element.attrname,
				attrcode: 'attr_'+element.pk_associateattr,
				key: 'attr_'+element.pk_associateattr,
				itemtype: 'switch_browse',
				visible:true
			};
			config.dynColumn.push('attr_'+element.pk_associateattr);
			meta[tableid].items.push(item);
		});
	}
}

function addOprToMeta(props,meta){
	let event = {
		label: props.MutiInit.getIntl("orgrelation") && props.MutiInit.getIntl("orgrelation").get('orgrelation-000035')/* 国际化处理：操作*/,
		attrcode: 'opr',
		key: 'opr',
        itemtype: 'customer',
        fixed: 'right',
        className : 'table-opr',
		visible:true,
		render(text, record, index) {
			return props.button.createOprationButton(
                ['DeleteOpr'],
                {
                    area:'table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => onTableInnerButtonClick(props, id, text, record, index)
                }
            );
		}
	};
	meta[tableid].items.push(event);
	return meta;
}

function onTableInnerButtonClick(props, id, text, record, index){
	if(props.editTable.getStatus(tableid) === 'edit'){//编辑状态
		props.editTable.deleteTableRowsByIndex(tableid, index);
	}else{//浏览态
		let dataArr=[];
		let delObj = {
			status: '3',
			rowid : record.rowid,
			values: record.values
		};
		let indexArr=[];
		dataArr.push(delObj);
		Utils.convertGridEnablestate(dataArr);
		indexArr.push(index);
		let data = {
			OrgRelationTypeID : config.OrgRelationTypeID,
			pageid:config.pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: dataArr
			}
		};
		ajax({
			url: urls['save'],
			data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					let allD = props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					cacheTools.set(config.cacheId,allD);
					props.editTable.setTableData(tableid,allD);
					toast({title:props.MutiInit.getIntl("orgrelation") && props.MutiInit.getIntl("orgrelation").get('orgrelation-000025')/* 国际化处理：删除成功*/,color:'success'});
				}
			}
		});
	}
}




//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65