//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
export default function (props) {
	props.createUIDom(
		{
			pagecode: '10140ACMAP_CARD',//页面id
			appcode: '10140ACMAP'
		},
		function (data) {
			if (data) {
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
				}
				if (data.template) {				
					let meta = data.template;
                    props.meta.setMeta(meta);
				}
			}
		}
	)
}


//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX