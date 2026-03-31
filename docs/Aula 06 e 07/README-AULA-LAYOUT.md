# 🎯 Aula: Layout Mobile com Flexbox

Esta aula ensina como estruturar interfaces mobile utilizando Flexbox e os principais componentes do React Native.

---

## 🎓 Objetivos da Aula

### **Objetivo Geral**

Compreender como estruturar interfaces mobile utilizando Flexbox e os principais componentes do React Native.

### **Objetivos Específicos**

Ao final da aula, os alunos deverão ser capazes de:

- Entender o funcionamento do Flexbox no React Native
- Utilizar propriedades de layout (direção, alinhamento e distribuição)
- Construir interfaces utilizando View, Text, Image, Pressable e ScrollView
- Organizar elementos na tela de forma responsiva
- Aplicar boas práticas de estruturação visual
- Relacionar layout com experiência do usuário (UX)

---

## 🔁 Conexão com Aula Anterior

### **Retomar rapidamente:**

- Conceito de estado (state)
- Atualização de interface baseada em dados
- Componentização

### **🔄 Transição:**

> "Na aula passada vimos como os dados controlam a interface. Agora vamos entender como organizar visualmente essa interface na tela, estruturando layouts de forma profissional."

---

## 📚 Conteúdo Programático

### **1. Introdução ao Layout Mobile**

**Diferença entre Web e Mobile:**

- **Web**: Layout baseado em CSS com múltiplos sistemas (Grid, Flexbox, Float)
- **Mobile**: Layout baseado exclusivamente em Flexbox

**Layout em React Native:**

- Baseado em Flexbox
- Tudo é componente
- Estrutura em árvore

**📌 Ideia-chave:** Layout bem estruturado melhora usabilidade

---

### **2. Fundamentos do Flexbox**

#### **flexDirection**

Define a direção principal dos elementos:

```typescript
// column (padrão no React Native)
<View style={{ flexDirection: 'column' }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>

// row
<View style={{ flexDirection: 'row' }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>
```

#### **justifyContent**

Alinhamento no eixo principal:

- `flex-start` - início
- `center` - centro
- `flex-end` - fim
- `space-between` - espaçamento entre
- `space-around` - espaçamento ao redor
- `space-evenly` - espaçamento igual

```typescript
<View style={{
  flexDirection: 'row',
  justifyContent: 'space-between'
}}>
  <Text>Esquerda</Text>
  <Text>Direita</Text>
</View>
```

#### **alignItems**

Alinhamento no eixo cruzado:

- `flex-start` - início
- `center` - centro
- `flex-end` - fim
- `stretch` - esticar

```typescript
<View style={{
  flexDirection: 'row',
  alignItems: 'center'
}}>
  <Text>Alinhado ao centro</Text>
</View>
```

#### **flex**

Distribuição de espaço:

```typescript
<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 1 }}>
    <Text>Ocupa 1 parte</Text>
  </View>
  <View style={{ flex: 2 }}>
    <Text>Ocupa 2 partes</Text>
  </View>
</View>
```

**📌 Ideia-chave:** Flex define quem ocupa mais espaço

---

### **3. Organização de Layouts**

#### **Agrupamento com View**

```typescript
// Estrutura hierárquica
<View style={styles.container}>
  <View style={styles.header}>
    <Text>Header</Text>
  </View>
  <View style={styles.content}>
    <Text>Content</Text>
  </View>
  <View style={styles.footer}>
    <Text>Footer</Text>
  </View>
</View>
```

#### **Estrutura Típica**

- **Container**: View principal com `flex: 1`
- **Header**: View com altura fixa
- **Content**: ScrollView ou View com `flex: 1`
- **Footer**: View com altura fixa

**📌 Pensar em layout como "blocos de construção"**

---

### **4. Componentes Básicos**

#### **🟦 View**

Container base para agrupar elementos:

```typescript
<View style={{
  padding: 16,
  backgroundColor: '#f0f0f0',
  borderRadius: 8
}}>
  <Text>Conteúdo aqui</Text>
</View>
```

#### **🟩 Text**

Exibição de texto com estilização:

```typescript
<Text style={{
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center'
}}>
  Título do App
</Text>
```

#### **🟨 Image**

Exibição de imagens:

```typescript
<Image
  source={{ uri: 'https://exemplo.com/imagem.jpg' }}
  style={{
    width: 100,
    height: 100,
    borderRadius: 50
  }}
  resizeMode="cover"
/>
```

#### **🟧 Pressable**

Interação do usuário (substitui TouchableOpacity):

```typescript
<Pressable
  style={({ pressed }) => [
    styles.button,
    { backgroundColor: pressed ? '#0056b3' : '#007AFF' }
  ]}
  onPress={() => console.log('Pressionado!')}
>
  <Text style={styles.buttonText}>Clique aqui</Text>
</Pressable>
```

#### **🟪 ScrollView**

Rolagem de conteúdo:

```typescript
<ScrollView
  style={styles.container}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.scrollContent}
>
  {Array.from({ length: 50 }).map((_, index) => (
    <Text key={index}>Item {index + 1}</Text>
  ))}
</ScrollView>
```

**📌 Ideia-chave:** Interfaces são compostas por poucos componentes reutilizáveis

---

### **5. Boas Práticas de Layout**

#### **✅ Evitar layouts complexos desnecessários**

```typescript
// ❌ Ruim - excesso de aninhamento
<View>
  <View>
    <View>
      <Text>Texto</Text>
    </View>
  </View>
</View>

// ✅ Bom - simplificado
<View style={styles.container}>
  <Text>Texto</Text>
</View>
```

#### **✅ Usar flex ao invés de valores fixos**

```typescript
// ❌ Ruim - valores fixos
<View style={{ marginTop: 100 }}>

// ✅ Bom - flex
<View style={{ flex: 1, justifyContent: 'center' }}>
```

#### **✅ Manter consistência visual**

- Usar espaçamentos consistentes
- Cores e fontes padronizadas
- Componentes reutilizáveis

#### **✅ Separar layout de lógica**

```typescript
// Componente de apresentação
const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

// Componente de lógica
const UserCard = ({ user }) => (
  <Card>
    <Text>{user.name}</Text>
  </Card>
);
```

---

### **6. Integração com a Prática**

#### **Construção de tela simples:**

```typescript
function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.avatar}>
          <Text>👤</Text>
        </View>
        <Text style={styles.name}>João Silva</Text>

        <View style={styles.info}>
          <Text>📧 joao@exemplo.com</Text>
          <Text>📱 (11) 99999-9999</Text>
        </View>
      </ScrollView>

      {/* Action Button */}
      <Pressable style={styles.button}>
        <Text>Editar Perfil</Text>
      </Pressable>
    </View>
  );
}
```

**📌 Aplicação direta dos conceitos de Flexbox + componentes**

---

## 🎨 Demonstração Interativa

O app inclui:

### **1. FlexboxDemo Component**

- Controles interativos para flexDirection, justifyContent, alignItems
- Visualização em tempo real do resultado
- Código CSS gerado dinamicamente

### **2. LayoutExamples Component**

- Exemplos práticos de cada componente
- Demonstração de uso com temas
- Layout completo de perfil

### **3. LayoutLessonScreen**

- Conteúdo completo da aula
- Exemplo prático de tela de perfil
- Integração com tema dark/light

---

## 📱 Arquivos Criados

```
src/
├── components/
│   ├── flexbox-demo.tsx      # Demonstração interativa do Flexbox
│   └── layout-examples.tsx  # Exemplos dos componentes básicos
├── screens/
│   └── layout-lesson-screen.tsx  # Tela principal da aula
└── README-AULA-LAYOUT.md    # Este documento
```

---

## 🎯 Principais Aprendizados

1. **Flexbox** é a base do layout no React Native
2. **View** agrupa e estrutura elementos
3. **Text** exibe conteúdo textual
4. **Pressable** detecta interações do usuário
5. **ScrollView** permite rolagem de conteúdo
6. **Layout bem estruturado** melhora a experiência do usuário

---

**UTFPR - Desenvolvimento Mobile 2026** 🚀
