//50WLnzGeq39Tfv85RWLaWXbbTkztRtcimt5YwrcYflVUf38tMw+SofkYURM/amMm
import { commonSearch } from '../btnClicks';
/**
 * 主组织编辑事件
 * @param {*} event 
 */
export default function(event) {
	this.setState(
		{
			pk_org: {
				display: event.refname,
				value: event.refpk
			}
		},
		() => {
			commonSearch.call(this, this.props);
		}
	);
}

//50WLnzGeq39Tfv85RWLaWXbbTkztRtcimt5YwrcYflVUf38tMw+SofkYURM/amMm