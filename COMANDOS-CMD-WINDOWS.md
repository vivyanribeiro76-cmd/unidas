# 🚀 Deploy FZ.IA - Comandos para CMD do Windows

## ⚠️ IMPORTANTE: Execute cada comando EXATAMENTE como está escrito

---

## PASSO 1: Conectar na VPS

Abra o **CMD** ou **PowerShell** e digite:

```cmd
ssh root@5.161.180.119
```

Pressione **Enter**.

---

### Vai aparecer uma mensagem perguntando sobre fingerprint

**Digite exatamente:** `yes` (tudo minúsculo) e pressione **Enter**

---

### Vai pedir a senha

**Digite:** `FgnKjNRhtapC` e pressione **Enter**

**OBS:** A senha não aparece na tela enquanto você digita (é normal).

---

## ✅ Você está conectado! Agora execute os comandos abaixo:

---

## PASSO 2: Atualizar sistema

```bash
apt update && apt upgrade -y
```

Pressione **Enter** e aguarde terminar (pode demorar alguns minutos).

---

## PASSO 3: Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
```

Pressione **Enter** e aguarde.

---

## PASSO 4: Instalar programas necessários

```bash
apt install -y nodejs nginx certbot python3-certbot-nginx git
```

Pressione **Enter** e aguarde.

---

## PASSO 5: Ir para pasta de projetos

```bash
cd /var/www
```

Pressione **Enter**.

---

## PASSO 6: Clonar o projeto do GitHub

```bash
git clone https://github.com/vivyanribeiro76-cmd/unidas.git fzia-duplicado
```

Pressione **Enter** e aguarde.

---

## PASSO 7: Entrar na pasta do projeto

```bash
cd fzia-duplicado
```

Pressione **Enter**.

---

## PASSO 8: Instalar dependências do projeto

```bash
npm install
```

Pressione **Enter** e aguarde (pode demorar 2-3 minutos).

---

## PASSO 9: Criar arquivo de configuração

**Cole TODO este bloco de uma vez** e pressione **Enter**:

```bash
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://aopbzryufcpsawaweico.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvcGJ6cnl1ZmNwc2F3YXdlaWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxODY1MTQsImV4cCI6MjA0NDc2MjUxNH0.xqtY8VZ9kQxJZqK0YqKZqK0YqKZqK0YqKZqK0YqKZqK0
EOF
```

---

## PASSO 10: Criar tabelas no banco de dados

```bash
node scripts/create-all-tables-duplicado.mjs
```

Pressione **Enter** e aguarde. Deve aparecer mensagens de sucesso.

---

## PASSO 11: Fazer build do projeto

```bash
npm run build
```

Pressione **Enter** e aguarde (pode demorar 1-2 minutos).

---

## PASSO 12: Configurar servidor web (Nginx)

**Cole TODO este bloco de uma vez** e pressione **Enter**:

```bash
cat > /etc/nginx/sites-available/fzia-duplicado << 'EOF'
server {
    listen 80;
    server_name unidas.zprofzia.com;

    root /var/www/fzia-duplicado/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
EOF
```

---

## PASSO 13: Ativar o site

```bash
ln -s /etc/nginx/sites-available/fzia-duplicado /etc/nginx/sites-enabled/
```

Pressione **Enter**.

---

## PASSO 14: Remover site padrão

```bash
rm -f /etc/nginx/sites-enabled/default
```

Pressione **Enter**.

---

## PASSO 15: Testar configuração do Nginx

```bash
nginx -t
```

Pressione **Enter**.

**Deve aparecer:** "test is successful"

---

## PASSO 16: Reiniciar Nginx

```bash
systemctl restart nginx
```

Pressione **Enter**.

---

## PASSO 17: Testar no navegador (HTTP)

Abra o navegador e acesse:

```
http://unidas.zprofzia.com
```

**Login:**
- Email: `admin@fzia.com`
- Senha: `admin123`

**Se funcionar, continue para instalar HTTPS (SSL).**

---

## PASSO 18: Instalar certificado SSL (HTTPS)

```bash
certbot --nginx -d unidas.zprofzia.com
```

Pressione **Enter**.

**Vai fazer algumas perguntas:**

1. **Digite seu email** e pressione Enter
2. **Digite:** `Y` e pressione Enter (aceitar termos)
3. **Digite:** `N` e pressione Enter (não compartilhar email)
4. **Digite:** `2` e pressione Enter (redirecionar HTTP para HTTPS)

---

## ✅ PRONTO! Acesse:

```
https://unidas.zprofzia.com
```

**Login:**
- Email: `admin@fzia.com`
- Senha: `admin123`

---

## 🔐 IMPORTANTE - Segurança

Depois de fazer login pela primeira vez:

1. Clique em **"Alterar Senha"**
2. Troque `admin123` por uma senha forte

---

## 🆘 Se der erro em algum passo:

**Me envie:**
1. Qual passo deu erro
2. Print ou cópia da mensagem de erro

---

## 📝 Resumo do que você fez:

1. ✅ Conectou na VPS via SSH
2. ✅ Instalou Node.js, Nginx, Certbot
3. ✅ Clonou o projeto do GitHub
4. ✅ Instalou dependências
5. ✅ Configurou variáveis de ambiente
6. ✅ Criou tabelas no Supabase
7. ✅ Fez build do projeto
8. ✅ Configurou Nginx
9. ✅ Instalou SSL/HTTPS
10. ✅ Projeto online!

---

**Seu projeto está em:** https://unidas.zprofzia.com 🎉
