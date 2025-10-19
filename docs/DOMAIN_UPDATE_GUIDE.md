# 🌐 Domain Update Guide

**Purpose**: When you get your domain, update ALL files in one go
**Current Status**: Using placeholder `[YOUR_DOMAIN_HERE]`

---

## 📋 WHEN YOU GET YOUR DOMAIN

### Step 1: Tell Me Your Domain

Just say:
```
"My domain is: samyakgyan.com"
```

Or:
```
"My domain is: www.samyakgyan.in"
```

### Step 2: I'll Update ALL Files

I'll do a find-and-replace across:
- ✅ profile.html (Telegram widget)
- ✅ scripts/auth.js (redirect URLs)
- ✅ docs/BACKEND_COMPLETE.md (API documentation)
- ✅ Any other files with domain references

---

## 🔒 HTTPS REQUIREMENT

**Important**: Telegram OAuth **ONLY works with HTTPS** in production!

### What This Means:
- ❌ `http://yoursite.com` - Won't work
- ✅ `https://yoursite.com` - Will work

### Where to Get HTTPS:

#### Option 1: Let's Encrypt (Free)
- **Cost**: Free
- **Setup**: Your hosting provider usually includes this
- **Certificate**: Auto-renews

#### Option 2: Cloudflare (Free)
- **Cost**: Free
- **Bonus**: Free CDN (makes site faster)
- **Setup**: Change DNS to Cloudflare
- **Certificate**: Automatic

#### Option 3: Hosting Provider
- Most hosting services include free SSL certificate
- Ask your hosting provider: "Do you provide free SSL?"

---

## 📝 FILES WITH DOMAIN PLACEHOLDERS

### File: `profile.html`
**Line**: 147
**Placeholder**: `[YOUR_DOMAIN_HERE]`
**Usage**: Telegram OAuth redirect URL

### File: `docs/BACKEND_COMPLETE.md`
**Multiple Lines**
**Placeholder**: `[YOUR_DOMAIN_HERE]`
**Usage**: API base URL, referral links, webhook URLs

---

## 🎯 TELEGRAM BOT DOMAIN SETUP

**After you get domain + HTTPS:**

### Step 1: Configure Bot Domain
1. Open Telegram
2. Search **@BotFather**
3. Send `/setdomain`
4. Select your bot
5. Enter: `samyakgyan.com` (your actual domain)

### Step 2: Test Login Widget
1. Visit your site: `https://samyakgyan.com/profile.html`
2. Telegram widget should appear
3. Click "Login with Telegram"
4. Should authenticate successfully

---

## ⚠️ COMMON MISTAKES TO AVOID

### Mistake 1: Using HTTP instead of HTTPS
❌ `http://samyakgyan.com`
✅ `https://samyakgyan.com`

**Why**: Telegram rejects non-HTTPS domains

### Mistake 2: Not Matching Bot Domain
Your domain in code **MUST MATCH** domain in @BotFather

**Example**:
- Bot domain in @BotFather: `samyakgyan.com`
- Profile page URL: `https://www.samyakgyan.com/profile.html`
- ❌ **Won't work!** (www vs non-www mismatch)

**Fix**: Use same format everywhere:
- ✅ Both: `samyakgyan.com`
- OR ✅ Both: `www.samyakgyan.com`

### Mistake 3: Forgetting Subdirectories
If your site is hosted at: `https://yourhost.com/samyakgyan/`

Then domain should be: `yourhost.com/samyakgyan`

---

## 🚀 DEPLOYMENT CHECKLIST

Before going live:

- [ ] Domain purchased
- [ ] Domain points to your server (DNS configured)
- [ ] HTTPS certificate installed
- [ ] Site accessible via HTTPS
- [ ] Telegram bot domain configured in @BotFather
- [ ] All `[YOUR_DOMAIN_HERE]` placeholders replaced
- [ ] Test Telegram login on live site
- [ ] Backend APIs using correct domain

---

## 💡 QUICK REFERENCE

### Your Domain Will Be Used In:

1. **Telegram OAuth**:
   ```javascript
   data-auth-url="https://[YOUR_DOMAIN]/api/auth/telegram"
   ```

2. **Referral Links**:
   ```
   https://[YOUR_DOMAIN]/?ref=A8x9Zw#2
   ```

3. **API Base URL**:
   ```
   https://[YOUR_DOMAIN]/api
   ```

4. **Subscription Page**:
   ```
   https://[YOUR_DOMAIN]/subscribe
   ```

5. **CORS Configuration**:
   ```
   CORS_ALLOWED_ORIGIN=https://[YOUR_DOMAIN]
   ```

---

## 📞 WHEN YOU'RE READY

Just tell me:
1. Your domain name
2. Whether it includes 'www' or not
3. If you have HTTPS set up

I'll update everything in seconds! 🚀

---

**Status**: Awaiting Domain
**Next Step**: Purchase domain + get HTTPS
**Then**: Tell me domain, I update all files
