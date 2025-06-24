#!/bin/sh

if [ ! "$#" -ge 1 ]; then
  echo "\n🚫 Você precisa enviar ao menos um argumento.\n"
  exit 1
fi

echo "\n"
echo "⚙️ Executando \`git add .\`"
git add .
echo "⚙️ Executando \`git commit -m {$1}\`"
git commit -m \"$1\"
echo "⚙️ Executando \`git add .\`"
git add .
echo "⚙️ Executando \`git commit --amend --no-edit\`"
git commit --amend --no-edit
echo "✅ Executando \`git push\`"
echo "\n"
