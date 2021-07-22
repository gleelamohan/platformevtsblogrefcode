import { LightningElement, api, wire, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import SOCKET_IO_JS from '@salesforce/resourceUrl/socketiojs';
import USER_ID from '@salesforce/user/Id';
import getCaseList from '@salesforce/apex/CDCcontroller.getCases';
import SOCKETURL from '@salesforce/label/c.websocket_server_url';

export default class SubscribetoWebSocket extends LightningElement {
	@api recordId;
	rId;
	_socketIoInitialized = false;
	_socket;
	msg;
	caseno;
	caseid;
	@track casedetails;
	@track mapData = [];

	WEBSOCKET_SERVER_URL = SOCKETURL;

	get getcaselink() {
		return '/consumer/s/case/' + this.caseid;
	}
	renderedCallback() {
		if (this._socketIoInitialized) {
			return;
		}
		this._socketIoInitialized = true;

		Promise.all([loadScript(this, SOCKET_IO_JS)])
			.then(() => {
				this.initSocketIo();
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.error('loadScript error', error);
				this.error = 'Error loading socket.io';
			});
	}

	initSocketIo() {
		// eslint-disable-next-line no-undef
		this._socket = io.connect(this.WEBSOCKET_SERVER_URL);

		console.log(this._socket);

		this._socket.on('connect', () => {
			console.log('check 2', this._socket.connected);
		});

		this._socket.on('message', (data) => {
			var results = JSON.parse(data);
			console.log(results);
			this.rId = results.payload.ChangeEventHeader.recordIds[0];
			console.log(this.rId);
			this.msg = results.payload.ChangeEventHeader.changedFields.join(',');
			this.getCaseInfo();
		});
	}

	getCaseInfo() {
		console.log('inside case');
		getCaseList({
			colNames: this.msg,
			cId: this.rId,
		}).then((result) => {
			this.casedetails = result;
			this.caseno = result[0].CaseNumber;
			this.caseid = result[0].Id;
		});
	}
}
