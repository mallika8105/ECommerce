# Email Notifications for Profile Updates

## Overview

This guide explains how to send email notifications to users when they update their profile information.

## Current State

Currently, Supabase Auth automatically sends emails for:
- ✅ New user sign-up (confirmation email)
- ✅ Email address changes (verification email)
- ✅ Password reset requests

However, **profile update notifications** require custom implementation.

## Implementation Options

### Option 1: Supabase Edge Functions (Recommended)

**Pros:**
- Native Supabase integration
- Serverless (no additional infrastructure)
- Can use Supabase's built-in email service or third-party providers

**Cons:**
- Requires Deno/TypeScript knowledge
- Need to deploy functions to Supabase

### Option 2: Database Triggers + Edge Functions

**Pros:**
- Automatic execution on profile updates
- No application code changes needed

**Cons:**
- More complex setup
- Harder to debug

### Option 3: Application-Level (Client-Side)

**Pros:**
- Simple to implement
- Easy to test and modify

**Cons:**
- Requires email service API keys in frontend (security concern)
- Better to use backend/serverless approach

## Recommended Implementation: Edge Function with Resend

### Step 1: Sign Up for Email Service

We'll use **Resend** (free tier: 3,000 emails/month)

1. Go to https://resend.com
2. Sign up for a free account
3. Verify your domain (or use their test domain)
4. Get your API key from Settings → API Keys

### Step 2: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 3: Initialize Supabase in Your Project

```bash
cd c:/Users/91810/OneDrive/Desktop/Projects/Ecommerce
supabase init
```

### Step 4: Create Edge Function

```bash
supabase functions new send-profile-update-email
```

This creates: `supabase/functions/send-profile-update-email/index.ts`

### Step 5: Edge Function Code

Create the file with this content:

```typescript
// supabase/functions/send-profile-update-email/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''

interface ProfileUpdateRequest {
  email: string
  name: string
  changes: string[]
}

serve(async (req) => {
  try {
    // Parse request body
    const { email, name, changes }: ProfileUpdateRequest = await req.json()

    // Prepare email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .changes { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          ul { margin: 10px 0; }
          li { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Profile Updated Successfully</h1>
          </div>
          <div class="content">
            <p>Hello ${name || 'User'},</p>
            <p>Your profile has been updated successfully!</p>
            
            <div class="changes">
              <h3>Updated Information:</h3>
              <ul>
                ${changes.map(change => `<li>${change}</li>`).join('')}
              </ul>
            </div>
            
            <p>If you did not make these changes, please contact support immediately.</p>
            
            <p>Thank you for using our service!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'noreply@yourdomain.com', // Change this to your verified domain
        to: [email],
        subject: 'Profile Updated Successfully',
        html: emailHtml,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      return new Response(
        JSON.stringify({ success: true, messageId: data.id }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      )
    } else {
      throw new Error(data.message || 'Failed to send email')
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
```

### Step 6: Set Environment Variables

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

### Step 7: Deploy the Function

```bash
supabase functions deploy send-profile-update-email
```

### Step 8: Update AccountPage.tsx

Add the email sending logic after successful profile update:

```typescript
// Add this function at the top of AccountPage component
const sendProfileUpdateEmail = async (changes: string[]) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-profile-update-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: editEmail,
          name: editName,
          changes: changes,
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to send email notification');
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// In handleUpdateProfile, after successful update:
setUpdateMessage('Profile updated successfully!');

// Track what changed
const changes: string[] = [];
if (editName !== (user.user_metadata?.name || '')) changes.push('Name');
if (editEmail !== (user.email || '')) changes.push('Email');
if (editPhone !== (user.phone || '')) changes.push('Phone');
if (editAddress || editCity || editState || editPincode) changes.push('Address');

// Send email notification (don't await, let it run in background)
if (changes.length > 0) {
  sendProfileUpdateEmail(changes);
}
```

## Simpler Alternative: Using Client-Side Email Service

If you don't want to set up Edge Functions, you can use a client-side approach (less secure):

### Using EmailJS (Free tier available)

1. Sign up at https://www.emailjs.com
2. Create an email template
3. Get your service ID, template ID, and public key
4. Install EmailJS:

```bash
npm install @emailjs/browser
```

5. Add to AccountPage.tsx:

```typescript
import emailjs from '@emailjs/browser';

const sendEmail = () => {
  const templateParams = {
    to_email: editEmail,
    to_name: editName,
    message: 'Your profile has been updated successfully!',
  };

  emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    templateParams,
    'YOUR_PUBLIC_KEY'
  ).then(
    (response) => {
      console.log('Email sent!', response.status, response.text);
    },
    (error) => {
      console.log('Email failed...', error);
    }
  );
};

// Call after successful profile update
sendEmail();
```

## Security Considerations

### For Edge Functions:
- ✅ API keys stored securely as secrets
- ✅ Server-side execution
- ✅ User authentication required

### For Client-Side:
- ⚠️ API keys visible in frontend code
- ⚠️ Can be abused if not rate-limited
- ✅ Simpler to implement and test

## Cost Comparison

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| Resend | 3,000 emails/month | $20/month for 50,000 |
| EmailJS | 200 emails/month | $7/month for 1,000 |
| SendGrid | 100 emails/day | $15/month for 40,000 |
| Supabase Edge Functions | Included | Included with Pro plan |

## Recommendation

1. **For Production**: Use Supabase Edge Functions + Resend (secure, scalable)
2. **For Testing**: Use EmailJS client-side (quick setup, good for demos)
3. **For Enterprise**: Use SendGrid or AWS SES with Edge Functions

## Next Steps

1. Choose your email service provider
2. Set up the service and get API credentials
3. Implement the Edge Function OR client-side solution
4. Test with your email address
5. Deploy and monitor

## Testing

Before deploying:
1. Test with your own email first
2. Check spam folder
3. Verify email content looks good on mobile
4. Test rate limiting
5. Monitor delivery rates

Would you like me to help you implement one of these solutions?
