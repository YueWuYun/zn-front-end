//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import MaterialClass from '../../supplierqualisys/main'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage,ajax} from 'nc-lightapp-front';

let config = {
	nodeName: '10140SAQSG-000056',
    nodetype: 'group',
    pageCode: '10140SAQSG_qualidoc_card',
    appid: '0001Z010000000001NMZ',
    treeId: 'materialtypetreeid',
    formId:'supqualidoc',
    typeFormId:'supqualitype',
    appcode:'10140SAQSG_GRP',
    tableId:'supqualilevel',
    template:'10140SAQSG_qualidoc_card',
    defaultOrg:{}
}

/**
 * 单据模板
 * @param props
 */
const initTemplate = (props)=>{
    /**
     * 页面初始设置button状态
     * @param props
     */
    const initButtonStatus=(props)=>{console.log('class_grp.initButtonStatus');
        //设置保存按钮不显示
        props.button.setButtonVisible(['save','cancel','saveAdd','addline'],false);
        // //设置取消按钮不显示
        // props.button.setButtonVisible('cancel',false);
        // //设置保存新增按钮不显示
        // props.button.setButtonVisible('saveAdd',false);
        // props.button.setButtonVisible('addline',false);
    }

    props.createUIDom(
        {
            pagecode:config.pageCode,
            // appid:config.appid,
            // appcode:config.appcode
        },
        (data)=>{console.log('createUIDom');console.log(data);
            if(data.template){
                let meta = data.template;
				modifierMeta(props, meta)
				props.meta.setMeta(meta);
                // props.meta.setMeta(data.template);
            }
            if (data.button) {
                props.button.setButtons(data.button);
                initButtonStatus(props);
            }
            props.config.defaultOrg = {pk_org:data.context.pk_org,org_Name:data.context.org_Name};
        }
    );


}

function modifierMeta(props, meta) {
	// let status = props.getUrlParam('status');
	// meta[config.formId].status = status;
	// meta[config.tableId].status = status;
    console.log('modifierMeta');
    // 修改参照refcode
    let formItems = meta[config.formId].items;
    for(let i = 0; i < formItems.length; i++){
        if(formItems[i].attrcode === 'pk_qualitype'){//资质分类
            formItems[i].refcode = '../../../../uapbd/refer/pub/SupplierQualiTypeTreeRef/index.js';//资质分类
        }
    }

    // 修改参照refcode
    let typeFormItems = meta[config.typeFormId].items;
    for(let i = 0; i < typeFormItems.length; i++){
        if(typeFormItems[i].attrcode === 'pk_parentqualitype'){//上级资质分类
            typeFormItems[i].refcode = '../../../../uapbd/refer/pub/SupplierQualiTypeTreeRef/index.js';////上级资质分类
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
            console.log('status============'+status);
			return status === 'browse' ? (
				// <span
    			// 	onClick={() => {
                //         props.cardTable.toggleRowView(config.tableId, record)
        
                //     }}
                //     > 展开
                 // </span>
                 ''
			):(<div className="currency-opr-col">
					{/* <span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.openModel(config.tableId, 'edit', record, index);
							e.stopPropagation();
						}}
					>更多</span>
					&nbsp;&nbsp; */}
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

let MaterialClass_grp = createPage({
    billinfo:{
        billtype: 'card', 
        pagecode: config.pageCode, 
        headcode: config.formId,
        bodycode: config.tableId
    },
	initTemplate: ()=>{}
})(MaterialClass);

// ReactDOM.render(<MaterialClass_grp {...{config:config}}/>, document.querySelector('#app'));
export default MaterialClass_grp
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65