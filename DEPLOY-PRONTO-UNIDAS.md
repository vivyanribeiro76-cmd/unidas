# 🚀 Deploy FZ.IA Duplicado - Comandos Prontos

## 📋 Suas Credenciais:

- **IP VPS:** 5.161.180.119
- **Usuário:** root
- **Domínio:** unidas.zprofzia.com
- **Repositório:** https://github.com/vivyanribeiro76-cmd/unidas.git

---

## ✅ PASSO 1: Configurar DNS (FAÇA PRIMEIRO!)

No painel do seu domínio (onde você tirou o print):

```
Tipo: A
Nome: unidas
Valor: 5.161.180.119
TTL: 1/2 hora
```

**Salve e aguarde 15-30 minutos para propagar.**

---

## ✅ PASSO 2: Conectar na VPS

Abra o **CMD ou PowerShell** no Windows e execute:

```bash
ssh root@5.161.180.119
```

Quando pedir a senha, digite:
```
FgnKjNRhtapC
```

---

## ✅ PASSO 3: Instalar Dependências

Cole estes comandos **um por vez** (aguarde cada um terminar):

```bash
apt update && apt upgrade -y
```

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
```

```bash
apt install -y nodejs nginx certbot python3-certbot-nginx git
```

---

## ✅ PASSO 4: Clonar o Projeto

```bash
cd /var/www
```

```bash
git clone https://github.com/vivyanribeiro76-cmd/unidas.git fzia-duplicado
```

```bash
cd fzia-duplicado
```

---

## ✅ PASSO 5: Instalar Dependências do Projeto

```bash
npm install
```

---

## ✅ PASSO 6: Criar Arquivo de Ambiente

```bash
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://aopbzryufcpsawaweico.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvcGJ6cnl1ZmNwc2F3YXdlaWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxODY1MTQsImV4cCI6MjA0NDc2MjUxNH0.xqtY8VZ9kQxJZqK0YqKZqK0YqKZqK0YqKZqK0YqKZqK0
EOF
```

---

## ✅ PASSO 7: Criar Tabelas no Supabase

```bash
node scripts/create-all-tables-duplicado.mjs
```

**Isso criará:**
- Tabelas: users_duplicado, contabilizacao_duplicado, etc
- Usuário admin: admin@fzia.com / admin123

---

## ✅ PASSO 8: Build do Projeto

```bash
npm run build
```

---

## ✅ PASSO 9: Configurar Nginx

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

## ✅ PASSO 10: Ativar Site no Nginx

```bash
ln -s /etc/nginx/sites-available/fzia-duplicado /etc/nginx/sites-enabled/
```

```bash
rm -f /etc/nginx/sites-enabled/default
```

```bash
nginx -t
```

Se aparecer **"test is successful"**, continue:

```bash
systemctl restart nginx
```

---

## ✅ PASSO 11: Testar (HTTP)

Abra o navegador e acesse:

```
http://unidas.zprofzia.com
```

**Login:**
- Email: admin@fzia.com
- Senha: admin123

**Se funcionar, continue para instalar SSL (HTTPS).**

---

## ✅ PASSO 12: Instalar SSL (HTTPS)

```bash
certbot --nginx -d unidas.zprofzia.com
```

**Responda:**
1. Email: Digite seu email
2. Termos: `Y` (aceitar)
3. Compartilhar email: `N` (não)
4. Redirect HTTP para HTTPS: `2` (sim, redirecionar)

---

## ✅ PASSO 13: Acessar com HTTPS

```
https://unidas.zprofzia.com
```

**Login:**
- Email: admin@fzia.com
- Senha: admin123

---

## 🎉 PRONTO! SEU PROJETO ESTÁ ONLINE!

**URL:** https://unidas.zprofzia.com

---

## 🔄 Atualizações Futuras

Quando fizer alterações no código:

```bash
ssh root@5.161.180.119
cd /var/www/fzia-duplicado
git pull origin main
npm install
npm run build
systemctl restart nginx
```

---

## 🔐 Segurança (IMPORTANTE!)

Após colocar online:

1. **Altere a senha do admin:**
   - Acesse https://unidas.zprofzia.com
   - Vá em "Alterar Senha"
   - Troque admin123 por uma senha forte

2. **Configure firewall:**
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

---

## 🆘 Problemas?

### DNS não propagou ainda
```bash
ping unidas.zprofzia.com
```
Se não retornar `5.161.180.119`, aguarde mais um pouco.

### Erro 502 Bad Gateway
```bash
systemctl status nginx
tail -f /var/log/nginx/error.log
```

### Página em branco
```bash
ls -la /var/www/fzia-duplicado/dist
npm run build
```

---

**Qualquer problema, me avise!** 🚀
