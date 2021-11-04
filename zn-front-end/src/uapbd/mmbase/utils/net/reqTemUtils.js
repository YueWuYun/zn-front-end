//h7Q0SFESaX+e1xZZ2X+eg+Nbx4wOYUpvKhOqC0UBwdOh496nyHZ/vJmi07VAruu9
import { base, ajax } from 'nc-lightapp-front';
function createGeneralUIDom(appcode, pagecode, callback) {
	//发送模板请求

	let reqData = [
		{
			rqUrl: '/platform/templet/querypage.do',
			rqJson: `{\n  \"pagecode\": \"${pagecode}\",\n  \"appcode\": \"${appcode}\"\n}`,
			rqCode: 'template'
		},
		{
			rqUrl: '/platform/appregister/queryallbtns.do',
			rqJson: `{\n  \"pagecode\": \"${pagecode}\",\n  \"appcode\": \"${appcode}\"\n}`,
			rqCode: 'button'
		},
		{
			rqUrl: '/platform/appregister/queryappcontext.do',
			rqJson: `{\n  \"appcode\": \"${appcode}\"}`,
			rqCode: 'context'
		}
	];
	
	ajax({
		url: '/nccloud/platform/pub/mergerequest.do',
		data: reqData,
		success: (res) => {
			if (res && res.data) {
				let meta = res.data;
				if (res.data.context) {
					this.app_context = res.data.context;
				}
				if (callback && typeof callback == 'function') {
					callback(meta);
				}
			}
		}
	});
	
}
export default { createGeneralUIDom };

//h7Q0SFESaX+e1xZZ2X+eg+Nbx4wOYUpvKhOqC0UBwdOh496nyHZ/vJmi07VAruu9