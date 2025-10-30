# User Profile Popup - Testing Guide

## What We Implemented:

### 1. User Profile Popup
- Complete popup with all sections from approved design
- Fetches real data from backend APIs
- Blinking red "Inactive" subscription status
- Masked referral code (X*****Si pattern)
- Date formatting (DD-MMM-YYYY format)

### 2. UI Changes
- **Subscribe note moved** to bottom right corner as info text
- **"Your Trial Ends" button** now clickable → shows profile popup
- **Topic buttons behavior:**
  - Active (transparent): Click → shows profile popup
  - Inactive (RED): Click → scroll and highlight (existing behavior)

### 3. Backend Integration
- Fetches from GET `/api/users/profile/:userId`
- Fetches from GET `/api/referrals/stats/:userId`
- Fetches from GET `/api/topics/my-subscriptions/:userId`

---

## Testing Steps:

### BEFORE TESTING: Start Backend Server
```bash
cd C:\Users\danan\SamyakGyan_Backend
npm start
```
Expected: "Server running on port 3000"

---

### Test 1: Mock Login Flow
1. Open: `profile-mock.html` in browser
2. Click "Login to Continue"
3. Expected:
   - Loading message appears
   - Backend creates/loads user
   - Redirects to `homepage.html`
   - User data stored in localStorage

---

### Test 2: Open Dashboard
1. From homepage, navigate to `user_dashboard_testbed.html`
   - Or open directly: http://127.0.0.1:5500/user_dashboard_testbed.html
2. Expected:
   - Dashboard loads normally
   - **BOTTOM RIGHT**: Info text "* Click on (Button) to Subscribe"
   - Trial button shows: "Your Trial Ends: Oct 25, 2025"

---

### Test 3: Click "Your Trial Ends" Button
1. Click the green "Your Trial Ends: Oct 25, 2025" button
2. Expected:
   - Popup appears with semi-transparent overlay
   - Shows YOUR PROFILE title
   - All sections loaded:

**Basic Info:**
- Name: Deepanshu Anand
- User ID: 681522234
- Language: Hindi
- Referral Code: X*****Si (masked)

**Trial Status:**
- Status: Active ✓ (green)
- Started: 25-Oct-2025
- Ends: 09-Nov-2025 (15 days after start)
- Days Remaining: X Days

**Referral Rewards:**
- Total Referrals: 1 friend (from your testing!)
- Reward: 1 friend joins = 7 days extension

**Subscription:**
- Status: Inactive (RED, blinking)

**Topic Subscriptions:**
- ✓ Current Affairs
- ✓ Ethics & Essays

3. Console should show: "✅ User profile loaded successfully"

---

### Test 4: Close Popup
Test all 3 ways to close:
1. Click **X button** (top right)
2. Click **Close button** (bottom)
3. Click **outside popup** (on dark overlay)

Expected: Popup closes smoothly

---

### Test 5: Click Active Topic Button
1. Click "Current Affairs" button (transparent, active)
2. Expected:
   - Profile popup appears (same as clicking trial button)
   - Console shows: "current-affairs is active - showing profile popup"

---

### Test 6: Click Inactive Topic Button
1. Click "Ethics & Essay" button (RED, inactive)
2. Expected:
   - Button scrolls into view and glows red
   - Popup does NOT appear
   - Console shows: "TODO: Redirect to subscription page..."

---

### Test 7: Verify Subscribe Note Position
1. Look at **bottom right corner** of the right-block panel
2. Expected:
   - Text: "* Click on (Button) to Subscribe"
   - Small italic font
   - Gray color (#333)
   - Fixed position in bottom right

---

## Backend API Calls (Check Console Network Tab):

When popup opens, you should see 3 API calls:

1. **GET** `http://localhost:3000/api/users/profile/681522234`
   - Returns: user profile with trial dates, referral code, etc.

2. **GET** `http://localhost:3000/api/referrals/stats/681522234`
   - Returns: `{ total_referrals: 1 }` (from your earlier testing)

3. **GET** `http://localhost:3000/api/topics/my-subscriptions/681522234`
   - Returns: `{ topics: ["current-affairs", "ethics-essay"] }`

---

## Expected Console Logs:

```
✓ User authenticated: Deepanshu
User ID: 681522234
Trial days remaining: 15
✅ User profile loaded successfully
current-affairs is active - showing profile popup
```

---

## Common Issues & Solutions:

### Issue 1: "Failed to load user profile"
**Solution:** Backend server not running
```bash
cd C:\Users\danan\SamyakGyan_Backend
npm start
```

### Issue 2: Popup doesn't appear
**Solution:** Check console for JavaScript errors
- Open DevTools (F12)
- Check Console tab

### Issue 3: "No user ID found in localStorage"
**Solution:** Not logged in
- Open `profile-mock.html`
- Click "Login to Continue"
- Then return to dashboard

### Issue 4: Subscribe note not in bottom right
**Solution:** Clear browser cache and refresh (Ctrl + Shift + R)

---

## Design Verification Checklist:

- [ ] Popup appears centered with dark overlay
- [ ] X button in top right (gray, turns orange on hover)
- [ ] "YOUR PROFILE" title with orange underline
- [ ] All 5 sections separated by gray dividers
- [ ] Referral code masked correctly (X*****Si)
- [ ] Dates formatted as DD-MMM-YYYY
- [ ] Trial status shows green "Active ✓"
- [ ] Subscription status blinks RED
- [ ] Topics list shows checkmarks (✓)
- [ ] Orange "Close" button at bottom
- [ ] Subscribe note in bottom right corner

---

## Success Criteria:

✅ All 7 tests pass
✅ 3 backend API calls successful
✅ Console shows no errors
✅ Popup displays real backend data
✅ All 3 close methods work
✅ Topic buttons behave differently (active vs inactive)
✅ Subscribe note moved to bottom right

---

## Next Steps After Testing:

If all tests pass:
1. Test with different user data
2. Test with expired trial (change trial_end in database)
3. Test with 0 referrals
4. Test with no topic subscriptions
5. Test responsive design on mobile

---

## Screenshot Locations for Verification:

Take screenshots of:
1. Dashboard with subscribe note in bottom right
2. Popup open with all data visible
3. Console showing successful API calls
4. Network tab showing 3 API requests

---

**Ready to test!** 🚀

Open the dashboard in your browser and follow the 7 test steps above.
