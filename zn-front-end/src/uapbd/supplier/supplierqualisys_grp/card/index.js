//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import Setpart from '../../supplierqualisys/card'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage,ajax} from 'nc-lightapp-front';

let config = {
	nodeName: '10140SAQSG-000056',
    nodetype: 'group',
    pageCode: '10140SAQSG_qualidoc_listcard',
    pageCodeList: '10140SAQSG_qualidoc_list',
    appid: '0001Z010000000001NMZ',
    treeId: 'materialtypetreeid',
    formId:'supqualidoc',
    appcode:'10140SAQSG_GRP',
    tableId: 'supqualilevel',
    template:'10140SAQSG_qualidoc_listcard'
}

let initTemplate =(props)=>{
	props.createUIDom(
		{
            pagecode: config.pageCode,//页面id
            // appcode:config.appcode,
			// appid: config.appid//注册按钮的id
		}, 
		function (data){
            console.log("data");
            console.log(data);
			if(data){
				if(data.template){
					let meta = data.template;
					modifierMeta(props, meta)
					props.meta.setMeta(meta);
					// let status = props.getUrlParam('status');
					// if(status && status == 'add'){
					// 	props.cardTable.addRow(tableId);
					// }
				}
				if(data.button){
					let button = data.button;
                    props.button.setButtons(button);
                    console.log('initTemplate');console.log(props);
                    console.log(props.button.getButtons());
                    
                    let status = props.getUrlParam('status');
                    let flag = status === 'browse' ? false : true;
                    //按钮的显示状态
                    if(status == 'edit' || status == 'add'){
                        props.button.setButtonVisible(['edit','add','back','delete','refresh'],false);
                        props.button.setButtonVisible(['save','cancel','addline'],true);
                        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                    }else{
                        props.button.setButtonVisible(['save','cancel','addline'],false);
                        props.button.setButtonVisible(['add','edit','delete','back','refresh'],true);
                        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                    }
                    props.form.setFormStatus(config.formId, status);
                    props.cardTable.setStatus(config.tableId, status);
				}
			}   
		}
	)
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[config.formId].status = status;
	meta[config.tableId].status = status;
    console.log('modifierMeta');
    // 修改参照refcode
    let formItems = meta[config.formId].items;
    for(let i = 0; i < formItems.length; i++){
        if(formItems[i].attrcode === 'pk_qualitype'){
            // formItems[i].refcode = '../../../../uapbd/refer/org/AssignedOrgTreeRef/index';
            formItems[i].refcode = '../../../../uapbd/refer/pub/SupplierQualiTypeTreeRef/index.js';//物料多版本
        }
    }

    let tableItems = meta[config.tableId].items;console.log(tableItems);
    for(let i = 0; i < tableItems.length; i++){
        if(tableItems[i].attrcode === 'cmaterialvid'){console.log('配件编码');
            tableItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
            //参数组织过滤
            // tableItems[i].queryCondition = () => {
            //     let pk_org = props.form.getFormItemsValue(formId,'pk_org').value;
            //     console.log('modifierMeta pkorg = '+pk_org);
            //     return {pk_org : pk_org};
            // };
        }
    }

	let porCol = {
		attrcode: 'opr',
		label: '操作',
        visible: true,
        itemtype: 'customer',
		className:'table-opr',
		width:200,
		fixed:'right',
		render(text, record, index) {
			let status = props.cardTable.getStatus(config.tableId);
			return status === 'browse' ? (
				// <span
    			// 	onClick={() => {
                //         props.cardTable.toggleRowView(config.tableId, record)
        
                //     }}
                //     > 展开
                 // </span>
                 <span></span>
			):(<div className="currency-opr-col">
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.openModel(config.tableId, 'edit', record, index);
							e.stopPropagation();
						}}
					>更多</span>
					&nbsp;&nbsp;
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.delRowsByIndex(config.tableId, index);
							e.stopPropagation();
						}}
					>删除</span>
				</div>
	        );
		}
    };
	meta[config.tableId].items.push(porCol);

	return meta;
}

let Setpart_grp = createPage({
	initTemplate: ()=>{}
})(Setpart);

// ReactDOM.render(<Setpart_grp {...{config:config}}/>, document.querySelector('#app'));
export default Setpart_grp
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65