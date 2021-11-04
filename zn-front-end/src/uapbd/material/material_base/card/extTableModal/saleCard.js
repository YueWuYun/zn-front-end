//dr7LaY/pVnRR6zzj5qGZv0PNZ+Kkxu4zI6R4XYHKeRkW78a5l/M1oVrTnBSkZ/NF
/**
 * 销售信息卡片
 * @author  yinshb
 */
const formid = 'materialsale';
const tableid = 'materialbindle';
import { ajax, base,toast,cardCache,promptBox,print } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
import updateModalButton from './updateModalButton'

export function createSaleCard(props,values){
    let { button,form} = props;
    let { createForm } = form;
    let { createButtonApp } = button;
    let getTableHead = () => {
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'materialbindle_table_head',//按钮注册中的按钮区域
                        onButtonClick: (props,id)=>{
                            if(id==='materialbindle_add'){
                                let rows = props.cardTable.getAllRows(tableid);
                                let index = 0;
                                if(rows){
                                    index = rows.length;
                                }
                                props.cardTable.addRow(tableid,index,{pricetype:{value:'0',display:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000157')/* 国际化处理： 使用捆绑价*/}});
                            }
                            if(id==='materialbindle_delete'){
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
                        area: 'sale_table_inner',
                        buttonLimit: 3, 
                         onButtonClick: onButtonClick4SALE.bind(this), 
                         popContainer: document.querySelector('.u-modal-content')
        
                    })}
                </div>
            </div>
            <div className="nc-bill-form-area">
                {createForm(formid, {
                    expandArr : ['sale_base']
                    //onAfterEvent: this.onAfterEvent.bind(this)
                })}
            </div>
            <div className="nc-bill-table-area">
                {props.cardTable.createCardTable(tableid, {//列表区
                    tableHead: getTableHead,
                    useFixedHeader:true,
                    onAfterEvent : onAfterEvent4materialbindle.bind(this), 
                    showIndex:true				//显示序号
                })}
            </div>
        </div>
        </div>
    );
}

function onAfterEvent4materialbindle(props, moduleId, key, value, changedrows, index, record,type, method){
    //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, index（当前index）, record（行数据）,type(表格内为line，弹窗为modal), method(有blur有change)
    if(key === 'pk_bindle'){
        console.log('pk_bindle',value);
        if(value.refname && value.values){
            props.cardTable.setValByKeysAndIndex(tableid,index,{
                'name' :{value: value.refname,display: value.refname},
                'materialspec':{value:value.values.materialspec.value,display:value.values.materialspec.value},
                'materialtype':{value:value.values.materialtype.value,display:value.values.materialtype.value},
                'pk_measdoc':{value:value.values.pk_measdoc.value,display:value.values.measdoc_name.value}
            });
        }else{
            props.cardTable.setValByKeysAndIndex(tableid,index,{
                'name' :{value: null,display: null},
                'materialspec':{value: null,display: null},
                'materialtype':{value: null,display: null},
                'pk_measdoc':{value: null,display: null}
            });
        }
        
    }
}


function onButtonClick4SALE(props,id) {
    switch(id){
        case 'sale_edit':
            let node_typepsale = props.config.node_type;
            let pk_orgpsale =  props.form.getFormItemsValue(formid,'pk_org').value
            let pk_grouppsale =  props.form.getFormItemsValue(formid,'pk_group').value;
            if(node_typepsale=='ORG_NODE'&&pk_orgpsale==pk_grouppsale){
                toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
            
                return;
            }
            props.form.setFormStatus(formid,'edit');
            props.cardTable.setStatus(tableid,'edit');
            updateModalButton(props,'sale','edit');
            props.form.setFormItemsDisabled(formid,{pk_org:true});
            let meta = props.meta.getMeta();
            meta['sale_base'].items.forEach((item,index)=>{
                if(item.attrcode === 'pk_marsaleclass'){
                    meta['sale_base'].items[index].queryCondition={
                        pk_org : props.form.getFormItemsValue(formid,'pk_org').value
                    }
                }
            });
            meta['materialbindle'].items.forEach((item,index)=>{
                if(item.attrcode === 'pk_bindle'){
                    meta['materialbindle'].items[index].queryCondition={
                        pk_org : props.form.getFormItemsValue(formid,'pk_org').value
                    }
                }
            });
            props.meta.setMeta(meta);
            break;
        case 'sale_cancel':
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
                    updateModalButton(props,'sale','browse');
                    props.cardTable.resetTableData(tableid);
                    props.cardTable.setStatus(tableid,'browse');
                }
            });
            break;
        case 'sale_save':
            let checked = props.cardTable.checkTableRequired(tableid);
            if(!checked){
                return;
            }
            let CardData = props.createMasterChildData(props.config.pagecodeValues['sale'], formid, tableid);
            let reqData = {
                pageid : props.config.pagecodeValues['sale'],
                head : CardData.head,
                bodys : CardData.body
            }
            let saveFunction = () => {
                ajax({
                    url : '/nccloud/uapbd/material/saveMaterialsale.do',
                    data:reqData,
                    success : (res) => {
                        let {success,data} = res;
                            if(success){
                                let _sale_table_data = props.cardTable.getAllRows('sale');
                                _sale_table_data.forEach((item,index) => {
                                    if(item.rowid === getDefData('cacheRowid',props.config.datasource).sale){
                                        _sale_table_data[index] = data.head.materialsale.rows[0];
                                        _sale_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).sale;
                                    }
                                });
                                props.button.setButtonsVisible({ sale_edit : true, sale_delete : true});
                                props.cardTable.updateTableData('sale',_sale_table_data);
                                props.form.setAllFormValue({
                                    'materialsale' : {
                                        areacode : "materialsale",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialsale.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.materialbindle){
                                    props.cardTable.updateTableData('materialbindle',data.bodys.materialbindle);
                                }
                                props.modal.close('salemodal');
                                
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089'),color:'success'});/* 国际化处理： 保存成功*/
                            }
                    }
                });
            }
            props.validateToSave(reqData,saveFunction,{'materialsale':'form','materialbindle':'cardTable'},'extcard');
            break;
        case 'sale_delete':
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
                        url : '/nccloud/uapbd/material/delMaterialsale.do',
                        data : {
                            pk : [props.form.getFormItemsValue(formid,'pk_materialsale').value],
                            ts : [props.form.getFormItemsValue(formid,'ts').value]
                        },
                        success:(res) => {
                            if(res.success){
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                                props.cardTable.delRowByRowId('sale',getDefData('cacheRowid',props.config.datasource).sale);
                                props.modal.close('salemodal');
                            }
                        }
                    });
                }
            });
            break;
        case 'sale_refresh':
            let pk = props.form.getFormItemsValue(formid,'pk_materialsale');
            ajax({
                url : '/nccloud/uapbd/material/queryMaterialsale.do',
                data : {
                    pk : pk.value,
                    pageid : props.config.pagecodeValues['sale']
                },
                success : (res) => {
                    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                        props.dealFormulamsg(
                            res.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                "materialsale":"form",
                                "materialbindle":"cardTable"
                            }
                        );
                    }
                    let { success, data} = res;
                    if(success){
                        let _sale_table_data = props.cardTable.getAllRows('sale');
                        _sale_table_data.forEach((item,index) => {
                            if(item.rowid === getDefData('cacheRowid',props.config.datasource).sale){
                                _sale_table_data[index] = data.head.materialsale.rows[0];
                                _sale_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).sale;
                            }
                        });
                        props.cardTable.updateTableData('sale',_sale_table_data);
                        props.form.setAllFormValue({
                            'materialsale' : {
                                areacode : "materialsale",
                                rows : [{
                                    status : "0",
                                    values : data.head.materialsale.rows[0].values
                                }]
                            }
                        });
                        if(data.bodys.materialbindle){
                            props.cardTable.setTableData('materialbindle',data.bodys.materialbindle);
                        }else{
                            props.cardTable.setTableData('materialbindle',{rows:[]});
                        }
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/
                    }
                }
            });
            break;
        case 'sale_print':
            let _print_pk = props.form.getFormItemsValue(formid,'pk_materialsale');
            if(!_print_pk || !_print_pk.value){
                return 
            }
            print('pdf',
                props.config.printUrls['sale'],
                {
                    funcode : props.config.printcard.sale.funcode,
                    nodekey : props.config.printcard.sale.nodekey,
                    oids : [_print_pk.value]
                })
            break;
        case 'sale_output':
            let _output_pk = props.form.getFormItemsValue(formid,'pk_materialsale');
            if(!_output_pk || !_output_pk.value){
                return
            }
            this.state.printConfig.url = props.config.printUrls['sale'];
            this.state.printConfig.funcode = this.config.printcard.sale.funcode;
            this.state.printConfig.nodekey = this.config.printcard.sale.nodekey;
            this.state.oids = [_output_pk.value];
            this.setState(this.state,
            this.refs.childPrintOutput.open());
            break;
        
    }
}
//dr7LaY/pVnRR6zzj5qGZv0PNZ+Kkxu4zI6R4XYHKeRkW78a5l/M1oVrTnBSkZ/NF