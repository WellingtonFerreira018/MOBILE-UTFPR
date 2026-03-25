# 🚀 Guia Rápido - Arquitetura do Projeto

## 📱 O que foi criado?

Uma aplicação React Native completa com **arquitetura profissional**, mantendo os exemplos da aula anterior e adicionando novas funcionalidades.

---

## 🎯 Estrutura Criada

```
my-app/
├── src/
│   ├── components/          # 5 componentes reutilizáveis
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── error-message.tsx
│   │   ├── loading.tsx
│   │   └── tab-navigation.tsx
│   │
│   ├── hooks/              # 1 hook customizado
│   │   └── use-fetch.ts
│   │
│   ├── screens/            # 3 telas
│   │   ├── examples-screen.tsx
│   │   ├── home-screen.tsx
│   │   └── users-screen.tsx
│   │
│   └── services/           # 2 serviços
│       ├── api.ts
│       └── analytics-service.ts
│
├── components/Aula 03/     # Exemplos da aula anterior (mantidos)
└── App.tsx                 # App principal com navegação
```

---

## 🔥 Principais Recursos

### ✅ **Integração com API**
- Consome JSONPlaceholder API
- Lista de posts e usuários
- Pull-to-refresh
- Loading e error states

### ✅ **Arquitetura Limpa**
- Separação de responsabilidades
- Componentes reutilizáveis
- Services isolados
- Custom hooks

### ✅ **Analytics (Simulado)**
- Tracking de eventos
- Visualização de telas
- Ações do usuário
- Logs estruturados

### ✅ **TypeScript**
- Tipagem forte em tudo
- Interfaces bem definidas
- Autocompletar no IDE

### ✅ **Navegação por Tabs**
- 3 abas: Exemplos, Posts, Usuários
- Navegação simples sem biblioteca externa

---

## 🎓 Como Usar em Sala de Aula

### **Demonstração Progressiva:**

1. **Mostre a estrutura de pastas** (`src/`)
2. **Explique o fluxo de dados** (Screen → Hook → Service → API)
3. **Demonstre componentes reutilizáveis** (Card, Button, Loading)
4. **Mostre o hook customizado** (useFetch)
5. **Explique os services** (api.ts e analytics)

### **Pontos-chave para destacar:**

- ✨ **Separação de responsabilidades** - cada arquivo tem um propósito
- ✨ **Reutilização** - componentes usados em múltiplas telas
- ✨ **Testabilidade** - código desacoplado é fácil de testar
- ✨ **Manutenibilidade** - fácil encontrar e modificar código
- ✨ **Escalabilidade** - estrutura suporta crescimento

---

## 📊 Fluxo de Dados Simplificado

```
1. Usuário abre tela (Screen)
2. Screen usa hook useFetch
3. useFetch chama apiService
4. apiService faz requisição HTTP
5. Dados voltam para Screen
6. Screen renderiza com componentes
```

---

## 🔍 Arquivos Principais

### **`src/services/api.ts`**
Cliente Axios configurado com interceptors e funções tipadas.

```typescript
const posts = await apiService.getPosts();
const users = await apiService.getUsers();
```

### **`src/hooks/use-fetch.ts`**
Hook que gerencia loading, error e data automaticamente.

```typescript
const { data, loading, error, refetch } = useFetch(
  () => apiService.getPosts(),
  []
);
```

### **`src/components/card.tsx`**
Componente reutilizável para exibir conteúdo.

```typescript
<Card title="Título" subtitle="Subtítulo" onPress={handlePress}>
  <Text>Conteúdo</Text>
</Card>
```

### **`src/screens/home-screen.tsx`**
Tela completa que integra tudo.

---

## 🎨 Padrões de Design

### **1. Container/Presentational**
- **Screens** = Containers (lógica)
- **Components** = Presentational (UI)

### **2. Custom Hooks**
- Extrai lógica reutilizável
- Facilita testes

### **3. Service Layer**
- Isola integrações externas
- Facilita mocks em testes

---

## 💡 Exercícios Sugeridos

### **Nível Básico:**
1. Adicionar novo componente `Badge`
2. Criar variante de botão `danger`
3. Modificar cores do tema

### **Nível Intermediário:**
1. Adicionar tela de comentários (`/comments`)
2. Criar hook `useDebounce`
3. Implementar busca/filtro

### **Nível Avançado:**
1. Adicionar Context API para tema
2. Implementar cache de dados
3. Criar tela de detalhes com navegação

---

## 🚀 Como Executar

```bash
# Instalar dependências (já feito)
npm install

# Iniciar
npm start

# Executar em plataforma
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

---

## 📱 Navegação no App

O app tem **3 abas** na parte inferior:

1. **🎓 Exemplos** - Exemplos da aula anterior (JSX, Props, etc)
2. **📱 Posts** - Lista de posts da API com pull-to-refresh
3. **👥 Usuários** - Lista de usuários da API

---

## 🔧 Tecnologias Utilizadas

- **React Native** - Framework mobile
- **TypeScript** - Tipagem estática
- **Axios** - Cliente HTTP
- **Expo** - Toolchain de desenvolvimento
- **JSONPlaceholder** - API fake para testes

---

## 📚 Documentação Completa

- `README-ARQUITETURA.md` - Documentação detalhada da arquitetura
- `src/README.md` - Explicação da estrutura do `src/`
- `README-AULA.md` - Documentação dos exemplos da aula anterior

---

## ✅ Checklist de Boas Práticas

- [x] Código tipado com TypeScript
- [x] Componentes reutilizáveis
- [x] Separação de responsabilidades
- [x] Hooks customizados
- [x] Services isolados
- [x] Error handling
- [x] Loading states
- [x] Pull-to-refresh
- [x] Analytics tracking
- [x] Código documentado
- [x] Estrutura escalável

---

## 🎯 Principais Aprendizados

1. **Organização importa** - Estrutura clara = código fácil de manter
2. **Separação de responsabilidades** - Cada arquivo faz uma coisa
3. **Reutilização** - Componentes/hooks economizam tempo
4. **Tipagem** - TypeScript previne bugs
5. **Arquitetura** - Pensar antes de codificar

---

**Pronto para usar em sala de aula!** 🎓

Para dúvidas, consulte a documentação completa em `README-ARQUITETURA.md`.
