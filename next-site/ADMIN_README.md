# Admin System for Nazeefa Ahmed Website

## Overview

A comprehensive content management system has been added to allow easy management of articles and photos on the website without needing to edit code.

## Features

### 🔐 Authentication
- Secure login system with JWT tokens
- Session management with HTTP-only cookies
- Default credentials: `nazeefa` / `admin123`

### 📝 Article Management
- **Add new articles** with title, URL, outlet, and year
- **Edit existing articles** inline
- **Delete articles** with confirmation
- **Drag & drop reordering** to change display order
- **Real-time preview** of changes

### 📸 Photo Management
- **Add new photos** via URL input
- **Delete photos** with confirmation
- **Drag & drop reordering** to change gallery order
- **Live preview** when adding images
- **Responsive grid layout**

## Getting Started

### 1. Access the Admin Panel
```
http://localhost:3001/admin
```

### 2. Login
- **Username:** `nazeefa`
- **Password:** `admin123`

### 3. Manage Content
- Click **Articles** tab to manage featured work
- Click **Photos** tab to manage the photography gallery
- Use drag & drop to reorder items
- Click **Save Order** after reordering

## Admin Panel Structure

```
/admin/
├── login/          # Login page
└── dashboard/      # Main admin interface
    ├── Articles    # Article management tab
    └── Photos      # Photo management tab
```

## API Endpoints

### Authentication
- `POST /api/admin/login` - Login with credentials
- `POST /api/admin/logout` - Logout and clear session

### Articles
- `GET /api/admin/articles` - Get all articles
- `POST /api/admin/articles` - Create new article
- `PUT /api/admin/articles` - Update existing article
- `DELETE /api/admin/articles?id={id}` - Delete article
- `POST /api/admin/articles/reorder` - Reorder articles

### Photos
- `GET /api/admin/photos` - Get all photos
- `POST /api/admin/photos` - Add new photo
- `DELETE /api/admin/photos?id={id}` - Delete photo
- `POST /api/admin/photos/reorder` - Reorder photos

## Data Storage

Content is stored in JSON files in the `/data` directory:
- `articles.json` - Featured articles
- `photos.json` - Photography gallery

## Security Features

- **JWT Authentication** - Secure token-based auth
- **HTTP-only Cookies** - Prevents XSS attacks
- **Request Validation** - All inputs are validated
- **CSRF Protection** - Same-site cookie policy

## Production Setup

### 1. Change Default Credentials
Set environment variables:
```bash
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
```

### 2. Secure the Admin Area
- Use HTTPS in production
- Consider IP whitelisting
- Regular password updates
- Monitor access logs

## Technical Details

### Built With
- **Next.js 15** - React framework
- **React DnD** - Drag and drop functionality
- **Heroicons** - UI icons
- **Tailwind CSS** - Styling
- **JSON Web Tokens** - Authentication
- **bcryptjs** - Password hashing

### File Structure
```
lib/
├── auth.js         # Authentication utilities
└── dataStore.js    # Data management

app/api/admin/
├── login/route.js    # Login endpoint
├── logout/route.js   # Logout endpoint
├── articles/
│   ├── route.js      # Article CRUD
│   └── reorder/route.js
└── photos/
    ├── route.js      # Photo CRUD
    └── reorder/route.js

components/admin/
├── ArticleManager.jsx  # Article management UI
└── PhotoManager.jsx    # Photo management UI
```

## Usage Examples

### Adding a New Article
1. Go to Admin Dashboard → Articles
2. Click "Add Article"
3. Fill in the form:
   - **Title:** Article headline
   - **URL:** Link to the published article
   - **Outlet:** Publication name (e.g., "Science Magazine")
   - **Year:** Publication year
4. Click "Add Article"

### Reordering Content
1. Drag and drop items in the desired order
2. Click "Save Order" to persist changes
3. Changes appear immediately on the main website

### Adding Photos
1. Go to Admin Dashboard → Photos
2. Click "Add Photo"
3. Enter the image URL
4. Adjust alt text if needed
5. Preview the image
6. Click "Add Photo"

## Troubleshooting

### Can't Login
- Check credentials (default: nazeefa/admin123)
- Clear browser cookies
- Check console for errors

### Changes Not Appearing
- Click "Save Order" after reordering
- Refresh the main website
- Check browser cache

### Images Not Loading
- Verify image URLs are accessible
- Check image formats (jpg, png, webp)
- Ensure HTTPS for secure contexts

## Support

For technical issues or questions, check:
1. Browser console for JavaScript errors
2. Terminal output for server errors
3. Network tab for API request failures

The admin system is designed to be intuitive and user-friendly while maintaining security and performance.