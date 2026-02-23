# Deploy FZ.IA Dashboard Duplicado na VPS

## 📋 Pré-requisitos na VPS

- Ubuntu/Debian Linux
- Node.js 18+ instalado
- Nginx instalado
- PM2 instalado globalmente (`npm install -g pm2`)
- Git instalado
- Acesso SSH à VPS

---

## 🚀 Passo a Passo Completo

### 1️⃣ Conectar na VPS via SSH

```bash
ssh usuario@ip-da-vps
```

### 2️⃣ Instalar dependências necessárias (se ainda não tiver)

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar Nginx
sudo apt install -y nginx

# Instalar Git
sudo apt install -y git
```

### 3️⃣ Clonar o repositório

```bash
# Ir para o diretório de aplicações
cd /var/www

# Clonar o repositório
sudo git clone https://github.com/vivyanribeiro76-cmd/unidas.git fzia-duplicado

# Dar permissões
sudo chown -R $USER:$USER /var/www/fzia-duplicado
cd /var/www/fzia-duplicado
```

### 4️⃣ Instalar dependências do projeto

```bash
npm install
```

### 5️⃣ Configurar variáveis de ambiente

```bash
# Criar arquivo .env.local
nano .env.local
```

**Conteúdo do .env.local:**
```env
VITE_SUPABASE_URL=https://aopbzryufcpsawaweico.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
```

Salvar: `Ctrl+O`, Enter, `Ctrl+X`

### 6️⃣ Criar tabelas no Supabase (IMPORTANTE!)

```bash
# Executar script para criar todas as tabelas duplicadas
node scripts/create-all-tables-duplicado.mjs
```

**Isso criará:**
- `users_duplicado`
- `assistant_settings_duplicado`
- `conversations_duplicado`
- `contabilizacao_duplicado`
- Usuário admin (admin@fzia.com / admin123)

### 7️⃣ Build do projeto para produção

```bash
npm run build
```

Isso criará a pasta `dist/` com os arquivos otimizados.

### 8️⃣ Configurar Nginx

```bash
# Criar arquivo de configuração do Nginx
sudo nano /etc/nginx/sites-available/fzia-duplicado
```

**Conteúdo do arquivo:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;  # Substitua pelo seu domínio ou IP

    root /var/www/fzia-duplicado/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

Salvar: `Ctrl+O`, Enter, `Ctrl+X`

### 9️⃣ Ativar configuração do Nginx

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/fzia-duplicado /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Se OK, reiniciar Nginx
sudo systemctl restart nginx
```

### 🔟 Configurar SSL com Certbot (OPCIONAL mas recomendado)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com
```

---

## ✅ Verificar se está funcionando

1. Acesse no navegador: `http://seu-dominio.com` ou `http://ip-da-vps`
2. Faça login com:
   - Email: `admin@fzia.com`
   - Senha: `admin123`

---

## 🔄 Atualizações futuras

Quando fizer alterações no código e quiser atualizar na VPS:

```bash
# Conectar na VPS
ssh usuario@ip-da-vps

# Ir para o diretório do projeto
cd /var/www/fzia-duplicado

# Puxar últimas alterações
git pull origin main

# Instalar novas dependências (se houver)
npm install

# Rebuild
npm run build

# Reiniciar Nginx (se necessário)
sudo systemctl restart nginx
```

---

## 📊 Tabelas do Supabase

O projeto usa as seguintes tabelas **independentes**:

- `users_duplicado` - Usuários do sistema
- `assistant_settings_duplicado` - Configurações
- `conversations_duplicado` - Conversas
- `contabilizacao_duplicado` - Dados do dashboard (mensagens, telefones, etc)

**Todas com RLS (Row Level Security) habilitado e políticas configuradas.**

---

## 🆘 Troubleshooting

### Erro 502 Bad Gateway
- Verifique se o Nginx está rodando: `sudo systemctl status nginx`
- Verifique logs: `sudo tail -f /var/log/nginx/error.log`

### Página em branco
- Verifique se o build foi feito: `ls -la dist/`
- Verifique permissões: `sudo chown -R www-data:www-data /var/www/fzia-duplicado/dist`

### Erro de conexão com Supabase
- Verifique se o `.env.local` está correto
- Verifique se as tabelas foram criadas no Supabase
- Verifique as credenciais do Supabase

### Não consegue fazer login
- Verifique se o script `create-all-tables-duplicado.mjs` foi executado
- Verifique se o usuário admin foi criado na tabela `users_duplicado`

---

## 📝 Notas Importantes

1. **Não commite o arquivo `.env.local`** - ele contém credenciais sensíveis
2. **Sempre faça backup do banco de dados** antes de atualizações
3. **Use HTTPS em produção** - configure SSL com Certbot
4. **Monitore os logs** do Nginx para identificar problemas

---

## 🔐 Segurança

- Altere a senha do usuário admin após o primeiro login
- Configure firewall (UFW) na VPS
- Mantenha o sistema atualizado
- Use SSL/HTTPS em produção
- Não exponha credenciais do Supabase

---

## 📞 Suporte

Em caso de dúvidas ou problemas, verifique:
- Logs do Nginx: `/var/log/nginx/error.log`
- Console do navegador (F12)
- Supabase Dashboard para verificar tabelas e dados
