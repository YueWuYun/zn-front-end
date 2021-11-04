//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import MaterialClass from '../../class_base/main'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage,ajax} from 'nc-lightapp-front';

let config = {
	nodeName: '10140MCLG-000042',/* 国际化处理： 物料基本分类-集团*/
    nodetype: 'group',
    pageCode: '10140MCLG_page',
    appcode: '10140MCLG',
    appid: '0001Z010000000000H8S',
    treeId: 'materialtypetreeid',
    formId:'head',
    billType:'class_grp',
    defaultOrg:{},
}

/**
 * 单据模板
 * @param props
 */
const initTemplate = (props)=>{
    
    //页面初始设置button状态
    const initButtonStatus=(props)=>{console.log('class_grp.initButtonStatus');
        //设置保存按钮不显示
        props.button.setButtonVisible('save',false);
        //设置取消按钮不显示
        props.button.setButtonVisible('cancel',false);
        //设置保存新增按钮不显示
        props.button.setButtonVisible('saveAdd',false);
        props.button.setUploadConfig("import",excelimportconfig);
    }

    props.createUIDom(
        {
            pagecode:config.pageCode,
            // appid:config.appid,
            // appcode:config.pageCode
        },
        (data)=>{console.log('createUIDom');console.log(data);
            if(data.template){
                let meta = data.template;
				modifierMeta(props, meta);
				props.meta.setMeta(meta,()=>{
                    props.form.setFormItemsValue("head",{'code':{value:'',display:this.state.json['10140MCLG-000000']}});/* 国际化处理： 编码规则：XX-XX-XX-XXXX*/
                });
            }
            if (data.button) {
                props.button.setButtons(data.button);
                initButtonStatus(props);
            }
            config.defaultOrg = {pk_org:data.context.pk_org,org_Name:data.context.org_Name};
        }
    );
}

function modifierMeta(props, meta) {
    console.log('modifierMeta');
    console.log(props.MutiInit.getIntl("10140MCLG"));
    // 修改参照refcode
    let formItems = meta[config.formId].items;
    for(let i = 0; i < formItems.length; i++){
        if(formItems[i].attrcode === 'code'){//启用状态
            formItems[i].placeholder = props.MutiInit.getIntl("10140MCLG").get('10140MCLG-000000');//所属组织/* 国际化处理： 编码规则：XX-XX-XX-XXXX*/

        }
        if(formItems[i].attrcode === 'enablestate'){//启用状态
            formItems[i].disabled = true;//所属组织
        }
    }

    let frameItems = meta['marasstframe'].items;
    for(let i = 0; i < frameItems.length; i++){
        if(frameItems[i].attrcode === 'pk_marasstframe'){//辅助属性结构
            frameItems[i].refcode = '../../../../uapbd/refer/material/MarAsstFrameGridRef/index.js';//所属组织
        }
    }
}

let MaterialClass_grp = createPage({
    billinfo:{
        billtype: 'form', 
        pagecode: config.pageCode, 
        headcode: 'head',
        bodycode: 'head'
    },
	initTemplate: () => {}
})(MaterialClass);

ReactDOM.render(<MaterialClass_grp {...{config:config}}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65