/*MzusRl3/IZPXomwJN+7DKiSL07645pDvlCZGIhdhmJgQ8faqVkPutKKNpShGsXkC*/
import { list } from '../../cons/constant';

//查询区编辑后事件
export function onSearchAfterEvent(field, val) {
	let { setSearchValByField, setDisabledByField } = this.props.search;
	if (field === 'settleway') {
		// 目前结息周期字段被隐藏了，该代码不起作用，先保留，防需求变更
		switch (val) {
			//按年
			case '12':
				setSearchValByField(list.searchCode, 'settlecycle', { value: 1, display: '' });
				setDisabledByField(list.searchCode, 'settlecycle', true);
				break;
			//按半年
			case '6':
				setSearchValByField(list.searchCode, 'settlecycle', { value: 6, display: '' });
				setDisabledByField(list.searchCode, 'settlecycle', true);
				break;
			//按季
			case '4':
				setSearchValByField(list.searchCode, 'settlecycle', { value: 1, display: '' });
				setDisabledByField(list.searchCode, 'settlecycle', true);
				break;
			//按月
			case '1':
				setSearchValByField(list.searchCode, 'settlecycle', { value: 1, display: '' });
				setDisabledByField(list.searchCode, 'settlecycle', false);
				break;
			//自定义
			case '0':
				setSearchValByField(list.searchCode, 'settlecycle', { value: '', display: '' });
				setDisabledByField(list.searchCode, 'settlecycle', false);
				break;
			default:
				setSearchValByField(list.searchCode, 'settlecycle', { value: '', display: '' });
				setDisabledByField(list.searchCode, 'settlecycle', true);
				break;
		}
	}
}

/*MzusRl3/IZPXomwJN+7DKiSL07645pDvlCZGIhdhmJgQ8faqVkPutKKNpShGsXkC*/