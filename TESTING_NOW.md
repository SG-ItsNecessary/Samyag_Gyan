# Quick Testing Checklist - Profile Popup Fix

## Changes Made:

### 1. ✅ Green Border for Active Buttons
- Active buttons now have **GREEN border** (#28a745, 2px)
- Inactive buttons remain RED background

### 2. ✅ Button States Updated in DEMO_USER
- Current Affairs: **active** (transparent + green border)
- Ethics & Essay: **inactive** (red background)

### 3. ✅ Console Logging Added
- Shows user_id from localStorage
- Shows each API call URL
- Shows each API response
- Shows success/error messages

---

## Test Steps:

### Step 1: Check if Logged In
1. Open browser console (F12)
2. Type: `localStorage.getItem('user_id')`
3. **Expected:** Should show `681522234`

**If NULL:**
- Open `profile-mock.html`
- Click "Login to Continue"
- Wait for redirect to homepage
- Then return to dashboard

---

### Step 2: Visual Check - Button Colors
Look at the dashboard:

**Current Affairs button should be:**
- ✅ Transparent background
- ✅ GREEN border (2px, #28a745)
- ✅ Black text

**Ethics & Essay button should be:**
- ✅ RED background (#FF0000)
- ✅ RED border
- ✅ White text

---

### Step 3: Click "Your Trial Ends" Button
1. Click the green button "Your Trial Ends: Oct 25, 2025"
2. **Watch the console for logs:**

Expected console output:
```
🔍 Loading profile for user ID: 681522234
📡 Fetching profile from: http://localhost:3000/api/users/profile/681522234
📡 Profile response status: 200
✅ Profile data received: {success: true, profile: {...}}
📡 Fetching referrals from: http://localhost:3000/api/referrals/stats/681522234
✅ Referrals data received: {success: true, stats: {...}}
📡 Fetching topics from: http://localhost:3000/api/topics/my-subscriptions/681522234
✅ Topics data received: {success: true, topics: [...]}
✅ User profile loaded successfully
```

3. **Popup should show:**
- Name: Deepanshu Anand
- User ID: 681522234
- Language: English (or Hindi)
- Referral Code: X*****Si (masked)
- Trial dates in DD-MMM-YYYY format
- Referral count: 1 friend
- Subscription: Inactive (blinking RED)
- Topics: ✓ Current Affairs, ✓ Ethics & Essays

---

### Step 4: Click Active Button (Current Affairs)
1. Click **Current Affairs** button (transparent + green border)
2. **Expected:**
   - Console: "current-affairs is active - showing profile popup"
   - Profile popup appears (same as Step 3)

---

### Step 5: Click Inactive Button (Ethics & Essay)
1. Click **Ethics & Essay** button (RED background)
2. **Expected:**
   - Console: "TODO: Redirect to subscription page..."
   - Button scrolls and glows red
   - Subscription popup does NOT appear (we'll implement that later)
   - Profile popup does NOT appear

---

## If You See "Loading..." Issue:

### Check Console Errors:

**Error 1: "❌ No user ID found in localStorage"**
- **Fix:** Login first using `profile-mock.html`

**Error 2: "HTTP 404" or "Failed to fetch"**
- **Fix:** Backend server not running
- Run: `cd C:\Users\danan\SamyakGyan_Backend && npm start`

**Error 3: "CORS policy" error**
- **Fix:** Backend CORS not configured correctly
- Check if backend has `cors()` middleware enabled

**Error 4: "User not found"**
- **Fix:** User doesn't exist in database
- Login again using `profile-mock.html` to create user

---

## Subscribe Note Position:

Check **bottom right corner** of the right-block:
- Should see: "* Click on (Button) to Subscribe"
- Small italic text
- Gray color
- Positioned absolutely in bottom right

---

## Success Criteria:

- [ ] Current Affairs button: Transparent + GREEN border ✓
- [ ] Ethics & Essay button: RED background ✓
- [ ] Click "Your Trial Ends" → Profile popup appears ✓
- [ ] Click Current Affairs → Profile popup appears ✓
- [ ] Click Ethics & Essay → Scroll and glow (no popup) ✓
- [ ] Console shows all API calls successfully ✓
- [ ] Profile data loads correctly (no "Loading...") ✓
- [ ] Subscribe note in bottom right corner ✓

---

## Console Commands for Debugging:

```javascript
// Check if logged in
localStorage.getItem('user_id')

// Check all stored data
console.log({
  user_id: localStorage.getItem('user_id'),
  referral_code: localStorage.getItem('referral_code'),
  trial_end: localStorage.getItem('trial_end'),
  subscription_status: localStorage.getItem('subscription_status')
})

// Clear localStorage and re-login
localStorage.clear()
// Then go to profile-mock.html

// Test API manually
fetch('http://localhost:3000/api/users/profile/681522234')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## Ready to Test! 🚀

Open the browser console (F12) and follow steps 1-5 above.

Report back what you see in:
1. Button colors (visual)
2. Console logs (when clicking trial button)
3. Popup data (what appears vs "Loading...")
