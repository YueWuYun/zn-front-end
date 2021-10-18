/*rqgAB70FiVv8RWSJRd7YxlcpN/BzQlBuH5XjZlWkGFgOnhqjNOneT1hIuGMH+5IK*/
/**
 * zhanghe
 * 按钮可用性控制  
 */
import { REF21_CONST } from '../const';
import { getDefData } from '../../util/cacheDataManager';
export default function(props) {
	let queryInfo = getDefData(REF21_CONST.Ref21DataSource, REF21_CONST.searchId);
	if (queryInfo == null) {
		this.props.button.setButtonDisabled([ 'Refresh' ], true);
	} else {
		this.props.button.setButtonDisabled([ 'Refresh' ], false);
	} 
}

/*rqgAB70FiVv8RWSJRd7YxlcpN/BzQlBuH5XjZlWkGFgOnhqjNOneT1hIuGMH+5IK*/