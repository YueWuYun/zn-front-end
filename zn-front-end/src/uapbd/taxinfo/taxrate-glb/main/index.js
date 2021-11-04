//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Taxrate from '../../taxrate/main/Taxrate.js';
import { createPage, ajax, base, toast,getMultiLang} from 'nc-lightapp-front';

let { NCPopconfirm,NCModal } = base;
const { NCDropdown: Dropdown, NCIcon: Icon, NCMenu: Menu, NCButton: Button } = base;
import  Utils from '../../../public/utils';

var config = {
  title: '10140TAXRB-000000',/* 国际化处理： 税率-全局*/
  nodetype: 'glb',
  tableid : 'pk_taxrate',  
  appid : '0001Z3100000000016UW',  
  pagecode : '10140TAXRB_20160009',   
  pkorg : '',
  initTemplate:(props,callback)=>{
	props.createUIDom({
		pagecode : config.pagecode
		// appid : config.appid
  },
  
	(data)=>{
		let meta = data.template;
		meta = modifierMeta(props, meta)
		props.meta.setMeta(meta);
    data.button && props.button.setButtons(data.button);
	props.button.setPopContent('DelLine',props.MutiInit.getIntl("10140TAXRB")&&props.MutiInit.getIntl("10140TAXRB").get('10140TAXRB-000001')) /* 设置操作列上删除按钮的弹窗提示 */
    props.button.setButtonsVisible({
			Add: true,
			Edit: true,
			Delete: true,
			Save: false,
			Cancel: false,
			Refresh: true,
			Print: true
		});
	// 初始化时删除按钮不可用
	props.button.setDisabled({
		Delete: true
	});
	callback && callback();
	});
}
};
const urls = {
	add : '/nccloud/uapbd/taxrate/taxrateadd.do',
	save : '/nccloud/uapbd/taxrate/taxratesave.do',
	query : '/nccloud/uapbd/taxrate/taxratequery.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};

/**
 * 单据模板
 * @param props
 */


var Taxrate_Glb = createPage({
	// initTemplate: initTemplate,
	// 适配公式
	billinfo:{
        billtype:'grid',
        pagecode:config.pagecode,
        bodycode:config.tableid
    },
	initTemplate: ()=>{},
    mutiLangCode: '10140TAXRB'
})(Taxrate);

//对表格模板进行加工操作
function modifierMeta(props,meta) {
	// meta[config.tableid].showindex=true;  //表格显示序号
	//添加表格操作列
	let event = {
		label: props.MutiInit.getIntl("10140TAXRB")&&props.MutiInit.getIntl("10140TAXRB").get('10140TAXRB-000002'),/* 国际化处理： 操作*/
		attrcode: 'opr',
		key: 'opr',
		className:'table-opr',
		fixed:'right',
		itemtype: 'customer',
		visible:true,
		render(text, record, index) {

            return props.button.createOprationButton(
                ['DelLine'],
                {
                    area: "table-opr-area",
                    buttonLimit: 3,
                    onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                }
			)
			
			// let tableStatus = props.editTable.getStatus(config.tableid);
			// // let isSys = record.values.issystemp.value; //全局节点，系统预置的不能删除
			// return (tableStatus == 'browse' || tableStatus == undefined) ? (
			// 	<div className="currency-opr-col">
			// 		<NCPopconfirm
			// 			trigger="click"
			// 			placement="top"
			// 			content="确认删除?"
			// 			onClose={() => {
			// 				if(props.editTable.getStatus(config.tableid) === 'edit'){//编辑状态
			// 					props.editTable.deleteTableRowsByIndex(config.tableid, index);
			// 				}else{//浏览态
			// 					let delObj = {
			// 						rowId: index,
			// 						status: '3',
			// 						values: {
			// 							// ts: {
			// 							// 	display: '时间戳',
			// 							// 	value: record.values.ts.value
			// 							// },
			// 							// pk_taxrate: {
			// 							// 	display: '主键',
			// 							// 	value: record.values.pk_taxrate.value
			// 							// }
			// 						}
			// 					};
			// 					delObj.values = record.values;
			// 					let indexArr=[];
			// 					indexArr.push(index);
			// 					let data = {
			// 						pageid:config.pagecode,
			// 						model: {
			// 							areaType: 'table',
			// 							pageinfo: null,
			// 							rows: [ delObj ]
			// 						}
			// 					};
			// 					ajax({
			// 						url: urls['save'],
			// 						data,
			// 						success: function(res) {
			// 							let { success, data } = res;
			// 							if (success) {
			// 								props.editTable.deleteTableRowsByIndex(config.tableid, indexArr);
			// 								let allD = props.editTable.getAllData(config.tableid);
			// 								Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
			// 								props.editTable.setTableData(config.tableid,allD);	
			// 								toast({content: '删除成功', color:'success'});
			// 							}
			// 						}.bind(this)
			// 					});
			// 				}
			// 			}}
			// 		>
			// 			<span className='delete-span'>删除</span>
			// 		</NCPopconfirm>
			// 	</div>
			// ):(
			// 	<div className="currency-opr-col">
			// 		<span className='delete-span' 
			// 			onClick={() => {
			// 				props.editTable.deleteTableRowsByIndex(config.tableid, index);
			// 			}}
			// 		>删除</span>
			// 	</div>
			// );
		}
	};
	meta[config.tableid].items.push(event);
	return meta;
}
function tableButtonClick(props, id, text, record, index){
    switch(id){
        case 'DelLine':
			if(props.editTable.getStatus(config.tableid) === 'edit'){//编辑状态
				props.editTable.deleteTableRowsByIndex(config.tableid, index);
			}else{//浏览态
				let delObj = {
					rowId: index,
					status: '3',
					values: {
						// ts: {
						// 	display: '时间戳',
						// 	value: record.values.ts.value
						// },
						// pk_taxrate: {
						// 	display: '主键',
						// 	value: record.values.pk_taxrate.value
						// }
					}
				};
				delObj.values = record.values;
				let indexArr=[];
				indexArr.push(index);
				let data = {
					pageid:config.pagecode,
					model: {
						areaType: 'table',
						pageinfo: null,
						rows: [ delObj ]
					}
				};
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
							toast({content: props.MutiInit.getIntl("10140TAXRB")&&props.MutiInit.getIntl("10140TAXRB").get('10140TAXRB-000021'), color:'success'});
						}
					}.bind(this)
				});
			}
        default:
            break;

    }
}
ReactDOM.render(<Taxrate_Glb {...{config:config}}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65