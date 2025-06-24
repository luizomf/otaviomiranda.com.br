#!/bin/sh

if [ ! "$#" -ge 1 ]; then
  echo "\n🚫 Você precisa enviar ao menos um argumento.\n"
  exit 1
fi



echo "\n"
echo "🐍 Executando \`python generate_sitemap.py\`"
python generate_sitemap.py
sleep 1

echo "⚙️ Executando \`git add .\`"
git add .
sleep 1

echo "⚙️ Executando \`git commit -m \"$1\"\`"
git commit -m "$1"
sleep 1

echo "⚙️ Executando \`git add .\`"
git add .
sleep 1

echo "⚙️ Executando \`git commit --amend --no-edit\`"
git commit --amend --no-edit
sleep 1

echo "✅ Executando \`git push\`"
git push
sleep 1

echo "\n"
