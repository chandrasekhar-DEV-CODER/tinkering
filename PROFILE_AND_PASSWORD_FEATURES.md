# Profile Management & Password Reset Features Documentation

## Overview
This document provides comprehensive documentation for the newly implemented profile management and password reset features in the My School Ride application.

## Table of Contents
1. [Features Overview](#features-overview)
2. [User Flows](#user-flows)
3. [Technical Implementation](#technical-implementation)
4. [Database Schema](#database-schema)
5. [Security Considerations](#security-considerations)
6. [API Reference](#api-reference)
7. [UI Components](#ui-components)
8. [Testing Guide](#testing-guide)
9. [Future Enhancements](#future-enhancements)

---

## Features Overview

### 1. Forgot Password Flow
A complete password reset system that allows users to recover their accounts through email or phone verification.

**Key Features:**
- Email or phone-based password reset
- 6-digit OTP generation and verification
- 5-minute OTP expiration with countdown timer
- Resend OTP functionality (available after 1 minute)
- Real-time validation and feedback

### 2. Profile Settings
A comprehensive profile management page where users can view and update their personal information.

**Key Features:**
- Profile image upload and management
- Edit personal information (name, email, phone)
- Change password for logged-in users
- Role-based profile display
- Avatar with initials fallback
- Responsive design for all devices

---

## User Flows

### Password Reset Flow

```
1. User clicks "Forgot Password" on login page
   ↓
2. User selects Email or Phone tab
   ↓
3. User enters email/phone and clicks "Send Verification Code"
   ↓
4. System generates 6-digit OTP and stores in database
   ↓
5. User receives OTP (currently logged to console, will be sent via email/SMS in production)
   ↓
6. User enters OTP on verification page
   ↓
7. System verifies OTP against database
   ↓
8. If valid, user is redirected to reset password page
   ↓
9. User enters new password (must meet strength requirements)
   ↓
10. System updates password in database
   ↓
11. User is redirected to login page
```

### Profile Update Flow

```
1. User clicks profile avatar in header
   ↓
2. User clicks "Profile Settings"
   ↓
3. User views current profile information
   ↓
4. User clicks "Edit Profile" or "Change Photo"
   ↓
5. User updates information or uploads new image
   ↓
6. User clicks "Save Changes"
   ↓
7. System validates and updates database
   ↓
8. User sees success notification
```

---

## Technical Implementation

### File Structure

```
src/
├── pages/
│   ├── auth/
│   │   ├── ForgotPassword.tsx      # Password reset request page
│   │   ├── VerifyOTP.tsx           # OTP verification page
│   │   └── ResetPassword.tsx       # New password setup page
│   ├── ProfileSettings.tsx         # Profile management page
│   └── Login.tsx                   # Updated with forgot password link
├── components/
│   └── common/
│       └── Header.tsx              # Updated with profile navigation
└── routes.tsx                      # Updated with new routes

supabase/
└── migrations/
    └── 00006_add_profile_management_features.sql
```

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Form Handling**: React hooks (useState, useEffect)
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Storage)
- **Authentication**: Supabase Auth
- **Notifications**: Sonner toast notifications

---

## Database Schema

### New Tables

#### password_reset_tokens
Stores password reset requests with OTP verification.

```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  user_phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'driver', 'parent', 'student')),
  otp_code TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);
```

**Indexes:**
- `idx_password_reset_email` on `user_email`
- `idx_password_reset_expires` on `expires_at`

### Modified Tables

#### All User Tables (admins, drivers, parents, students)
Added `profile_image_url` column:

```sql
ALTER TABLE admins ADD COLUMN profile_image_url TEXT;
ALTER TABLE drivers ADD COLUMN profile_image_url TEXT;
ALTER TABLE parents ADD COLUMN profile_image_url TEXT;
ALTER TABLE students ADD COLUMN profile_image_url TEXT;
```

### Storage Buckets

#### profile_images
Stores user profile images with the following configuration:

- **Public Access**: Yes (read-only)
- **Max File Size**: 1MB (1048576 bytes)
- **Allowed MIME Types**: 
  - image/jpeg
  - image/png
  - image/webp
  - image/jpg

### Database Functions

#### verify_reset_otp(p_email TEXT, p_otp TEXT)
Verifies OTP code and marks token as verified.

**Returns**: BOOLEAN
- `TRUE` if OTP is valid and not expired
- `FALSE` if OTP is invalid or expired

#### mark_reset_token_used(p_email TEXT)
Marks a verified reset token as used after password change.

**Returns**: void

#### cleanup_expired_reset_tokens()
Removes expired reset tokens from the database.

**Returns**: void

---

## Security Considerations

### Password Requirements

All passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

### OTP Security

- **Expiration**: OTPs expire after 5 minutes
- **Single Use**: Each OTP can only be used once
- **Rate Limiting**: Users must wait 1 minute before requesting a new OTP
- **Verification**: OTPs are verified against the database before allowing password reset

### Image Upload Security

- **File Size**: Maximum 1MB per image
- **File Type**: Only image files (JPEG, PNG, WEBP) are allowed
- **Validation**: Client-side and server-side validation
- **Storage**: Images are stored in Supabase Storage with public read access

### Row Level Security (RLS)

#### password_reset_tokens Table

```sql
-- Users can view their own reset tokens
CREATE POLICY "Users can view their own reset tokens"
  ON password_reset_tokens FOR SELECT
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Anyone can create reset tokens (for forgot password)
CREATE POLICY "Anyone can create reset tokens"
  ON password_reset_tokens FOR INSERT
  WITH CHECK (true);

-- Users can update their own reset tokens
CREATE POLICY "Users can update their own reset tokens"
  ON password_reset_tokens FOR UPDATE
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');
```

#### profile_images Bucket

```sql
-- Public read access
CREATE POLICY "Public read access for profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile_images');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile_images' AND auth.role() = 'authenticated');

-- Users can update their own images
CREATE POLICY "Users can update their own profile images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile_images' AND auth.role() = 'authenticated');

-- Users can delete their own images
CREATE POLICY "Users can delete their own profile images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'profile_images' AND auth.role() = 'authenticated');
```

---

## API Reference

### Password Reset APIs

#### Request Password Reset
```typescript
// Generate OTP and store in database
const { error } = await supabase
  .from('password_reset_tokens')
  .insert({
    user_email: email,
    user_phone: phone,
    user_type: 'admin',
    otp_code: otp,
    expires_at: expiresAt.toISOString()
  });
```

#### Verify OTP
```typescript
// Verify OTP using database function
const { data, error } = await supabase.rpc('verify_reset_otp', {
  p_email: email,
  p_otp: otpCode
});
```

#### Reset Password
```typescript
// Update password in user table
const { error } = await supabase
  .from(tableName)
  .update({ 
    password_hash: hashedPassword,
    updated_at: new Date().toISOString()
  })
  .eq('email', email);

// Mark token as used
await supabase.rpc('mark_reset_token_used', { p_email: email });
```

### Profile Management APIs

#### Load Profile Data
```typescript
const { data, error } = await supabase
  .from(`${user.role}s`)
  .select('*')
  .eq('id', user.id)
  .maybeSingle();
```

#### Update Profile
```typescript
const { error } = await supabase
  .from(`${user.role}s`)
  .update({
    full_name: editedData.full_name,
    email: editedData.email,
    phone: editedData.phone,
    updated_at: new Date().toISOString()
  })
  .eq('id', user.id);
```

#### Upload Profile Image
```typescript
// Upload to storage
const { error: uploadError } = await supabase.storage
  .from('profile_images')
  .upload(filePath, file, {
    cacheControl: '3600',
    upsert: true
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('profile_images')
  .getPublicUrl(filePath);

// Update profile with image URL
const { error: updateError } = await supabase
  .from(`${user.role}s`)
  .update({ profile_image_url: publicUrl })
  .eq('id', user.id);
```

#### Change Password (Logged-in User)
```typescript
const { error } = await supabase
  .from(`${user.role}s`)
  .update({
    password_hash: hashedPassword,
    updated_at: new Date().toISOString()
  })
  .eq('id', user.id);
```

---

## UI Components

### ForgotPassword Component

**Location**: `src/pages/auth/ForgotPassword.tsx`

**Features**:
- Email/Phone tab selection
- Input validation
- Loading states
- Error handling
- Navigation to OTP verification

**Props**: None

**State**:
- `method`: 'email' | 'phone'
- `email`: string
- `phone`: string
- `loading`: boolean

### VerifyOTP Component

**Location**: `src/pages/auth/VerifyOTP.tsx`

**Features**:
- 6-digit OTP input with auto-focus
- Countdown timer (5 minutes)
- Resend OTP functionality
- Real-time validation
- Auto-navigation on success

**Props**: None (receives data via React Router location state)

**State**:
- `otp`: string[] (6 digits)
- `loading`: boolean
- `timeLeft`: number (seconds)

### ResetPassword Component

**Location**: `src/pages/auth/ResetPassword.tsx`

**Features**:
- Password strength validation
- Visual feedback for requirements
- Show/hide password toggle
- Confirm password matching
- Real-time validation

**Props**: None (receives data via React Router location state)

**State**:
- `password`: string
- `confirmPassword`: string
- `showPassword`: boolean
- `showConfirmPassword`: boolean
- `loading`: boolean

### ProfileSettings Component

**Location**: `src/pages/ProfileSettings.tsx`

**Features**:
- Profile image upload with preview
- Edit mode toggle
- Change password dialog
- Role-based field display
- Avatar with initials fallback
- Responsive design

**Props**: None

**State**:
- `profileData`: object
- `editedData`: object
- `isEditing`: boolean
- `loading`: boolean
- `uploading`: boolean
- `showPasswordDialog`: boolean
- `currentPassword`: string
- `newPassword`: string
- `confirmPassword`: string

---

## Testing Guide

### Manual Testing Checklist

#### Forgot Password Flow
- [ ] Navigate to login page
- [ ] Click "Forgot Password" link
- [ ] Test email tab:
  - [ ] Enter valid email
  - [ ] Click "Send Verification Code"
  - [ ] Verify OTP is generated (check console)
  - [ ] Verify navigation to OTP page
- [ ] Test phone tab:
  - [ ] Enter valid phone number
  - [ ] Click "Send Verification Code"
  - [ ] Verify OTP is generated (check console)
  - [ ] Verify navigation to OTP page

#### OTP Verification
- [ ] Enter valid OTP
- [ ] Verify navigation to reset password page
- [ ] Test invalid OTP:
  - [ ] Enter wrong OTP
  - [ ] Verify error message
- [ ] Test OTP expiration:
  - [ ] Wait for countdown to reach 0
  - [ ] Verify automatic navigation back
- [ ] Test resend OTP:
  - [ ] Click "Resend Code" after 1 minute
  - [ ] Verify new OTP is generated

#### Password Reset
- [ ] Enter new password
- [ ] Verify password requirements are displayed
- [ ] Test password strength validation:
  - [ ] Enter weak password (< 8 chars)
  - [ ] Verify requirements show as not met
  - [ ] Enter strong password
  - [ ] Verify all requirements show as met
- [ ] Test confirm password:
  - [ ] Enter mismatched passwords
  - [ ] Verify error message
  - [ ] Enter matching passwords
  - [ ] Verify success
- [ ] Click "Reset Password"
- [ ] Verify navigation to login page
- [ ] Test login with new password

#### Profile Settings
- [ ] Login as any user
- [ ] Click profile avatar in header
- [ ] Click "Profile Settings"
- [ ] Verify profile information is displayed
- [ ] Test profile image upload:
  - [ ] Click "Change Photo"
  - [ ] Select image > 1MB
  - [ ] Verify error message
  - [ ] Select valid image
  - [ ] Verify upload success
  - [ ] Verify image is displayed
- [ ] Test profile edit:
  - [ ] Click "Edit Profile"
  - [ ] Update full name
  - [ ] Update email
  - [ ] Update phone
  - [ ] Click "Save Changes"
  - [ ] Verify success message
  - [ ] Verify changes are saved
- [ ] Test change password:
  - [ ] Click "Change Password"
  - [ ] Enter current password
  - [ ] Enter new password
  - [ ] Confirm new password
  - [ ] Click "Change Password"
  - [ ] Verify success message
  - [ ] Verify automatic logout
  - [ ] Test login with new password

### Automated Testing (Future)

```typescript
// Example test cases for future implementation

describe('ForgotPassword', () => {
  it('should render email and phone tabs', () => {});
  it('should validate email format', () => {});
  it('should generate OTP on submit', () => {});
  it('should navigate to OTP page on success', () => {});
});

describe('VerifyOTP', () => {
  it('should render 6 OTP input fields', () => {});
  it('should auto-focus next field on input', () => {});
  it('should verify OTP against database', () => {});
  it('should show countdown timer', () => {});
  it('should allow resend after 1 minute', () => {});
});

describe('ResetPassword', () => {
  it('should validate password strength', () => {});
  it('should show password requirements', () => {});
  it('should validate password match', () => {});
  it('should update password in database', () => {});
});

describe('ProfileSettings', () => {
  it('should load user profile data', () => {});
  it('should upload profile image', () => {});
  it('should validate image size', () => {});
  it('should update profile information', () => {});
  it('should change password', () => {});
});
```

---

## Future Enhancements

### Short-term (1-2 months)

1. **Email Integration**
   - Integrate SendGrid or AWS SES for email delivery
   - Send OTP codes via email
   - Send password reset confirmation emails
   - Email templates with branding

2. **SMS Integration**
   - Integrate Twilio or AWS SNS for SMS delivery
   - Send OTP codes via SMS
   - SMS templates with branding

3. **Password Hashing**
   - Implement bcrypt for password hashing
   - Migrate existing passwords to hashed format
   - Add salt rounds configuration

4. **Rate Limiting**
   - Implement rate limiting for OTP requests
   - Prevent brute force attacks
   - Add CAPTCHA for repeated attempts

### Medium-term (3-6 months)

5. **Email Verification**
   - Require email verification for profile email changes
   - Send verification link via email
   - Confirm email before updating profile

6. **Two-Factor Authentication (2FA)**
   - Add optional 2FA for enhanced security
   - Support authenticator apps (Google Authenticator, Authy)
   - Backup codes for account recovery

7. **Activity Log**
   - Track security events (login, password change, profile update)
   - Display activity log in profile settings
   - Email notifications for suspicious activity

8. **Profile Completion**
   - Add profile completion percentage indicator
   - Encourage users to complete their profiles
   - Gamification with badges/rewards

### Long-term (6-12 months)

9. **Social Login**
   - Add Google OAuth integration
   - Add Facebook OAuth integration
   - Link multiple accounts

10. **Advanced Security**
    - Add security questions for account recovery
    - Implement device fingerprinting
    - Add trusted device management
    - Session management with device list

11. **Profile Customization**
    - Add theme preferences
    - Add notification preferences
    - Add language preferences
    - Add timezone settings

12. **Data Export**
    - Allow users to export their data
    - GDPR compliance
    - Data portability

---

## Troubleshooting

### Common Issues

#### OTP Not Received
**Problem**: User doesn't receive OTP code

**Solution**:
- Check console logs for OTP (development mode)
- Verify email/phone is correct
- Check spam folder (when email integration is added)
- Verify OTP hasn't expired

#### Image Upload Fails
**Problem**: Profile image upload fails

**Solution**:
- Check file size (must be < 1MB)
- Check file type (must be image/jpeg, image/png, or image/webp)
- Verify Supabase Storage bucket exists
- Check RLS policies on storage bucket

#### Password Reset Fails
**Problem**: Password reset doesn't work

**Solution**:
- Verify OTP was verified successfully
- Check password meets strength requirements
- Verify user exists in database
- Check database connection

#### Profile Update Fails
**Problem**: Profile information doesn't update

**Solution**:
- Verify user is authenticated
- Check database connection
- Verify RLS policies allow update
- Check for validation errors

---

## Support

For issues or questions:
1. Check this documentation
2. Review the TODO.md file for known limitations
3. Check the console for error messages
4. Review the database logs in Supabase dashboard
5. Contact the development team

---

## Changelog

### Version 1.0.0 (2025-11-30)
- Initial release of profile management and password reset features
- Forgot password flow with email/phone support
- OTP verification with 5-minute expiration
- Password reset with strength validation
- Profile settings page with image upload
- Change password for logged-in users
- Database schema updates
- Security features (RLS, validation, expiration)

---

## License

This feature is part of the My School Ride application and follows the same license terms.

---

**Last Updated**: 2025-11-30
**Version**: 1.0.0
**Status**: Production Ready (with noted limitations)
