# Trading Tips Manager - Feature Documentation

## Overview
The Trading Tips Manager is an admin panel feature that allows administrators to generate AI-powered trading tips and send them to users via push notifications.

## Features

### 🤖 AI-Powered Tip Generation
- **OpenRouter Integration**: Uses Gemini 2.0 Flash for fast, free tip generation
- **Smart Money Concepts**: All tips are based on SMC principles
- **Customizable Parameters**:
  - **Category**: Risk management, Technical analysis, Psychology, Strategy, Market structure
  - **Difficulty**: Beginner, Intermediate, Advanced
- **Structured Output**: Title, content, category, difficulty, actionable flag

### 📱 Push Notification Delivery
- **Targeted Sending**: Only sends to users with daily tips enabled
- **Respects Preferences**: Checks notification_preferences.daily_tip setting
- **Bulk Notifications**: Sends to all eligible users at once
- **Success Tracking**: Shows number of successful vs failed deliveries

### ✏️ Custom Tip Editing
- **Edit AI Tips**: Modify generated tips before sending
- **Manual Writing**: Write completely custom tips
- **Character Limits**:
  - Title: 50 characters
  - Content: 200 characters
- **Real-time Preview**: See exactly what users will receive

## Access & Permissions

### Admin Roles
The feature is accessible to:
- ✅ Super Admin
- ✅ Admin
- ✅ Editor

### User Requirements (Recipients)
Users will receive tips if:
1. They have push notifications enabled (`notification_preferences.push_enabled = true`)
2. They have daily tips enabled (`notification_preferences.daily_tip = true`)
3. They have granted browser push permission

## How to Use

### 1. Access the Tips Manager
Navigate to **Admin Panel → Trading Tips** in the sidebar.

### 2. Generate a Tip
1. (Optional) Select a category and difficulty level
2. Click **"Generate Tip"** button
3. Wait for AI to generate the tip (1-2 seconds)
4. Review the generated content

### 3. Edit or Write Custom Tip
1. Edit the AI-generated title and content in the text fields
2. Or write a completely new tip from scratch
3. Stay within character limits (shown below each field)

### 4. Send to Users
1. Click **"Send Push Notification"** button
2. Tip is immediately sent to all eligible users
3. View success/failure statistics
4. Form clears automatically after 5 seconds

## API Endpoints

### Generate Tip
```
POST /api/admin/tips/generate
```

**Request Body:**
```json
{
  "category": "risk_management",    // optional
  "difficulty": "beginner",         // optional
  "count": 1                        // optional, for batch generation
}
```

**Response:**
```json
{
  "success": true,
  "tip": {
    "title": "Master Your Risk-Reward Ratio",
    "content": "Always aim for a minimum 1:2 risk-reward ratio. This means if you risk $100, target at least $200 profit.",
    "category": "risk_management",
    "difficulty": "beginner",
    "actionable": true
  }
}
```

### Send Tip
```
POST /api/admin/tips/send
```

**Request Body:**
```json
{
  "tip": "Trading tip content...",
  "title": "Tip title"              // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trading tip sent to 42 users",
  "totalSuccess": 40,
  "totalFailed": 2,
  "usersTargeted": 42
}
```

## Technical Implementation

### Service Layer
**File**: `lib/openrouter/generate-tip.ts`

```typescript
import { generateTradingTip } from '@/lib/openrouter/generate-tip';

const tip = await generateTradingTip('risk_management', 'beginner');
```

### Push Notification Flow
1. Admin generates/writes tip
2. Admin clicks send
3. System queries users with `daily_tip = true`
4. Bulk push notification sent via `sendPushNotificationBulk()`
5. Success/failure counts returned
6. Notification history logged

### Database Tables Used
- `profiles` - Check notification preferences
- `push_subscriptions` - Get user push endpoints
- `notification_history` - Log sent notifications
- `admin_roles` - Verify admin permissions

## User Experience

### Notification Appearance
```
Title: 💡 Daily Trading Tip
Body: [Tip content from admin]
Icon: App icon
Action: Tap to open app
```

### User Settings
Users can control tip notifications in:
**Settings → Notification Preferences → Daily Trading Tips**

## Best Practices

### Tip Quality
- ✅ Keep tips actionable and practical
- ✅ Use clear, simple language
- ✅ Focus on one concept per tip
- ✅ Match difficulty to target audience
- ❌ Avoid complex jargon for beginners
- ❌ Don't make tips too long

### Sending Schedule
- **Recommended**: Once per day, same time
- **Avoid**: Multiple tips in short timeframe
- **Consider**: User time zones (future enhancement)

### Content Guidelines
- Focus on Smart Money Concepts
- Provide actionable advice
- Match category to content
- Set appropriate difficulty level
- Keep content concise (200 chars max)

## Monitoring

### Success Metrics
- Number of users targeted
- Successful deliveries
- Failed deliveries
- User engagement (future)

### Error Handling
- Invalid subscriptions auto-removed (410/404 errors)
- Failed sends logged but don't stop bulk operation
- Admin sees detailed success/failure counts

## Future Enhancements

### Potential Improvements
- [ ] Schedule tips for future delivery
- [ ] Tip templates library
- [ ] A/B testing for tip effectiveness
- [ ] User engagement analytics
- [ ] Tip categories performance tracking
- [ ] Multi-language support
- [ ] Image attachments
- [ ] Time zone awareness

## Troubleshooting

### No Users Receiving Tips
**Check**:
1. Do users have push notifications enabled in their browser?
2. Do users have daily_tip = true in preferences?
3. Have users granted push permission?
4. Is VAPID configured correctly?

### AI Generation Failing
**Check**:
1. Is `OPENROUTER_API_KEY` set in environment variables?
2. Is the OpenRouter API responsive?
3. Check server logs for specific errors

### Push Notifications Not Delivering
**Check**:
1. VAPID keys configured: `VAPID_PRIVATE_KEY`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
2. Push subscriptions table has valid endpoints
3. Service worker registered on user devices
4. Check browser console for permission errors

## Related Files

### Backend
- `lib/openrouter/generate-tip.ts` - AI generation service
- `app/api/admin/tips/generate/route.ts` - Generate endpoint
- `app/api/admin/tips/send/route.ts` - Send endpoint
- `lib/push/server.ts` - Push notification service

### Frontend
- `app/admin/tips/page.tsx` - Admin UI
- `components/admin/admin-sidebar.tsx` - Navigation

### Configuration
- `lib/push/types.ts` - Notification types
- `.env.local` - Environment variables

## Environment Variables Required

```env
# OpenRouter (for AI generation)
OPENROUTER_API_KEY=your_openrouter_key

# Push Notifications (for delivery)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:support@nativeflows.com
```

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Verify environment variables are set
3. Test with a small user base first
4. Monitor notification history table

---

**Version**: 1.0
**Last Updated**: December 2025
**Feature Status**: ✅ Production Ready
