# Amazon SES SMTP Setup Guide

## 🎯 Quick Start

Your Labyrinth backend is now configured to use **Amazon SES SMTP** for sending emails instead of Resend.

---

## 📋 **Prerequisites**

1. AWS Account
2. Verified sender email/domain in SES
3. SMTP credentials from SES

---

## 🚀 **Setup Steps**

### **Step 1: Verify Your Email in AWS SES**

1. Go to [AWS SES Console](https://console.aws.amazon.com/ses/)
2. Click **"Verified identities"** in the left sidebar
3. Click **"Create identity"**
4. Choose **"Email address"** (or Domain for production)
5. Enter your email (e.g., `noreply@yourdomain.com`)
6. Click **"Create identity"**
7. **Check your email** and click the verification link

---

### **Step 2: Create SMTP Credentials**

1. In SES Console, go to **"SMTP settings"** (left sidebar)
2. Click **"Create SMTP credentials"**
3. Enter a username (e.g., `labyrinth-smtp-user`)
4. Click **"Create user"**
5. **Download or copy** the credentials:
   - SMTP Username
   - SMTP Password
   - SMTP Server (e.g., `email-smtp.us-east-1.amazonaws.com`)
   - Port: `587` (TLS) or `465` (SSL)

---

### **Step 3: Update .env File**

Add your SES credentials to `.env`:

```env
# Amazon SES SMTP Configuration
SES_SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SES_SMTP_PORT=587
SES_SMTP_USER=AKIAIOSFODNN7EXAMPLE
SES_SMTP_PASSWORD=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
SES_FROM_EMAIL=noreply@yourdomain.com
SES_FROM_NAME=Labyrinth
SES_REGION=us-east-1
```

**Replace with your actual credentials!**

---

### **Step 4: Test the Connection**

Start your server:
```bash
npm run dev
```

You should see:
```
✅ Amazon SES SMTP connection verified successfully
```

If you see an error, double-check your credentials.

---

## 🌍 **SES Regions & Endpoints**

Choose the region closest to your users:

| Region | SMTP Endpoint |
|--------|---------------|
| US East (N. Virginia) | `email-smtp.us-east-1.amazonaws.com` |
| US West (Oregon) | `email-smtp.us-west-2.amazonaws.com` |
| Europe (Ireland) | `email-smtp.eu-west-1.amazonaws.com` |
| Europe (Frankfurt) | `email-smtp.eu-central-1.amazonaws.com` |
| Asia Pacific (Sydney) | `email-smtp.ap-southeast-2.amazonaws.com` |
| Asia Pacific (Singapore) | `email-smtp.ap-southeast-1.amazonaws.com` |

Full list: https://docs.aws.amazon.com/ses/latest/dg/regions.html

---

## 📧 **Email Types Supported**

Your backend now sends these emails via SES:

1. **OTP Verification** (signup)
   - Function: `sendOTPEmail(email, otp, "signup")`
   
2. **Password Reset OTP**
   - Function: `sendOTPEmail(email, otp, "password-reset")`
   
3. **Username Recovery**
   - Function: `sendUsernameRecoveryEmail(email, username)`

---

## 🔒 **Production Tips**

### **1. Move Out of SES Sandbox**

By default, SES is in **sandbox mode** (can only send to verified emails).

To send to any email:
1. Go to SES Console
2. Click **"Account dashboard"**
3. Click **"Request production access"**
4. Fill out the form explaining your use case
5. Wait for AWS approval (usually 24 hours)

### **2. Verify Your Domain (Recommended)**

Instead of verifying individual emails:
1. Verify your entire domain (e.g., `labyrinth.com`)
2. Add DNS records (DKIM, SPF) for better deliverability
3. This allows sending from any `@labyrinth.com` address

### **3. Monitor Sending**

- Track bounces and complaints in SES Console
- Set up SNS notifications for bounces
- Monitor your sending quotas

### **4. Handle Bounces**

SES tracks bounces and complaints. High rates can suspend your account:
- Keep bounce rate < 5%
- Keep complaint rate < 0.1%
- Remove bounced emails from your database

---

## 🔧 **Code Usage**

### **Send OTP Email:**
```typescript
import { sendOTPEmail } from "../config/ses";

await sendOTPEmail(
  "user@example.com",
  "123456",
  "signup"
);
```

### **Send Custom Email:**
```typescript
import { sendSESEmail } from "../config/ses";

await sendSESEmail({
  to: "user@example.com",
  subject: "Welcome to Labyrinth!",
  html: "<h1>Welcome!</h1>",
  text: "Welcome to Labyrinth!"
});
```

---

## 🐛 **Troubleshooting**

### **Error: "MessageRejected: Email address is not verified"**
✅ **Solution:** Verify the sender email in SES Console

### **Error: "Invalid login credentials"**
✅ **Solution:** 
- Re-generate SMTP credentials in SES Console
- Make sure you're using SMTP credentials, not AWS access keys
- Check for typos in `.env`

### **Error: "Connection timeout"**
✅ **Solution:**
- Check your internet connection
- Verify SES endpoint URL for your region
- Check if port 587 is blocked by firewall

### **Emails going to spam**
✅ **Solution:**
- Verify your domain (not just email)
- Set up SPF, DKIM, and DMARC records
- Warm up your sending (start with low volume)

---

## 📊 **Cost**

Amazon SES is very affordable:
- **First 62,000 emails/month:** FREE (if sending from EC2)
- **After that:** $0.10 per 1,000 emails
- **Attachments:** $0.12 per GB

Much cheaper than most email services!

---

## 🔗 **Useful Links**

- [AWS SES Console](https://console.aws.amazon.com/ses/)
- [SES Documentation](https://docs.aws.amazon.com/ses/)
- [SES SMTP Interface Guide](https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html)
- [SES Sending Limits](https://docs.aws.amazon.com/ses/latest/dg/manage-sending-quotas.html)

---

## ✅ **You're All Set!**

Your backend now uses Amazon SES for professional email delivery with:
- ✅ Better deliverability
- ✅ Lower cost
- ✅ Scalable infrastructure
- ✅ AWS reliability

Start sending emails! 🚀
