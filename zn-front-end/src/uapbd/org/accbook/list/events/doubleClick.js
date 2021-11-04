//Aaben9q/AP7BCZWePv0tSMY6oqNEIJ4njVKdB/dgFRo7J3cXDltuGEe/pgBsJWUN
import { ajax, toast } from 'nc-lightapp-front';

export default function doubleClick(record, index, e) {

    if(record.bookproperties.value==1){
        this.props.pushTo('/acccard', {
            status: 'browse',
            pagecode: '101001CB_accbookcard',
            id: record.pk_accountingbook.value,
        });
    }else if(record.bookproperties.value==2){
        this.props.pushTo('/liacard', {
            status: 'browse',
            pagecode: '101001CB_libbookcard',
            id: record.pk_accountingbook.value,
        });
    }
  
}

//Aaben9q/AP7BCZWePv0tSMY6oqNEIJ4njVKdB/dgFRo7J3cXDltuGEe/pgBsJWUN