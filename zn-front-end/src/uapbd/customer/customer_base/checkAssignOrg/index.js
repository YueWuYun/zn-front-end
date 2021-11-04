//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import{ajax,toast} from 'nc-lightapp-front';
import confirmUtil from '../../../public/pubComponent/confirmUtil/confirmUtil';
import getAssignOrgdata from '../checkAssignOrg/function/getAssignOrgdata';
export default function(props){
    const {button,table,form} = props;
    const{createForm} = form;
    const{createSimpleTable} = table;
    const{createButtonApp} = button;
    return(
        <div className="">
            <div className="">
                <div>
                    <div className="header-button-area" style={{textAlign: 'right', marginBottom: '8px'}}>
                        {createButtonApp({
                            area:'assignOrg-modal-button',
                            onButtonClick:checkAssignModalBtnClick.bind(this),
                            popContainer: document.querySelector('#header-button-area')
                        })}
                    </div>
                </div>
                <div className="nc-bill-form-area">
                    {createForm('assignOrgCustInfo')}
                </div>
                {/* 列表区 */}
                <div className="nc-bill-table-area">
                    {createSimpleTable('assignOrgtable', {
                        onSelected:assignModalonSelected.bind(this),
                        onSelectedAll:assignModalonSelectedAll.bind(this),
                        showIndex:true,
                        showCheck:true
                    })}
                </div>
            </div>
        </div>
    )
}

function assignModalonSelectedAll(props, moduleId, status, length) {
    props.button.setButtonDisabled(['assignModalEnable', 'assignEnable','assignModalDisable'],!status);
    
}
function assignModalonSelected(props, moduleId, record, index, status) {
    let checkedRowData =  props.table.getCheckedRows(moduleId);
    if(checkedRowData.length === 0){
        props.button.setButtonDisabled(['assignModalEnable', 'assignEnable','assignModalDisable'],true);
    }else if(checkedRowData.length > 1){
        props.button.setButtonDisabled(['assignModalEnable', 'assignEnable','assignModalDisable'],false);
    }else{
        props.button.setButtonDisabled(['assignModalEnable', 'assignEnable',],checkedRowData[0].data.values.enablestate.value == '2');
        props.button.setButtonDisabled(['assignModalDisable'],checkedRowData[0].data.values.enablestate.value != '2');
    }
}

function checkAssignModalBtnClick(props,id) {

    let enablestatearray = [];
    let checkedRowData =  props.table.getCheckedRows('assignOrgtable');
    if(checkedRowData.length===0){
        toast({color:'warning',title:this.state.json['10140CUST-000019']});/* 国际化处理： 请选择数据操作！*/
        return;
    }
    checkedRowData.length===0||checkedRowData.map((item)=>{
        enablestatearray.push(item.data.values.enablestate.value);
    });

    switch (id){
        case'assignEnable':
        case'assignModalEnable':
            enablestatearray.includes('2')||
            enableDisableSwitch.call(this,props,id,checkedRowData,()=>{
                props.button.setButtonDisabled(['assignModalEnable', 'assignEnable',],true);
                toast({
                    color:'success',
                    title:this.state.json['10140CUST-000020']/* 国际化处理： 操作成功*/
                });

            });
            enablestatearray.includes('2')&&
            toast({
                color:'warning',
                content:this.state.json['10140CUST-000021']/* 国际化处理： 已选数据中有已启用数据，请重新选择！*/
            });
            break;
        case'assignModalDisable':
            enablestatearray.includes('3')||
            enableDisableSwitch.call(this,props,id,checkedRowData,()=>{
                props.button.setButtonDisabled(['assignModalDisable'],true);
                toast({
                    color:'success',
                    title:this.state.json['10140CUST-000020']/* 国际化处理： 操作成功*/
                });

            });
            enablestatearray.includes('3')&&toast({
                color:'warning',
                content:this.state.json['10140CUST-000022']/* 国际化处理： 已选数据中有已停用数据，请重新选择！*/
            });
            break;
        default:
            break;
    }
}

function enableDisableSwitch(props,id,checkedRowData,callback) {
    let modalContent =
        id==='assignModalDisable'?
            this.state.json['10140CUST-000023']:this.state.json['10140CUST-000024'];/* 国际化处理： 确定停用所选数据？,确定启用所选数据？*/
    confirmUtil.call(this,{
        title:this.state.json['10140CUST-000025'],/* 国际化处理： 询问*/
        content:modalContent,
        beSureBtnClick:()=>{
            ajax({
                url:'/nccloud/uapbd/customer/assignOrgEnableDisable.do',
                data:{
                    model:{
                        areacode:'assignOrgtable',
                        rows:[checkedRowData[0].data],
                        pageInfo:props.table.getTablePageInfo('assignOrgtable')
                    },
                    pageid:props.config.pagecode,
                    userjson:id

                },
                success:(res)=>{
                    let {success,data} = res;
                    if(success){
                        if(data){
                            getAssignOrgdata.call(this,props, 'btnCheckOrg', checkedRowData[0].data.values.pk_customer);
                           // props.table.updateDataByIndexs('assignOrgtable',[{index:checkedRowData[0].index,data:data['assignOrgtable'].rows[0]}]);
                            callback.call(this);
                        }


                    }
                }
            });
        }
    })
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65