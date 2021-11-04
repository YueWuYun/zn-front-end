//Aaben9q/AP7BCZWePv0tSMY6oqNEIJ4njVKdB/dgFRo7J3cXDltuGEe/pgBsJWUN
import {pkname} from '../constants';
/**
 * 列表双击进入卡片
 */
export default function doubleClick(record, index, e) {
    var id = record[pkname].value;
    this.props.pushTo('/card', {
        status: 'browse',
        id: id    
    });
}

//Aaben9q/AP7BCZWePv0tSMY6oqNEIJ4njVKdB/dgFRo7J3cXDltuGEe/pgBsJWUN