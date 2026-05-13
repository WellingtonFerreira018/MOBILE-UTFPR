# Aula 11 – Hardware Mobile: Câmera

## Objetivo
Compreender como utilizar a câmera do dispositivo em aplicações React Native para capturar
imagens e manipular arquivos de mídia, usando `expo-image-picker`.

---

## Arquivos criados nesta aula

| Arquivo | Responsabilidade |
|---|---|
| `src/screens/camera-lesson-screen.tsx` | Tela com 3 abas: Câmera, Galeria e Conceitos |

---

## Conexão com a aula anterior

Na **Aula 10 (GPS & Mapas)** aprendemos a:
- Solicitar permissões de hardware (foreground location)
- Capturar dados do dispositivo via API assíncrona

Agora aplicamos o **mesmo padrão** para a câmera: permissão → captura → exibição.

---

## Fluxo de dados

```
expo-image-picker
       ↕
CameraLessonScreen
  ├── Aba Câmera  → launchCameraAsync()
  ├── Aba Galeria → launchImageLibraryAsync()
  └── Aba Conceitos → cards educativos
```

---

## Instalação da dependência

```bash
npx expo install expo-image-picker
```

---

## Permissões necessárias

### iOS (`app.json` / `Info.plist`)
```json
"infoPlist": {
  "NSCameraUsageDescription": "Precisamos da câmera para capturar fotos.",
  "NSPhotoLibraryUsageDescription": "Precisamos acessar suas fotos."
}
```

### Android (`app.json`)
```json
"permissions": ["CAMERA", "READ_MEDIA_IMAGES"]
```

> O Expo SDK 54 gerencia essas permissões automaticamente via `app.json`. Em Development
> Build, é necessário configurar manualmente.

---

## APIs demonstradas

### Passo 1 – Solicitar permissão de câmera
```typescript
const { granted } = await ImagePicker.requestCameraPermissionsAsync()
```

### Passo 2 – Solicitar permissão de galeria
```typescript
const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync()
```

### Passo 3 – Capturar foto com a câmera
```typescript
const result = await ImagePicker.launchCameraAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
})

if (!result.canceled) {
  const { uri, width, height, mimeType } = result.assets[0]
}
```

### Passo 4 – Selecionar da galeria
```typescript
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  quality: 0.8,
})

if (!result.canceled) {
  const uri = result.assets[0].uri
}
```

### Passo 5 – Exibir imagem na UI
```typescript
<Image
  source={{ uri: imageUri }}
  style={{ width: '100%', height: 220, borderRadius: 12 }}
  resizeMode="cover"
/>
```

---

## Objeto de resposta (`result.assets[0]`)

| Propriedade | Tipo | Descrição |
|---|---|---|
| `uri` | `string` | Caminho do arquivo no cache do dispositivo |
| `width` | `number` | Largura da imagem em pixels |
| `height` | `number` | Altura da imagem em pixels |
| `mimeType` | `string` | Formato (`image/jpeg`, `image/png`) |
| `fileSize` | `number?` | Tamanho do arquivo em bytes |
| `exif` | `object?` | Metadados da câmera (Make, Model, GPS…) |

---

## Boas práticas demonstradas

| Prática | Motivo |
|---|---|
| Verificar `!result.canceled` | Evita erro ao acessar `assets[0]` quando usuário cancela |
| Solicitar permissão just-in-time | Melhor UX: pedir no momento do uso |
| Tratar negação com `Alert` + link de configurações | Guia o usuário sem deixá-lo preso |
| Comprimir com `quality: 0.8` | Reduz uso de memória e tempo de upload |
| Usar `try/catch` nas chamadas assíncronas | Captura falhas de hardware (câmera indisponível) |

---

## expo-image-picker vs expo-camera

| | `expo-image-picker` | `expo-camera` |
|---|---|---|
| **Interface** | Nativa do SO | Componente React customizável |
| **Controle** | Básico | Zoom, foco, flash, HDR |
| **Complexidade** | Simples | Avançado |
| **Expo Go** | ✅ Funciona | ⚠️ Requer Development Build |
| **Uso recomendado** | Maioria dos apps | Apps de câmera dedicados |

---

## URI Temporária vs Persistente

```
Captura → URI temporária (cache) → pode ser apagada pelo SO
                 ↓
     expo-file-system.copyAsync()
                 ↓
         URI persistente (documentDirectory)
```

```typescript
import * as FileSystem from 'expo-file-system'

const destino = FileSystem.documentDirectory + 'minha-foto.jpg'
await FileSystem.copyAsync({ from: uri, to: destino })
```

---

## Exercícios sugeridos

1. **Básico:** Exibir a data/hora da captura junto com os metadados da imagem.
2. **Intermediário:** Permitir que o usuário escolha entre câmera e galeria via um `ActionSheet` ou `Alert`.
3. **Avançado:** Usar `expo-file-system` para salvar a imagem permanentemente e listá-las em um histórico com `FlatList`.

---

## Referências

- [expo-image-picker – Expo Docs](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [expo-camera – Expo Docs](https://docs.expo.dev/versions/latest/sdk/camera/)
- [expo-file-system – Expo Docs](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [Image – React Native Docs](https://reactnative.dev/docs/image)
