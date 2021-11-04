//hanzhhm
//删除空白行
//以核算要素+物料作为空行过滤条件
let delBlankLine = (that, cardData, modelIndex) => {
	let rows = cardData.body[that.tableId].rows;
	if (!rows || rows.length == 0) {
		return;
	}
	if (rows.length == 1) {
		return;
	}
	let deleteIndex = [];
	for (let i = 0; i < rows.length; i++) {
		let row = rows[i];
		if (row.status == '3') {
			continue;
		}
		let celementid = row.values.celementid ? row.values.celementid.value : null; //核算要素
		let cmaterialid = row.values.cmaterialid ? row.values.cmaterialid.value : null; //物料
		if (!cmaterialid && !celementid) {
			deleteIndex.push(i);
		}
	}
	if (deleteIndex.length > 0) {
		that.props.cardTable.delRowsByIndex(that.tableId, deleteIndex);
		cardData.body[that.tableId].rows = cardData.body[that.tableId].rows.filter((row) => { return !!row });
		//删除行之后如果表体为空了关闭模态框
		if (modelIndex && deleteIndex.indexOf(modelIndex) != -1 && that.Info.isModelSave) {
			that.Info.isModelSave = false;
			that.props.cardTable.closeModel(that.tableId);
		}
	}
};


export {delBlankLine}