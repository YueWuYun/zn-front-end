/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, getMultiLang } from 'nc-lightapp-front';
import './index.less';
const { NCModal } = base;
import buildMeta from './meta';

/**
 * 内部账户余额弹框
 */
class Dialog extends Component {
	constructor(props) {
		super(props);
		this.tableCode = 'inneraccbalance';
		this.init(props);
		this.state = {
			json: {},
		};
	}

	componentWillReceiveProps(nextProps) {
		this.init(nextProps);
		this.queryAccBalance(this.props.accpk);
	}


	componentWillMount() {
		getMultiLang({
			moduleId: "3601Inner",
			domainName: "tmpub",
			callback: (json, status, inlt) => {
				if (status) {
					this.setState({ json }, () => {
						this.initTemplate();
					});
				}
			}
		});
	}

	render() {
		let { table } = this.props;
		let { createSimpleTable } = table;
		return (
			<NCModal
				fieldid="inneraccbalance"
				className="InnerAccoutModal_class"
				show={this.show}
				onHide={this.close}
				style={{ width: '700px' }}
			>
				<NCModal.Header closeButton={true}>
					<NCModal.Title>{this.state.json["3601Inner-000005"]}</NCModal.Title>
				</NCModal.Header>

				<NCModal.Body className="body-resize-icon">
					{createSimpleTable && <div>
						{createSimpleTable(this.tableCode, {
							height: '158px',
							showIndex: true,
							//隐藏保存列宽功能
							cancelCustomRightMenu: true
						})}
					</div>}
				</NCModal.Body>
			</NCModal>
		);
	}


	componentDidMount() {
		this.queryAccBalance();
	}

	init(props) {
		//内部账户主键
		this.pk_accid = props.accpk;
		//是否显示
		this.show = props.showModal;
		//关闭弹框逻辑
		this.close = props.closeModal;
	}

	queryAccBalance() {
		ajax({
			url: '/nccloud/tmpub/pub/inneraccbalance.do',
			async: true,
			data: { 'accid': this.pk_accid },
			success: (res) => {
				let { data } = res;
				let tabledata = {
					areacode: this.tableCode,
					rows: [{
						status: 0,
						rowid: null,
						values: {
							name: { display: data.accName, value: data.accName, scale: -1 },
							bookbalance: { display: null, value: data.bookBalance, scale: 3 },
							realbalance: { display: null, value: data.realBalance, scale: 3 },
							realbalancewithoutover: { display: null, value: data.realBalanceNoOverFraft, scale: 3 }
						}
					}]
				}
				this.props.table.setAllTableData(this.tableCode, tabledata);
			},
			error: (data) => {
				this.props.table.setAllTableData(this.tableCode, { rows: [] });
			}
		});
	}

	initTemplate() {
		let data = buildMeta.call(this);
		if (data.template) {
			let meta = data.template;
			meta = this.modifierMeta.call(this, meta)
			this.props.meta.setMeta(meta);
		}
	}

	modifierMeta(meta) {
		return meta;
	}
}

export const InnerAccoutDialog = createPage({})(Dialog);
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/