//Uc5CTH8M0YkcbG7KliEoEEjOuBI0zjoWlBt3thdKDeWoxpQex9KPm92AzN4P+VLM
import {ajax,toast} from 'nc-lightapp-front';
import Utils from '../../../../public/utils/index'
import confirmUtil from '../../../../public/pubComponent/confirmUtil/confirmUtil';
const{queryToastFunc} = Utils
/**
 * 银行账户使用权模态框按钮点击事件
 * @param props
 * @param id
 */
export  default function (props,id){
    let orgData = [];
    let {bankaccuse,gridId} = props.config;
    let alltabledata = props.editTable.getAllData(bankaccuse);
    let checkedRows = props.editTable.getCheckedRows(bankaccuse);

    let gridStatus =  props.editTable.getStatus(bankaccuse);
    let browseBtn = ['modalEdit','modalRef','modalEnable'];
    let EditBtn = ['modalSave','modalCancel'];
    let gridmodel = {
        areacode:'bankaccuse',
        rows:[]
    };
    let noCheckBtns = ['modalAdd','modalEdit','modalCancel','modalSave','modalRef'];
    if(checkedRows.length===0&&!noCheckBtns.includes(id)){
        toast({
            'color':'info',
            'content':this.state.json['10140BANKACC-000006']/* 国际化处理： 请选择数据操作！*/
        });
        return;
    }
    switch (id){
        case'modalAdd':
            let rowsdata =this.config.pageFlag ==='list'? {
                'pk_bankaccbas':props.table.getCheckedRows(gridId)[0].data.values.pk_bankaccbas
            }:{
                'pk_bankaccbas':props.cardTable.getCheckedRows(gridId)[0].data.values.pk_bankaccbas,
                'pk_bankaccsub':props.cardTable.getCheckedRows(gridId)[0].data.values.pk_bankaccsub
            };
            props.editTable.addRow(bankaccuse,undefined,true,rowsdata);
            props.button.setMainButton('modalAdd',false);
            props.button.setMainButton('modalSave',true);
            props.button.setButtonVisible(EditBtn,true);
            props.button.setButtonVisible(browseBtn,false);
            break;
        case'modalEdit':
            if(alltabledata.length===0){
                toast({
                    color:'info',
                    content:this.state.json['10140BANKACC-000007']/* 国际化处理： 没有数据要修改！*/
                });
                return;
            }
            props.editTable.setStatus(bankaccuse,'edit');
            props.button.setMainButton('modalAdd',false);
            props.button.setMainButton('modalSave',true);
            props.button.setButtonVisible(EditBtn,true);
            props.button.setButtonVisible(browseBtn,false);

            break;
        case'modalRef':
            this.loadBankaccuseData(()=>{
                queryToastFunc.call(this)();
            });
            break;
        case'modalCancel':
            confirmUtil.call(this,{
                title:this.state.json['10140BANKACC-000008'],/* 国际化处理： 确认取消*/
                content:this.state.json['10140BANKACC-000009'],/* 国际化处理： 是否确认要取消？*/
                beSureBtnClick:()=>{
                    props.editTable.setStatus(bankaccuse,'browse');
                    props.button.setButtonVisible(EditBtn,false);
                    props.button.setButtonVisible(browseBtn,true);
                    props.editTable.cancelEdit(bankaccuse);
                    props.button.setMainButton('modalAdd',true);
                }
            })

            break;
        case'modalDelete':
            if(gridStatus === 'browse'){
                checkedRows.map((obj)=>{
                    gridmodel.rows.push(obj.data)
                })
                gridmodel.rows =  Utils.convertGridEnablestate(gridmodel.rows);
                confirmUtil.call(this,{
                    title:this.state.json['10140BANKACC-000010'],/* 国际化处理： 确认删除*/
                    content:this.state.json['10140BANKACC-000011'],/* 国际化处理： 确认删除所选数据？*/
                    beSureBtnClick:()=>{
                        ajax({
                            url:'/nccloud/uapbd/bankaccuse/batchDelete.do',
                            data:{
                                gridmodel:gridmodel
                            },
                            success:(res)=>{
                                let{success,data}  =res;
                                if(success){
                                    toast({
                                        'color':'success',
                                        'content':this.state.json['10140BANKACC-000001']/* 国际化处理： 操作成功！*/
                                    });
                                    this.loadBankaccuseData();
                                }
                            }
                        });

                    }
                });
            }else if(gridStatus === 'edit'){
                let deleteindex = [];
                checkedRows.map((obj)=>{
                    deleteindex.push(obj.index);
                })
                props.editTable.deleteTableRowsByIndex(bankaccuse,deleteindex);
            }
            break;
        case'modalSave':
            props.editTable.filterEmptyRows(bankaccuse,['pk_bankaccsub','pk_bankaccbas']);
            let savetabledata = props.editTable.getChangedRows(bankaccuse);
            if(savetabledata.length === 0){
                props.editTable.setStatus(bankaccuse,'browse');
                props.button.setButtonVisible(EditBtn,false);
                props.button.setButtonVisible(browseBtn,true);
                toast({
                   color:'success',
                   title:this.state.json['10140BANKACC-000001']
                });
                return;
            }
            savetabledata.map((obj)=>{
                gridmodel.rows.push(obj);
            });
            alltabledata.rows.map((m)=>{
                orgData.push(m.values.pk_org.value);
            });
            let set = new Set(orgData);
            if(set.size!==orgData.length){
                toast({
                    color:'info',
                    title:this.state.json['10140BANKACC-000012']/* 国际化处理： 使用组织重复！*/
                })
                return;
            }
            gridmodel.rows =  Utils.convertGridEnablestate(gridmodel.rows);
            ajax({
                url:this.config.pageFlag ==='card'?'/nccloud/uapbd/bankaccuse/subBatchSave.do':'/nccloud/uapbd/bankaccuse/batchSave.do',
                data:{
                    gridmodel:gridmodel,
                    userjson:this.state.currentPkbankaccbas
                },
                success:(res)=>{
                    let{success,data} =res;
                    if(success){
                        if(data){
                            if(data.hasOwnProperty('message')&&data.message){

                            }else{
                                props.editTable.setStatus(bankaccuse,'browse');
                                props.button.setButtonVisible(browseBtn,true);
                                props.button.setButtonVisible(EditBtn,false);
                                toast({'color':'success','title':this.state.json['10140BANKACC-000001']});/* 国际化处理： 操作成功！*/
                                this.loadBankaccuseData();
                            }
                        }
                    }

                }
            });
            break;
        case'modalEnable':
        case'mbtnDisable':

            let enablestate = checkedRows[0].data.values.enablestate.value;
            if(id!=='mbtnDisable'&&enablestate){
                toast({
                    color:'info',
                    content:this.state.json['10140BANKACC-000013']/* 国际化处理： 已经启用的数据无法启用！*/
                });
                return;
            }
            if(id==='mbtnDisable'&&!enablestate){
                toast({
                    color:'info',
                    content:this.state.json['10140BANKACC-000014']/* 国际化处理： 已经停用的数据无法停用！*/
                });
                return;
            }
            confirmUtil.call(this,{
                title: this.state.json['10140BANKACC-000015'],/* 国际化处理： 询问？*/
                content: enablestate ? this.state.json['10140BANKACC-000065'] : this.state.json['10140BANKACC-000067'],/* 国际化处理： 确定停用？,确定启用？*/
                beSureBtnClick: () => {
                    ajax({
                        url: '/nccloud/uapbd/bankacc/bankaccuse.do',
                        data: {
                            pk_list: [checkedRows[0].data.values.pk_bankaccuse.value],
                            enableswitch: !enablestate,
                            actionName: 'modalEnabledisable'
                        },
                        success: (res) => {
                            let {success, data} = res;
                            if (success) {
                                if (data) {
                                    if (data.hasOwnProperty('message') && data.message) {
                                    }
                                }else {
                                    toast({
                                        'color': 'success',
                                        'content': this.state.json['10140BANKACC-000001']/* 国际化处理： 操作成功！*/
                                    });
                                    this.loadBankaccuseData();
                                }

                            }
                        }
                    });
                }
            });
            break;

    }

}

//Uc5CTH8M0YkcbG7KliEoEEjOuBI0zjoWlBt3thdKDeWoxpQex9KPm92AzN4P+VLM