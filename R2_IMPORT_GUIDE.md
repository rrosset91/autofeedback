# Guia de Importação Completa do R2

## Objetivo
Importar TODOS os dados de carros europeus do bucket R2 `cardataapi` para o banco D1.

## Passo a Passo

### 1️⃣ Descobrir a estrutura do R2

Primeiro, precisamos saber como os dados estão organizados no bucket. Execute:

```bash
# Método 1: Usando a API do R2 (se disponível)
# Você pode acessar via dashboard Cloudflare → R2 → cardataapi → Browse

# Método 2: Se os arquivos estão públicos ou conhecidos
# Tente baixar com caminhos comuns:

wrangler r2 object get cardataapi/europe.json --file=data/europe.json
# ou
wrangler r2 object get cardataapi/brands.json --file=data/brands.json
# ou  
wrangler r2 object get cardataapi/europe/brands.json --file=data/brands.json
```

**🔍 O que procuramos:**
- Arquivo JSON com todas as marcas europeias
- Arquivo JSON com todos os modelos europeus
- Ou um único arquivo com tudo

### 2️⃣ Baixar os dados

Quando descobrir o caminho correto, baixe:

```bash
# Criar pasta data
mkdir data

# Baixar (ajuste o caminho conforme necessário)
wrangler r2 object get cardataapi/[CAMINHO_CORRETO] --file=data/europe-brands.json
wrangler r2 object get cardataapi/[CAMINHO_CORRETO] --file=data/europe-models.json
```

### 3️⃣ Converter JSON para SQL

Execute o script que criei:

```bash
node scripts/import-r2-to-d1.js
```

Isso vai:
- Ler os arquivos JSON baixados
- Gerar um arquivo SQL com todos os INSERT
- Salvar em `data/europe-import.sql`

### 4️⃣ Importar para D1

```bash
# Limpar dados de seed (opcional)
npx wrangler d1 execute autofeedback-db --remote --command="DELETE FROM models; DELETE FROM brands;"

# Importar dados completos
npx wrangler d1 execute autofeedback-db --remote --file=data/europe-import.sql
```

### 5️⃣ Verificar

```bash
# Contar marcas
npx wrangler d1 execute autofeedback-db --remote --command="SELECT COUNT(*) as total FROM brands"

# Contar modelos
npx wrangler d1 execute autofeedback-db --remote --command="SELECT COUNT(*) as total FROM models"

# Ver algumas marcas
npx wrangler d1 execute autofeedback-db --remote --command="SELECT name FROM brands ORDER BY name LIMIT 20"
```

---

## 📋 Formato Esperado dos Dados

### brands.json
```json
[
  {
    "id": 1,
    "name": "Volkswagen",
    "slug": "volkswagen",
    "country": "Germany",
    "logo_url": "https://..."
  },
  ...
]
```

### models.json
```json
[
  {
    "id": 1,
    "brand_id": 1,
    "name": "Golf",
    "slug": "golf",
    "body_type": "Hatchback",
    "fuel_types": ["Petrol", "Diesel"],
    "production_start": 1974,
    "production_end": null
  },
  ...
]
```

---

## 🔄 Alternativa: Usar a API antiga temporariamente

Se os dados do R2 estiverem em formato diferente ou difícil de acessar, você pode:

**Opção A:** Fazer um script que use a sua API antiga para popular o D1:

```javascript
// scripts/migrate-from-api.js
const API_URL = 'https://carmodelsapi-workers.rrosset91.workers.dev';
const API_KEY = 'sua-chave';

// Buscar todas as marcas da Europa
const brands = await fetch(`${API_URL}/api/v1/brands?region=europe`, {
  headers: { 'X-API-Key': API_KEY }
}).then(r => r.json());

// Para cada marca, buscar modelos
// Gerar SQL
// Salvar em arquivo
```

**Opção B:** Exportar direto do banco que alimenta a API

Se você tem acesso ao banco original, faça um export:
```sql
-- No banco original
SELECT * FROM brands WHERE region = 'europe' INTO OUTFILE 'brands.json';
SELECT * FROM models WHERE brand_id IN (SELECT id FROM brands WHERE region = 'europe') INTO OUTFILE 'models.json';
```

---

## ❓ Preciso de mais informações

Para ajudar melhor, me diga:

1. **Como os dados estão estruturados no R2?**
   - É um arquivo por marca?
   - É um arquivo com todas as marcas + um com todos os modelos?
   - Qual o formato? JSON, CSV, SQL?

2. **Qual o caminho dos arquivos no bucket?**
   - Você pode ver isso no dashboard do Cloudflare
   - R2 → cardataapi → Browse

3. **Quantas marcas/modelos você espera?**
   - Para eu ajustar os scripts

---

## 🚀 Depois da importação

Assim que os dados estiverem no D1:

```bash
# Commit e push
git add -A
git commit -m "Import complete Europe car data from R2"
git push

# O site vai funcionar automaticamente com todos os dados!
```

---

## 📞 Me avise

Me diga como estão organizados os dados no R2 e eu crio um script específico para importar tudo! 

Ou se preferir, me passe um exemplo do JSON/estrutura e faço a conversão.
