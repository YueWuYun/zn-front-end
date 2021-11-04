//OWmq6Ugo6jPE4W7xoi1UXj8PR512kyTS21rNeRW00hlQtkkV5JQfVNGNrH/0ar1a
export default function afterEvent(props, moduleId, key, value, index) {
    if(key==='base_doc_type'){
        // 重要！下面那行一定要写
        props.renderItem('form', moduleId, 'pk_base_doc', null) // 前三个参数，根据模板json填对应值，moduleId是区域id
        let meta = props.meta.getMeta();
        props.form.setFormItemsValue('accountingbookcard',{'pk_base_doc':{value:null,display:null},});
        // switch (value.value) {
        //     case '0':
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').itemtype = 'refer';
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').refcode = 'uapbd/refer/psninfo/PsndocTreeGridRef/index';
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').isShowUnit = true;
        //         props.meta.setMeta(meta);
        //         break;
        //     case '1':
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').itemtype = 'refer';
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').refcode = 'uapbd/refer/customer/CustomerDefaultTreeGridRef/index.js';
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').isShowUnit = true;
        //         props.meta.setMeta(meta);
        //         break;
        //     case '2':
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').itemtype = 'refer';
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').refcode = 'uapbd/refer/supplier/SupplierRefTreeGridRef/index.js';
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').isShowUnit = true;
        //         props.meta.setMeta(meta);
        //         break;
        //     case '3':
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').itemtype = 'refer';
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').refcode = 'uapbd/refer/org/OrgWithGlobalAllDataTreeRef/index.js';
        //         props.meta.setMeta(meta);
        //         break;
        //     case '4':
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').itemtype = 'refer';
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').refcode = 'uapbd/refer/org/BusinessUnitTreeRef/index.js';
        //         props.meta.setMeta(meta);
        //         break;
        //     case '5':
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').itemtype = 'refer';
        //         meta[moduleId].items.find(e=>e.attrcode === 'pk_base_doc').refcode = 'uap/refer/riart/userDevelopRefer/index.js';
        //         props.meta.setMeta(meta);
        //         break;
        // }
    }
}

//OWmq6Ugo6jPE4W7xoi1UXj8PR512kyTS21rNeRW00hlQtkkV5JQfVNGNrH/0ar1a