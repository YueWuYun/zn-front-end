import React from 'react';
import ReactDOM from 'react-dom';
import {ajax,base,toast,gzip,Cipher,print,getMultiLang} from "nc-lightapp-front";
const { NCModal, NCRadio, NCButton, NCIcon } = base;

require('./index.less');

export default class PrintTemplate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: true,
			appcode: this.props.appcode || '',
			nodekey: this.props.nodekey || '',
			type: this.props.type || '',
			url: this.props.url || '',
			data: this.props.data || '',
			printTemplateMenu: this.props.printTemplateMenu || [],
			printTemplateID: '',
			json: {}
		};
	}

	componentWillMount() {
		let {json} = this.props
		if (json) {
            this.setState({
                printTemplateID: this.props.printTemplateMenu.length ? this.props.printTemplateMenu[0].m_ctemplateid : '',
				json
            });
		} else {
            let callback = (json, bool, inlt) => {
                this.setState({
                    printTemplateID: this.props.printTemplateMenu.length ? this.props.printTemplateMenu[0].m_ctemplateid : '',
                    json
                });
			}
            getPlatformLang({moduleId: 'api-print', callback})
		}
	}

	close = () => {
		this.setState({ show: false });
		this.closeTimer = setTimeout(() => {
			let element = document.getElementsByClassName('print-modal-liuyjv-wrapper')[0];
			if (element) {
				ReactDOM.unmountComponentAtNode(element);
				clearTimeout(this.closeTimer);
				document.getElementById('app').removeChild(element);
				this.closeTimer = null;
			}
		}, 200);
	};
	submit = () => {
        if (!this.state.printTemplateID) {
            return toast({color: 'warning', content: this.state.json['api-print-0004']||'模板ID参数为空'})
        }
		let data = Object.assign({}, this.state.data, { printTemplateID: this.state.printTemplateID });
		this.props.callback(this.state.type, this.state.url, data);
		this.close();
	};
	handleChange = (value) => {
		this.setState({
			printTemplateID: value
		});
	};

	render() {
		let {json} = this.state
		return (
			<NCModal show={this.state.show} className={'print-template-modal-wrapper'}>
				<NCModal.Header>
					<NCModal.Title className={'u-modal-title'}>{this.props.modalTitle || json['api-print-0005']||'打印模板选择'}</NCModal.Title>
					<span className={'modal-header-close-btn'} onClick={this.close}>
						×
					</span>
				</NCModal.Header>

				<NCModal.Body>
					<div className="modal-body-wrapper">
						<NCRadio.NCRadioGroup
							name="fruit"
							selectedValue={this.state.printTemplateID}
							onChange={this.handleChange.bind(this)}
						>
							{this.state.printTemplateMenu.map((item, index) => {
								return (
									<NCRadio className="nc-radio-wrapper" value={item && item.m_ctemplateid}>
										{item && item.m_vtemplatename}
									</NCRadio>
								);
							})}
						</NCRadio.NCRadioGroup>
					</div>
				</NCModal.Body>

				<NCModal.Footer>
					<NCButton onClick={this.submit} colors="primary">
						{json['api-print-0006'|| '确定']}
					</NCButton>
					<NCButton onClick={this.close} colors="info">
                        {json['api-print-0007'|| '取消']}
					</NCButton>
				</NCModal.Footer>
			</NCModal>
		);
	}
}
