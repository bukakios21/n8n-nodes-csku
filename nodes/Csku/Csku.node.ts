import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

export class Csku implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'CSKU',
        name: 'csku',
        icon: 'file:csku.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Berinteraksi dengan CSKU API',
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
                        name: 'Pesan',
                        value: 'message',
                    },
                    {
                        name: 'Catatan',
                        value: 'note',
                    },
                    {
                        name: 'Percakapan',
                        value: 'conversation',
                    },
                ],
                default: 'message',
            },
            // Message Operations
            {
                displayName: 'Operasi',
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
                        name: 'Kirim',
                        value: 'send',
                        description: 'Kirim pesan ke conversation',
                        action: 'Kirim pesan',
                    },
                    {
                        name: 'Ambil Semua',
                        value: 'getAll',
                        description: 'Ambil semua pesan dalam conversation',
                        action: 'Ambil semua pesan',
                    },
                ],
                default: 'send',
            },
            // Note Operations
            {
                displayName: 'Operasi',
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
                        name: 'Buat',
                        value: 'create',
                        description: 'Buat catatan internal',
                        action: 'Buat catatan',
                    },
                ],
                default: 'create',
            },
            // Conversation Operations
            {
                displayName: 'Operasi',
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
                        name: 'Tandai Butuh CS',
                        value: 'markNeedHuman',
                        description: 'Tandai conversation membutuhkan CS',
                        action: 'Tandai butuh CS',
                    },
                    {
                        name: 'Total Butuh CS',
                        value: 'getNeedHumanTotal',
                        description: 'Ambil total conversation yang butuh CS',
                        action: 'Ambil total butuh CS',
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
                description: 'Conversation ID tujuan',
            },
            {
                displayName: 'Tipe Pesan',
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
                        name: 'Teks',
                        value: 'text',
                    },
                    {
                        name: 'Media',
                        value: 'media',
                    },
                ],
                default: 'text',
                description: 'Tipe pesan yang akan dikirim',
            },
            {
                displayName: 'Teks',
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
                description: 'Pesan teks yang akan dikirim',
            },
            {
                displayName: 'URL Media',
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
                description: 'URL file media',
            },
            {
                displayName: 'Tipe Media',
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
                        name: 'Gambar',
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
                        name: 'Dokumen',
                        value: 'document',
                    },
                ],
                default: 'image',
                description: 'Tipe media',
            },
            {
                displayName: 'Tipe MIME',
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
                description: 'Tipe MIME file media',
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
                description: 'Caption untuk media',
            },

            // ===== Message: Get All Fields =====
            {
                displayName: 'ID Percakapan',
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
                description: 'ID percakapan',
            },

            // ===== Note: Create Fields =====
            {
                displayName: 'ID Percakapan',
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
                description: 'ID percakapan',
            },
            {
                displayName: 'Catatan',
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
                description: 'Isi catatan',
            },

            // ===== Conversation: Mark Need Human Fields =====
            {
                displayName: 'ID Percakapan',
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
                description: 'ID percakapan',
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

                        const body: Record<string, unknown> = {
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
                        const headers: Record<string, string> = {};

                        if (credentials.authenticationType === 'businessSecret') {
                            headers['Business'] = credentials.businessId as string;
                            headers['Secret'] = credentials.secret as string;
                        } else if (credentials.authenticationType === 'bearerToken') {
                            headers['Authorization'] = 'Bearer ' + credentials.bearerToken;
                        }

                        const responseData = await this.helpers.request({
                            method: 'POST',
                            url: 'https://api.csku.ai/v1/message',
                            body,
                            json: true,
                            headers,
                        });

                        returnData.push({
                            json: responseData,
                            pairedItem: { item: i },
                        });
                    } else if (operation === 'getAll') {
                        const conversationId = this.getNodeParameter('conversationId', i) as string;

                        const credentials = await this.getCredentials('cskuApi');
                        const headers: Record<string, string> = {};

                        if (credentials.authenticationType === 'merchantSecret') {
                            headers['merchant_id'] = credentials.merchantId as string;
                            headers['secret_key'] = credentials.secretKey as string;
                        } else {
                            throw new Error('Get All Messages requires Merchant ID & Secret Key authentication');
                        }

                        const responseData = await this.helpers.request({
                            method: 'GET',
                            url: 'https://api.csku.ai/v1/message/' + conversationId,
                            json: true,
                            headers,
                        });

                        returnData.push({
                            json: responseData,
                            pairedItem: { item: i },
                        });
                    }
                } else if (resource === 'note') {
                    if (operation === 'create') {
                        const conversationId = this.getNodeParameter('conversationId', i) as string;
                        const note = this.getNodeParameter('note', i) as string;

                        const body = {
                            conversation_id: conversationId,
                            note: note,
                        };

                        const credentials = await this.getCredentials('cskuApi');
                        const headers: Record<string, string> = {};

                        if (credentials.authenticationType === 'businessSecret') {
                            headers['Business'] = credentials.businessId as string;
                            headers['Secret'] = credentials.secret as string;
                        } else if (credentials.authenticationType === 'bearerToken') {
                            headers['Authorization'] = 'Bearer ' + credentials.bearerToken;
                        }

                        const responseData = await this.helpers.request({
                            method: 'POST',
                            url: 'https://api.csku.ai/v1/note',
                            body,
                            json: true,
                            headers,
                        });

                        returnData.push({
                            json: responseData,
                            pairedItem: { item: i },
                        });
                    }
                } else if (resource === 'conversation') {
                    if (operation === 'markNeedHuman') {
                        const conversationId = this.getNodeParameter('conversationId', i) as string;

                        const body = {
                            conversation_id: conversationId,
                        };

                        const credentials = await this.getCredentials('cskuApi');
                        const headers: Record<string, string> = {};

                        if (credentials.authenticationType === 'businessSecret') {
                            headers['Business'] = credentials.businessId as string;
                            headers['Secret'] = credentials.secret as string;
                        } else if (credentials.authenticationType === 'bearerToken') {
                            headers['Authorization'] = 'Bearer ' + credentials.bearerToken;
                        }

                        const responseData = await this.helpers.request({
                            method: 'POST',
                            url: 'https://api.csku.ai/v1/conversation/need-human',
                            body,
                            json: true,
                            headers,
                        });

                        returnData.push({
                            json: responseData,
                            pairedItem: { item: i },
                        });
                    } else if (operation === 'getNeedHumanTotal') {
                        const credentials = await this.getCredentials('cskuApi');
                        const headers: Record<string, string> = {};

                        if (credentials.authenticationType === 'businessSecret') {
                            headers['Business'] = credentials.businessId as string;
                            headers['Secret'] = credentials.secret as string;
                        } else if (credentials.authenticationType === 'bearerToken') {
                            headers['Authorization'] = 'Bearer ' + credentials.bearerToken;
                        }

                        const responseData = await this.helpers.request({
                            method: 'GET',
                            url: 'https://api.csku.ai/v1/conversation/need-human/total',
                            json: true,
                            headers,
                        });

                        returnData.push({
                            json: responseData,
                            pairedItem: { item: i },
                        });
                    }
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: (error as Error).message,
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
