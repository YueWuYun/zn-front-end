/*dHXciX52Ha4O8WoaOM9NuZWWgQiErI856J0d6+wB/IN9e6sD0L4/dxPnw7DFA7YB*/
import { ajax, toast,print,output, promptBox , cardCache} from 'nc-lightapp-front';
import { searchButtonClick, queryAjax } from './search';
import { listButtonVisible } from './buttonVisible';
import { save,del } from '../../cons/constant';
import { list } from '../../cons/constant';
let { setDefData, getDefData } = cardCache;
/** 
* 整表编辑页面肩部按钮事件
* @author dongyue7
*/

/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export function buttonClick(props, id) {
    let { setStatus } = props.editTable;
    switch (id) {
        //头部 新增
        case 'Add':
            addBill.call(this, props);
            break;
        //头部 修改
        case 'Edit':
            setStatus(this.tableId, 'edit');
            listButtonVisible.call(this, props);
            break;
        //头部 删除
        case 'Delete':
            // deleteBill.call(this, props);
            doDeleteMult.call(this,props)
            break;
        //头部 保存
        case 'Save':
            saveBill.call(this, props);
            break;
        //头部 取消
        case 'Cancel':
            cancel.call(this, props);
            break;
        case 'Refresh':
            let searchCache = getDefData(this.searchCache.key,this.searchCache.dataSource);
            if (searchCache) {
                this.setState({showToast: false})
                searchButtonClick.call(this,props,false);
            }
            toast({
                color: 'success',
                 /* 国际化处理： 刷新成功*/
                content:this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000020')
            }); 
            break;
        //导出数据
        case 'ExportData':
            doDataExport.call(this,props);
            break;
        // 导出模板
        case 'ExportExcel':
           doExcelExport.call(this,props)           
            break;
        // 打印
        case 'Print':         
            doPrint.call(this,props)
            break;
        // 输出
        case 'Output':
            doOutput.call(this,props)
            break;
        case 'Field':
            doUploadFile.call(this,props)
            break;
        default:
            break;
    }
}

/**
 * 数据导出
 * @param {} props 
 */
function doDataExport(props){
    let selectData = props.editTable.getCheckedRows(this.tableId)
    if(selectData && selectData.length == 0){
        toast({
            color: 'warning',
            content:this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000006')                /* 国际化处理： 请选择一行数据进行操作！*/
        }); 
        return;
    }

    let seleckpks = []
    selectData.forEach(e => {
        seleckpks.push(e.data.values.pk_illegal.value)
    });

    if(seleckpks.length >0){
        this.selectedPKS = seleckpks
    }

    props.modal.show('exportFileModal'); //不需要导出的只执行这行代码
}

/**
 * 模板导出
 * @param {} props 
 */
function doExcelExport(props){
    this.selectedPKS = []
    props.modal.show('exportFileModal'); //不需要导出的只执行这行代码
}

/**
 * 附件上传
 * @param {*} props 
 */
function doUploadFile(props){
    let selectDatass = props.editTable.getCheckedRows(this.tableId)
    if (selectDatass && selectDatass.length == 0) {
        toast({
            color: 'warning',
            content:this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000006')                /* 国际化处理： 请选择一行数据进行操作！*/
        }); 
        return;
    }
    
    let fbmbillno  = selectDatass[0].data.values.fbmbillno.value;
    let pk_illegal  = selectDatass[0].data.values.pk_illegal.value;

    this.setState({
        showUploader: !this.state.showUploader,
        target: null,
        billId: pk_illegal,
        billno: fbmbillno 
    });
}

/**
 * 打印操作
 * @param {*} props 
 */
function doPrint(props) {
    let printData = props.editTable.getCheckedRows(this.tableId);
    if(!printData || printData.length == 0){
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000007') });/* 国际化处理： 请选择至少一条数据！*/
        return
    }
    let printpks = [];
    printData.forEach((item) => {
        printpks.push(item.data.values.pk_illegal.value);
    });
    print(
        //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        'pdf',
        '/nccloud/fbm/illegal/illegalPrint.do',
        {
            oids: printpks
        }
    );
}


/**
 * 输出
 * @param {*} props 
 */
function doOutput(props) {
    let outputData = props.editTable.getCheckedRows(this.tableId);
    if(!outputData || outputData.length == 0){
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000007') });/* 国际化处理： 请选择至少一条数据！*/
        return
    }
    let outputpks = []
    outputData.forEach((item) => {
        outputpks.push(item.data.values.pk_illegal.value);
    });
    output({
        url: '/nccloud/fbm/illegal/illegalPrint.do',
        data: {
            oids: outputpks,
            outputType: 'output'
        }
    });
}

/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function addBill(props) {
    let number = props.editTable.getNumberOfRows(this.tableId);
    props.editTable.addRow(this.tableId, number);
    props.editTable.setValByKeyAndIndex(this.tableId, number, 'code', {value: '', display:'', scale:0, isEdit: true});
    listButtonVisible.call(this, props);
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
export function cancel(props) {
    promptBox({
        color: 'warning', 
        title: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000008'),/* 国际化处理： 取消*/
        content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000009'),/* 国际化处理： 确定要取消吗?*/
        beSureBtnClick: () => {
            cancelCallBack.call(this, props);
            listButtonVisible.call(this, props);
        }
    })
}

/**
 * 取消确定回调
 * @param {*} props  页面内置对象
 */
export function cancelCallBack(props) {
    props.editTable.cancelEdit(this.tableId, ()=>{
        
        let searchCache = getDefData(this.searchCache.key,this.searchCache.dataSource);
        if (searchCache) {
            this.setState({showToast: false})
            searchButtonClick.call(this,props,false);
        }
    });
}

/**
 * 保存
 * @param {*} props  页面内置对象
 */
export function saveBill(props) {
    // 获取修改或新增的行
    let changeRows = props.editTable.getChangedRows(this.tableId); 
    // 要删除的数据pk列表
    let toDelrows = this.state.delRows 

    //如果发生数据修改，筛选区分出 要删除数据 和 要保存数据
    // 如果有要删除的数据 则进行筛选
    // 如果没有要删除的数据，则获取所有变更行的pk 

    if(changeRows.length == 0 && toDelrows.length == 0){
        // toast({ color: 'warning', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000010') });  /* 国际化处理： 没有需要保存的数据*/
        searchButtonClick.call(this,props,false);      
        toast({ color: 'success', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000013') }); /* 国际化处理： 保存成功！*/
        props.editTable.setStatus(this.tableId,'browse')
        listButtonVisible.call(this, props);
    }

    

    if(changeRows && changeRows.length>0){
        doSave.call(this,props,changeRows);        
    }

    if(toDelrows && toDelrows.length>0){
        doDelete.call(this,props,toDelrows,false,true)
    }      
}

/**
 * 删除
 * @param {*} props 
 */
function doDeleteMult(props){
    let statusOfTable = props.editTable.getStatus(list.tableCode)
    if(statusOfTable === "browse"){
        promptBox({
            color: 'warning', 
            title: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000001'),/* 国际化处理： 删除*/
            content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000011'),/* 国际化处理： 确定要删除吗?*/
            beSureBtnClick: () => {            
                deleteBill.call(this, props);
            }
        })
    }else{
        deleteBill.call(this, props);
    }    
}

/**
 * 删除
 * @param {*} props  页面内置对象
 */
export function deleteBill(props) {
    // 获取选中行数据
    let checkedRows = props.editTable.getCheckedRows(this.tableId); 
    if(checkedRows && checkedRows.length == 0){
        toast({ color: 'danger', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000012') });/* 国际化处理： 请勾选要删除的数据*/
        return;
    }

    //获取当前页面状态，如果是编辑态，删除不进行数据库操作，只是将删除行加入到删除列表中
    let status = props.editTable.getStatus(this.tableId);
    // let candelno = 0
    if(status === 'edit'){        
        checkedRows.forEach(e => {
            if(e.data.values.pk_illegal && e.data.values.pk_illegal.value){
                this.state.delRowpks.push(e.data.values.pk_illegal.value);
                this.state.delRows.push(e.data)                
                // candelno++
            }
            props.editTable.deleteTableRowsByRowId(this.tableId, e.data.rowid, true);                       
        });    
        // if(candelno < checkedRows.length){
        //     toast({ color: 'warning', content: '您勾选了系统生成的单据，这些单据将无法删除' });
        // }    
    }
    // 如果是浏览态，则直接进行请求后台进行数据删除
    else{   
        let deleteDatas = []
        checkedRows.forEach(e => {
            // if(e.data.values.fromtype.value == "1"){
                // candelno++
                deleteDatas.push(e.data)
            // }
        });  
        if(deleteDatas.length > 0){
            doDelete.call(this,props,deleteDatas,true)
        }        
        // if(candelno < checkedRows.length){
        //     toast({ color: 'warning', content: '您勾选了系统生成的单据，这些单据将无法删除' });
        // }
    }
}

function doSave(props,toSaverows){
    // 必输项校验
    let issave = props.editTable.checkRequired(list.tableCode,toSaverows)

    if(!issave){    
        return
    }

    let data = {
        pageid: list.pageCode,
        // templetid: list.pageTempletid,
        model: {
            areaType: 'table',
            areacode: list.listOid,
            rows: toSaverows
        }
    }
    ajax({
        url: save,
        data,
        success: (res) => {
            if (res.success) {          
                //searchButtonClick.call(this,props,false);      
                toast({ color: 'success', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000013') }); /* 国际化处理： 保存成功！*/
                props.editTable.setStatus(this.tableId,'browse')
                listButtonVisible.call(this, props);
            }
        },
        error: (err) => {
            toast({ color: 'danger', content: err.message });  
                      
        }
    });
    
}

function doDelete(props,delRows,showToast,saveAction){
    let data = {
        pageid: list.pageCode,
        // templetid: list.pageTempletid,
        model: {
            areaType: 'table',
            areacode: list.listOid,
            rows: delRows
        }
    }
    ajax({
        url: del,
        data,
        success: (res) => {
            if (res.success) { 
                if(showToast) {  
                    toast({ color: 'success', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000005') });                    /* 国际化处理： 删除成功！*/
                } 
                if(saveAction){
                    toast({ color: 'success', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000014') });  /* 国际化处理： 保存成功*/
                }
                searchButtonClick.call(this,props,false);                      
                props.editTable.setStatus(this.tableId,'browse')
                listButtonVisible.call(this, props);
                this.state.delRows.length = 0;
                this.state.delRowpks.length = 0;                               
            }
        },
        error: (err) => {
            toast({ color: 'danger', content: err.message });            
        }
    });
}

/*dHXciX52Ha4O8WoaOM9NuZWWgQiErI856J0d6+wB/IN9e6sD0L4/dxPnw7DFA7YB*/