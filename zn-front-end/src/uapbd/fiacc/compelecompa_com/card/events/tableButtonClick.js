//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK
import { ajax,cacheTools,cardCache,deepClone} from 'nc-lightapp-front';
import toggleShow from './toggleShow';
import {formId,pkname,tableId,bodypkname} from '../constants';
import { bodyButton,innerButton } from '../../../../public/excomponents/pubUtils/buttonName.js';
import {cardBodyControl} from '../../../../public/excomponents/pubUtils/buttonvisible.js';
import {resetBodyPk} from './stuffCom';

/**
 * 子表肩部、表体按钮处理方法
 */

let {setDefData, getDefData } = cardCache;

export default  function tableButtonClick (props,key,tableId, record, index){    
    let that = this;
    switch (key) {
        //------------子表肩部按钮start-----------------                                                                                                                                                                                                          
        //肩部添加
        case bodyButton.AddLine:
                let rowNum1 = props.cardTable.getNumberOfRows(tableId);//总选中行
                props.cardTable.addRow(tableId, rowNum1,
                        {'iallocstatus':{value:'0',display:that.state.json['10140CECA-000031']/* 国际化处理： 未分配*/}
                        });
                break;
        //肩部删除
        case bodyButton.DelLine:            
                let delRows = props.cardTable.getCheckedRows(tableId);
                if (delRows == null || delRows.length == 0) {
                        toast({color: 'warning',content: taht.state.json['10140CECA-000017']/* 国际化处理： 请至少选择一行数据进行删除*/});
                        return false;
                }
                let selectIndexs = [];
                for (let item of delRows) {
                selectIndexs.push(item.index);
                }
                props.cardTable.delRowsByIndex(that.tableId, selectIndexs);
                //删行之后控制肩部按钮
                that.onSelected();
                break;
        //肩部复制
        case bodyButton.CopyLine:
                let copyRows = props.cardTable.getCheckedRows(tableId);
                if (copyRows == null || copyRows.length == 0) {
                        toast({
                        'color': 'warning',
                        'content': that.state.json['10140CECA-000008']/* 国际化处理：  请至少选择一行数据进行复制！*/
                        });
                        return false;
                }
                let i = 0;
                let arr = [];
                copyRows.forEach((val) => {
                    if (val.data.status != '3') {
                        arr.push(copyRows[i].data);
                        i++;
                    }
            
                });
                setDefData("CopyLine", that.props.dataSource, arr);
                that.setState({
                        buttonflag:false
                    },()=>{
                        cardBodyControl(props,that.state.buttonflag);
                    })
                break;
        //肩部粘贴至末行
        case bodyButton.PasteToEndLine:
                let rowNum = that.props.cardTable.getNumberOfRows(tableId);
                let pasteData = getDefData("CopyLine", that.props.dataSource);
                props.cardTable.insertRowsAfterIndex(tableId, pasteData, rowNum - 1);
                for (let i=0; i < pasteData.length; i++) {
                        resetBodyPk(props, rowNum + i);
                }
                break;
        //肩部 取消
        case bodyButton.CancelLine:
                that.setState({
                        buttonflag:true
                },()=>{
                        cardBodyControl(props,that.state.buttonflag);
                })   
                //取消之后控制肩部按钮
                that.onSelected();
                break;
        //------------子表肩部按钮end-----------------



        
        //------------子表表体按钮start-----------------
        //浏览展开行
        case innerButton.Open_inner:
                props.cardTable.toggleRowView(tableId, record);
                break;
        //浏览收起
        case innerButton.Close_inner:
                props.cardTable.toggleRowView(tableId, record);
                break;
        //编辑展开
        case innerButton.OpenEdit_inner:
                props.cardTable.openModel(tableId, 'edit', record, index);
                break;
        //删除行
        case innerButton.Delete_inner:
                props.cardTable.delRowsByIndex(tableId, index);
                //删行之后控制肩部按钮
                that.onSelected();
                break;
        //插行
        case innerButton.Insert_inner:
                props.cardTable.addRow(tableId, index+1,
                        {'iallocstatus':{value:'0',display:that.state.json['10140CECA-000031']/* 国际化处理： 未分配*/}
                        },false);
                break;
        //复制行
        case innerButton.Copy_inner:
                let copyIndexs  = [];
                copyIndexs.push(record);
                var deepCloneData = deepClone(copyIndexs);
                deepCloneData.forEach((item) => {
                      item.values[bodypkname] = {value:null,display:null};
                });
                props.cardTable.insertRowsAfterIndex(tableId, deepCloneData, index);
                break;
        //粘贴至此
        case innerButton.Paste_inner:
                let pasteDatas = getDefData("CopyLine", that.props.dataSource);
                props.cardTable.insertRowsAfterIndex(tableId, pasteDatas, index);
                for (let i=0; i < pasteDatas.length; i++) {
                        resetBodyPk(props, index + 1 + i);
                }
                break;
        //------------子表表体按钮end-----------------
        default:
                
                break;
    }
};

//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK