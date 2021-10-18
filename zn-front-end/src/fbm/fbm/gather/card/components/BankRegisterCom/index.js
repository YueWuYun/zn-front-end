/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/**
 * 签收查询组件
 * @author：gaokung
 */
import React from 'react';
import { base } from 'nc-lightapp-front';
import buttonClick from '../events/buttonClick';
const { NCModal } = base;
/**
 *
 * @param {*} context 全局上下文信息 this
 * @param {*} show 是否显示
 * @param {*} title 标题名称
 * @param {*} signCode 模版编码
 */
const BankRegisterCom = (props) => {
	let { context, show, title, signCode, callBack } = props;
	let { createForm } = context.props.form;
	let { createButtonApp } = context.props.button;
	if (context.props.form.getFormStatus(signCode) !== 'edit') context.props.form.setFormStatus(signCode, 'edit');
	return (
		<NCModal fieldid={'generateBankRegister'} show={show} backdrop={"static"} size="sm">
			<NCModal.Header>
				<NCModal.Title>{title}</NCModal.Title>
			</NCModal.Header>
			<NCModal.Body>{createForm(signCode, {})}</NCModal.Body>
			<NCModal.Footer>
				{createButtonApp({
					area: signCode,
					onButtonClick: (props, key) => {
						buttonClick.call(context, key, callBack);
					}
				})}
			</NCModal.Footer>
		</NCModal>
	);
};

export default BankRegisterCom;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/