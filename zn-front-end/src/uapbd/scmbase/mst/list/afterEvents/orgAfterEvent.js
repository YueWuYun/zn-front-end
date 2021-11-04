//50WLnzGeq39Tfv85RWLaWXbbTkztRtcimt5YwrcYflVUf38tMw+SofkYURM/amMm
import { PAGEAREA, FIELDS } from '../constance';
import { buttonController } from '../viewController';
/**
 * 主组织编辑事件
 * @param {*} event 
 */
export default function(event) {
	if (event) {
		this.setState(
			{
				pk_org: {
					display: event.refname,
					value: event.refpk
				}
			},
			doAfterEvent.bind(this)
		);
	} else {
		doAfterEvent.call(this);
	}
}
/**
 * 编辑后处理逻辑
 */
function doAfterEvent() {
	//其他字段根据主组织决定是否显示组织切换框
	let meta = this.props.meta.getMeta();
	meta[PAGEAREA.search].items.map((item) => {
		if (
			item.attrcode == FIELDS.cmeasclassid ||
			item.attrcode == FIELDS.cdeptid ||
			item.attrcode == FIELDS.centerdeptid ||
			item.attrcode == FIELDS.cvendorid ||
			item.attrcode.indexOf(FIELDS.vdef) >= 0
		) {
			if (this.state.pk_org.value) {
				item.isShowUnit = false;
			} else {
				item.isShowUnit = true;
			}
		}
	});
	this.props.meta.setMeta(meta);
	buttonController.call(this, this.props);
}

//50WLnzGeq39Tfv85RWLaWXbbTkztRtcimt5YwrcYflVUf38tMw+SofkYURM/amMm