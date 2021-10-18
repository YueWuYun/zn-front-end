/*64AO3iuMHno1LtAvd4KVP+LJUFiI0Z2u1w3Y1GUKOg347IRaOKD8jJYOSCkTm7vn*/
export function bodySelectedEvent() {
	let checkedRows = this.props.cardTable.getCheckedRows(this.tableId).length;
	let rowsNum = this.props.cardTable.getNumberOfRows(this.tableId);
	if (checkedRows > 0) {
		if (checkedRows < rowsNum) {
			if (checkedRows == 1) {
				this.props.button.setButtonDisabled([ 'Endefault_i' ], false);
			} else {
				this.props.button.setButtonDisabled([ 'Endefault_i' ], true);
			}
			this.props.button.setButtonDisabled([ 'deleterow_i' ], false);
		} else {
			if (checkedRows == 1) {
				this.props.button.setButtonDisabled([ 'Endefault_i' ], false);
			}
			this.props.button.setButtonDisabled([ 'deleterow_i' ], true);
		}
	} else {
		this.props.button.setButtonDisabled([ 'Endefault_i', 'deleterow_i' ], true);
	}
}

/*64AO3iuMHno1LtAvd4KVP+LJUFiI0Z2u1w3Y1GUKOg347IRaOKD8jJYOSCkTm7vn*/