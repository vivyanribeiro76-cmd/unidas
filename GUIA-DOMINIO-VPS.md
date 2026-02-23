# 🌐 Guia Completo: Colocar FZ.IA Duplicado Online com Domínio

Este guia mostra **PASSO A PASSO** como deixar seu projeto acessível na internet com um domínio ou subdomínio.

---

## 📋 O que você precisa ter:

1. ✅ Uma VPS (servidor) contratada (ex: DigitalOcean, AWS, Hostinger, etc)
2. ✅ Um domínio registrado (ex: `seudominio.com`) OU acesso ao painel do domínio
3. ✅ Acesso SSH à VPS (usuário e senha ou chave SSH)
4. ✅ IP da VPS (exemplo: `123.45.67.89`)

---

## 🎯 Resultado Final:

Seu projeto estará acessível em:
- `https://dashboard.seudominio.com` (com subdomínio)
- OU `https://seudominio.com` (domínio principal)

---

# 🚀 PASSO A PASSO COMPLETO

## PARTE 1: Configurar DNS (Apontar domínio para VPS)

### Opção A: Usar SUBDOMÍNIO (Recomendado)

**Exemplo:** `dashboard.seudominio.com`

1. **Acesse o painel do seu provedor de domínio** (Registro.br, GoDaddy, Hostinger, etc)

2. **Vá em "Gerenciar DNS" ou "DNS Settings"**

3. **Adicione um registro tipo A:**
   ```
   Tipo: A
   Nome/Host: dashboard
   Valor/IP: 123.45.67.89 (IP da sua VPS)
   TTL: 3600 (ou deixe padrão)
   ```

4. **Salve as alterações**

5. **Aguarde propagação** (5 minutos a 48 horas, geralmente 15-30 min)

### Opção B: Usar DOMÍNIO PRINCIPAL

**Exemplo:** `seudominio.com`

1. **Acesse o painel do seu provedor de domínio**

2. **Vá em "Gerenciar DNS"**

3. **Adicione/Edite o registro tipo A:**
   ```
   Tipo: A
   Nome/Host: @ (ou deixe vazio)
   Valor/IP: 123.45.67.89 (IP da sua VPS)
   TTL: 3600
   ```

4. **Adicione também o registro para www:**
   ```
   Tipo: A
   Nome/Host: www
   Valor/IP: 123.45.67.89
   TTL: 3600
   ```

5. **Salve e aguarde propagação**

---

## PARTE 2: Conectar na VPS e Preparar Ambiente

### 1. Conectar via SSH (no CMD/PowerShell do Windows)

```bash
ssh root@123.45.67.89
# Digite a senha quando solicitado
```

### 2. Atualizar sistema e instalar dependências

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Nginx
sudo apt install -y nginx

# Instalar Certbot (para SSL)
sudo apt install -y certbot python3-certbot-nginx

# Instalar Git
sudo apt install -y git
```

---

## PARTE 3: Fazer Deploy do Projeto

### 1. Clonar o repositório

```bash
cd /var/www
git clone https://github.com/vivyanribeiro76-cmd/unidas.git fzia-duplicado
cd fzia-duplicado
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar arquivo de ambiente (.env.local)

```bash
nano .env.local
```

**Cole este conteúdo:**
```env
VITE_SUPABASE_URL=https://aopbzryufcpsawaweico.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvcGJ6cnl1ZmNwc2F3YXdlaWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxODY1MTQsImV4cCI6MjA0NDc2MjUxNH0.xqtY8VZ9kQxJZqK0YqKZqK0YqKZqK0YqKZqK0YqKZqK0
```

**Salvar:** `Ctrl+O`, Enter, `Ctrl+X`

### 4. Criar tabelas no Supabase

```bash
node scripts/create-all-tables-duplicado.mjs
```

**Isso criará:**
- Tabelas: `users_duplicado`, `contabilizacao_duplicado`, etc
- Usuário admin: `admin@fzia.com` / `admin123`

### 5. Build do projeto

```bash
npm run build
```

Isso cria a pasta `dist/` com os arquivos otimizados.

---

## PARTE 4: Configurar Nginx com Domínio

### 1. Criar arquivo de configuração do Nginx

```bash
sudo nano /etc/nginx/sites-available/fzia-duplicado
```

### 2. Cole esta configuração:

**Se usar SUBDOMÍNIO (dashboard.seudominio.com):**

```nginx
server {
    listen 80;
    server_name dashboard.seudominio.com;

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
```

**Se usar DOMÍNIO PRINCIPAL (seudominio.com):**

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

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
```

**⚠️ IMPORTANTE:** Substitua `dashboard.seudominio.com` ou `seudominio.com` pelo SEU domínio real!

**Salvar:** `Ctrl+O`, Enter, `Ctrl+X`

### 3. Ativar o site

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/fzia-duplicado /etc/nginx/sites-enabled/

# Remover site padrão (opcional)
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Se aparecer "test is successful", reinicie o Nginx
sudo systemctl restart nginx
```

---

## PARTE 5: Configurar SSL/HTTPS (Certificado Grátis)

### 1. Obter certificado SSL com Certbot

**Para SUBDOMÍNIO:**
```bash
sudo certbot --nginx -d dashboard.seudominio.com
```

**Para DOMÍNIO PRINCIPAL:**
```bash
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

### 2. Responda as perguntas:

- **Email:** Digite seu email
- **Termos:** Digite `Y` (aceitar)
- **Compartilhar email:** Digite `N` (não compartilhar)
- **Redirect HTTP para HTTPS:** Digite `2` (redirecionar)

### 3. Pronto! O Certbot configurará tudo automaticamente.

### 4. Renovação automática

O Certbot já configura renovação automática. Para testar:

```bash
sudo certbot renew --dry-run
```

---

## ✅ VERIFICAR SE ESTÁ FUNCIONANDO

### 1. Teste o DNS

No CMD do Windows:
```bash
ping dashboard.seudominio.com
```

Deve retornar o IP da sua VPS.

### 2. Acesse no navegador

- **HTTP:** `http://dashboard.seudominio.com`
- **HTTPS:** `https://dashboard.seudominio.com` (após configurar SSL)

### 3. Faça login

- Email: `admin@fzia.com`
- Senha: `admin123`

---

## 🔄 ATUALIZAÇÕES FUTURAS

Quando fizer alterações no código:

```bash
# Conectar na VPS
ssh root@ip-da-vps

# Ir para o projeto
cd /var/www/fzia-duplicado

# Puxar alterações
git pull origin main

# Instalar novas dependências (se houver)
npm install

# Rebuild
npm run build

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## 🆘 PROBLEMAS COMUNS

### Domínio não aponta para VPS
- Verifique se o DNS foi configurado corretamente
- Aguarde até 48h para propagação completa
- Teste com: `ping seudominio.com`

### Erro 502 Bad Gateway
```bash
# Verificar status do Nginx
sudo systemctl status nginx

# Ver logs de erro
sudo tail -f /var/log/nginx/error.log

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Página em branco
```bash
# Verificar se o build existe
ls -la /var/www/fzia-duplicado/dist

# Refazer build
cd /var/www/fzia-duplicado
npm run build

# Verificar permissões
sudo chown -R www-data:www-data /var/www/fzia-duplicado/dist
```

### SSL não funciona
```bash
# Verificar certificados
sudo certbot certificates

# Renovar manualmente
sudo certbot renew

# Verificar configuração do Nginx
sudo nginx -t
```

### Não consegue fazer login
```bash
# Verificar se as tabelas foram criadas
cd /var/www/fzia-duplicado
node scripts/create-all-tables-duplicado.mjs
```

---

## 📊 RESUMO DO QUE VOCÊ FEZ

1. ✅ Configurou DNS (apontou domínio para VPS)
2. ✅ Instalou dependências na VPS (Node.js, Nginx, Certbot)
3. ✅ Clonou o projeto do GitHub
4. ✅ Configurou variáveis de ambiente (.env.local)
5. ✅ Criou tabelas no Supabase
6. ✅ Fez build do projeto
7. ✅ Configurou Nginx com seu domínio
8. ✅ Instalou certificado SSL (HTTPS)
9. ✅ Projeto online e acessível!

---

## 🔐 SEGURANÇA

Após colocar online:

1. **Altere a senha do admin:**
   - Acesse o sistema
   - Vá em "Alterar Senha"
   - Troque `admin123` por uma senha forte

2. **Configure firewall:**
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

3. **Mantenha atualizado:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## 📞 SUPORTE

Se tiver problemas:
1. Verifique os logs do Nginx: `sudo tail -f /var/log/nginx/error.log`
2. Verifique o console do navegador (F12)
3. Verifique se as tabelas existem no Supabase Dashboard
4. Teste o DNS: `ping seudominio.com`

---

**Seu projeto está ONLINE! 🎉**

Acesse: `https://dashboard.seudominio.com` (ou seu domínio configurado)
