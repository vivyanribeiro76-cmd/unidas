import pg from 'pg'
import bcrypt from 'bcryptjs'
const { Client } = pg

async function main() {
  const DATABASE_URL = 'postgresql://postgres:Agwfz9ExN6hpTjmp@db.aopbzryufcpsawaweico.supabase.co:5432/postgres'
  
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await client.connect()
  
  try {
    console.log('🔧 Criando tabelas duplicadas independentes...\n')
    
    // 1. Tabela users_duplicado
    console.log('📋 Criando users_duplicado...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS users_duplicado (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_users_duplicado_email ON users_duplicado(email);
    `)
    console.log('✅ users_duplicado criada')
    
    // 2. Tabela assistant_settings_duplicado (já existe, mas garantir)
    console.log('📋 Verificando assistant_settings_duplicado...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS assistant_settings_duplicado (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        client_id TEXT NOT NULL,
        observacoes JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_assistant_settings_duplicado_client_id 
      ON assistant_settings_duplicado(client_id);
    `)
    console.log('✅ assistant_settings_duplicado verificada')
    
    // 3. Tabela conversations_duplicado
    console.log('📋 Criando conversations_duplicado...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations_duplicado (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id TEXT NOT NULL,
        conversation_id TEXT NOT NULL,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_conversations_duplicado_client ON conversations_duplicado(client_id);
      CREATE INDEX IF NOT EXISTS idx_conversations_duplicado_started_at ON conversations_duplicado(started_at);
    `)
    console.log('✅ conversations_duplicado criada')
    
    // 4. Tabela contabilizacao_duplicado
    console.log('📋 Criando contabilizacao_duplicado...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS contabilizacao_duplicado (
        id SERIAL PRIMARY KEY,
        remotejid TEXT NOT NULL,
        mensagens TEXT,
        agendamento BOOLEAN DEFAULT false,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_contabilizacao_duplicado_remotejid ON contabilizacao_duplicado(remotejid);
      CREATE INDEX IF NOT EXISTS idx_contabilizacao_duplicado_timestamp ON contabilizacao_duplicado(timestamp);
    `)
    console.log('✅ contabilizacao_duplicado criada')
    
    // 5. Habilitar RLS em todas as tabelas
    console.log('\n🔒 Habilitando RLS...')
    await client.query(`
      ALTER TABLE users_duplicado ENABLE ROW LEVEL SECURITY;
      ALTER TABLE assistant_settings_duplicado ENABLE ROW LEVEL SECURITY;
      ALTER TABLE conversations_duplicado ENABLE ROW LEVEL SECURITY;
      ALTER TABLE contabilizacao_duplicado ENABLE ROW LEVEL SECURITY;
    `)
    
    // 6. Criar policies
    console.log('🔐 Criando políticas RLS...')
    
    // Policies para users_duplicado
    await client.query(`
      DROP POLICY IF EXISTS "public read users_duplicado" ON users_duplicado;
      CREATE POLICY "public read users_duplicado" ON users_duplicado
        FOR SELECT USING (true);
    `)
    
    // Policies para assistant_settings_duplicado
    await client.query(`
      DROP POLICY IF EXISTS "Authenticated users can view assistant_settings_duplicado" ON assistant_settings_duplicado;
      DROP POLICY IF EXISTS "Authenticated users can insert assistant_settings_duplicado" ON assistant_settings_duplicado;
      DROP POLICY IF EXISTS "Authenticated users can update assistant_settings_duplicado" ON assistant_settings_duplicado;
      DROP POLICY IF EXISTS "Authenticated users can delete assistant_settings_duplicado" ON assistant_settings_duplicado;
      
      CREATE POLICY "Authenticated users can view assistant_settings_duplicado"
        ON assistant_settings_duplicado FOR SELECT TO authenticated USING (true);
      CREATE POLICY "Authenticated users can insert assistant_settings_duplicado"
        ON assistant_settings_duplicado FOR INSERT TO authenticated WITH CHECK (true);
      CREATE POLICY "Authenticated users can update assistant_settings_duplicado"
        ON assistant_settings_duplicado FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
      CREATE POLICY "Authenticated users can delete assistant_settings_duplicado"
        ON assistant_settings_duplicado FOR DELETE TO authenticated USING (true);
    `)
    
    // Policies para conversations_duplicado
    await client.query(`
      DROP POLICY IF EXISTS "public read conv_duplicado" ON conversations_duplicado;
      DROP POLICY IF EXISTS "public insert conv_duplicado" ON conversations_duplicado;
      
      CREATE POLICY "public read conv_duplicado" ON conversations_duplicado
        FOR SELECT USING (true);
      CREATE POLICY "public insert conv_duplicado" ON conversations_duplicado
        FOR INSERT WITH CHECK (true);
    `)
    
    // Policies para contabilizacao_duplicado
    await client.query(`
      DROP POLICY IF EXISTS "public read contabilizacao_duplicado" ON contabilizacao_duplicado;
      DROP POLICY IF EXISTS "public insert contabilizacao_duplicado" ON contabilizacao_duplicado;
      DROP POLICY IF EXISTS "public update contabilizacao_duplicado" ON contabilizacao_duplicado;
      
      CREATE POLICY "public read contabilizacao_duplicado" ON contabilizacao_duplicado
        FOR SELECT USING (true);
      CREATE POLICY "public insert contabilizacao_duplicado" ON contabilizacao_duplicado
        FOR INSERT WITH CHECK (true);
      CREATE POLICY "public update contabilizacao_duplicado" ON contabilizacao_duplicado
        FOR UPDATE USING (true);
    `)
    
    console.log('✅ Políticas RLS criadas')
    
    // 7. Criar usuário admin
    console.log('\n👤 Criando usuário admin...')
    const email = 'admin@fzia.com'
    const password = 'admin123'
    const passwordHash = await bcrypt.hash(password, 10)
    
    try {
      const result = await client.query(
        'INSERT INTO users_duplicado (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, passwordHash, 'Admin FZIA Duplicado']
      )
      console.log('✅ Usuário criado:')
      console.log('   Email:', result.rows[0].email)
      console.log('   Nome:', result.rows[0].name)
    } catch (e) {
      if (e.code === '23505') {
        console.log('ℹ️  Usuário admin@fzia.com já existe em users_duplicado')
      } else {
        throw e
      }
    }
    
    // 8. Inserir dados de exemplo em contabilizacao_duplicado
    console.log('\n📊 Inserindo dados de exemplo...')
    const now = new Date()
    const sampleData = []
    
    // Criar 30 registros de exemplo nos últimos 7 dias
    for (let i = 0; i < 30; i++) {
      const daysAgo = Math.floor(Math.random() * 7)
      const timestamp = new Date(now)
      timestamp.setDate(timestamp.getDate() - daysAgo)
      timestamp.setHours(Math.floor(Math.random() * 24))
      
      sampleData.push({
        remotejid: `5511${Math.floor(Math.random() * 900000000 + 100000000)}@s.whatsapp.net`,
        mensagens: `Mensagem de exemplo ${i + 1}`,
        agendamento: Math.random() > 0.7,
        timestamp: timestamp.toISOString()
      })
    }
    
    for (const data of sampleData) {
      await client.query(
        'INSERT INTO contabilizacao_duplicado (remotejid, mensagens, agendamento, timestamp) VALUES ($1, $2, $3, $4)',
        [data.remotejid, data.mensagens, data.agendamento, data.timestamp]
      )
    }
    console.log(`✅ ${sampleData.length} registros de exemplo inseridos`)
    
    console.log('\n✅ SETUP COMPLETO!')
    console.log('\n📝 Credenciais de acesso:')
    console.log('   Email: admin@fzia.com')
    console.log('   Senha: admin123')
    console.log('\n📊 Tabelas criadas:')
    console.log('   • users_duplicado')
    console.log('   • assistant_settings_duplicado')
    console.log('   • conversations_duplicado')
    console.log('   • contabilizacao_duplicado')
    console.log('\n🚀 Próximos passos:')
    console.log('   1. Atualizar código para usar as novas tabelas')
    console.log('   2. Reiniciar o servidor: npm run dev')
    console.log('   3. Acessar: http://localhost:5173')
    
  } catch (e) {
    console.error('❌ Erro:', e.message)
    console.error(e)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
