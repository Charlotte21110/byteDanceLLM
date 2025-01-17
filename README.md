# node版本
node 18.18.0
# 运行
``` cmd

npm install -g pnpm
pnpm i
npm run dev
```
# 开发
需切换到develop分支开发，在此分支提代码，不允许直接提交到master分支
执行命令
``` cmd
git checkout develop
git pull origin develop
```
# 提交
在develop分支上提交代码（不要提交pacckage.json，pnpm-lock.yaml）
提交格式：
feat: xxx (xxx为新增功能描述)
fix: xxx (xxx为修复bug描述)
``` cmd
git add .
git commit -m "xxx"
git push origin develop
```