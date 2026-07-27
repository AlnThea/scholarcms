import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { to, subject, body, apiKey, senderName, senderEmail, provider = 'gmail' } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { success: false, error: 'Field "to", "subject", dan "body" wajib diisi.' },
        { status: 400 }
      );
    }

    const emailSender = senderEmail || process.env.NEWSLETTER_SENDER_EMAIL || process.env.GMAIL_USER || 'dahlan.fauzi1991@gmail.com';
    const emailSenderName = senderName || process.env.NEWSLETTER_SENDER_NAME || 'ScholarCMS';
    const fromAddress = `"${emailSenderName}" <${emailSender}>`;

    // 1. INTEGRASI GOOGLE MAIL / GMAIL (APP PASSWORD) ATAU CUSTOM SMTP
    if (provider === 'gmail' || provider === 'smtp') {
      const activeAppPass = apiKey || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD;

      if (!activeAppPass) {
        return NextResponse.json({
          success: true,
          mode: 'demo',
          message: 'Gmail App Password belum diisi. Email berjalan dalam mode simulasi (Demo Mode).'
        });
      }

      // Dynamic import Nodemailer (hanya di-load saat ada pengiriman email aktif)
      const nodemailerModule = await import('nodemailer');
      const nodemailer = nodemailerModule.default || nodemailerModule;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailSender,
          pass: activeAppPass.replace(/\s+/g, '') // Bersihkan spasi 4x4
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 8000
      });

      const mailOptions = {
        from: fromAddress,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: subject,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 16px;">
          <h2 style="color: #2563eb; margin-top: 0;">${subject}</h2>
          <div style="white-space: pre-wrap; font-size: 14px; margin-top: 16px; color: #4b5563;">${body}</div>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 40px; margin-bottom: 20px;" />
          <p style="font-size: 11px; color: #9ca3af; text-align: center;">Email ini dikirimkan otomatis oleh ${emailSenderName}.</p>
        </div>`
      };

      const info = await transporter.sendMail(mailOptions);

      return NextResponse.json({
        success: true,
        mode: 'production',
        provider: 'gmail',
        messageId: info.messageId,
        message: 'Email produksi berhasil dikirimkan via Google Mail (Gmail App Password)!'
      });
    }

    // 2. INTEGRASI RESEND API (https://resend.com)
    if (provider === 'resend' || (apiKey && apiKey.startsWith('re_'))) {
      const activeApiKey = apiKey || process.env.RESEND_API_KEY;

      if (!activeApiKey) {
        return NextResponse.json({
          success: true,
          mode: 'demo',
          message: 'API Key Resend belum diatur. Simulasi sukses (Demo Mode).'
        });
      }

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeApiKey}`
        },
        body: JSON.stringify({
          from: fromAddress,
          to: Array.isArray(to) ? to : [to],
          subject: subject,
          html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2563eb;">${subject}</h2>
            <div style="white-space: pre-wrap; font-size: 14px; margin-top: 16px;">${body}</div>
            <hr style="border: none; border-top: 1px solid #eee; margin-top: 40px;" />
            <p style="font-size: 11px; color: #999;">Email ini dikirim dari ${emailSenderName}.</p>
          </div>`
        })
      });

      const resendData = await resendRes.json();

      if (!resendRes.ok) {
        return NextResponse.json(
          { success: false, error: resendData.message || 'Gagal mengirim email via Resend API' },
          { status: resendRes.status }
        );
      }

      return NextResponse.json({
        success: true,
        mode: 'production',
        provider: 'resend',
        id: resendData.id,
        message: 'Email produksi berhasil dikirimkan via Resend API!'
      });
    }

    // 3. INTEGRASI SENDGRID API (https://sendgrid.com)
    if (provider === 'sendgrid' || (apiKey && apiKey.startsWith('SG.'))) {
      const activeApiKey = apiKey || process.env.SENDGRID_API_KEY;

      if (!activeApiKey) {
        return NextResponse.json({
          success: true,
          mode: 'demo',
          message: 'API Key SendGrid belum diatur. Simulasi sukses (Demo Mode).'
        });
      }

      const sendgridRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeApiKey}`
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: (Array.isArray(to) ? to : [to]).map(e => ({ email: e }))
            }
          ],
          from: { email: emailSender, name: emailSenderName },
          subject: subject,
          content: [
            {
              type: 'text/html',
              value: `<div style="font-family: sans-serif; line-height: 1.6;">${body}</div>`
            }
          ]
        })
      });

      if (!sendgridRes.ok) {
        const errorText = await sendgridRes.text();
        return NextResponse.json(
          { success: false, error: errorText || 'Gagal mengirim email via SendGrid API' },
          { status: sendgridRes.status }
        );
      }

      return NextResponse.json({
        success: true,
        mode: 'production',
        provider: 'sendgrid',
        message: 'Email produksi berhasil dikirimkan via SendGrid API!'
      });
    }

    // DEMO FALLBACK
    return NextResponse.json({
      success: true,
      mode: 'demo',
      message: 'Email berhasil disimulasikan (Demo Mode). Masukkan Gmail App Password / API Key untuk pengiriman produksi asli.'
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Gagal Mengirim Email: ' + err.message },
      { status: 500 }
    );
  }
}
