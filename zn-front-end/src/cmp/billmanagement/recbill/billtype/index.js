/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base } from 'nc-lightapp-front';
const pagecode = '360766001_L03';
let appcode = '36076001';
let formid = 'extendAttribute';
//获取并初始化模板
let initTemplate = (props) => {

	props.createUIDom(
		{
			pagecode: pagecode,//页面id
			appcode: appcode//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(props, meta)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	)
}

//对表格模板进行加工操作
function modifierMeta(props, meta) {
	meta[formid].showindex = true;  //表格显示序号
	return meta;
}

class BlankAttribute extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	/********componentDidMount是固定的********** */
	componentDidMount() {

		if (document.getElementById('extInfo').onclick != null) {
			document.getElementById('extInfo').onclick(this.showData);
		}
		if (document.getElementById('extInfo').method != null) {
			document.getElementById('extInfo').method(this.props.form.getAllFormValue);
		}
	}


	/********setExtendPaneStat是固定********** */
	setExtendPaneStat() {
		let extendStat = document.getElementById('extInfo').getAttribute('extendStat');
		return extendStat;

	}


	//请求数据
	showData = (pk_billtypeid) => {
		debugger
		let stat = this.setExtendPaneStat();
		if (pk_billtypeid instanceof Event) {
			pk_billtypeid = ""
		}

		let data = {
			pk_billtypeid: pk_billtypeid,

		};


		if (stat === 'add') {

			this.props.form.setFormStatus(formid, 'edit');

		} else if (stat === 'edit') {

			this.props.form.setFormStatus(formid, stat);


		} else if (stat === 'cancel') {
			this.props.form.EmptyAllFormValue(formid);

		} else if (stat === 'browse') {
			// debugger
			if (pk_billtypeid != "") {
				ajax({
					url: '/nccloud/cmp/billtype/browse.do',
					data: data,
					success: (res) => {
						//console.log('res.data', res.data);
						this.props.form.setAllFormValue({ [formid]: res.data['djlxvo'] });
						this.props.form.cancel(formid)
					}
				});
			} else {
				this.props.form.setFormStatus(formid, stat);
				this.props.form.EmptyAllFormValue(formid);
			}


		}


	}

	render() {
		let { form } = this.props;
		const { createForm } = form;

		return (

			<div className='form-wrapper"'>
				{createForm(formid, {//表单区
					// onAfterEvent: afterEvent
				})}
			</div>


		);
	}
}

BlankAttribute = createPage({
	initTemplate: initTemplate
})(BlankAttribute);

export default BlankAttribute;
ReactDOM.render(<BlankAttribute />, document.querySelector('#transtypebusi'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/