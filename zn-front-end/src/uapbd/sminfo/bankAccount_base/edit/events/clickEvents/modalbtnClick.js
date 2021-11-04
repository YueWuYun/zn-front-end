//Uc5CTH8M0YkcbG7KliEoEEjOuBI0zjoWlBt3thdKDeWoxpQex9KPm92AzN4P+VLM
import {ajax,toast} from 'nc-lightapp-front';
import Utils from '../../../../../public/utils'
import confirmUtil from '../../../../../public/pubComponent/confirmUtil/confirmUtil';
export  default function(props,id){

    //模态框按钮点击事件

    let browseBtn = ['modalEdit','modalRef','modalEnable'];
    let EditBtn = ['modalSave','modalCancel'];

    let gridmodel = {
        areacode:'bankaccuse',
        rows:[]
    };
    switch (id){
        case'modalAdd':
            props.editTable.addRow(props.config.bankaccuse);
            props.button.setButtonVisible(EditBtn,true);
            props.button.setButtonVisible(browseBtn,false);
            break;
        case'modalEdit':
            props.editTable.setStatus(props.config.bankaccuse,'edit');
            props.button.setButtonVisible(EditBtn,true);
            props.button.setButtonVisible(browseBtn,false);
            break;
        case'modalRef':
            this.loadBankaccuseData(props.cardTable.getCheckedRows(props.config.gridId));
            break;
        case'modalCancel':
            props.editTable.setStatus(props.config.bankaccuse,'browse');
            props.button.setButtonVisible(EditBtn,false);
            props.button.setButtonVisible(browseBtn,true);
            props.editTable.cancelEdit(props.config.bankaccuse);
            break;
        case'modalDelete':
            let checkedRows = props.editTable.getCheckedRows(props.config.bankaccuse);
            if(checkedRows.length===0){
                toast({
                    'color':'warning',
                    'title':this.state.json['10140BANKACC-000006']/* 国际化处理： 请选择数据操作！*/
                });
                return;
            }

            if(props.editTable.getStatus(props.config.bankaccuse) ==='edit'){

                let tableindex = [];
                checkedRows.map((obj)=>{
                    tableindex.push(obj.index);
                });
                props.table.deleteTableRowsByIndex(props.config.bankaccuse,tableindex);
            }else{
                checkedRows.map((obj)=>{
                    gridmodel.rows.push(obj.data)
                })
                gridmodel.rows =  Utils.convertGridEnablestate(gridmodel.rows);
                confirmUtil.call(this,{
                    title:this.state.json['10140BANKACC-000015'],/* 国际化处理： 询问？*/
                    content:this.state.json['10140BANKACC-000011'],/* 国际化处理： 确认删除所选数据？*/
                    beSureBtnClick:()=>{

                        ajax({
                            url:'/nccloud/uapbd/bankaccuse/subBatchDelete.do',
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
                                    this.loadBankaccuseData(props.cardTable.getCheckedRows(props.config.gridId));
                                }
                            }
                        });

                    }
                })
            }
            break;
        case'modalSave':

            let tabledata = props.editTable.getChangedRows(props.config.bankaccuse);

            if(tabledata.length === 0){
                return;
            }
            tabledata.map((obj)=>{
                gridmodel.rows.push(obj)
            })
            gridmodel.rows =  Utils.convertGridEnablestate(gridmodel.rows);
            ajax({
                url:'/nccloud/uapbd/bankaccuse/subBatchSave.do',
                data:{
                    gridmodel:gridmodel,
                    userjson:props.cardTable.getCheckedRows(props.config.gridId)[0].data.values.pk_bankaccsub.value
                },
                success:(res)=>{
                    let{success,data} =res;
                    if(success){
                        if(data){
                            if(data.hasOwnProperty('message')&&data.message){

                            }else{
                                this.props.editTable.setStatus(this.props.config.bankaccuse,'browse');
                                this.props.button.setButtonVisible(browseBtn,true);
                                this.props.button.setButtonVisible(EditBtn,false);
                                toast({'color':'success','title':this.state.json['10140BANKACC-000001']});/* 国际化处理： 操作成功！*/
                                this.loadBankaccuseData(props.cardTable.getCheckedRows(props.config.gridId));
                            }
                        }
                    }

                }


            });


            break;
        case'modalEnable':
            break;
        case'mbtnEnable':
            break;
        case'mbtnDisable':
            break;

    }

}

//Uc5CTH8M0YkcbG7KliEoEEjOuBI0zjoWlBt3thdKDeWoxpQex9KPm92AzN4P+VLM