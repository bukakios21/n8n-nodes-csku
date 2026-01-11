
import {
    IHookFunctions,
    IWebhookFunctions,
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
    IDataObject,
} from 'n8n-workflow';

export class CskuTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'CSKU Trigger',
        name: 'cskuTrigger',
        icon: 'file:csku.svg',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["event"]}}',
        description: 'Memulai workflow ketika ada event dari CSKU',
        defaults: {
            name: 'CSKU Trigger',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'cskuApi',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'Webhook URL',
                name: 'webhookUrl',
                type: 'notice',
                default: '',
                displayOptions: {
                    hide: {
                        '@version': [1],
                    },
                },
            },
            {
                displayName:
                    'Salin URL webhook di bawah ini dan paste ke pengaturan webhook di dashboard CSKU Anda.',
                name: 'webhookNotice',
                type: 'notice',
                default: '',
            },
            {
                displayName: 'Event',
                name: 'event',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Semua Event',
                        value: '*',
                        description: 'Trigger untuk semua jenis event',
                    },
                    {
                        name: 'Pesan Masuk dari User',
                        value: 'user.message_in',
                        description: 'Trigger ketika customer mengirim pesan',
                    },
                    {
                        name: 'Pesan AI Dikirim',
                        value: 'ai.message_generated',
                        description: 'Trigger ketika AI generate dan mengirim balasan',
                    },
                    {
                        name: 'Pesan Agent Keluar',
                        value: 'agent.message_out',
                        description: 'Trigger ketika agent/CS mengirim pesan',
                    },
                ],
                default: '*',
                description: 'Jenis event yang ingin di-listen',
            },
            {
                displayName: 'Verifikasi Secret',
                name: 'verifySecret',
                type: 'boolean',
                default: true,
                description:
                    'Apakah perlu memverifikasi header secret dari webhook CSKU sesuai dengan credentials Anda',
            },
        ],
    };

    webhookMethods = {
        default: {
            async checkExists(this: IHookFunctions): Promise<boolean> {
                // Webhook is stateless, always return true
                return true;
            },
            async create(this: IHookFunctions): Promise<boolean> {
                // Nothing to create, webhook is passive
                return true;
            },
            async delete(this: IHookFunctions): Promise<boolean> {
                // Nothing to delete
                return true;
            },
        },
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const req = this.getRequestObject();
        const body = this.getBodyData() as IDataObject;
        const event = this.getNodeParameter('event') as string;
        const verifySecret = this.getNodeParameter('verifySecret') as boolean;

        // Verify secret if enabled
        if (verifySecret) {
            const credentials = await this.getCredentials('cskuApi');
            const headerSecret = req.headers['secret'] as string;

            let expectedSecret: string | undefined;

            if (credentials.authenticationType === 'businessSecret') {
                expectedSecret = credentials.secret as string;
            } else if (credentials.authenticationType === 'bearerToken') {
                // For bearer token, extract secret from the token (format: business_id:secret_key in base64)
                try {
                    const decoded = Buffer.from(credentials.bearerToken as string, 'base64').toString('utf-8');
                    const parts = decoded.split(':');
                    if (parts.length >= 2) {
                        expectedSecret = parts[1];
                    }
                } catch (e) {
                    // Invalid base64, skip verification
                }
            }

            if (expectedSecret && headerSecret !== expectedSecret) {
                return {
                    webhookResponse: {
                        status: 401,
                        body: { success: false, message: 'Invalid secret' },
                    },
                };
            }
        }

        // Check if the event matches
        const receivedEvent = body.event as string;

        if (event !== '*' && receivedEvent !== event) {
            // Event doesn't match, return success but don't trigger workflow
            return {
                webhookResponse: {
                    status: 200,
                    body: { success: true, message: 'Event ignored' },
                },
            };
        }

        // Return the webhook data to trigger the workflow
        return {
            workflowData: [
                this.helpers.returnJsonArray([body]),
            ],
            webhookResponse: {
                status: 200,
                body: { success: true },
            },
        };
    }
}
