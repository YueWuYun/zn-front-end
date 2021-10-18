/*64AO3iuMHno1LtAvd4KVP0aHjsB1mtCtMnW9TNyN7HmE59uG2qP0Y0WIj2WvuQYd*/
export function bodySelectedEvent() {
	let checkedRows = this.props.cardTable.getCheckedRows(this.tableId);
	if (checkedRows.length > 0) {
		if (checkedRows.length == 1) {
			this.props.button.setButtonDisabled([ 'deleteRow', 'copyRow' ], false);
		} else {
			this.props.button.setButtonDisabled([ 'deleteRow' ], false);
		}
	} else {
		this.props.button.setButtonDisabled([ 'deleteRow', 'copyRow' ], true);
	}
}

/*64AO3iuMHno1LtAvd4KVP0aHjsB1mtCtMnW9TNyN7HmE59uG2qP0Y0WIj2WvuQYd*/