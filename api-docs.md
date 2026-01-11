# CSKU AI - API Documentation (v1)

Dokumentasi lengkap untuk semua API endpoints yang tersedia di `/v1`

## Base URL
```
https://api.csku.ai
```

## Authentication

Semua endpoint memerlukan autentikasi dengan 2 metode yang bisa dipilih:

### Metode 1: Header Business & Secret
```
Business: {business_id}
Secret: {secret_key}
```

### Metode 2: Authorization Bearer
```
Authorization: Bearer {base64_encoded_string}
```
Format base64: `business_id:secret_key`

---

## API Endpoints

### 1. POST /v1/message
Mengirim pesan ke conversation tertentu melalui API.

**Headers:**
- `Business`: Business ID (atau gunakan Authorization Bearer)
- `Secret`: Secret key (atau gunakan Authorization Bearer)
- `Authorization`: Bearer token (optional, alternative auth method)

**Request Body:**
```json
{
  "conversation_id": "conv_123456",
  "text": "Halo, ini pesan dari API",
  "media": {
    "url": "https://example.com/image.jpg",
    "type": "image",
    "mime_type": "image/jpeg",
    "caption": "Caption untuk media"
  }
}
```

**Field Descriptions:**
- `conversation_id` (required): ID conversation tujuan
- `text` (optional): Pesan text yang akan dikirim
- `media` (optional): Object media jika ingin mengirim file
  - `url` (required): URL file media
  - `type` (required): Tipe media (`image`, `video`, `audio`, `document`)
  - `mime_type` (required): Mime type (`image/jpeg`, `image/png`, `video/mp4`, `audio/mp3`, `text/plain`)
  - `caption` (optional): Caption untuk media

**Notes:**
- Minimal harus ada `text` atau `media`
- Paket user harus memiliki fitur OpenAPI aktif
- Pesan akan dikirim dengan sender "agent"

**Success Response:**
```json
{
  "message_id": "msg_ulid123456",
  "success": true
}
```

**Error Response:**
```json
{
  "status": 0,
  "message": "Error message here"
}
```

**Possible Errors:**
- `Data tidak valid. Mohon periksa kembali parameter dan header`
- `secret not valid`
- `Anda belum memiliki paket aktif`
- `Paket user tidak memiliki fitur API`
- `conversation not found`
- `media type not supported`
- `media mime type not supported`

---

### 2. GET /v1/message/:conversation_id
Mendapatkan semua pesan dalam sebuah conversation.

**Headers:**
- `merchant_id`: Merchant ID
- `secret_key`: Secret key

**URL Parameters:**
- `conversation_id`: ID conversation yang ingin diambil pesannya

**Success Response:**
```json
{
  "status": 1,
  "data": [
    {
      "id": 1,
      "message_id": "msg_123",
      "conversation_id": "conv_123",
      "sender": "user",
      "sender_name": "John Doe",
      "message": "Halo",
      "message_type": "text",
      "mime_type": "text/plain",
      "caption": "",
      "sent_at": "2024-01-01 10:00:00",
      "delivery_status": "delivered",
      "is_note": 0
    }
  ],
  "message": "list message"
}
```

**Error Response:**
```json
{
  "status": 0,
  "message": "Error message here"
}
```

**Possible Errors:**
- `Data tidak valid. Mohon periksa kembali parameter dan header`
- `merchant not found`
- `api key not valid`
- `Anda belum memiliki paket aktif`
- `Paket user tidak memiliki fitur API`

---

### 3. POST /v1/note
Menambahkan note internal ke dalam conversation.

**Headers:**
- `Business`: Business ID (atau gunakan Authorization Bearer)
- `Secret`: Secret key (atau gunakan Authorization Bearer)
- `Authorization`: Bearer token (optional, alternative auth method)

**Request Body:**
```json
{
  "conversation_id": "conv_123456",
  "note": "Ini adalah catatan internal untuk conversation ini"
}
```

**Field Descriptions:**
- `conversation_id` (required): ID conversation tujuan
- `note` (required): Isi note/catatan yang akan ditambahkan

**Notes:**
- Note bersifat internal dan tidak terlihat oleh customer
- Note akan tersimpan dengan `is_note = 1` di database
- Sender akan dicatat sebagai "agent" dengan sender_name "api"

**Success Response:**
```json
{
  "success": true,
  "note": "Ini adalah catatan internal untuk conversation ini"
}
```

**Error Response:**
```json
{
  "status": 0,
  "message": "Error message here"
}
```

**Possible Errors:**
- `Data tidak valid. Mohon periksa kembali parameter dan header`
- `conversation_id is required`
- `note is required`
- `secret not valid`
- `conversation not found`
- `error create note`

---

### 4. POST /v1/conversation/need-human
Menandai conversation bahwa memerlukan intervensi human/CS.

**Headers:**
- `Business`: Business ID (atau gunakan Authorization Bearer)
- `Secret`: Secret key (atau gunakan Authorization Bearer)
- `Authorization`: Bearer token (optional, alternative auth method)

**Request Body:**
```json
{
  "conversation_id": "conv_123456"
}
```

**Field Descriptions:**
- `conversation_id` (required): ID conversation yang ingin ditandai butuh CS

**What it does:**
- Mengubah `lock_by_human` menjadi `1`
- Mengubah status conversation menjadi "butuh CS"
- Broadcast event `reload.convs` via WebSocket ke business ID
- Jika sudah ditandai sebelumnya, akan return success tanpa update

**Success Response:**
```json
{
  "success": true,
  "conversation_id": "conv_123456"
}
```

**Error Response:**
```json
{
  "status": 0,
  "message": "Error message here"
}
```

**Possible Errors:**
- `Data tidak valid. Mohon periksa kembali parameter dan header`
- `conversation_id is required`
- `conversation id is required`
- `secret not valid`
- `conversation not found`
- `error update lock by human`

---

### 5. GET /v1/conversation/need-human/total
Mendapatkan total jumlah conversation yang membutuhkan CS/human.

**Headers:**
- `Business`: Business ID (atau gunakan Authorization Bearer)
- `Secret`: Secret key (atau gunakan Authorization Bearer)
- `Authorization`: Bearer token (optional, alternative auth method)

**No Request Body Required**

**What it returns:**
- Total count conversation dengan `lock_by_human = 1` untuk business tertentu

**Success Response:**
```json
{
  "success": true,
  "total": 15
}
```

**Field Descriptions:**
- `total`: Jumlah conversation yang membutuhkan CS

**Error Response:**
```json
{
  "status": 0,
  "message": "Error message here"
}
```

**Possible Errors:**
- `Data tidak valid. Mohon periksa kembali parameter dan header`
- `biz id is required`
- `secret not valid`
- `error count conversation`

---

## Common Error Responses

### Authentication Errors
```json
{
  "status": 0,
  "message": "Data tidak valid. Mohon periksa kembali parameter dan header"
}
```

```json
{
  "status": 0,
  "message": "secret not valid"
}
```

### Authorization Errors
```json
{
  "status": 0,
  "message": "Anda belum memiliki paket aktif."
}
```

```json
{
  "status": 0,
  "message": "Paket user tidak memiliki fitur API."
}
```

### Resource Not Found
```json
{
  "status": 0,
  "message": "conversation not found"
}
```

```json
{
  "status": 0,
  "message": "merchant not found"
}
```

---

## Rate Limiting

Rate limiting ditentukan berdasarkan paket yang digunakan. Pastikan paket Anda memiliki fitur OpenAPI aktif.

---

## Code Examples

### cURL - Send Message (Text)
```bash
curl -X POST https://api.csku.ai/v1/message \
  -H "Business: your_business_id" \
  -H "Secret: your_secret_key" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "conv_123456",
    "text": "Hello from API"
  }'
```

### cURL - Send Message (Media)
```bash
curl -X POST https://api.csku.ai/v1/message \
  -H "Business: your_business_id" \
  -H "Secret: your_secret_key" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "conv_123456",
    "media": {
      "url": "https://example.com/image.jpg",
      "type": "image",
      "mime_type": "image/jpeg",
      "caption": "Product image"
    }
  }'
```

### cURL - Using Bearer Token
```bash
# First, encode your credentials
# echo -n "business_id:secret_key" | base64

curl -X POST https://api.csku.ai/v1/message \
  -H "Authorization: Bearer YnVzaW5lc3NfaWQ6c2VjcmV0X2tleQ==" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "conv_123456",
    "text": "Hello from API"
  }'
```

### cURL - Get Messages
```bash
curl -X GET https://api.csku.ai/v1/message/conv_123456 \
  -H "merchant_id: your_merchant_id" \
  -H "secret_key: your_secret_key"
```

### cURL - Send Note
```bash
curl -X POST https://api.csku.ai/v1/note \
  -H "Business: your_business_id" \
  -H "Secret: your_secret_key" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "conv_123456",
    "note": "Customer menanyakan tentang promo"
  }'
```

### cURL - Mark as Need Human
```bash
curl -X POST https://api.csku.ai/v1/conversation/need-human \
  -H "Business: your_business_id" \
  -H "Secret: your_secret_key" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "conv_123456"
  }'
```

### cURL - Get Total Need Human
```bash
curl -X GET https://api.csku.ai/v1/conversation/need-human/total \
  -H "Business: your_business_id" \
  -H "Secret: your_secret_key"
```

### JavaScript (Fetch)
```javascript
// Send message
const sendMessage = async () => {
  const response = await fetch('https://api.csku.ai/v1/message', {
    method: 'POST',
    headers: {
      'Business': 'your_business_id',
      'Secret': 'your_secret_key',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      conversation_id: 'conv_123456',
      text: 'Hello from API'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Using Bearer token
const credentials = btoa('business_id:secret_key');
const response = await fetch('https://api.csku.ai/v1/message', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${credentials}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    conversation_id: 'conv_123456',
    text: 'Hello from API'
  })
});
```

### Python
```python
import requests
import base64

# Method 1: Using headers
headers = {
    'Business': 'your_business_id',
    'Secret': 'your_secret_key',
    'Content-Type': 'application/json'
}

data = {
    'conversation_id': 'conv_123456',
    'text': 'Hello from API'
}

response = requests.post(
    'https://api.csku.ai/v1/message',
    headers=headers,
    json=data
)

print(response.json())

# Method 2: Using Bearer token
credentials = base64.b64encode(b'business_id:secret_key').decode()
headers = {
    'Authorization': f'Bearer {credentials}',
    'Content-Type': 'application/json'
}

response = requests.post(
    'https://api.csku.ai/v1/message',
    headers=headers,
    json=data
)

print(response.json())
```

### Go
```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

type MessageRequest struct {
    ConversationID string `json:"conversation_id"`
    Text           string `json:"text"`
}

func sendMessage() {
    url := "https://api.csku.ai/v1/message"
    
    payload := MessageRequest{
        ConversationID: "conv_123456",
        Text:           "Hello from API",
    }
    
    jsonData, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    req.Header.Set("Business", "your_business_id")
    req.Header.Set("Secret", "your_secret_key")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Println(err)
        return
    }
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result)
}
```

---

## Webhook Events

CSKU AI akan mengirimkan notifikasi webhook ke URL yang telah dikonfigurasi di business settings ketika ada event tertentu yang terjadi.

### Konfigurasi Webhook

Webhook dapat dikonfigurasi melalui dashboard business settings. URL webhook akan menerima POST request dengan data event.

### Authentication di Webhook

Setiap request webhook akan menyertakan header authentication:
```json
{
  "secret": "your_business_secret_key"
}
```

Verifikasi secret key ini untuk memastikan request berasal dari CSKU AI.

### Event Types

CSKU AI mengirimkan beberapa tipe event webhook:

#### 1. `user.message_in`
Event ini dikirim ketika ada pesan masuk dari customer/user.

**Webhook Payload:**
```json
{
  "event": "user.message_in",
  "timestamp": 1704096000,
  "conversation_id": "conv_123456",
  "conversation_label": "John Doe",
  "need_human": 0,
  "message": {
    "id": "msg_ulid123456",
    "sender_name": "John Doe",
    "channel": {
      "id": "ch_merchant_123",
      "name": "WhatsApp CS",
      "engine": "whatsapp"
    },
    "bisnis": {
      "id": "biz_123",
      "name": "My Business"
    },
    "user": {
      "id": "user_123",
      "name": "Business Owner"
    },
    "content": {
      "type": "text",
      "text": "Halo, saya mau tanya produk"
    }
  }
}
```

**Content untuk Media:**
```json
{
  "content": {
    "type": "image",
    "attachments": [
      {
        "url": "https://example.com/media/image.jpg",
        "mime_type": "image/jpeg"
      }
    ]
  }
}
```

#### 2. `ai.message_generated`
Event ini dikirim ketika AI berhasil generate dan mengirim balasan otomatis.

**Webhook Payload:**
```json
{
  "event": "ai.message_generated",
  "timestamp": 1704096060,
  "conversation_id": "conv_123456",
  "conversation_label": "John Doe",
  "need_human": 0,
  "message": {
    "id": "msg_ulid789012",
    "sender_name": "AI Assistant",
    "channel": {
      "id": "ch_merchant_123",
      "name": "WhatsApp CS",
      "engine": "whatsapp"
    },
    "bisnis": {
      "id": "biz_123",
      "name": "My Business"
    },
    "user": {
      "id": "user_123",
      "name": "Business Owner"
    },
    "ai": {
      "name": "AI Assistant",
      "id": "ai_agent_123"
    },
    "content": {
      "type": "text",
      "text": "Halo! Terima kasih telah menghubungi kami. Ada yang bisa saya bantu?"
    }
  }
}
```

#### 3. `agent.message_out`
Event ini dikirim ketika agent/CS mengirim pesan manual ke customer.

**Webhook Payload:**
```json
{
  "event": "agent.message_out",
  "timestamp": 1704096120,
  "conversation_id": "conv_123456",
  "conversation_label": "John Doe",
  "need_human": 1,
  "message": {
    "id": "msg_ulid345678",
    "sender_name": "Agent Sarah",
    "channel": {
      "id": "ch_merchant_123",
      "name": "WhatsApp CS",
      "engine": "whatsapp"
    },
    "bisnis": {
      "id": "biz_123",
      "name": "My Business"
    },
    "user": {
      "id": "user_123",
      "name": "Business Owner"
    },
    "agent": {
      "name": "Agent Sarah"
    },
    "content": {
      "type": "text",
      "text": "Baik, saya akan bantu jelaskan produk kami"
    }
  }
}
```

### Webhook Response Format

Endpoint webhook Anda **HARUS** mengembalikan response dalam format JSON berikut:

**Success Response:**
```json
{
  "success": true
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

**PENTING:**
- Response harus berupa JSON dengan field `success`
- Jika `success` tidak ada atau bernilai `false`, webhook akan di-retry
- Pastikan endpoint webhook merespons dengan cepat (< 5 detik)

### Field Descriptions

- `event`: Tipe event (`user.message_in`, `ai.message_generated`, `agent.message_out`)
- `timestamp`: Unix timestamp saat event terjadi
- `conversation_id`: ID unik conversation
- `conversation_label`: Nama display conversation (biasanya nama customer)
- `need_human`: Apakah conversation membutuhkan CS (0 = tidak, 1 = ya)
- `message.id`: ID unik message
- `message.sender_name`: Nama pengirim pesan
- `message.channel.id`: ID channel merchant
- `message.channel.name`: Label/nama channel
- `message.channel.engine`: Platform channel (`whatsapp`, `telegram`, `instagram`, dll)
- `message.bisnis.id`: ID business
- `message.bisnis.name`: Nama business
- `message.user.id`: ID user/merchant owner
- `message.user.name`: Nama user/merchant owner
- `message.content.type`: Tipe konten (`text`, `image`, `video`, `audio`, `document`)
- `message.content.text`: Isi pesan (untuk tipe text)
- `message.content.attachments`: Array media (untuk tipe non-text)
- `message.ai`: Informasi AI agent (hanya untuk event `ai.message_generated`)
- `message.agent`: Informasi agent CS (hanya untuk event `agent.message_out`)

### Content Types

Webhook mendukung berbagai tipe konten:

**Text Message:**
```json
{
  "content": {
    "type": "text",
    "text": "Pesan text"
  }
}
```

**Image:**
```json
{
  "content": {
    "type": "image",
    "attachments": [
      {
        "url": "https://example.com/image.jpg",
        "mime_type": "image/jpeg"
      }
    ]
  }
}
```

**Video:**
```json
{
  "content": {
    "type": "video",
    "attachments": [
      {
        "url": "https://example.com/video.mp4",
        "mime_type": "video/mp4"
      }
    ]
  }
}
```

**Audio:**
```json
{
  "content": {
    "type": "audio",
    "attachments": [
      {
        "url": "https://example.com/audio.mp3",
        "mime_type": "audio/mpeg"
      }
    ]
  }
}
```

**Document:**
```json
{
  "content": {
    "type": "document",
    "attachments": [
      {
        "url": "https://example.com/file.pdf",
        "mime_type": "application/pdf"
      }
    ]
  }
}
```

### Webhook Implementation Example

#### Node.js (Express)
```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const { secret } = req.headers;
  const data = req.body;
  
  // Verify secret
  if (secret !== process.env.CSKU_SECRET) {
    return res.status(401).json({ success: false, message: 'Invalid secret' });
  }
  
  // Handle event
  switch (data.event) {
    case 'user.message_in':
      console.log('New message from user:', data.message.content);
      // Process incoming message
      break;
      
    case 'ai.message_generated':
      console.log('AI replied:', data.message.content);
      // Log AI response
      break;
      
    case 'agent.message_out':
      console.log('Agent replied:', data.message.content);
      // Track agent activity
      break;
  }
  
  // Return success
  res.json({ success: true });
});

app.listen(3000);
```

#### Python (Flask)
```python
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    # Verify secret
    secret = request.headers.get('secret')
    if secret != os.getenv('CSKU_SECRET'):
        return jsonify({'success': False, 'message': 'Invalid secret'}), 401
    
    data = request.get_json()
    event = data.get('event')
    
    # Handle event
    if event == 'user.message_in':
        print(f"New message from user: {data['message']['content']}")
        # Process incoming message
        
    elif event == 'ai.message_generated':
        print(f"AI replied: {data['message']['content']}")
        # Log AI response
        
    elif event == 'agent.message_out':
        print(f"Agent replied: {data['message']['content']}")
        # Track agent activity
    
    # Return success
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(port=3000)
```

#### PHP
```php
<?php
// Get secret from headers
$headers = getallheaders();
$secret = $headers['secret'] ?? '';

// Verify secret
if ($secret !== getenv('CSKU_SECRET')) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid secret']);
    exit;
}

// Get webhook data
$data = json_decode(file_get_contents('php://input'), true);
$event = $data['event'] ?? '';

// Handle event
switch ($event) {
    case 'user.message_in':
        error_log('New message from user: ' . json_encode($data['message']['content']));
        // Process incoming message
        break;
        
    case 'ai.message_generated':
        error_log('AI replied: ' . json_encode($data['message']['content']));
        // Log AI response
        break;
        
    case 'agent.message_out':
        error_log('Agent replied: ' . json_encode($data['message']['content']));
        // Track agent activity
        break;
}

// Return success
header('Content-Type: application/json');
echo json_encode(['success' => true]);
```

#### Go
```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
    "os"
)

type WebhookData struct {
    Event            string `json:"event"`
    Timestamp        int64  `json:"timestamp"`
    ConversationID   string `json:"conversation_id"`
    ConversationLabel string `json:"conversation_label"`
    NeedHuman        int    `json:"need_human"`
    Message          struct {
        ID         string `json:"id"`
        SenderName string `json:"sender_name"`
        Content    struct {
            Type string `json:"type"`
            Text string `json:"text,omitempty"`
        } `json:"content"`
    } `json:"message"`
}

func webhookHandler(w http.ResponseWriter, r *http.Request) {
    // Verify secret
    secret := r.Header.Get("secret")
    if secret != os.Getenv("CSKU_SECRET") {
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(map[string]interface{}{
            "success": false,
            "message": "Invalid secret",
        })
        return
    }
    
    // Parse webhook data
    var data WebhookData
    if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]interface{}{
            "success": false,
            "message": "Invalid JSON",
        })
        return
    }
    
    // Handle event
    switch data.Event {
    case "user.message_in":
        log.Printf("New message from user: %s", data.Message.Content.Text)
        // Process incoming message
        
    case "ai.message_generated":
        log.Printf("AI replied: %s", data.Message.Content.Text)
        // Log AI response
        
    case "agent.message_out":
        log.Printf("Agent replied: %s", data.Message.Content.Text)
        // Track agent activity
    }
    
    // Return success
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]bool{"success": true})
}

func main() {
    http.HandleFunc("/webhook", webhookHandler)
    log.Fatal(http.ListenAndServe(":3000", nil))
}
```

### Retry Mechanism

Jika webhook gagal (timeout, error, atau `success: false`):
- CSKU AI akan melakukan retry beberapa kali
- Interval retry akan bertambah secara exponential
- Webhook yang gagal akan dicatat di log sistem

### Best Practices

1. **Response Cepat**: Endpoint webhook harus merespons dalam < 5 detik
2. **Async Processing**: Jika perlu processing lama, terima request dulu, return success, lalu process secara async
3. **Verify Secret**: Selalu verifikasi secret key untuk keamanan
4. **Idempotent**: Siapkan handling untuk duplikat request (gunakan message.id sebagai unique key)
5. **Error Handling**: Tangani error dengan baik dan return response yang sesuai
6. **Logging**: Log semua webhook request untuk debugging
7. **HTTPS**: Gunakan HTTPS untuk endpoint webhook

### Testing Webhook

Anda bisa test webhook menggunakan tools seperti:
- [Webhook.site](https://webhook.site) - Untuk melihat payload yang dikirim
- [ngrok](https://ngrok.com) - Untuk expose local server ke public URL
- Postman - Untuk simulate webhook request

### Troubleshooting

**Webhook tidak terkirim:**
- Pastikan URL webhook sudah dikonfigurasi di business settings
- Pastikan URL webhook accessible dari internet (gunakan HTTPS)
- Cek business package memiliki fitur webhook aktif

**Webhook selalu retry:**
- Pastikan endpoint return JSON dengan field `success: true`
- Pastikan response time < 5 detik
- Cek log error di endpoint Anda

**Secret key tidak valid:**
- Verifikasi secret key di business settings
- Secret dikirim di header, bukan di body

---

## Support

Untuk pertanyaan lebih lanjut atau bantuan, silakan hubungi tim support CSKU AI.
