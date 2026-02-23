# Script para fazer deploy na VPS direto do Windows
# Execute este script no PowerShell do Windows

# ========================================
# CONFIGURAÇÕES - EDITE AQUI
# ========================================
$VPS_USER = "root"  # ou seu usuário da VPS
$VPS_IP = "seu-ip-aqui"  # IP da sua VPS
$PROJECT_DIR = "/var/www/fzia-duplicado"
$REPO_URL = "https://github.com/vivyanribeiro76-cmd/unidas.git"

# Credenciais do Supabase
$SUPABASE_URL = "https://aopbzryufcpsawaweico.supabase.co"
$SUPABASE_ANON_KEY = "sua-chave-anon-aqui"

# ========================================
# NÃO EDITE ABAIXO DESTA LINHA
# ========================================

Write-Host "🚀 Iniciando deploy do FZ.IA Duplicado na VPS..." -ForegroundColor Green
Write-Host ""

# 1. Clonar repositório
Write-Host "📦 Clonando repositório..." -ForegroundColor Cyan
ssh ${VPS_USER}@${VPS_IP} "cd /var/www && git clone $REPO_URL fzia-duplicado 2>/dev/null || (cd $PROJECT_DIR && git pull origin main)"

# 2. Instalar dependências
Write-Host "📚 Instalando dependências..." -ForegroundColor Cyan
ssh ${VPS_USER}@${VPS_IP} "cd $PROJECT_DIR && npm install"

# 3. Criar arquivo .env.local
Write-Host "⚙️  Configurando variáveis de ambiente..." -ForegroundColor Cyan
ssh ${VPS_USER}@${VPS_IP} @"
cat > $PROJECT_DIR/.env.local << 'EOF'
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EOF
"@

# 4. Criar tabelas no Supabase
Write-Host "🗄️  Criando tabelas no Supabase..." -ForegroundColor Cyan
ssh ${VPS_USER}@${VPS_IP} "cd $PROJECT_DIR && node scripts/create-all-tables-duplicado.mjs"

# 5. Build do projeto
Write-Host "🔨 Fazendo build para produção..." -ForegroundColor Cyan
ssh ${VPS_USER}@${VPS_IP} "cd $PROJECT_DIR && npm run build"

# 6. Configurar Nginx
Write-Host "🌐 Configurando Nginx..." -ForegroundColor Cyan
ssh ${VPS_USER}@${VPS_IP} @"
cat > /etc/nginx/sites-available/fzia-duplicado << 'EOF'
server {
    listen 80;
    server_name _;

    root $PROJECT_DIR/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
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
"@

# 7. Ativar site no Nginx
Write-Host "✅ Ativando site no Nginx..." -ForegroundColor Cyan
ssh ${VPS_USER}@${VPS_IP} "ln -sf /etc/nginx/sites-available/fzia-duplicado /etc/nginx/sites-enabled/ && nginx -t && systemctl restart nginx"

Write-Host ""
Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Acesse: http://$VPS_IP" -ForegroundColor Yellow
Write-Host "🔐 Login: admin@fzia.com / admin123" -ForegroundColor Yellow
Write-Host ""
