echo off
cls
npm run build && git add . && git commit -m updated && git push -u origin main