//Aaben9q/AP7BCZWePv0tSMY6oqNEIJ4njVKdB/dgFRo7J3cXDltuGEe/pgBsJWUN

export default function doubleClick(record, index, e) {
    let id = record.pk_controlarea.value;
    this.props.pushTo('/card', {
        status: 'browse',
        id: id
     })
    
}

//Aaben9q/AP7BCZWePv0tSMY6oqNEIJ4njVKdB/dgFRo7J3cXDltuGEe/pgBsJWUN