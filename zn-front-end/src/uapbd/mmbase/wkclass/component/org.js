//s2DTWjxmhLuXYBeUGolGk17fDqHzOUtPDCL5AOpopJx63x2nB1g9JZtg66EutHrx
import React, { Component, PropTypes } from 'react';
import FactoryGridRef from '../../../../uapbd/refer/org/FactoryGridRef/index';
import { BaseUtils } from '../../../../uapbd/public/utils';
/****************************************************
 * 组织选择
 *  @author zhaopeih
 *  param： {
 *            onChange   PropTypes.func
 *            value      PropTypes.string
 *            disabled   PropTypes.bool
 *          }
 ****************************************************/

class OrgSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oldOrg: null
		};
	}
	componentWillReceiveProps(newProps) {
		this.state = {
			...newProps
		};
		this.setState(this.state);
	}
	/**
     * 选择改变事件
     * @param value
     */
	onOrgChange(value) {
		if (this.config.onOrgChange && BaseUtils.isFunction(this.config.onOrgChange)) {
			if (!this.state.oldOrg || this.state.oldOrg.refpk != value.refpk) {
				this.config.onOrgChange(value);
			}
			this.setState({
				oldOrg: value
			});
		}
	}

	render() {
		this.config = this.props.config || {};
		return (
			<div>
				{FactoryGridRef({
					onChange: this.onOrgChange.bind(this),
					value: this.config.curOrg,
					isShowUnit: false,
					queryCondition: this.config.queryCondition,
					disabled: this.config.status && this.config.status == 'edit'
				})}
			</div>
		);
	}
}
export default OrgSelect;

//s2DTWjxmhLuXYBeUGolGk17fDqHzOUtPDCL5AOpopJx63x2nB1g9JZtg66EutHrx