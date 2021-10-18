/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import { card_from_id, card_page_id, card_table_id } from '../../cons/constant.js';
import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator } from '../../../../pub/utils/SFButtonUtil';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
const formId = card_from_id;
const pageId = card_page_id;

export const bodyButtonClick = function (props, key, text, record, index, tableId) {
    switch (key) {
        //'Open','CopyThisLine', 'InsertLine', 'DeleteLine', 'CopyAtLine'
        //行 展开 编辑
        case 'Open':
            Open(props, tableId, index, record, 'edit');
            break;
        //行 展开 游览    
        case 'OpenInfo':
            props.cardTable.toggleRowView(card_table_id, record);
            break;

        // //行 复制
        // case 'CopyThisLine':
        //     CopyLine(props, tableId, index);
        //     break;
        // case 'InsertLine':
        //     InsertLine(props, tableId, index);
        //     break;
        // //行 删除    
        // case 'DeleteLine':
        //     DelLine(props, tableId, index);
        //     break;

        //行 粘贴至此
        case 'PasteThis':
            let selectRows = props.cardTable.getCheckedRows(card_table_id);
            if (selectRows == null || selectRows.length == 0) {
                toast({
                    'color': 'warning',
                    'content': loadMultiLang(props,'36320AAA-000008')/* 国际化处理： 未选中要复制的行。*/
                });
                return false;
            }
            if (index != 0 && !index) {
                index = props.cardTable.getNumberOfRows(card_table_id, false);
            }
            // BatchCopy(props, card_table_id, index);//调用组件使用粘贴
            let selectCopyData = [];
            let selectRowCopy = JSON.parse(JSON.stringify(selectRows));
            for (let item of selectRowCopy) {
              item.data.selected = false;
              item.data.values.pk_allocateapply_b = {
                value: null,
                display: null
              };
              selectCopyData.push(item.data);
            }
            props.cardTable.insertRowsAfterIndex(card_table_id, selectCopyData, index);
            this.setState({ pasteflag: false }, () => { this.toggleShow() });
            break;
        //展开（浏览态）
        case 'opendown':
        //收起
        case 'closedown':
            props.cardTable.toggleRowView(card_table_id, record);
            break;
        default:
            break;
    }
}

/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/