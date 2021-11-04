//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK
import { ajax, base, toast ,cardCache,deepClone} from 'nc-lightapp-front';
import { dataSource } from '../constants';
import {cardBodyControl} from '../../common/buttonVisible';
let { getDefData, setDefData } = cardCache;
export default function (props, key, text, record, index) {
    switch (key) {
        //表格肩部操作
        case 'AddLine'://增行
            this.props.cardTable.addRow(this.tableId);
            break;
        case 'DelLine'://删行      
            let selectRows = props.cardTable.getCheckedRows(this.tableId);
            if (selectRows == null || selectRows.length == 0) {
                toast({color: 'warning',content: this.state.json['38200CA-0000017']/* 国际化处理： 请至少选择一行数据进行删除*/});
                return false;
            }
            let selectIndexs = [];
            for (let item of selectRows) {
                selectIndexs.push(item.index);
            }
            props.cardTable.delRowsByIndex(this.tableId, selectIndexs);
            //删行之后控制肩部按钮
            this.onSelected();
            break;
        case 'CopyLine'://复制行
            let copyData = this.props.cardTable.getCheckedRows(this.tableId);
            if (copyData.length == 0) {
                toast({ color: 'warning', content:this.state.json['38200CA-0000016'] });/* 国际化处理： 请至少选择一行数据进行复制！*/
                return false;
            }
            let arr = [];
            copyData.forEach((val) => {
                if (val.data.status != '3') {
                    arr.push(val.data);
                }
            });
            //深拷贝一份数据，并且去掉主键放入缓存
            let defDate = deepClone(arr);
            defDate.forEach((item) => {//清空主键信息
                item.values.cstuff_bid = {value:null,display:null};
            })
            setDefData("CopyLine", dataSource, defDate);
            this.setState({
                buttonfalg:false
            },()=>{
                cardBodyControl(props,this.state.buttonfalg);
            })
            
            break;
        case 'PasteToEndLine'://粘贴至末行
            //获取当前所有行，插入到最后一行的位置
            let rowNum = this.props.cardTable.getNumberOfRows(this.tableId);
	        let pasteData = getDefData("CopyLine", dataSource);
            this.props.cardTable.insertRowsAfterIndex(this.tableId, pasteData, rowNum - 1);
            break;
        case 'CancelLine'://取消
            this.setState({
                buttonfalg:true
            },()=>{
                cardBodyControl(props,this.state.buttonfalg);
            })   
            //取消之后控制肩部按钮
            this.onSelected();
            break;





        // 表格行修改
        case 'Open_inner'://展开
            props.cardTable.toggleRowView(this.tableId, record);
            break;
        case 'Close_inner'://收回
            props.cardTable.toggleRowView(this.tableId, record);
            break;
        case 'OpenEdit_inner':
            props.cardTable.openModel(this.tableId, 'edit', record, index);
            break;
        case 'Copy_inner'://复制行
            let copyIndexs  = [];
            copyIndexs.push(record);
            this.props.cardTable.insertRowsAfterIndex(this.tableId, deepClone(copyIndexs), index);
            break;
        case 'Insert_inner'://插入行
            this.props.cardTable.addRow(this.tableId, index + 1);
            break;
        case 'Delete_inner'://删行
            this.props.cardTable.delRowsByIndex(this.tableId, index);
            //删行之后控制肩部按钮
            this.onSelected();
            break;
        case 'Paste_inner'://粘贴至此
            this.props.cardTable.insertRowsAfterIndex(this.tableId, getDefData("CopyLine", dataSource), index);
            break;
        default:
            break;
    }
};


//清空表体主键pk
let resetBodyPk = function (e, index) {
    e.props.cardTable.setValByKeyAndIndex(e.tableId, index, 'cstuff_bid', { value: null });
}

//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK