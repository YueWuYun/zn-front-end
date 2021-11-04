//xAXJy+TtMEzeZs3uh1rJDmgJ81Ks0si9QQMPEstLHYf0a59L0OtUDbwk/jSasVVl
/**
 * 利润中心陈本信息卡片
 * @author  yinshb
 */
const formid = 'materialpfcc';
const tableid = 'profitcostlist';
import { ajax, base,toast,cardCache,promptBox,print } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
import updateModalButton from './updateModalButton'
export function createPfccinfoCard(props,values){
    let { button,form} = props;
    let { createForm } = form;
    let { createButtonApp } = button;
    let getTableHead = () => {
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'profitcostlist_table_head',//按钮注册中的按钮区域
                        onButtonClick: (props,id)=>{
                            if(id==='profitcostlist_add'){
                                props.cardTable.addRow(tableid);
                            }
                            if(id==='profitcostlist_delete'){
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
                        area: 'pfccinfo_table_inner',
                        buttonLimit: 3, 
                         onButtonClick: onButtonClick4PFCCINFO.bind(this), 
                         popContainer: document.querySelector('.u-modal-content')
        
                    })}
                </div>
            </div>
            <div className="nc-bill-form-area">
                {createForm(formid, {
                    expandArr : ['pfcc_base']
                    //onAfterEvent: this.onAfterEvent.bind(this)
                })}
            </div>
            <div className="nc-bill-table-area">
                {props.cardTable.createCardTable(tableid, {//列表区
                    tableHead: getTableHead,
                    useFixedHeader:true,  
                    onAfterEvent : onAfterEvent4profitcostlist.bind(this),    
                    showIndex:true				//显示序号
                })}
            </div>
        </div>
        </div>
    );
}

function onAfterEvent4profitcostlist(props, moduleId, key, value, changedrows, index, record,type, method){
    //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, index（当前index）, record（行数据）,type(表格内为line，弹窗为modal), method(有blur有change)
    if(key === 'pk_liabilitybook'){
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

function onButtonClick4PFCCINFO(props,id) {
    switch(id){
        case 'pfccinfo_edit':
            let node_typep = props.config.node_type;
            let pk_orgp =  props.form.getFormItemsValue(formid,'pk_org').value
            let pk_groupp =  props.form.getFormItemsValue(formid,'pk_group').value;
            if(node_typep=='ORG_NODE'&&pk_orgp==pk_groupp){
                toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
            
                return;
            }
            props.form.setFormStatus(formid,'edit');
            props.cardTable.setStatus(tableid,'edit');
            updateModalButton(props,'pfccinfo','edit');
            props.form.setFormItemsDisabled(formid,{pk_org:true});
            let meta = props.meta.getMeta();
            meta['profitcostlist'].items.forEach((item,index)=>{
                if(item.attrcode === 'pk_liabilitybook'){
                    meta['profitcostlist'].items[index].queryCondition={
                        pk_relorg: props.form.getFormItemsValue(formid,'pk_org').value,
                        TreeRefActionExt : 'nccloud.web.uapbd.material.action.LiabilityBookTreeRefExt'
                    }
                }
            });
            props.meta.setMeta(meta);
            break;
        case 'pfccinfo_cancel':
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
                    updateModalButton(props,'pfccinfo','browse');
                    props.cardTable.resetTableData(tableid);
                    props.cardTable.setStatus(tableid,'browse');
                }
            });
            break;
        case 'pfccinfo_save':
            let checked = props.cardTable.checkTableRequired(tableid);
            if(!checked){
                return;
            }
            let CardData = props.createMasterChildData(props.config.pagecodeValues['pfccinfo'], formid, tableid);
            let reqData = {
                pageid : props.config.pagecodeValues['pfccinfo'],
                head : CardData.head,
                bodys : CardData.body
            }
            let saveFunction = () => {
                ajax({
                    url : '/nccloud/uapbd/material/saveMaterialpfcc.do',
                    data:reqData,
                    success : (res) => {
                        let {success,data} = res;
                            if(success){
                                let _pfccinfo_table_data = props.cardTable.getAllRows('pfccinfo');
                                _pfccinfo_table_data.forEach((item,index) => {
                                    if(item.rowid === getDefData('cacheRowid',props.config.datasource).pfccinfo){
                                        _pfccinfo_table_data[index] = data.head.materialpfcc.rows[0];
                                        _pfccinfo_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).pfccinfo;
                                    }
                                });
                                props.button.setButtonsVisible({ pfccinfo_edit : true, pfccinfo_delete : true});
                                props.cardTable.updateTableData('pfccinfo',_pfccinfo_table_data);
                                props.form.setAllFormValue({
                                    'materialpfcc' : {
                                        areacode : "materialpfcc",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialpfcc.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.profitcostlist){
                                    props.cardTable.updateTableData('profitcostlist',data.bodys.profitcostlist);
                                }
                                props.modal.close('pfccinfomodal');
                                
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089'),color:'success'});/* 国际化处理： 保存成功*/
                            }
                    }
                });
            }
            props.validateToSave(reqData,saveFunction,{'materialpfcc':'form','profitcostlist':'cardTable'},'extcard')
            break;
        case 'pfccinfo_delete':
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
                        url : '/nccloud/uapbd/material/delMaterialpfcc.do',
                        data : {
                            pk : [props.form.getFormItemsValue(formid,'pk_mateprofcost').value],
                            ts : [props.form.getFormItemsValue(formid,'ts').value]
                        },
                        success:(res) => {
                            if(res.success){
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                                props.cardTable.delRowByRowId('pfccinfo',getDefData('cacheRowid',props.config.datasource).pfccinfo);
                                props.modal.close('pfccinfomodal');
                            }
                        }
                    });
                }
            });
            break;
        case 'pfccinfo_refresh':
            let pk = props.form.getFormItemsValue(formid,'pk_mateprofcost');
            ajax({
                url : '/nccloud/uapbd/material/queryMaterialpfcc.do',
                data : {
                    pk : pk.value,
                    pageid : props.config.pagecodeValues['pfccinfo']
                },
                success : (res) => {
                    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                        props.dealFormulamsg(
                            res.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                "materialpfcc":"form",
                                "profitcostlist":"cardTable"
                            }
                        );
                    }
                    let { success, data} = res;
                    if(success){
                        let _pfccinfo_table_data = props.cardTable.getAllRows('pfccinfo');
                        _pfccinfo_table_data.forEach((item,index) => {
                            if(item.rowid === getDefData('cacheRowid',props.config.datasource).pfccinfo){
                                _pfccinfo_table_data[index] = data.head.materialpfcc.rows[0];
                                _pfccinfo_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).pfccinfo;
                            }
                        });
                        props.cardTable.updateTableData('pfccinfo',_pfccinfo_table_data);
                        props.form.setAllFormValue({
                            'materialpfcc' : {
                                areacode : "materialpfcc",
                                rows : [{
                                    status : "0",
                                    values : data.head.materialpfcc.rows[0].values
                                }]
                            }
                        });
                        if(data.bodys.profitcostlist){
                            props.cardTable.setTableData('profitcostlist',data.bodys.profitcostlist);
                        }else{
                            props.cardTable.setTableData('profitcostlist',{rows:[]});
                        }
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/
                    }
                }
            });
            break;
        case 'pfccinfo_print':
            let _print_pk = props.form.getFormItemsValue(formid,'pk_mateprofcost');
            if(!_print_pk || !_print_pk.value){
                return 
            }
            print('pdf',
                props.config.printUrls['pfccinfo'],
                {
                    funcode : props.config.printcard.pfccinfo.funcode,
                    nodekey : props.config.printcard.pfccinfo.nodekey,
                    oids : [_print_pk.value]
                })
            break;
        case 'prod_output':
            let _output_pk = props.form.getFormItemsValue(formid,'pk_mateprofcost');
            if(!_output_pk || !_output_pk.value){
                return
            }
            this.state.printConfig.url = props.config.printUrls['pfccinfo'];
            this.state.printConfig.funcode = this.config.printcard.pfccinfo.funcode;
            this.state.printConfig.nodekey = this.config.printcard.pfccinfo.nodekey;
            this.state.oids = [_output_pk.value];
            this.setState(this.state,
            this.refs.childPrintOutput.open());
            break;
        
    }
}
//xAXJy+TtMEzeZs3uh1rJDmgJ81Ks0si9QQMPEstLHYf0a59L0OtUDbwk/jSasVVl