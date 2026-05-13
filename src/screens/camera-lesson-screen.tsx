import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from "react"
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { analyticsService } from "../services/analytics-service"

// ─── Tipos ───────────────────────────────────────────────────────────────────

type PermissionStatus = "unknown" | "granted" | "denied" | "requesting"

interface CapturedImage {
  uri: string
  width: number
  height: number
  type: string
  fileSize?: number
}

type ActiveTab = "camera" | "galeria" | "conceitos"

// ─── Constantes ──────────────────────────────────────────────────────────────

const PURPLE = "#5856D6"

const TABS: { key: ActiveTab; label: string; icon: string }[] = [
  { key: "camera", label: "Câmera", icon: "📷" },
  { key: "galeria", label: "Galeria", icon: "🖼️" },
  { key: "conceitos", label: "Conceitos", icon: "📚" },
]

const CONCEITOS = [
  {
    icon: "🔐",
    title: "Permissões (Camera & Media Library)",
    body: "O app precisa solicitar permissão de acesso à câmera e à galeria. No iOS: NSCameraUsageDescription e NSPhotoLibraryUsageDescription. No Android 13+: READ_MEDIA_IMAGES.",
    color: "#FF9500",
  },
  {
    icon: "📷",
    title: "expo-image-picker",
    body: "Biblioteca que fornece acesso simplificado à câmera e à galeria do dispositivo via launchCameraAsync() e launchImageLibraryAsync(). Interface nativa, sem precisar de código personalizado.",
    color: PURPLE,
  },
  {
    icon: "⚡",
    title: "launchCameraAsync()",
    body: "Abre a câmera nativa para capturar uma foto. Retorna um objeto com assets[] contendo uri, width, height e type. Suporta allowsEditing, aspect e quality.",
    color: "#007AFF",
  },
  {
    icon: "🖼️",
    title: "launchImageLibraryAsync()",
    body: "Abre a galeria de fotos do dispositivo para o usuário selecionar uma imagem. Aceita as mesmas opções de qualidade e edição que a câmera.",
    color: "#34C759",
  },
  {
    icon: "📦",
    title: "Objeto de Resposta (assets[0])",
    body: "Após captura, result.assets[0] contém: uri (caminho do arquivo), width/height (dimensões em pixels), type (image/jpeg ou image/png). Sempre verifique !result.canceled antes de acessar.",
    color: "#FF3B30",
  },
  {
    icon: "⚠️",
    title: "URIs Temporárias vs Persistentes",
    body: "A URI retornada aponta para o cache do sistema e pode ser removida. Para persistir, use expo-file-system para copiar o arquivo para um diretório permanente.",
    color: "#5856D6",
  },
]

// ─── Componente Principal ─────────────────────────────────────────────────────

export function CameraLessonScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("camera")
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus>("unknown")
  const [mediaPermission, setMediaPermission] = useState<PermissionStatus>("unknown")
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null)
  const [galleryImage, setGalleryImage] = useState<CapturedImage | null>(null)
  const [loadingCamera, setLoadingCamera] = useState(false)
  const [loadingGallery, setLoadingGallery] = useState(false)

  useEffect(() => {
    analyticsService.logScreenView("camera_lesson_screen")
    checkPermissions()
  }, [])

  // ── Permissões ─────────────────────────────────────────────────────────────

  const checkPermissions = async (): Promise<void> => {
    const cam = await ImagePicker.getCameraPermissionsAsync()
    setCameraPermission(cam.granted ? "granted" : "denied")
    const media = await ImagePicker.getMediaLibraryPermissionsAsync()
    setMediaPermission(media.granted ? "granted" : "denied")
  }

  const requestCameraPermission = async (): Promise<boolean> => {
    setCameraPermission("requesting")
    // 📌 PASSO PRINCIPAL: requestCameraPermissionsAsync
    const { granted } = await ImagePicker.requestCameraPermissionsAsync()
    setCameraPermission(granted ? "granted" : "denied")
    if (!granted) {
      Alert.alert(
        "Permissão de Câmera Negada",
        "Acesse Configurações > Privacidade > Câmera para habilitar.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Abrir Configurações", onPress: () => Linking.openSettings() },
        ]
      )
    }
    return granted
  }

  const requestMediaPermission = async (): Promise<boolean> => {
    setMediaPermission("requesting")
    // 📌 PASSO PRINCIPAL: requestMediaLibraryPermissionsAsync
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    setMediaPermission(granted ? "granted" : "denied")
    if (!granted) {
      Alert.alert(
        "Permissão de Galeria Negada",
        "Acesse Configurações > Privacidade > Fotos para habilitar.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Abrir Configurações", onPress: () => Linking.openSettings() },
        ]
      )
    }
    return granted
  }

  // ── Câmera ─────────────────────────────────────────────────────────────────

  const openCamera = async (): Promise<void> => {
    if (cameraPermission !== "granted") {
      const ok = await requestCameraPermission()
      if (!ok) return
    }
    setLoadingCamera(true)
    try {
      // 📌 CONCEITO: launchCameraAsync – abre a câmera nativa
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0]
        setCapturedImage({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.mimeType ?? "image/jpeg",
          fileSize: asset.fileSize,
        })
        analyticsService.logUserAction("camera_photo_captured")
      }
    } catch {
      Alert.alert("Erro", "Não foi possível abrir a câmera.")
    } finally {
      setLoadingCamera(false)
    }
  }

  // ── Galeria ────────────────────────────────────────────────────────────────

  const openGallery = async (): Promise<void> => {
    if (mediaPermission !== "granted") {
      const ok = await requestMediaPermission()
      if (!ok) return
    }
    setLoadingGallery(true)
    try {
      // 📌 CONCEITO: launchImageLibraryAsync – abre a galeria nativa
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0]
        setGalleryImage({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.mimeType ?? "image/jpeg",
          fileSize: asset.fileSize,
        })
        analyticsService.logUserAction("gallery_image_selected")
      }
    } catch {
      Alert.alert("Erro", "Não foi possível abrir a galeria.")
    } finally {
      setLoadingGallery(false)
    }
  }

  // ── Render: aba Câmera ─────────────────────────────────────────────────────

  const renderCameraTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Card de Permissão */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🔐 Passo 1 — Permissão de Câmera</Text>
        <Text style={styles.sectionDesc}>
          Antes de abrir a câmera, o app precisa solicitar permissão ao usuário.
          Sem ela, o sistema operacional bloqueia o acesso ao hardware.
        </Text>
        <View style={[styles.permBadge, { backgroundColor: permColor(cameraPermission) }]}>
          <Text style={styles.permBadgeText}>{permLabel(cameraPermission)}</Text>
        </View>
        {cameraPermission !== "granted" && (
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={requestCameraPermission}
            disabled={cameraPermission === "requesting"}
          >
            <Text style={styles.btnPrimaryText}>
              {cameraPermission === "requesting" ? "Solicitando..." : "Solicitar Permissão"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Card: Capturar Foto */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📷 Passo 2 — Abrir Câmera</Text>
        <Text style={styles.sectionDesc}>
          <Text style={styles.codeInline}>launchCameraAsync()</Text> abre a câmera nativa
          do dispositivo. Ao confirmar, retorna um objeto com{" "}
          <Text style={styles.codeInline}>assets[]</Text> contendo a URI e os metadados.
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeBlockText}>{"const result = await ImagePicker"}</Text>
          <Text style={styles.codeBlockText}>{"  .launchCameraAsync({"}</Text>
          <Text style={styles.codeBlockText}>{"    allowsEditing: true,"}</Text>
          <Text style={styles.codeBlockText}>{"    aspect: [4, 3],"}</Text>
          <Text style={styles.codeBlockText}>{"    quality: 0.8,"}</Text>
          <Text style={styles.codeBlockText}>{"  });"}</Text>
        </View>
        <TouchableOpacity
          style={[styles.btnPrimary, loadingCamera && styles.btnDisabled]}
          onPress={openCamera}
          disabled={loadingCamera}
        >
          <Text style={styles.btnPrimaryText}>
            {loadingCamera ? "Abrindo câmera..." : "📷 Abrir Câmera"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Card: Preview + Metadados */}
      {capturedImage && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🖼️ Passo 3 — Preview da Imagem</Text>
          <Text style={styles.sectionDesc}>
            O componente <Text style={styles.codeInline}>{"<Image>"}</Text> exibe a imagem
            usando a URI retornada. Nunca esqueça o{" "}
            <Text style={styles.codeInline}>resizeMode</Text> para controlar o enquadramento.
          </Text>

          {/* Preview */}
          <Image
            source={{ uri: capturedImage.uri }}
            style={styles.imagePreview}
            resizeMode="cover"
            accessibilityLabel="Foto capturada"
          />

          {/* Metadados */}
          <Text style={[styles.sectionTitle, { marginTop: 4 }]}>📦 Metadados Retornados</Text>
          <View style={styles.dataGrid}>
            <DataRow icon="📄" label="URI" value="file://...cache/..." color={PURPLE} />
            <DataRow
              icon="↔️"
              label="Largura"
              value={`${capturedImage.width}px`}
              color="#007AFF"
            />
            <DataRow
              icon="↕️"
              label="Altura"
              value={`${capturedImage.height}px`}
              color="#007AFF"
            />
            <DataRow
              icon="🗂️"
              label="Tipo"
              value={capturedImage.type}
              color="#34C759"
            />
            {capturedImage.fileSize != null && (
              <DataRow
                icon="💾"
                label="Tamanho"
                value={`${(capturedImage.fileSize / 1024).toFixed(1)} KB`}
                color="#FF9500"
              />
            )}
          </View>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => setCapturedImage(null)}
          >
            <Text style={styles.btnSecondaryText}>🗑️ Limpar Foto</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  )

  // ── Render: aba Galeria ────────────────────────────────────────────────────

  const renderGaleriaTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Card de Permissão */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🔐 Passo 1 — Permissão de Galeria</Text>
        <Text style={styles.sectionDesc}>
          Acessar a biblioteca de fotos requer uma permissão separada da câmera.
          No Android 13+, usa{" "}
          <Text style={styles.codeInline}>READ_MEDIA_IMAGES</Text> em vez de{" "}
          <Text style={styles.codeInline}>READ_EXTERNAL_STORAGE</Text>.
        </Text>
        <View style={[styles.permBadge, { backgroundColor: permColor(mediaPermission) }]}>
          <Text style={styles.permBadgeText}>{permLabel(mediaPermission)}</Text>
        </View>
        {mediaPermission !== "granted" && (
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={requestMediaPermission}
            disabled={mediaPermission === "requesting"}
          >
            <Text style={styles.btnPrimaryText}>
              {mediaPermission === "requesting" ? "Solicitando..." : "Solicitar Permissão"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Card: Selecionar da Galeria */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🖼️ Passo 2 — Abrir Galeria</Text>
        <Text style={styles.sectionDesc}>
          <Text style={styles.codeInline}>launchImageLibraryAsync()</Text> abre o seletor
          nativo de fotos. Aceita as mesmas opções de qualidade e edição que a câmera.
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeBlockText}>{"const result = await ImagePicker"}</Text>
          <Text style={styles.codeBlockText}>{"  .launchImageLibraryAsync({"}</Text>
          <Text style={styles.codeBlockText}>{"    mediaTypes: MediaTypeOptions.Images,"}</Text>
          <Text style={styles.codeBlockText}>{"    quality: 0.8,"}</Text>
          <Text style={styles.codeBlockText}>{"  });"}</Text>
          <Text style={styles.codeBlockText}>{"if (!result.canceled) {"}</Text>
          <Text style={styles.codeBlockText}>{"  const uri = result.assets[0].uri;"}</Text>
          <Text style={styles.codeBlockText}>{"}"}</Text>
        </View>
        <TouchableOpacity
          style={[styles.btnPrimary, loadingGallery && styles.btnDisabled]}
          onPress={openGallery}
          disabled={loadingGallery}
        >
          <Text style={styles.btnPrimaryText}>
            {loadingGallery ? "Abrindo galeria..." : "🖼️ Abrir Galeria"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Card: Preview + Metadados da Galeria */}
      {galleryImage && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>✅ Imagem Selecionada</Text>
          <Text style={styles.sectionDesc}>
            A URI retornada é <Text style={styles.bold}>temporária</Text>. Para persistir,
            use <Text style={styles.codeInline}>expo-file-system</Text> para copiar o
            arquivo para um diretório permanente.
          </Text>

          <Image
            source={{ uri: galleryImage.uri }}
            style={styles.imagePreview}
            resizeMode="cover"
            accessibilityLabel="Imagem da galeria"
          />

          <View style={styles.dataGrid}>
            <DataRow icon="📄" label="URI" value="file://...cache/..." color={PURPLE} />
            <DataRow
              icon="↔️"
              label="Largura"
              value={`${galleryImage.width}px`}
              color="#007AFF"
            />
            <DataRow
              icon="↕️"
              label="Altura"
              value={`${galleryImage.height}px`}
              color="#007AFF"
            />
            <DataRow
              icon="🗂️"
              label="Tipo"
              value={galleryImage.type}
              color="#34C759"
            />
            {galleryImage.fileSize != null && (
              <DataRow
                icon="💾"
                label="Tamanho"
                value={`${(galleryImage.fileSize / 1024).toFixed(1)} KB`}
                color="#FF9500"
              />
            )}
          </View>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => setGalleryImage(null)}
          >
            <Text style={styles.btnSecondaryText}>🗑️ Limpar Imagem</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Nota: diferença Câmera vs Galeria */}
      <View style={[styles.sectionCard, styles.noteCard]}>
        <Text style={styles.noteTitle}>📋 expo-camera vs expo-image-picker</Text>
        <Text style={styles.noteText}>
          <Text style={{ fontWeight: "700" }}>expo-image-picker</Text> (usado nesta aula)
          usa a interface nativa do sistema — simples e rápido.{"\n\n"}
          <Text style={{ fontWeight: "700" }}>expo-camera</Text> oferece controle fino
          sobre zoom, foco e flash via componente React, mas requer{" "}
          <Text style={styles.codeInline}>Development Build</Text>.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  )

  // ── Render: aba Conceitos ──────────────────────────────────────────────────

  const renderConceitosTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.conceitosIntro}>
        Revise os conceitos fundamentais da aula de Câmera:
      </Text>

      {CONCEITOS.map((c, i) => (
        <View key={i} style={[styles.conceitoCard, { borderLeftColor: c.color }]}>
          <Text style={styles.conceitoIcon}>{c.icon}</Text>
          <View style={styles.conceitoBody}>
            <Text style={[styles.conceitoTitle, { color: c.color }]}>{c.title}</Text>
            <Text style={styles.conceitoText}>{c.body}</Text>
          </View>
        </View>
      ))}

      {/* Fluxo visual */}
      <View style={styles.fluxoCard}>
        <Text style={styles.fluxoTitle}>🔁 Fluxo Completo</Text>
        {[
          { step: "1", label: "requestCameraPermissionsAsync()", desc: "Solicita permissão de câmera" },
          { step: "2", label: "launchCameraAsync()", desc: "Abre câmera e captura foto" },
          { step: "3", label: "result.assets[0]", desc: "Lê URI, width, height e type" },
          { step: "4", label: '<Image source={{ uri }} />', desc: "Exibe preview na UI" },
          { step: "5", label: "FileSystem.copyAsync()", desc: "Persiste URI em diretório permanente" },
        ].map((f, i) => (
          <View key={i} style={styles.fluxoStep}>
            <View style={styles.fluxoBadge}>
              <Text style={styles.fluxoBadgeText}>{f.step}</Text>
            </View>
            <View style={styles.fluxoInfo}>
              <Text style={styles.fluxoCode}>{f.label}</Text>
              <Text style={styles.fluxoDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  )

  // ── Render principal ───────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📷 Câmera</Text>
        <Text style={styles.headerSubtitle}>expo-image-picker · Hardware Mobile</Text>
        <View style={styles.headerStats}>
          <StatPill
            label="Câmera"
            value={cameraPermission === "granted" ? "✓" : "✗"}
            active={cameraPermission === "granted"}
          />
          <StatPill
            label="Galeria"
            value={mediaPermission === "granted" ? "✓" : "✗"}
            active={mediaPermission === "granted"}
          />
          <StatPill
            label="Foto"
            value={capturedImage ? "OK" : "—"}
            active={!!capturedImage}
          />
          <StatPill
            label="Seleção"
            value={galleryImage ? "OK" : "—"}
            active={!!galleryImage}
          />
        </View>
      </View>

      {/* Abas */}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={styles.tabIcon}>{t.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo das abas */}
      {activeTab === "camera" && renderCameraTab()}
      {activeTab === "galeria" && renderGaleriaTab()}
      {activeTab === "conceitos" && renderConceitosTab()}
    </View>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function DataRow({
  icon,
  label,
  value,
  color,
}: {
  icon: string
  label: string
  value: string
  color: string
}) {
  return (
    <View style={dataRowStyles.row}>
      <Text style={dataRowStyles.icon}>{icon}</Text>
      <Text style={dataRowStyles.label}>{label}</Text>
      <Text style={[dataRowStyles.value, { color }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  )
}

function StatPill({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <View style={[statPillStyles.pill, active && statPillStyles.pillActive]}>
      <Text style={[statPillStyles.value, active && statPillStyles.valueActive]}>{value}</Text>
      <Text style={statPillStyles.label}>{label}</Text>
    </View>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function permLabel(s: PermissionStatus): string {
  const map: Record<PermissionStatus, string> = {
    unknown: "Não verificada",
    requesting: "Solicitando...",
    granted: "✓ Permissão concedida",
    denied: "✗ Permissão negada",
  }
  return map[s]
}

function permColor(s: PermissionStatus): string {
  const map: Record<PermissionStatus, string> = {
    unknown: "#8E8E93",
    requesting: "#FF9500",
    granted: "#34C759",
    denied: "#FF3B30",
  }
  return map[s]
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },

  // Header
  header: {
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 4,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "white" },
  headerSubtitle: { fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 10 },
  headerStats: { flexDirection: "row", gap: 8, flexWrap: "wrap" },

  // Tabs
  tabs: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 2,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: PURPLE },
  tabIcon: { fontSize: 18 },
  tabLabel: { fontSize: 11, color: "#8E8E93", fontWeight: "600" },
  tabLabelActive: { color: PURPLE },

  // Tab content
  tabContent: { padding: 16, gap: 14 },

  // Section cards
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1C1C1E" },
  sectionDesc: { fontSize: 13, color: "#636366", lineHeight: 19 },
  bold: { fontWeight: "700" },
  codeInline: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    backgroundColor: "#F2F2F7",
    color: PURPLE,
    fontSize: 12,
  },

  // Permission badge
  permBadge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  permBadgeText: { color: "white", fontSize: 13, fontWeight: "600" },

  // Buttons
  btnPrimary: {
    backgroundColor: PURPLE,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  btnPrimaryText: { color: "white", fontWeight: "700", fontSize: 15 },
  btnDisabled: { opacity: 0.5 },
  btnSecondary: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: PURPLE,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  btnSecondaryText: { color: PURPLE, fontWeight: "700", fontSize: 15 },

  // Image preview
  imagePreview: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
  },

  // Data grid
  dataGrid: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    overflow: "hidden",
  },

  // Code block
  codeBlock: {
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    padding: 12,
    gap: 2,
  },
  codeBlockText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    color: "#98C379",
  },

  // Note card
  noteCard: { borderLeftWidth: 4, borderLeftColor: "#FF9500" },
  noteTitle: { fontSize: 15, fontWeight: "700", color: "#FF9500" },
  noteText: { fontSize: 13, color: "#636366", lineHeight: 19 },

  // Conceitos
  conceitosIntro: {
    fontSize: 14,
    color: "#636366",
    marginBottom: 4,
    lineHeight: 20,
  },
  conceitoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  conceitoIcon: { fontSize: 28, lineHeight: 32 },
  conceitoBody: { flex: 1, gap: 4 },
  conceitoTitle: { fontSize: 14, fontWeight: "700" },
  conceitoText: { fontSize: 13, color: "#636366", lineHeight: 18 },

  // Fluxo
  fluxoCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  fluxoTitle: { fontSize: 16, fontWeight: "700", color: "#1C1C1E", marginBottom: 4 },
  fluxoStep: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  fluxoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  fluxoBadgeText: { color: "white", fontSize: 13, fontWeight: "bold" },
  fluxoInfo: { flex: 1, gap: 2 },
  fluxoCode: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    color: PURPLE,
    backgroundColor: "#F0EEFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  fluxoDesc: { fontSize: 12, color: "#8E8E93" },
})

const dataRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5EA",
    gap: 8,
  },
  icon: { fontSize: 16, width: 22 },
  label: { flex: 1, fontSize: 13, color: "#636366", fontWeight: "500" },
  value: { fontSize: 14, fontWeight: "700", maxWidth: "55%" },
})

const statPillStyles = StyleSheet.create({
  pill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    gap: 1,
  },
  pillActive: { backgroundColor: "rgba(255,255,255,0.35)" },
  value: { fontSize: 13, fontWeight: "bold", color: "rgba(255,255,255,0.7)" },
  valueActive: { color: "white" },
  label: { fontSize: 9, color: "rgba(255,255,255,0.6)" },
})
