//Uc5CTH8M0YkcbG7KliEoEEjOuBI0zjoWlBt3thdKDeWoxpQex9KPm92AzN4P+VLM
import {ajax,toast} from 'nc-lightapp-front';
import Utils from '../../../../../public/utils';
import  confirmUtil from '../../../../../public/pubComponent/confirmUtil/confirmUtil';
//模态框按钮点击事件
/**
 * 银行账户使用权模态框按钮点击事件
 * @param props
 * @param id
 */
export  default function (props,id){
    let orgData = [];
    let {bankaccuse,gridId} = props.config;
    let tabledata = props.editTable.getChangedRows(bankaccuse);
    let alltabledata = props.editTable.getAllData(bankaccuse);
    let checkedRows = props.editTable.getCheckedRows(bankaccuse);
    let mainCheckedRows = props.table.getCheckedRows(gridId);
    let browseBtn = ['modalEdit','modalRef','modalEnable'];
    let EditBtn = ['modalSave','modalCancel'];
    let gridmodel = {
        areacode:'bankaccuse',
        rows:[]
    };
    let noCheckBtns = ['modalAdd','modalEdit','modalCancel','modalSave','modalRef'];
    if(checkedRows.length===0&&!noCheckBtns.includes(id)){
        toast({
            'color':'warning',
            'title':this.state.json['10140BANKACC-000006']/* 国际化处理： 请选择数据操作！*/
        });
        return;
    }
    let enablestate = checkedRows[0].data.values.enablestate.value;

    switch (id){
        case'modalAdd':
            props.editTable.addRow(bankaccuse);
            props.button.setButtonVisible(EditBtn,true);
            props.button.setButtonVisible(browseBtn,false);
            break;
        case'modalEdit':
            if(alltabledata.length===0){
                toast({
                    color:'warning',
                    title:this.state.json['10140BANKACC-000007']/* 国际化处理： 没有数据要修改！*/
                });
                return;
            }
            props.editTable.setStatus(bankaccuse,'edit');
            props.button.setButtonVisible(EditBtn,true);
            props.button.setButtonVisible(browseBtn,false);
            break;
        case'modalRef':
            this.loadBankaccuseData(mainCheckedRows);
            break;
        case'modalCancel':
            props.editTable.setStatus(bankaccuse,'browse');
            props.button.setButtonVisible(EditBtn,false);
            props.button.setButtonVisible(browseBtn,true);
            props.editTable.cancelEdit(bankaccuse);
            break;
        case'modalDelete':

            checkedRows.map((obj)=>{
                gridmodel.rows.push(obj.data)
            })
            gridmodel.rows =  Utils.convertGridEnablestate(gridmodel.rows);
            confirmUtil.call(this,{
                title:this.state.json['10140BANKACC-000015'],/* 国际化处理： 询问？*/
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
                                    'title':this.state.json['10140BANKACC-000001']/* 国际化处理： 操作成功！*/
                                });
                                this.loadBankaccuseData(mainCheckedRows);
                            }
                        }
                    });

                }
            })
            break;
        case'modalSave':
            if(tabledata.length === 0){
                props.editTable.setStatus(bankaccuse,'browse');
                props.button.setButtonVisible(EditBtn,false);
                props.button.setButtonVisible(browseBtn,true);
                return;
            }
            tabledata.map((obj)=>{
                gridmodel.rows.push(obj);
            });
            alltabledata.rows.map((m)=>{
                orgData.push(m.values.pk_org.value);
            });
            let set = new Set(orgData);
            if(set.size!==orgData.length){
                toast({
                    color:'warning',
                    title:this.state.json['10140BANKACC-000012']/* 国际化处理： 使用组织重复！*/
                })
                return;
            }
            gridmodel.rows =  Utils.convertGridEnablestate(gridmodel.rows);
            ajax({
                url:'/nccloud/uapbd/bankaccuse/batchSave.do',
                data:{
                    gridmodel:gridmodel,
                    userjson:mainCheckedRows[0].data.values.pk_bankaccbas.value
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
                                this.loadBankaccuseData(mainCheckedRows);
                            }
                        }
                    }

                }
            });
            break;
        case'modalEnable':
        case'mbtnEnable':
        case'mbtnDisable':
            if(id!=='mbtnDisable'&&enablestate){
                toast({
                    color:'warning',
                    title:this.state.json['10140BANKACC-000013']/* 国际化处理： 已经启用的数据无法启用！*/
                });
                return;
            }
            if(id==='mbtnDisable'&&!enablestate){
                toast({
                    color:'warning',
                    title:this.state.json['10140BANKACC-000014']/* 国际化处理： 已经停用的数据无法停用！*/
                });
                return;
            }
            confirmUtil.call(this,{
                title: this.state.json['10140BANKACC-000015'],/* 国际化处理： 询问？*/
                content: enablestate ? this.state.json['10140BANKACC-000016'] : this.state.json['10140BANKACC-000017'],/* 国际化处理： 确定停用？,确定启用？*/
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
                                        'title': this.state.json['10140BANKACC-000001']/* 国际化处理： 操作成功！*/
                                    });
                                    this.loadBankaccuseData(mainCheckedRows);
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