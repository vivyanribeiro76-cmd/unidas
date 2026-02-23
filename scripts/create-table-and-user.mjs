import pg from 'pg'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
const { Client } = pg

async function main() {
  let DATABASE_URL = 'postgresql://postgres:Agwfz9ExN6hpTjmp@db.aopbzryufcpsawaweico.supabase.co:5432/postgres'
  
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await client.connect()
  
  try {
    console.log('🔧 Criando tabela assistant_settings_duplicado...')
    
    // Criar tabela
    await client.query(`
      CREATE TABLE IF NOT EXISTS assistant_settings_duplicado (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        client_id TEXT NOT NULL,
        observacoes JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)
    
    // Criar índice
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_assistant_settings_duplicado_client_id 
      ON assistant_settings_duplicado(client_id);
    `)
    
    // Habilitar RLS
    await client.query(`
      ALTER TABLE assistant_settings_duplicado ENABLE ROW LEVEL SECURITY;
    `)
    
    // Remover policies antigas se existirem
    await client.query(`
      DROP POLICY IF EXISTS "Authenticated users can view assistant_settings_duplicado" ON assistant_settings_duplicado;
      DROP POLICY IF EXISTS "Authenticated users can insert assistant_settings_duplicado" ON assistant_settings_duplicado;
      DROP POLICY IF EXISTS "Authenticated users can update assistant_settings_duplicado" ON assistant_settings_duplicado;
      DROP POLICY IF EXISTS "Authenticated users can delete assistant_settings_duplicado" ON assistant_settings_duplicado;
    `)
    
    // Criar policies
    await client.query(`
      CREATE POLICY "Authenticated users can view assistant_settings_duplicado"
      ON assistant_settings_duplicado FOR SELECT TO authenticated USING (true);
      
      CREATE POLICY "Authenticated users can insert assistant_settings_duplicado"
      ON assistant_settings_duplicado FOR INSERT TO authenticated WITH CHECK (true);
      
      CREATE POLICY "Authenticated users can update assistant_settings_duplicado"
      ON assistant_settings_duplicado FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
      
      CREATE POLICY "Authenticated users can delete assistant_settings_duplicado"
      ON assistant_settings_duplicado FOR DELETE TO authenticated USING (true);
    `)
    
    console.log('✅ Tabela assistant_settings_duplicado criada com sucesso!')
    
    // Criar usuário de teste
    console.log('\n🔧 Criando usuário de teste...')
    const email = 'admin@fzia.com'
    const password = 'admin123'
    const passwordHash = await bcrypt.hash(password, 10)
    
    try {
      const result = await client.query(
        'INSERT INTO public.users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, passwordHash, 'Admin FZIA']
      )
      
      console.log('✅ Usuário criado com sucesso!')
      console.log('  Email:', result.rows[0].email)
      console.log('  Nome:', result.rows[0].name)
      console.log('  ID:', result.rows[0].id)
    } catch (e) {
      if (e.code === '23505') {
        console.log('ℹ️  Usuário admin@fzia.com já existe')
      } else {
        throw e
      }
    }
    
    console.log('\n✅ Setup completo!')
    console.log('\n📝 Credenciais de acesso:')
    console.log('  Email: admin@fzia.com')
    console.log('  Senha: admin123')
    console.log('\n🚀 Execute: npm run dev')
    console.log('📍 Acesse: http://localhost:5173')
    
  } catch (e) {
    console.error('❌ Erro:', e.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
