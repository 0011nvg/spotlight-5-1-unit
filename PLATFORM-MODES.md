# Spotlight 5 · Student and Teacher modes

The same Student / Teacher control is available in Module 1, Module 2 missions, Module 2 Studio, Spider Mission, Module 3 and worksheets. Student is the default on a new browser. Mode selection is shared between pages and tabs on the same origin.

Student mode shows learner instructions, examples, language practice and feedback. Teacher mode adds learning goals, Teacher's Notes, tutor role cards, read-aloud scripts, coverage guides, print keys and teaching tools. Teacher notes are removed from the active Student DOM, rather than simply appearing as collapsed answers. This is a presentation feature, not authentication.

## Static hosting and source visibility

GitHub Pages and the public repository remain in use. Answer checking runs in the browser. Answer keys and teaching content are consequently available in the source code. Student / Teacher is not a password gate, an exam security measure or a permission boundary. This limitation was explicitly accepted for this deployment. Do not put confidential information or credentials in lesson files.

Closed answers in the Have lesson require two checks in Student mode. Teacher mode can show keys immediately. Learning examples, vocabulary meanings and open speaking models remain available because they are part of instruction, not secret exam answers. The original two-attempt flow in Module 2 remains available.

## Progress and reuse with different learners

Progress stays local to the browser. Module 3 uses a neutral storage key and imports the legacy key to preserve existing progress; the legacy identifier is not displayed. Generated stored prompts are migrated, while personal writing drafts are preserved verbatim. Mode selection is independent of imported student progress.

Use the existing confirmed New student / Reset all flow when changing learners on a shared device. It clears course progress, including Module 3 and Spider Mission; it preserves the display mode and does not touch unrelated browser data. Module 3's My Cabin reset is explicitly limited to that module. Export any learner's progress before resetting.

## Developer checks

The deployed site remains static, with no framework conversion or production dependencies. `package.json` contains development-only tests. With Node.js and npm installed:

```sh
npm install
npm test
```

The tests check 115 Have-lesson answers and interactions, render 528 activity/mode combinations, verify all major page entries, teacher-note separation, basic role transitions, and migration of stored progress. Browser checks additionally cover 390px, 768px and 1280px viewports. These are not a certification of screen-reader compliance or of every possible browser configuration.
