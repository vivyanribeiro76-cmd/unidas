-- Script SQL para criar a tabela assistant_settings_duplicado no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela assistant_settings_duplicado
CREATE TABLE IF NOT EXISTS assistant_settings_duplicado (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  observacoes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para client_id
CREATE INDEX IF NOT EXISTS idx_assistant_settings_duplicado_client_id 
ON assistant_settings_duplicado(client_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE assistant_settings_duplicado ENABLE ROW LEVEL SECURITY;

-- Policy para permitir SELECT autenticado
CREATE POLICY "Authenticated users can view assistant_settings_duplicado"
ON assistant_settings_duplicado
FOR SELECT
TO authenticated
USING (true);

-- Policy para permitir INSERT autenticado
CREATE POLICY "Authenticated users can insert assistant_settings_duplicado"
ON assistant_settings_duplicado
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy para permitir UPDATE autenticado
CREATE POLICY "Authenticated users can update assistant_settings_duplicado"
ON assistant_settings_duplicado
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy para permitir DELETE autenticado
CREATE POLICY "Authenticated users can delete assistant_settings_duplicado"
ON assistant_settings_duplicado
FOR DELETE
TO authenticated
USING (true);

-- Comentários para documentação
COMMENT ON TABLE assistant_settings_duplicado IS 'Tabela duplicada para armazenar configurações do assistente de IA';
COMMENT ON COLUMN assistant_settings_duplicado.client_id IS 'Identificador do cliente (use "global" para configuração única)';
COMMENT ON COLUMN assistant_settings_duplicado.observacoes IS 'Configurações em formato JSON (personalidade, dados básicos, respostas rápidas, etc)';
