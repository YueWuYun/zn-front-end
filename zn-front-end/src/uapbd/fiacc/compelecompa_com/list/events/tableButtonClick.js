//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK
import {ajax,toast } from 'nc-lightapp-front';
import {tableId,pagecodeCard,pkname} from '../constants';
import { innerButton } from '../../../../public/excomponents/pubUtils/buttonName.js';
const tableButtonClick = (that,props, key, text, record, index) => {
    let index1 = [];
    let pks = [];
    let data;
    switch (key) {
        // 修改
        case  innerButton.Edit_inner:
                props.pushTo('/card',{
                    status:'edit',
                    id: record[pkname].value
                })
                break;
        //复制
        case innerButton.Copy_inner:
            props.pushTo('/card',{
                status:'copy',
                id: record[pkname].value
            })
            break;
        //删除
        case innerButton.Delete_inner:
            let delArr = [];//删除数据集合
            delArr.push({
                pk_bill: record[pkname].value,
                ts: record.ts.value,
                index: index,
                pageId: props.getSearchParam('p'), //页面id
            });
            ajax({
                url: '/nccloud/uapbd/compelecompa/delete.do',
                data: delArr,
                success: (res) => {
                    if (res) {
                        let { success, data } = res;
                        if(success)
                        {
                            if(data)
                            {
                                if(data.singlemessage){
                                    toast({
                                        duration:  'infinity',          
                                        color: data.PopupWindowStyle,         
                                        content: data.singlemessage,   
                                    })
                                }
                                else
                                {
                                    props.table.deleteCacheId(tableId,record[pkname].value);
                                    props.table.deleteTableRowsByIndex(tableId, index);
                                    toast({ color: 'success', content: that.state.json['10140CECA-000006'] });/* 国际化处理： 删除成功*/
                                }
                            }
                        }
                    }
                }
            });
            break;
        default:
            
            break;
    }
};
export default tableButtonClick;
//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK