# 🚀 Quick Start: Blog Integration Testing

## 30-Second Start

```bash
# Terminal 1: Start backend
npm run server:dev

# Terminal 2: Run quick test
node .kiro/specs/blog-database-integration/quick-test.js

# Terminal 3: Start frontend
npm run dev
```

Then visit: **http://localhost:5173/blog**

---

## 📋 Testing Resources

| What | Where | Use For |
|------|-------|---------|
| **Quick API Test** | `quick-test.js` | Verify API works (30 seconds) |
| **Testing Checklist** | `TESTING_CHECKLIST.md` | Track your progress |
| **Full Testing Guide** | `MANUAL_TESTING_GUIDE.md` | Detailed instructions |
| **Testing Summary** | `TASK_11_TESTING_SUMMARY.md` | Overview & tips |

---

## ✅ 5-Minute Quick Test

### 1. Verify API (1 min)
```bash
node .kiro/specs/blog-database-integration/quick-test.js
```
Expected: All tests pass ✅

### 2. Check Blog List (2 min)
- Visit: http://localhost:5173/blog
- ✅ Articles display
- ✅ Search works
- ✅ Category filter works

### 3. Check Article Detail (2 min)
- Click any article
- ✅ Full content displays
- ✅ Related articles show
- ✅ View count increments

---

## 🎯 Critical Tests

Must verify these work:

1. ✅ **Articles Load** - Blog list shows articles from database
2. ✅ **Search Works** - Can search and find articles
3. ✅ **Article Opens** - Can read full article
4. ✅ **Error Handling** - Shows error when backend is offline
5. ✅ **Mobile Works** - Responsive on mobile devices

---

## 🐛 Quick Troubleshooting

### Articles Not Loading?
```bash
# Check backend is running
curl http://localhost:3001/api/blog/articles

# Check frontend env
cat .env | grep VITE_API_URL
```

### CORS Error?
Check `.env` has:
```
FRONTEND_URL=http://localhost:5173
```

### No Articles?
Create one in admin panel:
http://localhost:5173/admin/blog

---

## 📊 Test Status

Track your testing:

- [ ] Quick API test passed
- [ ] Blog list works
- [ ] Search works
- [ ] Category filter works
- [ ] Article detail works
- [ ] Error handling works
- [ ] Mobile responsive

---

## 🎓 Full Testing

For comprehensive testing:

1. Open `TESTING_CHECKLIST.md`
2. Follow each section
3. Check off completed items
4. Document any issues

---

## 💡 Pro Tips

- Run `quick-test.js` before each testing session
- Use Chrome DevTools Network tab to debug
- Test with DevTools throttling for slow network
- Check browser console for errors
- Test in multiple browsers

---

## 📞 Need Help?

1. Check `TASK_11_TESTING_SUMMARY.md` for common issues
2. Review `MANUAL_TESTING_GUIDE.md` for detailed steps
3. Check server logs: `tail -f logs/combined.log`
4. Check browser console for frontend errors

---

## ✨ Success Looks Like

- ✅ Blog list loads articles from database
- ✅ Can search and filter articles
- ✅ Can read full articles
- ✅ View count increments
- ✅ Related articles display
- ✅ Error messages are friendly
- ✅ Works on mobile

---

**Ready to test?** Start with the quick test script! 🚀

```bash
node .kiro/specs/blog-database-integration/quick-test.js
```
