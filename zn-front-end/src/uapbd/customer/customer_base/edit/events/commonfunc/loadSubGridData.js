//f39G4FqUwvyX5o1QVBRezFMjx6RaNUxAXtz/jy6sDyRJN0SaXKZ1AkJ3IVCTL9x6
import {ajax} from 'nc-lightapp-front';
export default function(){
    return (props,areaFlag, subgridId, areacode, pagecode, actionName, editBtns, brwoseBtns, pk_customer, callback)=>{
        ajax({
            url: '/nccloud/uapbd/custsubinfo/subGridAction.do',
            data: {
                pk: pk_customer,
                actionName: actionName,
                pagecode: pagecode,
                areacode: areacode,
                subGridId: subgridId,
                areaFlag: areaFlag
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    //请求成功
                    if (data) {
                        //返回data不为空
                        if (data.hasOwnProperty('message') && data.message) {
                            //提示异常信息
                            toast({'color': 'warning', 'title': data.message});
                        } else if (data.hasOwnProperty(subgridId)) {
                            props.cardTable.setTableData(subgridId, data[subgridId]);
                            props.button.setButtonVisible(brwoseBtns, true);
                            props.button.setButtonVisible(editBtns, false);

                        } else if (data.hasOwnProperty(areacode)) {
                            props.form.setAllFormValue({
                                [areacode]: data[areacode]
                            });
                            props.button.setButtonVisible(brwoseBtns, true);
                            props.button.setButtonVisible(editBtns, false);
                        }
                    } else {
                        //返回数据为空 设置按钮不显示
                        let nulldata = {
                            rows: []
                        }
                        props.cardTable.setTableData(subgridId, nulldata);
                        props.button.setButtonVisible(brwoseBtns, false);
                        props.button.setButtonVisible(editBtns, false);
                    }
                    if(areaFlag === 'shoulder'){
                        if(subgridId === 'cust_finance'){
                            props.button.setButtonDisabled(['subGrid4Del'],true);
                        }else if(subgridId === 'cust_sale'){
                            props.button.setButtonDisabled(['subGrid5Del'],true);
                        }else{
                            props.button.setButtonDisabled(['subG6Del'],true);
                        }
                    }else{
                        props.button.setButtonDisabled(['subGrid4Del','subGrid5Del','subG6Del'],false);
                    }
                    callback && callback.call(this);
                }
            }
        });

    }

}
//f39G4FqUwvyX5o1QVBRezFMjx6RaNUxAXtz/jy6sDyRJN0SaXKZ1AkJ3IVCTL9x6