//mCsufEtsS5bDasD5ZqtpS5lHl2L4cpSuTcNpJaLBv3Vv1AjgVGa6IIaLrG9dNn4S
/**
 * 成本信息信息卡片
 * @author  yinshb
 */
const formid = 'materialcost';
const tableid = 'materialcostmode';
import { ajax, base,toast,cardCache,print,promptBox } from 'nc-lightapp-front';
import updateModalButton from './updateModalButton';
let {setDefData, getDefData } = cardCache;
export function createCostCard(props,values){
    let { button,form} = props;
    let { createForm } = form;
    let { createButtonApp } = button;
    let getTableHead = () => {
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'materialcostmode_table_head',//按钮注册中的按钮区域
                        onButtonClick: (props,id)=>{  
                            if(id==='materialcostmode_add'){
                                let rows = props.cardTable.getAllRows(tableid);
                                let index = 0;
                                if(rows){
                                    index = rows.length;
                                }
                                props.cardTable.addRow(tableid,index,{batchcost:{value:false,display:'否'},costmode:{value:"3",display:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000149')/* 国际化处理： 移动平均*/}});
                            }
                            if(id==='materialcostmode_delete'){
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
                        area: 'cost_table_inner',
                        buttonLimit: 3, 
                         onButtonClick: onButtonClick4COST.bind(this), 
                         popContainer: document.querySelector('.u-modal-content')
        
                    })}
                </div>
            </div>
            <div className="nc-bill-form-area">
                {createForm(formid, {
                    expandArr : ['cost_base']
                    //onAfterEvent: this.onAfterEvent.bind(this)
                })}
            </div>
            <div className="nc-bill-table-area">
                {props.cardTable.createCardTable(tableid, {//列表区
                    tableHead: getTableHead,
                    useFixedHeader:true,   
                    onAfterEvent : onAfterEvent4materialcostmode.bind(this),  
                    showIndex:true				//显示序号
                })}
            </div>
        </div>
        </div>
    );
}

function onAfterEvent4materialcostmode(props, moduleId, key, value, changedrows, index, record,type, method){
    //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, index（当前index）, record（行数据）,type(表格内为line，弹窗为modal), method(有blur有change)
    if(key === 'pk_setofbook'){
        if(value.refname){
            props.cardTable.setValByKeysAndIndex(tableid,index,{
                'name' :{value: value.refname,display: value.refname}
            });
        }else{
            props.cardTable.setValByKeysAndIndex(tableid,index,{
                'name' :{value: null,display: null}
            });
        }
        
    }
}

function onButtonClick4COST(props,id) {
    switch(id){
        case 'cost_edit':
            let node_typep = props.config.node_type;
            let pk_orgp =  props.form.getFormItemsValue(formid,'pk_org').value
            let pk_groupp =  props.form.getFormItemsValue(formid,'pk_group').value;
            if(node_typep=='ORG_NODE'&&pk_orgp==pk_groupp){
                toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
            
                return;
            }
            props.form.setFormStatus(formid,'edit');
            props.cardTable.setStatus(tableid,'edit');
            updateModalButton(props,'cost','edit');
            props.form.setFormItemsDisabled(formid,{pk_org:true});
            let meta = props.meta.getMeta();
            meta['materialcostmode'].items.forEach((item,index)=>{
                if(item.attrcode === 'pk_setofbook'){
                    meta['materialcostmode'].items[index].queryCondition={
                        costorg : props.form.getFormItemsValue(formid,'pk_org').value,
                        TreeRefActionExt:'nccloud.web.uapbd.material.action.AccountBookTreeRefExt'
                    }
                }
            });
            props.meta.setMeta(meta);
            break;
        case 'cost_cancel':
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
                    updateModalButton(props,'cost','browse');
                    props.cardTable.resetTableData(tableid);
                    props.cardTable.setStatus(tableid,'browse');
                }
            });
            break;
        case 'cost_save':
            let checked = props.cardTable.checkTableRequired(tableid);
            if(!checked){
                return;
            }
            let CardData = props.createMasterChildData(props.config.pagecodeValues['cost'], formid, tableid);
            let reqData = {
                pageid : props.config.pagecodeValues['cost'],
                head : CardData.head,
                bodys : CardData.body
            }
            let saveFunction = () => {
                ajax({
                    url : '/nccloud/uapbd/material/saveMaterialcost.do',
                    data:reqData,
                    success : (res) => {
                        let {success,data} = res;
                            if(success){
                                let _cost_table_data = props.cardTable.getAllRows('cost');
                                _cost_table_data.forEach((item,index) => {
                                    if(item.rowid === getDefData('cacheRowid',props.config.datasource).cost){
                                        _cost_table_data[index] = data.head.materialcost.rows[0];
                                        _cost_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).cost;
                                    }
                                });
                                props.button.setButtonsVisible({ cost_edit : true, cost_delete : true});
                                props.cardTable.updateTableData('cost',_cost_table_data);
                                props.form.setAllFormValue({
                                    'materialcost' : {
                                        areacode : "materialcost",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialcost.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.materialcostmode){
                                    props.cardTable.updateTableData('materialcostmode',data.bodys.materialcostmode);
                                }
                                props.modal.close('costmodal');
                                
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089'),color:'success'});/* 国际化处理： 保存成功*/
                            }
                    }
                });
            }
            props.validateToSave(reqData,saveFunction,{'materialcost':'form','materialcostmode':'cardTable'},'extcard');
            break;
        case 'cost_delete':
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
                        url : '/nccloud/uapbd/material/delMaterialcost.do',
                        data : {
                            pk : [props.form.getFormItemsValue(formid,'pk_materialcost').value],
                            ts : [props.form.getFormItemsValue(formid,'ts').value]
                        },
                        success:(res) => {
                            if(res.success){
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                                props.cardTable.delRowByRowId('cost',getDefData('cacheRowid',props.config.datasource).cost);
                                props.modal.close('costmodal');
                            }
                        }
                    });
                }
            });
            break;
        case 'cost_refresh':
            let pk = props.form.getFormItemsValue(formid,'pk_materialcost');
            ajax({
                url : '/nccloud/uapbd/material/queryMaterialcost.do',
                data : {
                    pk : pk.value,
                    pageid : props.config.pagecodeValues['cost']
                },
                success : (res) => {
                    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                        props.dealFormulamsg(
                            res.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                "materialcost":"form",
                                "materialcostmode":"cardTable"
                            }
                        );
                    }
                    let { success, data} = res;
                    if(success){
                        let { success, data} = res;
                    if(success){
                        let _cost_table_data = props.cardTable.getAllRows('cost');
                        _cost_table_data.forEach((item,index) => {
                            if(item.rowid === getDefData('cacheRowid',props.config.datasource).cost){
                                _cost_table_data[index] = data.head.materialcost.rows[0];
                                _cost_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).cost;
                            }
                        });
                        props.cardTable.updateTableData('cost',_cost_table_data);
                        props.form.setAllFormValue({
                            'materialcost' : {
                                areacode : "materialcost",
                                rows : [{
                                    status : "0",
                                    values : data.head.materialcost.rows[0].values
                                }]
                            }
                        });
                        if(data.bodys.materialcostmode){
                            props.cardTable.setTableData('materialcostmode',data.bodys.materialcostmode);
                        }else{
                            props.cardTable.setTableData('materialcostmode',{rows:[]});
                        }
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/
                    }
                    }
                }
            });
            break;
        case 'cost_print':
            let _print_pk = props.form.getFormItemsValue(formid,'pk_materialcost');
            if(!_print_pk || !_print_pk.value){
                return 
            }
            print('pdf',
                props.config.printUrls['cost'],
                {
                    funcode : props.config.printcard.cost.funcode,
                    nodekey : props.config.printcard.cost.nodekey,
                    oids : [_print_pk.value]
                })
            break;
        case 'cost_output':
            let _output_pk = props.form.getFormItemsValue(formid,'pk_materialcost');
            if(!_output_pk || !_output_pk.value){
                return
            }
            this.state.printConfig.url = props.config.printUrls['cost'];
            this.state.printConfig.funcode = this.config.printcard.cost.funcode;
            this.state.printConfig.nodekey = this.config.printcard.cost.nodekey;
            this.state.oids = [_output_pk.value];
            this.setState(this.state,
            this.refs.childPrintOutput.open());
            break;
        
    }
}
//mCsufEtsS5bDasD5ZqtpS5lHl2L4cpSuTcNpJaLBv3Vv1AjgVGa6IIaLrG9dNn4S