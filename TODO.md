# TODO: Implement Login Authentication with Database and Session Persistence

## Backend Changes
- [ ] Install cookie-parser dependency
- [ ] Update server.js: Add cookie-parser middleware, create auth middleware for protecting routes
- [ ] Update authController.js: Modify login to set httpOnly cookie with JWT
- [ ] Add logout route in authRoutes.js and controller to clear cookie
- [ ] Add verify route to check if user is logged in via cookie

## Frontend Changes
- [ ] Update public/index.html: Add form tag, IDs to inputs, event listener for login
- [ ] Update public/js/script.js: Fix selectors, add fetch to login API, handle response, redirect on success
- [ ] Add auth check JS to protected pages (dashboard.html, home.html, stats.html, records.html, client.html): On load, verify login, redirect if not
- [ ] Add logout functionality: On logout link click, call logout API, redirect to login

## Testing
- [ ] Test login with admin credentials
- [ ] Test persistence on page refresh
- [ ] Test access to protected pages without login
- [ ] Test logout
