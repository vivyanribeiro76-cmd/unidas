# 🔄 MIGRAÇÃO PARA NOVA VPS - GUIA PERSONALIZADO

## 📡 DADOS DA NOVA VPS
- **IP**: 147.79.106.55
- **Usuário**: root
- **Senha**: p2dMf@Hr67O674+vZ?1i
- **Domínio**: metricai.fzia.store (mesmo)

---

## 🚀 PASSO A PASSO

### **PASSO 1: CONECTAR NA NOVA VPS**

**Abrir PuTTY:**
1. Host Name: `147.79.106.55`
2. Port: `22`
3. Clique "Open"
4. Login: `root`
5. Password: `p2dMf@Hr67O674+vZ?1i`

---

### **PASSO 2: PREPARAR AMBIENTE**

Cole os comandos abaixo **um por um**:

```bash
# 1. Atualizar sistema
apt update && apt upgrade -y

# 2. Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 3. Instalar Nginx
apt install -y nginx

# 4. Instalar Git
apt install -y git

# 5. Instalar Certbot (SSL)
apt install -y certbot python3-certbot-nginx

# 6. Verificar instalações
node --version
npm --version
nginx -v
```

**Aguarde:** Cada comando pode demorar 1-3 minutos.

---

### **PASSO 3: CLONAR PROJETO DO GITHUB**

```bash
# 1. Criar diretório
mkdir -p /var/www
cd /var/www

# 2. Clonar repositório
git clone https://github.com/vivyanribeiro76-cmd/novo.git metricai-fzia

# 3. Entrar na pasta
cd metricai-fzia

# 4. Mudar para branch correta
git checkout metricai-config-personalizacao

# 5. Instalar dependências
npm install
```

**Aguarde:** `npm install` pode demorar 2-5 minutos.

---

### **PASSO 4: CONFIGURAR VARIÁVEIS DE AMBIENTE**

```bash
# Criar arquivo .env.production
cat > .env.production << 'EOF'
VITE_SUPABASE_URL=https://aopbzryufcpsawaweico.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvcGJ6cnl1ZmNwc2F3YXdlaWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxODY1MTQsImV4cCI6MjA0NDc2MjUxNH0.IuHNrFjyv8qC4apc4_YJ7kNlKNJ2_tLmOagygTI5SoA
EOF

# Verificar se foi criado
cat .env.production
```

---

### **PASSO 5: FAZER BUILD**

```bash
# Build de produção
npm run build

# Verificar se dist foi criado
ls -la dist/
```

**Aguarde:** Build pode demorar 10-20 segundos.

---

### **PASSO 6: CONFIGURAR NGINX**

```bash
# Criar configuração do site
cat > /etc/nginx/sites-available/metricai-fzia << 'EOF'
server {
    listen 80;
    server_name metricai.fzia.store;

    root /var/www/metricai-fzia/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Ativar site
ln -s /etc/nginx/sites-available/metricai-fzia /etc/nginx/sites-enabled/

# Remover site padrão
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t

# Reiniciar Nginx
systemctl restart nginx
systemctl enable nginx
systemctl status nginx
```

**Deve mostrar:** `Active: active (running)`

---

### **PASSO 7: INSTALAR SSL (HTTPS)**

```bash
# Instalar certificado SSL
certbot --nginx -d metricai.fzia.store --non-interactive --agree-tos -m fbapaes@gmail.com --redirect
```

**Aguarde:** 30-60 segundos.

---

### **PASSO 8: CRIAR ÍNDICES NO BANCO**

```bash
cd /var/www/metricai-fzia

# Criar arquivo com URL do banco
cat > scripts/dburl.txt << 'EOF'
postgresql://postgres:Agwfz9ExN6hpTjmp@db.aopbzryufcpsawaweico.supabase.co:5432/postgres
EOF

# Executar script de índices
node scripts/add-indexes.mjs

# Atualizar credenciais
node scripts/update-admin-credentials.mjs
```

**Saída esperada:**
```
✅ Índices criados com sucesso!
✅ Credenciais atualizadas!
```

---

### **PASSO 9: ATUALIZAR DNS**

**No painel do domínio fzia.store:**

1. Acesse as configurações de DNS
2. Encontre o registro A: `metricai`
3. Altere o valor de `5.161.180.119` para `147.79.106.55`
4. Salve

**Configuração DNS:**
```
Tipo: A
Nome: metricai
Valor: 147.79.106.55
TTL: 3600
```

**Aguarde:** 5-30 minutos para propagação.

---

### **PASSO 10: TESTAR**

Após atualizar o DNS, aguarde alguns minutos e teste:

```bash
# Na VPS, verificar se está rodando
systemctl status nginx
curl -I http://localhost
```

**No navegador:**
1. Acesse: https://metricai.fzia.store
2. Login: `fbapaes@gmail.com`
3. Senha: `1337Kids!`

**Testes:**
- ✅ Site carrega
- ✅ HTTPS funcionando (cadeado verde)
- ✅ Login funciona
- ✅ Settings carrega
- ✅ Dashboard carrega

---

### **PASSO 11: DESATIVAR VPS ANTIGA (OPCIONAL)**

**Apenas após confirmar que tudo funciona:**

Conecte na VPS antiga (5.161.180.119):
```bash
systemctl stop nginx
systemctl disable nginx
```

Ou cancele o serviço da VPS antiga no painel do provedor.

---

## 📋 CHECKLIST DE MIGRAÇÃO

- [ ] Conectado na nova VPS (147.79.106.55)
- [ ] Node.js, Nginx, Git instalados
- [ ] Projeto clonado do GitHub
- [ ] Branch `metricai-config-personalizacao` ativa
- [ ] `npm install` executado
- [ ] `.env.production` criado
- [ ] `npm run build` executado
- [ ] Nginx configurado
- [ ] SSL instalado (Certbot)
- [ ] Índices criados no banco
- [ ] Credenciais atualizadas
- [ ] DNS atualizado (147.79.106.55)
- [ ] Site acessível via HTTPS
- [ ] Login funcionando
- [ ] VPS antiga desativada

---

## 🆘 TROUBLESHOOTING

### Erro no npm install:
```bash
cd /var/www/metricai-fzia
rm -rf node_modules package-lock.json
npm install
```

### Nginx não inicia:
```bash
nginx -t
systemctl status nginx
tail -f /var/log/nginx/error.log
```

### SSL não funciona:
```bash
certbot certificates
certbot --nginx -d metricai.fzia.store --force-renewal
```

### DNS não propaga:
```bash
# Verificar DNS
nslookup metricai.fzia.store
dig metricai.fzia.store

# Pode demorar até 30 minutos
```

### Site não carrega:
```bash
# Verificar se build existe
ls -la /var/www/metricai-fzia/dist/

# Verificar logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## 🔥 COMANDOS ÚTEIS

```bash
# Ver status do Nginx
systemctl status nginx

# Reiniciar Nginx
systemctl restart nginx

# Ver logs em tempo real
tail -f /var/log/nginx/error.log

# Testar configuração Nginx
nginx -t

# Ver certificados SSL
certbot certificates

# Renovar SSL
certbot renew

# Ver processos Node
ps aux | grep node
```

---

## ✅ MIGRAÇÃO CONCLUÍDA!

Após seguir todos os passos:
- ✅ Site rodando na nova VPS (147.79.106.55)
- ✅ HTTPS funcionando
- ✅ Banco de dados conectado
- ✅ Todas as funcionalidades operacionais

**URL Final:** https://metricai.fzia.store

**Credenciais:**
- Email: fbapaes@gmail.com
- Senha: 1337Kids!

---

## 📞 SUPORTE

Se algo der errado:
1. Verifique os logs: `tail -f /var/log/nginx/error.log`
2. Verifique o status: `systemctl status nginx`
3. Teste a configuração: `nginx -t`
4. Verifique o DNS: `nslookup metricai.fzia.store`
