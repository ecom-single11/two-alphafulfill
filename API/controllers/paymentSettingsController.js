const { getSettings, upsertSettings } = require('../models/paymentSettingsModel');
const crypto = require('crypto');
const axios  = require('axios');

// Public — only returns non-secret fields
async function getPublicSettings(req, res) {
    try {
        const s = await getSettings();
        res.json({
            razorpay: { keyId: s?.razorpayKeyId || '', isActive: !!(s?.isActive) },
            phonepe:  { merchantId: s?.phonepeMerchantId || '', merchantUserId: s?.phonepeMerchantUserId || '', isActive: !!(s?.phonepeIsActive) },
            cod:      { isActive: !!(s?.codIsActive) }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Admin — returns full settings
async function getFullSettings(req, res) {
    try {
        const settings = await getSettings();
        res.json({ data: settings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateSettings(req, res) {
    try {
        const updated = await upsertSettings(req.body);
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ── PhonePe: Initiate payment ─────────────────────────────────────────────────
async function phonePeInitiate(req, res) {
    try {
        const s = await getSettings();
        if (!s?.phonepeMerchantId || !s?.phonepeSaltKey) {
            return res.status(400).json({ error: 'PhonePe not configured' });
        }

        const { amount, orderId, name, phone, redirectUrl } = req.body;
        const isTest = !!(s.isTestMode);
        const baseUrl = isTest
            ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
            : 'https://api.phonepe.com/apis/hermes';

        const payload = {
            merchantId: s.phonepeMerchantId,
            merchantTransactionId: orderId,
            merchantUserId: s.phonepeMerchantUserId || `MUID_${Date.now()}`,
            amount: Math.round(amount * 100), // paise
            redirectUrl: redirectUrl,
            redirectMode: 'POST',
            callbackUrl: redirectUrl,
            mobileNumber: phone,
            paymentInstrument: { type: 'PAY_PAGE' }
        };

        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const saltKey   = s.phonepeSaltKey;
        const saltIndex = s.phonepeSaltIndex || '1';
        const checksum  = crypto.createHash('sha256')
            .update(base64Payload + '/pg/v1/pay' + saltKey)
            .digest('hex') + '###' + saltIndex;

        const response = await axios.post(
            `${baseUrl}/pg/v1/pay`,
            { request: base64Payload },
            { headers: { 'Content-Type': 'application/json', 'X-VERIFY': checksum } }
        );

        const redirectPayUrl = response.data?.data?.instrumentResponse?.redirectInfo?.url;
        if (!redirectPayUrl) {
            return res.status(500).json({ error: 'PhonePe did not return redirect URL', raw: response.data });
        }

        res.json({ success: true, redirectUrl: redirectPayUrl, transactionId: orderId });
    } catch (err) {
        console.error('PhonePe initiate error:', err?.response?.data || err.message);
        res.status(500).json({ error: 'PhonePe payment initiation failed' });
    }
}

// ── PhonePe: Verify payment status ───────────────────────────────────────────
async function phonePeVerify(req, res) {
    try {
        const s = await getSettings();
        const { transactionId } = req.params;
        const isTest = !!(s?.isTestMode);
        const baseUrl = isTest
            ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
            : 'https://api.phonepe.com/apis/hermes';

        const saltKey   = s.phonepeSaltKey;
        const saltIndex = s.phonepeSaltIndex || '1';
        const path      = `/pg/v1/status/${s.phonepeMerchantId}/${transactionId}`;
        const checksum  = crypto.createHash('sha256')
            .update(path + saltKey)
            .digest('hex') + '###' + saltIndex;

        const response = await axios.get(`${baseUrl}${path}`, {
            headers: { 'Content-Type': 'application/json', 'X-VERIFY': checksum, 'X-MERCHANT-ID': s.phonepeMerchantId }
        });

        const data = response.data;
        const success = data?.code === 'PAYMENT_SUCCESS';
        res.json({ success, code: data?.code, data: data?.data });
    } catch (err) {
        console.error('PhonePe verify error:', err?.response?.data || err.message);
        res.status(500).json({ error: 'PhonePe verification failed' });
    }
}

module.exports = { getPublicSettings, getFullSettings, updateSettings, phonePeInitiate, phonePeVerify };
