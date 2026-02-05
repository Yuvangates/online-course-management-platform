# Student CSS Migration Guide

## ✅ Migration Complete!

All student-related CSS files have been successfully moved from the root `styles` folder to the new `styles/student` subfolder.

---

## 📁 New Structure

```
src/styles/
├── student/                          ← NEW FOLDER
│   ├── student-variables.css         (Design system variables)
│   ├── student-common.css            (Shared utilities & base styles)
│   ├── student-dashboard.css         (StudentDashboard page)
│   ├── course-search.css             (CourseSearch page)
│   ├── course-view.css               (CourseView page)
│   ├── enrolled-courses.css          (EnrolledCourses page)
│   └── student-profile.css           (Profile page)
├── auth.css                          (Keep)
├── dashboard.css                     (Keep)
├── landing.css                       (Keep)
├── main.css                          (Keep)
├── navbar.css                        (Keep)
└── courses.css                       (Keep)
```

---

## 📝 Updated Imports

All student page components have been updated with new import paths:

### StudentDashboard.jsx
```jsx
// OLD: import '../../styles/student-dashboard.css';
// NEW:
import '../../styles/student/student-dashboard.css';
```

### CourseSearch.jsx
```jsx
// OLD: import '../../styles/course-search.css';
// NEW:
import '../../styles/student/course-search.css';
```

### CourseView.jsx
```jsx
// OLD: import '../../styles/course-view.css';
// NEW:
import '../../styles/student/course-view.css';
```

### EnrolledCourses.jsx
```jsx
// OLD: import '../../styles/enrolled-courses.css';
// NEW:
import '../../styles/student/enrolled-courses.css';
```

### Profile.jsx
```jsx
// OLD: import '../../styles/student-profile.css';
// NEW:
import '../../styles/student/student-profile.css';
```

---

## 🗑️ OLD FILES TO DELETE

Delete these files from `src/styles/` (they are now in `src/styles/student/`):

```
❌ src/styles/student-variables.css
❌ src/styles/student-common.css
❌ src/styles/student-dashboard.css
❌ src/styles/course-search.css
❌ src/styles/course-view.css
❌ src/styles/enrolled-courses.css
❌ src/styles/student-profile.css
```

### Also Note:
```
⚠️  src/styles/student.css  (If this file exists and is not being used, you can delete it too)
```

---

## How to Delete the Files

### Option 1: Using VS Code
1. Open the file explorer
2. Navigate to `src/styles/`
3. Right-click each file listed above
4. Click "Delete"

### Option 2: Using Terminal (PowerShell)
```powershell
# Navigate to styles folder
cd "c:\sri charan\study\sem 6\DBMS lab\Online-Course-Management-Platform\frontend\src\styles"

# Delete all old student CSS files
Remove-Item "student-variables.css"
Remove-Item "student-common.css"
Remove-Item "student-dashboard.css"
Remove-Item "course-search.css"
Remove-Item "course-view.css"
Remove-Item "enrolled-courses.css"
Remove-Item "student-profile.css"

# Optional: Delete student.css if not used elsewhere
Remove-Item "student.css" -ErrorAction SilentlyContinue
```

### Option 3: Using File Explorer
1. Open Windows File Explorer
2. Navigate to: `C:\sri charan\study\sem 6\DBMS lab\Online-Course-Management-Platform\frontend\src\styles`
3. Select the files listed above (Ctrl+Click to multi-select)
4. Press Delete or right-click → Delete

---

## ✨ Benefits of This Organization

1. **Better File Organization**: Student CSS is now isolated in its own folder
2. **Easier Maintenance**: Related styles are grouped together
3. **Cleaner Structure**: Root `styles` folder is less cluttered
4. **Scalability**: Easy to add more role-based folders (instructor, admin, etc.)
5. **Modularity**: Each page's styles are self-contained

---

## 📋 File Import Chain

The new import structure follows this chain:

```
Page Component (e.g., StudentDashboard.jsx)
    ↓
page-specific.css (e.g., student-dashboard.css)
    ↓
@import './student-common.css'
    ↓
@import './student-variables.css'
```

This ensures all files have access to design variables and utility classes.

---

## ✅ Verification Checklist

After completing the deletion:

- [ ] All 7 files have been moved to `src/styles/student/`
- [ ] All 5 component imports have been updated
- [ ] Old CSS files (7 files) have been deleted from `src/styles/`
- [ ] `npm run dev` runs without errors
- [ ] Student pages load styling correctly
- [ ] No CSS is broken or missing

---

## 🔍 Quick Reference

| File | Location | Component |
|------|----------|-----------|
| student-variables.css | `src/styles/student/` | N/A (imported by student-common.css) |
| student-common.css | `src/styles/student/` | N/A (imported by all page styles) |
| student-dashboard.css | `src/styles/student/` | StudentDashboard.jsx |
| course-search.css | `src/styles/student/` | CourseSearch.jsx |
| course-view.css | `src/styles/student/` | CourseView.jsx |
| enrolled-courses.css | `src/styles/student/` | EnrolledCourses.jsx |
| student-profile.css | `src/styles/student/` | Profile.jsx |

---

## 🚀 Next Steps

1. Delete the old files from `src/styles/`
2. Run `npm run dev` to ensure everything works
3. Test all student pages to verify styling is intact
4. (Optional) Apply the same pattern to admin, instructor, and analyst CSS files if desired

---

## 📌 Notes

- **All imports updated**: ✅ Done
- **New folder created**: ✅ Done
- **Files copied**: ✅ Done
- **Remaining task**: Delete old files (7 files)

Once you delete the old files, the migration will be complete!
