import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestOptions,
	NodeOperationError,
} from 'n8n-workflow';

export class Csku implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CSKU',
		name: 'csku',
		icon: 'file:csku.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with CSKU API',
		defaults: {
			name: 'CSKU',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'cskuApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.csku.ai',
			headers: {
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Note',
						value: 'note',
					},
					{
						name: 'Conversation',
						value: 'conversation',
					},
				],
				default: 'message',
			},
			// Message Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['message'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a message',
						action: 'Send a message',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all messages in a conversation',
						action: 'Get all messages',
					},
				],
				default: 'send',
			},
			// Note Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['note'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a note',
						action: 'Create a note',
					},
				],
				default: 'create',
			},
			// Conversation Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['conversation'],
					},
				},
				options: [
					{
						name: 'Mark Need Human',
						value: 'markNeedHuman',
						description: 'Mark conversation as needing human',
						action: 'Mark conversation as needing human',
					},
					{
						name: 'Get Need Human Total',
						value: 'getNeedHumanTotal',
						description: 'Get total conversations needing human',
						action: 'Get total conversations needing human',
					},
				],
				default: 'markNeedHuman',
			},

			// ===== Message: Send Fields =====
			{
				displayName: 'Conversation ID',
				name: 'conversationId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				default: '',
				description: 'The conversation ID',
			},
			{
				displayName: 'Message Type',
				name: 'messageType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				options: [
					{
						name: 'Text',
						value: 'text',
					},
					{
						name: 'Media',
						value: 'media',
					},
				],
				default: 'text',
				description: 'Type of message to send',
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
						messageType: ['text'],
					},
				},
				default: '',
				description: 'The text message to send',
			},
			{
				displayName: 'Media URL',
				name: 'mediaUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
						messageType: ['media'],
					},
				},
				default: '',
				description: 'URL of the media file',
			},
			{
				displayName: 'Media Type',
				name: 'mediaType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
						messageType: ['media'],
					},
				},
				options: [
					{
						name: 'Image',
						value: 'image',
					},
					{
						name: 'Video',
						value: 'video',
					},
					{
						name: 'Audio',
						value: 'audio',
					},
					{
						name: 'Document',
						value: 'document',
					},
				],
				default: 'image',
				description: 'Type of media',
			},
			{
				displayName: 'MIME Type',
				name: 'mimeType',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
						messageType: ['media'],
					},
				},
				default: 'image/jpeg',
				description: 'MIME type of the media file',
			},
			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
						messageType: ['media'],
					},
				},
				default: '',
				description: 'Caption for the media',
			},

			// ===== Message: Get All Fields =====
			{
				displayName: 'Conversation ID',
				name: 'conversationId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'The conversation ID',
			},

			// ===== Note: Create Fields =====
			{
				displayName: 'Conversation ID',
				name: 'conversationId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['note'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The conversation ID',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['note'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The note content',
			},

			// ===== Conversation: Mark Need Human Fields =====
			{
				displayName: 'Conversation ID',
				name: 'conversationId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['conversation'],
						operation: ['markNeedHuman'],
					},
				},
				default: '',
				description: 'The conversation ID',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'message') {
					if (operation === 'send') {
						const conversationId = this.getNodeParameter('conversationId', i) as string;
						const messageType = this.getNodeParameter('messageType', i) as string;

						const body: IDataObject = {
							conversation_id: conversationId,
						};

						if (messageType === 'text') {
							const text = this.getNodeParameter('text', i) as string;
							body.text = text;
						} else if (messageType === 'media') {
							const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
							const mediaType = this.getNodeParameter('mediaType', i) as string;
							const mimeType = this.getNodeParameter('mimeType', i) as string;
							const caption = this.getNodeParameter('caption', i, '') as string;

							body.media = {
								url: mediaUrl,
								type: mediaType,
								mime_type: mimeType,
								caption: caption,
							};
						}

						const credentials = await this.getCredentials('cskuApi');
						const options: IHttpRequestOptions = {
							method: 'POST',
							url: '/v1/message',
							body,
							json: true,
							headers: {},
						};

						// Set headers based on authentication type
						if (credentials.authenticationType === 'businessSecret') {
							options.headers!['Business'] = credentials.businessId as string;
							options.headers!['Secret'] = credentials.secret as string;
						} else if (credentials.authenticationType === 'bearerToken') {
							options.headers!['Authorization'] = `Bearer ${credentials.bearerToken}`;
						}

						const responseData = await this.helpers.request(options);

						returnData.push({
							json: responseData as IDataObject,
							pairedItem: { item: i },
						});
					} else if (operation === 'getAll') {
						const conversationId = this.getNodeParameter('conversationId', i) as string;

						const credentials = await this.getCredentials('cskuApi');
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `/v1/message/${conversationId}`,
							json: true,
							headers: {},
						};

						// GET messages requires merchant_id and secret_key headers
						if (credentials.authenticationType === 'merchantSecret') {
							options.headers!['merchant_id'] = credentials.merchantId as string;
							options.headers!['secret_key'] = credentials.secretKey as string;
						} else {
							throw new NodeOperationError(
								this.getNode(),
								'Get All Messages requires Merchant ID & Secret Key authentication',
								i,
							);
						}

						const responseData = await this.helpers.request(options);

						returnData.push({
							json: responseData as IDataObject,
							pairedItem: { item: i },
						});
					}
				} else if (resource === 'note') {
					if (operation === 'create') {
						const conversationId = this.getNodeParameter('conversationId', i) as string;
						const note = this.getNodeParameter('note', i) as string;

						const body: IDataObject = {
							conversation_id: conversationId,
							note: note,
						};

						const credentials = await this.getCredentials('cskuApi');
						const options: IHttpRequestOptions = {
							method: 'POST',
							url: '/v1/note',
							body,
							json: true,
							headers: {},
						};

						// Set headers based on authentication type
						if (credentials.authenticationType === 'businessSecret') {
							options.headers!['Business'] = credentials.businessId as string;
							options.headers!['Secret'] = credentials.secret as string;
						} else if (credentials.authenticationType === 'bearerToken') {
							options.headers!['Authorization'] = `Bearer ${credentials.bearerToken}`;
						}

						const responseData = await this.helpers.request(options);

						returnData.push({
							json: responseData as IDataObject,
							pairedItem: { item: i },
						});
					}
				} else if (resource === 'conversation') {
					if (operation === 'markNeedHuman') {
						const conversationId = this.getNodeParameter('conversationId', i) as string;

						const body: IDataObject = {
							conversation_id: conversationId,
						};

						const credentials = await this.getCredentials('cskuApi');
						const options: IHttpRequestOptions = {
							method: 'POST',
							url: '/v1/conversation/need-human',
							body,
							json: true,
							headers: {},
						};

						// Set headers based on authentication type
						if (credentials.authenticationType === 'businessSecret') {
							options.headers!['Business'] = credentials.businessId as string;
							options.headers!['Secret'] = credentials.secret as string;
						} else if (credentials.authenticationType === 'bearerToken') {
							options.headers!['Authorization'] = `Bearer ${credentials.bearerToken}`;
						}

						const responseData = await this.helpers.request(options);

						returnData.push({
							json: responseData as IDataObject,
							pairedItem: { item: i },
						});
					} else if (operation === 'getNeedHumanTotal') {
						const credentials = await this.getCredentials('cskuApi');
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: '/v1/conversation/need-human/total',
							json: true,
							headers: {},
						};

						// Set headers based on authentication type
						if (credentials.authenticationType === 'businessSecret') {
							options.headers!['Business'] = credentials.businessId as string;
							options.headers!['Secret'] = credentials.secret as string;
						} else if (credentials.authenticationType === 'bearerToken') {
							options.headers!['Authorization'] = `Bearer ${credentials.bearerToken}`;
						}

						const responseData = await this.helpers.request(options);

						returnData.push({
							json: responseData as IDataObject,
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
