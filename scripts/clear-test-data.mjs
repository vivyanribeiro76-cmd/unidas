import pg from 'pg'
const { Client } = pg

async function main() {
  const DATABASE_URL = 'postgresql://postgres:Agwfz9ExN6hpTjmp@db.aopbzryufcpsawaweico.supabase.co:5432/postgres'
  
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await client.connect()
  
  try {
    console.log('🗑️  Limpando dados de teste...\n')
    
    // Deletar todos os registros de contabilizacao_duplicado
    const result = await client.query('DELETE FROM contabilizacao_duplicado')
    
    console.log(`✅ ${result.rowCount} registros removidos de contabilizacao_duplicado`)
    console.log('\n✅ Dados de teste limpos com sucesso!')
    console.log('\n📊 A tabela contabilizacao_duplicado está agora vazia e pronta para receber dados reais.')
    
  } catch (e) {
    console.error('❌ Erro:', e.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
