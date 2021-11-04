//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1
import { ajax,cardCache } from 'nc-lightapp-front';
import {loadPageValue} from './stuffCom';
import {pkname,formId,pagecode,tableId} from '../constants';
import toggleShow from './toggleShow';
/**
 * 卡片分页按钮查询方法
 */
let { getCacheById, updateCache } = cardCache;
export default function(props, pks,that) {
	if(!that)
	{
		that = this;
	}
	
	let pkArr = [];
	
	if (!pks) {
		props.form.EmptyAllFormValue(formId);
		props.cardTable.setTableData(tableId, { rows: [] });
		that.props.setUrlParam({id: null });
		return;
	}
	let cardData = getCacheById(pks,  that.props.dataSource);

    if(cardData){
		props.setUrlParam({id:pks});
		loadPageValue(cardData,props);
		toggleShow(that,props);
	}
	else
	{
		pkArr.push(pks);
		let data = {
			allpks: pkArr,
			pagecode: pagecode
		};
		ajax({
			url: '/nccloud/uapbd/compelecompa/querycardpage.do',
			data: data,
			success: (res) => {
				if (res.data) {
					props.setUrlParam({id:pks});
					loadPageValue(res.data,props);
					toggleShow(that,props);
					updateCache(pkname,pks,res.data,formId,that.props.dataSource);
				}
			}
		});
	}
}

//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1