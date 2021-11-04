///jcNfqFXNjZ0M9WcSiUH8dllneEdpdc8YZylogWGuCSxCZualWzYnCDA4emFizl9
/**
 * 库存信息信息卡片
 * @author  yinshb
 */
const formid = 'materialstock';
const tableid = 'materialwarh';
import { ajax, base,toast,cardCache,promptBox,print } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
import updateModalButton from './updateModalButton'
export function createStockCard(props,values){
    let { button,form} = props;
    let { createForm } = form;
    let { createButtonApp } = button;
    let getTableHead = () =>{
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'materialwarh_table_head',//按钮注册中的按钮区域
                        onButtonClick: (props,id)=>{
                            if(id==='materialwarh_add'){
                                props.cardTable.addRow(tableid);
                            }
                            if(id==='materialwarh_delete'){
                                let index =props.cardTable.getCurrentIndex(tableid);
                                props.cardTable.delRowsByIndex(tableid,index);
                            }
                        }
                    })}
                </div>	
            </div>
        )
    }
    return (
        <div style={{maxHeight:'400px'}}>
        <div className="nc-bill-card">
            <div className="nc-bill-header-area">
                <div className="header-title-search-area"></div>
                <div className="header-button-area">
                    {createButtonApp({
                        area: 'stock_table_inner',
                        buttonLimit: 3, 
                         onButtonClick: onButtonClick4STOCK.bind(this), 
                         popContainer: document.querySelector('.u-modal-content')
        
                    })}
                </div>
            </div>
            <div className="nc-bill-form-area">
                {createForm(formid, {
                    expandArr : ['stock_base','stock_freeasst','stock_check','stock_atp','stock_realusableamount'],
                    onAfterEvent : onAfterEvent4STOCK,
                    onBeforeEvent : onBeforeEvent4STOCK
                    //onAfterEvent: this.onAfterEvent.bind(this)
                })}
            </div>
            <div className="nc-bill-table-area">
                {props.cardTable.createCardTable(tableid, {//列表区
                    tableHead: getTableHead,
                    useFixedHeader:true,    
                    showIndex:true				//显示序号
                })}
            </div>
        </div>
        </div>
    );
}

function onBeforeEvent4STOCK(props, moduleId, key, value,data){
    //props, moduleId(区域id), key(操作的键), value（当前值）,data(当前表单所有值)
    if(key === 'pk_stordoc'){
        let pk_org = props.form.getFormItemsValue(formid,'pk_org');
        let meta = props.meta.getMeta();
        meta['stock_base'].items.forEach((item,index) => {
            if(item.attrcode === 'pk_stordoc'){
                item.queryCondition={
                    pk_org : pk_org.value
                }
            }
        });
        props.meta.setMeta(meta);
    }
    return true;
}


function onAfterEvent4STOCK(props, moduleId, key, value,oldValue){
    //props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
    if(key === 'isretfreeofchk'){
        if(value.value){
            props.form.setFormItemsDisabled(formid,{isretinstobychk:true});
            props.form.setFormItemsValue(formid,{isretinstobychk:{value:false,display:null}});
        }else{
            props.form.setFormItemsDisabled(formid,{isretinstobychk:false});
        }
    }else if(key === 'serialmanaflag'){//进行序列号管理
        if(value.value){
            props.form.setFormItemsDisabled(formid,{issinglcheck:false});
        }else{
            props.form.setFormItemsDisabled(formid,{issinglcheck:true});
            props.form.setFormItemsValue(formid,{issinglcheck:{value:false,display:null}});
        }
    }
}

function onButtonClick4STOCK(props,id) {
    switch(id){
        case 'stock_edit':
            let node_typep = props.config.node_type;
            let pk_orgp =  props.form.getFormItemsValue(formid,'pk_org').value
            let pk_groupp =  props.form.getFormItemsValue(formid,'pk_group').value;
            if(node_typep=='ORG_NODE'&&pk_orgp==pk_groupp){
                toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
            
                return;
            }
            props.form.setFormStatus(formid,'edit');
            props.cardTable.setStatus(tableid,'edit');
            updateModalButton(props,'stock','edit');
            props.form.setFormItemsDisabled(formid,{pk_org:true});
            if(props.form.getFormItemsValue(formid,'isretfreeofchk').value){
                props.form.setFormItemsDisabled(formid,{isretinstobychk:true});
            }else{
                props.form.setFormItemsDisabled(formid,{isretinstobychk:false});
            }
            if(props.form.getFormItemsValue(formid,'serialmanaflag').value){
                props.form.setFormItemsDisabled(formid,{issinglcheck:false});
            }else{
                props.form.setFormItemsDisabled(formid,{issinglcheck:true});
            }
            let pk_measdoc = props.form.getFormItemsValue('material','pk_measdoc');
            let cardTableData = props.cardTable.getAllRows('materialconvert');
            let meta = props.meta.getMeta();
            let arr = [];
            if(pk_measdoc && pk_measdoc.value){
                arr.push(pk_measdoc.value);
            }
            (cardTableData || []).forEach(element => {
                arr.push(element.values['pk_measdoc'].value);
            });
            meta['stock_base'].items.forEach((item,index)=>{
                if(item.attrcode === 'sernumunit'){
                    meta['stock_base'].items[index].queryCondition={
                        pk_measdoc : JSON.stringify(arr),
                        GridRefActionExt:'nccloud.web.uapbd.material.action.MeasdocDefaultGridRefExt'
                    }
                }else if(item.attrcode === 'pk_marpuclass'){
                    meta['stock_base'].items[index].queryCondition={
                        pk_org : props.form.getFormItemsValue(formid,'pk_org').value
                    }
                }
            });
            meta['materialwarh'].items.forEach(item=>{
                if(item.attrcode === 'pk_stordoc'){
                    item.queryCondition = {
                        pk_org : props.form.getFormItemsValue(formid,'pk_org').value
                    }
                }
            });
            props.meta.setMeta(meta);
            break;
        case 'stock_cancel':
            promptBox({
                color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000014')/* 国际化处理： 确认取消*/,                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                content: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000015')/* 国际化处理： 是否确认要取消？*/,             // 提示内容,非必输
                noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                beSureBtnName: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016')/* 国际化处理： 确定*/,          // 确定按钮名称, 默认为"确定",非必输
                cancelBtnName: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/,           // 取消按钮名称, 默认为"取消",非必输
                focusBody:false,
                beSureBtnClick: () => {
                    props.form.cancel(formid);
                    updateModalButton(props,'stock','browse');
                    props.cardTable.resetTableData(tableid);
                    props.cardTable.setStatus(tableid,'browse');
                }
            });
            break;
        case 'stock_save':
            let checked = props.cardTable.checkTableRequired(tableid);
            if(!checked){
                return;
            }
            let CardData = props.createMasterChildData(props.config.pagecodeValues['stock'], formid, tableid);
            let reqData = {
                pageid : props.config.pagecodeValues['stock'],
                head : CardData.head,
                bodys : CardData.body
            }
            let saveFunction = () => {
                ajax({
                    url : '/nccloud/uapbd/material/saveMaterialstock.do',
                    data:reqData,
                    success : (res) => {
                        let {success,data} = res;
                            if(success){
                                let _stock_table_data = props.cardTable.getAllRows('stock');
                                _stock_table_data.forEach((item,index) => {
                                    if(item.rowid === getDefData('cacheRowid',props.config.datasource).stock){
                                        _stock_table_data[index] = data.head.materialstock.rows[0];
                                        _stock_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).stock;
                                    }
                                });
                                props.button.setButtonsVisible({ stock_edit : true, stock_delete : true});
                                props.cardTable.updateTableData('stock',_stock_table_data);
                                props.form.setAllFormValue({
                                    'materialstock' : {
                                        areacode : "materialstock",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialstock.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.materialwarh){
                                    props.cardTable.setTableData('materialwarh',data.bodys.materialwarh);
                                }
                                props.modal.close('stockmodal');
                                
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089'),color:'success'});/* 国际化处理： 保存成功*/
                            }
                    }
                });
            }
            props.validateToSave(reqData,saveFunction,{'materialstock':'form',"materialwarh":'cardTable'},'extcard');
            break;
        case 'stock_delete':
            promptBox({
                color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000046')/* 国际化处理： 确认删除*/,                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                content: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000090')/* 国际化处理： 确认删除该数据吗？*/,             // 提示内容,非必输
                noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                beSureBtnName: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016')/* 国际化处理： 确定*/,          // 确定按钮名称, 默认为"确定",非必输
                cancelBtnName: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/,           // 取消按钮名称, 默认为"取消",非必输
                beSureBtnClick: () => {
                    ajax({
                        url : '/nccloud/uapbd/material/delMaterialstock.do',
                        data : {
                            pk : [props.form.getFormItemsValue(formid,'pk_materialstock').value],
                            ts : [props.form.getFormItemsValue(formid,'ts').value]
                        },
                        success:(res) => {
                            if(res.success){
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                                props.cardTable.delRowByRowId('stock',getDefData('cacheRowid',props.config.datasource).stock);
                                props.modal.close('stockmodal');
                            }
                        }
                    });
                }
            });
            break;
        case 'stock_refresh':
            let pk = props.form.getFormItemsValue(formid,'pk_materialstock');
            ajax({
                url : '/nccloud/uapbd/material/queryMaterialstock.do',
                data : {
                    pk : pk.value,
                    pageid : props.config.pagecodeValues['stock']
                },
                success : (res) => {
                    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                        props.dealFormulamsg(
                            res.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                "materialstock":"form",
                                "materialwarh":"cardTable"
                            }
                        );
                    }
                    let { success, data} = res;
                    if(success){
                        let _stock_table_data = props.cardTable.getAllRows('stock');
                        _stock_table_data.forEach((item,index) => {
                            if(item.rowid === getDefData('cacheRowid',props.config.datasource).stock){
                                _stock_table_data[index] = data.head.materialstock.rows[0];
                                _stock_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).stock;
                            }
                        });
                        props.cardTable.updateTableData('stock',_stock_table_data);
                        props.form.setAllFormValue({
                            'materialstock' : {
                                areacode : "materialstock",
                                rows : [{
                                    status : "0",
                                    values : data.head.materialstock.rows[0].values
                                }]
                            }
                        });
                        if(data.bodys.materialwarh){
                            props.cardTable.setTableData('materialwarh',data.bodys.materialwarh);
                        }else{
                            props.cardTable.setTableData('materialwarh',{rows:[]});
                        }
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/
                    }
                }
            });
            break;
        case 'stock_print':
            let _print_pk = props.form.getFormItemsValue(formid,'pk_materialstock');
            if(!_print_pk || !_print_pk.value){
                return 
            }
            print('pdf',
                props.config.printUrls['stock'],
                {
                    funcode : props.config.printcard.stock.funcode,
                    nodekey : props.config.printcard.stock.nodekey,
                    oids : [_print_pk.value]
                })
            break;
        case 'stock_output':
            let _output_pk = props.form.getFormItemsValue(formid,'pk_materialstock');
            if(!_output_pk || !_output_pk.value){
                return
            }
            this.state.printConfig.url = props.config.printUrls['stock'];
            this.state.printConfig.funcode = this.config.printcard.stock.funcode;
            this.state.printConfig.nodekey = this.config.printcard.stock.nodekey;
            this.state.oids = [_output_pk.value];
            this.setState(this.state,
            this.refs.childPrintOutput.open());
            break;
        
    }
}
///jcNfqFXNjZ0M9WcSiUH8dllneEdpdc8YZylogWGuCSxCZualWzYnCDA4emFizl9