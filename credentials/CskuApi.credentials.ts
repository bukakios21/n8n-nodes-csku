import type {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class CskuApi implements ICredentialType {
    name = 'cskuApi';
    displayName = 'CSKU API';
    documentationUrl = 'https://api.csku.ai';
    properties: INodeProperties[] = [
        {
            displayName: 'Tipe Autentikasi',
            name: 'authenticationType',
            type: 'options',
            options: [
                {
                    name: 'Business & Secret',
                    value: 'businessSecret',
                },
                {
                    name: 'Merchant ID & Secret Key',
                    value: 'merchantSecret',
                },
                {
                    name: 'Bearer Token',
                    value: 'bearerToken',
                },
            ],
            default: 'businessSecret',
        },
        {
            displayName: 'Business ID',
            name: 'businessId',
            type: 'string',
            default: '',
            displayOptions: {
                show: {
                    authenticationType: ['businessSecret'],
                },
            },
            required: true,
        },
        {
            displayName: 'Secret',
            name: 'secret',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            displayOptions: {
                show: {
                    authenticationType: ['businessSecret'],
                },
            },
            required: true,
        },
        {
            displayName: 'Merchant ID',
            name: 'merchantId',
            type: 'string',
            default: '',
            displayOptions: {
                show: {
                    authenticationType: ['merchantSecret'],
                },
            },
            required: true,
        },
        {
            displayName: 'Secret Key',
            name: 'secretKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            displayOptions: {
                show: {
                    authenticationType: ['merchantSecret'],
                },
            },
            required: true,
        },
        {
            displayName: 'Bearer Token',
            name: 'bearerToken',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            displayOptions: {
                show: {
                    authenticationType: ['bearerToken'],
                },
            },
            required: true,
        },
    ];
}
