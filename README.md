# n8n-nodes-csku

This is an n8n community node that lets you use CSKU API in your n8n workflows.

CSKU is a customer service and communication platform.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Message

- Send text message
- Send media message (image, video, audio, document)

### Note

- Create note for a conversation

### Conversation

- Mark conversation as needing human
- Get total conversations needing human

## Credentials

This node uses the CSKU API credentials. You can choose between two authentication types:

1. **Business & Secret**: Uses `business` and `secret` headers
2. **Bearer Token**: Uses Authorization header with Bearer token

## Compatibility

Tested with n8n version 1.0.0+

## Usage

### Send Text Message

1. Select **Message** as the resource
2. Select **Send** as the operation
3. Select **Text** as the message type
4. Enter the conversation ID
5. Enter your text message

### Send Media Message

1. Select **Message** as the resource
2. Select **Send** as the operation
3. Select **Media** as the message type
4. Enter the conversation ID
5. Enter the media URL
6. Select the media type (image, video, audio, document)
7. Enter the MIME type
8. Optionally add a caption

### Create Note

1. Select **Note** as the resource
2. Select **Create** as the operation
3. Enter the conversation ID
4. Enter your note content

### Mark Conversation as Needing Human

1. Select **Conversation** as the resource
2. Select **Mark Need Human** as the operation
3. Enter the conversation ID

### Get Total Conversations Needing Human

1. Select **Conversation** as the resource
2. Select **Get Need Human Total** as the operation

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [CSKU API documentation](https://api.csku.ai)

## License

[MIT](LICENSE.md)
# n8n-nodes-csku
# n8n-nodes-csku
