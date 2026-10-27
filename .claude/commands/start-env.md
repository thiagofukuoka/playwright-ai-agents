---
description: Inicia o site de prática (npm start) na porta 3001, se ainda não estiver rodando
---
Inicie o ambiente de testes local (site de prática HourToLearn).

1. Verifique se já existe algo escutando na porta 3001, por exemplo com
   `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/` (via Bash).
   - Se responder, informe que o serviço já está rodando em http://localhost:3001 e pare aqui.
2. Se não estiver rodando, execute `npm start` no diretório
   `C:\Users\thiag\Desktop\playwright-ai-agents\sample\hourtolearn-practice-site`
   usando `run_in_background: true` (o servidor não termina sozinho).
3. Confirme que subiu repetindo a verificação da porta 3001 e informe o resultado.
   Se falhar, mostre o erro da saída do processo.
