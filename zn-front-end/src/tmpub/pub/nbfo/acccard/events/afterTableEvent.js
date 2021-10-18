/*yrJb1LOfoOHhNP+PrTGyMlwVz9IiLdIAQVSFAsP/e+S9VY37I34PlViIIKxjZsFV*/
export function afterTableEvent(props, moduleId, key, value, changedrows, index, record, type, method) {
	switch (key) {
		case 'default_mark':
			if (value) {
				props.cardTable.setColValue(this.tableId, key, {
					value: false,
					display: this.state.json['36010NBFO-000000']
				}); /* 国际化处理： 否*/
				props.cardTable.setValByKeyAndIndex(this.tableId, index, key, {
					value: true,
					display: this.state.json['36010NBFO-000001']
				}); /* 国际化处理： 是*/
			}
			break;
	}
}

/*yrJb1LOfoOHhNP+PrTGyMlwVz9IiLdIAQVSFAsP/e+S9VY37I34PlViIIKxjZsFV*/