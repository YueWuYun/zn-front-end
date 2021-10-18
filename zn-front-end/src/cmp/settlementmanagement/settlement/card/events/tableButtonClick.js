/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
let table_id = Templatedata.card_tableid;
export default function tableButtonClick(props, key, text, record, index) {
    console.log(key);

    switch (key) {
        //展开
        case 'openbrowse':
        case 'closebrowse':
            props.cardTable.toggleRowView(table_id, record);
            // this.setState({ openflag: false });
            break;
        //复制行
        case 'copylineBtn':
            props.cardTable.pasteRow(table_id, index);
            break;
        //增行
        case 'addlineBtn':
            props.cardTable.pasteRow(table_id, index);
            break;
        //删行
        case 'deletelineBtn':
            props.cardTable.delRowsByIndex(table_id, index);
            break;
        //编辑展开
        case 'editmoreBtn':
            props.cardTable.openModel(table_id, 'edit', record, index);
            break;

    }
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/