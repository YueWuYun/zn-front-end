/*QnhrPLhk/aKSjW4JIElf6bqBhpMv/t7OBxLcnq22FTuxr7Ow2TDzbenNb3ShmVGC*/
/**
 * 审批组件事件处理
 * @author：gaokung
 */
import { toast, cardCache } from 'nc-lightapp-front';
import { CARD, URI, LIST,DATASOURCE } from './../../cons/constant';
import { doAjax } from '../../utils/commonUtil'
let {  updateCache} = cardCache;
export function compositeTurnOff() {
	this.setState({
		compositedata: null,
		compositedisplay: false
	});
}
export function getAssginUserCard(userObj) {
	let pk = this.props.form.getFormItemsValue(CARD.formHeadCode, 'pk_endore');
	let ts = this.props.form.getFormItemsValue(CARD.formHeadCode, 'ts');
	let sendData = {
		pageid: CARD.pageCode,
		pks: [ pk && pk.value ],
		tss: [ ts && ts.value ],
		isCardOpt: true,
		userObj: userObj
	};

	let success = function(res) {
		let that = this;
		if (res.data && res.data.errMsg) {
			toast({ color: 'danger', content: res.data.errMsg });
		} else {
			if (
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow') &&
				!userObj
			) {
				that.setState({
					compositedata: res.data,
					compositedisplay: true
				});
			} else {
				that.setState({
					compositedata: res.data,
					compositedisplay: false
				});
				if (res.data.card.head) {
					that.props.form.setAllFormValue({ [CARD.formHeadCode]: res.data.card.head[CARD.formHeadCode] });
					updateCache('pk_endore', pk && pk.value, res.data.card, CARD.formHeadCode, DATASOURCE);
					toast({
						color: 'success',
						content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000002')/* 国际化处理： 提交成功！*/
					});
				}
			}
		}

		this.setUIDisplay();
	};

	doAjax.call(this, sendData, URI.endoreCardCommit, success);
}

/*QnhrPLhk/aKSjW4JIElf6bqBhpMv/t7OBxLcnq22FTuxr7Ow2TDzbenNb3ShmVGC*/